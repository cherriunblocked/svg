"use strict";
(() => {
  // src/lib/riptide/router/rpc.ts
  var PortRpc = class {
    port;
    handlers;
    counter = 0;
    pending = /* @__PURE__ */ new Map();
    constructor(port, handlers = {}) {
      this.port = port;
      this.handlers = handlers;
      this.port.addEventListener("message", this.onMessage);
      this.port.start();
    }
    onMessage = (e) => {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "request") {
        const handler = this.handlers[msg.method];
        if (!handler) {
          this.port.postMessage({
            type: "response",
            token: msg.token,
            error: `no handler for ${msg.method}`
          });
          return;
        }
        handler(msg.args).then(([data, transfer]) => {
          this.port.postMessage(
            { type: "response", token: msg.token, data },
            { transfer: transfer ?? [] }
          );
        }).catch((err) => {
          this.port.postMessage({
            type: "response",
            token: msg.token,
            error: err instanceof Error ? err.message : String(err)
          });
        });
      } else if (msg.type === "response") {
        const p = this.pending.get(msg.token);
        if (!p) return;
        this.pending.delete(msg.token);
        if (msg.error !== void 0) p.reject(new Error(msg.error));
        else p.resolve(msg.data);
      }
    };
    call(method, args) {
      const token = this.counter++;
      return new Promise((resolve, reject) => {
        this.pending.set(token, { resolve, reject });
        this.port.postMessage({ type: "request", token, method, args });
      });
    }
    close() {
      this.port.removeEventListener("message", this.onMessage);
      try {
        this.port.close();
      } catch {
      }
    }
  };

  // src/lib/riptide/rewrite/urlCodec.ts
  var RIPTIDE_PREFIX = "/~/rt/";
  function riptidePrefixFor(controllerId) {
    return `${RIPTIDE_PREFIX}${controllerId}/`;
  }
  function encodeRiptideUrl(controllerId, target) {
    return `${riptidePrefixFor(controllerId)}${encodeURIComponent(target)}`;
  }
  function decodeRiptidePath(pathname) {
    if (!pathname.startsWith(RIPTIDE_PREFIX)) return null;
    const rest = pathname.slice(RIPTIDE_PREFIX.length);
    const slash = rest.indexOf("/");
    if (slash === -1) return null;
    const id = rest.slice(0, slash);
    const encoded = rest.slice(slash + 1);
    try {
      return { id, target: decodeURIComponent(encoded) };
    } catch {
      return null;
    }
  }

  // src/lib/riptide/rewrite/headers.ts
  var STRIPPED_HEADERS = /* @__PURE__ */ new Set([
    "content-security-policy",
    "content-security-policy-report-only",
    "x-frame-options",
    "cross-origin-resource-policy",
    "cross-origin-opener-policy",
    "cross-origin-embedder-policy",
    "content-length",
    "content-encoding",
    "transfer-encoding"
  ]);
  function stripUnsafeHeaders(headers) {
    return headers.filter(([name]) => !STRIPPED_HEADERS.has(name.toLowerCase()));
  }
  function getHeader(headers, name) {
    const lower = name.toLowerCase();
    return headers.find(([k]) => k.toLowerCase() === lower)?.[1];
  }

  // src/lib/riptide/rewrite/htmlRewriter.ts
  var REWRITE_ATTRS = ["src", "href", "action"];
  function decodeAttrEntities(s) {
    return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }
  function shouldSkip(url) {
    const u = url.trim();
    return u === "" || u.startsWith("#") || u.startsWith("data:") || u.startsWith("blob:") || u.startsWith("javascript:") || u.startsWith("mailto:") || u.startsWith("about:");
  }
  function resolveAndEncode(controllerId, base, raw) {
    if (shouldSkip(raw)) return raw;
    const decoded = decodeAttrEntities(raw);
    try {
      const resolved = new URL(decoded, base).href;
      return encodeRiptideUrl(controllerId, resolved);
    } catch {
      return raw;
    }
  }
  function rewriteSrcset(controllerId, base, value) {
    return value.split(",").map((candidate) => {
      const trimmed = candidate.trim();
      if (!trimmed) return trimmed;
      const spaceIdx = trimmed.indexOf(" ");
      const url = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
      const descriptor = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx);
      return resolveAndEncode(controllerId, base, url) + descriptor;
    }).join(", ");
  }
  var ATTR_RE = new RegExp(
    `\\b(${REWRITE_ATTRS.join("|")})(\\s*=\\s*)(["'])(.*?)\\3`,
    "gi"
  );
  var SRCSET_RE = /\bsrcset(\s*=\s*)(["'])(.*?)\2/gi;
  function bootstrapTag(controllerId, target) {
    const payload = JSON.stringify({ id: controllerId, target: target.href });
    return `<script>window.__riptide=${payload};<\/script>`;
  }
  function rewriteHtml(html, controllerId, target) {
    let out = html.replace(ATTR_RE, (_m, attr, eq, quote, value) => {
      const rewritten = resolveAndEncode(controllerId, target, value);
      return `${attr}${eq}${quote}${rewritten}${quote}`;
    });
    out = out.replace(SRCSET_RE, (_m, eq, quote, value) => {
      const rewritten = rewriteSrcset(controllerId, target, value);
      return `srcset${eq}${quote}${rewritten}${quote}`;
    });
    const tag = bootstrapTag(controllerId, target);
    const headMatch = /<head[^>]*>/i.exec(out);
    if (headMatch) {
      const insertAt = headMatch.index + headMatch[0].length;
      return out.slice(0, insertAt) + tag + out.slice(insertAt);
    }
    return tag + out;
  }

  // src/lib/riptide/rewrite/cssRewriter.ts
  var URL_FN_RE = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
  var IMPORT_RE = /@import\s+(['"])(.*?)\1/gi;
  function shouldSkip2(url) {
    const u = url.trim();
    return u === "" || u.startsWith("data:") || u.startsWith("#") || u.startsWith("blob:");
  }
  function resolveAndEncode2(controllerId, base, raw) {
    if (shouldSkip2(raw)) return raw;
    try {
      const resolved = new URL(raw, base).href;
      return encodeRiptideUrl(controllerId, resolved);
    } catch {
      return raw;
    }
  }
  function rewriteCss(css, controllerId, target) {
    let out = css.replace(URL_FN_RE, (_m, quote, value) => {
      const rewritten = resolveAndEncode2(controllerId, target, value);
      return `url(${quote}${rewritten}${quote})`;
    });
    out = out.replace(IMPORT_RE, (_m, quote, value) => {
      const rewritten = resolveAndEncode2(controllerId, target, value);
      return `@import ${quote}${rewritten}${quote}`;
    });
    return out;
  }

  // src/lib/riptide/rewrite/decompress.ts
  var SUPPORTED = /* @__PURE__ */ new Set(["gzip", "x-gzip", "deflate"]);
  async function decompressIfNeeded(body, contentEncoding) {
    if (body == null || typeof body === "string") return body;
    const enc = (contentEncoding ?? "").toLowerCase().trim();
    if (!SUPPORTED.has(enc)) return body;
    try {
      const format = enc === "deflate" ? "deflate" : "gzip";
      const stream = new Blob([body]).stream().pipeThrough(new DecompressionStream(format));
      return await new Response(stream).arrayBuffer();
    } catch {
      return body;
    }
  }

  // src/lib/riptide/router/RiptideRouter.ts
  var controllers = /* @__PURE__ */ new Map();
  function registerController(id, port) {
    const existing = controllers.get(id);
    existing?.close();
    controllers.set(id, new PortRpc(port));
  }
  function unregisterController(id) {
    controllers.get(id)?.close();
    controllers.delete(id);
  }
  function shouldRoute(event) {
    try {
      return new URL(event.request.url).pathname.startsWith(RIPTIDE_PREFIX);
    } catch {
      return false;
    }
  }
  function isHtml(contentType) {
    return contentType.toLowerCase().includes("text/html");
  }
  function isCss(contentType) {
    return contentType.toLowerCase().includes("text/css");
  }
  async function route(event) {
    const url = new URL(event.request.url);
    const decoded = decodeRiptidePath(url.pathname);
    if (!decoded) return new Response("riptide: malformed proxied URL", { status: 400 });
    const rpc = controllers.get(decoded.id);
    if (!rpc) {
      return new Response("riptide: no active controller for this frame (reload the tab)", {
        status: 502
      });
    }
    const method = event.request.method;
    const reqHeaders = [...event.request.headers.entries()];
    const reqBody = method === "GET" || method === "HEAD" ? null : await event.request.arrayBuffer();
    let result;
    try {
      result = await rpc.call("request", {
        remote: decoded.target,
        method,
        body: reqBody,
        headers: reqHeaders
      });
    } catch (e) {
      return new Response(`riptide: transport request failed: ${e instanceof Error ? e.message : e}`, {
        status: 502
      });
    }
    const contentType = getHeader(result.headers, "content-type") ?? "";
    const originalEncoding = getHeader(result.headers, "content-encoding");
    const decompressed = await decompressIfNeeded(result.body, originalEncoding);
    const headers = stripUnsafeHeaders(result.headers);
    const target = new URL(decoded.target);
    let body;
    if ((isHtml(contentType) || isCss(contentType)) && decompressed != null) {
      const text = typeof decompressed === "string" ? decompressed : new TextDecoder().decode(decompressed);
      body = isHtml(contentType) ? rewriteHtml(text, decoded.id, target) : rewriteCss(text, decoded.id, target);
    } else {
      body = decompressed;
    }
    return new Response(body, {
      status: result.status,
      statusText: result.statusText,
      headers
    });
  }

  // src/lib/riptide/router/swEntry.ts
  self.addEventListener("message", (e) => {
    const data = e.data;
    if (data?.$riptideInit) {
      const port = e.ports[0];
      if (port) registerController(data.$riptideInit.id, port);
    } else if (data?.$riptideDispose) {
      unregisterController(data.$riptideDispose.id);
    }
  });
  self._zs3ik8x = {
    shouldRoute,
    route
  };
})();

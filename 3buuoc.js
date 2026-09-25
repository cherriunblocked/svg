if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: false
  });
}
function skipProxy(url) {
  try {
    const host = new URL(url).hostname;
    return host === "cdn.jsdelivr.net" || host.endsWith(".jsdelivr.net") || host === "luminsdk.com" || host.endsWith(".luminsdk.com") || host === "cdnjs.cloudflare.com" || host.endsWith(".cdnjs.cloudflare.com") || host === "fonts.googleapis.com" || host === "fonts.gstatic.com" || host === "www.googletagmanager.com";
  } catch {
    return false;
  }
}

"use strict";
(() => {
  var DB_NAME = "sapphire_extensions";
  var DB_VERSION = 1;
  var EXT_STORE = "extensions";
  var EXT_FILES_STORE = "extension_files";
  var EXT_STORAGE_STORE = "extension_storage";
  var dbPromise = null;
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(EXT_STORE)) {
          db.createObjectStore(EXT_STORE, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(EXT_FILES_STORE)) {
          db.createObjectStore(EXT_FILES_STORE);
        }
        if (!db.objectStoreNames.contains(EXT_STORAGE_STORE)) {
          db.createObjectStore(EXT_STORAGE_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }
  async function dbGet(store, key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readonly");
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function dbGetAllKeys(store) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readonly");
      const req = tx.objectStore(store).getAllKeys();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  var MIME_TYPES = {
    js: "application/javascript",
    mjs: "application/javascript",
    css: "text/css",
    html: "text/html",
    htm: "text/html",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf"
  };
  function guessMime(path) {
    const ext = path.split(".").pop()?.toLowerCase() ?? "";
    return MIME_TYPES[ext] ?? "application/octet-stream";
  }
  var SAPPHIRE_PREFIX = "/~/sx/";
  function decodeSapphirePath(pathname) {
    if (!pathname.startsWith(SAPPHIRE_PREFIX)) return null;
    const rest = pathname.slice(SAPPHIRE_PREFIX.length);
    const slash = rest.indexOf("/");
    if (slash === -1) return null;
    const extId = rest.slice(0, slash);
    const path = decodeURIComponent(rest.slice(slash + 1));
    if (!extId || !path) return null;
    return { extId, path };
  }
  var clientToExtId = /* @__PURE__ */ new Map();
  function isolationHeaders(extra) {
    return {
      "Cross-Origin-Resource-Policy": "same-origin",
      ...extra
    };
  }
  function isBootstrapUrl(pathname) {
    const match = pathname.match(/^\/~\/sx\/([^/]+)\/__bootstrap__$/);
    return match ? match[1] : null;
  }
  function shouldRoute(event) {
    try {
      const url = new URL(event.request.url);
      if (url.pathname.startsWith(SAPPHIRE_PREFIX)) return true;
      if (url.origin !== self.location.origin) return false;
      return Boolean(event.clientId && clientToExtId.has(event.clientId));
    } catch {
      return false;
    }
  }
  async function serveExtensionFile(extId, path) {
    const bytes = await dbGet(EXT_FILES_STORE, `${extId}/${path}`);
    if (!bytes) return null;
    return new Response(bytes, {
      status: 200,
      headers: isolationHeaders({ "Content-Type": guessMime(path) })
    });
  }
  async function route(event) {
    const url = new URL(event.request.url);
    const bootstrapExtId = isBootstrapUrl(url.pathname);
    if (bootstrapExtId) {
      const clientId = event.resultingClientId;
      if (clientId) clientToExtId.set(clientId, bootstrapExtId);
      return new Response("<!DOCTYPE html><html><head></head><body></body></html>", {
        status: 200,
        headers: isolationHeaders({ "Content-Type": "text/html" })
      });
    }
    if (url.pathname.startsWith(SAPPHIRE_PREFIX)) {
      const decoded = decodeSapphirePath(url.pathname);
      if (!decoded)
        return new Response("sapphire: malformed extension resource URL", {
          status: 400,
          headers: isolationHeaders()
        });
      const response = await serveExtensionFile(decoded.extId, decoded.path);
      if (response) return response;
      const allKeys = await dbGetAllKeys(EXT_FILES_STORE);
      const prefix = `${decoded.extId}/`;
      const storedForExt = allKeys.filter((k) => typeof k === "string" && k.startsWith(prefix)).map((k) => k.slice(prefix.length));
      return new Response(
        `sapphire: no such extension file: "${decoded.path}"

Files actually stored for this extension:
${storedForExt.join("\n") || "(none)"}`,
        { status: 404, headers: isolationHeaders({ "Content-Type": "text/plain" }) }
      );
    }
    const extId = event.clientId ? clientToExtId.get(event.clientId) : void 0;
    if (extId) {
      const response = await serveExtensionFile(extId, url.pathname.replace(/^\//, ""));
      if (response) return response;
    }
    return fetch(event.request);
  }
  self._159eou3 = {
    shouldRoute,
    route
  };
})();

;


var _8ovpmww;
(() => {
  var e = { 805(e2, t2, r2) {
    r2.d(t2, { C: () => o2 });
    class o2 {
      methods;
      id;
      sendRaw;
      counter = 0;
      promiseCallbacks = /* @__PURE__ */ new Map();
      constructor(e3, t3, r3) {
        this.methods = e3, this.id = t3, this.sendRaw = r3;
      }
      recieve(e3) {
        if (null == e3 || "object" != typeof e3) return;
        let t3 = e3[this.id];
        if (null == t3 || "object" != typeof t3) return;
        let r3 = t3.$type;
        if ("response" === r3) {
          let e4 = t3.$token, r4 = t3.$data, o3 = t3.$error, s = this.promiseCallbacks.get(e4);
          if (!s) return;
          this.promiseCallbacks.delete(e4), void 0 !== o3 ? s.reject(Error(o3)) : s.resolve(r4);
        } else if ("request" === r3) {
          let e4 = t3.$method, r4 = t3.$args;
          this.methods[e4](r4).then((e5) => {
            this.sendRaw({ [this.id]: { $type: "response", $token: t3.$token, $data: e5?.[0] } }, e5?.[1]);
          }).catch((e5) => {
            console.error(e5), this.sendRaw({ [this.id]: { $type: "response", $token: t3.$token, $error: e5?.toString() || "Unknown error" } }, []);
          });
        }
      }
      call(e3, t3, r3 = []) {
        let o3 = this.counter++;
        return new Promise((s, i) => {
          this.promiseCallbacks.set(o3, { resolve: s, reject: i }), this.sendRaw({ [this.id]: { $type: "request", $method: e3, $args: t3, $token: o3 } }, r3);
        });
      }
    }
  } }, t = {};
  function r(o2) {
    var s = t[o2];
    if (void 0 !== s) return s.exports;
    var i = t[o2] = { exports: {} };
    return e[o2](i, i.exports, r), i.exports;
  }
  r.d = (e2, t2) => {
    for (var o2 in t2) r.o(t2, o2) && !r.o(e2, o2) && Object.defineProperty(e2, o2, { enumerable: true, get: t2[o2] });
  }, r.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2), r.r = (e2) => {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
  };
  var o = {};
  (() => {
    r.r(o), r.d(o, { route: () => a, shouldRoute: () => n });
    var e2 = r(805);
    let t2 = {};
    addEventListener("message", (e3) => {
      if (e3.data && "object" == typeof e3.data) {
        if (e3.data.$sw$setCookieDone && "object" == typeof e3.data.$sw$setCookieDone) {
          let r2 = e3.data.$sw$setCookieDone, o2 = t2[r2.id];
          o2 && (o2(), delete t2[r2.id]);
        }
        if (e3.data.$sw$initRemoteTransport && "object" == typeof e3.data.$sw$initRemoteTransport) {
          let { port: t3, prefix: r2 } = e3.data.$sw$initRemoteTransport, o2 = i.find((e4) => new URL(r2).pathname.startsWith(e4.prefix));
          if (!o2) return void console.error("No relevant controller found for transport init");
          o2.rpc.call("initRemoteTransport", t3, [t3]);
        }
      }
    });
    class s {
      prefix;
      id;
      rpc;
      constructor(r2, o2, s2) {
        this.prefix = r2, this.id = o2, this.rpc = new e2.C({ sendSetCookie: async ({ cookies: e3, options: r3 }) => {
          let o3 = await self.clients.matchAll(), s3 = [], i2 = [], n2 = r3?.destination === "document" || r3?.destination === "iframe";
          for (let a2 of o3) {
            let o4 = Math.random().toString(36).substring(2, 10);
            s3.push(o4), a2.postMessage({ $controller$setCookie: { cookies: e3, options: r3, id: o4 } }), n2 || i2.push(new Promise((e4) => {
              t2[o4] = () => e4(o4);
            }));
          }
          if (i2.length > 0) {
            let r4, n3 = false, a2 = new Promise((i3) => {
              r4 = setTimeout(() => {
                if (!n3) {
                  let r5 = s3.filter((e4) => void 0 !== t2[e4]);
                  console.error(`timed out waiting for set cookie response (deadlock?): cookies=${e3.length} clients=${o3.length} pending=${r5.length}/${s3.length} clientUrls=${o3.map((e4) => e4.url).join(",")}`);
                }
                i3();
              }, 1e3);
            });
            try {
              await Promise.race([a2, Promise.any(i2).then(() => {
                n3 = true;
              }).catch(() => {
              })]);
            } finally {
              for (let e4 of (void 0 !== r4 && clearTimeout(r4), s3)) delete t2[e4];
            }
          }
        } }, "tabchannel-" + o2, (e3, t3) => {
          s2.postMessage(e3, t3);
        }), s2.onmessage = (e3) => {
          this.rpc.recieve(e3.data);
        }, s2.onmessageerror = console.error, this.rpc.call("ready", void 0);
      }
    }
    let i = [];
    function n(e3) {
      let t3 = new URL(e3.request.url);
      return void 0 !== i.find((e4) => t3.pathname.startsWith(e4.prefix));
    }
    async function a(e3) {
      try {
        let t3 = new URL(e3.request.url), r2 = i.find((e4) => t3.pathname.startsWith(e4.prefix)), o2 = await clients.get(e3.clientId), s2 = [...e3.request.headers], n2 = await r2.rpc.call("request", { rawUrl: e3.request.url, rawReferrer: e3.request.referrer, destination: e3.request.destination, mode: e3.request.mode, referrer: e3.request.referrer, method: e3.request.method, body: e3.request.body, cache: e3.request.cache, forceCrossOriginIsolated: false, initialHeaders: s2, rawClientUrl: o2 ? o2.url : void 0, clientId: e3.clientId || e3.resultingClientId }, e3.request.body instanceof ReadableStream || e3.request.body instanceof ArrayBuffer ? [e3.request.body] : void 0);
        return new Response(n2.body, { status: n2.status, statusText: n2.statusText, headers: n2.headers });
      } catch (e4) {
        return console.error("Service Worker error:", e4), new Response("Internal Service Worker Error: " + e4.message, { status: 500 });
      }
    }
    addEventListener("message", (e3) => {
      if (!e3.data || "object" != typeof e3.data || !e3.data.$controller$init || "object" != typeof e3.data.$controller$init) return;
      let t3 = e3.data.$controller$init, r2 = i.findIndex((e4) => e4.id === t3.id);
      -1 !== r2 && i.splice(r2, 1), i.push(new s(t3.prefix, t3.id, e3.ports[0]));
    }), addEventListener("install", () => {
      self.skipWaiting();
    }), addEventListener("activate", (e3) => {
      e3.waitUntil(clients.claim());
    }), setTimeout(async () => {
      for (let e3 of (console.log("service worker activated, notifying clients to revive"), await clients.matchAll())) e3.postMessage({ $controller$swrevive: {} });
    }, 100);
  })(), _8ovpmww = o;
})();

;

addEventListener("install", () => self.skipWaiting());
addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
addEventListener("fetch", (e) => {
  if (_159eou3.shouldRoute(e)) {
    e.respondWith(_159eou3.route(e));
    return;
  }
  if (_8ovpmww.shouldRoute(e)) {
    e.respondWith(_8ovpmww.route(e));
    return;
  }
  if (skipProxy(e.request.url)) return;
});
addEventListener("push", (e) => {
  let data = {};
  try {
    data = e.data ? e.data.json() : {};
  } catch {
    data = { title: "Cherri", body: e.data ? e.data.text() : "" };
  }
  const url = typeof data.url === "string" ? data.url : "/chat";
  e.waitUntil(
    self.registration.showNotification(data.title || "Cherri", {
      body: data.body || "",
      tag: data.tag || void 0,
      data: { url }
    })
  );
});
addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL(e.notification.data && e.notification.data.url || "/chat", self.location.origin).href;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (new URL(client.url).origin === self.location.origin && "focus" in client) {
          client.navigate(url).catch(() => {
          });
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

(function(u){var s="cherri-shell",h=36e5,a=new URL(self.registration.scope),c=new URL("index.html",a).href,m=new URL("cdn-down",a).href,f=u.cdn?void 0:!0;function w(e,t,n){var r=new AbortController,o=setTimeout(function(){r.abort()},n);return t.signal=r.signal,fetch(e,t).finally(function(){clearTimeout(o)})}function l(e){var t=e.match(/"stamp":"([0-9a-f]+)"/);return t?t[1]:""}function d(e,t,n){return e.put(c,new Response(t,{headers:{"Content-Type":"text/html; charset=utf-8","X-Checked":String(Date.now()),"X-Fetched":String(n)}}))}function p(e,t,n){return fetch(t).then(function(r){return r.ok?r.text().then(function(o){var i=l(o)?d(e,o,n?Date.now():0):Promise.resolve();return i.then(function(){return new Response(o,{headers:{"Content-Type":"text/html; charset=utf-8"}})})}):r})}function v(e){return u.latest?e.clone().text().then(function(t){return w(u.latest,{cache:"no-store"},2500).then(function(n){return n.ok?n.text():Promise.reject()}).then(function(n){return n.trim()===l(t)},function(){return g(),null})}).catch(function(){return null}):Promise.resolve(null)}function g(){return f=!0,caches.open(s).then(function(e){return e.put(m,new Response("",{headers:{"X-Checked":String(Date.now())}}))})}function x(){return f!==void 0?Promise.resolve(!f):caches.open(s).then(function(e){return e.match(m)}).then(function(e){return f=!!e&&Date.now()-Number(e.headers.get("X-Checked"))<6*h,!f})}function R(e,t){return t.clone().text().then(function(n){return d(e,n,Number(t.headers.get("X-Fetched"))||0)})}function y(e){return caches.open(s).then(function(t){return t.match(c).then(function(n){if(!n)return p(t,e.request);var r=Date.now()-Number(n.headers.get("X-Checked")),o=Date.now()-Number(n.headers.get("X-Fetched"));return r<24*h?(e.waitUntil(v(n).then(function(i){if(i)return R(t,n);if(i===!1?o>h/6:r>h)return p(t,new Request(c,{cache:"no-cache"}),i===!1).catch(function(){})})),n):v(n).then(function(i){return i?R(t,n).then(function(){return n}):p(t,e.request).catch(function(){return n})})})})}function U(e,t){return x().then(function(n){return n?w(u.cdn+t,{integrity:u.files[t],mode:"cors",credentials:"omit"},8e3).then(function(r){if(!r.ok)throw new Error(String(r.status));return new Response(r.body,{status:200,headers:{"Content-Type":r.headers.get("Content-Type")||""}})}).catch(function(){return g(),fetch(e)}):fetch(e)})}self.addEventListener("install",function(e){if(e.waitUntil(caches.open(s).then(function(n){return fetch(c,{cache:"force-cache"}).then(function(r){return r.ok?r.text():""}).then(function(r){if(l(r))return d(n,r,0)}).catch(function(){})})),e.addRoutes&&self.URLPattern){var t=function(n){return n.replace(/[:*?+(){}\\]/g,"\\$&")};e.waitUntil(e.addRoutes([{condition:{urlPattern:new URLPattern({pathname:t(new URL(c).pathname)}),requestMode:"navigate"},source:"fetch-event"},{condition:{urlPattern:new URLPattern({pathname:t(a.pathname+u.prefix)+"*"})},source:"fetch-event"}]).catch(function(){}))}});function L(e){var t=self[u.controller],n=0;return new Promise(function(r){(function o(){if(t&&t.shouldRoute(e))return r(t.route(e));if((n+=50)>5e3)return r(C());setTimeout(o,50)})()})}function C(){return new Response('<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,"><title>cherri</title><p style="font:14px system-ui">This proxied page is not open in cherri. <a href="'+c+'" target="_top">Open cherri</a></p>',{status:503,headers:{"Content-Type":"text/html; charset=utf-8"}})}self.addEventListener("fetch",function(e){var t=e.request,n=new URL(t.url);if(!(n.origin!==a.origin||n.pathname.indexOf(a.pathname)!==0)){var r=n.pathname.slice(a.pathname.length);if(r.indexOf(u.prefix)===0)e.respondWith(L(e));else{if(t.method!=="GET")return;r==="favicon.ico"?e.respondWith(new Response(null,{status:404})):t.mode==="navigate"&&r==="index.html"?e.respondWith(y(e)):u.files[r]&&e.respondWith(U(t,r))}}})})({"cdn":"https://cdn.jsdelivr.net/gh/cherriunblocked/svg@s3/","latest":"https://cdn.jsdelivr.net/gh/cherriunblocked/svg@s3/build.txt","files":{"assets/json/truffled.json":"sha384-ifCVKsk5wh+XkhqImhv/gvkHsriJdIVIiC6AdHVJ5g59pKiI12DK3Yl19JvpcThq","assets/json/cloud.json":"sha384-MRqhMR8Z4VRKlRJLnj9J7G43IKZBHr6+r7gzzzmIqqcdd0kKcUDqwxQucJHbRbsK","assets/json/gn-math.json":"sha384-JZ6S75V3SbSLGV+M54NrLBXrjJ5AUw7ZKKTzzUjO82CrU3SQim27Q3OERUlpXxRE","assets/json/seraph.json":"sha384-pthTghKI8vcFzc/IemW0xUt1Uwn0m0KaRuEm7slzKIYTjrOO9BjMWGzRUY6TczSa","assets/json/ckv.json":"sha384-6K5F2s9vRZ5uddmWFyzVPEafwHsj+M37MMiOaoXA+Aa3z8NMWZa0FsHR0MOgUHzl","assets/json/ugs.json":"sha384-M/pcxyIvWtWm9S2e/X1nv/tw5TlwExEE3d8/0qG9v1q3/4mDWj/3PL6p/M5Xkc1q","jzu9x/xza3lo.wasm":"sha384-jWx7oHkOtjB+jUlVXlVgabE0QVERRBDaGuZ7D2+fSrA2pQGKHvzSl/EyBLX1SFiQ","jzu9x/81tx1k.js":"sha384-UTnDBNN1dJphkelM5JfMimbiEU3jCSxhKEEIrEFJ1nxA53ehlhgx/kH/6S4xDnZw","uwafh/z1jrke.js":"sha384-xObwtlCsOstSsWCTIg8hKEa6XZeaXVvWzx5bMXiJgNQwORtOUY8/3qchd48cEZ9C","uwafh/7dk4kk.js":"sha384-hlyJzWJPe3mXMvPNXpEW+zXoN+pwYfxTz0QqiaEq1fbV+cZHZcvKWNVi+/ZYXh2D","uwafh/qtffdu.js":"sha384-devHMKfMmXI6vzQy53emCdcuPfzyXvOeU1tfWcpZfkHBvpV8AdgzqG40XOinmzL0"},"prefix":"cyh82g/","controller":"_8ovpmww"});

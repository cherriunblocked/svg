"use strict";
(() => {
  // packages/sapphire/src/db.ts
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

  // packages/sapphire/src/crx.ts
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

  // packages/sapphire/src/urlScheme.ts
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

  // packages/sapphire/src/router/SapphireRouter.ts
  var clientToExtId = /* @__PURE__ */ new Map();
  function isolationHeaders(extra) {
    return {
      "Cross-Origin-Embedder-Policy": "credentialless",
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

  // packages/sapphire/src/router/swEntry.ts
  self._a0d3a3m = {
    shouldRoute,
    route
  };
})();

if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: false,
  });
}

function skipProxy(url) {
  try {
    const host = new URL(url).hostname;
    return (
      host === "cdn.jsdelivr.net" ||
      host.endsWith(".jsdelivr.net") ||
      host === "luminsdk.com" ||
      host.endsWith(".luminsdk.com") ||
      host === "cdnjs.cloudflare.com" ||
      host.endsWith(".cdnjs.cloudflare.com") ||
      host === "fonts.googleapis.com" ||
      host === "fonts.gstatic.com" ||
      host === "www.googletagmanager.com"
    );
  } catch {
    return false;
  }
}

importScripts("ejfy40.js");
importScripts("697l3e.js");
importScripts("wh2ju/90ixbt.js");

// Take over as soon as a new worker is available, and start controlling
// already-open pages immediately. Without this a rebuilt worker (e.g. a change
// to the Sapphire router) sits in "waiting" until every tab is closed, so
// fixes appear not to apply. None of the imported routers claim clients.
addEventListener("install", () => self.skipWaiting());
addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

addEventListener("fetch", (e) => {
  if (skipProxy(e.request.url)) return;
  if (_zpp0ifu.shouldRoute(e)) {
    e.respondWith(_zpp0ifu.route(e));
    return;
  }
  if (_a0d3a3m.shouldRoute(e)) {
    e.respondWith(_a0d3a3m.route(e));
    return;
  }
  if (_dxdy9ag.shouldRoute(e)) {
    e.respondWith(_dxdy9ag.route(e));
  }
});
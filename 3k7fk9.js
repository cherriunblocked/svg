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

importScripts("ocobdz.js");
importScripts("ipo26/73i5vw.js");

// Take over as soon as a new worker is available, and start controlling
// already-open pages immediately. Without this a rebuilt worker (e.g. a change
// to the Sapphire router) sits in "waiting" until every tab is closed, so
// fixes appear not to apply. None of the imported routers claim clients.
addEventListener("install", () => self.skipWaiting());
addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

addEventListener("fetch", (e) => {
  if (skipProxy(e.request.url)) return;
  if (_aids1he.shouldRoute(e)) {
    e.respondWith(_aids1he.route(e));
    return;
  }
  if (_aiwjjai.shouldRoute(e)) {
    e.respondWith(_aiwjjai.route(e));
  }
});

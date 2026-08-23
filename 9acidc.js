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

importScripts("rpq5zi.js");
importScripts("yi0fp6.js");
importScripts("76kj3/et2krv.js");

// Take over as soon as a new worker is available, and start controlling
// already-open pages immediately. Without this a rebuilt worker (e.g. a change
// to the Sapphire router) sits in "waiting" until every tab is closed, so
// fixes appear not to apply. None of the imported routers claim clients.
addEventListener("install", () => self.skipWaiting());
addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

addEventListener("fetch", (e) => {
  if (skipProxy(e.request.url)) return;
  if (_poeag8o.shouldRoute(e)) {
    e.respondWith(_poeag8o.route(e));
    return;
  }
  if (_5sq2bbp.shouldRoute(e)) {
    e.respondWith(_5sq2bbp.route(e));
    return;
  }
  if (_4dajuqa.shouldRoute(e)) {
    e.respondWith(_4dajuqa.route(e));
  }
});
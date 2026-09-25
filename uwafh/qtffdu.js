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

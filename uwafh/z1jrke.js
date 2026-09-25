var _8ovpmww;
(() => {
  var e = { 286(e2, t2, r2) {
    r2.d(t2, { I: () => o2 });
    let o2 = /* @__PURE__ */ Symbol.for("controller frame handle");
  }, 355(e2, t2, r2) {
    r2.d(t2, { O: () => s, x: () => o2 });
    let o2 = "0.0.14";
    function s() {
      if ("undefined" == typeof _zkvapuq) throw Error("_gpv7v9hzlly8_gpv7v9hzlly is not loaded. Load _ngnknoz before the controller.");
      var e3 = "2.0.67-alpha.2", t3 = _zkvapuq.versionInfo.version;
      if (e3 !== t3) throw Error(`_gpv7v9hzlly8_gpv7v9hzlly version mismatch: this build expects ${e3}, but the loaded runtime is ${t3}`);
    }
  }, 805(e2, t2, r2) {
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
  }, 986(e2) {
    let t2 = Object.getPrototypeOf({});
    function r2() {
      return function(e3) {
        return "object" == typeof e3 && null !== e3 && !(e3 instanceof RegExp) && !(e3 instanceof Date);
      };
    }
    function o2(e3) {
      function o3(e4) {
        return "constructor" !== e4 && "prototype" !== e4 && "__proto__" !== e4;
      }
      let s = Object.prototype.propertyIsEnumerable, i = e3?.symbols ? function(e4) {
        let t3 = Object.keys(e4), r3 = Object.getOwnPropertySymbols(e4);
        for (let o4 = 0, i2 = r3.length; o4 < i2; ++o4) s.call(e4, r3[o4]) && t3.push(r3[o4]);
        return t3;
      } : Object.keys, n = "function" == typeof e3?.cloneProtoObject ? e3.cloneProtoObject : void 0, a = "function" == typeof e3?.isMergeableObject ? e3.isMergeableObject : r2(), c = e3?.onlyDefinedProperties === true, l = e3 && "function" == typeof e3.mergeArray ? e3.mergeArray({ clone: d, deepmerge: h, getKeys: i, isMergeableObject: a }) : function(e4, t3) {
        let r3 = e4.length, o4 = t3.length, s2 = 0, i2 = Array(r3 + o4);
        for (; s2 < r3; ++s2) i2[s2] = d(e4[s2]);
        for (s2 = 0; s2 < o4; ++s2) i2[s2 + r3] = d(t3[s2]);
        return i2;
      };
      function d(e4) {
        return a(e4) ? Array.isArray(e4) ? (function(e5) {
          let t3 = 0, r3 = e5.length, o4 = Array(r3);
          for (; t3 < r3; ++t3) o4[t3] = d(e5[t3]);
          return o4;
        })(e4) : (function(e5) {
          let r3, s2, a2, c2 = {};
          if (n && Object.getPrototypeOf(e5) !== t2) return n(e5);
          let l2 = i(e5);
          for (r3 = 0, s2 = l2.length; r3 < s2; ++r3) o3(a2 = l2[r3]) && (c2[a2] = d(e5[a2]));
          return c2;
        })(e4) : e4;
      }
      function h(e4, r3) {
        if (c && void 0 === r3) return d(e4);
        let s2 = Array.isArray(r3), f = Array.isArray(e4);
        return "object" != typeof r3 || null === r3 ? r3 : a(e4) ? s2 && f ? l(e4, r3) : s2 !== f ? d(r3) : (function(e5, r4) {
          let s3, l2, f2, p = {}, u = i(e5), y = i(r4);
          for (s3 = 0, l2 = u.length; s3 < l2; ++s3) o3(f2 = u[s3]) && -1 === y.indexOf(f2) && (p[f2] = d(e5[f2]));
          for (s3 = 0, l2 = y.length; s3 < l2; ++s3) if (o3(f2 = y[s3])) if (f2 in e5) -1 !== u.indexOf(f2) && (n && a(r4[f2]) && Object.getPrototypeOf(r4[f2]) !== t2 ? p[f2] = n(r4[f2]) : p[f2] = h(e5[f2], r4[f2]));
          else {
            if (c && void 0 === r4[f2]) continue;
            p[f2] = d(r4[f2]);
          }
          return p;
        })(e4, r3) : d(r3);
      }
      return e3?.all ? function() {
        let e4;
        switch (arguments.length) {
          case 0:
            return {};
          case 1:
            return d(arguments[0]);
          case 2:
            return h(arguments[0], arguments[1]);
        }
        for (let t3 = 0, r3 = arguments.length; t3 < r3; ++t3) e4 = h(e4, arguments[t3]);
        return e4;
      } : h;
    }
    e2.exports = o2, e2.exports.default = o2, e2.exports.deepmerge = o2, Object.defineProperty(e2.exports, "isMergeableObject", { get: r2 });
  }, 235(e2, t2, r2) {
    r2.d(t2, { Sr: () => s }), WebSocket.CLOSED, WebSocket.CONNECTING, WebSocket.OPEN, EventTarget;
    let o2 = [101, 204, 205, 304];
    class s extends Response {
      url;
      rawHeaders;
      redirected = false;
      static fromTransferrableResponse(e3, t3) {
        let r3 = new s(o2.includes(e3.status) ? void 0 : e3.body, { headers: new Headers(e3.headers), status: e3.status, statusText: e3.statusText });
        return r3.url = t3, r3.redirected = e3.status >= 300 && e3.status < 400 && void 0 !== e3.headers.location, r3.rawHeaders = e3.headers, r3;
      }
      static fromNativeResponse(e3) {
        let t3 = new s(o2.includes(e3.status) ? void 0 : e3.body, { headers: e3.headers, status: e3.status, statusText: e3.statusText });
        return t3.url = e3.url, t3.rawHeaders = [...e3.headers], t3.redirected = e3.redirected, t3;
      }
    }
  }, 423(e2, t2, r2) {
    r2.d(t2, { Cx: () => p, Oy: () => G, cP: () => s, ht: () => z, k_: () => n, mK: () => d, sb: () => y, uh: () => f });
    let { BareResponse: o2, CookieJar: s, IncrementalHtmlRewriter: i, Plugin: n, _uq5d332ero7v_: a, _efapaa4ggcj5_efap: c, _3ebmf7bovo2u_: l, _i1qtm40x79x4_i1qtm4: d, _pbpou76apen4_pbpou76apen4: h, _yba8tg5fnz2i_y: f, Tap: p, createLocationProxy: u, defaultConfig: y, defaultConfigDev: m, flagEnabled: g, getOwnPropertyDescriptorHandler: w, getRewriter: k, getScriptBlockTypeString: b, htmlRules: j, isArchiveMimeType: S, isAudioOrVideoMimeType: v, isFontMimeType: C, isHtmlMimeType: x, isImageMimeType: $, isInlineDisplayableMimeType: P, isJavascriptMimeType: O, isJavascriptMimeTypeEssenceMatch: R, isModuleScriptType: A, isScriptType: E, isScriptableMimeType: U, isXmlMimeType: M, isZipBasedMimeType: W, isdedicated: T, isshared: D, issw: I, iswindow: L, isworker: N, parseMimeType: _, rewriteBlob: J, rewriteCss: H, rewriteHtml: q, rewriteJs: F, rewriteJsInner: B, rewriteSrcset: K, rewriteUrl: G, rewriteWorkers: V, setWasm: z, unrewriteBlob: Q, unrewriteCss: X, unrewriteHtml: Y, unrewriteUrl: Z, versionInfo: ee } = globalThis._zkvapuq;
  } }, t = {};
  function r(o2) {
    var s = t[o2];
    if (void 0 !== s) return s.exports;
    var i = t[o2] = { exports: {} };
    return e[o2](i, i.exports, r), i.exports;
  }
  r.n = (e2) => {
    var t2 = e2 && e2.__esModule ? () => e2.default : () => e2;
    return r.d(t2, { a: t2 }), t2;
  }, r.d = (e2, t2) => {
    for (var o2 in t2) r.o(t2, o2) && !r.o(e2, o2) && Object.defineProperty(e2, o2, { enumerable: true, get: t2[o2] });
  }, r.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2), r.r = (e2) => {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
  };
  var o = {};
  (() => {
    r.r(o), r.d(o, { Controller: () => S, Frame: () => v, ManagedPlugin: () => d, VERSION: () => a.x, assertRuntimeScramjetVersion: () => a.O, config: () => c });
    var e2 = r(805), t2 = r(235), s = r(986), i = r(423), n = r(286), a = r(355);
    let c = { prefix: "/~/sj/", _ngnknozPath: "/_ngnknoz/_ngnknoz.js", injectPath: "./controller/controller.inject.js", wasmPath: "/_ngnknoz/_ngnknoz.wasm", virtualWasmPath: "_ngnknoz.wasm.js", codec: { encode: (e3) => e3 ? encodeURIComponent(e3) : e3, decode: (e3) => e3 ? decodeURIComponent(e3) : e3 } }, l = { flags: { ...i.sb.flags, allowFailedIntercepts: true }, maskedfiles: ["inject.js", "_ngnknoz.wasm.js"] };
    class d extends i.k_ {
      frame = null;
      dependencies = [];
      constructor(e3, t3) {
        super(e3), this.dependencies = t3;
      }
      install(e3) {
        this.frame = e3;
      }
    }
    let h = "state", f = "cookies", p = null;
    function u(e3) {
      return "object" == typeof e3 && null !== e3 && "number" == typeof e3.updatedAt && Number.isFinite(e3.updatedAt) && "string" == typeof e3.cookies ? e3 : null;
    }
    function y(e3) {
      return new Promise((t3, r2) => {
        e3.onsuccess = () => t3(e3.result), e3.onerror = () => r2(e3.error ?? Error("IndexedDB request failed"));
      });
    }
    function m(e3) {
      return new Promise((t3, r2) => {
        e3.oncomplete = () => t3(), e3.onabort = () => r2(e3.error ?? Error("IndexedDB transaction aborted")), e3.onerror = () => r2(e3.error ?? Error("IndexedDB transaction failed"));
      });
    }
    function g() {
      return p || (p = new Promise((e3, t3) => {
        let r2 = indexedDB.open("__f5ovjirp9my_cf5ovji", 1);
        r2.onupgradeneeded = () => {
          let e4 = r2.result;
          e4.objectStoreNames.contains(h) || e4.createObjectStore(h);
        }, r2.onsuccess = () => e3(r2.result), r2.onerror = () => t3(r2.error ?? Error("Failed to open cookie database"));
      }));
    }
    async function w() {
      try {
        let e3 = (await g()).transaction(h, "readonly"), t3 = e3.objectStore(h), r2 = await y(t3.get(f));
        return await m(e3), u(r2);
      } catch (e3) {
        return console.error("Failed to read persisted controller cookies:", e3), null;
      }
    }
    async function k(e3, t3) {
      try {
        let r2 = (await g()).transaction(h, "readwrite"), o2 = r2.objectStore(h), s2 = u(await y(o2.get(f))), i2 = Math.max(Date.now(), t3 + 1, (s2?.updatedAt ?? 0) + 1);
        return o2.put({ updatedAt: i2, cookies: e3 }, f), await m(r2), i2;
      } catch (e4) {
        return console.error("Failed to persist controller cookies:", e4), t3;
      }
    }
    function b() {
      return Math.random().toString(36).substring(2, 10);
    }
    let j = (0, s.deepmerge)();
    class S {
      init;
      id;
      config;
      _ngnknozConfig;
      prefix;
      cookieJar = new i.cP();
      frames = [];
      serviceWorkerController;
      guardServiceWorkerRevive = true;
      ready;
      readyResolve;
      isReady = false;
      rpc;
      port = null;
      transport;
      cookieUpdatedAt = 0;
      cookieSyncPromise = null;
      cookieSyncDirty = true;
      cookieSyncChannel = new BroadcastChannel("__q80kqcigeyq_wq80kqcigeyq_wq");
      wasmAlreadyFetched = false;
      wasmPayload = null;
      onTabChannelMessage = (e3) => {
        this.rpc.recieve(e3.data);
      };
      onCookieSyncMessage = (e3) => {
        let t3 = "object" == typeof e3.data && null !== e3.data ? e3.data.updatedAt : void 0;
        "number" != typeof t3 || t3 <= this.cookieUpdatedAt || (this.cookieSyncDirty = true, this.loadSavedCookies());
      };
      async loadScramjetWasm() {
        if (this.wasmAlreadyFetched) return;
        let e3 = await fetch(this.config.wasmPath);
        (0, i.ht)(await e3.arrayBuffer()), this.wasmAlreadyFetched = true;
      }
      methods = { ready: async () => {
        this.readyResolve(), setTimeout(() => {
          this.guardServiceWorkerRevive = false;
        }, 5e3);
      }, request: async (e3) => {
        let t3 = new URL(e3.rawUrl).pathname, r2 = this.frames.find((e4) => t3.startsWith(e4.prefix));
        if (!r2) throw Error("No frame found for request");
        try {
          if (await this.loadSavedCookies(), t3 === r2.prefix + this.config.virtualWasmPath) {
            if (!this.wasmPayload) {
              let e4 = await fetch(this.config.wasmPath), t4 = await e4.arrayBuffer(), r3 = btoa(new Uint8Array(t4).reduce((e5, t5) => (e5.push(String.fromCharCode(t5)), e5), []).join(""));
              this.wasmPayload = `self.WASM = '${r3}';`;
            }
            return [{ body: this.wasmPayload, status: 200, statusText: "OK", headers: [["Content-Type", "application/javascript"]] }, []];
          }
          let o2 = i.uh.fromRawHeaders(e3.initialHeaders), s2 = await r2.fetchHandler.handleFetch({ initialHeaders: o2, rawClientUrl: e3.rawClientUrl ? new URL(e3.rawClientUrl) : void 0, rawUrl: new URL(e3.rawUrl), rawReferrer: e3.rawReferrer, rawDestination: e3.destination, method: e3.method, mode: e3.mode, referrer: e3.referrer, body: e3.body, cache: e3.cache, clientId: e3.clientId });
          return [{ body: s2.body, status: s2.status, statusText: s2.statusText, headers: s2.headers.toRawHeaders() }, s2.body instanceof ReadableStream || s2.body instanceof ArrayBuffer ? [s2.body] : []];
        } catch (o2) {
          let t4 = { setResponse: void 0, suppressError: false };
          if (await i.Cx.dispatch(r2.hooks.error.request, { rawrequest: e3, error: o2 }, t4), t4.suppressError || console.error("Error in controller request handler:", o2), t4.setResponse) return [t4.setResponse, []];
          throw o2;
        }
      }, initRemoteTransport: async (t3) => {
        let r2 = new e2.C({ request: async ({ remote: e3, method: t4, body: r3, headers: o2 }) => {
          let s2 = await this.transport.request(new URL(e3), t4, r3, o2, void 0);
          return [s2, [s2.body]];
        }, sendSetCookie: async ({ cookies: e3, options: t4 }) => {
          await this.loadSavedCookies(true), t4?.clear && this.cookieJar.clear(), this.applyCookieSyncEntries(e3), await this.persistCookies(), await this.propagateCookieSync(e3, t4);
        }, connect: async ({ url: e3, protocols: t4, requestHeaders: r3, port: o2 }) => {
          let s2, i2 = new Promise((e4) => s2 = e4), [n2, a2] = this.transport.connect(new URL(e3), t4, r3, (e4, t5) => {
            s2({ result: "success", protocol: e4, extensions: t5 });
          }, (e4) => {
            o2.postMessage({ type: "data", data: e4 }, e4 instanceof ArrayBuffer ? [e4] : []);
          }, (e4, t5) => {
            o2.postMessage({ type: "close", code: e4, reason: t5 });
          }, (e4) => {
            s2({ result: "failure", error: e4 });
          });
          return o2.onmessageerror = (e4) => {
            console.error("Transport port messageerror (this should never happen!)", e4);
          }, o2.onmessage = ({ data: e4 }) => {
            "data" === e4.type ? n2(e4.data) : "close" === e4.type && a2(e4.code, e4.reason);
          }, [await i2, []];
        } }, "transport", (e3, r3) => t3.postMessage(e3, r3));
        t3.onmessageerror = (e3) => {
          console.error("Transport port messageerror (this should never happen!)", e3);
        }, t3.onmessage = (e3) => {
          r2.recieve(e3.data);
        }, r2.call("ready", void 0, []);
      } };
      constructor(t3) {
        this.init = t3, (0, a.O)(), this.id = b(), this.config = j(c, t3.config || {}), this._ngnknozConfig = j(l, i.sb), this._ngnknozConfig = j(this._ngnknozConfig, t3._ngnknozConfig || {}), this.prefix = this.config.prefix + this.id + "/", this.serviceWorkerController = t3.serviceworker, this.ready = Promise.all([new Promise((e3) => {
          this.readyResolve = e3;
        }), this.loadScramjetWasm(), this.loadSavedCookies(true)]).then(() => void 0), this.rpc = new e2.C(this.methods, "tabchannel-" + this.id, (e3, t4) => {
          if (!this.port) throw Error("Port not found");
          this.port.postMessage(e3, t4);
        }), this.transport = t3.transport, this.cookieSyncChannel.addEventListener("message", this.onCookieSyncMessage), this.setupMessagePort(), navigator.serviceWorker.addEventListener("message", (e3) => {
          if (e3.data?.$controller$setCookie && "object" == typeof e3.data.$controller$setCookie) {
            let t4 = e3.data.$controller$setCookie;
            t4.options?.clear && this.cookieJar.clear(), this.applyCookieSyncEntries(t4.cookies), "string" == typeof t4.id && this.serviceWorkerController.postMessage({ $sw$setCookieDone: { id: t4.id } });
            return;
          }
          if (e3.data.$controller$swrevive) {
            if (this.guardServiceWorkerRevive) return;
            this.setupMessagePort();
          }
        });
      }
      setupMessagePort() {
        if (this.port) {
          this.port.removeEventListener("message", this.onTabChannelMessage);
          try {
            this.port.close();
          } catch {
          }
          this.port = null;
        }
        let e3 = new MessageChannel();
        this.port = e3.port1, this.port.addEventListener("message", this.onTabChannelMessage), this.port.start(), this.serviceWorkerController.postMessage({ $controller$init: { prefix: this.prefix, id: this.id } }, [e3.port2]);
      }
      applyCookieSyncEntries(e3) {
        if (Array.isArray(e3)) for (let t3 of e3) "string" == typeof t3?.url && "string" == typeof t3.cookie && this.cookieJar.setCookies(t3.cookie, new URL(t3.url));
      }
      async propagateCookieSync(e3, t3 = {}) {
        this.port && await this.rpc.call("sendSetCookie", { cookies: e3, options: t3 });
      }
      async loadSavedCookies(e3 = false) {
        if (e3 || this.cookieSyncDirty) return this.cookieSyncPromise || (this.cookieSyncPromise = (async () => {
          let e4 = await w();
          e4 && e4.updatedAt > this.cookieUpdatedAt && (this.cookieJar.load(e4.cookies), this.cookieUpdatedAt = e4.updatedAt), this.cookieSyncDirty = false;
        })().finally(() => {
          this.cookieSyncPromise = null;
        })), this.cookieSyncPromise;
      }
      async persistCookies() {
        let e3 = await k(this.cookieJar.dump(), this.cookieUpdatedAt);
        e3 <= this.cookieUpdatedAt || (this.cookieUpdatedAt = e3, this.cookieSyncDirty = false, this.cookieSyncChannel.postMessage({ updatedAt: e3 }));
      }
      setTransport(e3) {
        for (let t3 of (this.transport = e3, this.frames)) t3.controller.transport = e3, t3.fetchHandler.client.transport = e3;
      }
      createFrame(e3, t3 = {}) {
        if (!this.ready) throw Error("Controller is not ready! Try awaiting controller.wait()");
        let r2 = new v(this, e3 ??= document.createElement("iframe"), t3);
        return this.frames.push(r2), r2;
      }
      async wait() {
        await this.ready;
      }
    }
    class v {
      controller;
      element;
      options;
      id;
      prefix;
      fetchHandler;
      hooks;
      get context() {
        return { config: this.controller._ngnknozConfig, prefix: new URL(this.prefix, location.href), cookieJar: this.controller.cookieJar, interface: { getInjectScripts: /* @__PURE__ */ (function e3(t3, r2, o2, s2, i2, n2) {
          return (a2, c2, l2, d2) => {
            var h2;
            return [d2(t3._ngnknozPath), d2(o2.href + t3.virtualWasmPath), d2(t3.injectPath), d2("data:text/javascript;charset=utf-8;base64," + (h2 = `
					document.querySelectorAll("script[_j4innka1c8q4_j4i]").forEach(script => script.remove());
					_8ovpmww.load({
						config: ${JSON.stringify(t3)},
						sjconfig: ${JSON.stringify(r2)},
						prefix: new URL("${o2.href}"),
						cookies: ${JSON.stringify(s2.dump())},
						yieldGetInjectScripts: ${e3.toString()},
						codecEncode: ${i2.toString()},
						codecDecode: ${n2.toString()},
						initHeaders: ${JSON.stringify(l2.headers ?? [])},
						history: ${JSON.stringify(l2.history ?? [])},
					})
				`, btoa(new TextEncoder().encode(h2).reduce((e4, t4) => (e4.push(String.fromCharCode(t4)), e4), []).join(""))))];
          };
        })(this.controller.config, this.controller._ngnknozConfig, new URL(this.prefix, location.href), this.controller.cookieJar, this.controller.config.codec.encode, this.controller.config.codec.decode), getWorkerInjectScripts: (e3, t3, r2) => {
          var o2;
          let s2 = "";
          return s2 += r2(this.controller.config._ngnknozPath), s2 += r2(this.prefix + this.controller.config.virtualWasmPath), s2 += r2("data:text/javascript;charset=utf-8;base64," + (o2 = `
					(()=>{
						const { _3ebmf7bovo2u_, CookieJar, setWasm } = _zkvapuq;

						setWasm(Uint8Array.from(atob(self.WASM), (c) => c.charCodeAt(0)));
						delete self.WASM;

						const sjconfig = ${JSON.stringify(this.controller._ngnknozConfig)};
						const prefix = new URL("${this.prefix}", location.href);

						const context = {
							config: sjconfig,
							prefix,
							interface: {
								codecEncode: ${this.controller.config.codec.encode.toString()},
								codecDecode: ${this.controller.config.codec.decode.toString()},
							},
						};

						const client = new _3ebmf7bovo2u_(globalThis, {
							context,
							transport: null,
						});

						client.hook();
					})();
					`, btoa(new TextEncoder().encode(o2).reduce((e4, t4) => (e4.push(String.fromCharCode(t4)), e4), []).join(""))));
        }, codecEncode: this.controller.config.codec.encode, codecDecode: this.controller.config.codec.decode } };
      }
      plugins = [];
      constructor(e3, r2, o2 = {}) {
        for (const s2 of (this.controller = e3, this.element = r2, this.options = o2, this.id = b(), this.prefix = this.controller.prefix + this.id + "/", this.fetchHandler = new i.mK({ crossOriginIsolated: self.crossOriginIsolated, context: this.context, transport: e3.transport, async sendSetCookie(t3, r3) {
          await e3.persistCookies(), await e3.propagateCookieSync(t3.map(({ url: e4, cookie: t4 }) => ({ url: e4.href, cookie: t4 })), r3);
        }, fetchBlobUrl: async (e4) => t2.Sr.fromNativeResponse(await fetch(e4)), fetchDataUrl: async (e4) => t2.Sr.fromNativeResponse(await fetch(e4)) }), this.hooks = { fetch: this.fetchHandler.hooks.fetch, init: i.Cx.create(), error: i.Cx.create() }, r2[n.I] = this, this.plugins = o2.plugins ?? [], this.plugins)) {
          for (const e4 of s2.dependencies) if (!this.plugins.find((t3) => t3.name === e4)) throw Error(`Dependency ${e4} not found for plugin ${s2.name}`);
          s2.install(this);
        }
      }
      getPlugin(e3) {
        let t3 = this.plugins.find((t4) => t4.name === e3);
        if (!t3) throw Error(`Plugin ${e3} not found`);
        return t3;
      }
      back() {
        this.element.contentWindow?.history.back();
      }
      forward() {
        this.element.contentWindow?.history.forward();
      }
      reload() {
        this.element.contentWindow?.location.reload();
      }
      go(e3) {
        let t3 = (0, i.Oy)(e3, this.context, { origin: new URL(location.href), base: new URL(location.href) });
        this.element.src = t3;
      }
    }
  })(), _8ovpmww = o;
})();

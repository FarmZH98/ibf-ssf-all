var md = Object.defineProperty,
  yd = Object.defineProperties;
var vd = Object.getOwnPropertyDescriptors;
var js = Object.getOwnPropertySymbols;
var Dd = Object.prototype.hasOwnProperty,
  wd = Object.prototype.propertyIsEnumerable;
var Bs = (e, t, n) =>
    t in e
      ? md(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  L = (e, t) => {
    for (var n in (t ||= {})) Dd.call(t, n) && Bs(e, n, t[n]);
    if (js) for (var n of js(t)) wd.call(t, n) && Bs(e, n, t[n]);
    return e;
  },
  G = (e, t) => yd(e, vd(t));
var $s = null;
var Kr = 1,
  Us = Symbol("SIGNAL");
function b(e) {
  let t = $s;
  return ($s = e), t;
}
var Hs = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Ed(e) {
  if (!(eo(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Kr)) {
    if (!e.producerMustRecompute(e) && !Jr(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = Kr);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Kr);
  }
}
function Gs(e) {
  return e && (e.nextProducerIndex = 0), b(e);
}
function zs(e, t) {
  if (
    (b(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (eo(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Xr(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Jr(e) {
  mn(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (Ed(n), r !== n.version)) return !0;
  }
  return !1;
}
function Ws(e) {
  if ((mn(e), eo(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Xr(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Xr(e, t) {
  if ((Cd(e), mn(e), e.liveConsumerNode.length === 1))
    for (let r = 0; r < e.producerNode.length; r++)
      Xr(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    mn(o), (o.producerIndexOfThis[r] = t);
  }
}
function eo(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function mn(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function Cd(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function Id() {
  throw new Error();
}
var bd = Id;
function qs(e) {
  bd = e;
}
function C(e) {
  return typeof e == "function";
}
function st(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var yn = st(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function Ft(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var z = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (C(r))
        try {
          r();
        } catch (i) {
          t = i instanceof yn ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Zs(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof yn ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new yn(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Zs(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && Ft(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && Ft(n, t), t instanceof e && t._removeParent(this);
  }
};
z.EMPTY = (() => {
  let e = new z();
  return (e.closed = !0), e;
})();
var to = z.EMPTY;
function vn(e) {
  return (
    e instanceof z ||
    (e && "closed" in e && C(e.remove) && C(e.add) && C(e.unsubscribe))
  );
}
function Zs(e) {
  C(e) ? e() : e.unsubscribe();
}
var de = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var at = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = at;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = at;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Dn(e) {
  at.setTimeout(() => {
    let { onUnhandledError: t } = de;
    if (t) t(e);
    else throw e;
  });
}
function no() {}
var Ys = ro("C", void 0, void 0);
function Qs(e) {
  return ro("E", void 0, e);
}
function Ks(e) {
  return ro("N", e, void 0);
}
function ro(e, t, n) {
  return { kind: e, value: t, error: n };
}
var ze = null;
function ut(e) {
  if (de.useDeprecatedSynchronousErrorHandling) {
    let t = !ze;
    if ((t && (ze = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = ze;
      if (((ze = null), n)) throw r;
    }
  } else e();
}
function Js(e) {
  de.useDeprecatedSynchronousErrorHandling &&
    ze &&
    ((ze.errorThrown = !0), (ze.error = e));
}
var We = class extends z {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), vn(t) && t.add(this))
          : (this.destination = Td);
    }
    static create(t, n, r) {
      return new ke(t, n, r);
    }
    next(t) {
      this.isStopped ? io(Ks(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? io(Qs(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? io(Ys, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  _d = Function.prototype.bind;
function oo(e, t) {
  return _d.call(e, t);
}
var so = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          wn(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          wn(r);
        }
      else wn(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          wn(n);
        }
    }
  },
  ke = class extends We {
    constructor(t, n, r) {
      super();
      let o;
      if (C(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && de.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && oo(t.next, i),
              error: t.error && oo(t.error, i),
              complete: t.complete && oo(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new so(o);
    }
  };
function wn(e) {
  de.useDeprecatedSynchronousErrorHandling ? Js(e) : Dn(e);
}
function Md(e) {
  throw e;
}
function io(e, t) {
  let { onStoppedNotification: n } = de;
  n && at.setTimeout(() => n(e, t));
}
var Td = { closed: !0, next: no, error: Md, complete: no };
var ct = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Xs(e) {
  return e;
}
function ea(e) {
  return e.length === 0
    ? Xs
    : e.length === 1
    ? e[0]
    : function (n) {
        return e.reduce((r, o) => o(r), n);
      };
}
var R = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = xd(n) ? n : new ke(n, r, o);
      return (
        ut(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = ta(r)),
        new r((o, i) => {
          let s = new ke({
            next: (a) => {
              try {
                n(a);
              } catch (u) {
                i(u), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [ct]() {
      return this;
    }
    pipe(...n) {
      return ea(n)(this);
    }
    toPromise(n) {
      return (
        (n = ta(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function ta(e) {
  var t;
  return (t = e ?? de.Promise) !== null && t !== void 0 ? t : Promise;
}
function Ad(e) {
  return e && C(e.next) && C(e.error) && C(e.complete);
}
function xd(e) {
  return (e && e instanceof We) || (Ad(e) && vn(e));
}
function Sd(e) {
  return C(e?.lift);
}
function W(e) {
  return (t) => {
    if (Sd(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function q(e, t, n, r, o) {
  return new ao(e, t, n, r, o);
}
var ao = class extends We {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (u) {
              t.error(u);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (u) {
              t.error(u);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
var na = st(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var Le = (() => {
    class e extends R {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new En(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new na();
      }
      next(n) {
        ut(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        ut(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        ut(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? to
          : ((this.currentObservers = null),
            i.push(n),
            new z(() => {
              (this.currentObservers = null), Ft(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new R();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new En(t, n)), e;
  })(),
  En = class extends Le {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : to;
    }
  };
var Rt = class extends Le {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
function ra(e) {
  return e && C(e.schedule);
}
function oa(e) {
  return e[e.length - 1];
}
function ia(e) {
  return C(oa(e)) ? e.pop() : void 0;
}
function sa(e) {
  return ra(oa(e)) ? e.pop() : void 0;
}
function ua(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        c(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      try {
        c(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      l.done ? i(l.value) : o(l.value).then(a, u);
    }
    c((r = r.apply(e, t || [])).next());
  });
}
function aa(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function qe(e) {
  return this instanceof qe ? ((this.v = e), this) : new qe(e);
}
function ca(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = {}),
    s("next"),
    s("throw"),
    s("return"),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    r[f] &&
      (o[f] = function (h) {
        return new Promise(function (p, M) {
          i.push([f, h, p, M]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      u(r[f](h));
    } catch (p) {
      d(i[0][3], p);
    }
  }
  function u(f) {
    f.value instanceof qe
      ? Promise.resolve(f.value.v).then(c, l)
      : d(i[0][2], f);
  }
  function c(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function d(f, h) {
    f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
  }
}
function la(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof aa == "function" ? aa(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, u) {
          (s = e[i](s)), o(a, u, s.done, s.value);
        });
      };
  }
  function o(i, s, a, u) {
    Promise.resolve(u).then(function (c) {
      i({ value: c, done: a });
    }, s);
  }
}
var Cn = (e) => e && typeof e.length == "number" && typeof e != "function";
function In(e) {
  return C(e?.then);
}
function bn(e) {
  return C(e[ct]);
}
function _n(e) {
  return Symbol.asyncIterator && C(e?.[Symbol.asyncIterator]);
}
function Mn(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Nd() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Tn = Nd();
function An(e) {
  return C(e?.[Tn]);
}
function xn(e) {
  return ca(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield qe(n.read());
        if (o) return yield qe(void 0);
        yield yield qe(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Sn(e) {
  return C(e?.getReader);
}
function Z(e) {
  if (e instanceof R) return e;
  if (e != null) {
    if (bn(e)) return Od(e);
    if (Cn(e)) return Fd(e);
    if (In(e)) return Rd(e);
    if (_n(e)) return da(e);
    if (An(e)) return Pd(e);
    if (Sn(e)) return kd(e);
  }
  throw Mn(e);
}
function Od(e) {
  return new R((t) => {
    let n = e[ct]();
    if (C(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Fd(e) {
  return new R((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function Rd(e) {
  return new R((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, Dn);
  });
}
function Pd(e) {
  return new R((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function da(e) {
  return new R((t) => {
    Ld(e, t).catch((n) => t.error(n));
  });
}
function kd(e) {
  return da(xn(e));
}
function Ld(e, t) {
  var n, r, o, i;
  return ua(this, void 0, void 0, function* () {
    try {
      for (n = la(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function oe(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function Nn(e, t = 0) {
  return W((n, r) => {
    n.subscribe(
      q(
        r,
        (o) => oe(r, e, () => r.next(o), t),
        () => oe(r, e, () => r.complete(), t),
        (o) => oe(r, e, () => r.error(o), t)
      )
    );
  });
}
function On(e, t = 0) {
  return W((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function fa(e, t) {
  return Z(e).pipe(On(t), Nn(t));
}
function ha(e, t) {
  return Z(e).pipe(On(t), Nn(t));
}
function pa(e, t) {
  return new R((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function ga(e, t) {
  return new R((n) => {
    let r;
    return (
      oe(n, t, () => {
        (r = e[Tn]()),
          oe(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0
          );
      }),
      () => C(r?.return) && r.return()
    );
  });
}
function Fn(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new R((n) => {
    oe(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      oe(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function ma(e, t) {
  return Fn(xn(e), t);
}
function ya(e, t) {
  if (e != null) {
    if (bn(e)) return fa(e, t);
    if (Cn(e)) return pa(e, t);
    if (In(e)) return ha(e, t);
    if (_n(e)) return Fn(e, t);
    if (An(e)) return ga(e, t);
    if (Sn(e)) return ma(e, t);
  }
  throw Mn(e);
}
function Ze(e, t) {
  return t ? ya(e, t) : Z(e);
}
function Rn(...e) {
  let t = sa(e);
  return Ze(e, t);
}
var va = st(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function uo(e, t) {
  let n = typeof t == "object";
  return new Promise((r, o) => {
    let i = new ke({
      next: (s) => {
        r(s), i.unsubscribe();
      },
      error: o,
      complete: () => {
        n ? r(t.defaultValue) : o(new va());
      },
    });
    e.subscribe(i);
  });
}
function Y(e, t) {
  return W((n, r) => {
    let o = 0;
    n.subscribe(
      q(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: Vd } = Array;
function jd(e, t) {
  return Vd(t) ? e(...t) : e(t);
}
function Da(e) {
  return Y((t) => jd(e, t));
}
var { isArray: Bd } = Array,
  { getPrototypeOf: $d, prototype: Ud, keys: Hd } = Object;
function wa(e) {
  if (e.length === 1) {
    let t = e[0];
    if (Bd(t)) return { args: t, keys: null };
    if (Gd(t)) {
      let n = Hd(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function Gd(e) {
  return e && typeof e == "object" && $d(e) === Ud;
}
function Ea(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function Ca(e, t, n, r, o, i, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && t.complete();
    },
    h = (M) => (c < r ? p(M) : u.push(M)),
    p = (M) => {
      i && t.next(M), c++;
      let m = !1;
      Z(n(M, l++)).subscribe(
        q(
          t,
          (g) => {
            o?.(g), i ? h(g) : t.next(g);
          },
          () => {
            m = !0;
          },
          void 0,
          () => {
            if (m)
              try {
                for (c--; u.length && c < r; ) {
                  let g = u.shift();
                  s ? oe(t, s, () => p(g)) : p(g);
                }
                f();
              } catch (g) {
                t.error(g);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      q(t, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Pn(e, t, n = 1 / 0) {
  return C(t)
    ? Pn((r, o) => Y((i, s) => t(r, i, o, s))(Z(e(r, o))), n)
    : (typeof t == "number" && (n = t), W((r, o) => Ca(r, o, e, n)));
}
function co(...e) {
  let t = ia(e),
    { args: n, keys: r } = wa(e),
    o = new R((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        u = s,
        c = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        Z(n[l]).subscribe(
          q(
            i,
            (f) => {
              d || ((d = !0), c--), (a[l] = f);
            },
            () => u--,
            void 0,
            () => {
              (!u || !d) && (c || i.next(r ? Ea(r, a) : a), i.complete());
            }
          )
        );
      }
    });
  return t ? o.pipe(Da(t)) : o;
}
function lo(e, t) {
  return W((n, r) => {
    let o = 0;
    n.subscribe(q(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function fo(e, t) {
  return C(t) ? Pn(e, t, 1) : Pn(e, 1);
}
function kn(e) {
  return W((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function ho(e, t) {
  return W((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      q(
        r,
        (u) => {
          o?.unsubscribe();
          let c = 0,
            l = i++;
          Z(e(u, l)).subscribe(
            (o = q(
              r,
              (d) => r.next(t ? t(u, d, l, c++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
var Wd = "https://g.co/ng/security#xss",
  D = class extends Error {
    constructor(t, n) {
      super(sr(t, n)), (this.code = t);
    }
  };
function sr(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function ar(e) {
  return { toString: e }.toString();
}
var ne = globalThis;
function x(e) {
  for (let t in e) if (e[t] === x) return t;
  throw Error("Could not find renamed property on target object.");
}
function qd(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function K(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(K).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function Ia(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
    ? e
    : e + " " + t;
}
var Zd = x({ __forward_ref__: x });
function ge(e) {
  return (
    (e.__forward_ref__ = ge),
    (e.toString = function () {
      return K(this());
    }),
    e
  );
}
function $(e) {
  return ou(e) ? e() : e;
}
function ou(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(Zd) && e.__forward_ref__ === ge
  );
}
function A(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function ae(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Ci(e) {
  return ba(e, iu) || ba(e, su);
}
function ba(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function Yd(e) {
  let t = e && (e[iu] || e[su]);
  return t || null;
}
function _a(e) {
  return e && (e.hasOwnProperty(Ma) || e.hasOwnProperty(Qd)) ? e[Ma] : null;
}
var iu = x({ ɵprov: x }),
  Ma = x({ ɵinj: x }),
  su = x({ ngInjectableDef: x }),
  Qd = x({ ngInjectorDef: x }),
  v = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = A({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function au(e) {
  return e && !!e.ɵproviders;
}
var Kd = x({ ɵcmp: x }),
  Jd = x({ ɵdir: x }),
  Xd = x({ ɵpipe: x }),
  ef = x({ ɵmod: x }),
  zn = x({ ɵfac: x }),
  Pt = x({ __NG_ELEMENT_ID__: x }),
  Ta = x({ __NG_ENV_ID__: x });
function uu(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function tf(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : uu(e);
}
function nf(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new D(-200, e);
}
function Ii(e, t) {
  throw new D(-201, !1);
}
var _ = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(_ || {}),
  Ao;
function cu() {
  return Ao;
}
function ie(e) {
  let t = Ao;
  return (Ao = e), t;
}
function lu(e, t, n) {
  let r = Ci(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & _.Optional) return null;
  if (t !== void 0) return t;
  Ii(e, "Injector");
}
var rf = {},
  Lt = rf,
  of = "__NG_DI_FLAG__",
  Wn = "ngTempTokenPath",
  sf = "ngTokenPath",
  af = /\n/gm,
  uf = "\u0275",
  Aa = "__source",
  ht;
function cf() {
  return ht;
}
function Ve(e) {
  let t = ht;
  return (ht = e), t;
}
function lf(e, t = _.Default) {
  if (ht === void 0) throw new D(-203, !1);
  return ht === null
    ? lu(e, void 0, t)
    : ht.get(e, t & _.Optional ? null : void 0, t);
}
function w(e, t = _.Default) {
  return (cu() || lf)($(e), t);
}
function T(e, t = _.Default) {
  return w(e, ur(t));
}
function ur(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function xo(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = $(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new D(900, !1);
      let o,
        i = _.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = df(a);
        typeof u == "number" ? (u === -1 ? (o = a.token) : (i |= u)) : (o = a);
      }
      t.push(w(o, i));
    } else t.push(w(r));
  }
  return t;
}
function df(e) {
  return e[of];
}
function ff(e, t, n, r) {
  let o = e[Wn];
  throw (
    (t[Aa] && o.unshift(t[Aa]),
    (e.message = hf(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[sf] = o),
    (e[Wn] = null),
    e)
  );
}
function hf(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == uf
      ? e.slice(2)
      : e;
  let o = K(t);
  if (Array.isArray(t)) o = t.map(K).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : K(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    af,
    `
  `
  )}`;
}
function gt(e, t) {
  let n = e.hasOwnProperty(zn);
  return n ? e[zn] : null;
}
function bi(e, t) {
  e.forEach((n) => (Array.isArray(n) ? bi(n, t) : t(n)));
}
function pf(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function du(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function gf(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = n);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = n), (e[t + 1] = r);
  }
}
function mf(e, t, n) {
  let r = Yt(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), gf(e, r, t, n)), r;
}
function po(e, t) {
  let n = Yt(e, t);
  if (n >= 0) return e[n | 1];
}
function Yt(e, t) {
  return yf(e, t, 1);
}
function yf(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var mt = {},
  se = [],
  Vt = new v(""),
  fu = new v("", -1),
  hu = new v(""),
  qn = class {
    get(t, n = Lt) {
      if (n === Lt) {
        let r = new Error(`NullInjectorError: No provider for ${K(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  pu = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(pu || {}),
  Ee = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(Ee || {}),
  X = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(X || {});
function vf(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
function So(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      wf(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function Df(e) {
  return e === 3 || e === 4 || e === 6;
}
function wf(e) {
  return e.charCodeAt(0) === 64;
}
function jt(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? xa(e, n, o, null, t[++r])
              : xa(e, n, o, null, null));
      }
    }
  return e;
}
function xa(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
var gu = "ng-template";
function Ef(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && vf(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (_i(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function _i(e) {
  return e.type === 4 && e.value !== gu;
}
function Cf(e, t, n) {
  let r = e.type === 4 && !n ? gu : e.value;
  return t === r;
}
function If(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Mf(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let u = t[a];
    if (typeof u == "number") {
      if (!s && !fe(r) && !fe(u)) return !1;
      if (s && fe(u)) continue;
      (s = !1), (r = u | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (u !== "" && !Cf(e, u, n)) || (u === "" && t.length === 1))
        ) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Ef(e, o, u, n)) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          l = bf(u, o, _i(e), n);
        if (l === -1) {
          if (fe(r)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let d;
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), r & 2 && c !== d)
          ) {
            if (fe(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return fe(r) || s;
}
function fe(e) {
  return (e & 1) === 0;
}
function bf(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return Tf(t, e);
}
function _f(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (If(e, t[r], n)) return !0;
  return !1;
}
function Mf(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Df(n)) return t;
  }
  return e.length;
}
function Tf(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function Sa(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Af(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !fe(s) && ((t += Sa(i, o)), (o = "")),
        (r = s),
        (i = i || !fe(r));
    n++;
  }
  return o !== "" && (t += Sa(i, o)), t;
}
function xf(e) {
  return e.map(Af).join(",");
}
function Sf(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!fe(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function mu(e) {
  return ar(() => {
    let t = Du(e),
      n = G(L({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === pu.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ee.Emulated,
        styles: e.styles || se,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    wu(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Oa(r, !1)), (n.pipeDefs = Oa(r, !0)), (n.id = Pf(n)), n
    );
  });
}
function Nf(e) {
  return cr(e) || yu(e);
}
function Of(e) {
  return e !== null;
}
function ue(e) {
  return ar(() => ({
    type: e.type,
    bootstrap: e.bootstrap || se,
    declarations: e.declarations || se,
    imports: e.imports || se,
    exports: e.exports || se,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function Na(e, t) {
  if (e == null) return mt;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = X.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== X.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function j(e) {
  return ar(() => {
    let t = Du(e);
    return wu(t), t;
  });
}
function cr(e) {
  return e[Kd] || null;
}
function yu(e) {
  return e[Jd] || null;
}
function vu(e) {
  return e[Xd] || null;
}
function Ff(e) {
  let t = cr(e) || yu(e) || vu(e);
  return t !== null ? t.standalone : !1;
}
function Rf(e, t) {
  let n = e[ef] || null;
  if (!n && t === !0)
    throw new Error(`Type ${K(e)} does not have '\u0275mod' property.`);
  return n;
}
function Du(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || mt,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || se,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Na(e.inputs, t),
    outputs: Na(e.outputs),
    debugInfo: null,
  };
}
function wu(e) {
  e.features?.forEach((t) => t(e));
}
function Oa(e, t) {
  if (!e) return null;
  let n = t ? vu : Nf;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Of);
}
function Pf(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join("|");
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function Mi(e) {
  return { ɵproviders: e };
}
function kf(...e) {
  return { ɵproviders: Lf(!0, e), ɵfromNgModule: !0 };
}
function Lf(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    bi(t, (s) => {
      let a = s;
      No(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Eu(o, i),
    n
  );
}
function Eu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    Ti(o, (i) => {
      t(i, r);
    });
  }
}
function No(e, t, n, r) {
  if (((e = $(e)), !e)) return !1;
  let o = null,
    i = _a(e),
    s = !i && cr(e);
  if (!i && !s) {
    let u = e.ngModule;
    if (((i = _a(u)), i)) o = u;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let u =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of u) No(c, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let c;
      try {
        bi(i.imports, (l) => {
          No(l, t, n, r) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && Eu(c, t);
    }
    if (!a) {
      let c = gt(o) || (() => new o());
      t({ provide: o, useFactory: c, deps: se }, o),
        t({ provide: hu, useValue: o, multi: !0 }, o),
        t({ provide: Vt, useValue: () => w(o), multi: !0 }, o);
    }
    let u = i.providers;
    if (u != null && !a) {
      let c = e;
      Ti(u, (l) => {
        t(l, c);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function Ti(e, t) {
  for (let n of e)
    au(n) && (n = n.ɵproviders), Array.isArray(n) ? Ti(n, t) : t(n);
}
var Vf = x({ provide: String, useValue: x });
function Cu(e) {
  return e !== null && typeof e == "object" && Vf in e;
}
function jf(e) {
  return !!(e && e.useExisting);
}
function Bf(e) {
  return !!(e && e.useFactory);
}
function yt(e) {
  return typeof e == "function";
}
function $f(e) {
  return !!e.useClass;
}
var lr = new v(""),
  Bn = {},
  Uf = {},
  go;
function Iu() {
  return go === void 0 && (go = new qn()), go;
}
var Be = class {},
  Zn = class extends Be {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Fo(t, (s) => this.processProvider(s)),
        this.records.set(fu, lt(void 0, this)),
        o.has("environment") && this.records.set(Be, lt(void 0, this));
      let i = this.records.get(lr);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(hu, se, _.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = b(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          b(t);
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      this.assertNotDestroyed();
      let n = Ve(this),
        r = ie(void 0),
        o;
      try {
        return t();
      } finally {
        Ve(n), ie(r);
      }
    }
    get(t, n = Lt, r = _.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(Ta))) return t[Ta](this);
      r = ur(r);
      let o,
        i = Ve(this),
        s = ie(void 0);
      try {
        if (!(r & _.SkipSelf)) {
          let u = this.records.get(t);
          if (u === void 0) {
            let c = qf(t) && Ci(t);
            c && this.injectableDefInScope(c)
              ? (u = lt(Oo(t), Bn))
              : (u = null),
              this.records.set(t, u);
          }
          if (u != null) return this.hydrate(t, u);
        }
        let a = r & _.Self ? Iu() : this.parent;
        return (n = r & _.Optional && n === Lt ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Wn] = a[Wn] || []).unshift(K(t)), i)) throw a;
          return ff(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        ie(s), Ve(i);
      }
    }
    resolveInjectorInitializers() {
      let t = b(null),
        n = Ve(this),
        r = ie(void 0),
        o;
      try {
        let i = this.get(Vt, se, _.Self);
        for (let s of i) s();
      } finally {
        Ve(n), ie(r), b(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(K(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new D(205, !1);
    }
    processProvider(t) {
      t = $(t);
      let n = yt(t) ? t : $(t && t.provide),
        r = Gf(t);
      if (!yt(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = lt(void 0, Bn, !0)),
          (o.factory = () => xo(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = b(null);
      try {
        return (
          n.value === Bn && ((n.value = Uf), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            Wf(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        b(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = $(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function Oo(e) {
  let t = Ci(e),
    n = t !== null ? t.factory : gt(e);
  if (n !== null) return n;
  if (e instanceof v) throw new D(204, !1);
  if (e instanceof Function) return Hf(e);
  throw new D(204, !1);
}
function Hf(e) {
  if (e.length > 0) throw new D(204, !1);
  let n = Yd(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function Gf(e) {
  if (Cu(e)) return lt(void 0, e.useValue);
  {
    let t = bu(e);
    return lt(t, Bn);
  }
}
function bu(e, t, n) {
  let r;
  if (yt(e)) {
    let o = $(e);
    return gt(o) || Oo(o);
  } else if (Cu(e)) r = () => $(e.useValue);
  else if (Bf(e)) r = () => e.useFactory(...xo(e.deps || []));
  else if (jf(e)) r = () => w($(e.useExisting));
  else {
    let o = $(e && (e.useClass || e.provide));
    if (zf(e)) r = () => new o(...xo(e.deps));
    else return gt(o) || Oo(o);
  }
  return r;
}
function lt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function zf(e) {
  return !!e.deps;
}
function Wf(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function qf(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof v);
}
function Fo(e, t) {
  for (let n of e)
    Array.isArray(n) ? Fo(n, t) : n && au(n) ? Fo(n.ɵproviders, t) : t(n);
}
function _u(e, t) {
  e instanceof Zn && e.assertNotDestroyed();
  let n,
    r = Ve(e),
    o = ie(void 0);
  try {
    return t();
  } finally {
    Ve(r), ie(o);
  }
}
function Zf() {
  return cu() !== void 0 || cf() != null;
}
function Yf(e) {
  let t = ne.ng;
  if (t && t.ɵcompilerFacade) return t.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
var Se = 0,
  E = 1,
  y = 2,
  re = 3,
  he = 4,
  be = 5,
  Bt = 6,
  $t = 7,
  B = 8,
  vt = 9,
  Ce = 10,
  U = 11,
  Ut = 12,
  Fa = 13,
  It = 14,
  Ie = 15,
  dr = 16,
  dt = 17,
  Dt = 18,
  fr = 19,
  Mu = 20,
  je = 21,
  mo = 22,
  Qe = 23,
  pe = 25,
  Tu = 1;
var Ht = 7,
  Qf = 8,
  Yn = 9,
  J = 10,
  Ai = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(Ai || {});
function Ye(e) {
  return Array.isArray(e) && typeof e[Tu] == "object";
}
function tt(e) {
  return Array.isArray(e) && e[Tu] === !0;
}
function Au(e) {
  return (e.flags & 4) !== 0;
}
function xi(e) {
  return e.componentOffset > -1;
}
function Si(e) {
  return (e.flags & 1) === 1;
}
function $e(e) {
  return !!e.template;
}
function Kf(e) {
  return (e[y] & 512) !== 0;
}
var Ro = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function xu(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function bt() {
  return Su;
}
function Su(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Xf), Jf;
}
bt.ngInherit = !0;
function Jf() {
  let e = Ou(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === mt) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function Xf(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Ou(e) || eh(e, { previous: mt, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[i];
  (a[i] = new Ro(c && c.currentValue, n, u === mt)), xu(e, t, o, n);
}
var Nu = "__ngSimpleChanges__";
function Ou(e) {
  return e[Nu] || null;
}
function eh(e, t) {
  return (e[Nu] = t);
}
var Ra = null;
var De = function (e, t, n) {
    Ra?.(e, t, n);
  },
  th = "svg",
  nh = "math",
  rh = !1;
function oh() {
  return rh;
}
function Te(e) {
  for (; Array.isArray(e); ) e = e[Se];
  return e;
}
function ih(e, t) {
  return Te(t[e]);
}
function me(e, t) {
  return Te(t[e.index]);
}
function Ni(e, t) {
  return e.data[t];
}
function nt(e, t) {
  let n = t[e];
  return Ye(n) ? n : n[Se];
}
function Oi(e) {
  return (e[y] & 128) === 128;
}
function Qn(e, t) {
  return t == null ? null : e[t];
}
function Fu(e) {
  e[dt] = 0;
}
function sh(e) {
  e[y] & 1024 || ((e[y] |= 1024), Oi(e) && Gt(e));
}
function ah(e, t) {
  for (; e > 0; ) (t = t[It]), e--;
  return t;
}
function Fi(e) {
  return !!(e[y] & 9216 || e[Qe]?.dirty);
}
function Po(e) {
  e[Ce].changeDetectionScheduler?.notify(1),
    Fi(e)
      ? Gt(e)
      : e[y] & 64 &&
        (oh()
          ? ((e[y] |= 1024), Gt(e))
          : e[Ce].changeDetectionScheduler?.notify());
}
function Gt(e) {
  e[Ce].changeDetectionScheduler?.notify();
  let t = zt(e);
  for (; t !== null && !(t[y] & 8192 || ((t[y] |= 8192), !Oi(t))); ) t = zt(t);
}
function Ru(e, t) {
  if ((e[y] & 256) === 256) throw new D(911, !1);
  e[je] === null && (e[je] = []), e[je].push(t);
}
function uh(e, t) {
  if (e[je] === null) return;
  let n = e[je].indexOf(t);
  n !== -1 && e[je].splice(n, 1);
}
function zt(e) {
  let t = e[re];
  return tt(t) ? t[re] : t;
}
var I = { lFrame: Hu(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function ch() {
  return I.lFrame.elementDepthCount;
}
function lh() {
  I.lFrame.elementDepthCount++;
}
function dh() {
  I.lFrame.elementDepthCount--;
}
function Pu() {
  return I.bindingsEnabled;
}
function fh() {
  return I.skipHydrationRootTNode !== null;
}
function hh(e) {
  return I.skipHydrationRootTNode === e;
}
function ph() {
  I.skipHydrationRootTNode = null;
}
function P() {
  return I.lFrame.lView;
}
function ye() {
  return I.lFrame.tView;
}
function ku(e) {
  return (I.lFrame.contextLView = e), e[B];
}
function Lu(e) {
  return (I.lFrame.contextLView = null), e;
}
function Ne() {
  let e = Vu();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function Vu() {
  return I.lFrame.currentTNode;
}
function gh() {
  let e = I.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Qt(e, t) {
  let n = I.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function ju() {
  return I.lFrame.isParent;
}
function mh() {
  I.lFrame.isParent = !1;
}
function yh(e) {
  return (I.lFrame.bindingIndex = e);
}
function hr() {
  return I.lFrame.bindingIndex++;
}
function vh(e) {
  let t = I.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function Dh() {
  return I.lFrame.inI18n;
}
function wh(e, t) {
  let n = I.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), ko(t);
}
function Eh() {
  return I.lFrame.currentDirectiveIndex;
}
function ko(e) {
  I.lFrame.currentDirectiveIndex = e;
}
function Ch(e) {
  let t = I.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function Bu(e) {
  I.lFrame.currentQueryIndex = e;
}
function Ih(e) {
  let t = e[E];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[be] : null;
}
function $u(e, t, n) {
  if (n & _.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & _.Host); )
      if (((o = Ih(i)), o === null || ((i = i[It]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (I.lFrame = Uu());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function Ri(e) {
  let t = Uu(),
    n = e[E];
  (I.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function Uu() {
  let e = I.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Hu(e) : t;
}
function Hu(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function Gu() {
  let e = I.lFrame;
  return (I.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var zu = Gu;
function Pi() {
  let e = Gu();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function bh(e) {
  return (I.lFrame.contextLView = ah(e, I.lFrame.contextLView))[B];
}
function _t() {
  return I.lFrame.selectedIndex;
}
function Ke(e) {
  I.lFrame.selectedIndex = e;
}
function Wu() {
  let e = I.lFrame;
  return Ni(e.tView, e.selectedIndex);
}
function _h() {
  return I.lFrame.currentNamespace;
}
var qu = !0;
function ki() {
  return qu;
}
function Li(e) {
  qu = e;
}
function Mh(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = Su(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function Vi(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      u && (e.viewHooks ??= []).push(-n, u),
      c &&
        ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function $n(e, t, n) {
  Zu(e, t, 3, n);
}
function Un(e, t, n, r) {
  (e[y] & 3) === n && Zu(e, t, n, r);
}
function yo(e, t) {
  let n = e[y];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[y] = n));
}
function Zu(e, t, n, r) {
  let o = r !== void 0 ? e[dt] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let u = o; u < s; u++)
    if (typeof t[u + 1] == "number") {
      if (((a = t[u]), r != null && a >= r)) break;
    } else
      t[u] < 0 && (e[dt] += 65536),
        (a < i || i == -1) &&
          (Th(e, n, t, u), (e[dt] = (e[dt] & 4294901760) + u + 2)),
        u++;
}
function Pa(e, t) {
  De(4, e, t);
  let n = b(null);
  try {
    t.call(e);
  } finally {
    b(n), De(5, e, t);
  }
}
function Th(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[y] >> 14 < e[dt] >> 16 &&
      (e[y] & 3) === t &&
      ((e[y] += 16384), Pa(a, i))
    : Pa(a, i);
}
var pt = -1,
  Je = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function Ah(e) {
  return e instanceof Je;
}
function xh(e) {
  return (e.flags & 8) !== 0;
}
function Sh(e) {
  return (e.flags & 16) !== 0;
}
function Nh(e) {
  return e !== pt;
}
function Lo(e) {
  return e & 32767;
}
function Oh(e) {
  return e >> 16;
}
function Vo(e, t) {
  let n = Oh(e),
    r = t;
  for (; n > 0; ) (r = r[It]), n--;
  return r;
}
var jo = !0;
function ka(e) {
  let t = jo;
  return (jo = e), t;
}
var Fh = 256,
  Yu = Fh - 1,
  Qu = 5,
  Rh = 0,
  we = {};
function Ph(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Pt) && (r = n[Pt]),
    r == null && (r = n[Pt] = Rh++);
  let o = r & Yu,
    i = 1 << o;
  t.data[e + (o >> Qu)] |= i;
}
function Kn(e, t) {
  let n = Ku(e, t);
  if (n !== -1) return n;
  let r = t[E];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    vo(r.data, e),
    vo(t, null),
    vo(r.blueprint, null));
  let o = Ju(e, t),
    i = e.injectorIndex;
  if (Nh(o)) {
    let s = Lo(o),
      a = Vo(o, t),
      u = a[E].data;
    for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
  }
  return (t[i + 8] = o), i;
}
function vo(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Ku(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Ju(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = rc(o)), r === null)) return pt;
    if ((n++, (o = o[It]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return pt;
}
function Bo(e, t, n) {
  Ph(e, t, n);
}
function Xu(e, t, n) {
  if (n & _.Optional || e !== void 0) return e;
  Ii(t, "NodeInjector");
}
function ec(e, t, n, r) {
  if (
    (n & _.Optional && r === void 0 && (r = null), !(n & (_.Self | _.Host)))
  ) {
    let o = e[vt],
      i = ie(void 0);
    try {
      return o ? o.get(t, r, n & _.Optional) : lu(t, r, n & _.Optional);
    } finally {
      ie(i);
    }
  }
  return Xu(r, t, n);
}
function tc(e, t, n, r = _.Default, o) {
  if (e !== null) {
    if (t[y] & 2048 && !(r & _.Self)) {
      let s = Bh(e, t, n, r, we);
      if (s !== we) return s;
    }
    let i = nc(e, t, n, r, we);
    if (i !== we) return i;
  }
  return ec(t, n, r, o);
}
function nc(e, t, n, r, o) {
  let i = Vh(n);
  if (typeof i == "function") {
    if (!$u(t, e, r)) return r & _.Host ? Xu(o, n, r) : ec(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & _.Optional))) Ii(n);
      else return s;
    } finally {
      zu();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Ku(e, t),
      u = pt,
      c = r & _.Host ? t[Ie][be] : null;
    for (
      (a === -1 || r & _.SkipSelf) &&
      ((u = a === -1 ? Ju(e, t) : t[a + 8]),
      u === pt || !Va(r, !1)
        ? (a = -1)
        : ((s = t[E]), (a = Lo(u)), (t = Vo(u, t))));
      a !== -1;

    ) {
      let l = t[E];
      if (La(i, a, l.data)) {
        let d = kh(a, t, n, s, r, c);
        if (d !== we) return d;
      }
      (u = t[a + 8]),
        u !== pt && Va(r, t[E].data[a + 8] === c) && La(i, a, t)
          ? ((s = l), (a = Lo(u)), (t = Vo(u, t)))
          : (a = -1);
    }
  }
  return o;
}
function kh(e, t, n, r, o, i) {
  let s = t[E],
    a = s.data[e + 8],
    u = r == null ? xi(a) && jo : r != s && (a.type & 3) !== 0,
    c = o & _.Host && i === a,
    l = Lh(a, s, n, u, c);
  return l !== null ? wt(t, s, l, a) : we;
}
function Lh(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    u = e.directiveStart,
    c = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    f = o ? a + l : c;
  for (let h = d; h < f; h++) {
    let p = s[h];
    if ((h < u && n === p) || (h >= u && p.type === n)) return h;
  }
  if (o) {
    let h = s[u];
    if (h && $e(h) && h.type === n) return u;
  }
  return null;
}
function wt(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (Ah(o)) {
    let s = o;
    s.resolving && nf(tf(i[n]));
    let a = ka(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? ie(s.injectImpl) : null,
      l = $u(e, r, _.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Mh(n, i[n], t);
    } finally {
      c !== null && ie(c), ka(a), (s.resolving = !1), zu();
    }
  }
  return o;
}
function Vh(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(Pt) ? e[Pt] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & Yu : jh) : t;
}
function La(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Qu)] & r);
}
function Va(e, t) {
  return !(e & _.Self) && !(e & _.Host && t);
}
var Jn = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return tc(this._tNode, this._lView, t, ur(r), n);
  }
};
function jh() {
  return new Jn(Ne(), P());
}
function Mt(e) {
  return ar(() => {
    let t = e.prototype.constructor,
      n = t[zn] || $o(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[zn] || $o(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function $o(e) {
  return ou(e)
    ? () => {
        let t = $o($(e));
        return t && t();
      }
    : gt(e);
}
function Bh(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[y] & 2048 && !(s[y] & 512); ) {
    let a = nc(i, s, n, r | _.Self, we);
    if (a !== we) return a;
    let u = i.parent;
    if (!u) {
      let c = s[Mu];
      if (c) {
        let l = c.get(n, we, r);
        if (l !== we) return l;
      }
      (u = rc(s)), (s = s[It]);
    }
    i = u;
  }
  return o;
}
function rc(e) {
  let t = e[E],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[be] : null;
}
function ja(e, t = null, n = null, r) {
  let o = oc(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function oc(e, t = null, n = null, r, o = new Set()) {
  let i = [n || se, kf(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : K(e))),
    new Zn(i, t || Iu(), r || null, o)
  );
}
var Tt = (() => {
  let t = class t {
    static create(r, o) {
      if (Array.isArray(r)) return ja({ name: "" }, o, r, "");
      {
        let i = r.name ?? "";
        return ja({ name: i }, r.parent, r.providers, i);
      }
    }
  };
  (t.THROW_IF_NOT_FOUND = Lt),
    (t.NULL = new qn()),
    (t.ɵprov = A({ token: t, providedIn: "any", factory: () => w(fu) })),
    (t.__NG_ELEMENT_ID__ = -1);
  let e = t;
  return e;
})();
var $h = "ngOriginalError";
function Do(e) {
  return e[$h];
}
var Ae = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(t) {
      let n = t && Do(t);
      for (; n && Do(n); ) n = Do(n);
      return n || null;
    }
  },
  ic = new v("", {
    providedIn: "root",
    factory: () => T(Ae).handleError.bind(void 0),
  }),
  sc = (() => {
    let t = class t {};
    (t.__NG_ELEMENT_ID__ = Uh), (t.__NG_ENV_ID__ = (r) => r);
    let e = t;
    return e;
  })(),
  Uo = class extends sc {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return Ru(this._lView, t), () => uh(this._lView, t);
    }
  };
function Uh() {
  return new Uo(P());
}
function Hh() {
  return ac(Ne(), P());
}
function ac(e, t) {
  return new At(me(e, t));
}
var At = (() => {
  let t = class t {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  t.__NG_ELEMENT_ID__ = Hh;
  let e = t;
  return e;
})();
var Ho = class extends Le {
  constructor(t = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = t),
      Zf() && (this.destroyRef = T(sc, { optional: !0 }) ?? void 0);
  }
  emit(t) {
    let n = b(null);
    try {
      super.next(t);
    } finally {
      b(n);
    }
  }
  subscribe(t, n, r) {
    let o = t,
      i = n || (() => null),
      s = r;
    if (t && typeof t == "object") {
      let u = t;
      (o = u.next?.bind(u)), (i = u.error?.bind(u)), (s = u.complete?.bind(u));
    }
    this.__isAsync && ((i = wo(i)), o && (o = wo(o)), s && (s = wo(s)));
    let a = super.subscribe({ next: o, error: i, complete: s });
    return t instanceof z && t.add(a), a;
  }
};
function wo(e) {
  return (t) => {
    setTimeout(e, void 0, t);
  };
}
var Q = Ho;
function uc(e) {
  return (e.flags & 128) === 128;
}
var cc = new Map(),
  Gh = 0;
function zh() {
  return Gh++;
}
function Wh(e) {
  cc.set(e[fr], e);
}
function qh(e) {
  cc.delete(e[fr]);
}
var Ba = "__ngContext__";
function Xe(e, t) {
  Ye(t) ? ((e[Ba] = t[fr]), Wh(t)) : (e[Ba] = t);
}
function lc(e) {
  return fc(e[Ut]);
}
function dc(e) {
  return fc(e[he]);
}
function fc(e) {
  for (; e !== null && !tt(e); ) e = e[he];
  return e;
}
var Go;
function hc(e) {
  Go = e;
}
function Zh() {
  if (Go !== void 0) return Go;
  if (typeof document < "u") return document;
  throw new D(210, !1);
}
var pr = new v("", { providedIn: "root", factory: () => Yh }),
  Yh = "ng",
  ji = new v(""),
  Ue = new v("", { providedIn: "platform", factory: () => "unknown" });
var Bi = new v("", {
  providedIn: "root",
  factory: () =>
    Zh().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var Qh = "h",
  Kh = "b";
var Jh = () => null;
function $i(e, t, n = !1) {
  return Jh(e, t, n);
}
var pc = !1,
  Xh = new v("", { providedIn: "root", factory: () => pc });
var zo = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Wd})`;
  }
};
function Ui(e) {
  return e instanceof zo ? e.changingThisBreaksApplicationSecurity : e;
}
function ep(e) {
  return e instanceof Function ? e() : e;
}
var xe = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(xe || {}),
  tp;
function Hi(e, t) {
  return tp(e, t);
}
function ft(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    tt(r) ? (i = r) : Ye(r) && ((s = !0), (r = r[Se]));
    let a = Te(r);
    e === 0 && n !== null
      ? o == null
        ? vc(t, n, a)
        : Wo(t, n, a, o || null, !0)
      : e === 1 && n !== null
      ? Wo(t, n, a, o || null, !0)
      : e === 2
      ? mp(t, a, s)
      : e === 3 && t.destroyNode(a),
      i != null && vp(t, e, i, n, o);
  }
}
function np(e, t) {
  return e.createText(t);
}
function gc(e, t, n) {
  return e.createElement(t, n);
}
function rp(e, t) {
  mc(e, t), (t[Se] = null), (t[be] = null);
}
function op(e, t, n, r, o, i) {
  (r[Se] = o), (r[be] = t), gr(e, r, n, 1, o, i);
}
function mc(e, t) {
  t[Ce].changeDetectionScheduler?.notify(1), gr(e, t, t[U], 2, null, null);
}
function ip(e) {
  let t = e[Ut];
  if (!t) return Eo(e[E], e);
  for (; t; ) {
    let n = null;
    if (Ye(t)) n = t[Ut];
    else {
      let r = t[J];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[he] && t !== e; ) Ye(t) && Eo(t[E], t), (t = t[re]);
      t === null && (t = e), Ye(t) && Eo(t[E], t), (n = t && t[he]);
    }
    t = n;
  }
}
function sp(e, t, n, r) {
  let o = J + r,
    i = n.length;
  r > 0 && (n[o - 1][he] = t),
    r < i - J ? ((t[he] = n[o]), pf(n, J + r, t)) : (n.push(t), (t[he] = null)),
    (t[re] = n);
  let s = t[dr];
  s !== null && n !== s && ap(s, t);
  let a = t[Dt];
  a !== null && a.insertView(e), Po(t), (t[y] |= 128);
}
function ap(e, t) {
  let n = e[Yn],
    o = t[re][re][Ie];
  t[Ie] !== o && (e[y] |= Ai.HasTransplantedViews),
    n === null ? (e[Yn] = [t]) : n.push(t);
}
function yc(e, t) {
  let n = e[Yn],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Gi(e, t) {
  if (e.length <= J) return;
  let n = J + t,
    r = e[n];
  if (r) {
    let o = r[dr];
    o !== null && o !== e && yc(o, r), t > 0 && (e[n - 1][he] = r[he]);
    let i = du(e, J + t);
    rp(r[E], r);
    let s = i[Dt];
    s !== null && s.detachView(i[E]),
      (r[re] = null),
      (r[he] = null),
      (r[y] &= -129);
  }
  return r;
}
function zi(e, t) {
  if (!(t[y] & 256)) {
    let n = t[U];
    n.destroyNode && gr(e, t, n, 3, null, null), ip(t);
  }
}
function Eo(e, t) {
  if (t[y] & 256) return;
  let n = b(null);
  try {
    (t[y] &= -129),
      (t[y] |= 256),
      t[Qe] && Ws(t[Qe]),
      cp(e, t),
      up(e, t),
      t[E].type === 1 && t[U].destroy();
    let r = t[dr];
    if (r !== null && tt(t[re])) {
      r !== t[re] && yc(r, t);
      let o = t[Dt];
      o !== null && o.detachView(e);
    }
    qh(t);
  } finally {
    b(n);
  }
}
function up(e, t) {
  let n = e.cleanup,
    r = t[$t];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == "string") {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[$t] = null);
  let o = t[je];
  if (o !== null) {
    t[je] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function cp(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof Je)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              u = i[s + 1];
            De(4, a, u);
            try {
              u.call(a);
            } finally {
              De(5, a, u);
            }
          }
        else {
          De(4, o, i);
          try {
            i.call(o);
          } finally {
            De(5, o, i);
          }
        }
      }
    }
}
function lp(e, t, n) {
  return dp(e, t.parent, n);
}
function dp(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 40; ) (t = r), (r = t.parent);
  if (r === null) return n[Se];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === Ee.None || i === Ee.Emulated) return null;
    }
    return me(r, n);
  }
}
function Wo(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function vc(e, t, n) {
  e.appendChild(t, n);
}
function $a(e, t, n, r, o) {
  r !== null ? Wo(e, t, n, r, o) : vc(e, t, n);
}
function fp(e, t, n, r) {
  e.removeChild(t, n, r);
}
function Dc(e, t) {
  return e.parentNode(t);
}
function hp(e, t, n) {
  return gp(e, t, n);
}
function pp(e, t, n) {
  return e.type & 40 ? me(e, n) : null;
}
var gp = pp,
  Ua;
function Wi(e, t, n, r) {
  let o = lp(e, r, t),
    i = t[U],
    s = r.parent || t[be],
    a = hp(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) $a(i, o, n[u], a, !1);
    else $a(i, o, n, a, !1);
  Ua !== void 0 && Ua(i, r, t, n, o);
}
function Hn(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return me(t, e);
    if (n & 4) return qo(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return Hn(e, r);
      {
        let o = e[t.index];
        return tt(o) ? qo(-1, o) : Te(o);
      }
    } else {
      if (n & 32) return Hi(t, e)() || Te(e[t.index]);
      {
        let r = wc(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = zt(e[Ie]);
          return Hn(o, r);
        } else return Hn(e, t.next);
      }
    }
  }
  return null;
}
function wc(e, t) {
  if (t !== null) {
    let r = e[Ie][be],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function qo(e, t) {
  let n = J + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[E].firstChild;
    if (o !== null) return Hn(r, o);
  }
  return t[Ht];
}
function mp(e, t, n) {
  let r = Dc(e, t);
  r && fp(e, r, t, n);
}
function qi(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    let a = r[n.index],
      u = n.type;
    if (
      (s && t === 0 && (a && Xe(Te(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) qi(e, t, n.child, r, o, i, !1), ft(t, e, o, a, i);
      else if (u & 32) {
        let c = Hi(n, r),
          l;
        for (; (l = c()); ) ft(t, e, o, l, i);
        ft(t, e, o, a, i);
      } else u & 16 ? yp(e, t, r, n, o, i) : ft(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function gr(e, t, n, r, o, i) {
  qi(n, r, e.firstChild, t, o, i, !1);
}
function yp(e, t, n, r, o, i) {
  let s = n[Ie],
    u = s[be].projection[r.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      ft(t, e, o, l, i);
    }
  else {
    let c = u,
      l = s[re];
    uc(r) && (c.flags |= 128), qi(e, t, c, l, o, i, !0);
  }
}
function vp(e, t, n, r, o) {
  let i = n[Ht],
    s = Te(n);
  i !== s && ft(t, e, r, i, o);
  for (let a = J; a < n.length; a++) {
    let u = n[a];
    gr(u[E], u, e, t, r, i);
  }
}
function Dp(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : xe.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= xe.Important)),
        e.setStyle(n, r, o, i));
  }
}
function wp(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Ec(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Cc(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && So(e, t, r),
    o !== null && Ec(e, t, o),
    i !== null && wp(e, t, i);
}
var mr = {};
function Kt(e = 1) {
  Ic(ye(), P(), _t() + e, !1);
}
function Ic(e, t, n, r) {
  if (!r)
    if ((t[y] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && $n(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Un(t, i, 0, n);
    }
  Ke(n);
}
function S(e, t = _.Default) {
  let n = P();
  if (n === null) return w(e, t);
  let r = Ne();
  return tc(r, n, $(e), t);
}
function bc(e, t, n, r, o, i) {
  let s = b(null);
  try {
    let a = null;
    o & X.SignalBased && (a = t[r][Us]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & X.HasDecoratorInputTransform && (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : xu(t, a, r, i);
  } finally {
    b(s);
  }
}
function Ep(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) Ke(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          wh(s, i);
          let u = t[i];
          a(2, u);
        }
      }
    } finally {
      Ke(-1);
    }
}
function yr(e, t, n, r, o, i, s, a, u, c, l) {
  let d = t.blueprint.slice();
  return (
    (d[Se] = o),
    (d[y] = r | 4 | 128 | 8 | 64),
    (c !== null || (e && e[y] & 2048)) && (d[y] |= 2048),
    Fu(d),
    (d[re] = d[It] = e),
    (d[B] = n),
    (d[Ce] = s || (e && e[Ce])),
    (d[U] = a || (e && e[U])),
    (d[vt] = u || (e && e[vt]) || null),
    (d[be] = i),
    (d[fr] = zh()),
    (d[Bt] = l),
    (d[Mu] = c),
    (d[Ie] = t.type == 2 ? e[Ie] : d),
    d
  );
}
function vr(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = Cp(e, t, n, r, o)), Dh() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = gh();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Qt(i, !0), i;
}
function Cp(e, t, n, r, o) {
  let i = Vu(),
    s = ju(),
    a = s ? i : i && i.parent,
    u = (e.data[t] = Tp(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = u),
    i !== null &&
      (s
        ? i.child == null && u.parent !== null && (i.child = u)
        : i.next === null && ((i.next = u), (u.prev = i))),
    u
  );
}
function _c(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Mc(e, t, n, r, o) {
  let i = _t(),
    s = r & 2;
  try {
    Ke(-1), s && t.length > pe && Ic(e, t, pe, !1), De(s ? 2 : 0, o), n(r, o);
  } finally {
    Ke(i), De(s ? 3 : 1, o);
  }
}
function Tc(e, t, n) {
  if (Au(t)) {
    let r = b(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let u = n[s];
          a.contentQueries(1, u, s);
        }
      }
    } finally {
      b(r);
    }
  }
}
function Ac(e, t, n) {
  Pu() && (Rp(e, t, n, me(n, t)), (n.flags & 64) === 64 && Fc(e, t, n));
}
function xc(e, t, n = me) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function Sc(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Zi(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function Zi(e, t, n, r, o, i, s, a, u, c, l) {
  let d = pe + r,
    f = d + o,
    h = Ip(d, f),
    p = typeof c == "function" ? c() : c;
  return (h[E] = {
    type: e,
    blueprint: h,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: u,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function Ip(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : mr);
  return n;
}
function bp(e, t, n, r) {
  let i = r.get(Xh, pc) || n === Ee.ShadowDom,
    s = e.selectRootElement(t, i);
  return _p(s), s;
}
function _p(e) {
  Mp(e);
}
var Mp = () => null;
function Tp(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    fh() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Ha(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      u = X.None;
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s);
    let c = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      c = o[i];
    }
    e === 0 ? Ga(r, n, c, a, u) : Ga(r, n, c, a);
  }
  return r;
}
function Ga(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function Ap(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    u = null,
    c = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      f = n ? n.get(d) : null,
      h = f ? f.inputs : null,
      p = f ? f.outputs : null;
    (u = Ha(0, d.inputs, l, u, h)), (c = Ha(1, d.outputs, l, c, p));
    let M = u !== null && s !== null && !_i(t) ? zp(u, l, s) : null;
    a.push(M);
  }
  u !== null &&
    (u.hasOwnProperty("class") && (t.flags |= 8),
    u.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c);
}
function xp(e) {
  return e === "class"
    ? "className"
    : e === "for"
    ? "htmlFor"
    : e === "formaction"
    ? "formAction"
    : e === "innerHtml"
    ? "innerHTML"
    : e === "readonly"
    ? "readOnly"
    : e === "tabindex"
    ? "tabIndex"
    : e;
}
function Sp(e, t, n, r, o, i, s, a) {
  let u = me(t, n),
    c = t.inputs,
    l;
  !a && c != null && (l = c[r])
    ? (Qi(e, n, l, r, o), xi(t) && Np(n, t.index))
    : t.type & 3
    ? ((r = xp(r)),
      (o = s != null ? s(o, t.value || "", r) : o),
      i.setProperty(u, r, o))
    : t.type & 12;
}
function Np(e, t) {
  let n = nt(t, e);
  n[y] & 16 || (n[y] |= 64);
}
function Nc(e, t, n, r) {
  if (Pu()) {
    let o = r === null ? null : { "": -1 },
      i = kp(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && Oc(e, t, n, s, o, a),
      o && Lp(n, r, o);
  }
  n.mergedAttrs = jt(n.mergedAttrs, n.attrs);
}
function Oc(e, t, n, r, o, i) {
  for (let c = 0; c < r.length; c++) Bo(Kn(n, t), e, r[c].type);
  jp(n, e.data.length, r.length);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = _c(e, t, r.length, null);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    (n.mergedAttrs = jt(n.mergedAttrs, l.hostAttrs)),
      Bp(e, n, t, u, l),
      Vp(u, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      u++;
  }
  Ap(e, n, i);
}
function Op(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    Fp(s) != a && s.push(a), s.push(n, r, i);
  }
}
function Fp(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function Rp(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  xi(n) && $p(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || Kn(n, t),
    Xe(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let u = e.data[a],
      c = wt(t, e, a, n);
    if ((Xe(c, t), s !== null && Gp(t, a - o, c, u, n, s), $e(u))) {
      let l = nt(n.index, t);
      l[B] = wt(t, e, a, n);
    }
  }
}
function Fc(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = Eh();
  try {
    Ke(i);
    for (let a = r; a < o; a++) {
      let u = e.data[a],
        c = t[a];
      ko(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          Pp(u, c);
    }
  } finally {
    Ke(-1), ko(s);
  }
}
function Pp(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function kp(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (_f(t, s.selectors, !1))
        if ((r || (r = []), $e(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let u = a.length;
            Zo(e, t, u);
          } else r.unshift(s), Zo(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function Zo(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function Lp(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new D(-301, !1);
      r.push(t[o], i);
    }
  }
}
function Vp(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    $e(t) && (n[""] = e);
  }
}
function jp(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function Bp(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = gt(o.type, !0)),
    s = new Je(i, $e(o), S);
  (e.blueprint[r] = s), (n[r] = s), Op(e, t, r, _c(e, n, o.hostVars, mr), o);
}
function $p(e, t, n) {
  let r = me(t, e),
    o = Sc(n),
    i = e[Ce].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = Yi(
    e,
    yr(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null)
  );
  e[t.index] = a;
}
function Up(e, t, n, r, o, i) {
  let s = me(e, t);
  Hp(t[U], s, i, e.value, n, r, o);
}
function Hp(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? uu(i) : s(i, r || "", o);
    e.setAttribute(t, o, a, n);
  }
}
function Gp(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++];
      bc(r, n, u, c, l, d);
    }
}
function zp(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function Wp(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function Rc(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = b(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          Bu(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      b(r);
    }
  }
}
function Yi(e, t) {
  return e[Ut] ? (e[Fa][he] = t) : (e[Ut] = t), (e[Fa] = t), t;
}
function Yo(e, t, n) {
  Bu(0);
  let r = b(null);
  try {
    t(e, n);
  } finally {
    b(r);
  }
}
function qp(e) {
  return e[$t] || (e[$t] = []);
}
function Zp(e) {
  return e.cleanup || (e.cleanup = []);
}
function Pc(e, t) {
  let n = e[vt],
    r = n ? n.get(Ae, null) : null;
  r && r.handleError(t);
}
function Qi(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      u = n[i++],
      c = t[s],
      l = e.data[s];
    bc(l, c, r, a, u, o);
  }
}
function Yp(e, t) {
  let n = nt(t, e),
    r = n[E];
  Qp(r, n);
  let o = n[Se];
  o !== null && n[Bt] === null && (n[Bt] = $i(o, n[vt])), Ki(r, n, n[B]);
}
function Qp(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Ki(e, t, n) {
  Ri(t);
  try {
    let r = e.viewQuery;
    r !== null && Yo(1, r, n);
    let o = e.template;
    o !== null && Mc(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Dt]?.finishViewCreation(e),
      e.staticContentQueries && Rc(e, t),
      e.staticViewQueries && Yo(2, e.viewQuery, n);
    let i = e.components;
    i !== null && Kp(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[y] &= -5), Pi();
  }
}
function Kp(e, t) {
  for (let n = 0; n < t.length; n++) Yp(e, t[n]);
}
function Ji(e, t, n, r) {
  let o = b(null);
  try {
    let i = t.tView,
      a = e[y] & 4096 ? 4096 : 16,
      u = yr(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      c = e[t.index];
    u[dr] = c;
    let l = e[Dt];
    return l !== null && (u[Dt] = l.createEmbeddedView(i)), Ki(i, u, n), u;
  } finally {
    b(o);
  }
}
function kc(e, t) {
  let n = J + t;
  if (n < e.length) return e[n];
}
function Xi(e, t) {
  return !t || t.firstChild === null || uc(e);
}
function es(e, t, n, r = !0) {
  let o = t[E];
  if ((sp(o, t, e, n), r)) {
    let s = qo(n, e),
      a = t[U],
      u = Dc(a, e[Ht]);
    u !== null && op(o, e[be], a, t, u, s);
  }
  let i = t[Bt];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Lc(e, t) {
  let n = Gi(e, t);
  return n !== void 0 && zi(n[E], n), n;
}
function Xn(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    let i = t[n.index];
    i !== null && r.push(Te(i)), tt(i) && Jp(i, r);
    let s = n.type;
    if (s & 8) Xn(e, t, n.child, r);
    else if (s & 32) {
      let a = Hi(n, t),
        u;
      for (; (u = a()); ) r.push(u);
    } else if (s & 16) {
      let a = wc(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let u = zt(t[Ie]);
        Xn(u[E], u, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function Jp(e, t) {
  for (let n = J; n < e.length; n++) {
    let r = e[n],
      o = r[E].firstChild;
    o !== null && Xn(r[E], r, o, t);
  }
  e[Ht] !== e[Se] && t.push(e[Ht]);
}
var Vc = [];
function Xp(e) {
  return e[Qe] ?? eg(e);
}
function eg(e) {
  let t = Vc.pop() ?? Object.create(ng);
  return (t.lView = e), t;
}
function tg(e) {
  e.lView[Qe] !== e && ((e.lView = null), Vc.push(e));
}
var ng = G(L({}, Hs), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (e) => {
      Gt(e.lView);
    },
    consumerOnSignalRead() {
      this.lView[Qe] = this;
    },
  }),
  jc = 100;
function Bc(e, t = !0, n = 0) {
  let r = e[Ce],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    rg(e, n);
  } catch (s) {
    throw (t && Pc(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function rg(e, t) {
  Qo(e, t);
  let n = 0;
  for (; Fi(e); ) {
    if (n === jc) throw new D(103, !1);
    n++, Qo(e, 1);
  }
}
function og(e, t, n, r) {
  let o = t[y];
  if ((o & 256) === 256) return;
  let i = !1;
  !i && t[Ce].inlineEffectRunner?.flush(), Ri(t);
  let s = null,
    a = null;
  !i && ig(e) && ((a = Xp(t)), (s = Gs(a)));
  try {
    Fu(t), yh(e.bindingStartIndex), n !== null && Mc(e, t, n, 2, r);
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let d = e.preOrderCheckHooks;
        d !== null && $n(t, d, null);
      } else {
        let d = e.preOrderHooks;
        d !== null && Un(t, d, 0, null), yo(t, 0);
      }
    if ((sg(t), $c(t, 0), e.contentQueries !== null && Rc(e, t), !i))
      if (u) {
        let d = e.contentCheckHooks;
        d !== null && $n(t, d);
      } else {
        let d = e.contentHooks;
        d !== null && Un(t, d, 1), yo(t, 1);
      }
    Ep(e, t);
    let c = e.components;
    c !== null && Hc(t, c, 0);
    let l = e.viewQuery;
    if ((l !== null && Yo(2, l, r), !i))
      if (u) {
        let d = e.viewCheckHooks;
        d !== null && $n(t, d);
      } else {
        let d = e.viewHooks;
        d !== null && Un(t, d, 2), yo(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[mo])) {
      for (let d of t[mo]) d();
      t[mo] = null;
    }
    i || (t[y] &= -73);
  } catch (u) {
    throw (Gt(t), u);
  } finally {
    a !== null && (zs(a, s), tg(a)), Pi();
  }
}
function ig(e) {
  return e.type !== 2;
}
function $c(e, t) {
  for (let n = lc(e); n !== null; n = dc(n))
    for (let r = J; r < n.length; r++) {
      let o = n[r];
      Uc(o, t);
    }
}
function sg(e) {
  for (let t = lc(e); t !== null; t = dc(t)) {
    if (!(t[y] & Ai.HasTransplantedViews)) continue;
    let n = t[Yn];
    for (let r = 0; r < n.length; r++) {
      let o = n[r],
        i = o[re];
      sh(o);
    }
  }
}
function ag(e, t, n) {
  let r = nt(t, e);
  Uc(r, n);
}
function Uc(e, t) {
  Oi(e) && Qo(e, t);
}
function Qo(e, t) {
  let r = e[E],
    o = e[y],
    i = e[Qe],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Jr(i))),
    i && (i.dirty = !1),
    (e[y] &= -9217),
    s)
  )
    og(r, e, r.template, e[B]);
  else if (o & 8192) {
    $c(e, 1);
    let a = r.components;
    a !== null && Hc(e, a, 1);
  }
}
function Hc(e, t, n) {
  for (let r = 0; r < t.length; r++) ag(e, t[r], n);
}
function ts(e) {
  for (e[Ce].changeDetectionScheduler?.notify(); e; ) {
    e[y] |= 64;
    let t = zt(e);
    if (Kf(e) && !t) return e;
    e = t;
  }
  return null;
}
var Ko = class {
  get rootNodes() {
    let t = this._lView,
      n = t[E];
    return Xn(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[B];
  }
  set context(t) {
    this._lView[B] = t;
  }
  get destroyed() {
    return (this._lView[y] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[re];
      if (tt(t)) {
        let n = t[Qf],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Gi(t, r), du(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    zi(this._lView[E], this._lView);
  }
  onDestroy(t) {
    Ru(this._lView, t);
  }
  markForCheck() {
    ts(this._cdRefInjectingView || this._lView);
  }
  detach() {
    this._lView[y] &= -129;
  }
  reattach() {
    Po(this._lView), (this._lView[y] |= 128);
  }
  detectChanges() {
    (this._lView[y] |= 1024), Bc(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new D(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    (this._appRef = null), mc(this._lView[E], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new D(902, !1);
    (this._appRef = t), Po(this._lView);
  }
};
var vC = new RegExp(`^(\\d+)*(${Kh}|${Qh})*(.*)`);
var ug = () => null;
function ns(e, t) {
  return ug(e, t);
}
var Jo = class {},
  Xo = class {},
  er = class {};
function cg(e) {
  let t = Error(`No component factory found for ${K(e)}.`);
  return (t[lg] = e), t;
}
var lg = "ngComponent";
var ei = class {
    resolveComponentFactory(t) {
      throw cg(t);
    }
  },
  rs = (() => {
    let t = class t {};
    t.NULL = new ei();
    let e = t;
    return e;
  })(),
  Wt = class {},
  Jt = (() => {
    let t = class t {
      constructor() {
        this.destroyNode = null;
      }
    };
    t.__NG_ELEMENT_ID__ = () => dg();
    let e = t;
    return e;
  })();
function dg() {
  let e = P(),
    t = Ne(),
    n = nt(t.index, e);
  return (Ye(n) ? n : e)[U];
}
var fg = (() => {
    let t = class t {};
    t.ɵprov = A({ token: t, providedIn: "root", factory: () => null });
    let e = t;
    return e;
  })(),
  Co = {};
var za = new Set();
function Dr(e) {
  za.has(e) ||
    (za.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
function Wa(...e) {}
function hg() {
  let e = typeof ne.requestAnimationFrame == "function",
    t = ne[e ? "requestAnimationFrame" : "setTimeout"],
    n = ne[e ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && t && n) {
    let r = t[Zone.__symbol__("OriginalDelegate")];
    r && (t = r);
    let o = n[Zone.__symbol__("OriginalDelegate")];
    o && (n = o);
  }
  return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: n };
}
var k = class e {
    constructor({
      enableLongStackTrace: t = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new Q(!1)),
        (this.onMicrotaskEmpty = new Q(!1)),
        (this.onStable = new Q(!1)),
        (this.onError = new Q(!1)),
        typeof Zone > "u")
      )
        throw new D(908, !1);
      Zone.assertZonePatched();
      let o = this;
      (o._nesting = 0),
        (o._outer = o._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
        (o.shouldCoalesceEventChangeDetection = !r && n),
        (o.shouldCoalesceRunChangeDetection = r),
        (o.lastRequestAnimationFrameId = -1),
        (o.nativeRequestAnimationFrame = hg().nativeRequestAnimationFrame),
        mg(o);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new D(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new D(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, pg, Wa, Wa);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  pg = {};
function os(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function gg(e) {
  e.isCheckStableRunning ||
    e.lastRequestAnimationFrameId !== -1 ||
    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
      ne,
      () => {
        e.fakeTopEventTask ||
          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (e.lastRequestAnimationFrameId = -1),
                ti(e),
                (e.isCheckStableRunning = !0),
                os(e),
                (e.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          e.fakeTopEventTask.invoke();
      }
    )),
    ti(e));
}
function mg(e) {
  let t = () => {
    gg(e);
  };
  e._inner = e._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, o, i, s, a) => {
      if (yg(a)) return n.invokeTask(o, i, s, a);
      try {
        return qa(e), n.invokeTask(o, i, s, a);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && i.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Za(e);
      }
    },
    onInvoke: (n, r, o, i, s, a, u) => {
      try {
        return qa(e), n.invoke(o, i, s, a, u);
      } finally {
        e.shouldCoalesceRunChangeDetection && t(), Za(e);
      }
    },
    onHasTask: (n, r, o, i) => {
      n.hasTask(o, i),
        r === o &&
          (i.change == "microTask"
            ? ((e._hasPendingMicrotasks = i.microTask), ti(e), os(e))
            : i.change == "macroTask" &&
              (e.hasPendingMacrotasks = i.macroTask));
    },
    onHandleError: (n, r, o, i) => (
      n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1
    ),
  });
}
function ti(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.lastRequestAnimationFrameId !== -1)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function qa(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Za(e) {
  e._nesting--, os(e);
}
var ni = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new Q()),
      (this.onMicrotaskEmpty = new Q()),
      (this.onStable = new Q()),
      (this.onError = new Q());
  }
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function yg(e) {
  return !Array.isArray(e) || e.length !== 1
    ? !1
    : e[0].data?.__ignore_ng_zone__ === !0;
}
function vg(e = "zone.js", t) {
  return e === "noop" ? new ni() : e === "zone.js" ? new k(t) : e;
}
var Gc = (() => {
  let t = class t {
    constructor() {
      (this.handler = null), (this.internalCallbacks = []);
    }
    execute() {
      this.executeInternalCallbacks(), this.handler?.execute();
    }
    executeInternalCallbacks() {
      let r = [...this.internalCallbacks];
      this.internalCallbacks.length = 0;
      for (let o of r) o();
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  t.ɵprov = A({ token: t, providedIn: "root", factory: () => new t() });
  let e = t;
  return e;
})();
function ri(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = Ia(o, a);
      else if (i == 2) {
        let u = a,
          c = t[++s];
        r = Ia(r, u + ": " + c + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var oi = class extends rs {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = cr(t);
    return new si(n, this.ngModule);
  }
};
function Ya(e) {
  let t = [];
  for (let n in e) {
    if (!e.hasOwnProperty(n)) continue;
    let r = e[n];
    r !== void 0 &&
      t.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
  }
  return t;
}
function Dg(e) {
  let t = e.toLowerCase();
  return t === "svg" ? th : t === "math" ? nh : null;
}
var ii = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = ur(r);
      let o = this.injector.get(t, Co, r);
      return o !== Co || n === Co ? o : this.parentInjector.get(t, n, r);
    }
  },
  si = class extends er {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Ya(t.inputs);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return Ya(this.componentDef.outputs);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = xf(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = b(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof Be ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new ii(t, s) : t,
          u = a.get(Wt, null);
        if (u === null) throw new D(407, !1);
        let c = a.get(fg, null),
          l = a.get(Gc, null),
          d = a.get(Jo, null),
          f = {
            rendererFactory: u,
            sanitizer: c,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          h = u.createRenderer(null, this.componentDef),
          p = this.componentDef.selectors[0][0] || "div",
          M = r
            ? bp(h, r, this.componentDef.encapsulation, a)
            : gc(h, p, Dg(p)),
          m = 512;
        this.componentDef.signals
          ? (m |= 4096)
          : this.componentDef.onPush || (m |= 16);
        let g = null;
        M !== null && (g = $i(M, a, !0));
        let H = Zi(0, null, null, 1, 0, null, null, null, null, null, null),
          V = yr(null, H, null, m, null, null, f, h, a, null, g);
        Ri(V);
        let N, ve;
        try {
          let te = this.componentDef,
            Pe,
            Qr = null;
          te.findHostDirectiveDefs
            ? ((Pe = []),
              (Qr = new Map()),
              te.findHostDirectiveDefs(te, Pe, Qr),
              Pe.push(te))
            : (Pe = [te]);
          let pd = wg(V, M),
            gd = Eg(pd, M, te, Pe, V, f, h);
          (ve = Ni(H, pe)),
            M && bg(h, te, M, r),
            n !== void 0 && _g(ve, this.ngContentSelectors, n),
            (N = Ig(gd, te, Pe, Qr, V, [Mg])),
            Ki(H, V, null);
        } finally {
          Pi();
        }
        return new ai(this.componentType, N, ac(ve, V), V, ve);
      } finally {
        b(i);
      }
    }
  },
  ai = class extends Xo {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Ko(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o;
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let i = this._rootLView;
        Qi(i[E], i, o, t, n), this.previousInputValues.set(t, n);
        let s = nt(this._tNode.index, i);
        ts(s);
      }
    }
    get injector() {
      return new Jn(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function wg(e, t) {
  let n = e[E],
    r = pe;
  return (e[r] = t), vr(n, r, 2, "#host", null);
}
function Eg(e, t, n, r, o, i, s) {
  let a = o[E];
  Cg(r, e, t, s);
  let u = null;
  t !== null && (u = $i(t, o[vt]));
  let c = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = yr(o, Sc(n), null, l, o[e.index], e, i, c, null, null, u);
  return (
    a.firstCreatePass && Zo(a, e, r.length - 1), Yi(o, d), (o[e.index] = d)
  );
}
function Cg(e, t, n, r) {
  for (let o of e) t.mergedAttrs = jt(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (ri(t, t.mergedAttrs, !0), n !== null && Cc(r, n, t));
}
function Ig(e, t, n, r, o, i) {
  let s = Ne(),
    a = o[E],
    u = me(s, o);
  Oc(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      f = wt(o, a, d, s);
    Xe(f, o);
  }
  Fc(a, o, s), u && Xe(u, o);
  let c = wt(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[B] = o[B] = c), i !== null)) for (let l of i) l(c, t);
  return Tc(a, s, o), c;
}
function bg(e, t, n, r) {
  if (r) So(e, n, ["ng-version", "17.3.1"]);
  else {
    let { attrs: o, classes: i } = Sf(t.selectors[0]);
    o && So(e, n, o), i && i.length > 0 && Ec(e, n, i.join(" "));
  }
}
function _g(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function Mg() {
  let e = Ne();
  Vi(P()[E], e);
}
var Tg = () => !1;
function Ag(e, t, n) {
  return Tg(e, t, n);
}
function xg(e) {
  let t = [],
    n = new Map();
  function r(o) {
    let i = n.get(o);
    if (!i) {
      let s = e(o);
      n.set(o, (i = s.then(Fg)));
    }
    return i;
  }
  return (
    tr.forEach((o, i) => {
      let s = [];
      o.templateUrl &&
        s.push(
          r(o.templateUrl).then((c) => {
            o.template = c;
          })
        );
      let a = typeof o.styles == "string" ? [o.styles] : o.styles || [];
      if (((o.styles = a), o.styleUrl && o.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (o.styleUrls?.length) {
        let c = o.styles.length,
          l = o.styleUrls;
        o.styleUrls.forEach((d, f) => {
          a.push(""),
            s.push(
              r(d).then((h) => {
                (a[c + f] = h),
                  l.splice(l.indexOf(d), 1),
                  l.length == 0 && (o.styleUrls = void 0);
              })
            );
        });
      } else
        o.styleUrl &&
          s.push(
            r(o.styleUrl).then((c) => {
              a.push(c), (o.styleUrl = void 0);
            })
          );
      let u = Promise.all(s).then(() => Rg(i));
      t.push(u);
    }),
    Ng(),
    Promise.all(t).then(() => {})
  );
}
var tr = new Map(),
  Sg = new Set();
function Ng() {
  let e = tr;
  return (tr = new Map()), e;
}
function Og() {
  return tr.size === 0;
}
function Fg(e) {
  return typeof e == "string" ? e : e.text();
}
function Rg(e) {
  Sg.delete(e);
}
function Pg(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function ee(e) {
  let t = Pg(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if ($e(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new D(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        (s.inputs = Ln(e.inputs)),
          (s.inputTransforms = Ln(e.inputTransforms)),
          (s.declaredInputs = Ln(e.declaredInputs)),
          (s.outputs = Ln(e.outputs));
        let a = o.hostBindings;
        a && Bg(e, a);
        let u = o.viewQuery,
          c = o.contentQueries;
        if (
          (u && Vg(e, u),
          c && jg(e, c),
          kg(e, o),
          qd(e.outputs, o.outputs),
          $e(o) && o.data.animation)
        ) {
          let l = e.data;
          l.animation = (l.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          a && a.ngInherit && a(e), a === ee && (n = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  Lg(r);
}
function kg(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    if (
      r !== void 0 &&
      ((e.inputs[n] = r),
      (e.declaredInputs[n] = t.declaredInputs[n]),
      t.inputTransforms !== null)
    ) {
      let o = Array.isArray(r) ? r[0] : r;
      if (!t.inputTransforms.hasOwnProperty(o)) continue;
      (e.inputTransforms ??= {}), (e.inputTransforms[o] = t.inputTransforms[o]);
    }
  }
}
function Lg(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = jt(o.hostAttrs, (n = jt(n, o.hostAttrs))));
  }
}
function Ln(e) {
  return e === mt ? {} : e === se ? [] : e;
}
function Vg(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function jg(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function Bg(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
var Et = class {},
  ui = class {};
var nr = class extends Et {
    constructor(t, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new oi(this));
      let o = Rf(t);
      (this._bootstrapComponents = ep(o.bootstrap)),
        (this._r3Injector = oc(
          t,
          n,
          [
            { provide: Et, useValue: this },
            { provide: rs, useValue: this.componentFactoryResolver },
            ...r,
          ],
          K(t),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(t));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  ci = class extends ui {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new nr(this.moduleType, t, []);
    }
  };
function $g(e, t, n) {
  return new nr(e, t, n);
}
var Xt = (() => {
  let t = class t {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new Rt(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = A({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function en(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function Ug(e) {
  return (e.flags & 32) === 32;
}
function Hg(e, t, n, r, o, i, s, a, u) {
  let c = t.consts,
    l = vr(t, e, 4, s || null, Qn(c, a));
  Nc(t, n, l, Qn(c, u)), Vi(t, l);
  let d = (l.tView = Zi(
    2,
    l,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    c,
    null
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  );
}
function qt(e, t, n, r, o, i, s, a) {
  let u = P(),
    c = ye(),
    l = e + pe,
    d = c.firstCreatePass ? Hg(l, c, u, t, n, r, o, i, s) : c.data[l];
  Qt(d, !1);
  let f = Gg(c, u, d, e);
  ki() && Wi(c, u, f, d), Xe(f, u);
  let h = Wp(f, u, f, d);
  return (
    (u[l] = h),
    Yi(u, h),
    Ag(h, d, u),
    Si(d) && Ac(c, u, d),
    s != null && xc(u, d, a),
    qt
  );
}
var Gg = zg;
function zg(e, t, n, r) {
  return Li(!0), t[U].createComment("");
}
function is(e, t, n, r) {
  let o = P(),
    i = hr();
  if (en(o, i, t)) {
    let s = ye(),
      a = Wu();
    Up(a, o, e, t, n, r);
  }
  return is;
}
function Vn(e, t) {
  return (e << 17) | (t << 2);
}
function et(e) {
  return (e >> 17) & 32767;
}
function Wg(e) {
  return (e & 2) == 2;
}
function qg(e, t) {
  return (e & 131071) | (t << 17);
}
function li(e) {
  return e | 2;
}
function Ct(e) {
  return (e & 131068) >> 2;
}
function Io(e, t) {
  return (e & -131069) | (t << 2);
}
function Zg(e) {
  return (e & 1) === 1;
}
function di(e) {
  return e | 1;
}
function Yg(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = et(s),
    u = Ct(s);
  e[r] = n;
  let c = !1,
    l;
  if (Array.isArray(n)) {
    let d = n;
    (l = d[1]), (l === null || Yt(d, l) > 0) && (c = !0);
  } else l = n;
  if (o)
    if (u !== 0) {
      let f = et(e[a + 1]);
      (e[r + 1] = Vn(f, a)),
        f !== 0 && (e[f + 1] = Io(e[f + 1], r)),
        (e[a + 1] = qg(e[a + 1], r));
    } else
      (e[r + 1] = Vn(a, 0)), a !== 0 && (e[a + 1] = Io(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = Vn(u, 0)),
      a === 0 ? (a = r) : (e[u + 1] = Io(e[u + 1], r)),
      (u = r);
  c && (e[r + 1] = li(e[r + 1])),
    Qa(e, l, r, !0),
    Qa(e, l, r, !1),
    Qg(t, l, e, r, i),
    (s = Vn(a, u)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function Qg(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    Yt(i, t) >= 0 &&
    (n[r + 1] = di(n[r + 1]));
}
function Qa(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? et(o) : Ct(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let u = e[s],
      c = e[s + 1];
    Kg(u, t) && ((a = !0), (e[s + 1] = r ? di(c) : li(c))),
      (s = r ? et(c) : Ct(c));
  }
  a && (e[n + 1] = r ? li(o) : di(o));
}
function Kg(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
    ? Yt(e, t) >= 0
    : !1;
}
function tn(e, t, n) {
  let r = P(),
    o = hr();
  if (en(r, o, t)) {
    let i = ye(),
      s = Wu();
    Sp(i, s, r, e, t, r[U], n, !1);
  }
  return tn;
}
function Ka(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  Qi(e, n, i[s], s, r);
}
function wr(e, t) {
  return Jg(e, t, null, !0), wr;
}
function Jg(e, t, n, r) {
  let o = P(),
    i = ye(),
    s = vh(2);
  if ((i.firstUpdatePass && em(i, e, s, r), t !== mr && en(o, s, t))) {
    let a = i.data[_t()];
    im(i, a, o, o[U], e, (o[s + 1] = sm(t, n)), r, s);
  }
}
function Xg(e, t) {
  return t >= e.expandoStartIndex;
}
function em(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[_t()],
      s = Xg(e, n);
    am(i, r) && t === null && !s && (t = !1),
      (t = tm(o, i, t, r)),
      Yg(o, i, t, n, s, r);
  }
}
function tm(e, t, n, r) {
  let o = Ch(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = bo(null, e, t, n, r)), (n = Zt(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = bo(o, e, t, n, r)), i === null)) {
        let u = nm(e, t, r);
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = bo(null, e, t, u[1], r)),
          (u = Zt(u, t.attrs, r)),
          rm(e, t, r, u));
      } else i = om(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function nm(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (Ct(r) !== 0) return e[et(r)];
}
function rm(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[et(o)] = r;
}
function om(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Zt(r, s, n);
  }
  return Zt(r, t.attrs, n);
}
function bo(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Zt(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function Zt(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          mf(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function im(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let u = e.data,
    c = u[a + 1],
    l = Zg(c) ? Ja(u, t, n, o, Ct(c), s) : void 0;
  if (!rr(l)) {
    rr(i) || (Wg(c) && (i = Ja(u, null, n, o, a, s)));
    let d = ih(_t(), n);
    Dp(r, s, d, o, i);
  }
}
function Ja(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let u = e[o],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = n[o + 1];
    f === mr && (f = d ? se : void 0);
    let h = d ? po(f, r) : l === r ? f : void 0;
    if ((c && !rr(h) && (h = po(u, r)), rr(h) && ((a = h), s))) return a;
    let p = e[o + 1];
    o = s ? et(p) : Ct(p);
  }
  if (t !== null) {
    let u = i ? t.residualClasses : t.residualStyles;
    u != null && (a = po(u, r));
  }
  return a;
}
function rr(e) {
  return e !== void 0;
}
function sm(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = K(Ui(e)))),
    e
  );
}
function am(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var fi = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function _o(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function um(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1;
  if (Array.isArray(t)) {
    let a = t.length - 1;
    for (; i <= s && i <= a; ) {
      let u = e.at(i),
        c = t[i],
        l = _o(i, u, i, c, n);
      if (l !== 0) {
        l < 0 && e.updateValue(i, c), i++;
        continue;
      }
      let d = e.at(s),
        f = t[a],
        h = _o(s, d, a, f, n);
      if (h !== 0) {
        h < 0 && e.updateValue(s, f), s--, a--;
        continue;
      }
      let p = n(i, u),
        M = n(s, d),
        m = n(i, c);
      if (Object.is(m, M)) {
        let g = n(a, f);
        Object.is(g, p)
          ? (e.swap(i, s), e.updateValue(s, f), a--, s--)
          : e.move(s, i),
          e.updateValue(i, c),
          i++;
        continue;
      }
      if (((r ??= new or()), (o ??= eu(e, i, s, n)), hi(e, r, i, m)))
        e.updateValue(i, c), i++, s++;
      else if (o.has(m)) r.set(p, e.detach(i)), s--;
      else {
        let g = e.create(i, t[i]);
        e.attach(i, g), i++, s++;
      }
    }
    for (; i <= a; ) Xa(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      u = a.next();
    for (; !u.done && i <= s; ) {
      let c = e.at(i),
        l = u.value,
        d = _o(i, c, i, l, n);
      if (d !== 0) d < 0 && e.updateValue(i, l), i++, (u = a.next());
      else {
        (r ??= new or()), (o ??= eu(e, i, s, n));
        let f = n(i, l);
        if (hi(e, r, i, f)) e.updateValue(i, l), i++, s++, (u = a.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, l)), i++, s++, (u = a.next());
        else {
          let h = n(i, c);
          r.set(h, e.detach(i)), s--;
        }
      }
    }
    for (; !u.done; ) Xa(e, r, n, e.length, u.value), (u = a.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((a) => {
    e.destroy(a);
  });
}
function hi(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function Xa(e, t, n, r, o) {
  if (hi(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function eu(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var or = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
function zc(e, t, n) {
  Dr("NgControlFlow");
  let r = P(),
    o = hr(),
    i = yi(r, pe + e),
    s = 0;
  if (en(r, o, t)) {
    let a = b(null);
    try {
      if ((Lc(i, s), t !== -1)) {
        let u = vi(r[E], pe + t),
          c = ns(i, u.tView.ssrId),
          l = Ji(r, u, n, { dehydratedView: c });
        es(i, l, s, Xi(u, c));
      }
    } finally {
      b(a);
    }
  } else {
    let a = kc(i, s);
    a !== void 0 && (a[B] = n);
  }
}
var pi = class {
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - J;
  }
};
function Wc(e) {
  return e;
}
var gi = class {
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function qc(e, t, n, r, o, i, s, a, u, c, l, d, f) {
  Dr("NgControlFlow");
  let h = u !== void 0,
    p = P(),
    M = a ? s.bind(p[Ie][B]) : s,
    m = new gi(h, M);
  (p[pe + e] = m), qt(e + 1, t, n, r, o, i), h && qt(e + 2, u, c, l, d, f);
}
var mi = class extends fi {
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - J;
  }
  at(t) {
    return this.getLView(t)[B].$implicit;
  }
  attach(t, n) {
    let r = n[Bt];
    (this.needsIndexUpdate ||= t !== this.length),
      es(this.lContainer, n, t, Xi(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), cm(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = ns(this.lContainer, this.templateTNode.tView.ssrId);
    return Ji(
      this.hostLView,
      this.templateTNode,
      new pi(this.lContainer, n, t),
      { dehydratedView: r }
    );
  }
  destroy(t) {
    zi(t[E], t);
  }
  updateValue(t, n) {
    this.getLView(t)[B].$implicit = n;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[B].$index = t;
  }
  getLView(t) {
    return lm(this.lContainer, t);
  }
};
function Zc(e) {
  let t = b(null),
    n = _t();
  try {
    let r = P(),
      o = r[E],
      i = r[n];
    if (i.liveCollection === void 0) {
      let a = n + 1,
        u = yi(r, a),
        c = vi(o, a);
      i.liveCollection = new mi(u, r, c);
    } else i.liveCollection.reset();
    let s = i.liveCollection;
    if ((um(s, e, i.trackByFn), s.updateIndexes(), i.hasEmptyBlock)) {
      let a = hr(),
        u = s.length === 0;
      if (en(r, a, u)) {
        let c = n + 2,
          l = yi(r, c);
        if (u) {
          let d = vi(o, c),
            f = ns(l, d.tView.ssrId),
            h = Ji(r, d, void 0, { dehydratedView: f });
          es(l, h, 0, Xi(d, f));
        } else Lc(l, 0);
      }
    }
  } finally {
    b(t);
  }
}
function yi(e, t) {
  return e[t];
}
function cm(e, t) {
  return Gi(e, t);
}
function lm(e, t) {
  return kc(e, t);
}
function vi(e, t) {
  return Ni(e, t);
}
function dm(e, t, n, r, o, i) {
  let s = t.consts,
    a = Qn(s, o),
    u = vr(t, e, 2, r, a);
  return (
    Nc(t, n, u, Qn(s, i)),
    u.attrs !== null && ri(u, u.attrs, !1),
    u.mergedAttrs !== null && ri(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  );
}
function O(e, t, n, r) {
  let o = P(),
    i = ye(),
    s = pe + e,
    a = o[U],
    u = i.firstCreatePass ? dm(s, i, o, t, n, r) : i.data[s],
    c = fm(i, o, u, a, t, e);
  o[s] = c;
  let l = Si(u);
  return (
    Qt(u, !0),
    Cc(a, c, u),
    !Ug(u) && ki() && Wi(i, o, c, u),
    ch() === 0 && Xe(c, o),
    lh(),
    l && (Ac(i, o, u), Tc(i, u, o)),
    r !== null && xc(o, u),
    O
  );
}
function F() {
  let e = Ne();
  ju() ? mh() : ((e = e.parent), Qt(e, !1));
  let t = e;
  hh(t) && ph(), dh();
  let n = ye();
  return (
    n.firstCreatePass && (Vi(n, e), Au(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      xh(t) &&
      Ka(n, t, P(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Sh(t) &&
      Ka(n, t, P(), t.stylesWithoutHost, !1),
    F
  );
}
function Oe(e, t, n, r) {
  return O(e, t, n, r), F(), Oe;
}
var fm = (e, t, n, r, o, i) => (Li(!0), gc(r, o, _h()));
function Yc() {
  return P();
}
var ir = "en-US";
var hm = ir;
function pm(e) {
  typeof e == "string" && (hm = e.toLowerCase().replace(/_/g, "-"));
}
function _e(e, t, n, r) {
  let o = P(),
    i = ye(),
    s = Ne();
  return mm(i, o, o[U], s, e, t, r), _e;
}
function gm(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[$t],
          u = o[i + 2];
        return a.length > u ? a[u] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function mm(e, t, n, r, o, i, s) {
  let a = Si(r),
    c = e.firstCreatePass && Zp(e),
    l = t[B],
    d = qp(t),
    f = !0;
  if (r.type & 3 || s) {
    let M = me(r, t),
      m = s ? s(M) : M,
      g = d.length,
      H = s ? (N) => s(Te(N[r.index])) : r.index,
      V = null;
    if ((!s && a && (V = gm(e, t, o, r.index)), V !== null)) {
      let N = V.__ngLastListenerFn__ || V;
      (N.__ngNextListenerFn__ = i), (V.__ngLastListenerFn__ = i), (f = !1);
    } else {
      i = nu(r, t, l, i, !1);
      let N = n.listen(m, o, i);
      d.push(i, N), c && c.push(o, H, g, g + 1);
    }
  } else i = nu(r, t, l, i, !1);
  let h = r.outputs,
    p;
  if (f && h !== null && (p = h[o])) {
    let M = p.length;
    if (M)
      for (let m = 0; m < M; m += 2) {
        let g = p[m],
          H = p[m + 1],
          ve = t[g][H].subscribe(i),
          te = d.length;
        d.push(i, ve), c && c.push(o, r.index, te, -(te + 1));
      }
  }
}
function tu(e, t, n, r) {
  let o = b(null);
  try {
    return De(6, t, n), n(r) !== !1;
  } catch (i) {
    return Pc(e, i), !1;
  } finally {
    De(7, t, n), b(o);
  }
}
function nu(e, t, n, r, o) {
  return function i(s) {
    if (s === Function) return r;
    let a = e.componentOffset > -1 ? nt(e.index, t) : t;
    ts(a);
    let u = tu(t, n, r, s),
      c = i.__ngNextListenerFn__;
    for (; c; ) (u = tu(t, n, c, s) && u), (c = c.__ngNextListenerFn__);
    return o && u === !1 && s.preventDefault(), u;
  };
}
function ss(e = 1) {
  return bh(e);
}
function ce(e, t = "") {
  let n = P(),
    r = ye(),
    o = e + pe,
    i = r.firstCreatePass ? vr(r, o, 1, t, null) : r.data[o],
    s = ym(r, n, i, t, e);
  (n[o] = s), ki() && Wi(r, n, s, i), Qt(i, !1);
}
var ym = (e, t, n, r, o) => (Li(!0), np(t[U], r));
function vm(e, t, n) {
  let r = ye();
  if (r.firstCreatePass) {
    let o = $e(e);
    Di(n, r.data, r.blueprint, o, !0), Di(t, r.data, r.blueprint, o, !1);
  }
}
function Di(e, t, n, r, o) {
  if (((e = $(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) Di(e[i], t, n, r, o);
  else {
    let i = ye(),
      s = P(),
      a = Ne(),
      u = yt(e) ? e : $(e.provide),
      c = bu(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (yt(e) || !e.multi) {
      let h = new Je(c, o, S),
        p = To(u, t, o ? l : l + f, d);
      p === -1
        ? (Bo(Kn(a, s), i, u),
          Mo(i, e, t.length),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(h),
          s.push(h))
        : ((n[p] = h), (s[p] = h));
    } else {
      let h = To(u, t, l + f, d),
        p = To(u, t, l, l + f),
        M = h >= 0 && n[h],
        m = p >= 0 && n[p];
      if ((o && !m) || (!o && !M)) {
        Bo(Kn(a, s), i, u);
        let g = Em(o ? wm : Dm, n.length, o, r, c);
        !o && m && (n[p].providerFactory = g),
          Mo(i, e, t.length, 0),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(g),
          s.push(g);
      } else {
        let g = Qc(n[o ? p : h], c, !o && r);
        Mo(i, e, h > -1 ? h : p, g);
      }
      !o && r && m && n[p].componentProviders++;
    }
  }
}
function Mo(e, t, n, r) {
  let o = yt(t),
    i = $f(t);
  if (o || i) {
    let u = (i ? $(t.useClass) : t).prototype.ngOnDestroy;
    if (u) {
      let c = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let l = c.indexOf(n);
        l === -1 ? c.push(n, [r, u]) : c[l + 1].push(r, u);
      } else c.push(n, u);
    }
  }
}
function Qc(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function To(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function Dm(e, t, n, r) {
  return wi(this.multi, []);
}
function wm(e, t, n, r) {
  let o = this.multi,
    i;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = wt(n, n[E], this.providerFactory.index, r);
    (i = a.slice(0, s)), wi(o, i);
    for (let u = s; u < a.length; u++) i.push(a[u]);
  } else (i = []), wi(o, i);
  return i;
}
function wi(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function Em(e, t, n, r, o) {
  let i = new Je(e, n, S);
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    Qc(i, o, r && !n),
    i
  );
}
function Fe(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => vm(r, o ? o(e) : e, t);
  };
}
var jn = null;
function Cm(e) {
  (jn !== null &&
    (e.defaultEncapsulation !== jn.defaultEncapsulation ||
      e.preserveWhitespaces !== jn.preserveWhitespaces)) ||
    (jn = e);
}
var as = new v(""),
  nn = new v(""),
  Er = (() => {
    let t = class t {
      constructor(r, o, i) {
        (this._ngZone = r),
          (this.registry = o),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          us || (Im(i), i.addToWindow(o)),
          this._watchAngularEvents(),
          r.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                k.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let r = this._callbacks.pop();
              clearTimeout(r.timeoutId), r.doneCb();
            }
          });
        else {
          let r = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((o) =>
            o.updateCb && o.updateCb(r) ? (clearTimeout(o.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((r) => ({
              source: r.source,
              creationLocation: r.creationLocation,
              data: r.data,
            }))
          : [];
      }
      addCallback(r, o, i) {
        let s = -1;
        o &&
          o > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              r();
          }, o)),
          this._callbacks.push({ doneCb: r, timeoutId: s, updateCb: i });
      }
      whenStable(r, o, i) {
        if (i && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(r, o, i), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(r) {
        this.registry.registerApplication(r, this);
      }
      unregisterApplication(r) {
        this.registry.unregisterApplication(r);
      }
      findProviders(r, o, i) {
        return [];
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(k), w(Cr), w(nn));
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Cr = (() => {
    let t = class t {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(r, o) {
        this._applications.set(r, o);
      }
      unregisterApplication(r) {
        this._applications.delete(r);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(r) {
        return this._applications.get(r) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(r, o = !0) {
        return us?.findTestabilityInTree(this, r, o) ?? null;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac, providedIn: "platform" }));
    let e = t;
    return e;
  })();
function Im(e) {
  us = e;
}
var us;
function rn(e) {
  return !!e && typeof e.then == "function";
}
function Kc(e) {
  return !!e && typeof e.subscribe == "function";
}
var bm = new v(""),
  Jc = (() => {
    let t = class t {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, o) => {
            (this.resolve = r), (this.reject = o);
          })),
          (this.appInits = T(bm, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let i of this.appInits) {
          let s = i();
          if (rn(s)) r.push(s);
          else if (Kc(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c });
            });
            r.push(a);
          }
        }
        let o = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            o();
          })
          .catch((i) => {
            this.reject(i);
          }),
          r.length === 0 && o(),
          (this.initialized = !0);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Xc = new v("");
function _m() {
  qs(() => {
    throw new D(600, !1);
  });
}
function Mm(e) {
  return e.isBoundToModule;
}
function Tm(e, t, n) {
  try {
    let r = n();
    return rn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
function el(e, t) {
  return Array.isArray(t) ? t.reduce(el, e) : L(L({}, e), t);
}
var on = (() => {
  let t = class t {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = T(ic)),
        (this.afterRenderEffectManager = T(Gc)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new Le()),
        (this.afterTick = new Le()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = T(Xt).hasPendingTasks.pipe(Y((r) => !r))),
        (this._injector = T(Be));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, o) {
      let i = r instanceof er;
      if (!this._injector.get(Jc).done) {
        let h = !i && Ff(r),
          p = !1;
        throw new D(405, p);
      }
      let a;
      i ? (a = r) : (a = this._injector.get(rs).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let u = Mm(a) ? void 0 : this._injector.get(Et),
        c = o || a.selector,
        l = a.create(Tt.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(as, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Gn(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(r) {
      if (this._runningTick) throw new D(101, !1);
      let o = b(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(r);
      } catch (i) {
        this.internalErrorHandler(i);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), b(o);
      }
    }
    detectChangesInAttachedViews(r) {
      let o = 0,
        i = this.afterRenderEffectManager;
      for (;;) {
        if (o === jc) throw new D(103, !1);
        if (r) {
          let s = o === 0;
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: u } of this._views)
            Am(a, s, u);
        }
        if (
          (o++,
          i.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => Ei(s)
          ) &&
            (i.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => Ei(s)
            )))
        )
          break;
      }
    }
    attachView(r) {
      let o = r;
      this._views.push(o), o.attachToAppRef(this);
    }
    detachView(r) {
      let o = r;
      Gn(this._views, o), o.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let o = this._injector.get(Xc, []);
      [...this._bootstrapListeners, ...o].forEach((i) => i(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => Gn(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new D(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = A({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function Gn(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Am(e, t, n) {
  (!t && !Ei(e)) || xm(e, n, t);
}
function Ei(e) {
  return Fi(e);
}
function xm(e, t, n) {
  let r;
  n ? ((r = 0), (e[y] |= 1024)) : e[y] & 64 ? (r = 0) : (r = 1), Bc(e, t, r);
}
var Sm = new v("");
function Nm(e, t, n) {
  let r = new ci(n);
  return Promise.resolve(r);
}
function ru(e) {
  for (let t = e.length - 1; t >= 0; t--) if (e[t] !== void 0) return e[t];
}
var Om = (() => {
  let t = class t {
    constructor() {
      (this.zone = T(k)), (this.applicationRef = T(on));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = A({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function Fm(e) {
  return [
    { provide: k, useFactory: e },
    {
      provide: Vt,
      multi: !0,
      useFactory: () => {
        let t = T(Om, { optional: !0 });
        return () => t.initialize();
      },
    },
    {
      provide: Vt,
      multi: !0,
      useFactory: () => {
        let t = T(km);
        return () => {
          t.initialize();
        };
      },
    },
    { provide: ic, useFactory: Rm },
  ];
}
function Rm() {
  let e = T(k),
    t = T(Ae);
  return (n) => e.runOutsideAngular(() => t.handleError(n));
}
function Pm(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var km = (() => {
  let t = class t {
    constructor() {
      (this.subscription = new z()),
        (this.initialized = !1),
        (this.zone = T(k)),
        (this.pendingTasks = T(Xt));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let r = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              k.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            k.assertInAngularZone(), (r ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = A({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function Lm() {
  return (typeof $localize < "u" && $localize.locale) || ir;
}
var cs = new v("", {
  providedIn: "root",
  factory: () => T(cs, _.Optional | _.SkipSelf) || Lm(),
});
var tl = new v(""),
  nl = (() => {
    let t = class t {
      constructor(r) {
        (this._injector = r),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(r, o) {
        let i = vg(
          o?.ngZone,
          Pm({
            eventCoalescing: o?.ngZoneEventCoalescing,
            runCoalescing: o?.ngZoneRunCoalescing,
          })
        );
        return i.run(() => {
          let s = $g(
              r.moduleType,
              this.injector,
              Fm(() => i)
            ),
            a = s.injector.get(Ae, null);
          return (
            i.runOutsideAngular(() => {
              let u = i.onError.subscribe({
                next: (c) => {
                  a.handleError(c);
                },
              });
              s.onDestroy(() => {
                Gn(this._modules, s), u.unsubscribe();
              });
            }),
            Tm(a, i, () => {
              let u = s.injector.get(Jc);
              return (
                u.runInitializers(),
                u.donePromise.then(() => {
                  let c = s.injector.get(cs, ir);
                  return pm(c || ir), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(r, o = []) {
        let i = el({}, o);
        return Nm(this.injector, i, r).then((s) =>
          this.bootstrapModuleFactory(s, i)
        );
      }
      _moduleDoBootstrap(r) {
        let o = r.injector.get(on);
        if (r._bootstrapComponents.length > 0)
          r._bootstrapComponents.forEach((i) => o.bootstrap(i));
        else if (r.instance.ngDoBootstrap) r.instance.ngDoBootstrap(o);
        else throw new D(-403, !1);
        this._modules.push(r);
      }
      onDestroy(r) {
        this._destroyListeners.push(r);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new D(404, !1);
        this._modules.slice().forEach((o) => o.destroy()),
          this._destroyListeners.forEach((o) => o());
        let r = this._injector.get(tl, null);
        r && (r.forEach((o) => o()), r.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(Tt));
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac, providedIn: "platform" }));
    let e = t;
    return e;
  })(),
  kt = null,
  rl = new v("");
function Vm(e) {
  if (kt && !kt.get(rl, !1)) throw new D(400, !1);
  _m(), (kt = e);
  let t = e.get(nl);
  return $m(e), t;
}
function ls(e, t, n = []) {
  let r = `Platform: ${t}`,
    o = new v(r);
  return (i = []) => {
    let s = ol();
    if (!s || s.injector.get(rl, !1)) {
      let a = [...n, ...i, { provide: o, useValue: !0 }];
      e ? e(a) : Vm(jm(a, r));
    }
    return Bm(o);
  };
}
function jm(e = [], t) {
  return Tt.create({
    name: t,
    providers: [
      { provide: lr, useValue: "platform" },
      { provide: tl, useValue: new Set([() => (kt = null)]) },
      ...e,
    ],
  });
}
function Bm(e) {
  let t = ol();
  if (!t) throw new D(401, !1);
  return t;
}
function ol() {
  return kt?.get(nl) ?? null;
}
function $m(e) {
  e.get(ji, null)?.forEach((n) => n());
}
var il = ls(null, "core", []),
  sl = (() => {
    let t = class t {
      constructor(r) {}
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(on));
    }),
      (t.ɵmod = ue({ type: t })),
      (t.ɵinj = ae({}));
    let e = t;
    return e;
  })();
var cl = null;
function ot() {
  return cl;
}
function ll(e) {
  cl ??= e;
}
var Ir = class {};
var Me = new v("");
function br(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var dl = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵmod = ue({ type: t })),
      (t.ɵinj = ae({}));
    let e = t;
    return e;
  })(),
  fl = "browser",
  Hm = "server";
function ds(e) {
  return e === Hm;
}
var xt = class {};
var an = class {},
  Mr = class {},
  it = class e {
    constructor(t) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        t
          ? typeof t == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  t
                    .split(
                      `
`
                    )
                    .forEach((n) => {
                      let r = n.indexOf(":");
                      if (r > 0) {
                        let o = n.slice(0, r),
                          i = o.toLowerCase(),
                          s = n.slice(r + 1).trim();
                        this.maybeSetNormalizedName(o, i),
                          this.headers.has(i)
                            ? this.headers.get(i).push(s)
                            : this.headers.set(i, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && t instanceof Headers
            ? ((this.headers = new Map()),
              t.forEach((n, r) => {
                this.setHeaderEntries(r, n);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(t).forEach(([n, r]) => {
                    this.setHeaderEntries(n, r);
                  });
              })
          : (this.headers = new Map());
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase());
    }
    get(t) {
      this.init();
      let n = this.headers.get(t.toLowerCase());
      return n && n.length > 0 ? n[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null;
    }
    append(t, n) {
      return this.clone({ name: t, value: n, op: "a" });
    }
    set(t, n) {
      return this.clone({ name: t, value: n, op: "s" });
    }
    delete(t, n) {
      return this.clone({ name: t, value: n, op: "d" });
    }
    maybeSetNormalizedName(t, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
          (this.lazyUpdate = null)));
    }
    copyFrom(t) {
      t.init(),
        Array.from(t.headers.keys()).forEach((n) => {
          this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n));
        });
    }
    clone(t) {
      let n = new e();
      return (
        (n.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        n
      );
    }
    applyUpdate(t) {
      let n = t.name.toLowerCase();
      switch (t.op) {
        case "a":
        case "s":
          let r = t.value;
          if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(t.name, n);
          let o = (t.op === "a" ? this.headers.get(n) : void 0) || [];
          o.push(...r), this.headers.set(n, o);
          break;
        case "d":
          let i = t.value;
          if (!i) this.headers.delete(n), this.normalizedNames.delete(n);
          else {
            let s = this.headers.get(n);
            if (!s) return;
            (s = s.filter((a) => i.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, s);
          }
          break;
      }
    }
    setHeaderEntries(t, n) {
      let r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
        o = t.toLowerCase();
      this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          t(this.normalizedNames.get(n), this.headers.get(n))
        );
    }
  };
var hs = class {
  encodeKey(t) {
    return hl(t);
  }
  encodeValue(t) {
    return hl(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function qm(e, t) {
  let n = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, "")
        .split("&")
        .forEach((o) => {
          let i = o.indexOf("="),
            [s, a] =
              i == -1
                ? [t.decodeKey(o), ""]
                : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
            u = n.get(s) || [];
          u.push(a), n.set(s, u);
        }),
    n
  );
}
var Zm = /%(\d[a-f0-9])/gi,
  Ym = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function hl(e) {
  return encodeURIComponent(e).replace(Zm, (t, n) => Ym[n] ?? t);
}
function _r(e) {
  return `${e}`;
}
var He = class e {
  constructor(t = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = t.encoder || new hs()),
      t.fromString)
    ) {
      if (t.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = qm(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              o = Array.isArray(r) ? r.map(_r) : [_r(r)];
            this.map.set(n, o);
          }))
        : (this.map = null);
  }
  has(t) {
    return this.init(), this.map.has(t);
  }
  get(t) {
    this.init();
    let n = this.map.get(t);
    return n ? n[0] : null;
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(t, n) {
    return this.clone({ param: t, value: n, op: "a" });
  }
  appendAll(t) {
    let n = [];
    return (
      Object.keys(t).forEach((r) => {
        let o = t[r];
        Array.isArray(o)
          ? o.forEach((i) => {
              n.push({ param: r, value: i, op: "a" });
            })
          : n.push({ param: r, value: o, op: "a" });
      }),
      this.clone(n)
    );
  }
  set(t, n) {
    return this.clone({ param: t, value: n, op: "s" });
  }
  delete(t, n) {
    return this.clone({ param: t, value: n, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let n = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((r) => n + "=" + this.encoder.encodeValue(r))
            .join("&");
        })
        .filter((t) => t !== "")
        .join("&")
    );
  }
  clone(t) {
    let n = new e({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(t)),
      n
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case "a":
            case "s":
              let n = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
              n.push(_r(t.value)), this.map.set(t.param, n);
              break;
            case "d":
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  o = r.indexOf(_r(t.value));
                o !== -1 && r.splice(o, 1),
                  r.length > 0
                    ? this.map.set(t.param, r)
                    : this.map.delete(t.param);
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var ps = class {
  constructor() {
    this.map = new Map();
  }
  set(t, n) {
    return this.map.set(t, n), this;
  }
  get(t) {
    return (
      this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
    );
  }
  delete(t) {
    return this.map.delete(t), this;
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function Qm(e) {
  switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function pl(e) {
  return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
}
function gl(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function ml(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
function Km(e) {
  return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
}
var sn = class e {
    constructor(t, n, r, o) {
      (this.url = n),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = t.toUpperCase());
      let i;
      if (
        (Qm(this.method) || o
          ? ((this.body = r !== void 0 ? r : null), (i = o))
          : (i = r),
        i &&
          ((this.reportProgress = !!i.reportProgress),
          (this.withCredentials = !!i.withCredentials),
          i.responseType && (this.responseType = i.responseType),
          i.headers && (this.headers = i.headers),
          i.context && (this.context = i.context),
          i.params && (this.params = i.params),
          (this.transferCache = i.transferCache)),
        (this.headers ??= new it()),
        (this.context ??= new ps()),
        !this.params)
      )
        (this.params = new He()), (this.urlWithParams = n);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf("?"),
            u = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
          this.urlWithParams = n + u + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : pl(this.body) ||
          gl(this.body) ||
          ml(this.body) ||
          Km(this.body) ||
          typeof this.body == "string"
        ? this.body
        : this.body instanceof He
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || ml(this.body)
        ? null
        : gl(this.body)
        ? this.body.type || null
        : pl(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof He
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(t = {}) {
      let n = t.method || this.method,
        r = t.url || this.url,
        o = t.responseType || this.responseType,
        i = t.body !== void 0 ? t.body : this.body,
        s =
          t.withCredentials !== void 0
            ? t.withCredentials
            : this.withCredentials,
        a =
          t.reportProgress !== void 0 ? t.reportProgress : this.reportProgress,
        u = t.headers || this.headers,
        c = t.params || this.params,
        l = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (u = Object.keys(t.setHeaders).reduce(
            (d, f) => d.set(f, t.setHeaders[f]),
            u
          )),
        t.setParams &&
          (c = Object.keys(t.setParams).reduce(
            (d, f) => d.set(f, t.setParams[f]),
            c
          )),
        new e(n, r, i, {
          params: c,
          headers: u,
          context: l,
          reportProgress: a,
          responseType: o,
          withCredentials: s,
        })
      );
    }
  },
  St = (function (e) {
    return (
      (e[(e.Sent = 0)] = "Sent"),
      (e[(e.UploadProgress = 1)] = "UploadProgress"),
      (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
      (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
      (e[(e.Response = 4)] = "Response"),
      (e[(e.User = 5)] = "User"),
      e
    );
  })(St || {}),
  un = class {
    constructor(t, n = xr.Ok, r = "OK") {
      (this.headers = t.headers || new it()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  gs = class e extends un {
    constructor(t = {}) {
      super(t), (this.type = St.ResponseHeader);
    }
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Tr = class e extends un {
    constructor(t = {}) {
      super(t),
        (this.type = St.Response),
        (this.body = t.body !== void 0 ? t.body : null);
    }
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Ar = class extends un {
    constructor(t) {
      super(t, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              t.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              t.url || "(unknown url)"
            }: ${t.status} ${t.statusText}`),
        (this.error = t.error || null);
    }
  },
  xr = (function (e) {
    return (
      (e[(e.Continue = 100)] = "Continue"),
      (e[(e.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (e[(e.Processing = 102)] = "Processing"),
      (e[(e.EarlyHints = 103)] = "EarlyHints"),
      (e[(e.Ok = 200)] = "Ok"),
      (e[(e.Created = 201)] = "Created"),
      (e[(e.Accepted = 202)] = "Accepted"),
      (e[(e.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
      (e[(e.NoContent = 204)] = "NoContent"),
      (e[(e.ResetContent = 205)] = "ResetContent"),
      (e[(e.PartialContent = 206)] = "PartialContent"),
      (e[(e.MultiStatus = 207)] = "MultiStatus"),
      (e[(e.AlreadyReported = 208)] = "AlreadyReported"),
      (e[(e.ImUsed = 226)] = "ImUsed"),
      (e[(e.MultipleChoices = 300)] = "MultipleChoices"),
      (e[(e.MovedPermanently = 301)] = "MovedPermanently"),
      (e[(e.Found = 302)] = "Found"),
      (e[(e.SeeOther = 303)] = "SeeOther"),
      (e[(e.NotModified = 304)] = "NotModified"),
      (e[(e.UseProxy = 305)] = "UseProxy"),
      (e[(e.Unused = 306)] = "Unused"),
      (e[(e.TemporaryRedirect = 307)] = "TemporaryRedirect"),
      (e[(e.PermanentRedirect = 308)] = "PermanentRedirect"),
      (e[(e.BadRequest = 400)] = "BadRequest"),
      (e[(e.Unauthorized = 401)] = "Unauthorized"),
      (e[(e.PaymentRequired = 402)] = "PaymentRequired"),
      (e[(e.Forbidden = 403)] = "Forbidden"),
      (e[(e.NotFound = 404)] = "NotFound"),
      (e[(e.MethodNotAllowed = 405)] = "MethodNotAllowed"),
      (e[(e.NotAcceptable = 406)] = "NotAcceptable"),
      (e[(e.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
      (e[(e.RequestTimeout = 408)] = "RequestTimeout"),
      (e[(e.Conflict = 409)] = "Conflict"),
      (e[(e.Gone = 410)] = "Gone"),
      (e[(e.LengthRequired = 411)] = "LengthRequired"),
      (e[(e.PreconditionFailed = 412)] = "PreconditionFailed"),
      (e[(e.PayloadTooLarge = 413)] = "PayloadTooLarge"),
      (e[(e.UriTooLong = 414)] = "UriTooLong"),
      (e[(e.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
      (e[(e.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
      (e[(e.ExpectationFailed = 417)] = "ExpectationFailed"),
      (e[(e.ImATeapot = 418)] = "ImATeapot"),
      (e[(e.MisdirectedRequest = 421)] = "MisdirectedRequest"),
      (e[(e.UnprocessableEntity = 422)] = "UnprocessableEntity"),
      (e[(e.Locked = 423)] = "Locked"),
      (e[(e.FailedDependency = 424)] = "FailedDependency"),
      (e[(e.TooEarly = 425)] = "TooEarly"),
      (e[(e.UpgradeRequired = 426)] = "UpgradeRequired"),
      (e[(e.PreconditionRequired = 428)] = "PreconditionRequired"),
      (e[(e.TooManyRequests = 429)] = "TooManyRequests"),
      (e[(e.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
      (e[(e.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
      (e[(e.InternalServerError = 500)] = "InternalServerError"),
      (e[(e.NotImplemented = 501)] = "NotImplemented"),
      (e[(e.BadGateway = 502)] = "BadGateway"),
      (e[(e.ServiceUnavailable = 503)] = "ServiceUnavailable"),
      (e[(e.GatewayTimeout = 504)] = "GatewayTimeout"),
      (e[(e.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
      (e[(e.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
      (e[(e.InsufficientStorage = 507)] = "InsufficientStorage"),
      (e[(e.LoopDetected = 508)] = "LoopDetected"),
      (e[(e.NotExtended = 510)] = "NotExtended"),
      (e[(e.NetworkAuthenticationRequired = 511)] =
        "NetworkAuthenticationRequired"),
      e
    );
  })(xr || {});
function fs(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    transferCache: e.transferCache,
  };
}
var ms = (() => {
  let t = class t {
    constructor(r) {
      this.handler = r;
    }
    request(r, o, i = {}) {
      let s;
      if (r instanceof sn) s = r;
      else {
        let c;
        i.headers instanceof it ? (c = i.headers) : (c = new it(i.headers));
        let l;
        i.params &&
          (i.params instanceof He
            ? (l = i.params)
            : (l = new He({ fromObject: i.params }))),
          (s = new sn(r, o, i.body !== void 0 ? i.body : null, {
            headers: c,
            context: i.context,
            params: l,
            reportProgress: i.reportProgress,
            responseType: i.responseType || "json",
            withCredentials: i.withCredentials,
            transferCache: i.transferCache,
          }));
      }
      let a = Rn(s).pipe(fo((c) => this.handler.handle(c)));
      if (r instanceof sn || i.observe === "events") return a;
      let u = a.pipe(lo((c) => c instanceof Tr));
      switch (i.observe || "body") {
        case "body":
          switch (s.responseType) {
            case "arraybuffer":
              return u.pipe(
                Y((c) => {
                  if (c.body !== null && !(c.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return c.body;
                })
              );
            case "blob":
              return u.pipe(
                Y((c) => {
                  if (c.body !== null && !(c.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return c.body;
                })
              );
            case "text":
              return u.pipe(
                Y((c) => {
                  if (c.body !== null && typeof c.body != "string")
                    throw new Error("Response is not a string.");
                  return c.body;
                })
              );
            case "json":
            default:
              return u.pipe(Y((c) => c.body));
          }
        case "response":
          return u;
        default:
          throw new Error(`Unreachable: unhandled observe type ${i.observe}}`);
      }
    }
    delete(r, o = {}) {
      return this.request("DELETE", r, o);
    }
    get(r, o = {}) {
      return this.request("GET", r, o);
    }
    head(r, o = {}) {
      return this.request("HEAD", r, o);
    }
    jsonp(r, o) {
      return this.request("JSONP", r, {
        params: new He().append(o, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(r, o = {}) {
      return this.request("OPTIONS", r, o);
    }
    patch(r, o, i = {}) {
      return this.request("PATCH", r, fs(i, o));
    }
    post(r, o, i = {}) {
      return this.request("POST", r, fs(i, o));
    }
    put(r, o, i = {}) {
      return this.request("PUT", r, fs(i, o));
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)(w(an));
  }),
    (t.ɵprov = A({ token: t, factory: t.ɵfac }));
  let e = t;
  return e;
})();
function wl(e, t) {
  return t(e);
}
function Jm(e, t) {
  return (n, r) => t.intercept(n, { handle: (o) => e(o, r) });
}
function Xm(e, t, n) {
  return (r, o) => _u(n, () => t(r, (i) => e(i, o)));
}
var ey = new v(""),
  ys = new v(""),
  ty = new v(""),
  ny = new v("");
function ry() {
  let e = null;
  return (t, n) => {
    e === null && (e = (T(ey, { optional: !0 }) ?? []).reduceRight(Jm, wl));
    let r = T(Xt),
      o = r.add();
    return e(t, n).pipe(kn(() => r.remove(o)));
  };
}
var yl = (() => {
  let t = class t extends an {
    constructor(r, o) {
      super(),
        (this.backend = r),
        (this.injector = o),
        (this.chain = null),
        (this.pendingTasks = T(Xt));
      let i = T(ny, { optional: !0 });
      this.backend = i ?? r;
    }
    handle(r) {
      if (this.chain === null) {
        let i = Array.from(
          new Set([...this.injector.get(ys), ...this.injector.get(ty, [])])
        );
        this.chain = i.reduceRight((s, a) => Xm(s, a, this.injector), wl);
      }
      let o = this.pendingTasks.add();
      return this.chain(r, (i) => this.backend.handle(i)).pipe(
        kn(() => this.pendingTasks.remove(o))
      );
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)(w(Mr), w(Be));
  }),
    (t.ɵprov = A({ token: t, factory: t.ɵfac }));
  let e = t;
  return e;
})();
var oy = /^\)\]\}',?\n/;
function iy(e) {
  return "responseURL" in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
    ? e.getResponseHeader("X-Request-URL")
    : null;
}
var vl = (() => {
    let t = class t {
      constructor(r) {
        this.xhrFactory = r;
      }
      handle(r) {
        if (r.method === "JSONP") throw new D(-2800, !1);
        let o = this.xhrFactory;
        return (o.ɵloadImpl ? Ze(o.ɵloadImpl()) : Rn(null)).pipe(
          ho(
            () =>
              new R((s) => {
                let a = o.build();
                if (
                  (a.open(r.method, r.urlWithParams),
                  r.withCredentials && (a.withCredentials = !0),
                  r.headers.forEach((m, g) =>
                    a.setRequestHeader(m, g.join(","))
                  ),
                  r.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !r.headers.has("Content-Type"))
                ) {
                  let m = r.detectContentTypeHeader();
                  m !== null && a.setRequestHeader("Content-Type", m);
                }
                if (r.responseType) {
                  let m = r.responseType.toLowerCase();
                  a.responseType = m !== "json" ? m : "text";
                }
                let u = r.serializeBody(),
                  c = null,
                  l = () => {
                    if (c !== null) return c;
                    let m = a.statusText || "OK",
                      g = new it(a.getAllResponseHeaders()),
                      H = iy(a) || r.url;
                    return (
                      (c = new gs({
                        headers: g,
                        status: a.status,
                        statusText: m,
                        url: H,
                      })),
                      c
                    );
                  },
                  d = () => {
                    let { headers: m, status: g, statusText: H, url: V } = l(),
                      N = null;
                    g !== xr.NoContent &&
                      (N =
                        typeof a.response > "u" ? a.responseText : a.response),
                      g === 0 && (g = N ? xr.Ok : 0);
                    let ve = g >= 200 && g < 300;
                    if (r.responseType === "json" && typeof N == "string") {
                      let te = N;
                      N = N.replace(oy, "");
                      try {
                        N = N !== "" ? JSON.parse(N) : null;
                      } catch (Pe) {
                        (N = te),
                          ve && ((ve = !1), (N = { error: Pe, text: N }));
                      }
                    }
                    ve
                      ? (s.next(
                          new Tr({
                            body: N,
                            headers: m,
                            status: g,
                            statusText: H,
                            url: V || void 0,
                          })
                        ),
                        s.complete())
                      : s.error(
                          new Ar({
                            error: N,
                            headers: m,
                            status: g,
                            statusText: H,
                            url: V || void 0,
                          })
                        );
                  },
                  f = (m) => {
                    let { url: g } = l(),
                      H = new Ar({
                        error: m,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: g || void 0,
                      });
                    s.error(H);
                  },
                  h = !1,
                  p = (m) => {
                    h || (s.next(l()), (h = !0));
                    let g = { type: St.DownloadProgress, loaded: m.loaded };
                    m.lengthComputable && (g.total = m.total),
                      r.responseType === "text" &&
                        a.responseText &&
                        (g.partialText = a.responseText),
                      s.next(g);
                  },
                  M = (m) => {
                    let g = { type: St.UploadProgress, loaded: m.loaded };
                    m.lengthComputable && (g.total = m.total), s.next(g);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", f),
                  a.addEventListener("timeout", f),
                  a.addEventListener("abort", f),
                  r.reportProgress &&
                    (a.addEventListener("progress", p),
                    u !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", M)),
                  a.send(u),
                  s.next({ type: St.Sent }),
                  () => {
                    a.removeEventListener("error", f),
                      a.removeEventListener("abort", f),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", f),
                      r.reportProgress &&
                        (a.removeEventListener("progress", p),
                        u !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", M)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(xt));
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  El = new v(""),
  sy = "XSRF-TOKEN",
  ay = new v("", { providedIn: "root", factory: () => sy }),
  uy = "X-XSRF-TOKEN",
  cy = new v("", { providedIn: "root", factory: () => uy }),
  Sr = class {},
  ly = (() => {
    let t = class t {
      constructor(r, o, i) {
        (this.doc = r),
          (this.platform = o),
          (this.cookieName = i),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let r = this.doc.cookie || "";
        return (
          r !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = br(r, this.cookieName)),
            (this.lastCookieString = r)),
          this.lastToken
        );
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(Me), w(Ue), w(ay));
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })();
function dy(e, t) {
  let n = e.url.toLowerCase();
  if (
    !T(El) ||
    e.method === "GET" ||
    e.method === "HEAD" ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  )
    return t(e);
  let r = T(Sr).getToken(),
    o = T(cy);
  return (
    r != null &&
      !e.headers.has(o) &&
      (e = e.clone({ headers: e.headers.set(o, r) })),
    t(e)
  );
}
var Cl = (function (e) {
  return (
    (e[(e.Interceptors = 0)] = "Interceptors"),
    (e[(e.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (e[(e.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (e[(e.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (e[(e.JsonpSupport = 4)] = "JsonpSupport"),
    (e[(e.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (e[(e.Fetch = 6)] = "Fetch"),
    e
  );
})(Cl || {});
function fy(e, t) {
  return { ɵkind: e, ɵproviders: t };
}
function hy(...e) {
  let t = [
    ms,
    vl,
    yl,
    { provide: an, useExisting: yl },
    { provide: Mr, useExisting: vl },
    { provide: ys, useValue: dy, multi: !0 },
    { provide: El, useValue: !0 },
    { provide: Sr, useClass: ly },
  ];
  for (let n of e) t.push(...n.ɵproviders);
  return Mi(t);
}
var Dl = new v("");
function py() {
  return fy(Cl.LegacyInterceptors, [
    { provide: Dl, useFactory: ry },
    { provide: ys, useExisting: Dl, multi: !0 },
  ]);
}
var Il = (() => {
  let t = class t {};
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵmod = ue({ type: t })),
    (t.ɵinj = ae({ providers: [hy(py())] }));
  let e = t;
  return e;
})();
var ws = class extends Ir {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Es = class e extends ws {
    static makeCurrent() {
      ll(new e());
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.parentNode && t.parentNode.removeChild(t);
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === "window"
        ? window
        : n === "document"
        ? t
        : n === "body"
        ? t.body
        : null;
    }
    getBaseHref(t) {
      let n = my();
      return n == null ? null : yy(n);
    }
    resetBaseElement() {
      cn = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return br(document.cookie, t);
    }
  },
  cn = null;
function my() {
  return (
    (cn = cn || document.querySelector("base")),
    cn ? cn.getAttribute("href") : null
  );
}
function yy(e) {
  return new URL(e, document.baseURI).pathname;
}
var Cs = class {
    addToWindow(t) {
      (ne.getAngularTestability = (r, o = !0) => {
        let i = t.findTestabilityInTree(r, o);
        if (i == null) throw new D(5103, !1);
        return i;
      }),
        (ne.getAllAngularTestabilities = () => t.getAllTestabilities()),
        (ne.getAllAngularRootElements = () => t.getAllRootElements());
      let n = (r) => {
        let o = ne.getAllAngularTestabilities(),
          i = o.length,
          s = function () {
            i--, i == 0 && r();
          };
        o.forEach((a) => {
          a.whenStable(s);
        });
      };
      ne.frameworkStabilizers || (ne.frameworkStabilizers = []),
        ne.frameworkStabilizers.push(n);
    }
    findTestabilityInTree(t, n, r) {
      if (n == null) return null;
      let o = t.getTestability(n);
      return (
        o ??
        (r
          ? ot().isShadowRoot(n)
            ? this.findTestabilityInTree(t, n.host, !0)
            : this.findTestabilityInTree(t, n.parentElement, !0)
          : null)
      );
    }
  },
  vy = (() => {
    let t = class t {
      build() {
        return new XMLHttpRequest();
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Is = new v(""),
  Tl = (() => {
    let t = class t {
      constructor(r, o) {
        (this._zone = o),
          (this._eventNameToPlugin = new Map()),
          r.forEach((i) => {
            i.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, o, i) {
        return this._findPluginFor(o).addEventListener(r, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let o = this._eventNameToPlugin.get(r);
        if (o) return o;
        if (((o = this._plugins.find((s) => s.supports(r))), !o))
          throw new D(5101, !1);
        return this._eventNameToPlugin.set(r, o), o;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(Is), w(k));
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Nr = class {
    constructor(t) {
      this._doc = t;
    }
  },
  vs = "ng-app-id",
  Al = (() => {
    let t = class t {
      constructor(r, o, i, s = {}) {
        (this.doc = r),
          (this.appId = o),
          (this.nonce = i),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ds(s)),
          this.resetHostNodes();
      }
      addStyles(r) {
        for (let o of r)
          this.changeUsageCount(o, 1) === 1 && this.onStyleAdded(o);
      }
      removeStyles(r) {
        for (let o of r)
          this.changeUsageCount(o, -1) <= 0 && this.onStyleRemoved(o);
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM;
        r && (r.forEach((o) => o.remove()), r.clear());
        for (let o of this.getAllStyles()) this.onStyleRemoved(o);
        this.resetHostNodes();
      }
      addHost(r) {
        this.hostNodes.add(r);
        for (let o of this.getAllStyles()) this.addStyleToHost(r, o);
      }
      removeHost(r) {
        this.hostNodes.delete(r);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(r) {
        for (let o of this.hostNodes) this.addStyleToHost(o, r);
      }
      onStyleRemoved(r) {
        let o = this.styleRef;
        o.get(r)?.elements?.forEach((i) => i.remove()), o.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${vs}="${this.appId}"]`);
        if (r?.length) {
          let o = new Map();
          return (
            r.forEach((i) => {
              i.textContent != null && o.set(i.textContent, i);
            }),
            o
          );
        }
        return null;
      }
      changeUsageCount(r, o) {
        let i = this.styleRef;
        if (i.has(r)) {
          let s = i.get(r);
          return (s.usage += o), s.usage;
        }
        return i.set(r, { usage: o, elements: [] }), o;
      }
      getStyleElement(r, o) {
        let i = this.styleNodesInDOM,
          s = i?.get(o);
        if (s?.parentNode === r) return i.delete(o), s.removeAttribute(vs), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = o),
            this.platformIsServer && a.setAttribute(vs, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, o) {
        let i = this.getStyleElement(r, o),
          s = this.styleRef,
          a = s.get(o)?.elements;
        a ? a.push(i) : s.set(o, { elements: [i], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(Me), w(pr), w(Bi, 8), w(Ue));
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Ds = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  _s = /%COMP%/g,
  xl = "%COMP%",
  Dy = `_nghost-${xl}`,
  wy = `_ngcontent-${xl}`,
  Ey = !0,
  Cy = new v("", { providedIn: "root", factory: () => Ey });
function Iy(e) {
  return wy.replace(_s, e);
}
function by(e) {
  return Dy.replace(_s, e);
}
function Sl(e, t) {
  return t.map((n) => n.replace(_s, e));
}
var bl = (() => {
    let t = class t {
      constructor(r, o, i, s, a, u, c, l = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = o),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ds(u)),
          (this.defaultRenderer = new ln(r, a, c, this.platformIsServer));
      }
      createRenderer(r, o) {
        if (!r || !o) return this.defaultRenderer;
        this.platformIsServer &&
          o.encapsulation === Ee.ShadowDom &&
          (o = G(L({}, o), { encapsulation: Ee.Emulated }));
        let i = this.getOrCreateRenderer(r, o);
        return (
          i instanceof Or
            ? i.applyToHost(r)
            : i instanceof dn && i.applyStyles(),
          i
        );
      }
      getOrCreateRenderer(r, o) {
        let i = this.rendererByCompId,
          s = i.get(o.id);
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (o.encapsulation) {
            case Ee.Emulated:
              s = new Or(c, l, o, this.appId, d, a, u, f);
              break;
            case Ee.ShadowDom:
              return new bs(c, l, r, o, a, u, this.nonce, f);
            default:
              s = new dn(c, l, o, d, a, u, f);
              break;
          }
          i.set(o.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(
        w(Tl),
        w(Al),
        w(pr),
        w(Cy),
        w(Me),
        w(Ue),
        w(k),
        w(Bi)
      );
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  ln = class {
    constructor(t, n, r, o) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(Ds[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (_l(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (_l(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      t && t.removeChild(n);
    }
    selectRootElement(t, n) {
      let r = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!r) throw new D(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ":" + n;
        let i = Ds[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = Ds[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & (xe.DashCase | xe.Important)
        ? t.style.setProperty(n, r, o & xe.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & xe.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r) {
      if (
        typeof t == "string" &&
        ((t = ot().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`);
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r)
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === "__ngUnwrap__") return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function _l(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var bs = class extends ln {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = Sl(o.id, o.styles);
      for (let l of c) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(this.nodeOrShadowRoot(t), n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  dn = class extends ln {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = u ? Sl(u, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Or = class extends dn {
    constructor(t, n, r, o, i, s, a, u) {
      let c = o + "-" + r.id;
      super(t, n, r, i, s, a, u, c),
        (this.contentAttr = Iy(c)),
        (this.hostAttr = by(c));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  _y = (() => {
    let t = class t extends Nr {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, o, i) {
        return (
          r.addEventListener(o, i, !1), () => this.removeEventListener(r, o, i)
        );
      }
      removeEventListener(r, o, i) {
        return r.removeEventListener(o, i);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(Me));
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Ml = ["alt", "control", "meta", "shift"],
  My = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  Ty = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Ay = (() => {
    let t = class t extends Nr {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return t.parseEventName(r) != null;
      }
      addEventListener(r, o, i) {
        let s = t.parseEventName(o),
          a = t.eventCallback(s.fullKey, i, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => ot().onAndCancel(r, s.domEventName, a));
      }
      static parseEventName(r) {
        let o = r.toLowerCase().split("."),
          i = o.shift();
        if (o.length === 0 || !(i === "keydown" || i === "keyup")) return null;
        let s = t._normalizeKey(o.pop()),
          a = "",
          u = o.indexOf("code");
        if (
          (u > -1 && (o.splice(u, 1), (a = "code.")),
          Ml.forEach((l) => {
            let d = o.indexOf(l);
            d > -1 && (o.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          o.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = i), (c.fullKey = a), c;
      }
      static matchEventFullKeyCode(r, o) {
        let i = My[r.key] || r.key,
          s = "";
        return (
          o.indexOf("code.") > -1 && ((i = r.code), (s = "code.")),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === " " ? (i = "space") : i === "." && (i = "dot"),
              Ml.forEach((a) => {
                if (a !== i) {
                  let u = Ty[a];
                  u(r) && (s += a + ".");
                }
              }),
              (s += i),
              s === o)
        );
      }
      static eventCallback(r, o, i) {
        return (s) => {
          t.matchEventFullKeyCode(s, r) && i.runGuarded(() => o(s));
        };
      }
      static _normalizeKey(r) {
        return r === "esc" ? "escape" : r;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(Me));
    }),
      (t.ɵprov = A({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })();
function xy() {
  Es.makeCurrent();
}
function Sy() {
  return new Ae();
}
function Ny() {
  return hc(document), document;
}
var Oy = [
    { provide: Ue, useValue: fl },
    { provide: ji, useValue: xy, multi: !0 },
    { provide: Me, useFactory: Ny, deps: [] },
  ],
  Nl = ls(il, "browser", Oy),
  Fy = new v(""),
  Ry = [
    { provide: nn, useClass: Cs, deps: [] },
    { provide: as, useClass: Er, deps: [k, Cr, nn] },
    { provide: Er, useClass: Er, deps: [k, Cr, nn] },
  ],
  Py = [
    { provide: lr, useValue: "root" },
    { provide: Ae, useFactory: Sy, deps: [] },
    { provide: Is, useClass: _y, multi: !0, deps: [Me, k, Ue] },
    { provide: Is, useClass: Ay, multi: !0, deps: [Me] },
    bl,
    Al,
    Tl,
    { provide: Wt, useExisting: bl },
    { provide: xt, useClass: vy, deps: [] },
    [],
  ],
  Ol = (() => {
    let t = class t {
      constructor(r) {}
      static withServerTransition(r) {
        return { ngModule: t, providers: [{ provide: pr, useValue: r.appId }] };
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(w(Fy, 12));
    }),
      (t.ɵmod = ue({ type: t })),
      (t.ɵinj = ae({ providers: [...Py, ...Ry], imports: [dl, sl] }));
    let e = t;
    return e;
  })();
var $l = (() => {
    let t = class t {
      constructor(r, o) {
        (this._renderer = r),
          (this._elementRef = o),
          (this.onChange = (i) => {}),
          (this.onTouched = () => {});
      }
      setProperty(r, o) {
        this._renderer.setProperty(this._elementRef.nativeElement, r, o);
      }
      registerOnTouched(r) {
        this.onTouched = r;
      }
      registerOnChange(r) {
        this.onChange = r;
      }
      setDisabledState(r) {
        this.setProperty("disabled", r);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(S(Jt), S(At));
    }),
      (t.ɵdir = j({ type: t }));
    let e = t;
    return e;
  })(),
  xs = (() => {
    let t = class t extends $l {};
    (t.ɵfac = (() => {
      let r;
      return function (i) {
        return (r || (r = Mt(t)))(i || t);
      };
    })()),
      (t.ɵdir = j({ type: t, features: [ee] }));
    let e = t;
    return e;
  })(),
  Ur = new v(""),
  Ly = { provide: Ur, useExisting: ge(() => Ss), multi: !0 },
  Ss = (() => {
    let t = class t extends xs {
      writeValue(r) {
        this.setProperty("checked", r);
      }
    };
    (t.ɵfac = (() => {
      let r;
      return function (i) {
        return (r || (r = Mt(t)))(i || t);
      };
    })()),
      (t.ɵdir = j({
        type: t,
        selectors: [
          ["input", "type", "checkbox", "formControlName", ""],
          ["input", "type", "checkbox", "formControl", ""],
          ["input", "type", "checkbox", "ngModel", ""],
        ],
        hostBindings: function (o, i) {
          o & 1 &&
            _e("change", function (a) {
              return i.onChange(a.target.checked);
            })("blur", function () {
              return i.onTouched();
            });
        },
        features: [Fe([Ly]), ee],
      }));
    let e = t;
    return e;
  })(),
  Vy = { provide: Ur, useExisting: ge(() => Hr), multi: !0 };
function jy() {
  let e = ot() ? ot().getUserAgent() : "";
  return /android (\d+)/.test(e.toLowerCase());
}
var By = new v(""),
  Hr = (() => {
    let t = class t extends $l {
      constructor(r, o, i) {
        super(r, o),
          (this._compositionMode = i),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !jy());
      }
      writeValue(r) {
        let o = r ?? "";
        this.setProperty("value", o);
      }
      _handleInput(r) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(r);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(r) {
        (this._composing = !1), this._compositionMode && this.onChange(r);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(S(Jt), S(At), S(By, 8));
    }),
      (t.ɵdir = j({
        type: t,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (o, i) {
          o & 1 &&
            _e("input", function (a) {
              return i._handleInput(a.target.value);
            })("blur", function () {
              return i.onTouched();
            })("compositionstart", function () {
              return i._compositionStart();
            })("compositionend", function (a) {
              return i._compositionEnd(a.target.value);
            });
        },
        features: [Fe([Vy]), ee],
      }));
    let e = t;
    return e;
  })();
function Ge(e) {
  return (
    e == null || ((typeof e == "string" || Array.isArray(e)) && e.length === 0)
  );
}
function Ul(e) {
  return e != null && typeof e.length == "number";
}
var gn = new v(""),
  Gr = new v(""),
  $y =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  Re = class {
    static min(t) {
      return Hl(t);
    }
    static max(t) {
      return Uy(t);
    }
    static required(t) {
      return Hy(t);
    }
    static requiredTrue(t) {
      return Gy(t);
    }
    static email(t) {
      return zy(t);
    }
    static minLength(t) {
      return Wy(t);
    }
    static maxLength(t) {
      return qy(t);
    }
    static pattern(t) {
      return Zy(t);
    }
    static nullValidator(t) {
      return Pr(t);
    }
    static compose(t) {
      return Yl(t);
    }
    static composeAsync(t) {
      return Kl(t);
    }
  };
function Hl(e) {
  return (t) => {
    if (Ge(t.value) || Ge(e)) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n < e ? { min: { min: e, actual: t.value } } : null;
  };
}
function Uy(e) {
  return (t) => {
    if (Ge(t.value) || Ge(e)) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n > e ? { max: { max: e, actual: t.value } } : null;
  };
}
function Hy(e) {
  return Ge(e.value) ? { required: !0 } : null;
}
function Gy(e) {
  return e.value === !0 ? null : { required: !0 };
}
function zy(e) {
  return Ge(e.value) || $y.test(e.value) ? null : { email: !0 };
}
function Wy(e) {
  return (t) =>
    Ge(t.value) || !Ul(t.value)
      ? null
      : t.value.length < e
      ? { minlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function qy(e) {
  return (t) =>
    Ul(t.value) && t.value.length > e
      ? { maxlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function Zy(e) {
  if (!e) return Pr;
  let t, n;
  return (
    typeof e == "string"
      ? ((n = ""),
        e.charAt(0) !== "^" && (n += "^"),
        (n += e),
        e.charAt(e.length - 1) !== "$" && (n += "$"),
        (t = new RegExp(n)))
      : ((n = e.toString()), (t = e)),
    (r) => {
      if (Ge(r.value)) return null;
      let o = r.value;
      return t.test(o)
        ? null
        : { pattern: { requiredPattern: n, actualValue: o } };
    }
  );
}
function Pr(e) {
  return null;
}
function Gl(e) {
  return e != null;
}
function zl(e) {
  return rn(e) ? Ze(e) : e;
}
function Wl(e) {
  let t = {};
  return (
    e.forEach((n) => {
      t = n != null ? L(L({}, t), n) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function ql(e, t) {
  return t.map((n) => n(e));
}
function Yy(e) {
  return !e.validate;
}
function Zl(e) {
  return e.map((t) => (Yy(t) ? t : (n) => t.validate(n)));
}
function Yl(e) {
  if (!e) return null;
  let t = e.filter(Gl);
  return t.length == 0
    ? null
    : function (n) {
        return Wl(ql(n, t));
      };
}
function Ql(e) {
  return e != null ? Yl(Zl(e)) : null;
}
function Kl(e) {
  if (!e) return null;
  let t = e.filter(Gl);
  return t.length == 0
    ? null
    : function (n) {
        let r = ql(n, t).map(zl);
        return co(r).pipe(Y(Wl));
      };
}
function Jl(e) {
  return e != null ? Kl(Zl(e)) : null;
}
function Fl(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function Xl(e) {
  return e._rawValidators;
}
function ed(e) {
  return e._rawAsyncValidators;
}
function Ms(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function kr(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function Rl(e, t) {
  let n = Ms(t);
  return (
    Ms(e).forEach((o) => {
      kr(n, o) || n.push(o);
    }),
    n
  );
}
function Pl(e, t) {
  return Ms(t).filter((n) => !kr(e, n));
}
var Lr = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(t) {
      (this._rawValidators = t || []),
        (this._composedValidatorFn = Ql(this._rawValidators));
    }
    _setAsyncValidators(t) {
      (this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = Jl(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((t) => t()),
        (this._onDestroyCallbacks = []);
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, n) {
      return this.control ? this.control.hasError(t, n) : !1;
    }
    getError(t, n) {
      return this.control ? this.control.getError(t, n) : null;
    }
  },
  le = class extends Lr {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  pn = class extends Lr {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  Vr = class {
    constructor(t) {
      this._cd = t;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  Qy = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  qI = G(L({}, Qy), { "[class.ng-submitted]": "isSubmitted" }),
  td = (() => {
    let t = class t extends Vr {
      constructor(r) {
        super(r);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(S(pn, 2));
    }),
      (t.ɵdir = j({
        type: t,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (o, i) {
          o & 2 &&
            wr("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)(
              "ng-pristine",
              i.isPristine
            )("ng-dirty", i.isDirty)("ng-valid", i.isValid)(
              "ng-invalid",
              i.isInvalid
            )("ng-pending", i.isPending);
        },
        features: [ee],
      }));
    let e = t;
    return e;
  })(),
  nd = (() => {
    let t = class t extends Vr {
      constructor(r) {
        super(r);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(S(le, 10));
    }),
      (t.ɵdir = j({
        type: t,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (o, i) {
          o & 2 &&
            wr("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)(
              "ng-pristine",
              i.isPristine
            )("ng-dirty", i.isDirty)("ng-valid", i.isValid)(
              "ng-invalid",
              i.isInvalid
            )("ng-pending", i.isPending)("ng-submitted", i.isSubmitted);
        },
        features: [ee],
      }));
    let e = t;
    return e;
  })();
var fn = "VALID",
  Fr = "INVALID",
  Nt = "PENDING",
  hn = "DISABLED";
function Ns(e) {
  return (zr(e) ? e.validators : e) || null;
}
function Ky(e) {
  return Array.isArray(e) ? Ql(e) : e || null;
}
function Os(e, t) {
  return (zr(t) ? t.asyncValidators : e) || null;
}
function Jy(e) {
  return Array.isArray(e) ? Jl(e) : e || null;
}
function zr(e) {
  return e != null && !Array.isArray(e) && typeof e == "object";
}
function rd(e, t, n) {
  let r = e.controls;
  if (!(t ? Object.keys(r) : r).length) throw new D(1e3, "");
  if (!r[n]) throw new D(1001, "");
}
function od(e, t, n) {
  e._forEachChild((r, o) => {
    if (n[o] === void 0) throw new D(1002, "");
  });
}
var Ot = class {
    constructor(t, n) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = !1),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._onDisabledChange = []),
        this._assignValidators(t),
        this._assignAsyncValidators(n);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get valid() {
      return this.status === fn;
    }
    get invalid() {
      return this.status === Fr;
    }
    get pending() {
      return this.status == Nt;
    }
    get disabled() {
      return this.status === hn;
    }
    get enabled() {
      return this.status !== hn;
    }
    get dirty() {
      return !this.pristine;
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(Rl(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(Rl(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(Pl(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(Pl(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return kr(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return kr(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      (this.touched = !0),
        this._parent && !t.onlySelf && this._parent.markAsTouched(t);
    }
    markAllAsTouched() {
      this.markAsTouched({ onlySelf: !0 }),
        this._forEachChild((t) => t.markAllAsTouched());
    }
    markAsUntouched(t = {}) {
      (this.touched = !1),
        (this._pendingTouched = !1),
        this._forEachChild((n) => {
          n.markAsUntouched({ onlySelf: !0 });
        }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t);
    }
    markAsDirty(t = {}) {
      (this.pristine = !1),
        this._parent && !t.onlySelf && this._parent.markAsDirty(t);
    }
    markAsPristine(t = {}) {
      (this.pristine = !0),
        (this._pendingDirty = !1),
        this._forEachChild((n) => {
          n.markAsPristine({ onlySelf: !0 });
        }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t);
    }
    markAsPending(t = {}) {
      (this.status = Nt),
        t.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !t.onlySelf && this._parent.markAsPending(t);
    }
    disable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = hn),
        (this.errors = null),
        this._forEachChild((r) => {
          r.disable(G(L({}, t), { onlySelf: !0 }));
        }),
        this._updateValue(),
        t.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._updateAncestors(G(L({}, t), { skipPristineCheck: n })),
        this._onDisabledChange.forEach((r) => r(!0));
    }
    enable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = fn),
        this._forEachChild((r) => {
          r.enable(G(L({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(G(L({}, t), { skipPristineCheck: n })),
        this._onDisabledChange.forEach((r) => r(!1));
    }
    _updateAncestors(t) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine(),
        this._parent._updateTouched());
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      this._setInitialStatus(),
        this._updateValue(),
        this.enabled &&
          (this._cancelExistingSubscription(),
          (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === fn || this.status === Nt) &&
            this._runAsyncValidator(t.emitEvent)),
        t.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._parent && !t.onlySelf && this._parent.updateValueAndValidity(t);
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      this._forEachChild((n) => n._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? hn : fn;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t) {
      if (this.asyncValidator) {
        (this.status = Nt), (this._hasOwnPendingAsyncValidator = !0);
        let n = zl(this.asyncValidator(this));
        this._asyncValidationSubscription = n.subscribe((r) => {
          (this._hasOwnPendingAsyncValidator = !1),
            this.setErrors(r, { emitEvent: t });
        });
      }
    }
    _cancelExistingSubscription() {
      this._asyncValidationSubscription &&
        (this._asyncValidationSubscription.unsubscribe(),
        (this._hasOwnPendingAsyncValidator = !1));
    }
    setErrors(t, n = {}) {
      (this.errors = t), this._updateControlsErrors(n.emitEvent !== !1);
    }
    get(t) {
      let n = t;
      return n == null ||
        (Array.isArray(n) || (n = n.split(".")), n.length === 0)
        ? null
        : n.reduce((r, o) => r && r._find(o), this);
    }
    getError(t, n) {
      let r = n ? this.get(n) : this;
      return r && r.errors ? r.errors[t] : null;
    }
    hasError(t, n) {
      return !!this.getError(t, n);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t) {
      (this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(t);
    }
    _initObservables() {
      (this.valueChanges = new Q()), (this.statusChanges = new Q());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? hn
        : this.errors
        ? Fr
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Nt)
        ? Nt
        : this._anyControlsHaveStatus(Fr)
        ? Fr
        : fn;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((n) => n.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t = {}) {
      (this.pristine = !this._anyControlsDirty()),
        this._parent && !t.onlySelf && this._parent._updatePristine(t);
    }
    _updateTouched(t = {}) {
      (this.touched = this._anyControlsTouched()),
        this._parent && !t.onlySelf && this._parent._updateTouched(t);
    }
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      zr(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let n = this._parent && this._parent.dirty;
      return !t && !!n && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      (this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = Ky(this._rawValidators));
    }
    _assignAsyncValidators(t) {
      (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = Jy(this._rawAsyncValidators));
    }
  },
  jr = class extends Ot {
    constructor(t, n, r) {
      super(Ns(n), Os(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(t, n) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = n),
          n.setParent(this),
          n._registerOnCollectionChange(this._onCollectionChange),
          n);
    }
    addControl(t, n, r = {}) {
      this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(t, n = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    setControl(t, n, r = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        n && this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, n = {}) {
      od(this, !0, t),
        Object.keys(t).forEach((r) => {
          rd(this, !0, r),
            this.controls[r].setValue(t[r], {
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(t, n = {}) {
      t != null &&
        (Object.keys(t).forEach((r) => {
          let o = this.controls[r];
          o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = {}, n = {}) {
      this._forEachChild((r, o) => {
        r.reset(t ? t[o] : null, { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n),
        this._updateTouched(n),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (t, n, r) => ((t[r] = n.getRawValue()), t)
      );
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (n, r) =>
        r._syncPendingControls() ? !0 : n
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((n) => {
        let r = this.controls[n];
        r && t(r, n);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        t.setParent(this),
          t._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [n, r] of Object.entries(this.controls))
        if (this.contains(n) && t(r)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
      );
    }
    _reduceChildren(t, n) {
      let r = t;
      return (
        this._forEachChild((o, i) => {
          r = n(r, o, i);
        }),
        r
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls))
        if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var Ts = class extends jr {};
var id = new v("CallSetDisabledState", {
    providedIn: "root",
    factory: () => Fs,
  }),
  Fs = "always";
function Rs(e, t) {
  return [...t.path, e];
}
function kl(e, t, n = Fs) {
  Ps(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === "always") &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    ev(e, t),
    nv(e, t),
    tv(e, t),
    Xy(e, t);
}
function Ll(e, t, n = !0) {
  let r = () => {};
  t.valueAccessor &&
    (t.valueAccessor.registerOnChange(r), t.valueAccessor.registerOnTouched(r)),
    $r(e, t),
    e &&
      (t._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {}));
}
function Br(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t);
  });
}
function Xy(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let n = (r) => {
      t.valueAccessor.setDisabledState(r);
    };
    e.registerOnDisabledChange(n),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(n);
      });
  }
}
function Ps(e, t) {
  let n = Xl(e);
  t.validator !== null
    ? e.setValidators(Fl(n, t.validator))
    : typeof n == "function" && e.setValidators([n]);
  let r = ed(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators(Fl(r, t.asyncValidator))
    : typeof r == "function" && e.setAsyncValidators([r]);
  let o = () => e.updateValueAndValidity();
  Br(t._rawValidators, o), Br(t._rawAsyncValidators, o);
}
function $r(e, t) {
  let n = !1;
  if (e !== null) {
    if (t.validator !== null) {
      let o = Xl(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.validator);
        i.length !== o.length && ((n = !0), e.setValidators(i));
      }
    }
    if (t.asyncValidator !== null) {
      let o = ed(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.asyncValidator);
        i.length !== o.length && ((n = !0), e.setAsyncValidators(i));
      }
    }
  }
  let r = () => {};
  return Br(t._rawValidators, r), Br(t._rawAsyncValidators, r), n;
}
function ev(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    (e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === "change" && sd(e, t);
  });
}
function tv(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    (e._pendingTouched = !0),
      e.updateOn === "blur" && e._pendingChange && sd(e, t),
      e.updateOn !== "submit" && e.markAsTouched();
  });
}
function sd(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1);
}
function nv(e, t) {
  let n = (r, o) => {
    t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
  };
  e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n);
    });
}
function rv(e, t) {
  e == null, Ps(e, t);
}
function ov(e, t) {
  return $r(e, t);
}
function iv(e, t) {
  if (!e.hasOwnProperty("model")) return !1;
  let n = e.model;
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue);
}
function sv(e) {
  return Object.getPrototypeOf(e.constructor) === xs;
}
function av(e, t) {
  e._syncPendingControls(),
    t.forEach((n) => {
      let r = n.control;
      r.updateOn === "submit" &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    });
}
function uv(e, t) {
  if (!t) return null;
  Array.isArray(t);
  let n, r, o;
  return (
    t.forEach((i) => {
      i.constructor === Hr ? (n = i) : sv(i) ? (r = i) : (o = i);
    }),
    o || r || n || null
  );
}
function cv(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Vl(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function jl(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    Object.keys(e).length === 2 &&
    "value" in e &&
    "disabled" in e
  );
}
var Rr = class extends Ot {
  constructor(t = null, n, r) {
    super(Ns(n), Os(r, n)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(t),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      zr(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (jl(t) ? (this.defaultValue = t.value) : (this.defaultValue = t));
  }
  setValue(t, n = {}) {
    (this.value = this._pendingValue = t),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) =>
          r(this.value, n.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(n);
  }
  patchValue(t, n = {}) {
    this.setValue(t, n);
  }
  reset(t = this.defaultValue, n = {}) {
    this._applyFormState(t),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    Vl(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    Vl(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(t) {
    jl(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var lv = (e) => e instanceof Rr,
  dv = (() => {
    let t = class t extends le {
      ngOnInit() {
        this._checkParentType(), this.formDirective.addFormGroup(this);
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeFormGroup(this);
      }
      get control() {
        return this.formDirective.getFormGroup(this);
      }
      get path() {
        return Rs(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
    };
    (t.ɵfac = (() => {
      let r;
      return function (i) {
        return (r || (r = Mt(t)))(i || t);
      };
    })()),
      (t.ɵdir = j({ type: t, features: [ee] }));
    let e = t;
    return e;
  })();
var ad = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵdir = j({
        type: t,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""],
      }));
    let e = t;
    return e;
  })(),
  fv = { provide: Ur, useExisting: ge(() => ks), multi: !0 },
  ks = (() => {
    let t = class t extends xs {
      writeValue(r) {
        let o = r ?? "";
        this.setProperty("value", o);
      }
      registerOnChange(r) {
        this.onChange = (o) => {
          r(o == "" ? null : parseFloat(o));
        };
      }
    };
    (t.ɵfac = (() => {
      let r;
      return function (i) {
        return (r || (r = Mt(t)))(i || t);
      };
    })()),
      (t.ɵdir = j({
        type: t,
        selectors: [
          ["input", "type", "number", "formControlName", ""],
          ["input", "type", "number", "formControl", ""],
          ["input", "type", "number", "ngModel", ""],
        ],
        hostBindings: function (o, i) {
          o & 1 &&
            _e("input", function (a) {
              return i.onChange(a.target.value);
            })("blur", function () {
              return i.onTouched();
            });
        },
        features: [Fe([fv]), ee],
      }));
    let e = t;
    return e;
  })();
var ud = new v("");
var hv = { provide: le, useExisting: ge(() => Wr) },
  Wr = (() => {
    let t = class t extends le {
      constructor(r, o, i) {
        super(),
          (this.callSetDisabledState = i),
          (this.submitted = !1),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new Q()),
          this._setValidators(r),
          this._setAsyncValidators(o);
      }
      ngOnChanges(r) {
        this._checkFormPresent(),
          r.hasOwnProperty("form") &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          ($r(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(r) {
        let o = this.form.get(r.path);
        return (
          kl(o, r, this.callSetDisabledState),
          o.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(r),
          o
        );
      }
      getControl(r) {
        return this.form.get(r.path);
      }
      removeControl(r) {
        Ll(r.control || null, r, !1), cv(this.directives, r);
      }
      addFormGroup(r) {
        this._setUpFormContainer(r);
      }
      removeFormGroup(r) {
        this._cleanUpFormContainer(r);
      }
      getFormGroup(r) {
        return this.form.get(r.path);
      }
      addFormArray(r) {
        this._setUpFormContainer(r);
      }
      removeFormArray(r) {
        this._cleanUpFormContainer(r);
      }
      getFormArray(r) {
        return this.form.get(r.path);
      }
      updateModel(r, o) {
        this.form.get(r.path).setValue(o);
      }
      onSubmit(r) {
        return (
          (this.submitted = !0),
          av(this.form, this.directives),
          this.ngSubmit.emit(r),
          r?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(r = void 0) {
        this.form.reset(r), (this.submitted = !1);
      }
      _updateDomValue() {
        this.directives.forEach((r) => {
          let o = r.control,
            i = this.form.get(r.path);
          o !== i &&
            (Ll(o || null, r),
            lv(i) && (kl(i, r, this.callSetDisabledState), (r.control = i)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(r) {
        let o = this.form.get(r.path);
        rv(o, r), o.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(r) {
        if (this.form) {
          let o = this.form.get(r.path);
          o && ov(o, r) && o.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        Ps(this.form, this), this._oldForm && $r(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(S(gn, 10), S(Gr, 10), S(id, 8));
    }),
      (t.ɵdir = j({
        type: t,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (o, i) {
          o & 1 &&
            _e("submit", function (a) {
              return i.onSubmit(a);
            })("reset", function () {
              return i.onReset();
            });
        },
        inputs: { form: [X.None, "formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [Fe([hv]), ee, bt],
      }));
    let e = t;
    return e;
  })(),
  pv = { provide: le, useExisting: ge(() => qr) },
  qr = (() => {
    let t = class t extends dv {
      constructor(r, o, i) {
        super(),
          (this.name = null),
          (this._parent = r),
          this._setValidators(o),
          this._setAsyncValidators(i);
      }
      _checkParentType() {
        cd(this._parent);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(S(le, 13), S(gn, 10), S(Gr, 10));
    }),
      (t.ɵdir = j({
        type: t,
        selectors: [["", "formGroupName", ""]],
        inputs: { name: [X.None, "formGroupName", "name"] },
        features: [Fe([pv]), ee],
      }));
    let e = t;
    return e;
  })(),
  gv = { provide: le, useExisting: ge(() => Zr) },
  Zr = (() => {
    let t = class t extends le {
      constructor(r, o, i) {
        super(),
          (this.name = null),
          (this._parent = r),
          this._setValidators(o),
          this._setAsyncValidators(i);
      }
      ngOnInit() {
        this._checkParentType(), this.formDirective.addFormArray(this);
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeFormArray(this);
      }
      get control() {
        return this.formDirective.getFormArray(this);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      get path() {
        return Rs(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      _checkParentType() {
        cd(this._parent);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(S(le, 13), S(gn, 10), S(Gr, 10));
    }),
      (t.ɵdir = j({
        type: t,
        selectors: [["", "formArrayName", ""]],
        inputs: { name: [X.None, "formArrayName", "name"] },
        features: [Fe([gv]), ee],
      }));
    let e = t;
    return e;
  })();
function cd(e) {
  return !(e instanceof qr) && !(e instanceof Wr) && !(e instanceof Zr);
}
var mv = { provide: pn, useExisting: ge(() => Ls) },
  Ls = (() => {
    let t = class t extends pn {
      set isDisabled(r) {}
      constructor(r, o, i, s, a) {
        super(),
          (this._ngModelWarningConfig = a),
          (this._added = !1),
          (this.name = null),
          (this.update = new Q()),
          (this._ngModelWarningSent = !1),
          (this._parent = r),
          this._setValidators(o),
          this._setAsyncValidators(i),
          (this.valueAccessor = uv(this, s));
      }
      ngOnChanges(r) {
        this._added || this._setUpControl(),
          iv(r, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(r) {
        (this.viewModel = r), this.update.emit(r);
      }
      get path() {
        return Rs(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
    };
    (t._ngModelWarningSentOnce = !1),
      (t.ɵfac = function (o) {
        return new (o || t)(
          S(le, 13),
          S(gn, 10),
          S(Gr, 10),
          S(Ur, 10),
          S(ud, 8)
        );
      }),
      (t.ɵdir = j({
        type: t,
        selectors: [["", "formControlName", ""]],
        inputs: {
          name: [X.None, "formControlName", "name"],
          isDisabled: [X.None, "disabled", "isDisabled"],
          model: [X.None, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        features: [Fe([mv]), ee, bt],
      }));
    let e = t;
    return e;
  })();
function yv(e) {
  return typeof e == "number" ? e : parseFloat(e);
}
var vv = (() => {
  let t = class t {
    constructor() {
      this._validator = Pr;
    }
    ngOnChanges(r) {
      if (this.inputName in r) {
        let o = this.normalizeInput(r[this.inputName].currentValue);
        (this._enabled = this.enabled(o)),
          (this._validator = this._enabled ? this.createValidator(o) : Pr),
          this._onChange && this._onChange();
      }
    }
    validate(r) {
      return this._validator(r);
    }
    registerOnValidatorChange(r) {
      this._onChange = r;
    }
    enabled(r) {
      return r != null;
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵdir = j({ type: t, features: [bt] }));
  let e = t;
  return e;
})();
var Dv = { provide: gn, useExisting: ge(() => Vs), multi: !0 },
  Vs = (() => {
    let t = class t extends vv {
      constructor() {
        super(...arguments),
          (this.inputName = "min"),
          (this.normalizeInput = (r) => yv(r)),
          (this.createValidator = (r) => Hl(r));
      }
    };
    (t.ɵfac = (() => {
      let r;
      return function (i) {
        return (r || (r = Mt(t)))(i || t);
      };
    })()),
      (t.ɵdir = j({
        type: t,
        selectors: [
          ["input", "type", "number", "min", "", "formControlName", ""],
          ["input", "type", "number", "min", "", "formControl", ""],
          ["input", "type", "number", "min", "", "ngModel", ""],
        ],
        hostVars: 1,
        hostBindings: function (o, i) {
          o & 2 && is("min", i._enabled ? i.min : null);
        },
        inputs: { min: "min" },
        features: [Fe([Dv]), ee],
      }));
    let e = t;
    return e;
  })();
var wv = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵmod = ue({ type: t })),
      (t.ɵinj = ae({}));
    let e = t;
    return e;
  })(),
  As = class extends Ot {
    constructor(t, n, r) {
      super(Ns(n), Os(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    at(t) {
      return this.controls[this._adjustIndex(t)];
    }
    push(t, n = {}) {
      this.controls.push(t),
        this._registerControl(t),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    insert(t, n, r = {}) {
      this.controls.splice(t, 0, n),
        this._registerControl(n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent });
    }
    removeAt(t, n = {}) {
      let r = this._adjustIndex(t);
      r < 0 && (r = 0),
        this.controls[r] &&
          this.controls[r]._registerOnCollectionChange(() => {}),
        this.controls.splice(r, 1),
        this.updateValueAndValidity({ emitEvent: n.emitEvent });
    }
    setControl(t, n, r = {}) {
      let o = this._adjustIndex(t);
      o < 0 && (o = 0),
        this.controls[o] &&
          this.controls[o]._registerOnCollectionChange(() => {}),
        this.controls.splice(o, 1),
        n && (this.controls.splice(o, 0, n), this._registerControl(n)),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    get length() {
      return this.controls.length;
    }
    setValue(t, n = {}) {
      od(this, !1, t),
        t.forEach((r, o) => {
          rd(this, !1, o),
            this.at(o).setValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(t, n = {}) {
      t != null &&
        (t.forEach((r, o) => {
          this.at(o) &&
            this.at(o).patchValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = [], n = {}) {
      this._forEachChild((r, o) => {
        r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n),
        this._updateTouched(n),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this.controls.map((t) => t.getRawValue());
    }
    clear(t = {}) {
      this.controls.length < 1 ||
        (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
        this.controls.splice(0),
        this.updateValueAndValidity({ emitEvent: t.emitEvent }));
    }
    _adjustIndex(t) {
      return t < 0 ? t + this.length : t;
    }
    _syncPendingControls() {
      let t = this.controls.reduce(
        (n, r) => (r._syncPendingControls() ? !0 : n),
        !1
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      this.controls.forEach((n, r) => {
        t(n, r);
      });
    }
    _updateValue() {
      this.value = this.controls
        .filter((t) => t.enabled || this.disabled)
        .map((t) => t.value);
    }
    _anyControls(t) {
      return this.controls.some((n) => n.enabled && t(n));
    }
    _setUpControls() {
      this._forEachChild((t) => this._registerControl(t));
    }
    _allControlsDisabled() {
      for (let t of this.controls) if (t.enabled) return !1;
      return this.controls.length > 0 || this.disabled;
    }
    _registerControl(t) {
      t.setParent(this),
        t._registerOnCollectionChange(this._onCollectionChange);
    }
    _find(t) {
      return this.at(t) ?? null;
    }
  };
function Bl(e) {
  return (
    !!e &&
    (e.asyncValidators !== void 0 ||
      e.validators !== void 0 ||
      e.updateOn !== void 0)
  );
}
var ld = (() => {
  let t = class t {
    constructor() {
      this.useNonNullable = !1;
    }
    get nonNullable() {
      let r = new t();
      return (r.useNonNullable = !0), r;
    }
    group(r, o = null) {
      let i = this._reduceControls(r),
        s = {};
      return (
        Bl(o)
          ? (s = o)
          : o !== null &&
            ((s.validators = o.validator),
            (s.asyncValidators = o.asyncValidator)),
        new jr(i, s)
      );
    }
    record(r, o = null) {
      let i = this._reduceControls(r);
      return new Ts(i, o);
    }
    control(r, o, i) {
      let s = {};
      return this.useNonNullable
        ? (Bl(o) ? (s = o) : ((s.validators = o), (s.asyncValidators = i)),
          new Rr(r, G(L({}, s), { nonNullable: !0 })))
        : new Rr(r, o, i);
    }
    array(r, o, i) {
      let s = r.map((a) => this._createControl(a));
      return new As(s, o, i);
    }
    _reduceControls(r) {
      let o = {};
      return (
        Object.keys(r).forEach((i) => {
          o[i] = this._createControl(r[i]);
        }),
        o
      );
    }
    _createControl(r) {
      if (r instanceof Rr) return r;
      if (r instanceof Ot) return r;
      if (Array.isArray(r)) {
        let o = r[0],
          i = r.length > 1 ? r[1] : null,
          s = r.length > 2 ? r[2] : null;
        return this.control(o, i, s);
      } else return this.control(r);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = A({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
var dd = (() => {
  let t = class t {
    static withConfig(r) {
      return {
        ngModule: t,
        providers: [
          { provide: ud, useValue: r.warnOnNgModelWithFormControl ?? "always" },
          { provide: id, useValue: r.callSetDisabledState ?? Fs },
        ],
      };
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵmod = ue({ type: t })),
    (t.ɵinj = ae({ imports: [wv] }));
  let e = t;
  return e;
})();
var Yr = (() => {
  let t = class t {
    constructor() {
      this.http = T(ms);
    }
    placeOrder(r) {
      return uo(this.http.post("/api/order", r));
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = A({ token: t, factory: t.ɵfac }));
  let e = t;
  return e;
})();
function Cv(e, t) {
  if (e & 1) {
    let n = Yc();
    O(0, "tr", 9)(1, "td"),
      Oe(2, "input", 10),
      F(),
      O(3, "td"),
      Oe(4, "input", 11),
      F(),
      O(5, "td")(6, "button", 7),
      _e("click", function () {
        let o = ku(n).$index,
          i = ss(2);
        return Lu(i.removeItem(o));
      }),
      ce(7, "X"),
      F()()();
  }
  if (e & 2) {
    let n = t.$index;
    tn("formGroupName", n);
  }
}
function Iv(e, t) {
  if (
    (e & 1 &&
      (O(0, "table")(1, "thead")(2, "tr")(3, "th"),
      ce(4, "Item"),
      F(),
      O(5, "th"),
      ce(6, "Quantity"),
      F()()(),
      O(7, "tbody", 8),
      qc(8, Cv, 8, 1, "tr", 9, Wc),
      F()()),
    e & 2)
  ) {
    let n = ss();
    Kt(8), Zc(n.items.controls);
  }
}
function bv(e, t) {
  e & 1 && (O(0, "h3"), ce(1, "Your cart is empty"), F());
}
var fd = (() => {
  let t = class t {
    constructor() {
      (this.fb = T(ld)), (this.orderSvc = T(Yr));
    }
    ngOnInit() {
      this.form = this.createForm();
    }
    process() {
      let r = this.form.value;
      this.orderSvc
        .placeOrder(r)
        .then((o) => {
          alert(`Your order id is ${o.orderId}`),
            (this.form = this.createForm());
        })
        .catch((o) => alert(`Error: ${JSON.stringify(o)}`));
    }
    addItem() {
      this.items.push(
        this.fb.group({
          item: this.fb.control("", [Re.required]),
          quantity: this.fb.control(1, [Re.required, Re.min(1)]),
        })
      );
    }
    removeItem(r) {
      this.items.removeAt(r);
    }
    invalid() {
      return this.form.invalid || this.items.length <= 0;
    }
    createForm() {
      return (
        (this.items = this.fb.array([])),
        this.fb.group({
          name: this.fb.control("", [Re.required]),
          email: this.fb.control("", [Re.required, Re.email]),
          rush: this.fb.control(!1),
          comments: this.fb.control(""),
          items: this.items,
        })
      );
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = mu({
      type: t,
      selectors: [["app-root"]],
      decls: 34,
      vars: 3,
      consts: [
        [3, "submit", "formGroup"],
        ["type", "text", "size", "30", "formControlName", "name"],
        ["type", "email", "size", "30", "formControlName", "email"],
        ["type", "checkbox", "formControlName", "rush"],
        ["cols", "30", "rows", "4", "formControlName", "comments"],
        [1, "spread"],
        ["type", "submit", 3, "disabled"],
        ["type", "button", 3, "click"],
        ["formArrayName", "items"],
        [3, "formGroupName"],
        [
          "type",
          "text",
          "size",
          "30",
          "placeholder",
          "Purchase item",
          "formControlName",
          "item",
        ],
        [
          "type",
          "number",
          "min",
          "1",
          "step",
          "1",
          "formControlName",
          "quantity",
        ],
      ],
      template: function (o, i) {
        o & 1 &&
          (O(0, "h1"),
          ce(1, "Order Form"),
          F(),
          O(2, "form", 0),
          _e("submit", function () {
            return i.process();
          }),
          O(3, "table")(4, "tr")(5, "td"),
          ce(6, " Name: "),
          F(),
          O(7, "td"),
          Oe(8, "input", 1),
          F()(),
          O(9, "tr")(10, "td"),
          ce(11, " Email: "),
          F(),
          O(12, "td"),
          Oe(13, "input", 2),
          F()(),
          O(14, "tr")(15, "td"),
          ce(16, " Rush: "),
          F(),
          O(17, "td"),
          Oe(18, "input", 3),
          F()(),
          O(19, "tr")(20, "td"),
          ce(21, " Comments: "),
          F(),
          O(22, "td"),
          Oe(23, "textarea", 4),
          F()(),
          O(24, "tr"),
          Oe(25, "td"),
          O(26, "td")(27, "div", 5)(28, "button", 6),
          ce(29, "Order"),
          F(),
          O(30, "button", 7),
          _e("click", function () {
            return i.addItem();
          }),
          ce(31, "Add"),
          F()()()()(),
          qt(32, Iv, 10, 0, "table")(33, bv, 2, 0),
          F()),
          o & 2 &&
            (Kt(2),
            tn("formGroup", i.form),
            Kt(26),
            tn("disabled", i.invalid()),
            Kt(4),
            zc(32, i.items.length > 0 ? 32 : 33));
      },
      dependencies: [ad, Hr, ks, Ss, td, nd, Vs, Wr, Ls, qr, Zr],
      styles: [
        ".spread[_ngcontent-%COMP%]{display:flex;justify-content:space-between}",
      ],
    }));
  let e = t;
  return e;
})();
var hd = (() => {
  let t = class t {};
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵmod = ue({ type: t, bootstrap: [fd] })),
    (t.ɵinj = ae({ providers: [Yr], imports: [Ol, dd, Il] }));
  let e = t;
  return e;
})();
Nl()
  .bootstrapModule(hd)
  .catch((e) => console.error(e));

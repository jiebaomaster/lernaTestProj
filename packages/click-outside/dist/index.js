module.exports = function (e) {
  var n = {}

  function t(r) {
    if (n[r]) return n[r].exports
    var o = n[r] = {i: r, l: !1, exports: {}}
    return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports
  }

  return t.m = e, t.c = n, t.d = function (e, n, r) {
    t.o(e, n) || Object.defineProperty(e, n, {enumerable: !0, get: r})
  }, t.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
  }, t.t = function (e, n) {
    if (1 & n && (e = t(e)), 8 & n) return e
    if (4 & n && "object" == typeof e && e && e.__esModule) return e
    var r = Object.create(null)
    if (t.r(r), Object.defineProperty(r, "default", {
        enumerable: !0,
        value: e
      }), 2 & n && "string" != typeof e) for (var o in e) t.d(r, o, function (n) {
      return e[n]
    }.bind(null, o));
    return r
  }, t.n = function (e) {
    var n = e && e.__esModule ? function () {
      return e.default
    } : function () {
      return e
    }
    return t.d(n, "a", n), n
  }, t.o = function (e, n) {
    return Object.prototype.hasOwnProperty.call(e, n)
  }, t.p = "", t(t.s = 0)
}([function (e, n, t) {
  "use strict"
  t.r(n)
  var r, o = [], i = "@@clickoutsideContext", u = 0, c = document.addEventListener ? function (e, n, t) {
    e && n && t && e.addEventListener(n, t, !1)
  } : function (e, n, t) {
    e && n && t && e.attachEvent("on" + n, t)
  }

  function d(e, n, t) {
    return function () {
      var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
      t && t.context && r.target && o.target && !e.contains(r.target) && !e.contains(o.target) && e !== r.target && (n.expression && e[i].methodName && t.context[e[i].methodName] ? t.context[e[i].methodName]() : e[i].bindingFn && e[i].bindingFn())
    }
  }

  c(document, "mousedown", function (e) {
    return r = e
  }), c(document, "mouseup", function (e) {
    o.forEach(function (n) {
      return n[i].documentHandler(e, r)
    })
  })
  var a = {
    name: "clickoutside", bind: function (e, n, t) {
      o.push(e)
      var r = u++
      e[i] = {id: r, documentHandler: d(e, n, t), methodName: n.expression, bindingFn: n.value}
    }, update: function (e, n, t) {
      e[i].documentHandler = d(e, n, t), e[i].methodName = n.expression, e[i].bindingFn = n.value
    }, unbind: function (e) {
      for (var n = o.length, t = 0; t < n; t++) if (o[t][i].id === e[i].id) {
        o.splice(t, 1)
        break
      }
      delete e[i]
    }, install: function (e) {
      e.directive(a.name, a)
    }
  }
  n.default = a
}])
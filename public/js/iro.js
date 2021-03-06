!function () {
    "use strict";
    var t = function () {
        function t(t) {
            var e = t.r, i = t.g, r = t.b, a = Math.max(e, i, r), s = Math.min(e, i, r), h = a - s, o, n = 0 === a ? 0 : h / a, l = a / 255;
            switch (a) {
                case s:
                    o = 0;
                    break;
                case e:
                    o = i - r + h * (i < r ? 6 : 0), o /= 6 * h;
                    break;
                case i:
                    o = r - e + 2 * h, o /= 6 * h;
                    break;
                case r:
                    o = e - i + 4 * h, o /= 6 * h
            }
            return {h: ~~(360 * o), s: ~~(100 * n), v: ~~(100 * l)}
        }

        function e(t) {
            var e = t.s / 100, i = t.l / 100;
            return e *= i < .5 ? i : 1 - i, {h: t.h, s: ~~(2 * e / (i + e) * 100), v: ~~(100 * (i + e))}
        }

        function i(t) {
            t = t.replace(/#/g, "");
            var e = ~~("0x" + t);
            return 3 === t.length ? {r: 17 * (e >> 8), g: 17 * (e >> 4 & 15), b: 17 * (15 & e)} : {
                r: e >> 16,
                g: e >> 8 & 255,
                b: 255 & e
            }
        }

        function r(t) {
            return this instanceof r ? (this.value = {}, void(t && this.setFromString(t))) : new r(t)
        }

        return r.prototype.set = function (t) {
            this.value = t
        }, r.prototype.setFromString = function (r) {
            var a, s = r.match(/(^rgba?|^hsla?)(?=\(.*?\))|(^#)(?=[a-f0-9])/i);
            switch (s ? s[0] : null) {
                case"#":
                    a = t(i(r));
                    break;
                case"rgb":
                case"rgba":
                    var h = r.match(/(rgba?)\((\d+)(?:\D+?)(\d+)(?:\D+?)(\d+)(?:\D+?)?([0-9\.]+?)?\)/i);
                    a = t({r: parseInt(h[2]), g: parseInt(h[3]), b: parseInt(h[4])});
                    break;
                case"hsl":
                case"hsla":
                    var h = r.match(/(hsla?)\((\d+)(?:\D+?)(\d+)(?:\D+?)(\d+)(?:\D+?)?([0-9\.]+?)?\)/i);
                    a = e({h: parseInt(h[2]), s: parseInt(h[3]), l: parseInt(h[4])});
                    break;
                default:
                    console.warn("Error: '", r, "' could not be parsed as a CSS color")
            }
            a && this.set(a)
        }, r.prototype.getRgb = function () {
            var t = this.value, e, i, r, a, s, h, o, n, l = t.h / 360, c = t.s / 100, u = t.v / 100;
            switch (a = Math.floor(6 * l), s = 6 * l - a, h = u * (1 - c), o = u * (1 - s * c), n = u * (1 - (1 - s) * c), a % 6) {
                case 0:
                    e = u, i = n, r = h;
                    break;
                case 1:
                    e = o, i = u, r = h;
                    break;
                case 2:
                    e = h, i = u, r = n;
                    break;
                case 3:
                    e = h, i = o, r = u;
                    break;
                case 4:
                    e = n, i = h, r = u;
                    break;
                case 5:
                    e = u, i = h, r = o
            }
            return {r: ~~(255 * e), g: ~~(255 * i), b: ~~(255 * r)}
        }, r.prototype.getRgbString = function () {
            var t = this.getRgb();
            return [t.a ? "rgba" : "rgb", "(", t.r, ", ", t.g, ", ", t.b, t.a ? ", " + t.a : "", ")"].join("")
        }, r.prototype.getHexString = function (t) {
            var e = this.getRgb(), i, r;
            return t && e.r % 17 === 0 && e.g % 17 === 0 && e.b % 17 === 0 ? (i = e.r / 17 << 8 | e.g / 17 << 4 | e.b / 17, r = 4) : (i = e.r << 16 | e.g << 8 | e.b, r = 7), "#" + function (t) {
                return new Array(r - t.length).join("0") + t
            }(i.toString(16).toUpperCase())
        }, r.prototype.getHsl = function () {
            var t = this.value.s / 100, e = this.value.v / 100, i = (2 - t) * e;
            return t = 0 == t ? 0 : t * e / (i < 1 ? i : 2 - i), {h: this.value.h, s: ~~(100 * t), l: ~~(50 * i)}
        }, r.prototype.getHslString = function () {
            var t = this.getHsl();
            return [t.a ? "hsla" : "hsl", "(", t.h, ", ", t.s, "%, ", t.l, "%", t.a ? ", " + t.a : "", ")"].join("")
        }, r
    }(), e = function () {
        function e(i) {
            return this instanceof e ? (this._watchCallback, this._oldValue = {
                h: void 0,
                s: void 0,
                v: void 0
            }, void t.call(this, i)) : new e(i)
        }

        return e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.prototype.watch = function (t) {
            this._watchCallback = t
        }, e.prototype.unwatch = function () {
            this._watchCallback = void 0
        }, e.prototype.set = function (t) {
            var e = {};
            for (var i in this._oldValue)t.hasOwnProperty(i) || (t[i] = this._oldValue[i]), e[i] = !(t[i] == this._oldValue[i]);
            this.value = t, (e.h || e.s || e.v) && "function" == typeof this._watchCallback && this._watchCallback(this.value, this._oldValue, e), this._oldValue = t
        }, e
    }(), i = function () {
        var t = {}, e;
        return {
            getSheet: function () {
                var t = !1;
                return function () {
                    if (!t) {
                        var i = document.createElement("style");
                        i.appendChild(document.createTextNode("")), i.title = "iroStyleSheet", document.head.appendChild(i), t = i.sheet, e = void 0 != t.insertRule
                    }
                    return t
                }
            }(), setRule: function (i, r, a) {
                var s = this.getSheet(), h = s.rules || s.cssRules;
                if (r = r.replace(/([A-Z])/g, function (t) {
                        return "-" + t.toLowerCase()
                    }), t.hasOwnProperty(i))h[t[i]].style.setProperty(r, a); else {
                    var o = h.length;
                    e ? s.insertRule([i, " {", r, ": ", a, ";}"].join(""), o) : s.addRule(i, [r, ": ", a].join(""), o), t[i] = o
                }
            }
        }
    }(), r = function () {
        function t(t) {
            h && h._inputMove(t)
        }

        function r(t) {
            h && (t.preventDefault(), h._target = void 0, h = void 0)
        }

        function a(t, e, i) {
            var r = document.createElement("canvas");
            return r.width = t, r.height = e, i && (r.style.position = "absolute", r.style.top = "0", r.style.left = "0"), r
        }

        function s(t, i) {
            return this instanceof s ? (this.el = "string" == typeof t ? document.querySelector(t) : t, this.width = i.width || parseInt(this.el.getAttribute("width")) || 320, this.height = i.height || parseInt(this.el.getAttribute("height")) || 320, this.el.style.position = "relative", this.main = this.el.appendChild(a(this.width, this.height, !1)), this.mainCtx = this.main.getContext("2d"), this.overlay = this.el.appendChild(a(this.width, this.height, !0)), this.overlayCtx = this.overlay.getContext("2d"), this._layout = this._solveLayout(i), this._drawSlider(), this.css = i.css || void 0, this._watchCallback = i.watchCallback || void 0, this._overlayMarkers = {}, this._target, this.el.addEventListener("touchstart", this._inputStart.bind(this), !1), this.el.addEventListener("mousedown", this._inputStart.bind(this), !1), this.color = e(), this.color.watch(this._update.bind(this)), this.color.watch = this.color.unwatch = void 0, void this.color.setFromString(i.color || "#fff")) : new s(t, i)
        }

        var h;
        return document.body.addEventListener("touchmove", t, !1), document.body.addEventListener("touchend", r, !1), document.body.addEventListener("mousemove", t, !1), document.body.addEventListener("mouseup", r, !1), s.prototype._solveLayout = function (t) {
            var e = t.padding + 2 || 6, i = t.sliderMargin || 24, r = t.markerRadius || 8, a = t.sliderHeight || 2 * r + 2 * e, s = Math.min(this.height - a - i, this.width), h = (this.width - s) / 2;
            return {
                Mr: r,
                Rd: s,
                Rr: s / 2,
                Re: s / 2 - (r + e),
                Rcx: h + s / 2,
                Rcy: s / 2,
                Rx1: h,
                Rx2: h + s,
                Ry1: 0,
                Ry2: s,
                Sw: s,
                Sh: a,
                Sr: a / 2,
                Srw: s - a,
                Srs: h + a / 2,
                Sre: h + s - a / 2,
                Sx1: h,
                Sx2: h + s,
                Sy1: s + i,
                Sy2: s + a + i,
                isPointInSlider: function (t, e) {
                    return t > this.Sx1 && t < this.Sx2 && e > this.Sy1 && e < this.Sy2
                },
                isPointInRing: function (t, e) {
                    var i = Math.abs(t - this.Rcx), r = Math.abs(e - this.Rcy);
                    return Math.sqrt(i * i + r * r) < this.Rr
                }
            }
        }, s.prototype.resize = function (t) {
            t && t.width && t.height && (this.mainCtx.clearRect(0, 0, this.width, this.height), this.main.width = this.overlay.width = this.width = t.width, this.main.height = this.overlay.height = this.height = t.height, this._layout = this._solveLayout(t), this._drawSlider(), this._update(this.color.value, null, {
                h: !0,
                s: !0,
                v: !0
            }))
        }, s.prototype.watch = function (t) {
            this._watchCallback || "function" != typeof t || (this._watchCallback = t)
        }, s.prototype.unwatch = function () {
            this._watchCallback = void 0
        }, s.prototype._inputHandler = function (t, e) {
            var i = this._layout;
            if ("slider" == this._target)t = Math.max(Math.min(t, i.Sre), i.Srs) - i.Srs, this.color.set({v: ~~(100 / i.Srw * t)}); else if ("ring" == this._target) {
                var r = Math.atan2(t - i.Rcx, e - i.Rcy), a = 360 - ~~((r * (180 / Math.PI) + 270) % 360), s = Math.min(Math.sqrt((i.Rcx - t) * (i.Rcx - t) + (i.Rcy - e) * (i.Rcy - e)), i.Re);
                this.color.set({h: a, s: ~~(100 / i.Re * s)})
            }
        }, s.prototype._inputStart = function (t) {
            t.preventDefault(), t = t.touches ? t.changedTouches[0] : t;
            var e = this.main.getBoundingClientRect(), i = t.clientX - e.left, r = t.clientY - e.top;
            if (this._layout.isPointInSlider(i, r))this._target = "slider"; else {
                if (!this._layout.isPointInRing(i, r))return !1;
                this._target = "ring"
            }
            h = this, this._inputHandler(i, r)
        }, s.prototype._inputMove = function (t) {
            if (h) {
                //t.preventDefault(),
                t = t.touches ? t.changedTouches[0] : t;
                var e = this.main.getBoundingClientRect();
                this._inputHandler(t.clientX - e.left, t.clientY - e.top)
            }
        }, s.prototype._drawMarkerAtPos = function (t, e) {
            this.overlayCtx.lineWidth = 4, this.overlayCtx.beginPath(), this.overlayCtx.strokeStyle = "#333", this.overlayCtx.arc(t, e, this._layout.Mr, 0, 2 * Math.PI), this.overlayCtx.stroke(), this.overlayCtx.lineWidth = 2, this.overlayCtx.beginPath(), this.overlayCtx.strokeStyle = "#fff", this.overlayCtx.arc(t, e, this._layout.Mr, 0, 2 * Math.PI), this.overlayCtx.stroke()
        }, s.prototype._updateMarker = function (t, e, i) {
            this._overlayMarkers[t] = {
                x: e,
                y: i
            }, this.overlayCtx.clearRect(0, 0, this.width, this.height), this._overlayMarkers.ring && this._drawMarkerAtPos(this._overlayMarkers.ring.x, this._overlayMarkers.ring.y), this._overlayMarkers.slider && this._drawMarkerAtPos(this._overlayMarkers.slider.x, this._overlayMarkers.slider.y)
        }, s.prototype._drawWheel = function (t) {
            t = void 0 === t ? 100 : Math.min(Math.max(t, 0), 100);
            var e = this._layout;
            this.mainCtx.lineWidth = Math.round(1 + e.Rd / 100), this.mainCtx.clearRect(e.Rx1, e.Ry1, e.Rd, e.Rd);
            for (var i = 0; i < 360; i++) {
                var r = i * Math.PI / 180, a = Math.cos(r), s = Math.sin(r);
                this.mainCtx.beginPath(), this.mainCtx.strokeStyle = ["hsl(", i, ", 100%, ", t / 2, "%)"].join(""), this.mainCtx.moveTo(e.Rcx, e.Rcy), this.mainCtx.lineTo(e.Rcx + e.Rr * a, e.Rcy + e.Rr * s), this.mainCtx.stroke()
            }
            var h = this.mainCtx.createRadialGradient(e.Rcx, e.Rcy, 2, e.Rcx, e.Rcy, e.Re);
            h.addColorStop(0, "hsla(0, 0%, " + t + "%, 1)"), h.addColorStop(1, "hsla(0, 0%, " + t + "%, 0)"), this.mainCtx.fillStyle = h, this.mainCtx.fillRect(e.Rx1, e.Ry1, e.Rd, e.Rd)
        }, s.prototype._drawSlider = function () {
            var t = this._layout;
            this.mainCtx.clearRect(t.Sx1, t.Sy1, t.Sw, t.Sh), this.mainCtx.beginPath(), this.mainCtx.moveTo(t.Sx1 + t.Sr, t.Sy1), this.mainCtx.arcTo(t.Sx2, t.Sy1, t.Sx2, t.Sy2, t.Sr), this.mainCtx.arcTo(t.Sx2, t.Sy2, t.Sx1, t.Sy2, t.Sr), this.mainCtx.arcTo(t.Sx1, t.Sy2, t.Sx1, t.Sy1, t.Sr), this.mainCtx.arcTo(t.Sx1, t.Sy1, t.Sx2, t.Sy1, t.Sr), this.mainCtx.closePath();
            var e = this.mainCtx.createLinearGradient(t.Sx1, t.Sy1, t.Sx2, t.Sy1);
            e.addColorStop(0, "#000"), e.addColorStop(1, "#fff"), this.mainCtx.fillStyle = e, this.mainCtx.fill()
        }, s.prototype._update = function (t, e, r) {
            var a = this._layout;
            if ("function" == typeof this._watchCallback && this._watchCallback.call(this, this.color, r), r.v) {
                this._drawWheel(t.v);
                var s = t.v / 100 * a.Srw;
                this._updateMarker("slider", a.Srs + s, a.Sy1 + a.Sh / 2)
            }
            if (r.h || r.s) {
                var h = r.h ? t.h : e.h, o = r.s ? t.s : e.s, n = h * (Math.PI / 180), l = o / 100 * a.Re;
                this._updateMarker("ring", a.Rcx + l * Math.cos(n), a.Rcy + l * Math.sin(n))
            }
            if (this.css) {
                var c = this.color.getRgbString(), u = this.css;
                for (var d in u) {
                    var y = u[d];
                    for (var v in y)i.setRule(d, v, c)
                }
            }
        }, s
    }();
    window.iro = {styleSheetWriter: i, Color: t, ExtendedColor: e, ColorWheel: r}
}();
(window.MIP = window.MIP || []).push({
    name: "mip-toggle",
    func: function() {
        define("mip-toggle/mip-toggle", ["require", "customElement", "util"], function(t) {
                function e(t) {
                    if ("Infinity" === t) t = 1 / 0;
                    else if (t = parseInt(t, 10), isNaN(t)) t = 1 / 0;
                    return t
                }console.log(t("util"))
                var i = t("customElement").create(),
                    n = t("util").css;
                return i.prototype.build = function() {
                    var t = this.element;
                    if (this._hideTimeout = e(t.getAttribute("hidetimeout")), this._display = t.getAttribute("display") || "block", this._enterClass = t.getAttribute("enterclass"), "block" !== this._display) t.style.display = this._display;
                    var i = this;
                    this.addEventAction("toggle", function(t) {
                        i.toggle(), t && t.preventDefault && t.preventDefault()
                    }), this.addEventAction("show", function(t, e) {
                        i.show(e), t && t.preventDefault && t.preventDefault()
                    }), this.addEventAction("hide", function(t) {
                        i.hide(), t && t.preventDefault && t.preventDefault()
                    })
                }, i.prototype.detachedCallback = function() {
                    this._clearTimeout()
                }, i.prototype._clearTimeout = function() {
                    clearTimeout(this._timeoutId)
                }, i.prototype._setHideTimeout = function(t) {
                    if (t !== 1 / 0) {
                        this._clearTimeout();
                        var e = this;
                        this._timeoutId = setTimeout(function() {
                            e.hide()
                        }, t)
                    }
                }, i.prototype.show = function(t) {
                    if (void 0 === t || "" === t) t = this._hideTimeout;
                    else t = e(t);
                    if (this._enterClass) this.element.classList.add(this._enterClass);
                    else this.element.style.display = this._display;
                    this._setHideTimeout(t)
                }, i.prototype.hide = function() {
                    if (this._enterClass) this.element.classList.remove(this._enterClass);
                    else this.element.style.display = "none"
                }, i.prototype.toggle = function() {
                    if (this._isHidden()) this.show(1 / 0);
                    else this.hide()
                }, i.prototype._isHidden = function() {
                    if (this._enterClass) return !this.element.classList.contains(this._enterClass);
                    else return "none" === this.element.style.display || "none" === n(this.element, "style")
                }, i
            }), define("mip-toggle", ["mip-toggle/mip-toggle"], function(t) {
                return t
            }),
            function() {
                function t(t, e) {
                    t.registerMipElement("mip-toggle", e)
                }
                if (window.MIP) require(["mip-toggle"], function(e) {
                    t(window.MIP, e)
                });
                else require(["mip", "mip-toggle"], t)
            }()
    }
});

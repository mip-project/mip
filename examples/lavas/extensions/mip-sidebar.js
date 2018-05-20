(window.MIP = window.MIP || []).push({
    name: "mip-sidebar",
    func: function() {
        define("mip-sidebar/mip-sidebar", ["require", "customElement", "util"],
        function(e) {
            function t(e) {
                a.call(this) ? n.call(this, e) : i.call(this)
            }
            function i() {
                var e = this;
                if (!a.call(this)) if (l.css(e.element, {
                    display: "block"
                }), o.call(e), !e.runing) {
                    e.runing = !0,
                    e.bodyOverflow = getComputedStyle(document.body).overflow,
                    document.body.style.overflow = "hidden";
                    var t = setTimeout(function() {
                        e.element.setAttribute("open", ""),
                        e.element.setAttribute("aria-hidden", "false"),
                        clearTimeout(t)
                    },
                    e.ANIMATION_TIMEOUT)
                }
            }
            function n(e) {
                var t = this;
                if (e.preventDefault(), t.element.removeAttribute("open"), t.element.setAttribute("aria-hidden", "true"), r.call(t), !t.runing) {
                    t.runing = !0,
                    document.body.style.overflow = t.bodyOverflow;
                    var i = setTimeout(function() {
                        l.css(t.element, {
                            display: "none"
                        }),
                        clearTimeout(i)
                    },
                    t.ANIMATION_TIMEOUT)
                }
            }
            function o() {
                var e = this;
                if (!e.maskElement) {
                    var t = document.createElement("div");
                    t.id = "MIP-" + e.id.toUpperCase() + "-MASK",
                    t.className = "MIP-SIDEBAR-MASK",
                    t.setAttribute("data-side", e.side),
                    e.element.parentNode.appendChild(t),
                    t.addEventListener("touchmove",
                    function(e) {
                        e.preventDefault()
                    },
                    !1),
                    e.maskElement = t
                }
                e.maskElement.setAttribute("on", "tap:" + e.id + ".close"),
                e.maskElement.style.display = "block",
                e.maskElement.offsetWidth,
                e.maskElement.setAttribute("open", ""),
                setTimeout(function() {
                    e.runing = !1
                },
                500)
            }
            function r() {
                var e = this;
                if (e.maskElement) e.maskElement.removeAttribute("open"),
                setTimeout(function() {
                    e.maskElement.style.display = "none",
                    e.runing = !1
                },
                500)
            }
            function a() {
                return this.element.hasAttribute("open")
            }
            function s() {
                var e = this;
                if (e.maskElement = !1, e.id = e.element.id, e.side = e.element.getAttribute("side"), e.ANIMATION_TIMEOUT = 100, "left" !== e.side && "right" !== e.side) e.side = "left",
                e.element.setAttribute("side", e.side);
                if (a.call(e)) i.call(e);
                else e.element.setAttribute("aria-hidden", "true");
                document.addEventListener("keydown",
                function(t) {
                    if (27 === t.keyCode) n.call(e, t)
                },
                !1),
                e.addEventAction("toggle",
                function(i) {
                    t.call(e, i)
                }),
                e.addEventAction("open",
                function() {
                    i.call(e)
                }),
                e.addEventAction("close",
                function(t) {
                    n.call(e, t)
                })
            }
            var c = e("customElement").create(),
            l = e("util");
            return c.prototype.build = s,
            c.prototype.prerenderAllowed = function() {
                return ! 0
            },
            c
        }),
        define("mip-sidebar", ["mip-sidebar/mip-sidebar"],
        function(e) {
            return e
        }),
        function() {
            function e(e, t) {
                e.registerMipElement("mip-sidebar", t, "mip-sidebar{position:fixed !important;top:0;max-height:100% !important;height:100%;max-width:80% !important;background-color:#efefef;min-width:45px !important;overflow-x:hidden !important;overflow-y:auto !important;z-index:9999 !important;-webkit-overflow-scrolling:touch;will-change:transform;display:none}mip-sidebar[side=left]{left:0 !important;-webkit-transform:translateX(-100%) !important;transform:translateX(-100%) !important}mip-sidebar[side=right]{right:0 !important;-webkit-transform:translateX(100%) !important;transform:translateX(100%) !important}mip-sidebar[side]{-webkit-transition:-webkit-transform 233ms cubic-bezier(0, 0, .21, 1);transition:-webkit-transform 233ms cubic-bezier(0, 0, .21, 1);transition:transform 233ms cubic-bezier(0, 0, .21, 1);transition:transform 233ms cubic-bezier(0, 0, .21, 1),-webkit-transform 233ms cubic-bezier(0, 0, .21, 1)}mip-sidebar[side][open]{-webkit-transform:translateX(0) !important;transform:translateX(0) !important}.MIP-SIDEBAR-MASK{position:fixed !important;top:0 !important;left:0 !important;width:100% !important;height:100% !important;background-image:none !important;background-color:rgba(0,0,0,0);z-index:9998 !important;-webkit-transition:background-color .5s .05s;transition:background-color .5s .05s;display:none}.MIP-SIDEBAR-MASK[open]{background-color:rgba(0,0,0,0.2)}")
            }
            if (window.MIP) require(["mip-sidebar"],
            function(t) {
                e(window.MIP, t)
            });
            else require(["mip", "mip-sidebar"], e)
        } ()
    }
});

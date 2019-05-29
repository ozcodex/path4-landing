/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
! function (a, b, c, d) {
	function e(b, c) {
		this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
			time: null,
			target: null,
			pointer: null,
			stage: {
				start: null,
				current: null
			},
			direction: null
		}, this._states = {
			current: {},
			tags: {
				initializing: ["busy"],
				animating: ["busy"],
				dragging: ["interacting"]
			}
		}, a.each(["onResize", "onThrottledResize"], a.proxy(function (b, c) {
			this._handlers[c] = a.proxy(this[c], this)
		}, this)), a.each(e.Plugins, a.proxy(function (a, b) {
			this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this)
		}, this)), a.each(e.Workers, a.proxy(function (b, c) {
			this._pipe.push({
				filter: c.filter,
				run: a.proxy(c.run, this)
			})
		}, this)), this.setup(), this.initialize()
	}
	e.Defaults = {
		items: 3,
		loop: !1,
		center: !1,
		rewind: !1,
		checkVisibility: !0,
		mouseDrag: !0,
		touchDrag: !0,
		pullDrag: !0,
		freeDrag: !1,
		margin: 0,
		stagePadding: 0,
		merge: !1,
		mergeFit: !0,
		autoWidth: !1,
		startPosition: 0,
		rtl: !1,
		smartSpeed: 250,
		fluidSpeed: !1,
		dragEndSpeed: !1,
		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: b,
		fallbackEasing: "swing",
		slideTransition: "",
		info: !1,
		nestedItemSelector: !1,
		itemElement: "div",
		stageElement: "div",
		refreshClass: "owl-refresh",
		loadedClass: "owl-loaded",
		loadingClass: "owl-loading",
		rtlClass: "owl-rtl",
		responsiveClass: "owl-responsive",
		dragClass: "owl-drag",
		itemClass: "owl-item",
		stageClass: "owl-stage",
		stageOuterClass: "owl-stage-outer",
		grabClass: "owl-grab"
	}, e.Width = {
		Default: "default",
		Inner: "inner",
		Outer: "outer"
	}, e.Type = {
		Event: "event",
		State: "state"
	}, e.Plugins = {}, e.Workers = [{
		filter: ["width", "settings"],
		run: function () {
			this._width = this.$element.width()
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function (a) {
			a.current = this._items && this._items[this.relative(this._current)]
		}
	}, {
		filter: ["items", "settings"],
		run: function () {
			this.$stage.children(".cloned").remove()
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function (a) {
			var b = this.settings.margin || "",
				c = !this.settings.autoWidth,
				d = this.settings.rtl,
				e = {
					width: "auto",
					"margin-left": d ? b : "",
					"margin-right": d ? "" : b
				};
			!c && this.$stage.children().css(e), a.css = e
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function (a) {
			var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
				c = null,
				d = this._items.length,
				e = !this.settings.autoWidth,
				f = [];
			for (a.items = {
					merge: !1,
					width: b
				}; d--;) c = this._mergers[d], c = this.settings.mergeFit && Math.min(c, this.settings.items) || c, a.items.merge = c > 1 || a.items.merge, f[d] = e ? b * c : this._items[d].width();
			this._widths = f
		}
	}, {
		filter: ["items", "settings"],
		run: function () {
			var b = [],
				c = this._items,
				d = this.settings,
				e = Math.max(2 * d.items, 4),
				f = 2 * Math.ceil(c.length / 2),
				g = d.loop && c.length ? d.rewind ? e : Math.max(e, f) : 0,
				h = "",
				i = "";
			for (g /= 2; g > 0;) b.push(this.normalize(b.length / 2, !0)), h += c[b[b.length - 1]][0].outerHTML, b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)), i = c[b[b.length - 1]][0].outerHTML + i, g -= 1;
			this._clones = b, a(h).addClass("cloned").appendTo(this.$stage), a(i).addClass("cloned").prependTo(this.$stage)
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function () {
			for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, c = -1, d = 0, e = 0, f = []; ++c < b;) d = f[c - 1] || 0, e = this._widths[this.relative(c)] + this.settings.margin, f.push(d + e * a);
			this._coordinates = f
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function () {
			var a = this.settings.stagePadding,
				b = this._coordinates,
				c = {
					width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
					"padding-left": a || "",
					"padding-right": a || ""
				};
			this.$stage.css(c)
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function (a) {
			var b = this._coordinates.length,
				c = !this.settings.autoWidth,
				d = this.$stage.children();
			if (c && a.items.merge)
				for (; b--;) a.css.width = this._widths[this.relative(b)], d.eq(b).css(a.css);
			else c && (a.css.width = a.items.width, d.css(a.css))
		}
	}, {
		filter: ["items"],
		run: function () {
			this._coordinates.length < 1 && this.$stage.removeAttr("style")
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function (a) {
			a.current = a.current ? this.$stage.children().index(a.current) : 0, a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current)), this.reset(a.current)
		}
	}, {
		filter: ["position"],
		run: function () {
			this.animate(this.coordinates(this._current))
		}
	}, {
		filter: ["width", "position", "items", "settings"],
		run: function () {
			var a, b, c, d, e = this.settings.rtl ? 1 : -1,
				f = 2 * this.settings.stagePadding,
				g = this.coordinates(this.current()) + f,
				h = g + this.width() * e,
				i = [];
			for (c = 0, d = this._coordinates.length; c < d; c++) a = this._coordinates[c - 1] || 0, b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
			this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center")
		}
	}], e.prototype.initializeStage = function () {
		this.$stage = this.$element.find("." + this.settings.stageClass), this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = a("<" + this.settings.stageElement + ">", {
			class: this.settings.stageClass
		}).wrap(a("<div/>", {
			class: this.settings.stageOuterClass
		})), this.$element.append(this.$stage.parent()))
	}, e.prototype.initializeItems = function () {
		var b = this.$element.find(".owl-item");
		if (b.length) return this._items = b.get().map(function (b) {
			return a(b)
		}), this._mergers = this._items.map(function () {
			return 1
		}), void this.refresh();
		this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)
	}, e.prototype.initialize = function () {
		if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
			var a, b, c;
			a = this.$element.find("img"), b = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, c = this.$element.children(b).width(), a.length && c <= 0 && this.preloadAutoWidthImages(a)
		}
		this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
	}, e.prototype.isVisible = function () {
		return !this.settings.checkVisibility || this.$element.is(":visible")
	}, e.prototype.setup = function () {
		var b = this.viewport(),
			c = this.options.responsive,
			d = -1,
			e = null;
		c ? (a.each(c, function (a) {
			a <= b && a > d && (d = Number(a))
		}), e = a.extend({}, this.options, c[d]), "function" == typeof e.stagePadding && (e.stagePadding = e.stagePadding()), delete e.responsive, e.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d))) : e = a.extend({}, this.options), this.trigger("change", {
			property: {
				name: "settings",
				value: e
			}
		}), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", {
			property: {
				name: "settings",
				value: this.settings
			}
		})
	}, e.prototype.optionsLogic = function () {
		this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
	}, e.prototype.prepare = function (b) {
		var c = this.trigger("prepare", {
			content: b
		});
		return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(b)), this.trigger("prepared", {
			content: c.data
		}), c.data
	}, e.prototype.update = function () {
		for (var b = 0, c = this._pipe.length, d = a.proxy(function (a) {
				return this[a]
			}, this._invalidated), e = {}; b < c;)(this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
		this._invalidated = {}, !this.is("valid") && this.enter("valid")
	}, e.prototype.width = function (a) {
		switch (a = a || e.Width.Default) {
			case e.Width.Inner:
			case e.Width.Outer:
				return this._width;
			default:
				return this._width - 2 * this.settings.stagePadding + this.settings.margin
		}
	}, e.prototype.refresh = function () {
		this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
	}, e.prototype.onThrottledResize = function () {
		b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
	}, e.prototype.onResize = function () {
		return !!this._items.length && (this._width !== this.$element.width() && (!!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))))
	}, e.prototype.registerEventHandlers = function () {
		a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this)), !1 !== this.settings.responsive && this.on(b, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
			return !1
		})), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this)))
	}, e.prototype.onDragStart = function (b) {
		var d = null;
		3 !== b.which && (a.support.transform ? (d = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), d = {
			x: d[16 === d.length ? 12 : 4],
			y: d[16 === d.length ? 13 : 5]
		}) : (d = this.$stage.position(), d = {
			x: this.settings.rtl ? d.left + this.$stage.width() - this.width() + this.settings.margin : d.left,
			y: d.top
		}), this.is("animating") && (a.support.transform ? this.animate(d.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === b.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = a(b.target), this._drag.stage.start = d, this._drag.stage.current = d, this._drag.pointer = this.pointer(b), a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)), a(c).one("mousemove.owl.core touchmove.owl.core", a.proxy(function (b) {
			var d = this.difference(this._drag.pointer, this.pointer(b));
			a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this)), Math.abs(d.x) < Math.abs(d.y) && this.is("valid") || (b.preventDefault(), this.enter("dragging"), this.trigger("drag"))
		}, this)))
	}, e.prototype.onDragMove = function (a) {
		var b = null,
			c = null,
			d = null,
			e = this.difference(this._drag.pointer, this.pointer(a)),
			f = this.difference(this._drag.stage.start, e);
		this.is("dragging") && (a.preventDefault(), this.settings.loop ? (b = this.coordinates(this.minimum()), c = this.coordinates(this.maximum() + 1) - b, f.x = ((f.x - b) % c + c) % c + b) : (b = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), c = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), d = this.settings.pullDrag ? -1 * e.x / 5 : 0, f.x = Math.max(Math.min(f.x, b + d), c + d)), this._drag.stage.current = f, this.animate(f.x))
	}, e.prototype.onDragEnd = function (b) {
		var d = this.difference(this._drag.pointer, this.pointer(b)),
			e = this._drag.stage.current,
			f = d.x > 0 ^ this.settings.rtl ? "left" : "right";
		a(c).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== d.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = f, (Math.abs(d.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function () {
			return !1
		})), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
	}, e.prototype.closest = function (b, c) {
		var e = -1,
			f = 30,
			g = this.width(),
			h = this.coordinates();
		return this.settings.freeDrag || a.each(h, a.proxy(function (a, i) {
			return "left" === c && b > i - f && b < i + f ? e = a : "right" === c && b > i - g - f && b < i - g + f ? e = a + 1 : this.op(b, "<", i) && this.op(b, ">", h[a + 1] !== d ? h[a + 1] : i - g) && (e = "left" === c ? a + 1 : a), -1 === e
		}, this)), this.settings.loop || (this.op(b, ">", h[this.minimum()]) ? e = b = this.minimum() : this.op(b, "<", h[this.maximum()]) && (e = b = this.maximum())), e
	}, e.prototype.animate = function (b) {
		var c = this.speed() > 0;
		this.is("animating") && this.onTransitionEnd(), c && (this.enter("animating"), this.trigger("translate")), a.support.transform3d && a.support.transition ? this.$stage.css({
			transform: "translate3d(" + b + "px,0px,0px)",
			transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "")
		}) : c ? this.$stage.animate({
			left: b + "px"
		}, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this)) : this.$stage.css({
			left: b + "px"
		})
	}, e.prototype.is = function (a) {
		return this._states.current[a] && this._states.current[a] > 0
	}, e.prototype.current = function (a) {
		if (a === d) return this._current;
		if (0 === this._items.length) return d;
		if (a = this.normalize(a), this._current !== a) {
			var b = this.trigger("change", {
				property: {
					name: "position",
					value: a
				}
			});
			b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", {
				property: {
					name: "position",
					value: this._current
				}
			})
		}
		return this._current
	}, e.prototype.invalidate = function (b) {
		return "string" === a.type(b) && (this._invalidated[b] = !0, this.is("valid") && this.leave("valid")), a.map(this._invalidated, function (a, b) {
			return b
		})
	}, e.prototype.reset = function (a) {
		(a = this.normalize(a)) !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]))
	}, e.prototype.normalize = function (a, b) {
		var c = this._items.length,
			e = b ? 0 : this._clones.length;
		return !this.isNumeric(a) || c < 1 ? a = d : (a < 0 || a >= c + e) && (a = ((a - e / 2) % c + c) % c + e / 2), a
	}, e.prototype.relative = function (a) {
		return a -= this._clones.length / 2, this.normalize(a, !0)
	}, e.prototype.maximum = function (a) {
		var b, c, d, e = this.settings,
			f = this._coordinates.length;
		if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
		else if (e.autoWidth || e.merge) {
			if (b = this._items.length)
				for (c = this._items[--b].width(), d = this.$element.width(); b-- && !((c += this._items[b].width() + this.settings.margin) > d););
			f = b + 1
		} else f = e.center ? this._items.length - 1 : this._items.length - e.items;
		return a && (f -= this._clones.length / 2), Math.max(f, 0)
	}, e.prototype.minimum = function (a) {
		return a ? 0 : this._clones.length / 2
	}, e.prototype.items = function (a) {
		return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a])
	}, e.prototype.mergers = function (a) {
		return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a])
	}, e.prototype.clones = function (b) {
		var c = this._clones.length / 2,
			e = c + this._items.length,
			f = function (a) {
				return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2
			};
		return b === d ? a.map(this._clones, function (a, b) {
			return f(b)
		}) : a.map(this._clones, function (a, c) {
			return a === b ? f(c) : null
		})
	}, e.prototype.speed = function (a) {
		return a !== d && (this._speed = a), this._speed
	}, e.prototype.coordinates = function (b) {
		var c, e = 1,
			f = b - 1;
		return b === d ? a.map(this._coordinates, a.proxy(function (a, b) {
			return this.coordinates(b)
		}, this)) : (this.settings.center ? (this.settings.rtl && (e = -1, f = b + 1), c = this._coordinates[b], c += (this.width() - c + (this._coordinates[f] || 0)) / 2 * e) : c = this._coordinates[f] || 0, c = Math.ceil(c))
	}, e.prototype.duration = function (a, b, c) {
		return 0 === c ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed)
	}, e.prototype.to = function (a, b) {
		var c = this.current(),
			d = null,
			e = a - this.relative(c),
			f = (e > 0) - (e < 0),
			g = this._items.length,
			h = this.minimum(),
			i = this.maximum();
		this.settings.loop ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g), a = c + e, (d = ((a - h) % g + g) % g + h) !== a && d - e <= i && d - e > 0 && (c = d - e, a = d, this.reset(c))) : this.settings.rewind ? (i += 1, a = (a % i + i) % i) : a = Math.max(h, Math.min(i, a)), this.speed(this.duration(c, a, b)), this.current(a), this.isVisible() && this.update()
	}, e.prototype.next = function (a) {
		a = a || !1, this.to(this.relative(this.current()) + 1, a)
	}, e.prototype.prev = function (a) {
		a = a || !1, this.to(this.relative(this.current()) - 1, a)
	}, e.prototype.onTransitionEnd = function (a) {
		if (a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))) return !1;
		this.leave("animating"), this.trigger("translated")
	}, e.prototype.viewport = function () {
		var d;
		return this.options.responsiveBaseElement !== b ? d = a(this.options.responsiveBaseElement).width() : b.innerWidth ? d = b.innerWidth : c.documentElement && c.documentElement.clientWidth ? d = c.documentElement.clientWidth : console.warn("Can not detect viewport width."), d
	}, e.prototype.replace = function (b) {
		this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function () {
			return 1 === this.nodeType
		}).each(a.proxy(function (a, b) {
			b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
		}, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
	}, e.prototype.add = function (b, c) {
		var e = this.relative(this._current);
		c = c === d ? this._items.length : this.normalize(c, !0), b = b instanceof jQuery ? b : a(b), this.trigger("add", {
			content: b,
			position: c
		}), b = this.prepare(b), 0 === this._items.length || c === this._items.length ? (0 === this._items.length && this.$stage.append(b), 0 !== this._items.length && this._items[c - 1].after(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[c].before(b), this._items.splice(c, 0, b), this._mergers.splice(c, 0, 1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[e] && this.reset(this._items[e].index()), this.invalidate("items"), this.trigger("added", {
			content: b,
			position: c
		})
	}, e.prototype.remove = function (a) {
		(a = this.normalize(a, !0)) !== d && (this.trigger("remove", {
			content: this._items[a],
			position: a
		}), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", {
			content: null,
			position: a
		}))
	}, e.prototype.preloadAutoWidthImages = function (b) {
		b.each(a.proxy(function (b, c) {
			this.enter("pre-loading"), c = a(c), a(new Image).one("load", a.proxy(function (a) {
				c.attr("src", a.target.src), c.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
			}, this)).attr("src", c.attr("src") || c.attr("data-src") || c.attr("data-src-retina"))
		}, this))
	}, e.prototype.destroy = function () {
		this.$element.off(".owl.core"), this.$stage.off(".owl.core"), a(c).off(".owl.core"), !1 !== this.settings.responsive && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize));
		for (var d in this._plugins) this._plugins[d].destroy();
		this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
	}, e.prototype.op = function (a, b, c) {
		var d = this.settings.rtl;
		switch (b) {
			case "<":
				return d ? a > c : a < c;
			case ">":
				return d ? a < c : a > c;
			case ">=":
				return d ? a <= c : a >= c;
			case "<=":
				return d ? a >= c : a <= c
		}
	}, e.prototype.on = function (a, b, c, d) {
		a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c)
	}, e.prototype.off = function (a, b, c, d) {
		a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c)
	}, e.prototype.trigger = function (b, c, d, f, g) {
		var h = {
				item: {
					count: this._items.length,
					index: this.current()
				}
			},
			i = a.camelCase(a.grep(["on", b, d], function (a) {
				return a
			}).join("-").toLowerCase()),
			j = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({
				relatedTarget: this
			}, h, c));
		return this._supress[b] || (a.each(this._plugins, function (a, b) {
			b.onTrigger && b.onTrigger(j)
		}), this.register({
			type: e.Type.Event,
			name: b
		}), this.$element.trigger(j), this.settings && "function" == typeof this.settings[i] && this.settings[i].call(this, j)), j
	}, e.prototype.enter = function (b) {
		a.each([b].concat(this._states.tags[b] || []), a.proxy(function (a, b) {
			this._states.current[b] === d && (this._states.current[b] = 0), this._states.current[b]++
		}, this))
	}, e.prototype.leave = function (b) {
		a.each([b].concat(this._states.tags[b] || []), a.proxy(function (a, b) {
			this._states.current[b]--
		}, this))
	}, e.prototype.register = function (b) {
		if (b.type === e.Type.Event) {
			if (a.event.special[b.name] || (a.event.special[b.name] = {}), !a.event.special[b.name].owl) {
				var c = a.event.special[b.name]._default;
				a.event.special[b.name]._default = function (a) {
					return !c || !c.apply || a.namespace && -1 !== a.namespace.indexOf("owl") ? a.namespace && a.namespace.indexOf("owl") > -1 : c.apply(this, arguments)
				}, a.event.special[b.name].owl = !0
			}
		} else b.type === e.Type.State && (this._states.tags[b.name] ? this._states.tags[b.name] = this._states.tags[b.name].concat(b.tags) : this._states.tags[b.name] = b.tags, this._states.tags[b.name] = a.grep(this._states.tags[b.name], a.proxy(function (c, d) {
			return a.inArray(c, this._states.tags[b.name]) === d
		}, this)))
	}, e.prototype.suppress = function (b) {
		a.each(b, a.proxy(function (a, b) {
			this._supress[b] = !0
		}, this))
	}, e.prototype.release = function (b) {
		a.each(b, a.proxy(function (a, b) {
			delete this._supress[b]
		}, this))
	}, e.prototype.pointer = function (a) {
		var c = {
			x: null,
			y: null
		};
		return a = a.originalEvent || a || b.event, a = a.touches && a.touches.length ? a.touches[0] : a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : a, a.pageX ? (c.x = a.pageX, c.y = a.pageY) : (c.x = a.clientX, c.y = a.clientY), c
	}, e.prototype.isNumeric = function (a) {
		return !isNaN(parseFloat(a))
	}, e.prototype.difference = function (a, b) {
		return {
			x: a.x - b.x,
			y: a.y - b.y
		}
	}, a.fn.owlCarousel = function (b) {
		var c = Array.prototype.slice.call(arguments, 1);
		return this.each(function () {
			var d = a(this),
				f = d.data("owl.carousel");
			f || (f = new e(this, "object" == typeof b && b), d.data("owl.carousel", f), a.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (b, c) {
				f.register({
					type: e.Type.Event,
					name: c
				}), f.$element.on(c + ".owl.carousel.core", a.proxy(function (a) {
					a.namespace && a.relatedTarget !== this && (this.suppress([c]), f[c].apply(this, [].slice.call(arguments, 1)), this.release([c]))
				}, f))
			})), "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c)
		})
	}, a.fn.owlCarousel.Constructor = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	var e = function (b) {
		this._core = b, this._interval = null, this._visible = null, this._handlers = {
			"initialized.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.settings.autoRefresh && this.watch()
			}, this)
		}, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
	};
	e.Defaults = {
		autoRefresh: !0,
		autoRefreshInterval: 500
	}, e.prototype.watch = function () {
		this._interval || (this._visible = this._core.isVisible(), this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
	}, e.prototype.refresh = function () {
		this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
	}, e.prototype.destroy = function () {
		var a, c;
		b.clearInterval(this._interval);
		for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
		for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	var e = function (b) {
		this._core = b, this._loaded = [], this._handlers = {
			"initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (b) {
				if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type)) {
					var c = this._core.settings,
						e = c.center && Math.ceil(c.items / 2) || c.items,
						f = c.center && -1 * e || 0,
						g = (b.property && b.property.value !== d ? b.property.value : this._core.current()) + f,
						h = this._core.clones().length,
						i = a.proxy(function (a, b) {
							this.load(b)
						}, this);
					for (c.lazyLoadEager > 0 && (e += c.lazyLoadEager, c.loop && (g -= c.lazyLoadEager, e++)); f++ < e;) this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++
				}
			}, this)
		}, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
	};
	e.Defaults = {
		lazyLoad: !1,
		lazyLoadEager: 0
	}, e.prototype.load = function (c) {
		var d = this._core.$stage.children().eq(c),
			e = d && d.find(".owl-lazy");
		!e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function (c, d) {
			var e, f = a(d),
				g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src") || f.attr("data-srcset");
			this._core.trigger("load", {
				element: f,
				url: g
			}, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function () {
				f.css("opacity", 1), this._core.trigger("loaded", {
					element: f,
					url: g
				}, "lazy")
			}, this)).attr("src", g) : f.is("source") ? f.one("load.owl.lazy", a.proxy(function () {
				this._core.trigger("loaded", {
					element: f,
					url: g
				}, "lazy")
			}, this)).attr("srcset", g) : (e = new Image, e.onload = a.proxy(function () {
				f.css({
					"background-image": 'url("' + g + '")',
					opacity: "1"
				}), this._core.trigger("loaded", {
					element: f,
					url: g
				}, "lazy")
			}, this), e.src = g)
		}, this)), this._loaded.push(d.get(0)))
	}, e.prototype.destroy = function () {
		var a, b;
		for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.Lazy = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	var e = function (c) {
		this._core = c, this._previousHeight = null, this._handlers = {
			"initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.settings.autoHeight && this.update()
			}, this),
			"changed.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.settings.autoHeight && "position" === a.property.name && this.update()
			}, this),
			"loaded.owl.lazy": a.proxy(function (a) {
				a.namespace && this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
			}, this)
		}, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._intervalId = null;
		var d = this;
		a(b).on("load", function () {
			d._core.settings.autoHeight && d.update()
		}), a(b).resize(function () {
			d._core.settings.autoHeight && (null != d._intervalId && clearTimeout(d._intervalId), d._intervalId = setTimeout(function () {
				d.update()
			}, 250))
		})
	};
	e.Defaults = {
		autoHeight: !1,
		autoHeightClass: "owl-height"
	}, e.prototype.update = function () {
		var b = this._core._current,
			c = b + this._core.settings.items,
			d = this._core.settings.lazyLoad,
			e = this._core.$stage.children().toArray().slice(b, c),
			f = [],
			g = 0;
		a.each(e, function (b, c) {
			f.push(a(c).height())
		}), g = Math.max.apply(null, f), g <= 1 && d && this._previousHeight && (g = this._previousHeight), this._previousHeight = g, this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass)
	}, e.prototype.destroy = function () {
		var a, b;
		for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	var e = function (b) {
		this._core = b, this._videos = {}, this._playing = null, this._handlers = {
			"initialized.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.register({
					type: "state",
					name: "playing",
					tags: ["interacting"]
				})
			}, this),
			"resize.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.settings.video && this.isInFullScreen() && a.preventDefault()
			}, this),
			"refreshed.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
			}, this),
			"changed.owl.carousel": a.proxy(function (a) {
				a.namespace && "position" === a.property.name && this._playing && this.stop()
			}, this),
			"prepared.owl.carousel": a.proxy(function (b) {
				if (b.namespace) {
					var c = a(b.content).find(".owl-video");
					c.length && (c.css("display", "none"), this.fetch(c, a(b.content)))
				}
			}, this)
		}, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function (a) {
			this.play(a)
		}, this))
	};
	e.Defaults = {
		video: !1,
		videoHeight: !1,
		videoWidth: !1
	}, e.prototype.fetch = function (a, b) {
		var c = function () {
				return a.attr("data-vimeo-id") ? "vimeo" : a.attr("data-vzaar-id") ? "vzaar" : "youtube"
			}(),
			d = a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id"),
			e = a.attr("data-width") || this._core.settings.videoWidth,
			f = a.attr("data-height") || this._core.settings.videoHeight,
			g = a.attr("href");
		if (!g) throw new Error("Missing video URL.");
		if (d = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1) c = "youtube";
		else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
		else {
			if (!(d[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
			c = "vzaar"
		}
		d = d[6], this._videos[g] = {
			type: c,
			id: d,
			width: e,
			height: f
		}, b.attr("data-video", g), this.thumbnail(a, this._videos[g])
	}, e.prototype.thumbnail = function (b, c) {
		var d, e, f, g = c.width && c.height ? "width:" + c.width + "px;height:" + c.height + "px;" : "",
			h = b.find("img"),
			i = "src",
			j = "",
			k = this._core.settings,
			l = function (c) {
				e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? a("<div/>", {
					class: "owl-video-tn " + j,
					srcType: c
				}) : a("<div/>", {
					class: "owl-video-tn",
					style: "opacity:1;background-image:url(" + c + ")"
				}), b.after(d), b.after(e)
			};
		if (b.wrap(a("<div/>", {
				class: "owl-video-wrapper",
				style: g
			})), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length) return l(h.attr(i)), h.remove(), !1;
		"youtube" === c.type ? (f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type ? a.ajax({
			type: "GET",
			url: "//vimeo.com/api/v2/video/" + c.id + ".json",
			jsonp: "callback",
			dataType: "jsonp",
			success: function (a) {
				f = a[0].thumbnail_large, l(f)
			}
		}) : "vzaar" === c.type && a.ajax({
			type: "GET",
			url: "//vzaar.com/api/videos/" + c.id + ".json",
			jsonp: "callback",
			dataType: "jsonp",
			success: function (a) {
				f = a.framegrab_url, l(f)
			}
		})
	}, e.prototype.stop = function () {
		this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
	}, e.prototype.play = function (b) {
		var c, d = a(b.target),
			e = d.closest("." + this._core.settings.itemClass),
			f = this._videos[e.attr("data-video")],
			g = f.width || "100%",
			h = f.height || this._core.$stage.height();
		this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), e = this._core.items(this._core.relative(e.index())), this._core.reset(e.index()), c = a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'), c.attr("height", h), c.attr("width", g), "youtube" === f.type ? c.attr("src", "//www.youtube.com/embed/" + f.id + "?autoplay=1&rel=0&v=" + f.id) : "vimeo" === f.type ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1") : "vzaar" === f.type && c.attr("src", "//view.vzaar.com/" + f.id + "/player?autoplay=true"), a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")), this._playing = e.addClass("owl-video-playing"))
	}, e.prototype.isInFullScreen = function () {
		var b = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
		return b && a(b).parent().hasClass("owl-video-frame")
	}, e.prototype.destroy = function () {
		var a, b;
		this._core.$element.off("click.owl.video");
		for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.Video = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	var e = function (b) {
		this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = {
			"change.owl.carousel": a.proxy(function (a) {
				a.namespace && "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value)
			}, this),
			"drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function (a) {
				a.namespace && (this.swapping = "translated" == a.type)
			}, this),
			"translate.owl.carousel": a.proxy(function (a) {
				a.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
			}, this)
		}, this.core.$element.on(this.handlers)
	};
	e.Defaults = {
		animateOut: !1,
		animateIn: !1
	}, e.prototype.swap = function () {
		if (1 === this.core.settings.items && a.support.animation && a.support.transition) {
			this.core.speed(0);
			var b, c = a.proxy(this.clear, this),
				d = this.core.$stage.children().eq(this.previous),
				e = this.core.$stage.children().eq(this.next),
				f = this.core.settings.animateIn,
				g = this.core.settings.animateOut;
			this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.one(a.support.animation.end, c).css({
				left: b + "px"
			}).addClass("animated owl-animated-out").addClass(g)), f && e.one(a.support.animation.end, c).addClass("animated owl-animated-in").addClass(f))
		}
	}, e.prototype.clear = function (b) {
		a(b.target).css({
			left: ""
		}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
	}, e.prototype.destroy = function () {
		var a, b;
		for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.Animate = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	var e = function (b) {
		this._core = b, this._call = null, this._time = 0, this._timeout = 0, this._paused = !0, this._handlers = {
			"changed.owl.carousel": a.proxy(function (a) {
				a.namespace && "settings" === a.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a.namespace && "position" === a.property.name && this._paused && (this._time = 0)
			}, this),
			"initialized.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.settings.autoplay && this.play()
			}, this),
			"play.owl.autoplay": a.proxy(function (a, b, c) {
				a.namespace && this.play(b, c)
			}, this),
			"stop.owl.autoplay": a.proxy(function (a) {
				a.namespace && this.stop()
			}, this),
			"mouseover.owl.autoplay": a.proxy(function () {
				this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
			}, this),
			"mouseleave.owl.autoplay": a.proxy(function () {
				this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
			}, this),
			"touchstart.owl.core": a.proxy(function () {
				this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
			}, this),
			"touchend.owl.core": a.proxy(function () {
				this._core.settings.autoplayHoverPause && this.play()
			}, this)
		}, this._core.$element.on(this._handlers), this._core.options = a.extend({}, e.Defaults, this._core.options)
	};
	e.Defaults = {
		autoplay: !1,
		autoplayTimeout: 5e3,
		autoplayHoverPause: !1,
		autoplaySpeed: !1
	}, e.prototype._next = function (d) {
		this._call = b.setTimeout(a.proxy(this._next, this, d), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || c.hidden || this._core.next(d || this._core.settings.autoplaySpeed)
	}, e.prototype.read = function () {
		return (new Date).getTime() - this._time
	}, e.prototype.play = function (c, d) {
		var e;
		this._core.is("rotating") || this._core.enter("rotating"), c = c || this._core.settings.autoplayTimeout, e = Math.min(this._time % (this._timeout || c), c), this._paused ? (this._time = this.read(), this._paused = !1) : b.clearTimeout(this._call), this._time += this.read() % c - e, this._timeout = c, this._call = b.setTimeout(a.proxy(this._next, this, d), c - e)
	}, e.prototype.stop = function () {
		this._core.is("rotating") && (this._time = 0, this._paused = !0, b.clearTimeout(this._call), this._core.leave("rotating"))
	}, e.prototype.pause = function () {
		this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, b.clearTimeout(this._call))
	}, e.prototype.destroy = function () {
		var a, b;
		this.stop();
		for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.autoplay = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	"use strict";
	var e = function (b) {
		this._core = b, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		}, this._handlers = {
			"prepared.owl.carousel": a.proxy(function (b) {
				b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
			}, this),
			"added.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop())
			}, this),
			"remove.owl.carousel": a.proxy(function (a) {
				a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1)
			}, this),
			"changed.owl.carousel": a.proxy(function (a) {
				a.namespace && "position" == a.property.name && this.draw()
			}, this),
			"initialized.owl.carousel": a.proxy(function (a) {
				a.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
			}, this),
			"refreshed.owl.carousel": a.proxy(function (a) {
				a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
			}, this)
		}, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers)
	};
	e.Defaults = {
		nav: !1,
		navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'],
		navSpeed: !1,
		navElement: 'button type="button" role="presentation"',
		navContainer: !1,
		navContainerClass: "owl-nav",
		navClass: ["owl-prev", "owl-next"],
		slideBy: 1,
		dotClass: "owl-dot",
		dotsClass: "owl-dots",
		dots: !0,
		dotsEach: !1,
		dotsData: !1,
		dotsSpeed: !1,
		dotsContainer: !1
	}, e.prototype.initialize = function () {
		var b, c = this._core.settings;
		this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = a("<" + c.navElement + ">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click", a.proxy(function (a) {
			this.prev(c.navSpeed)
		}, this)), this._controls.$next = a("<" + c.navElement + ">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click", a.proxy(function (a) {
			this.next(c.navSpeed)
		}, this)), c.dotsData || (this._templates = [a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]), this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", a.proxy(function (b) {
			var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index();
			b.preventDefault(), this.to(d, c.dotsSpeed)
		}, this));
		for (b in this._overrides) this._core[b] = a.proxy(this[b], this)
	}, e.prototype.destroy = function () {
		var a, b, c, d, e;
		e = this._core.settings;
		for (a in this._handlers) this.$element.off(a, this._handlers[a]);
		for (b in this._controls) "$relative" === b && e.navContainer ? this._controls[b].html("") : this._controls[b].remove();
		for (d in this.overides) this._core[d] = this._overrides[d];
		for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
	}, e.prototype.update = function () {
		var a, b, c, d = this._core.clones().length / 2,
			e = d + this._core.items().length,
			f = this._core.maximum(!0),
			g = this._core.settings,
			h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
		if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy)
			for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
				if (b >= h || 0 === b) {
					if (this._pages.push({
							start: Math.min(f, a - d),
							end: a - d + h - 1
						}), Math.min(f, a - d) === f) break;
					b = 0, ++c
				}
				b += this._core.mergers(this._core.relative(a))
			}
	}, e.prototype.draw = function () {
		var b, c = this._core.settings,
			d = this._core.items().length <= c.items,
			e = this._core.relative(this._core.current()),
			f = c.loop || c.rewind;
		this._controls.$relative.toggleClass("disabled", !c.nav || d), c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !c.dots || d), c.dots && (b = this._pages.length - this._controls.$absolute.children().length, c.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : b > 0 ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[0])) : b < 0 && this._controls.$absolute.children().slice(b).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active"))
	}, e.prototype.onTrigger = function (b) {
		var c = this._core.settings;
		b.page = {
			index: a.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items)
		}
	}, e.prototype.current = function () {
		var b = this._core.relative(this._core.current());
		return a.grep(this._pages, a.proxy(function (a, c) {
			return a.start <= b && a.end >= b
		}, this)).pop()
	}, e.prototype.getPosition = function (b) {
		var c, d, e = this._core.settings;
		return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c
	}, e.prototype.next = function (b) {
		a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b)
	}, e.prototype.prev = function (b) {
		a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b)
	}, e.prototype.to = function (b, c, d) {
		var e;
		!d && this._pages.length ? (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c)) : a.proxy(this._overrides.to, this._core)(b, c)
	}, a.fn.owlCarousel.Constructor.Plugins.Navigation = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	"use strict";
	var e = function (c) {
		this._core = c, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
			"initialized.owl.carousel": a.proxy(function (c) {
				c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation")
			}, this),
			"prepared.owl.carousel": a.proxy(function (b) {
				if (b.namespace) {
					var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
					if (!c) return;
					this._hashes[c] = b.content
				}
			}, this),
			"changed.owl.carousel": a.proxy(function (c) {
				if (c.namespace && "position" === c.property.name) {
					var d = this._core.items(this._core.relative(this._core.current())),
						e = a.map(this._hashes, function (a, b) {
							return a === d ? b : null
						}).join();
					if (!e || b.location.hash.slice(1) === e) return;
					b.location.hash = e
				}
			}, this)
		}, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function (a) {
			var c = b.location.hash.substring(1),
				e = this._core.$stage.children(),
				f = this._hashes[c] && e.index(this._hashes[c]);
			f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), !1, !0)
		}, this))
	};
	e.Defaults = {
		URLhashListener: !1
	}, e.prototype.destroy = function () {
		var c, d;
		a(b).off("hashchange.owl.navigation");
		for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
		for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.Hash = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
	function e(b, c) {
		var e = !1,
			f = b.charAt(0).toUpperCase() + b.slice(1);
		return a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
			if (g[b] !== d) return e = !c || b, !1
		}), e
	}

	function f(a) {
		return e(a, !0)
	}
	var g = a("<support>").get(0).style,
		h = "Webkit Moz O ms".split(" "),
		i = {
			transition: {
				end: {
					WebkitTransition: "webkitTransitionEnd",
					MozTransition: "transitionend",
					OTransition: "oTransitionEnd",
					transition: "transitionend"
				}
			},
			animation: {
				end: {
					WebkitAnimation: "webkitAnimationEnd",
					MozAnimation: "animationend",
					OAnimation: "oAnimationEnd",
					animation: "animationend"
				}
			}
		},
		j = {
			csstransforms: function () {
				return !!e("transform")
			},
			csstransforms3d: function () {
				return !!e("perspective")
			},
			csstransitions: function () {
				return !!e("transition")
			},
			cssanimations: function () {
				return !!e("animation")
			}
		};
	j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[a.support.transition]), j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[a.support.animation]), j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d())
}(window.Zepto || window.jQuery, window, document);

/*!
 * Bootstrap v4.1.3 (https://getbootstrap.com/)
 * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
! function (e, t) {
	"object" == typeof exports && "undefined" != typeof module ? t(exports, require("jquery")) : "function" == typeof define && define.amd ? define(["exports", "jquery"], t) : t(e.bootstrap = {}, e.jQuery)
}(this, function (e, t) {
	"use strict";

	function i(e, t) {
		for (var n = 0; n < t.length; n++) {
			var i = t[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
		}
	}

	function s(e, t, n) {
		return t && i(e.prototype, t), n && i(e, n), e
	}

	function l(r) {
		for (var e = 1; e < arguments.length; e++) {
			var o = null != arguments[e] ? arguments[e] : {},
				t = Object.keys(o);
			"function" == typeof Object.getOwnPropertySymbols && (t = t.concat(Object.getOwnPropertySymbols(o).filter(function (e) {
				return Object.getOwnPropertyDescriptor(o, e).enumerable
			}))), t.forEach(function (e) {
				var t, n, i;
				t = r, i = o[n = e], n in t ? Object.defineProperty(t, n, {
					value: i,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : t[n] = i
			})
		}
		return r
	}
	for (var r, n, o, a, c, u, f, h, d, p, m, g, _, v, y, E, b, w, C, T, S, D, A, I, O, N, k, x, P, L, j, H, M, F, W, R, U, B, q, K, Q, Y, V, z, G, J, Z, X, $, ee, te, ne, ie, re, oe, se, ae, le, ce, ue, fe, he, de, pe, me, ge, _e, ve, ye, Ee, be, we = function (i) {
			var t = "transitionend";

			function e(e) {
				var t = this,
					n = !1;
				return i(this).one(l.TRANSITION_END, function () {
					n = !0
				}), setTimeout(function () {
					n || l.triggerTransitionEnd(t)
				}, e), this
			}
			var l = {
				TRANSITION_END: "bsTransitionEnd",
				getUID: function (e) {
					for (; e += ~~(1e6 * Math.random()), document.getElementById(e););
					return e
				},
				getSelectorFromElement: function (e) {
					var t = e.getAttribute("data-target");
					t && "#" !== t || (t = e.getAttribute("href") || "");
					try {
						return document.querySelector(t) ? t : null
					} catch (e) {
						return null
					}
				},
				getTransitionDurationFromElement: function (e) {
					if (!e) return 0;
					var t = i(e).css("transition-duration");
					return parseFloat(t) ? (t = t.split(",")[0], 1e3 * parseFloat(t)) : 0
				},
				reflow: function (e) {
					return e.offsetHeight
				},
				triggerTransitionEnd: function (e) {
					i(e).trigger(t)
				},
				supportsTransitionEnd: function () {
					return Boolean(t)
				},
				isElement: function (e) {
					return (e[0] || e).nodeType
				},
				typeCheckConfig: function (e, t, n) {
					for (var i in n)
						if (Object.prototype.hasOwnProperty.call(n, i)) {
							var r = n[i],
								o = t[i],
								s = o && l.isElement(o) ? "element" : (a = o, {}.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase());
							if (!new RegExp(r).test(s)) throw new Error(e.toUpperCase() + ': Option "' + i + '" provided type "' + s + '" but expected type "' + r + '".')
						} var a
				}
			};
			return i.fn.emulateTransitionEnd = e, i.event.special[l.TRANSITION_END] = {
				bindType: t,
				delegateType: t,
				handle: function (e) {
					if (i(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
				}
			}, l
		}(t = t && t.hasOwnProperty("default") ? t.default : t), Ce = (n = "alert", a = "." + (o = "bs.alert"), c = (r = t).fn[n], u = {
			CLOSE: "close" + a,
			CLOSED: "closed" + a,
			CLICK_DATA_API: "click" + a + ".data-api"
		}, f = "alert", h = "fade", d = "show", p = function () {
			function i(e) {
				this._element = e
			}
			var e = i.prototype;
			return e.close = function (e) {
				var t = this._element;
				e && (t = this._getRootElement(e)), this._triggerCloseEvent(t).isDefaultPrevented() || this._removeElement(t)
			}, e.dispose = function () {
				r.removeData(this._element, o), this._element = null
			}, e._getRootElement = function (e) {
				var t = we.getSelectorFromElement(e),
					n = !1;
				return t && (n = document.querySelector(t)), n || (n = r(e).closest("." + f)[0]), n
			}, e._triggerCloseEvent = function (e) {
				var t = r.Event(u.CLOSE);
				return r(e).trigger(t), t
			}, e._removeElement = function (t) {
				var n = this;
				if (r(t).removeClass(d), r(t).hasClass(h)) {
					var e = we.getTransitionDurationFromElement(t);
					r(t).one(we.TRANSITION_END, function (e) {
						return n._destroyElement(t, e)
					}).emulateTransitionEnd(e)
				} else this._destroyElement(t)
			}, e._destroyElement = function (e) {
				r(e).detach().trigger(u.CLOSED).remove()
			}, i._jQueryInterface = function (n) {
				return this.each(function () {
					var e = r(this),
						t = e.data(o);
					t || (t = new i(this), e.data(o, t)), "close" === n && t[n](this)
				})
			}, i._handleDismiss = function (t) {
				return function (e) {
					e && e.preventDefault(), t.close(this)
				}
			}, s(i, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}]), i
		}(), r(document).on(u.CLICK_DATA_API, '[data-dismiss="alert"]', p._handleDismiss(new p)), r.fn[n] = p._jQueryInterface, r.fn[n].Constructor = p, r.fn[n].noConflict = function () {
			return r.fn[n] = c, p._jQueryInterface
		}, p), Te = (g = "button", v = "." + (_ = "bs.button"), y = ".data-api", E = (m = t).fn[g], b = "active", w = "btn", T = '[data-toggle^="button"]', S = '[data-toggle="buttons"]', D = "input", A = ".active", I = ".btn", O = {
			CLICK_DATA_API: "click" + v + y,
			FOCUS_BLUR_DATA_API: (C = "focus") + v + y + " blur" + v + y
		}, N = function () {
			function n(e) {
				this._element = e
			}
			var e = n.prototype;
			return e.toggle = function () {
				var e = !0,
					t = !0,
					n = m(this._element).closest(S)[0];
				if (n) {
					var i = this._element.querySelector(D);
					if (i) {
						if ("radio" === i.type)
							if (i.checked && this._element.classList.contains(b)) e = !1;
							else {
								var r = n.querySelector(A);
								r && m(r).removeClass(b)
							} if (e) {
							if (i.hasAttribute("disabled") || n.hasAttribute("disabled") || i.classList.contains("disabled") || n.classList.contains("disabled")) return;
							i.checked = !this._element.classList.contains(b), m(i).trigger("change")
						}
						i.focus(), t = !1
					}
				}
				t && this._element.setAttribute("aria-pressed", !this._element.classList.contains(b)), e && m(this._element).toggleClass(b)
			}, e.dispose = function () {
				m.removeData(this._element, _), this._element = null
			}, n._jQueryInterface = function (t) {
				return this.each(function () {
					var e = m(this).data(_);
					e || (e = new n(this), m(this).data(_, e)), "toggle" === t && e[t]()
				})
			}, s(n, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}]), n
		}(), m(document).on(O.CLICK_DATA_API, T, function (e) {
			e.preventDefault();
			var t = e.target;
			m(t).hasClass(w) || (t = m(t).closest(I)), N._jQueryInterface.call(m(t), "toggle")
		}).on(O.FOCUS_BLUR_DATA_API, T, function (e) {
			var t = m(e.target).closest(I)[0];
			m(t).toggleClass(C, /^focus(in)?$/.test(e.type))
		}), m.fn[g] = N._jQueryInterface, m.fn[g].Constructor = N, m.fn[g].noConflict = function () {
			return m.fn[g] = E, N._jQueryInterface
		}, N), Se = (x = "carousel", L = "." + (P = "bs.carousel"), j = ".data-api", H = (k = t).fn[x], M = {
			interval: 5e3,
			keyboard: !0,
			slide: !1,
			pause: "hover",
			wrap: !0
		}, F = {
			interval: "(number|boolean)",
			keyboard: "boolean",
			slide: "(boolean|string)",
			pause: "(string|boolean)",
			wrap: "boolean"
		}, W = "next", R = "prev", U = "left", B = "right", q = {
			SLIDE: "slide" + L,
			SLID: "slid" + L,
			KEYDOWN: "keydown" + L,
			MOUSEENTER: "mouseenter" + L,
			MOUSELEAVE: "mouseleave" + L,
			TOUCHEND: "touchend" + L,
			LOAD_DATA_API: "load" + L + j,
			CLICK_DATA_API: "click" + L + j
		}, K = "carousel", Q = "active", Y = "slide", V = "carousel-item-right", z = "carousel-item-left", G = "carousel-item-next", J = "carousel-item-prev", Z = ".active", X = ".active.carousel-item", $ = ".carousel-item", ee = ".carousel-item-next, .carousel-item-prev", te = ".carousel-indicators", ne = "[data-slide], [data-slide-to]", ie = '[data-ride="carousel"]', re = function () {
			function o(e, t) {
				this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this._config = this._getConfig(t), this._element = k(e)[0], this._indicatorsElement = this._element.querySelector(te), this._addEventListeners()
			}
			var e = o.prototype;
			return e.next = function () {
				this._isSliding || this._slide(W)
			}, e.nextWhenVisible = function () {
				!document.hidden && k(this._element).is(":visible") && "hidden" !== k(this._element).css("visibility") && this.next()
			}, e.prev = function () {
				this._isSliding || this._slide(R)
			}, e.pause = function (e) {
				e || (this._isPaused = !0), this._element.querySelector(ee) && (we.triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
			}, e.cycle = function (e) {
				e || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
			}, e.to = function (e) {
				var t = this;
				this._activeElement = this._element.querySelector(X);
				var n = this._getItemIndex(this._activeElement);
				if (!(e > this._items.length - 1 || e < 0))
					if (this._isSliding) k(this._element).one(q.SLID, function () {
						return t.to(e)
					});
					else {
						if (n === e) return this.pause(), void this.cycle();
						var i = n < e ? W : R;
						this._slide(i, this._items[e])
					}
			}, e.dispose = function () {
				k(this._element).off(L), k.removeData(this._element, P), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null
			}, e._getConfig = function (e) {
				return e = l({}, M, e), we.typeCheckConfig(x, e, F), e
			}, e._addEventListeners = function () {
				var t = this;
				this._config.keyboard && k(this._element).on(q.KEYDOWN, function (e) {
					return t._keydown(e)
				}), "hover" === this._config.pause && (k(this._element).on(q.MOUSEENTER, function (e) {
					return t.pause(e)
				}).on(q.MOUSELEAVE, function (e) {
					return t.cycle(e)
				}), "ontouchstart" in document.documentElement && k(this._element).on(q.TOUCHEND, function () {
					t.pause(), t.touchTimeout && clearTimeout(t.touchTimeout), t.touchTimeout = setTimeout(function (e) {
						return t.cycle(e)
					}, 500 + t._config.interval)
				}))
			}, e._keydown = function (e) {
				if (!/input|textarea/i.test(e.target.tagName)) switch (e.which) {
					case 37:
						e.preventDefault(), this.prev();
						break;
					case 39:
						e.preventDefault(), this.next()
				}
			}, e._getItemIndex = function (e) {
				return this._items = e && e.parentNode ? [].slice.call(e.parentNode.querySelectorAll($)) : [], this._items.indexOf(e)
			}, e._getItemByDirection = function (e, t) {
				var n = e === W,
					i = e === R,
					r = this._getItemIndex(t),
					o = this._items.length - 1;
				if ((i && 0 === r || n && r === o) && !this._config.wrap) return t;
				var s = (r + (e === R ? -1 : 1)) % this._items.length;
				return -1 === s ? this._items[this._items.length - 1] : this._items[s]
			}, e._triggerSlideEvent = function (e, t) {
				var n = this._getItemIndex(e),
					i = this._getItemIndex(this._element.querySelector(X)),
					r = k.Event(q.SLIDE, {
						relatedTarget: e,
						direction: t,
						from: i,
						to: n
					});
				return k(this._element).trigger(r), r
			}, e._setActiveIndicatorElement = function (e) {
				if (this._indicatorsElement) {
					var t = [].slice.call(this._indicatorsElement.querySelectorAll(Z));
					k(t).removeClass(Q);
					var n = this._indicatorsElement.children[this._getItemIndex(e)];
					n && k(n).addClass(Q)
				}
			}, e._slide = function (e, t) {
				var n, i, r, o = this,
					s = this._element.querySelector(X),
					a = this._getItemIndex(s),
					l = t || s && this._getItemByDirection(e, s),
					c = this._getItemIndex(l),
					u = Boolean(this._interval);
				if (e === W ? (n = z, i = G, r = U) : (n = V, i = J, r = B), l && k(l).hasClass(Q)) this._isSliding = !1;
				else if (!this._triggerSlideEvent(l, r).isDefaultPrevented() && s && l) {
					this._isSliding = !0, u && this.pause(), this._setActiveIndicatorElement(l);
					var f = k.Event(q.SLID, {
						relatedTarget: l,
						direction: r,
						from: a,
						to: c
					});
					if (k(this._element).hasClass(Y)) {
						k(l).addClass(i), we.reflow(l), k(s).addClass(n), k(l).addClass(n);
						var h = we.getTransitionDurationFromElement(s);
						k(s).one(we.TRANSITION_END, function () {
							k(l).removeClass(n + " " + i).addClass(Q), k(s).removeClass(Q + " " + i + " " + n), o._isSliding = !1, setTimeout(function () {
								return k(o._element).trigger(f)
							}, 0)
						}).emulateTransitionEnd(h)
					} else k(s).removeClass(Q), k(l).addClass(Q), this._isSliding = !1, k(this._element).trigger(f);
					u && this.cycle()
				}
			}, o._jQueryInterface = function (i) {
				return this.each(function () {
					var e = k(this).data(P),
						t = l({}, M, k(this).data());
					"object" == typeof i && (t = l({}, t, i));
					var n = "string" == typeof i ? i : t.slide;
					if (e || (e = new o(this, t), k(this).data(P, e)), "number" == typeof i) e.to(i);
					else if ("string" == typeof n) {
						if ("undefined" == typeof e[n]) throw new TypeError('No method named "' + n + '"');
						e[n]()
					} else t.interval && (e.pause(), e.cycle())
				})
			}, o._dataApiClickHandler = function (e) {
				var t = we.getSelectorFromElement(this);
				if (t) {
					var n = k(t)[0];
					if (n && k(n).hasClass(K)) {
						var i = l({}, k(n).data(), k(this).data()),
							r = this.getAttribute("data-slide-to");
						r && (i.interval = !1), o._jQueryInterface.call(k(n), i), r && k(n).data(P).to(r), e.preventDefault()
					}
				}
			}, s(o, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}, {
				key: "Default",
				get: function () {
					return M
				}
			}]), o
		}(), k(document).on(q.CLICK_DATA_API, ne, re._dataApiClickHandler), k(window).on(q.LOAD_DATA_API, function () {
			for (var e = [].slice.call(document.querySelectorAll(ie)), t = 0, n = e.length; t < n; t++) {
				var i = k(e[t]);
				re._jQueryInterface.call(i, i.data())
			}
		}), k.fn[x] = re._jQueryInterface, k.fn[x].Constructor = re, k.fn[x].noConflict = function () {
			return k.fn[x] = H, re._jQueryInterface
		}, re), De = (se = "collapse", le = "." + (ae = "bs.collapse"), ce = (oe = t).fn[se], ue = {
			toggle: !0,
			parent: ""
		}, fe = {
			toggle: "boolean",
			parent: "(string|element)"
		}, he = {
			SHOW: "show" + le,
			SHOWN: "shown" + le,
			HIDE: "hide" + le,
			HIDDEN: "hidden" + le,
			CLICK_DATA_API: "click" + le + ".data-api"
		}, de = "show", pe = "collapse", me = "collapsing", ge = "collapsed", _e = "width", ve = "height", ye = ".show, .collapsing", Ee = '[data-toggle="collapse"]', be = function () {
			function a(t, e) {
				this._isTransitioning = !1, this._element = t, this._config = this._getConfig(e), this._triggerArray = oe.makeArray(document.querySelectorAll('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]'));
				for (var n = [].slice.call(document.querySelectorAll(Ee)), i = 0, r = n.length; i < r; i++) {
					var o = n[i],
						s = we.getSelectorFromElement(o),
						a = [].slice.call(document.querySelectorAll(s)).filter(function (e) {
							return e === t
						});
					null !== s && 0 < a.length && (this._selector = s, this._triggerArray.push(o))
				}
				this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle()
			}
			var e = a.prototype;
			return e.toggle = function () {
				oe(this._element).hasClass(de) ? this.hide() : this.show()
			}, e.show = function () {
				var e, t, n = this;
				if (!this._isTransitioning && !oe(this._element).hasClass(de) && (this._parent && 0 === (e = [].slice.call(this._parent.querySelectorAll(ye)).filter(function (e) {
						return e.getAttribute("data-parent") === n._config.parent
					})).length && (e = null), !(e && (t = oe(e).not(this._selector).data(ae)) && t._isTransitioning))) {
					var i = oe.Event(he.SHOW);
					if (oe(this._element).trigger(i), !i.isDefaultPrevented()) {
						e && (a._jQueryInterface.call(oe(e).not(this._selector), "hide"), t || oe(e).data(ae, null));
						var r = this._getDimension();
						oe(this._element).removeClass(pe).addClass(me), this._element.style[r] = 0, this._triggerArray.length && oe(this._triggerArray).removeClass(ge).attr("aria-expanded", !0), this.setTransitioning(!0);
						var o = "scroll" + (r[0].toUpperCase() + r.slice(1)),
							s = we.getTransitionDurationFromElement(this._element);
						oe(this._element).one(we.TRANSITION_END, function () {
							oe(n._element).removeClass(me).addClass(pe).addClass(de), n._element.style[r] = "", n.setTransitioning(!1), oe(n._element).trigger(he.SHOWN)
						}).emulateTransitionEnd(s), this._element.style[r] = this._element[o] + "px"
					}
				}
			}, e.hide = function () {
				var e = this;
				if (!this._isTransitioning && oe(this._element).hasClass(de)) {
					var t = oe.Event(he.HIDE);
					if (oe(this._element).trigger(t), !t.isDefaultPrevented()) {
						var n = this._getDimension();
						this._element.style[n] = this._element.getBoundingClientRect()[n] + "px", we.reflow(this._element), oe(this._element).addClass(me).removeClass(pe).removeClass(de);
						var i = this._triggerArray.length;
						if (0 < i)
							for (var r = 0; r < i; r++) {
								var o = this._triggerArray[r],
									s = we.getSelectorFromElement(o);
								if (null !== s) oe([].slice.call(document.querySelectorAll(s))).hasClass(de) || oe(o).addClass(ge).attr("aria-expanded", !1)
							}
						this.setTransitioning(!0);
						this._element.style[n] = "";
						var a = we.getTransitionDurationFromElement(this._element);
						oe(this._element).one(we.TRANSITION_END, function () {
							e.setTransitioning(!1), oe(e._element).removeClass(me).addClass(pe).trigger(he.HIDDEN)
						}).emulateTransitionEnd(a)
					}
				}
			}, e.setTransitioning = function (e) {
				this._isTransitioning = e
			}, e.dispose = function () {
				oe.removeData(this._element, ae), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null
			}, e._getConfig = function (e) {
				return (e = l({}, ue, e)).toggle = Boolean(e.toggle), we.typeCheckConfig(se, e, fe), e
			}, e._getDimension = function () {
				return oe(this._element).hasClass(_e) ? _e : ve
			}, e._getParent = function () {
				var n = this,
					e = null;
				we.isElement(this._config.parent) ? (e = this._config.parent, "undefined" != typeof this._config.parent.jquery && (e = this._config.parent[0])) : e = document.querySelector(this._config.parent);
				var t = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]',
					i = [].slice.call(e.querySelectorAll(t));
				return oe(i).each(function (e, t) {
					n._addAriaAndCollapsedClass(a._getTargetFromElement(t), [t])
				}), e
			}, e._addAriaAndCollapsedClass = function (e, t) {
				if (e) {
					var n = oe(e).hasClass(de);
					t.length && oe(t).toggleClass(ge, !n).attr("aria-expanded", n)
				}
			}, a._getTargetFromElement = function (e) {
				var t = we.getSelectorFromElement(e);
				return t ? document.querySelector(t) : null
			}, a._jQueryInterface = function (i) {
				return this.each(function () {
					var e = oe(this),
						t = e.data(ae),
						n = l({}, ue, e.data(), "object" == typeof i && i ? i : {});
					if (!t && n.toggle && /show|hide/.test(i) && (n.toggle = !1), t || (t = new a(this, n), e.data(ae, t)), "string" == typeof i) {
						if ("undefined" == typeof t[i]) throw new TypeError('No method named "' + i + '"');
						t[i]()
					}
				})
			}, s(a, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}, {
				key: "Default",
				get: function () {
					return ue
				}
			}]), a
		}(), oe(document).on(he.CLICK_DATA_API, Ee, function (e) {
			"A" === e.currentTarget.tagName && e.preventDefault();
			var n = oe(this),
				t = we.getSelectorFromElement(this),
				i = [].slice.call(document.querySelectorAll(t));
			oe(i).each(function () {
				var e = oe(this),
					t = e.data(ae) ? "toggle" : n.data();
				be._jQueryInterface.call(e, t)
			})
		}), oe.fn[se] = be._jQueryInterface, oe.fn[se].Constructor = be, oe.fn[se].noConflict = function () {
			return oe.fn[se] = ce, be._jQueryInterface
		}, be), Ae = "undefined" != typeof window && "undefined" != typeof document, Ie = ["Edge", "Trident", "Firefox"], Oe = 0, Ne = 0; Ne < Ie.length; Ne += 1)
		if (Ae && 0 <= navigator.userAgent.indexOf(Ie[Ne])) {
			Oe = 1;
			break
		} var ke = Ae && window.Promise ? function (e) {
		var t = !1;
		return function () {
			t || (t = !0, window.Promise.resolve().then(function () {
				t = !1, e()
			}))
		}
	} : function (e) {
		var t = !1;
		return function () {
			t || (t = !0, setTimeout(function () {
				t = !1, e()
			}, Oe))
		}
	};

	function xe(e) {
		return e && "[object Function]" === {}.toString.call(e)
	}

	function Pe(e, t) {
		if (1 !== e.nodeType) return [];
		var n = getComputedStyle(e, null);
		return t ? n[t] : n
	}

	function Le(e) {
		return "HTML" === e.nodeName ? e : e.parentNode || e.host
	}

	function je(e) {
		if (!e) return document.body;
		switch (e.nodeName) {
			case "HTML":
			case "BODY":
				return e.ownerDocument.body;
			case "#document":
				return e.body
		}
		var t = Pe(e),
			n = t.overflow,
			i = t.overflowX,
			r = t.overflowY;
		return /(auto|scroll|overlay)/.test(n + r + i) ? e : je(Le(e))
	}
	var He = Ae && !(!window.MSInputMethodContext || !document.documentMode),
		Me = Ae && /MSIE 10/.test(navigator.userAgent);

	function Fe(e) {
		return 11 === e ? He : 10 === e ? Me : He || Me
	}

	function We(e) {
		if (!e) return document.documentElement;
		for (var t = Fe(10) ? document.body : null, n = e.offsetParent; n === t && e.nextElementSibling;) n = (e = e.nextElementSibling).offsetParent;
		var i = n && n.nodeName;
		return i && "BODY" !== i && "HTML" !== i ? -1 !== ["TD", "TABLE"].indexOf(n.nodeName) && "static" === Pe(n, "position") ? We(n) : n : e ? e.ownerDocument.documentElement : document.documentElement
	}

	function Re(e) {
		return null !== e.parentNode ? Re(e.parentNode) : e
	}

	function Ue(e, t) {
		if (!(e && e.nodeType && t && t.nodeType)) return document.documentElement;
		var n = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING,
			i = n ? e : t,
			r = n ? t : e,
			o = document.createRange();
		o.setStart(i, 0), o.setEnd(r, 0);
		var s, a, l = o.commonAncestorContainer;
		if (e !== l && t !== l || i.contains(r)) return "BODY" === (a = (s = l).nodeName) || "HTML" !== a && We(s.firstElementChild) !== s ? We(l) : l;
		var c = Re(e);
		return c.host ? Ue(c.host, t) : Ue(e, Re(t).host)
	}

	function Be(e) {
		var t = "top" === (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "top") ? "scrollTop" : "scrollLeft",
			n = e.nodeName;
		if ("BODY" === n || "HTML" === n) {
			var i = e.ownerDocument.documentElement;
			return (e.ownerDocument.scrollingElement || i)[t]
		}
		return e[t]
	}

	function qe(e, t) {
		var n = "x" === t ? "Left" : "Top",
			i = "Left" === n ? "Right" : "Bottom";
		return parseFloat(e["border" + n + "Width"], 10) + parseFloat(e["border" + i + "Width"], 10)
	}

	function Ke(e, t, n, i) {
		return Math.max(t["offset" + e], t["scroll" + e], n["client" + e], n["offset" + e], n["scroll" + e], Fe(10) ? n["offset" + e] + i["margin" + ("Height" === e ? "Top" : "Left")] + i["margin" + ("Height" === e ? "Bottom" : "Right")] : 0)
	}

	function Qe() {
		var e = document.body,
			t = document.documentElement,
			n = Fe(10) && getComputedStyle(t);
		return {
			height: Ke("Height", e, t, n),
			width: Ke("Width", e, t, n)
		}
	}
	var Ye = function () {
			function i(e, t) {
				for (var n = 0; n < t.length; n++) {
					var i = t[n];
					i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
				}
			}
			return function (e, t, n) {
				return t && i(e.prototype, t), n && i(e, n), e
			}
		}(),
		Ve = function (e, t, n) {
			return t in e ? Object.defineProperty(e, t, {
				value: n,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = n, e
		},
		ze = Object.assign || function (e) {
			for (var t = 1; t < arguments.length; t++) {
				var n = arguments[t];
				for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
			}
			return e
		};

	function Ge(e) {
		return ze({}, e, {
			right: e.left + e.width,
			bottom: e.top + e.height
		})
	}

	function Je(e) {
		var t = {};
		try {
			if (Fe(10)) {
				t = e.getBoundingClientRect();
				var n = Be(e, "top"),
					i = Be(e, "left");
				t.top += n, t.left += i, t.bottom += n, t.right += i
			} else t = e.getBoundingClientRect()
		} catch (e) {}
		var r = {
				left: t.left,
				top: t.top,
				width: t.right - t.left,
				height: t.bottom - t.top
			},
			o = "HTML" === e.nodeName ? Qe() : {},
			s = o.width || e.clientWidth || r.right - r.left,
			a = o.height || e.clientHeight || r.bottom - r.top,
			l = e.offsetWidth - s,
			c = e.offsetHeight - a;
		if (l || c) {
			var u = Pe(e);
			l -= qe(u, "x"), c -= qe(u, "y"), r.width -= l, r.height -= c
		}
		return Ge(r)
	}

	function Ze(e, t) {
		var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
			i = Fe(10),
			r = "HTML" === t.nodeName,
			o = Je(e),
			s = Je(t),
			a = je(e),
			l = Pe(t),
			c = parseFloat(l.borderTopWidth, 10),
			u = parseFloat(l.borderLeftWidth, 10);
		n && "HTML" === t.nodeName && (s.top = Math.max(s.top, 0), s.left = Math.max(s.left, 0));
		var f = Ge({
			top: o.top - s.top - c,
			left: o.left - s.left - u,
			width: o.width,
			height: o.height
		});
		if (f.marginTop = 0, f.marginLeft = 0, !i && r) {
			var h = parseFloat(l.marginTop, 10),
				d = parseFloat(l.marginLeft, 10);
			f.top -= c - h, f.bottom -= c - h, f.left -= u - d, f.right -= u - d, f.marginTop = h, f.marginLeft = d
		}
		return (i && !n ? t.contains(a) : t === a && "BODY" !== a.nodeName) && (f = function (e, t) {
			var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
				i = Be(t, "top"),
				r = Be(t, "left"),
				o = n ? -1 : 1;
			return e.top += i * o, e.bottom += i * o, e.left += r * o, e.right += r * o, e
		}(f, t)), f
	}

	function Xe(e) {
		if (!e || !e.parentElement || Fe()) return document.documentElement;
		for (var t = e.parentElement; t && "none" === Pe(t, "transform");) t = t.parentElement;
		return t || document.documentElement
	}

	function $e(e, t, n, i) {
		var r = 4 < arguments.length && void 0 !== arguments[4] && arguments[4],
			o = {
				top: 0,
				left: 0
			},
			s = r ? Xe(e) : Ue(e, t);
		if ("viewport" === i) o = function (e) {
			var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
				n = e.ownerDocument.documentElement,
				i = Ze(e, n),
				r = Math.max(n.clientWidth, window.innerWidth || 0),
				o = Math.max(n.clientHeight, window.innerHeight || 0),
				s = t ? 0 : Be(n),
				a = t ? 0 : Be(n, "left");
			return Ge({
				top: s - i.top + i.marginTop,
				left: a - i.left + i.marginLeft,
				width: r,
				height: o
			})
		}(s, r);
		else {
			var a = void 0;
			"scrollParent" === i ? "BODY" === (a = je(Le(t))).nodeName && (a = e.ownerDocument.documentElement) : a = "window" === i ? e.ownerDocument.documentElement : i;
			var l = Ze(a, s, r);
			if ("HTML" !== a.nodeName || function e(t) {
					var n = t.nodeName;
					return "BODY" !== n && "HTML" !== n && ("fixed" === Pe(t, "position") || e(Le(t)))
				}(s)) o = l;
			else {
				var c = Qe(),
					u = c.height,
					f = c.width;
				o.top += l.top - l.marginTop, o.bottom = u + l.top, o.left += l.left - l.marginLeft, o.right = f + l.left
			}
		}
		return o.left += n, o.top += n, o.right -= n, o.bottom -= n, o
	}

	function et(e, t, i, n, r) {
		var o = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : 0;
		if (-1 === e.indexOf("auto")) return e;
		var s = $e(i, n, o, r),
			a = {
				top: {
					width: s.width,
					height: t.top - s.top
				},
				right: {
					width: s.right - t.right,
					height: s.height
				},
				bottom: {
					width: s.width,
					height: s.bottom - t.bottom
				},
				left: {
					width: t.left - s.left,
					height: s.height
				}
			},
			l = Object.keys(a).map(function (e) {
				return ze({
					key: e
				}, a[e], {
					area: (t = a[e], t.width * t.height)
				});
				var t
			}).sort(function (e, t) {
				return t.area - e.area
			}),
			c = l.filter(function (e) {
				var t = e.width,
					n = e.height;
				return t >= i.clientWidth && n >= i.clientHeight
			}),
			u = 0 < c.length ? c[0].key : l[0].key,
			f = e.split("-")[1];
		return u + (f ? "-" + f : "")
	}

	function tt(e, t, n) {
		var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
		return Ze(n, i ? Xe(t) : Ue(t, n), i)
	}

	function nt(e) {
		var t = getComputedStyle(e),
			n = parseFloat(t.marginTop) + parseFloat(t.marginBottom),
			i = parseFloat(t.marginLeft) + parseFloat(t.marginRight);
		return {
			width: e.offsetWidth + i,
			height: e.offsetHeight + n
		}
	}

	function it(e) {
		var t = {
			left: "right",
			right: "left",
			bottom: "top",
			top: "bottom"
		};
		return e.replace(/left|right|bottom|top/g, function (e) {
			return t[e]
		})
	}

	function rt(e, t, n) {
		n = n.split("-")[0];
		var i = nt(e),
			r = {
				width: i.width,
				height: i.height
			},
			o = -1 !== ["right", "left"].indexOf(n),
			s = o ? "top" : "left",
			a = o ? "left" : "top",
			l = o ? "height" : "width",
			c = o ? "width" : "height";
		return r[s] = t[s] + t[l] / 2 - i[l] / 2, r[a] = n === a ? t[a] - i[c] : t[it(a)], r
	}

	function ot(e, t) {
		return Array.prototype.find ? e.find(t) : e.filter(t)[0]
	}

	function st(e, n, t) {
		return (void 0 === t ? e : e.slice(0, function (e, t, n) {
			if (Array.prototype.findIndex) return e.findIndex(function (e) {
				return e[t] === n
			});
			var i = ot(e, function (e) {
				return e[t] === n
			});
			return e.indexOf(i)
		}(e, "name", t))).forEach(function (e) {
			e.function && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
			var t = e.function || e.fn;
			e.enabled && xe(t) && (n.offsets.popper = Ge(n.offsets.popper), n.offsets.reference = Ge(n.offsets.reference), n = t(n, e))
		}), n
	}

	function at(e, n) {
		return e.some(function (e) {
			var t = e.name;
			return e.enabled && t === n
		})
	}

	function lt(e) {
		for (var t = [!1, "ms", "Webkit", "Moz", "O"], n = e.charAt(0).toUpperCase() + e.slice(1), i = 0; i < t.length; i++) {
			var r = t[i],
				o = r ? "" + r + n : e;
			if ("undefined" != typeof document.body.style[o]) return o
		}
		return null
	}

	function ct(e) {
		var t = e.ownerDocument;
		return t ? t.defaultView : window
	}

	function ut(e, t, n, i) {
		n.updateBound = i, ct(e).addEventListener("resize", n.updateBound, {
			passive: !0
		});
		var r = je(e);
		return function e(t, n, i, r) {
			var o = "BODY" === t.nodeName,
				s = o ? t.ownerDocument.defaultView : t;
			s.addEventListener(n, i, {
				passive: !0
			}), o || e(je(s.parentNode), n, i, r), r.push(s)
		}(r, "scroll", n.updateBound, n.scrollParents), n.scrollElement = r, n.eventsEnabled = !0, n
	}

	function ft() {
		var e, t;
		this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = (e = this.reference, t = this.state, ct(e).removeEventListener("resize", t.updateBound), t.scrollParents.forEach(function (e) {
			e.removeEventListener("scroll", t.updateBound)
		}), t.updateBound = null, t.scrollParents = [], t.scrollElement = null, t.eventsEnabled = !1, t))
	}

	function ht(e) {
		return "" !== e && !isNaN(parseFloat(e)) && isFinite(e)
	}

	function dt(n, i) {
		Object.keys(i).forEach(function (e) {
			var t = ""; - 1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(e) && ht(i[e]) && (t = "px"), n.style[e] = i[e] + t
		})
	}

	function pt(e, t, n) {
		var i = ot(e, function (e) {
				return e.name === t
			}),
			r = !!i && e.some(function (e) {
				return e.name === n && e.enabled && e.order < i.order
			});
		if (!r) {
			var o = "`" + t + "`",
				s = "`" + n + "`";
			console.warn(s + " modifier is required by " + o + " modifier in order to work, be sure to include it before " + o + "!")
		}
		return r
	}
	var mt = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"],
		gt = mt.slice(3);

	function _t(e) {
		var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
			n = gt.indexOf(e),
			i = gt.slice(n + 1).concat(gt.slice(0, n));
		return t ? i.reverse() : i
	}
	var vt = "flip",
		yt = "clockwise",
		Et = "counterclockwise";

	function bt(e, r, o, t) {
		var s = [0, 0],
			a = -1 !== ["right", "left"].indexOf(t),
			n = e.split(/(\+|\-)/).map(function (e) {
				return e.trim()
			}),
			i = n.indexOf(ot(n, function (e) {
				return -1 !== e.search(/,|\s/)
			}));
		n[i] && -1 === n[i].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
		var l = /\s*,\s*|\s+/,
			c = -1 !== i ? [n.slice(0, i).concat([n[i].split(l)[0]]), [n[i].split(l)[1]].concat(n.slice(i + 1))] : [n];
		return (c = c.map(function (e, t) {
			var n = (1 === t ? !a : a) ? "height" : "width",
				i = !1;
			return e.reduce(function (e, t) {
				return "" === e[e.length - 1] && -1 !== ["+", "-"].indexOf(t) ? (e[e.length - 1] = t, i = !0, e) : i ? (e[e.length - 1] += t, i = !1, e) : e.concat(t)
			}, []).map(function (e) {
				return function (e, t, n, i) {
					var r = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),
						o = +r[1],
						s = r[2];
					if (!o) return e;
					if (0 === s.indexOf("%")) {
						var a = void 0;
						switch (s) {
							case "%p":
								a = n;
								break;
							case "%":
							case "%r":
							default:
								a = i
						}
						return Ge(a)[t] / 100 * o
					}
					if ("vh" === s || "vw" === s) return ("vh" === s ? Math.max(document.documentElement.clientHeight, window.innerHeight || 0) : Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * o;
					return o
				}(e, n, r, o)
			})
		})).forEach(function (n, i) {
			n.forEach(function (e, t) {
				ht(e) && (s[i] += e * ("-" === n[t - 1] ? -1 : 1))
			})
		}), s
	}
	var wt = {
			placement: "bottom",
			positionFixed: !1,
			eventsEnabled: !0,
			removeOnDestroy: !1,
			onCreate: function () {},
			onUpdate: function () {},
			modifiers: {
				shift: {
					order: 100,
					enabled: !0,
					fn: function (e) {
						var t = e.placement,
							n = t.split("-")[0],
							i = t.split("-")[1];
						if (i) {
							var r = e.offsets,
								o = r.reference,
								s = r.popper,
								a = -1 !== ["bottom", "top"].indexOf(n),
								l = a ? "left" : "top",
								c = a ? "width" : "height",
								u = {
									start: Ve({}, l, o[l]),
									end: Ve({}, l, o[l] + o[c] - s[c])
								};
							e.offsets.popper = ze({}, s, u[i])
						}
						return e
					}
				},
				offset: {
					order: 200,
					enabled: !0,
					fn: function (e, t) {
						var n = t.offset,
							i = e.placement,
							r = e.offsets,
							o = r.popper,
							s = r.reference,
							a = i.split("-")[0],
							l = void 0;
						return l = ht(+n) ? [+n, 0] : bt(n, o, s, a), "left" === a ? (o.top += l[0], o.left -= l[1]) : "right" === a ? (o.top += l[0], o.left += l[1]) : "top" === a ? (o.left += l[0], o.top -= l[1]) : "bottom" === a && (o.left += l[0], o.top += l[1]), e.popper = o, e
					},
					offset: 0
				},
				preventOverflow: {
					order: 300,
					enabled: !0,
					fn: function (e, i) {
						var t = i.boundariesElement || We(e.instance.popper);
						e.instance.reference === t && (t = We(t));
						var n = lt("transform"),
							r = e.instance.popper.style,
							o = r.top,
							s = r.left,
							a = r[n];
						r.top = "", r.left = "", r[n] = "";
						var l = $e(e.instance.popper, e.instance.reference, i.padding, t, e.positionFixed);
						r.top = o, r.left = s, r[n] = a, i.boundaries = l;
						var c = i.priority,
							u = e.offsets.popper,
							f = {
								primary: function (e) {
									var t = u[e];
									return u[e] < l[e] && !i.escapeWithReference && (t = Math.max(u[e], l[e])), Ve({}, e, t)
								},
								secondary: function (e) {
									var t = "right" === e ? "left" : "top",
										n = u[t];
									return u[e] > l[e] && !i.escapeWithReference && (n = Math.min(u[t], l[e] - ("right" === e ? u.width : u.height))), Ve({}, t, n)
								}
							};
						return c.forEach(function (e) {
							var t = -1 !== ["left", "top"].indexOf(e) ? "primary" : "secondary";
							u = ze({}, u, f[t](e))
						}), e.offsets.popper = u, e
					},
					priority: ["left", "right", "top", "bottom"],
					padding: 5,
					boundariesElement: "scrollParent"
				},
				keepTogether: {
					order: 400,
					enabled: !0,
					fn: function (e) {
						var t = e.offsets,
							n = t.popper,
							i = t.reference,
							r = e.placement.split("-")[0],
							o = Math.floor,
							s = -1 !== ["top", "bottom"].indexOf(r),
							a = s ? "right" : "bottom",
							l = s ? "left" : "top",
							c = s ? "width" : "height";
						return n[a] < o(i[l]) && (e.offsets.popper[l] = o(i[l]) - n[c]), n[l] > o(i[a]) && (e.offsets.popper[l] = o(i[a])), e
					}
				},
				arrow: {
					order: 500,
					enabled: !0,
					fn: function (e, t) {
						var n;
						if (!pt(e.instance.modifiers, "arrow", "keepTogether")) return e;
						var i = t.element;
						if ("string" == typeof i) {
							if (!(i = e.instance.popper.querySelector(i))) return e
						} else if (!e.instance.popper.contains(i)) return console.warn("WARNING: `arrow.element` must be child of its popper element!"), e;
						var r = e.placement.split("-")[0],
							o = e.offsets,
							s = o.popper,
							a = o.reference,
							l = -1 !== ["left", "right"].indexOf(r),
							c = l ? "height" : "width",
							u = l ? "Top" : "Left",
							f = u.toLowerCase(),
							h = l ? "left" : "top",
							d = l ? "bottom" : "right",
							p = nt(i)[c];
						a[d] - p < s[f] && (e.offsets.popper[f] -= s[f] - (a[d] - p)), a[f] + p > s[d] && (e.offsets.popper[f] += a[f] + p - s[d]), e.offsets.popper = Ge(e.offsets.popper);
						var m = a[f] + a[c] / 2 - p / 2,
							g = Pe(e.instance.popper),
							_ = parseFloat(g["margin" + u], 10),
							v = parseFloat(g["border" + u + "Width"], 10),
							y = m - e.offsets.popper[f] - _ - v;
						return y = Math.max(Math.min(s[c] - p, y), 0), e.arrowElement = i, e.offsets.arrow = (Ve(n = {}, f, Math.round(y)), Ve(n, h, ""), n), e
					},
					element: "[x-arrow]"
				},
				flip: {
					order: 600,
					enabled: !0,
					fn: function (p, m) {
						if (at(p.instance.modifiers, "inner")) return p;
						if (p.flipped && p.placement === p.originalPlacement) return p;
						var g = $e(p.instance.popper, p.instance.reference, m.padding, m.boundariesElement, p.positionFixed),
							_ = p.placement.split("-")[0],
							v = it(_),
							y = p.placement.split("-")[1] || "",
							E = [];
						switch (m.behavior) {
							case vt:
								E = [_, v];
								break;
							case yt:
								E = _t(_);
								break;
							case Et:
								E = _t(_, !0);
								break;
							default:
								E = m.behavior
						}
						return E.forEach(function (e, t) {
							if (_ !== e || E.length === t + 1) return p;
							_ = p.placement.split("-")[0], v = it(_);
							var n, i = p.offsets.popper,
								r = p.offsets.reference,
								o = Math.floor,
								s = "left" === _ && o(i.right) > o(r.left) || "right" === _ && o(i.left) < o(r.right) || "top" === _ && o(i.bottom) > o(r.top) || "bottom" === _ && o(i.top) < o(r.bottom),
								a = o(i.left) < o(g.left),
								l = o(i.right) > o(g.right),
								c = o(i.top) < o(g.top),
								u = o(i.bottom) > o(g.bottom),
								f = "left" === _ && a || "right" === _ && l || "top" === _ && c || "bottom" === _ && u,
								h = -1 !== ["top", "bottom"].indexOf(_),
								d = !!m.flipVariations && (h && "start" === y && a || h && "end" === y && l || !h && "start" === y && c || !h && "end" === y && u);
							(s || f || d) && (p.flipped = !0, (s || f) && (_ = E[t + 1]), d && (y = "end" === (n = y) ? "start" : "start" === n ? "end" : n), p.placement = _ + (y ? "-" + y : ""), p.offsets.popper = ze({}, p.offsets.popper, rt(p.instance.popper, p.offsets.reference, p.placement)), p = st(p.instance.modifiers, p, "flip"))
						}), p
					},
					behavior: "flip",
					padding: 5,
					boundariesElement: "viewport"
				},
				inner: {
					order: 700,
					enabled: !1,
					fn: function (e) {
						var t = e.placement,
							n = t.split("-")[0],
							i = e.offsets,
							r = i.popper,
							o = i.reference,
							s = -1 !== ["left", "right"].indexOf(n),
							a = -1 === ["top", "left"].indexOf(n);
						return r[s ? "left" : "top"] = o[n] - (a ? r[s ? "width" : "height"] : 0), e.placement = it(t), e.offsets.popper = Ge(r), e
					}
				},
				hide: {
					order: 800,
					enabled: !0,
					fn: function (e) {
						if (!pt(e.instance.modifiers, "hide", "preventOverflow")) return e;
						var t = e.offsets.reference,
							n = ot(e.instance.modifiers, function (e) {
								return "preventOverflow" === e.name
							}).boundaries;
						if (t.bottom < n.top || t.left > n.right || t.top > n.bottom || t.right < n.left) {
							if (!0 === e.hide) return e;
							e.hide = !0, e.attributes["x-out-of-boundaries"] = ""
						} else {
							if (!1 === e.hide) return e;
							e.hide = !1, e.attributes["x-out-of-boundaries"] = !1
						}
						return e
					}
				},
				computeStyle: {
					order: 850,
					enabled: !0,
					fn: function (e, t) {
						var n = t.x,
							i = t.y,
							r = e.offsets.popper,
							o = ot(e.instance.modifiers, function (e) {
								return "applyStyle" === e.name
							}).gpuAcceleration;
						void 0 !== o && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
						var s = void 0 !== o ? o : t.gpuAcceleration,
							a = Je(We(e.instance.popper)),
							l = {
								position: r.position
							},
							c = {
								left: Math.floor(r.left),
								top: Math.round(r.top),
								bottom: Math.round(r.bottom),
								right: Math.floor(r.right)
							},
							u = "bottom" === n ? "top" : "bottom",
							f = "right" === i ? "left" : "right",
							h = lt("transform"),
							d = void 0,
							p = void 0;
						if (p = "bottom" === u ? -a.height + c.bottom : c.top, d = "right" === f ? -a.width + c.right : c.left, s && h) l[h] = "translate3d(" + d + "px, " + p + "px, 0)", l[u] = 0, l[f] = 0, l.willChange = "transform";
						else {
							var m = "bottom" === u ? -1 : 1,
								g = "right" === f ? -1 : 1;
							l[u] = p * m, l[f] = d * g, l.willChange = u + ", " + f
						}
						var _ = {
							"x-placement": e.placement
						};
						return e.attributes = ze({}, _, e.attributes), e.styles = ze({}, l, e.styles), e.arrowStyles = ze({}, e.offsets.arrow, e.arrowStyles), e
					},
					gpuAcceleration: !0,
					x: "bottom",
					y: "right"
				},
				applyStyle: {
					order: 900,
					enabled: !0,
					fn: function (e) {
						var t, n;
						return dt(e.instance.popper, e.styles), t = e.instance.popper, n = e.attributes, Object.keys(n).forEach(function (e) {
							!1 !== n[e] ? t.setAttribute(e, n[e]) : t.removeAttribute(e)
						}), e.arrowElement && Object.keys(e.arrowStyles).length && dt(e.arrowElement, e.arrowStyles), e
					},
					onLoad: function (e, t, n, i, r) {
						var o = tt(r, t, e, n.positionFixed),
							s = et(n.placement, o, t, e, n.modifiers.flip.boundariesElement, n.modifiers.flip.padding);
						return t.setAttribute("x-placement", s), dt(t, {
							position: n.positionFixed ? "fixed" : "absolute"
						}), n
					},
					gpuAcceleration: void 0
				}
			}
		},
		Ct = function () {
			function o(e, t) {
				var n = this,
					i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
				! function (e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}(this, o), this.scheduleUpdate = function () {
					return requestAnimationFrame(n.update)
				}, this.update = ke(this.update.bind(this)), this.options = ze({}, o.Defaults, i), this.state = {
					isDestroyed: !1,
					isCreated: !1,
					scrollParents: []
				}, this.reference = e && e.jquery ? e[0] : e, this.popper = t && t.jquery ? t[0] : t, this.options.modifiers = {}, Object.keys(ze({}, o.Defaults.modifiers, i.modifiers)).forEach(function (e) {
					n.options.modifiers[e] = ze({}, o.Defaults.modifiers[e] || {}, i.modifiers ? i.modifiers[e] : {})
				}), this.modifiers = Object.keys(this.options.modifiers).map(function (e) {
					return ze({
						name: e
					}, n.options.modifiers[e])
				}).sort(function (e, t) {
					return e.order - t.order
				}), this.modifiers.forEach(function (e) {
					e.enabled && xe(e.onLoad) && e.onLoad(n.reference, n.popper, n.options, e, n.state)
				}), this.update();
				var r = this.options.eventsEnabled;
				r && this.enableEventListeners(), this.state.eventsEnabled = r
			}
			return Ye(o, [{
				key: "update",
				value: function () {
					return function () {
						if (!this.state.isDestroyed) {
							var e = {
								instance: this,
								styles: {},
								arrowStyles: {},
								attributes: {},
								flipped: !1,
								offsets: {}
							};
							e.offsets.reference = tt(this.state, this.popper, this.reference, this.options.positionFixed), e.placement = et(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.positionFixed = this.options.positionFixed, e.offsets.popper = rt(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute", e = st(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = !0, this.options.onCreate(e))
						}
					}.call(this)
				}
			}, {
				key: "destroy",
				value: function () {
					return function () {
						return this.state.isDestroyed = !0, at(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), this.popper.style.position = "", this.popper.style.top = "", this.popper.style.left = "", this.popper.style.right = "", this.popper.style.bottom = "", this.popper.style.willChange = "", this.popper.style[lt("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this
					}.call(this)
				}
			}, {
				key: "enableEventListeners",
				value: function () {
					return function () {
						this.state.eventsEnabled || (this.state = ut(this.reference, this.options, this.state, this.scheduleUpdate))
					}.call(this)
				}
			}, {
				key: "disableEventListeners",
				value: function () {
					return ft.call(this)
				}
			}]), o
		}();
	Ct.Utils = ("undefined" != typeof window ? window : global).PopperUtils, Ct.placements = mt, Ct.Defaults = wt;
	var Tt, St, Dt, At, It, Ot, Nt, kt, xt, Pt, Lt, jt, Ht, Mt, Ft, Wt, Rt, Ut, Bt, qt, Kt, Qt, Yt, Vt, zt, Gt, Jt, Zt, Xt, $t, en, tn, nn, rn, on, sn, an, ln, cn, un, fn, hn, dn, pn, mn, gn, _n, vn, yn, En, bn, wn, Cn, Tn, Sn, Dn, An, In, On, Nn, kn, xn, Pn, Ln, jn, Hn, Mn, Fn, Wn, Rn, Un, Bn, qn, Kn, Qn, Yn, Vn, zn, Gn, Jn, Zn, Xn, $n, ei, ti, ni, ii, ri, oi, si, ai, li, ci, ui, fi, hi, di, pi, mi, gi, _i, vi, yi, Ei, bi, wi, Ci, Ti, Si, Di, Ai, Ii, Oi, Ni, ki, xi, Pi, Li, ji, Hi, Mi, Fi, Wi, Ri, Ui, Bi = (St = "dropdown", At = "." + (Dt = "bs.dropdown"), It = ".data-api", Ot = (Tt = t).fn[St], Nt = new RegExp("38|40|27"), kt = {
			HIDE: "hide" + At,
			HIDDEN: "hidden" + At,
			SHOW: "show" + At,
			SHOWN: "shown" + At,
			CLICK: "click" + At,
			CLICK_DATA_API: "click" + At + It,
			KEYDOWN_DATA_API: "keydown" + At + It,
			KEYUP_DATA_API: "keyup" + At + It
		}, xt = "disabled", Pt = "show", Lt = "dropup", jt = "dropright", Ht = "dropleft", Mt = "dropdown-menu-right", Ft = "position-static", Wt = '[data-toggle="dropdown"]', Rt = ".dropdown form", Ut = ".dropdown-menu", Bt = ".navbar-nav", qt = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)", Kt = "top-start", Qt = "top-end", Yt = "bottom-start", Vt = "bottom-end", zt = "right-start", Gt = "left-start", Jt = {
			offset: 0,
			flip: !0,
			boundary: "scrollParent",
			reference: "toggle",
			display: "dynamic"
		}, Zt = {
			offset: "(number|string|function)",
			flip: "boolean",
			boundary: "(string|element)",
			reference: "(string|element)",
			display: "string"
		}, Xt = function () {
			function c(e, t) {
				this._element = e, this._popper = null, this._config = this._getConfig(t), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners()
			}
			var e = c.prototype;
			return e.toggle = function () {
				if (!this._element.disabled && !Tt(this._element).hasClass(xt)) {
					var e = c._getParentFromElement(this._element),
						t = Tt(this._menu).hasClass(Pt);
					if (c._clearMenus(), !t) {
						var n = {
								relatedTarget: this._element
							},
							i = Tt.Event(kt.SHOW, n);
						if (Tt(e).trigger(i), !i.isDefaultPrevented()) {
							if (!this._inNavbar) {
								if ("undefined" == typeof Ct) throw new TypeError("Bootstrap dropdown require Popper.js (https://popper.js.org)");
								var r = this._element;
								"parent" === this._config.reference ? r = e : we.isElement(this._config.reference) && (r = this._config.reference, "undefined" != typeof this._config.reference.jquery && (r = this._config.reference[0])), "scrollParent" !== this._config.boundary && Tt(e).addClass(Ft), this._popper = new Ct(r, this._menu, this._getPopperConfig())
							}
							"ontouchstart" in document.documentElement && 0 === Tt(e).closest(Bt).length && Tt(document.body).children().on("mouseover", null, Tt.noop), this._element.focus(), this._element.setAttribute("aria-expanded", !0), Tt(this._menu).toggleClass(Pt), Tt(e).toggleClass(Pt).trigger(Tt.Event(kt.SHOWN, n))
						}
					}
				}
			}, e.dispose = function () {
				Tt.removeData(this._element, Dt), Tt(this._element).off(At), this._element = null, (this._menu = null) !== this._popper && (this._popper.destroy(), this._popper = null)
			}, e.update = function () {
				this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate()
			}, e._addEventListeners = function () {
				var t = this;
				Tt(this._element).on(kt.CLICK, function (e) {
					e.preventDefault(), e.stopPropagation(), t.toggle()
				})
			}, e._getConfig = function (e) {
				return e = l({}, this.constructor.Default, Tt(this._element).data(), e), we.typeCheckConfig(St, e, this.constructor.DefaultType), e
			}, e._getMenuElement = function () {
				if (!this._menu) {
					var e = c._getParentFromElement(this._element);
					e && (this._menu = e.querySelector(Ut))
				}
				return this._menu
			}, e._getPlacement = function () {
				var e = Tt(this._element.parentNode),
					t = Yt;
				return e.hasClass(Lt) ? (t = Kt, Tt(this._menu).hasClass(Mt) && (t = Qt)) : e.hasClass(jt) ? t = zt : e.hasClass(Ht) ? t = Gt : Tt(this._menu).hasClass(Mt) && (t = Vt), t
			}, e._detectNavbar = function () {
				return 0 < Tt(this._element).closest(".navbar").length
			}, e._getPopperConfig = function () {
				var t = this,
					e = {};
				"function" == typeof this._config.offset ? e.fn = function (e) {
					return e.offsets = l({}, e.offsets, t._config.offset(e.offsets) || {}), e
				} : e.offset = this._config.offset;
				var n = {
					placement: this._getPlacement(),
					modifiers: {
						offset: e,
						flip: {
							enabled: this._config.flip
						},
						preventOverflow: {
							boundariesElement: this._config.boundary
						}
					}
				};
				return "static" === this._config.display && (n.modifiers.applyStyle = {
					enabled: !1
				}), n
			}, c._jQueryInterface = function (t) {
				return this.each(function () {
					var e = Tt(this).data(Dt);
					if (e || (e = new c(this, "object" == typeof t ? t : null), Tt(this).data(Dt, e)), "string" == typeof t) {
						if ("undefined" == typeof e[t]) throw new TypeError('No method named "' + t + '"');
						e[t]()
					}
				})
			}, c._clearMenus = function (e) {
				if (!e || 3 !== e.which && ("keyup" !== e.type || 9 === e.which))
					for (var t = [].slice.call(document.querySelectorAll(Wt)), n = 0, i = t.length; n < i; n++) {
						var r = c._getParentFromElement(t[n]),
							o = Tt(t[n]).data(Dt),
							s = {
								relatedTarget: t[n]
							};
						if (e && "click" === e.type && (s.clickEvent = e), o) {
							var a = o._menu;
							if (Tt(r).hasClass(Pt) && !(e && ("click" === e.type && /input|textarea/i.test(e.target.tagName) || "keyup" === e.type && 9 === e.which) && Tt.contains(r, e.target))) {
								var l = Tt.Event(kt.HIDE, s);
								Tt(r).trigger(l), l.isDefaultPrevented() || ("ontouchstart" in document.documentElement && Tt(document.body).children().off("mouseover", null, Tt.noop), t[n].setAttribute("aria-expanded", "false"), Tt(a).removeClass(Pt), Tt(r).removeClass(Pt).trigger(Tt.Event(kt.HIDDEN, s)))
							}
						}
					}
			}, c._getParentFromElement = function (e) {
				var t, n = we.getSelectorFromElement(e);
				return n && (t = document.querySelector(n)), t || e.parentNode
			}, c._dataApiKeydownHandler = function (e) {
				if ((/input|textarea/i.test(e.target.tagName) ? !(32 === e.which || 27 !== e.which && (40 !== e.which && 38 !== e.which || Tt(e.target).closest(Ut).length)) : Nt.test(e.which)) && (e.preventDefault(), e.stopPropagation(), !this.disabled && !Tt(this).hasClass(xt))) {
					var t = c._getParentFromElement(this),
						n = Tt(t).hasClass(Pt);
					if ((n || 27 === e.which && 32 === e.which) && (!n || 27 !== e.which && 32 !== e.which)) {
						var i = [].slice.call(t.querySelectorAll(qt));
						if (0 !== i.length) {
							var r = i.indexOf(e.target);
							38 === e.which && 0 < r && r--, 40 === e.which && r < i.length - 1 && r++, r < 0 && (r = 0), i[r].focus()
						}
					} else {
						if (27 === e.which) {
							var o = t.querySelector(Wt);
							Tt(o).trigger("focus")
						}
						Tt(this).trigger("click")
					}
				}
			}, s(c, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}, {
				key: "Default",
				get: function () {
					return Jt
				}
			}, {
				key: "DefaultType",
				get: function () {
					return Zt
				}
			}]), c
		}(), Tt(document).on(kt.KEYDOWN_DATA_API, Wt, Xt._dataApiKeydownHandler).on(kt.KEYDOWN_DATA_API, Ut, Xt._dataApiKeydownHandler).on(kt.CLICK_DATA_API + " " + kt.KEYUP_DATA_API, Xt._clearMenus).on(kt.CLICK_DATA_API, Wt, function (e) {
			e.preventDefault(), e.stopPropagation(), Xt._jQueryInterface.call(Tt(this), "toggle")
		}).on(kt.CLICK_DATA_API, Rt, function (e) {
			e.stopPropagation()
		}), Tt.fn[St] = Xt._jQueryInterface, Tt.fn[St].Constructor = Xt, Tt.fn[St].noConflict = function () {
			return Tt.fn[St] = Ot, Xt._jQueryInterface
		}, Xt),
		qi = (en = "modal", nn = "." + (tn = "bs.modal"), rn = ($t = t).fn[en], on = {
			backdrop: !0,
			keyboard: !0,
			focus: !0,
			show: !0
		}, sn = {
			backdrop: "(boolean|string)",
			keyboard: "boolean",
			focus: "boolean",
			show: "boolean"
		}, an = {
			HIDE: "hide" + nn,
			HIDDEN: "hidden" + nn,
			SHOW: "show" + nn,
			SHOWN: "shown" + nn,
			FOCUSIN: "focusin" + nn,
			RESIZE: "resize" + nn,
			CLICK_DISMISS: "click.dismiss" + nn,
			KEYDOWN_DISMISS: "keydown.dismiss" + nn,
			MOUSEUP_DISMISS: "mouseup.dismiss" + nn,
			MOUSEDOWN_DISMISS: "mousedown.dismiss" + nn,
			CLICK_DATA_API: "click" + nn + ".data-api"
		}, ln = "modal-scrollbar-measure", cn = "modal-backdrop", un = "modal-open", fn = "fade", hn = "show", dn = ".modal-dialog", pn = '[data-toggle="modal"]', mn = '[data-dismiss="modal"]', gn = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", _n = ".sticky-top", vn = function () {
			function r(e, t) {
				this._config = this._getConfig(t), this._element = e, this._dialog = e.querySelector(dn), this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, this._scrollbarWidth = 0
			}
			var e = r.prototype;
			return e.toggle = function (e) {
				return this._isShown ? this.hide() : this.show(e)
			}, e.show = function (e) {
				var t = this;
				if (!this._isTransitioning && !this._isShown) {
					$t(this._element).hasClass(fn) && (this._isTransitioning = !0);
					var n = $t.Event(an.SHOW, {
						relatedTarget: e
					});
					$t(this._element).trigger(n), this._isShown || n.isDefaultPrevented() || (this._isShown = !0, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), $t(document.body).addClass(un), this._setEscapeEvent(), this._setResizeEvent(), $t(this._element).on(an.CLICK_DISMISS, mn, function (e) {
						return t.hide(e)
					}), $t(this._dialog).on(an.MOUSEDOWN_DISMISS, function () {
						$t(t._element).one(an.MOUSEUP_DISMISS, function (e) {
							$t(e.target).is(t._element) && (t._ignoreBackdropClick = !0)
						})
					}), this._showBackdrop(function () {
						return t._showElement(e)
					}))
				}
			}, e.hide = function (e) {
				var t = this;
				if (e && e.preventDefault(), !this._isTransitioning && this._isShown) {
					var n = $t.Event(an.HIDE);
					if ($t(this._element).trigger(n), this._isShown && !n.isDefaultPrevented()) {
						this._isShown = !1;
						var i = $t(this._element).hasClass(fn);
						if (i && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), $t(document).off(an.FOCUSIN), $t(this._element).removeClass(hn), $t(this._element).off(an.CLICK_DISMISS), $t(this._dialog).off(an.MOUSEDOWN_DISMISS), i) {
							var r = we.getTransitionDurationFromElement(this._element);
							$t(this._element).one(we.TRANSITION_END, function (e) {
								return t._hideModal(e)
							}).emulateTransitionEnd(r)
						} else this._hideModal()
					}
				}
			}, e.dispose = function () {
				$t.removeData(this._element, tn), $t(window, document, this._element, this._backdrop).off(nn), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._scrollbarWidth = null
			}, e.handleUpdate = function () {
				this._adjustDialog()
			}, e._getConfig = function (e) {
				return e = l({}, on, e), we.typeCheckConfig(en, e, sn), e
			}, e._showElement = function (e) {
				var t = this,
					n = $t(this._element).hasClass(fn);
				this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.scrollTop = 0, n && we.reflow(this._element), $t(this._element).addClass(hn), this._config.focus && this._enforceFocus();
				var i = $t.Event(an.SHOWN, {
						relatedTarget: e
					}),
					r = function () {
						t._config.focus && t._element.focus(), t._isTransitioning = !1, $t(t._element).trigger(i)
					};
				if (n) {
					var o = we.getTransitionDurationFromElement(this._element);
					$t(this._dialog).one(we.TRANSITION_END, r).emulateTransitionEnd(o)
				} else r()
			}, e._enforceFocus = function () {
				var t = this;
				$t(document).off(an.FOCUSIN).on(an.FOCUSIN, function (e) {
					document !== e.target && t._element !== e.target && 0 === $t(t._element).has(e.target).length && t._element.focus()
				})
			}, e._setEscapeEvent = function () {
				var t = this;
				this._isShown && this._config.keyboard ? $t(this._element).on(an.KEYDOWN_DISMISS, function (e) {
					27 === e.which && (e.preventDefault(), t.hide())
				}) : this._isShown || $t(this._element).off(an.KEYDOWN_DISMISS)
			}, e._setResizeEvent = function () {
				var t = this;
				this._isShown ? $t(window).on(an.RESIZE, function (e) {
					return t.handleUpdate(e)
				}) : $t(window).off(an.RESIZE)
			}, e._hideModal = function () {
				var e = this;
				this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._isTransitioning = !1, this._showBackdrop(function () {
					$t(document.body).removeClass(un), e._resetAdjustments(), e._resetScrollbar(), $t(e._element).trigger(an.HIDDEN)
				})
			}, e._removeBackdrop = function () {
				this._backdrop && ($t(this._backdrop).remove(), this._backdrop = null)
			}, e._showBackdrop = function (e) {
				var t = this,
					n = $t(this._element).hasClass(fn) ? fn : "";
				if (this._isShown && this._config.backdrop) {
					if (this._backdrop = document.createElement("div"), this._backdrop.className = cn, n && this._backdrop.classList.add(n), $t(this._backdrop).appendTo(document.body), $t(this._element).on(an.CLICK_DISMISS, function (e) {
							t._ignoreBackdropClick ? t._ignoreBackdropClick = !1 : e.target === e.currentTarget && ("static" === t._config.backdrop ? t._element.focus() : t.hide())
						}), n && we.reflow(this._backdrop), $t(this._backdrop).addClass(hn), !e) return;
					if (!n) return void e();
					var i = we.getTransitionDurationFromElement(this._backdrop);
					$t(this._backdrop).one(we.TRANSITION_END, e).emulateTransitionEnd(i)
				} else if (!this._isShown && this._backdrop) {
					$t(this._backdrop).removeClass(hn);
					var r = function () {
						t._removeBackdrop(), e && e()
					};
					if ($t(this._element).hasClass(fn)) {
						var o = we.getTransitionDurationFromElement(this._backdrop);
						$t(this._backdrop).one(we.TRANSITION_END, r).emulateTransitionEnd(o)
					} else r()
				} else e && e()
			}, e._adjustDialog = function () {
				var e = this._element.scrollHeight > document.documentElement.clientHeight;
				!this._isBodyOverflowing && e && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !e && (this._element.style.paddingRight = this._scrollbarWidth + "px")
			}, e._resetAdjustments = function () {
				this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
			}, e._checkScrollbar = function () {
				var e = document.body.getBoundingClientRect();
				this._isBodyOverflowing = e.left + e.right < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth()
			}, e._setScrollbar = function () {
				var r = this;
				if (this._isBodyOverflowing) {
					var e = [].slice.call(document.querySelectorAll(gn)),
						t = [].slice.call(document.querySelectorAll(_n));
					$t(e).each(function (e, t) {
						var n = t.style.paddingRight,
							i = $t(t).css("padding-right");
						$t(t).data("padding-right", n).css("padding-right", parseFloat(i) + r._scrollbarWidth + "px")
					}), $t(t).each(function (e, t) {
						var n = t.style.marginRight,
							i = $t(t).css("margin-right");
						$t(t).data("margin-right", n).css("margin-right", parseFloat(i) - r._scrollbarWidth + "px")
					});
					var n = document.body.style.paddingRight,
						i = $t(document.body).css("padding-right");
					$t(document.body).data("padding-right", n).css("padding-right", parseFloat(i) + this._scrollbarWidth + "px")
				}
			}, e._resetScrollbar = function () {
				var e = [].slice.call(document.querySelectorAll(gn));
				$t(e).each(function (e, t) {
					var n = $t(t).data("padding-right");
					$t(t).removeData("padding-right"), t.style.paddingRight = n || ""
				});
				var t = [].slice.call(document.querySelectorAll("" + _n));
				$t(t).each(function (e, t) {
					var n = $t(t).data("margin-right");
					"undefined" != typeof n && $t(t).css("margin-right", n).removeData("margin-right")
				});
				var n = $t(document.body).data("padding-right");
				$t(document.body).removeData("padding-right"), document.body.style.paddingRight = n || ""
			}, e._getScrollbarWidth = function () {
				var e = document.createElement("div");
				e.className = ln, document.body.appendChild(e);
				var t = e.getBoundingClientRect().width - e.clientWidth;
				return document.body.removeChild(e), t
			}, r._jQueryInterface = function (n, i) {
				return this.each(function () {
					var e = $t(this).data(tn),
						t = l({}, on, $t(this).data(), "object" == typeof n && n ? n : {});
					if (e || (e = new r(this, t), $t(this).data(tn, e)), "string" == typeof n) {
						if ("undefined" == typeof e[n]) throw new TypeError('No method named "' + n + '"');
						e[n](i)
					} else t.show && e.show(i)
				})
			}, s(r, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}, {
				key: "Default",
				get: function () {
					return on
				}
			}]), r
		}(), $t(document).on(an.CLICK_DATA_API, pn, function (e) {
			var t, n = this,
				i = we.getSelectorFromElement(this);
			i && (t = document.querySelector(i));
			var r = $t(t).data(tn) ? "toggle" : l({}, $t(t).data(), $t(this).data());
			"A" !== this.tagName && "AREA" !== this.tagName || e.preventDefault();
			var o = $t(t).one(an.SHOW, function (e) {
				e.isDefaultPrevented() || o.one(an.HIDDEN, function () {
					$t(n).is(":visible") && n.focus()
				})
			});
			vn._jQueryInterface.call($t(t), r, this)
		}), $t.fn[en] = vn._jQueryInterface, $t.fn[en].Constructor = vn, $t.fn[en].noConflict = function () {
			return $t.fn[en] = rn, vn._jQueryInterface
		}, vn),
		Ki = (En = "tooltip", wn = "." + (bn = "bs.tooltip"), Cn = (yn = t).fn[En], Tn = "bs-tooltip", Sn = new RegExp("(^|\\s)" + Tn + "\\S+", "g"), In = {
			animation: !0,
			template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
			trigger: "hover focus",
			title: "",
			delay: 0,
			html: !(An = {
				AUTO: "auto",
				TOP: "top",
				RIGHT: "right",
				BOTTOM: "bottom",
				LEFT: "left"
			}),
			selector: !(Dn = {
				animation: "boolean",
				template: "string",
				title: "(string|element|function)",
				trigger: "string",
				delay: "(number|object)",
				html: "boolean",
				selector: "(string|boolean)",
				placement: "(string|function)",
				offset: "(number|string)",
				container: "(string|element|boolean)",
				fallbackPlacement: "(string|array)",
				boundary: "(string|element)"
			}),
			placement: "top",
			offset: 0,
			container: !1,
			fallbackPlacement: "flip",
			boundary: "scrollParent"
		}, Nn = "out", kn = {
			HIDE: "hide" + wn,
			HIDDEN: "hidden" + wn,
			SHOW: (On = "show") + wn,
			SHOWN: "shown" + wn,
			INSERTED: "inserted" + wn,
			CLICK: "click" + wn,
			FOCUSIN: "focusin" + wn,
			FOCUSOUT: "focusout" + wn,
			MOUSEENTER: "mouseenter" + wn,
			MOUSELEAVE: "mouseleave" + wn
		}, xn = "fade", Pn = "show", Ln = ".tooltip-inner", jn = ".arrow", Hn = "hover", Mn = "focus", Fn = "click", Wn = "manual", Rn = function () {
			function i(e, t) {
				if ("undefined" == typeof Ct) throw new TypeError("Bootstrap tooltips require Popper.js (https://popper.js.org)");
				this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.element = e, this.config = this._getConfig(t), this.tip = null, this._setListeners()
			}
			var e = i.prototype;
			return e.enable = function () {
				this._isEnabled = !0
			}, e.disable = function () {
				this._isEnabled = !1
			}, e.toggleEnabled = function () {
				this._isEnabled = !this._isEnabled
			}, e.toggle = function (e) {
				if (this._isEnabled)
					if (e) {
						var t = this.constructor.DATA_KEY,
							n = yn(e.currentTarget).data(t);
						n || (n = new this.constructor(e.currentTarget, this._getDelegateConfig()), yn(e.currentTarget).data(t, n)), n._activeTrigger.click = !n._activeTrigger.click, n._isWithActiveTrigger() ? n._enter(null, n) : n._leave(null, n)
					} else {
						if (yn(this.getTipElement()).hasClass(Pn)) return void this._leave(null, this);
						this._enter(null, this)
					}
			}, e.dispose = function () {
				clearTimeout(this._timeout), yn.removeData(this.element, this.constructor.DATA_KEY), yn(this.element).off(this.constructor.EVENT_KEY), yn(this.element).closest(".modal").off("hide.bs.modal"), this.tip && yn(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, (this._activeTrigger = null) !== this._popper && this._popper.destroy(), this._popper = null, this.element = null, this.config = null, this.tip = null
			}, e.show = function () {
				var t = this;
				if ("none" === yn(this.element).css("display")) throw new Error("Please use show on visible elements");
				var e = yn.Event(this.constructor.Event.SHOW);
				if (this.isWithContent() && this._isEnabled) {
					yn(this.element).trigger(e);
					var n = yn.contains(this.element.ownerDocument.documentElement, this.element);
					if (e.isDefaultPrevented() || !n) return;
					var i = this.getTipElement(),
						r = we.getUID(this.constructor.NAME);
					i.setAttribute("id", r), this.element.setAttribute("aria-describedby", r), this.setContent(), this.config.animation && yn(i).addClass(xn);
					var o = "function" == typeof this.config.placement ? this.config.placement.call(this, i, this.element) : this.config.placement,
						s = this._getAttachment(o);
					this.addAttachmentClass(s);
					var a = !1 === this.config.container ? document.body : yn(document).find(this.config.container);
					yn(i).data(this.constructor.DATA_KEY, this), yn.contains(this.element.ownerDocument.documentElement, this.tip) || yn(i).appendTo(a), yn(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new Ct(this.element, i, {
						placement: s,
						modifiers: {
							offset: {
								offset: this.config.offset
							},
							flip: {
								behavior: this.config.fallbackPlacement
							},
							arrow: {
								element: jn
							},
							preventOverflow: {
								boundariesElement: this.config.boundary
							}
						},
						onCreate: function (e) {
							e.originalPlacement !== e.placement && t._handlePopperPlacementChange(e)
						},
						onUpdate: function (e) {
							t._handlePopperPlacementChange(e)
						}
					}), yn(i).addClass(Pn), "ontouchstart" in document.documentElement && yn(document.body).children().on("mouseover", null, yn.noop);
					var l = function () {
						t.config.animation && t._fixTransition();
						var e = t._hoverState;
						t._hoverState = null, yn(t.element).trigger(t.constructor.Event.SHOWN), e === Nn && t._leave(null, t)
					};
					if (yn(this.tip).hasClass(xn)) {
						var c = we.getTransitionDurationFromElement(this.tip);
						yn(this.tip).one(we.TRANSITION_END, l).emulateTransitionEnd(c)
					} else l()
				}
			}, e.hide = function (e) {
				var t = this,
					n = this.getTipElement(),
					i = yn.Event(this.constructor.Event.HIDE),
					r = function () {
						t._hoverState !== On && n.parentNode && n.parentNode.removeChild(n), t._cleanTipClass(), t.element.removeAttribute("aria-describedby"), yn(t.element).trigger(t.constructor.Event.HIDDEN), null !== t._popper && t._popper.destroy(), e && e()
					};
				if (yn(this.element).trigger(i), !i.isDefaultPrevented()) {
					if (yn(n).removeClass(Pn), "ontouchstart" in document.documentElement && yn(document.body).children().off("mouseover", null, yn.noop), this._activeTrigger[Fn] = !1, this._activeTrigger[Mn] = !1, this._activeTrigger[Hn] = !1, yn(this.tip).hasClass(xn)) {
						var o = we.getTransitionDurationFromElement(n);
						yn(n).one(we.TRANSITION_END, r).emulateTransitionEnd(o)
					} else r();
					this._hoverState = ""
				}
			}, e.update = function () {
				null !== this._popper && this._popper.scheduleUpdate()
			}, e.isWithContent = function () {
				return Boolean(this.getTitle())
			}, e.addAttachmentClass = function (e) {
				yn(this.getTipElement()).addClass(Tn + "-" + e)
			}, e.getTipElement = function () {
				return this.tip = this.tip || yn(this.config.template)[0], this.tip
			}, e.setContent = function () {
				var e = this.getTipElement();
				this.setElementContent(yn(e.querySelectorAll(Ln)), this.getTitle()), yn(e).removeClass(xn + " " + Pn)
			}, e.setElementContent = function (e, t) {
				var n = this.config.html;
				"object" == typeof t && (t.nodeType || t.jquery) ? n ? yn(t).parent().is(e) || e.empty().append(t) : e.text(yn(t).text()) : e[n ? "html" : "text"](t)
			}, e.getTitle = function () {
				var e = this.element.getAttribute("data-original-title");
				return e || (e = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), e
			}, e._getAttachment = function (e) {
				return An[e.toUpperCase()]
			}, e._setListeners = function () {
				var i = this;
				this.config.trigger.split(" ").forEach(function (e) {
					if ("click" === e) yn(i.element).on(i.constructor.Event.CLICK, i.config.selector, function (e) {
						return i.toggle(e)
					});
					else if (e !== Wn) {
						var t = e === Hn ? i.constructor.Event.MOUSEENTER : i.constructor.Event.FOCUSIN,
							n = e === Hn ? i.constructor.Event.MOUSELEAVE : i.constructor.Event.FOCUSOUT;
						yn(i.element).on(t, i.config.selector, function (e) {
							return i._enter(e)
						}).on(n, i.config.selector, function (e) {
							return i._leave(e)
						})
					}
					yn(i.element).closest(".modal").on("hide.bs.modal", function () {
						return i.hide()
					})
				}), this.config.selector ? this.config = l({}, this.config, {
					trigger: "manual",
					selector: ""
				}) : this._fixTitle()
			}, e._fixTitle = function () {
				var e = typeof this.element.getAttribute("data-original-title");
				(this.element.getAttribute("title") || "string" !== e) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", ""))
			}, e._enter = function (e, t) {
				var n = this.constructor.DATA_KEY;
				(t = t || yn(e.currentTarget).data(n)) || (t = new this.constructor(e.currentTarget, this._getDelegateConfig()), yn(e.currentTarget).data(n, t)), e && (t._activeTrigger["focusin" === e.type ? Mn : Hn] = !0), yn(t.getTipElement()).hasClass(Pn) || t._hoverState === On ? t._hoverState = On : (clearTimeout(t._timeout), t._hoverState = On, t.config.delay && t.config.delay.show ? t._timeout = setTimeout(function () {
					t._hoverState === On && t.show()
				}, t.config.delay.show) : t.show())
			}, e._leave = function (e, t) {
				var n = this.constructor.DATA_KEY;
				(t = t || yn(e.currentTarget).data(n)) || (t = new this.constructor(e.currentTarget, this._getDelegateConfig()), yn(e.currentTarget).data(n, t)), e && (t._activeTrigger["focusout" === e.type ? Mn : Hn] = !1), t._isWithActiveTrigger() || (clearTimeout(t._timeout), t._hoverState = Nn, t.config.delay && t.config.delay.hide ? t._timeout = setTimeout(function () {
					t._hoverState === Nn && t.hide()
				}, t.config.delay.hide) : t.hide())
			}, e._isWithActiveTrigger = function () {
				for (var e in this._activeTrigger)
					if (this._activeTrigger[e]) return !0;
				return !1
			}, e._getConfig = function (e) {
				return "number" == typeof (e = l({}, this.constructor.Default, yn(this.element).data(), "object" == typeof e && e ? e : {})).delay && (e.delay = {
					show: e.delay,
					hide: e.delay
				}), "number" == typeof e.title && (e.title = e.title.toString()), "number" == typeof e.content && (e.content = e.content.toString()), we.typeCheckConfig(En, e, this.constructor.DefaultType), e
			}, e._getDelegateConfig = function () {
				var e = {};
				if (this.config)
					for (var t in this.config) this.constructor.Default[t] !== this.config[t] && (e[t] = this.config[t]);
				return e
			}, e._cleanTipClass = function () {
				var e = yn(this.getTipElement()),
					t = e.attr("class").match(Sn);
				null !== t && t.length && e.removeClass(t.join(""))
			}, e._handlePopperPlacementChange = function (e) {
				var t = e.instance;
				this.tip = t.popper, this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(e.placement))
			}, e._fixTransition = function () {
				var e = this.getTipElement(),
					t = this.config.animation;
				null === e.getAttribute("x-placement") && (yn(e).removeClass(xn), this.config.animation = !1, this.hide(), this.show(), this.config.animation = t)
			}, i._jQueryInterface = function (n) {
				return this.each(function () {
					var e = yn(this).data(bn),
						t = "object" == typeof n && n;
					if ((e || !/dispose|hide/.test(n)) && (e || (e = new i(this, t), yn(this).data(bn, e)), "string" == typeof n)) {
						if ("undefined" == typeof e[n]) throw new TypeError('No method named "' + n + '"');
						e[n]()
					}
				})
			}, s(i, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}, {
				key: "Default",
				get: function () {
					return In
				}
			}, {
				key: "NAME",
				get: function () {
					return En
				}
			}, {
				key: "DATA_KEY",
				get: function () {
					return bn
				}
			}, {
				key: "Event",
				get: function () {
					return kn
				}
			}, {
				key: "EVENT_KEY",
				get: function () {
					return wn
				}
			}, {
				key: "DefaultType",
				get: function () {
					return Dn
				}
			}]), i
		}(), yn.fn[En] = Rn._jQueryInterface, yn.fn[En].Constructor = Rn, yn.fn[En].noConflict = function () {
			return yn.fn[En] = Cn, Rn._jQueryInterface
		}, Rn),
		Qi = (Bn = "popover", Kn = "." + (qn = "bs.popover"), Qn = (Un = t).fn[Bn], Yn = "bs-popover", Vn = new RegExp("(^|\\s)" + Yn + "\\S+", "g"), zn = l({}, Ki.Default, {
			placement: "right",
			trigger: "click",
			content: "",
			template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
		}), Gn = l({}, Ki.DefaultType, {
			content: "(string|element|function)"
		}), Jn = "fade", Xn = ".popover-header", $n = ".popover-body", ei = {
			HIDE: "hide" + Kn,
			HIDDEN: "hidden" + Kn,
			SHOW: (Zn = "show") + Kn,
			SHOWN: "shown" + Kn,
			INSERTED: "inserted" + Kn,
			CLICK: "click" + Kn,
			FOCUSIN: "focusin" + Kn,
			FOCUSOUT: "focusout" + Kn,
			MOUSEENTER: "mouseenter" + Kn,
			MOUSELEAVE: "mouseleave" + Kn
		}, ti = function (e) {
			var t, n;

			function i() {
				return e.apply(this, arguments) || this
			}
			n = e, (t = i).prototype = Object.create(n.prototype), (t.prototype.constructor = t).__proto__ = n;
			var r = i.prototype;
			return r.isWithContent = function () {
				return this.getTitle() || this._getContent()
			}, r.addAttachmentClass = function (e) {
				Un(this.getTipElement()).addClass(Yn + "-" + e)
			}, r.getTipElement = function () {
				return this.tip = this.tip || Un(this.config.template)[0], this.tip
			}, r.setContent = function () {
				var e = Un(this.getTipElement());
				this.setElementContent(e.find(Xn), this.getTitle());
				var t = this._getContent();
				"function" == typeof t && (t = t.call(this.element)), this.setElementContent(e.find($n), t), e.removeClass(Jn + " " + Zn)
			}, r._getContent = function () {
				return this.element.getAttribute("data-content") || this.config.content
			}, r._cleanTipClass = function () {
				var e = Un(this.getTipElement()),
					t = e.attr("class").match(Vn);
				null !== t && 0 < t.length && e.removeClass(t.join(""))
			}, i._jQueryInterface = function (n) {
				return this.each(function () {
					var e = Un(this).data(qn),
						t = "object" == typeof n ? n : null;
					if ((e || !/destroy|hide/.test(n)) && (e || (e = new i(this, t), Un(this).data(qn, e)), "string" == typeof n)) {
						if ("undefined" == typeof e[n]) throw new TypeError('No method named "' + n + '"');
						e[n]()
					}
				})
			}, s(i, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}, {
				key: "Default",
				get: function () {
					return zn
				}
			}, {
				key: "NAME",
				get: function () {
					return Bn
				}
			}, {
				key: "DATA_KEY",
				get: function () {
					return qn
				}
			}, {
				key: "Event",
				get: function () {
					return ei
				}
			}, {
				key: "EVENT_KEY",
				get: function () {
					return Kn
				}
			}, {
				key: "DefaultType",
				get: function () {
					return Gn
				}
			}]), i
		}(Ki), Un.fn[Bn] = ti._jQueryInterface, Un.fn[Bn].Constructor = ti, Un.fn[Bn].noConflict = function () {
			return Un.fn[Bn] = Qn, ti._jQueryInterface
		}, ti),
		Yi = (ii = "scrollspy", oi = "." + (ri = "bs.scrollspy"), si = (ni = t).fn[ii], ai = {
			offset: 10,
			method: "auto",
			target: ""
		}, li = {
			offset: "number",
			method: "string",
			target: "(string|element)"
		}, ci = {
			ACTIVATE: "activate" + oi,
			SCROLL: "scroll" + oi,
			LOAD_DATA_API: "load" + oi + ".data-api"
		}, ui = "dropdown-item", fi = "active", hi = '[data-spy="scroll"]', di = ".active", pi = ".nav, .list-group", mi = ".nav-link", gi = ".nav-item", _i = ".list-group-item", vi = ".dropdown", yi = ".dropdown-item", Ei = ".dropdown-toggle", bi = "offset", wi = "position", Ci = function () {
			function n(e, t) {
				var n = this;
				this._element = e, this._scrollElement = "BODY" === e.tagName ? window : e, this._config = this._getConfig(t), this._selector = this._config.target + " " + mi + "," + this._config.target + " " + _i + "," + this._config.target + " " + yi, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, ni(this._scrollElement).on(ci.SCROLL, function (e) {
					return n._process(e)
				}), this.refresh(), this._process()
			}
			var e = n.prototype;
			return e.refresh = function () {
				var t = this,
					e = this._scrollElement === this._scrollElement.window ? bi : wi,
					r = "auto" === this._config.method ? e : this._config.method,
					o = r === wi ? this._getScrollTop() : 0;
				this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function (e) {
					var t, n = we.getSelectorFromElement(e);
					if (n && (t = document.querySelector(n)), t) {
						var i = t.getBoundingClientRect();
						if (i.width || i.height) return [ni(t)[r]().top + o, n]
					}
					return null
				}).filter(function (e) {
					return e
				}).sort(function (e, t) {
					return e[0] - t[0]
				}).forEach(function (e) {
					t._offsets.push(e[0]), t._targets.push(e[1])
				})
			}, e.dispose = function () {
				ni.removeData(this._element, ri), ni(this._scrollElement).off(oi), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null
			}, e._getConfig = function (e) {
				if ("string" != typeof (e = l({}, ai, "object" == typeof e && e ? e : {})).target) {
					var t = ni(e.target).attr("id");
					t || (t = we.getUID(ii), ni(e.target).attr("id", t)), e.target = "#" + t
				}
				return we.typeCheckConfig(ii, e, li), e
			}, e._getScrollTop = function () {
				return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
			}, e._getScrollHeight = function () {
				return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
			}, e._getOffsetHeight = function () {
				return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
			}, e._process = function () {
				var e = this._getScrollTop() + this._config.offset,
					t = this._getScrollHeight(),
					n = this._config.offset + t - this._getOffsetHeight();
				if (this._scrollHeight !== t && this.refresh(), n <= e) {
					var i = this._targets[this._targets.length - 1];
					this._activeTarget !== i && this._activate(i)
				} else {
					if (this._activeTarget && e < this._offsets[0] && 0 < this._offsets[0]) return this._activeTarget = null, void this._clear();
					for (var r = this._offsets.length; r--;) {
						this._activeTarget !== this._targets[r] && e >= this._offsets[r] && ("undefined" == typeof this._offsets[r + 1] || e < this._offsets[r + 1]) && this._activate(this._targets[r])
					}
				}
			}, e._activate = function (t) {
				this._activeTarget = t, this._clear();
				var e = this._selector.split(",");
				e = e.map(function (e) {
					return e + '[data-target="' + t + '"],' + e + '[href="' + t + '"]'
				});
				var n = ni([].slice.call(document.querySelectorAll(e.join(","))));
				n.hasClass(ui) ? (n.closest(vi).find(Ei).addClass(fi), n.addClass(fi)) : (n.addClass(fi), n.parents(pi).prev(mi + ", " + _i).addClass(fi), n.parents(pi).prev(gi).children(mi).addClass(fi)), ni(this._scrollElement).trigger(ci.ACTIVATE, {
					relatedTarget: t
				})
			}, e._clear = function () {
				var e = [].slice.call(document.querySelectorAll(this._selector));
				ni(e).filter(di).removeClass(fi)
			}, n._jQueryInterface = function (t) {
				return this.each(function () {
					var e = ni(this).data(ri);
					if (e || (e = new n(this, "object" == typeof t && t), ni(this).data(ri, e)), "string" == typeof t) {
						if ("undefined" == typeof e[t]) throw new TypeError('No method named "' + t + '"');
						e[t]()
					}
				})
			}, s(n, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}, {
				key: "Default",
				get: function () {
					return ai
				}
			}]), n
		}(), ni(window).on(ci.LOAD_DATA_API, function () {
			for (var e = [].slice.call(document.querySelectorAll(hi)), t = e.length; t--;) {
				var n = ni(e[t]);
				Ci._jQueryInterface.call(n, n.data())
			}
		}), ni.fn[ii] = Ci._jQueryInterface, ni.fn[ii].Constructor = Ci, ni.fn[ii].noConflict = function () {
			return ni.fn[ii] = si, Ci._jQueryInterface
		}, Ci),
		Vi = (Di = "." + (Si = "bs.tab"), Ai = (Ti = t).fn.tab, Ii = {
			HIDE: "hide" + Di,
			HIDDEN: "hidden" + Di,
			SHOW: "show" + Di,
			SHOWN: "shown" + Di,
			CLICK_DATA_API: "click" + Di + ".data-api"
		}, Oi = "dropdown-menu", Ni = "active", ki = "disabled", xi = "fade", Pi = "show", Li = ".dropdown", ji = ".nav, .list-group", Hi = ".active", Mi = "> li > .active", Fi = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]', Wi = ".dropdown-toggle", Ri = "> .dropdown-menu .active", Ui = function () {
			function i(e) {
				this._element = e
			}
			var e = i.prototype;
			return e.show = function () {
				var n = this;
				if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && Ti(this._element).hasClass(Ni) || Ti(this._element).hasClass(ki))) {
					var e, i, t = Ti(this._element).closest(ji)[0],
						r = we.getSelectorFromElement(this._element);
					if (t) {
						var o = "UL" === t.nodeName ? Mi : Hi;
						i = (i = Ti.makeArray(Ti(t).find(o)))[i.length - 1]
					}
					var s = Ti.Event(Ii.HIDE, {
							relatedTarget: this._element
						}),
						a = Ti.Event(Ii.SHOW, {
							relatedTarget: i
						});
					if (i && Ti(i).trigger(s), Ti(this._element).trigger(a), !a.isDefaultPrevented() && !s.isDefaultPrevented()) {
						r && (e = document.querySelector(r)), this._activate(this._element, t);
						var l = function () {
							var e = Ti.Event(Ii.HIDDEN, {
									relatedTarget: n._element
								}),
								t = Ti.Event(Ii.SHOWN, {
									relatedTarget: i
								});
							Ti(i).trigger(e), Ti(n._element).trigger(t)
						};
						e ? this._activate(e, e.parentNode, l) : l()
					}
				}
			}, e.dispose = function () {
				Ti.removeData(this._element, Si), this._element = null
			}, e._activate = function (e, t, n) {
				var i = this,
					r = ("UL" === t.nodeName ? Ti(t).find(Mi) : Ti(t).children(Hi))[0],
					o = n && r && Ti(r).hasClass(xi),
					s = function () {
						return i._transitionComplete(e, r, n)
					};
				if (r && o) {
					var a = we.getTransitionDurationFromElement(r);
					Ti(r).one(we.TRANSITION_END, s).emulateTransitionEnd(a)
				} else s()
			}, e._transitionComplete = function (e, t, n) {
				if (t) {
					Ti(t).removeClass(Pi + " " + Ni);
					var i = Ti(t.parentNode).find(Ri)[0];
					i && Ti(i).removeClass(Ni), "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", !1)
				}
				if (Ti(e).addClass(Ni), "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !0), we.reflow(e), Ti(e).addClass(Pi), e.parentNode && Ti(e.parentNode).hasClass(Oi)) {
					var r = Ti(e).closest(Li)[0];
					if (r) {
						var o = [].slice.call(r.querySelectorAll(Wi));
						Ti(o).addClass(Ni)
					}
					e.setAttribute("aria-expanded", !0)
				}
				n && n()
			}, i._jQueryInterface = function (n) {
				return this.each(function () {
					var e = Ti(this),
						t = e.data(Si);
					if (t || (t = new i(this), e.data(Si, t)), "string" == typeof n) {
						if ("undefined" == typeof t[n]) throw new TypeError('No method named "' + n + '"');
						t[n]()
					}
				})
			}, s(i, null, [{
				key: "VERSION",
				get: function () {
					return "4.1.3"
				}
			}]), i
		}(), Ti(document).on(Ii.CLICK_DATA_API, Fi, function (e) {
			e.preventDefault(), Ui._jQueryInterface.call(Ti(this), "show")
		}), Ti.fn.tab = Ui._jQueryInterface, Ti.fn.tab.Constructor = Ui, Ti.fn.tab.noConflict = function () {
			return Ti.fn.tab = Ai, Ui._jQueryInterface
		}, Ui);
	! function (e) {
		if ("undefined" == typeof e) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
		var t = e.fn.jquery.split(" ")[0].split(".");
		if (t[0] < 2 && t[1] < 9 || 1 === t[0] && 9 === t[1] && t[2] < 1 || 4 <= t[0]) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
	}(t), e.Util = we, e.Alert = Ce, e.Button = Te, e.Carousel = Se, e.Collapse = De, e.Dropdown = Bi, e.Modal = qi, e.Popover = Qi, e.Scrollspy = Yi, e.Tab = Vi, e.Tooltip = Ki, Object.defineProperty(e, "__esModule", {
		value: !0
	})
});
//# sourceMappingURL=bootstrap.bundle.min.js.map
/*
 Copyright (C) Federico Zivolo 2018
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */
(function (e, t) {
	'object' == typeof exports && 'undefined' != typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define(t) : e.Popper = t()
})(this, function () {
	'use strict';

	function e(e) {
		return e && '[object Function]' === {}.toString.call(e)
	}

	function t(e, t) {
		if (1 !== e.nodeType) return [];
		var o = getComputedStyle(e, null);
		return t ? o[t] : o
	}

	function o(e) {
		return 'HTML' === e.nodeName ? e : e.parentNode || e.host
	}

	function n(e) {
		if (!e) return document.body;
		switch (e.nodeName) {
			case 'HTML':
			case 'BODY':
				return e.ownerDocument.body;
			case '#document':
				return e.body;
		}
		var i = t(e),
			r = i.overflow,
			p = i.overflowX,
			s = i.overflowY;
		return /(auto|scroll|overlay)/.test(r + s + p) ? e : n(o(e))
	}

	function r(e) {
		return 11 === e ? re : 10 === e ? pe : re || pe
	}

	function p(e) {
		if (!e) return document.documentElement;
		for (var o = r(10) ? document.body : null, n = e.offsetParent; n === o && e.nextElementSibling;) n = (e = e.nextElementSibling).offsetParent;
		var i = n && n.nodeName;
		return i && 'BODY' !== i && 'HTML' !== i ? -1 !== ['TD', 'TABLE'].indexOf(n.nodeName) && 'static' === t(n, 'position') ? p(n) : n : e ? e.ownerDocument.documentElement : document.documentElement
	}

	function s(e) {
		var t = e.nodeName;
		return 'BODY' !== t && ('HTML' === t || p(e.firstElementChild) === e)
	}

	function d(e) {
		return null === e.parentNode ? e : d(e.parentNode)
	}

	function a(e, t) {
		if (!e || !e.nodeType || !t || !t.nodeType) return document.documentElement;
		var o = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING,
			n = o ? e : t,
			i = o ? t : e,
			r = document.createRange();
		r.setStart(n, 0), r.setEnd(i, 0);
		var l = r.commonAncestorContainer;
		if (e !== l && t !== l || n.contains(i)) return s(l) ? l : p(l);
		var f = d(e);
		return f.host ? a(f.host, t) : a(e, d(t).host)
	}

	function l(e) {
		var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 'top',
			o = 'top' === t ? 'scrollTop' : 'scrollLeft',
			n = e.nodeName;
		if ('BODY' === n || 'HTML' === n) {
			var i = e.ownerDocument.documentElement,
				r = e.ownerDocument.scrollingElement || i;
			return r[o]
		}
		return e[o]
	}

	function f(e, t) {
		var o = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
			n = l(t, 'top'),
			i = l(t, 'left'),
			r = o ? -1 : 1;
		return e.top += n * r, e.bottom += n * r, e.left += i * r, e.right += i * r, e
	}

	function m(e, t) {
		var o = 'x' === t ? 'Left' : 'Top',
			n = 'Left' == o ? 'Right' : 'Bottom';
		return parseFloat(e['border' + o + 'Width'], 10) + parseFloat(e['border' + n + 'Width'], 10)
	}

	function h(e, t, o, n) {
		return $(t['offset' + e], t['scroll' + e], o['client' + e], o['offset' + e], o['scroll' + e], r(10) ? o['offset' + e] + n['margin' + ('Height' === e ? 'Top' : 'Left')] + n['margin' + ('Height' === e ? 'Bottom' : 'Right')] : 0)
	}

	function c() {
		var e = document.body,
			t = document.documentElement,
			o = r(10) && getComputedStyle(t);
		return {
			height: h('Height', e, t, o),
			width: h('Width', e, t, o)
		}
	}

	function g(e) {
		return le({}, e, {
			right: e.left + e.width,
			bottom: e.top + e.height
		})
	}

	function u(e) {
		var o = {};
		try {
			if (r(10)) {
				o = e.getBoundingClientRect();
				var n = l(e, 'top'),
					i = l(e, 'left');
				o.top += n, o.left += i, o.bottom += n, o.right += i
			} else o = e.getBoundingClientRect()
		} catch (t) {}
		var p = {
				left: o.left,
				top: o.top,
				width: o.right - o.left,
				height: o.bottom - o.top
			},
			s = 'HTML' === e.nodeName ? c() : {},
			d = s.width || e.clientWidth || p.right - p.left,
			a = s.height || e.clientHeight || p.bottom - p.top,
			f = e.offsetWidth - d,
			h = e.offsetHeight - a;
		if (f || h) {
			var u = t(e);
			f -= m(u, 'x'), h -= m(u, 'y'), p.width -= f, p.height -= h
		}
		return g(p)
	}

	function b(e, o) {
		var i = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
			p = r(10),
			s = 'HTML' === o.nodeName,
			d = u(e),
			a = u(o),
			l = n(e),
			m = t(o),
			h = parseFloat(m.borderTopWidth, 10),
			c = parseFloat(m.borderLeftWidth, 10);
		i && 'HTML' === o.nodeName && (a.top = $(a.top, 0), a.left = $(a.left, 0));
		var b = g({
			top: d.top - a.top - h,
			left: d.left - a.left - c,
			width: d.width,
			height: d.height
		});
		if (b.marginTop = 0, b.marginLeft = 0, !p && s) {
			var y = parseFloat(m.marginTop, 10),
				w = parseFloat(m.marginLeft, 10);
			b.top -= h - y, b.bottom -= h - y, b.left -= c - w, b.right -= c - w, b.marginTop = y, b.marginLeft = w
		}
		return (p && !i ? o.contains(l) : o === l && 'BODY' !== l.nodeName) && (b = f(b, o)), b
	}

	function y(e) {
		var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
			o = e.ownerDocument.documentElement,
			n = b(e, o),
			i = $(o.clientWidth, window.innerWidth || 0),
			r = $(o.clientHeight, window.innerHeight || 0),
			p = t ? 0 : l(o),
			s = t ? 0 : l(o, 'left'),
			d = {
				top: p - n.top + n.marginTop,
				left: s - n.left + n.marginLeft,
				width: i,
				height: r
			};
		return g(d)
	}

	function w(e) {
		var n = e.nodeName;
		return 'BODY' === n || 'HTML' === n ? !1 : 'fixed' === t(e, 'position') || w(o(e))
	}

	function E(e) {
		if (!e || !e.parentElement || r()) return document.documentElement;
		for (var o = e.parentElement; o && 'none' === t(o, 'transform');) o = o.parentElement;
		return o || document.documentElement
	}

	function v(e, t, i, r) {
		var p = 4 < arguments.length && void 0 !== arguments[4] && arguments[4],
			s = {
				top: 0,
				left: 0
			},
			d = p ? E(e) : a(e, t);
		if ('viewport' === r) s = y(d, p);
		else {
			var l;
			'scrollParent' === r ? (l = n(o(t)), 'BODY' === l.nodeName && (l = e.ownerDocument.documentElement)) : 'window' === r ? l = e.ownerDocument.documentElement : l = r;
			var f = b(l, d, p);
			if ('HTML' === l.nodeName && !w(d)) {
				var m = c(),
					h = m.height,
					g = m.width;
				s.top += f.top - f.marginTop, s.bottom = h + f.top, s.left += f.left - f.marginLeft, s.right = g + f.left
			} else s = f
		}
		return s.left += i, s.top += i, s.right -= i, s.bottom -= i, s
	}

	function x(e) {
		var t = e.width,
			o = e.height;
		return t * o
	}

	function O(e, t, o, n, i) {
		var r = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : 0;
		if (-1 === e.indexOf('auto')) return e;
		var p = v(o, n, r, i),
			s = {
				top: {
					width: p.width,
					height: t.top - p.top
				},
				right: {
					width: p.right - t.right,
					height: p.height
				},
				bottom: {
					width: p.width,
					height: p.bottom - t.bottom
				},
				left: {
					width: t.left - p.left,
					height: p.height
				}
			},
			d = Object.keys(s).map(function (e) {
				return le({
					key: e
				}, s[e], {
					area: x(s[e])
				})
			}).sort(function (e, t) {
				return t.area - e.area
			}),
			a = d.filter(function (e) {
				var t = e.width,
					n = e.height;
				return t >= o.clientWidth && n >= o.clientHeight
			}),
			l = 0 < a.length ? a[0].key : d[0].key,
			f = e.split('-')[1];
		return l + (f ? '-' + f : '')
	}

	function L(e, t, o) {
		var n = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null,
			i = n ? E(t) : a(t, o);
		return b(o, i, n)
	}

	function S(e) {
		var t = getComputedStyle(e),
			o = parseFloat(t.marginTop) + parseFloat(t.marginBottom),
			n = parseFloat(t.marginLeft) + parseFloat(t.marginRight),
			i = {
				width: e.offsetWidth + n,
				height: e.offsetHeight + o
			};
		return i
	}

	function T(e) {
		var t = {
			left: 'right',
			right: 'left',
			bottom: 'top',
			top: 'bottom'
		};
		return e.replace(/left|right|bottom|top/g, function (e) {
			return t[e]
		})
	}

	function C(e, t, o) {
		o = o.split('-')[0];
		var n = S(e),
			i = {
				width: n.width,
				height: n.height
			},
			r = -1 !== ['right', 'left'].indexOf(o),
			p = r ? 'top' : 'left',
			s = r ? 'left' : 'top',
			d = r ? 'height' : 'width',
			a = r ? 'width' : 'height';
		return i[p] = t[p] + t[d] / 2 - n[d] / 2, i[s] = o === s ? t[s] - n[a] : t[T(s)], i
	}

	function D(e, t) {
		return Array.prototype.find ? e.find(t) : e.filter(t)[0]
	}

	function N(e, t, o) {
		if (Array.prototype.findIndex) return e.findIndex(function (e) {
			return e[t] === o
		});
		var n = D(e, function (e) {
			return e[t] === o
		});
		return e.indexOf(n)
	}

	function P(t, o, n) {
		var i = void 0 === n ? t : t.slice(0, N(t, 'name', n));
		return i.forEach(function (t) {
			t['function'] && console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
			var n = t['function'] || t.fn;
			t.enabled && e(n) && (o.offsets.popper = g(o.offsets.popper), o.offsets.reference = g(o.offsets.reference), o = n(o, t))
		}), o
	}

	function k() {
		if (!this.state.isDestroyed) {
			var e = {
				instance: this,
				styles: {},
				arrowStyles: {},
				attributes: {},
				flipped: !1,
				offsets: {}
			};
			e.offsets.reference = L(this.state, this.popper, this.reference, this.options.positionFixed), e.placement = O(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.positionFixed = this.options.positionFixed, e.offsets.popper = C(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute', e = P(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = !0, this.options.onCreate(e))
		}
	}

	function W(e, t) {
		return e.some(function (e) {
			var o = e.name,
				n = e.enabled;
			return n && o === t
		})
	}

	function B(e) {
		for (var t = [!1, 'ms', 'Webkit', 'Moz', 'O'], o = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < t.length; n++) {
			var i = t[n],
				r = i ? '' + i + o : e;
			if ('undefined' != typeof document.body.style[r]) return r
		}
		return null
	}

	function H() {
		return this.state.isDestroyed = !0, W(this.modifiers, 'applyStyle') && (this.popper.removeAttribute('x-placement'), this.popper.style.position = '', this.popper.style.top = '', this.popper.style.left = '', this.popper.style.right = '', this.popper.style.bottom = '', this.popper.style.willChange = '', this.popper.style[B('transform')] = ''), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this
	}

	function A(e) {
		var t = e.ownerDocument;
		return t ? t.defaultView : window
	}

	function M(e, t, o, i) {
		var r = 'BODY' === e.nodeName,
			p = r ? e.ownerDocument.defaultView : e;
		p.addEventListener(t, o, {
			passive: !0
		}), r || M(n(p.parentNode), t, o, i), i.push(p)
	}

	function I(e, t, o, i) {
		o.updateBound = i, A(e).addEventListener('resize', o.updateBound, {
			passive: !0
		});
		var r = n(e);
		return M(r, 'scroll', o.updateBound, o.scrollParents), o.scrollElement = r, o.eventsEnabled = !0, o
	}

	function F() {
		this.state.eventsEnabled || (this.state = I(this.reference, this.options, this.state, this.scheduleUpdate))
	}

	function R(e, t) {
		return A(e).removeEventListener('resize', t.updateBound), t.scrollParents.forEach(function (e) {
			e.removeEventListener('scroll', t.updateBound)
		}), t.updateBound = null, t.scrollParents = [], t.scrollElement = null, t.eventsEnabled = !1, t
	}

	function U() {
		this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = R(this.reference, this.state))
	}

	function Y(e) {
		return '' !== e && !isNaN(parseFloat(e)) && isFinite(e)
	}

	function j(e, t) {
		Object.keys(t).forEach(function (o) {
			var n = ''; - 1 !== ['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(o) && Y(t[o]) && (n = 'px'), e.style[o] = t[o] + n
		})
	}

	function K(e, t) {
		Object.keys(t).forEach(function (o) {
			var n = t[o];
			!1 === n ? e.removeAttribute(o) : e.setAttribute(o, t[o])
		})
	}

	function q(e, t, o) {
		var n = D(e, function (e) {
				var o = e.name;
				return o === t
			}),
			i = !!n && e.some(function (e) {
				return e.name === o && e.enabled && e.order < n.order
			});
		if (!i) {
			var r = '`' + t + '`';
			console.warn('`' + o + '`' + ' modifier is required by ' + r + ' modifier in order to work, be sure to include it before ' + r + '!')
		}
		return i
	}

	function G(e) {
		return 'end' === e ? 'start' : 'start' === e ? 'end' : e
	}

	function z(e) {
		var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
			o = me.indexOf(e),
			n = me.slice(o + 1).concat(me.slice(0, o));
		return t ? n.reverse() : n
	}

	function V(e, t, o, n) {
		var i = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),
			r = +i[1],
			p = i[2];
		if (!r) return e;
		if (0 === p.indexOf('%')) {
			var s;
			switch (p) {
				case '%p':
					s = o;
					break;
				case '%':
				case '%r':
				default:
					s = n;
			}
			var d = g(s);
			return d[t] / 100 * r
		}
		if ('vh' === p || 'vw' === p) {
			var a;
			return a = 'vh' === p ? $(document.documentElement.clientHeight, window.innerHeight || 0) : $(document.documentElement.clientWidth, window.innerWidth || 0), a / 100 * r
		}
		return r
	}

	function _(e, t, o, n) {
		var i = [0, 0],
			r = -1 !== ['right', 'left'].indexOf(n),
			p = e.split(/(\+|\-)/).map(function (e) {
				return e.trim()
			}),
			s = p.indexOf(D(p, function (e) {
				return -1 !== e.search(/,|\s/)
			}));
		p[s] && -1 === p[s].indexOf(',') && console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
		var d = /\s*,\s*|\s+/,
			a = -1 === s ? [p] : [p.slice(0, s).concat([p[s].split(d)[0]]), [p[s].split(d)[1]].concat(p.slice(s + 1))];
		return a = a.map(function (e, n) {
			var i = (1 === n ? !r : r) ? 'height' : 'width',
				p = !1;
			return e.reduce(function (e, t) {
				return '' === e[e.length - 1] && -1 !== ['+', '-'].indexOf(t) ? (e[e.length - 1] = t, p = !0, e) : p ? (e[e.length - 1] += t, p = !1, e) : e.concat(t)
			}, []).map(function (e) {
				return V(e, i, t, o)
			})
		}), a.forEach(function (e, t) {
			e.forEach(function (o, n) {
				Y(o) && (i[t] += o * ('-' === e[n - 1] ? -1 : 1))
			})
		}), i
	}

	function X(e, t) {
		var o, n = t.offset,
			i = e.placement,
			r = e.offsets,
			p = r.popper,
			s = r.reference,
			d = i.split('-')[0];
		return o = Y(+n) ? [+n, 0] : _(n, p, s, d), 'left' === d ? (p.top += o[0], p.left -= o[1]) : 'right' === d ? (p.top += o[0], p.left += o[1]) : 'top' === d ? (p.left += o[0], p.top -= o[1]) : 'bottom' === d && (p.left += o[0], p.top += o[1]), e.popper = p, e
	}
	for (var J = Math.min, Q = Math.round, Z = Math.floor, $ = Math.max, ee = 'undefined' != typeof window && 'undefined' != typeof document, te = ['Edge', 'Trident', 'Firefox'], oe = 0, ne = 0; ne < te.length; ne += 1)
		if (ee && 0 <= navigator.userAgent.indexOf(te[ne])) {
			oe = 1;
			break
		} var i = ee && window.Promise,
		ie = i ? function (e) {
			var t = !1;
			return function () {
				t || (t = !0, window.Promise.resolve().then(function () {
					t = !1, e()
				}))
			}
		} : function (e) {
			var t = !1;
			return function () {
				t || (t = !0, setTimeout(function () {
					t = !1, e()
				}, oe))
			}
		},
		re = ee && !!(window.MSInputMethodContext && document.documentMode),
		pe = ee && /MSIE 10/.test(navigator.userAgent),
		se = function (e, t) {
			if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function')
		},
		de = function () {
			function e(e, t) {
				for (var o, n = 0; n < t.length; n++) o = t[n], o.enumerable = o.enumerable || !1, o.configurable = !0, 'value' in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
			}
			return function (t, o, n) {
				return o && e(t.prototype, o), n && e(t, n), t
			}
		}(),
		ae = function (e, t, o) {
			return t in e ? Object.defineProperty(e, t, {
				value: o,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = o, e
		},
		le = Object.assign || function (e) {
			for (var t, o = 1; o < arguments.length; o++)
				for (var n in t = arguments[o], t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
			return e
		},
		fe = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'],
		me = fe.slice(3),
		he = {
			FLIP: 'flip',
			CLOCKWISE: 'clockwise',
			COUNTERCLOCKWISE: 'counterclockwise'
		},
		ce = function () {
			function t(o, n) {
				var i = this,
					r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
				se(this, t), this.scheduleUpdate = function () {
					return requestAnimationFrame(i.update)
				}, this.update = ie(this.update.bind(this)), this.options = le({}, t.Defaults, r), this.state = {
					isDestroyed: !1,
					isCreated: !1,
					scrollParents: []
				}, this.reference = o && o.jquery ? o[0] : o, this.popper = n && n.jquery ? n[0] : n, this.options.modifiers = {}, Object.keys(le({}, t.Defaults.modifiers, r.modifiers)).forEach(function (e) {
					i.options.modifiers[e] = le({}, t.Defaults.modifiers[e] || {}, r.modifiers ? r.modifiers[e] : {})
				}), this.modifiers = Object.keys(this.options.modifiers).map(function (e) {
					return le({
						name: e
					}, i.options.modifiers[e])
				}).sort(function (e, t) {
					return e.order - t.order
				}), this.modifiers.forEach(function (t) {
					t.enabled && e(t.onLoad) && t.onLoad(i.reference, i.popper, i.options, t, i.state)
				}), this.update();
				var p = this.options.eventsEnabled;
				p && this.enableEventListeners(), this.state.eventsEnabled = p
			}
			return de(t, [{
				key: 'update',
				value: function () {
					return k.call(this)
				}
			}, {
				key: 'destroy',
				value: function () {
					return H.call(this)
				}
			}, {
				key: 'enableEventListeners',
				value: function () {
					return F.call(this)
				}
			}, {
				key: 'disableEventListeners',
				value: function () {
					return U.call(this)
				}
			}]), t
		}();
	return ce.Utils = ('undefined' == typeof window ? global : window).PopperUtils, ce.placements = fe, ce.Defaults = {
		placement: 'bottom',
		positionFixed: !1,
		eventsEnabled: !0,
		removeOnDestroy: !1,
		onCreate: function () {},
		onUpdate: function () {},
		modifiers: {
			shift: {
				order: 100,
				enabled: !0,
				fn: function (e) {
					var t = e.placement,
						o = t.split('-')[0],
						n = t.split('-')[1];
					if (n) {
						var i = e.offsets,
							r = i.reference,
							p = i.popper,
							s = -1 !== ['bottom', 'top'].indexOf(o),
							d = s ? 'left' : 'top',
							a = s ? 'width' : 'height',
							l = {
								start: ae({}, d, r[d]),
								end: ae({}, d, r[d] + r[a] - p[a])
							};
						e.offsets.popper = le({}, p, l[n])
					}
					return e
				}
			},
			offset: {
				order: 200,
				enabled: !0,
				fn: X,
				offset: 0
			},
			preventOverflow: {
				order: 300,
				enabled: !0,
				fn: function (e, t) {
					var o = t.boundariesElement || p(e.instance.popper);
					e.instance.reference === o && (o = p(o));
					var n = B('transform'),
						i = e.instance.popper.style,
						r = i.top,
						s = i.left,
						d = i[n];
					i.top = '', i.left = '', i[n] = '';
					var a = v(e.instance.popper, e.instance.reference, t.padding, o, e.positionFixed);
					i.top = r, i.left = s, i[n] = d, t.boundaries = a;
					var l = t.priority,
						f = e.offsets.popper,
						m = {
							primary: function (e) {
								var o = f[e];
								return f[e] < a[e] && !t.escapeWithReference && (o = $(f[e], a[e])), ae({}, e, o)
							},
							secondary: function (e) {
								var o = 'right' === e ? 'left' : 'top',
									n = f[o];
								return f[e] > a[e] && !t.escapeWithReference && (n = J(f[o], a[e] - ('right' === e ? f.width : f.height))), ae({}, o, n)
							}
						};
					return l.forEach(function (e) {
						var t = -1 === ['left', 'top'].indexOf(e) ? 'secondary' : 'primary';
						f = le({}, f, m[t](e))
					}), e.offsets.popper = f, e
				},
				priority: ['left', 'right', 'top', 'bottom'],
				padding: 5,
				boundariesElement: 'scrollParent'
			},
			keepTogether: {
				order: 400,
				enabled: !0,
				fn: function (e) {
					var t = e.offsets,
						o = t.popper,
						n = t.reference,
						i = e.placement.split('-')[0],
						r = Z,
						p = -1 !== ['top', 'bottom'].indexOf(i),
						s = p ? 'right' : 'bottom',
						d = p ? 'left' : 'top',
						a = p ? 'width' : 'height';
					return o[s] < r(n[d]) && (e.offsets.popper[d] = r(n[d]) - o[a]), o[d] > r(n[s]) && (e.offsets.popper[d] = r(n[s])), e
				}
			},
			arrow: {
				order: 500,
				enabled: !0,
				fn: function (e, o) {
					var n;
					if (!q(e.instance.modifiers, 'arrow', 'keepTogether')) return e;
					var i = o.element;
					if ('string' == typeof i) {
						if (i = e.instance.popper.querySelector(i), !i) return e;
					} else if (!e.instance.popper.contains(i)) return console.warn('WARNING: `arrow.element` must be child of its popper element!'), e;
					var r = e.placement.split('-')[0],
						p = e.offsets,
						s = p.popper,
						d = p.reference,
						a = -1 !== ['left', 'right'].indexOf(r),
						l = a ? 'height' : 'width',
						f = a ? 'Top' : 'Left',
						m = f.toLowerCase(),
						h = a ? 'left' : 'top',
						c = a ? 'bottom' : 'right',
						u = S(i)[l];
					d[c] - u < s[m] && (e.offsets.popper[m] -= s[m] - (d[c] - u)), d[m] + u > s[c] && (e.offsets.popper[m] += d[m] + u - s[c]), e.offsets.popper = g(e.offsets.popper);
					var b = d[m] + d[l] / 2 - u / 2,
						y = t(e.instance.popper),
						w = parseFloat(y['margin' + f], 10),
						E = parseFloat(y['border' + f + 'Width'], 10),
						v = b - e.offsets.popper[m] - w - E;
					return v = $(J(s[l] - u, v), 0), e.arrowElement = i, e.offsets.arrow = (n = {}, ae(n, m, Q(v)), ae(n, h, ''), n), e
				},
				element: '[x-arrow]'
			},
			flip: {
				order: 600,
				enabled: !0,
				fn: function (e, t) {
					if (W(e.instance.modifiers, 'inner')) return e;
					if (e.flipped && e.placement === e.originalPlacement) return e;
					var o = v(e.instance.popper, e.instance.reference, t.padding, t.boundariesElement, e.positionFixed),
						n = e.placement.split('-')[0],
						i = T(n),
						r = e.placement.split('-')[1] || '',
						p = [];
					switch (t.behavior) {
						case he.FLIP:
							p = [n, i];
							break;
						case he.CLOCKWISE:
							p = z(n);
							break;
						case he.COUNTERCLOCKWISE:
							p = z(n, !0);
							break;
						default:
							p = t.behavior;
					}
					return p.forEach(function (s, d) {
						if (n !== s || p.length === d + 1) return e;
						n = e.placement.split('-')[0], i = T(n);
						var a = e.offsets.popper,
							l = e.offsets.reference,
							f = Z,
							m = 'left' === n && f(a.right) > f(l.left) || 'right' === n && f(a.left) < f(l.right) || 'top' === n && f(a.bottom) > f(l.top) || 'bottom' === n && f(a.top) < f(l.bottom),
							h = f(a.left) < f(o.left),
							c = f(a.right) > f(o.right),
							g = f(a.top) < f(o.top),
							u = f(a.bottom) > f(o.bottom),
							b = 'left' === n && h || 'right' === n && c || 'top' === n && g || 'bottom' === n && u,
							y = -1 !== ['top', 'bottom'].indexOf(n),
							w = !!t.flipVariations && (y && 'start' === r && h || y && 'end' === r && c || !y && 'start' === r && g || !y && 'end' === r && u);
						(m || b || w) && (e.flipped = !0, (m || b) && (n = p[d + 1]), w && (r = G(r)), e.placement = n + (r ? '-' + r : ''), e.offsets.popper = le({}, e.offsets.popper, C(e.instance.popper, e.offsets.reference, e.placement)), e = P(e.instance.modifiers, e, 'flip'))
					}), e
				},
				behavior: 'flip',
				padding: 5,
				boundariesElement: 'viewport'
			},
			inner: {
				order: 700,
				enabled: !1,
				fn: function (e) {
					var t = e.placement,
						o = t.split('-')[0],
						n = e.offsets,
						i = n.popper,
						r = n.reference,
						p = -1 !== ['left', 'right'].indexOf(o),
						s = -1 === ['top', 'left'].indexOf(o);
					return i[p ? 'left' : 'top'] = r[o] - (s ? i[p ? 'width' : 'height'] : 0), e.placement = T(t), e.offsets.popper = g(i), e
				}
			},
			hide: {
				order: 800,
				enabled: !0,
				fn: function (e) {
					if (!q(e.instance.modifiers, 'hide', 'preventOverflow')) return e;
					var t = e.offsets.reference,
						o = D(e.instance.modifiers, function (e) {
							return 'preventOverflow' === e.name
						}).boundaries;
					if (t.bottom < o.top || t.left > o.right || t.top > o.bottom || t.right < o.left) {
						if (!0 === e.hide) return e;
						e.hide = !0, e.attributes['x-out-of-boundaries'] = ''
					} else {
						if (!1 === e.hide) return e;
						e.hide = !1, e.attributes['x-out-of-boundaries'] = !1
					}
					return e
				}
			},
			computeStyle: {
				order: 850,
				enabled: !0,
				fn: function (e, t) {
					var o = t.x,
						n = t.y,
						i = e.offsets.popper,
						r = D(e.instance.modifiers, function (e) {
							return 'applyStyle' === e.name
						}).gpuAcceleration;
					void 0 !== r && console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
					var s, d, a = void 0 === r ? t.gpuAcceleration : r,
						l = p(e.instance.popper),
						f = u(l),
						m = {
							position: i.position
						},
						h = {
							left: Z(i.left),
							top: Q(i.top),
							bottom: Q(i.bottom),
							right: Z(i.right)
						},
						c = 'bottom' === o ? 'top' : 'bottom',
						g = 'right' === n ? 'left' : 'right',
						b = B('transform');
					if (d = 'bottom' == c ? -f.height + h.bottom : h.top, s = 'right' == g ? -f.width + h.right : h.left, a && b) m[b] = 'translate3d(' + s + 'px, ' + d + 'px, 0)', m[c] = 0, m[g] = 0, m.willChange = 'transform';
					else {
						var y = 'bottom' == c ? -1 : 1,
							w = 'right' == g ? -1 : 1;
						m[c] = d * y, m[g] = s * w, m.willChange = c + ', ' + g
					}
					var E = {
						"x-placement": e.placement
					};
					return e.attributes = le({}, E, e.attributes), e.styles = le({}, m, e.styles), e.arrowStyles = le({}, e.offsets.arrow, e.arrowStyles), e
				},
				gpuAcceleration: !0,
				x: 'bottom',
				y: 'right'
			},
			applyStyle: {
				order: 900,
				enabled: !0,
				fn: function (e) {
					return j(e.instance.popper, e.styles), K(e.instance.popper, e.attributes), e.arrowElement && Object.keys(e.arrowStyles).length && j(e.arrowElement, e.arrowStyles), e
				},
				onLoad: function (e, t, o, n, i) {
					var r = L(i, t, e, o.positionFixed),
						p = O(o.placement, r, t, e, o.modifiers.flip.boundariesElement, o.modifiers.flip.padding);
					return t.setAttribute('x-placement', p), j(t, {
						position: o.positionFixed ? 'fixed' : 'absolute'
					}), o
				},
				gpuAcceleration: void 0
			}
		}
	}, ce
});
//# sourceMappingURL=popper.min.js.map

/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
! function () {
	"use strict";

	function t(o) {
		if (!o) throw new Error("No options passed to Waypoint constructor");
		if (!o.element) throw new Error("No element option passed to Waypoint constructor");
		if (!o.handler) throw new Error("No handler option passed to Waypoint constructor");
		this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
			name: this.options.group,
			axis: this.axis
		}), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1
	}
	var e = 0,
		i = {};
	t.prototype.queueTrigger = function (t) {
		this.group.queueTrigger(this, t)
	}, t.prototype.trigger = function (t) {
		this.enabled && this.callback && this.callback.apply(this, t)
	}, t.prototype.destroy = function () {
		this.context.remove(this), this.group.remove(this), delete i[this.key]
	}, t.prototype.disable = function () {
		return this.enabled = !1, this
	}, t.prototype.enable = function () {
		return this.context.refresh(), this.enabled = !0, this
	}, t.prototype.next = function () {
		return this.group.next(this)
	}, t.prototype.previous = function () {
		return this.group.previous(this)
	}, t.invokeAll = function (t) {
		var e = [];
		for (var o in i) e.push(i[o]);
		for (var n = 0, r = e.length; r > n; n++) e[n][t]()
	}, t.destroyAll = function () {
		t.invokeAll("destroy")
	}, t.disableAll = function () {
		t.invokeAll("disable")
	}, t.enableAll = function () {
		t.Context.refreshAll();
		for (var e in i) i[e].enabled = !0;
		return this
	}, t.refreshAll = function () {
		t.Context.refreshAll()
	}, t.viewportHeight = function () {
		return window.innerHeight || document.documentElement.clientHeight
	}, t.viewportWidth = function () {
		return document.documentElement.clientWidth
	}, t.adapters = [], t.defaults = {
		context: window,
		continuous: !0,
		enabled: !0,
		group: "default",
		horizontal: !1,
		offset: 0
	}, t.offsetAliases = {
		"bottom-in-view": function () {
			return this.context.innerHeight() - this.adapter.outerHeight()
		},
		"right-in-view": function () {
			return this.context.innerWidth() - this.adapter.outerWidth()
		}
	}, window.Waypoint = t
}(),
function () {
	"use strict";

	function t(t) {
		window.setTimeout(t, 1e3 / 60)
	}

	function e(t) {
		this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
			x: this.adapter.scrollLeft(),
			y: this.adapter.scrollTop()
		}, this.waypoints = {
			vertical: {},
			horizontal: {}
		}, t.waypointContextKey = this.key, o[t.waypointContextKey] = this, i += 1, n.windowContext || (n.windowContext = !0, n.windowContext = new e(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
	}
	var i = 0,
		o = {},
		n = window.Waypoint,
		r = window.onload;
	e.prototype.add = function (t) {
		var e = t.options.horizontal ? "horizontal" : "vertical";
		this.waypoints[e][t.key] = t, this.refresh()
	}, e.prototype.checkEmpty = function () {
		var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
			e = this.Adapter.isEmptyObject(this.waypoints.vertical),
			i = this.element == this.element.window;
		t && e && !i && (this.adapter.off(".waypoints"), delete o[this.key])
	}, e.prototype.createThrottledResizeHandler = function () {
		function t() {
			e.handleResize(), e.didResize = !1
		}
		var e = this;
		this.adapter.on("resize.waypoints", function () {
			e.didResize || (e.didResize = !0, n.requestAnimationFrame(t))
		})
	}, e.prototype.createThrottledScrollHandler = function () {
		function t() {
			e.handleScroll(), e.didScroll = !1
		}
		var e = this;
		this.adapter.on("scroll.waypoints", function () {
			(!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t))
		})
	}, e.prototype.handleResize = function () {
		n.Context.refreshAll()
	}, e.prototype.handleScroll = function () {
		var t = {},
			e = {
				horizontal: {
					newScroll: this.adapter.scrollLeft(),
					oldScroll: this.oldScroll.x,
					forward: "right",
					backward: "left"
				},
				vertical: {
					newScroll: this.adapter.scrollTop(),
					oldScroll: this.oldScroll.y,
					forward: "down",
					backward: "up"
				}
			};
		for (var i in e) {
			var o = e[i],
				n = o.newScroll > o.oldScroll,
				r = n ? o.forward : o.backward;
			for (var s in this.waypoints[i]) {
				var a = this.waypoints[i][s];
				if (null !== a.triggerPoint) {
					var l = o.oldScroll < a.triggerPoint,
						h = o.newScroll >= a.triggerPoint,
						p = l && h,
						u = !l && !h;
					(p || u) && (a.queueTrigger(r), t[a.group.id] = a.group)
				}
			}
		}
		for (var c in t) t[c].flushTriggers();
		this.oldScroll = {
			x: e.horizontal.newScroll,
			y: e.vertical.newScroll
		}
	}, e.prototype.innerHeight = function () {
		return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight()
	}, e.prototype.remove = function (t) {
		delete this.waypoints[t.axis][t.key], this.checkEmpty()
	}, e.prototype.innerWidth = function () {
		return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth()
	}, e.prototype.destroy = function () {
		var t = [];
		for (var e in this.waypoints)
			for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
		for (var o = 0, n = t.length; n > o; o++) t[o].destroy()
	}, e.prototype.refresh = function () {
		var t, e = this.element == this.element.window,
			i = e ? void 0 : this.adapter.offset(),
			o = {};
		this.handleScroll(), t = {
			horizontal: {
				contextOffset: e ? 0 : i.left,
				contextScroll: e ? 0 : this.oldScroll.x,
				contextDimension: this.innerWidth(),
				oldScroll: this.oldScroll.x,
				forward: "right",
				backward: "left",
				offsetProp: "left"
			},
			vertical: {
				contextOffset: e ? 0 : i.top,
				contextScroll: e ? 0 : this.oldScroll.y,
				contextDimension: this.innerHeight(),
				oldScroll: this.oldScroll.y,
				forward: "down",
				backward: "up",
				offsetProp: "top"
			}
		};
		for (var r in t) {
			var s = t[r];
			for (var a in this.waypoints[r]) {
				var l, h, p, u, c, d = this.waypoints[r][a],
					f = d.options.offset,
					w = d.triggerPoint,
					y = 0,
					g = null == w;
				d.element !== d.element.window && (y = d.adapter.offset()[s.offsetProp]), "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f), d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))), l = s.contextScroll - s.contextOffset, d.triggerPoint = Math.floor(y + l - f), h = w < s.oldScroll, p = d.triggerPoint >= s.oldScroll, u = h && p, c = !h && !p, !g && u ? (d.queueTrigger(s.backward), o[d.group.id] = d.group) : !g && c ? (d.queueTrigger(s.forward), o[d.group.id] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward), o[d.group.id] = d.group)
			}
		}
		return n.requestAnimationFrame(function () {
			for (var t in o) o[t].flushTriggers()
		}), this
	}, e.findOrCreateByElement = function (t) {
		return e.findByElement(t) || new e(t)
	}, e.refreshAll = function () {
		for (var t in o) o[t].refresh()
	}, e.findByElement = function (t) {
		return o[t.waypointContextKey]
	}, window.onload = function () {
		r && r(), e.refreshAll()
	}, n.requestAnimationFrame = function (e) {
		var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
		i.call(window, e)
	}, n.Context = e
}(),
function () {
	"use strict";

	function t(t, e) {
		return t.triggerPoint - e.triggerPoint
	}

	function e(t, e) {
		return e.triggerPoint - t.triggerPoint
	}

	function i(t) {
		this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[this.axis][this.name] = this
	}
	var o = {
			vertical: {},
			horizontal: {}
		},
		n = window.Waypoint;
	i.prototype.add = function (t) {
		this.waypoints.push(t)
	}, i.prototype.clearTriggerQueues = function () {
		this.triggerQueues = {
			up: [],
			down: [],
			left: [],
			right: []
		}
	}, i.prototype.flushTriggers = function () {
		for (var i in this.triggerQueues) {
			var o = this.triggerQueues[i],
				n = "up" === i || "left" === i;
			o.sort(n ? e : t);
			for (var r = 0, s = o.length; s > r; r += 1) {
				var a = o[r];
				(a.options.continuous || r === o.length - 1) && a.trigger([i])
			}
		}
		this.clearTriggerQueues()
	}, i.prototype.next = function (e) {
		this.waypoints.sort(t);
		var i = n.Adapter.inArray(e, this.waypoints),
			o = i === this.waypoints.length - 1;
		return o ? null : this.waypoints[i + 1]
	}, i.prototype.previous = function (e) {
		this.waypoints.sort(t);
		var i = n.Adapter.inArray(e, this.waypoints);
		return i ? this.waypoints[i - 1] : null
	}, i.prototype.queueTrigger = function (t, e) {
		this.triggerQueues[e].push(t)
	}, i.prototype.remove = function (t) {
		var e = n.Adapter.inArray(t, this.waypoints);
		e > -1 && this.waypoints.splice(e, 1)
	}, i.prototype.first = function () {
		return this.waypoints[0]
	}, i.prototype.last = function () {
		return this.waypoints[this.waypoints.length - 1]
	}, i.findOrCreate = function (t) {
		return o[t.axis][t.name] || new i(t)
	}, n.Group = i
}(),
function () {
	"use strict";

	function t(t) {
		this.$element = e(t)
	}
	var e = window.jQuery,
		i = window.Waypoint;
	e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function (e, i) {
		t.prototype[i] = function () {
			var t = Array.prototype.slice.call(arguments);
			return this.$element[i].apply(this.$element, t)
		}
	}), e.each(["extend", "inArray", "isEmptyObject"], function (i, o) {
		t[o] = e[o]
	}), i.adapters.push({
		name: "jquery",
		Adapter: t
	}), i.Adapter = t
}(),
function () {
	"use strict";

	function t(t) {
		return function () {
			var i = [],
				o = arguments[0];
			return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]), o.handler = arguments[0]), this.each(function () {
				var n = t.extend({}, o, {
					element: this
				});
				"string" == typeof n.context && (n.context = t(this).closest(n.context)[0]), i.push(new e(n))
			}), i
		}
	}
	var e = window.Waypoint;
	window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}();

/*! Magnific Popup - v1.0.1 - 2015-12-30
 * http://dimsemenov.com/plugins/magnific-popup/
 * Copyright (c) 2015 Dmitry Semenov; */
! function (a) {
	"function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
}(function (a) {
	var b, c, d, e, f, g, h = "Close",
		i = "BeforeClose",
		j = "AfterClose",
		k = "BeforeAppend",
		l = "MarkupParse",
		m = "Open",
		n = "Change",
		o = "mfp",
		p = "." + o,
		q = "mfp-ready",
		r = "mfp-removing",
		s = "mfp-prevent-close",
		t = function () {},
		u = !!window.jQuery,
		v = a(window),
		w = function (a, c) {
			b.ev.on(o + a + p, c)
		},
		x = function (b, c, d, e) {
			var f = document.createElement("div");
			return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f
		},
		y = function (c, d) {
			b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]))
		},
		z = function (c) {
			return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), g = c), b.currTemplate.closeBtn
		},
		A = function () {
			a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b)
		},
		B = function () {
			var a = document.createElement("p").style,
				b = ["ms", "O", "Moz", "Webkit"];
			if (void 0 !== a.transition) return !0;
			for (; b.length;)
				if (b.pop() + "Transition" in a) return !0;
			return !1
		};
	t.prototype = {
		constructor: t,
		init: function () {
			var c = navigator.appVersion;
			b.isIE7 = -1 !== c.indexOf("MSIE 7."), b.isIE8 = -1 !== c.indexOf("MSIE 8."), b.isLowIE = b.isIE7 || b.isIE8, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {}
		},
		open: function (c) {
			var e;
			if (c.isObj === !1) {
				b.items = c.items.toArray(), b.index = 0;
				var g, h = c.items;
				for (e = 0; e < h.length; e++)
					if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) {
						b.index = e;
						break
					}
			} else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0;
			if (b.isOpen) return void b.updateItemHTML();
			b.types = [], f = "", c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function () {
				b.close()
			}), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function (a) {
				b._checkIfClose(a.target) && b.close()
			}), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading));
			var i = a.magnificPopup.modules;
			for (e = 0; e < i.length; e++) {
				var j = i[e];
				j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b)
			}
			y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function (a, b, c, d) {
				c.close_replaceWith = z(d.type)
			}), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), b.fixedContentPos ? b.wrap.css({
				overflow: b.st.overflowY,
				overflowX: "hidden",
				overflowY: b.st.overflowY
			}) : b.wrap.css({
				top: v.scrollTop(),
				position: "absolute"
			}), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({
				height: d.height(),
				position: "absolute"
			}), b.st.enableEscapeKey && d.on("keyup" + p, function (a) {
				27 === a.keyCode && b.close()
			}), v.on("resize" + p, function () {
				b.updateSize()
			}), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f);
			var k = b.wH = v.height(),
				n = {};
			if (b.fixedContentPos && b._hasScrollBar(k)) {
				var o = b._getScrollbarSize();
				o && (n.marginRight = o)
			}
			b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden");
			var r = b.st.mainClass;
			return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function () {
				b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn)
			}, 16), b.isOpen = !0, b.updateSize(k), y(m), c
		},
		close: function () {
			b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function () {
				b._close()
			}, b.st.removalDelay)) : b._close())
		},
		_close: function () {
			y(h);
			var c = r + " " + q + " ";
			if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) {
				var e = {
					marginRight: ""
				};
				b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e)
			}
			d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j)
		},
		updateSize: function (a) {
			if (b.isIOS) {
				var c = document.documentElement.clientWidth / window.innerWidth,
					d = window.innerHeight * c;
				b.wrap.css("height", d), b.wH = d
			} else b.wH = a || v.height();
			b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize")
		},
		updateItemHTML: function () {
			var c = b.items[b.index];
			b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
			var d = c.type;
			if (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]), b.currItem = c, !b.currTemplate[d]) {
				var f = b.st[d] ? b.st[d].markup : !1;
				y("FirstMarkupParse", f), f ? b.currTemplate[d] = a(f) : b.currTemplate[d] = !0
			}
			e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
			var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
			b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y("AfterChange")
		},
		appendContent: function (a, c) {
			b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content)
		},
		parseEl: function (c) {
			var d, e = b.items[c];
			if (e.tagName ? e = {
					el: a(e)
				} : (d = e.type, e = {
					data: e,
					src: e.src
				}), e.el) {
				for (var f = b.types, g = 0; g < f.length; g++)
					if (e.el.hasClass("mfp-" + f[g])) {
						d = f[g];
						break
					} e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href"))
			}
			return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[c] = e, y("ElementParse", e), b.items[c]
		},
		addGroup: function (a, c) {
			var d = function (d) {
				d.mfpEl = this, b._openClick(d, a, c)
			};
			c || (c = {});
			var e = "click.magnificPopup";
			c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d)))
		},
		_openClick: function (c, d, e) {
			var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
			if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) {
				var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
				if (g)
					if (a.isFunction(g)) {
						if (!g.call(b)) return !0
					} else if (v.width() < g) return !0;
				c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e)
			}
		},
		updateStatus: function (a, d) {
			if (b.preloader) {
				c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading);
				var e = {
					status: a,
					text: d
				};
				y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function (a) {
					a.stopImmediatePropagation()
				}), b.container.addClass("mfp-s-" + a), c = a
			}
		},
		_checkIfClose: function (c) {
			if (!a(c).hasClass(s)) {
				var d = b.st.closeOnContentClick,
					e = b.st.closeOnBgClick;
				if (d && e) return !0;
				if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0;
				if (c === b.content[0] || a.contains(b.content[0], c)) {
					if (d) return !0
				} else if (e && a.contains(document, c)) return !0;
				return !1
			}
		},
		_addClassToMFP: function (a) {
			b.bgOverlay.addClass(a), b.wrap.addClass(a)
		},
		_removeClassFromMFP: function (a) {
			this.bgOverlay.removeClass(a), b.wrap.removeClass(a)
		},
		_hasScrollBar: function (a) {
			return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height())
		},
		_setFocus: function () {
			(b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus()
		},
		_onFocusIn: function (c) {
			return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), !1)
		},
		_parseMarkup: function (b, c, d) {
			var e;
			d.data && (c = a.extend(d.data, c)), y(l, [b, c, d]), a.each(c, function (a, c) {
				if (void 0 === c || c === !1) return !0;
				if (e = a.split("_"), e.length > 1) {
					var d = b.find(p + "-" + e[0]);
					if (d.length > 0) {
						var f = e[1];
						"replaceWith" === f ? d[0] !== c[0] && d.replaceWith(c) : "img" === f ? d.is("img") ? d.attr("src", c) : d.replaceWith('<img src="' + c + '" class="' + d.attr("class") + '" />') : d.attr(e[1], c)
					}
				} else b.find(p + "-" + a).html(c)
			})
		},
		_getScrollbarSize: function () {
			if (void 0 === b.scrollbarSize) {
				var a = document.createElement("div");
				a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a)
			}
			return b.scrollbarSize
		}
	}, a.magnificPopup = {
		instance: null,
		proto: t.prototype,
		modules: [],
		open: function (b, c) {
			return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b)
		},
		close: function () {
			return a.magnificPopup.instance && a.magnificPopup.instance.close()
		},
		registerModule: function (b, c) {
			c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b)
		},
		defaults: {
			disableOn: 0,
			key: null,
			midClick: !1,
			mainClass: "",
			preloader: !0,
			focus: "",
			closeOnContentClick: !1,
			closeOnBgClick: !0,
			closeBtnInside: !0,
			showCloseBtn: !0,
			enableEscapeKey: !0,
			modal: !1,
			alignTop: !1,
			removalDelay: 0,
			prependTo: null,
			fixedContentPos: "auto",
			fixedBgPos: "auto",
			overflowY: "auto",
			closeMarkup: '<button title="%title%" type="button" class="mfp-close">×</button>',
			tClose: "Close (Esc)",
			tLoading: "Loading...",
			autoFocusLast: !0
		}
	}, a.fn.magnificPopup = function (c) {
		A();
		var d = a(this);
		if ("string" == typeof c)
			if ("open" === c) {
				var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup,
					g = parseInt(arguments[1], 10) || 0;
				f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({
					mfpEl: e
				}, d, f)
			} else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
		else c = a.extend(!0, {}, c), u ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c);
		return d
	};
	var C, D, E, F = "inline",
		G = function () {
			E && (D.after(E.addClass(C)).detach(), E = null)
		};
	a.magnificPopup.registerModule(F, {
		options: {
			hiddenClass: "hide",
			markup: "",
			tNotFound: "Content not found"
		},
		proto: {
			initInline: function () {
				b.types.push(F), w(h + "." + F, function () {
					G()
				})
			},
			getInline: function (c, d) {
				if (G(), c.src) {
					var e = b.st.inline,
						f = a(c.src);
					if (f.length) {
						var g = f[0].parentNode;
						g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), b.updateStatus("ready")
					} else b.updateStatus("error", e.tNotFound), f = a("<div>");
					return c.inlineElement = f, f
				}
				return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d
			}
		}
	});
	var H, I = "ajax",
		J = function () {
			H && a(document.body).removeClass(H)
		},
		K = function () {
			J(), b.req && b.req.abort()
		};
	a.magnificPopup.registerModule(I, {
		options: {
			settings: null,
			cursor: "mfp-ajax-cur",
			tError: '<a href="%url%">The content</a> could not be loaded.'
		},
		proto: {
			initAjax: function () {
				b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K)
			},
			getAjax: function (c) {
				H && a(document.body).addClass(H), b.updateStatus("loading");
				var d = a.extend({
					url: c.src,
					success: function (d, e, f) {
						var g = {
							data: d,
							xhr: f
						};
						y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function () {
							b.wrap.addClass(q)
						}, 16), b.updateStatus("ready"), y("AjaxContentAdded")
					},
					error: function () {
						J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src))
					}
				}, b.st.ajax.settings);
				return b.req = a.ajax(d), ""
			}
		}
	});
	var L, M = function (c) {
		if (c.data && void 0 !== c.data.title) return c.data.title;
		var d = b.st.image.titleSrc;
		if (d) {
			if (a.isFunction(d)) return d.call(b, c);
			if (c.el) return c.el.attr(d) || ""
		}
		return ""
	};
	a.magnificPopup.registerModule("image", {
		options: {
			markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
			cursor: "mfp-zoom-out-cur",
			titleSrc: "title",
			verticalFit: !0,
			tError: '<a href="%url%">The image</a> could not be loaded.'
		},
		proto: {
			initImage: function () {
				var c = b.st.image,
					d = ".image";
				b.types.push("image"), w(m + d, function () {
					"image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor)
				}), w(h + d, function () {
					c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p)
				}), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage)
			},
			resizeImage: function () {
				var a = b.currItem;
				if (a && a.img && b.st.image.verticalFit) {
					var c = 0;
					b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c)
				}
			},
			_onImageHasSize: function (a) {
				a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1))
			},
			findImageSize: function (a) {
				var c = 0,
					d = a.img[0],
					e = function (f) {
						L && clearInterval(L), L = setInterval(function () {
							return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++, void(3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)))
						}, f)
					};
				e(1)
			},
			getImage: function (c, d) {
				var e = 0,
					f = function () {
						c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++, 200 > e ? setTimeout(f, 100) : g()))
					},
					g = function () {
						c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0)
					},
					h = b.st.image,
					i = d.find(".mfp-img");
				if (i.length) {
					var j = document.createElement("img");
					j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1)
				}
				return b._parseMarkup(d, {
					title: M(c),
					img_replaceWith: c.img
				}, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d)
			}
		}
	});
	var N, O = function () {
		return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N
	};
	a.magnificPopup.registerModule("zoom", {
		options: {
			enabled: !1,
			easing: "ease-in-out",
			duration: 300,
			opener: function (a) {
				return a.is("img") ? a : a.find("img")
			}
		},
		proto: {
			initZoom: function () {
				var a, c = b.st.zoom,
					d = ".zoom";
				if (c.enabled && b.supportsTransition) {
					var e, f, g = c.duration,
						j = function (a) {
							var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
								d = "all " + c.duration / 1e3 + "s " + c.easing,
								e = {
									position: "fixed",
									zIndex: 9999,
									left: 0,
									top: 0,
									"-webkit-backface-visibility": "hidden"
								},
								f = "transition";
							return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, b.css(e), b
						},
						k = function () {
							b.content.css("visibility", "visible")
						};
					w("BuildControls" + d, function () {
						if (b._allowZoom()) {
							if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), !a) return void k();
							f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function () {
								f.css(b._getOffset(!0)), e = setTimeout(function () {
									k(), setTimeout(function () {
										f.remove(), a = f = null, y("ZoomAnimationEnded")
									}, 16)
								}, g)
							}, 16)
						}
					}), w(i + d, function () {
						if (b._allowZoom()) {
							if (clearTimeout(e), b.st.removalDelay = g, !a) {
								if (a = b._getItemToZoom(), !a) return;
								f = j(a)
							}
							f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), setTimeout(function () {
								f.css(b._getOffset())
							}, 16)
						}
					}), w(h + d, function () {
						b._allowZoom() && (k(), f && f.remove(), a = null)
					})
				}
			},
			_allowZoom: function () {
				return "image" === b.currItem.type
			},
			_getItemToZoom: function () {
				return b.currItem.hasSize ? b.currItem.img : !1
			},
			_getOffset: function (c) {
				var d;
				d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
				var e = d.offset(),
					f = parseInt(d.css("padding-top"), 10),
					g = parseInt(d.css("padding-bottom"), 10);
				e.top -= a(window).scrollTop() - f;
				var h = {
					width: d.width(),
					height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f
				};
				return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h
			}
		}
	});
	var P = "iframe",
		Q = "//about:blank",
		R = function (a) {
			if (b.currTemplate[P]) {
				var c = b.currTemplate[P].find("iframe");
				c.length && (a || (c[0].src = Q), b.isIE8 && c.css("display", a ? "block" : "none"))
			}
		};
	a.magnificPopup.registerModule(P, {
		options: {
			markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
			srcAction: "iframe_src",
			patterns: {
				youtube: {
					index: "youtube.com",
					id: "v=",
					src: "//www.youtube.com/embed/%id%?autoplay=1"
				},
				vimeo: {
					index: "vimeo.com/",
					id: "/",
					src: "//player.vimeo.com/video/%id%?autoplay=1"
				},
				gmaps: {
					index: "//maps.google.",
					src: "%id%&output=embed"
				}
			}
		},
		proto: {
			initIframe: function () {
				b.types.push(P), w("BeforeChange", function (a, b, c) {
					b !== c && (b === P ? R() : c === P && R(!0))
				}), w(h + "." + P, function () {
					R()
				})
			},
			getIframe: function (c, d) {
				var e = c.src,
					f = b.st.iframe;
				a.each(f.patterns, function () {
					return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0
				});
				var g = {};
				return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d
			}
		}
	});
	var S = function (a) {
			var c = b.items.length;
			return a > c - 1 ? a - c : 0 > a ? c + a : a
		},
		T = function (a, b, c) {
			return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c)
		};
	a.magnificPopup.registerModule("gallery", {
		options: {
			enabled: !1,
			arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
			preload: [0, 2],
			navigateByImgClick: !0,
			arrows: !0,
			tPrev: "Previous (Left arrow key)",
			tNext: "Next (Right arrow key)",
			tCounter: "%curr% of %total%"
		},
		proto: {
			initGallery: function () {
				var c = b.st.gallery,
					e = ".mfp-gallery",
					g = Boolean(a.fn.mfpFastClick);
				return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, function () {
					c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function () {
						return b.items.length > 1 ? (b.next(), !1) : void 0
					}), d.on("keydown" + e, function (a) {
						37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next()
					})
				}), w("UpdateStatus" + e, function (a, c) {
					c.text && (c.text = T(c.text, b.currItem.index, b.items.length))
				}), w(l + e, function (a, d, e, f) {
					var g = b.items.length;
					e.counter = g > 1 ? T(c.tCounter, f.index, g) : ""
				}), w("BuildControls" + e, function () {
					if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
						var d = c.arrowMarkup,
							e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s),
							f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s),
							h = g ? "mfpFastClick" : "click";
						e[h](function () {
							b.prev()
						}), f[h](function () {
							b.next()
						}), b.isIE7 && (x("b", e[0], !1, !0), x("a", e[0], !1, !0), x("b", f[0], !1, !0), x("a", f[0], !1, !0)), b.container.append(e.add(f))
					}
				}), w(n + e, function () {
					b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function () {
						b.preloadNearbyImages(), b._preloadTimeout = null
					}, 16)
				}), void w(h + e, function () {
					d.off(e), b.wrap.off("click" + e), b.arrowLeft && g && b.arrowLeft.add(b.arrowRight).destroyMfpFastClick(), b.arrowRight = b.arrowLeft = null
				})) : !1
			},
			next: function () {
				b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML()
			},
			prev: function () {
				b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML()
			},
			goTo: function (a) {
				b.direction = a >= b.index, b.index = a, b.updateItemHTML()
			},
			preloadNearbyImages: function () {
				var a, c = b.st.gallery.preload,
					d = Math.min(c[0], b.items.length),
					e = Math.min(c[1], b.items.length);
				for (a = 1; a <= (b.direction ? e : d); a++) b._preloadItem(b.index + a);
				for (a = 1; a <= (b.direction ? d : e); a++) b._preloadItem(b.index - a)
			},
			_preloadItem: function (c) {
				if (c = S(c), !b.items[c].preloaded) {
					var d = b.items[c];
					d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function () {
						d.hasSize = !0
					}).on("error.mfploader", function () {
						d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d)
					}).attr("src", d.src)), d.preloaded = !0
				}
			}
		}
	});
	var U = "retina";
	a.magnificPopup.registerModule(U, {
			options: {
				replaceSrc: function (a) {
					return a.src.replace(/\.\w+$/, function (a) {
						return "@2x" + a
					})
				},
				ratio: 1
			},
			proto: {
				initRetina: function () {
					if (window.devicePixelRatio > 1) {
						var a = b.st.retina,
							c = a.ratio;
						c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, function (a, b) {
							b.img.css({
								"max-width": b.img[0].naturalWidth / c,
								width: "100%"
							})
						}), w("ElementParse." + U, function (b, d) {
							d.src = a.replaceSrc(d, c)
						}))
					}
				}
			}
		}),
		function () {
			var b = 1e3,
				c = "ontouchstart" in window,
				d = function () {
					v.off("touchmove" + f + " touchend" + f)
				},
				e = "mfpFastClick",
				f = "." + e;
			a.fn.mfpFastClick = function (e) {
				return a(this).each(function () {
					var g, h = a(this);
					if (c) {
						var i, j, k, l, m, n;
						h.on("touchstart" + f, function (a) {
							l = !1, n = 1, m = a.originalEvent ? a.originalEvent.touches[0] : a.touches[0], j = m.clientX, k = m.clientY, v.on("touchmove" + f, function (a) {
								m = a.originalEvent ? a.originalEvent.touches : a.touches, n = m.length, m = m[0], (Math.abs(m.clientX - j) > 10 || Math.abs(m.clientY - k) > 10) && (l = !0, d())
							}).on("touchend" + f, function (a) {
								d(), l || n > 1 || (g = !0, a.preventDefault(), clearTimeout(i), i = setTimeout(function () {
									g = !1
								}, b), e())
							})
						})
					}
					h.on("click" + f, function () {
						g || e()
					})
				})
			}, a.fn.destroyMfpFastClick = function () {
				a(this).off("touchstart" + f + " click" + f), c && v.off("touchmove" + f + " touchend" + f)
			}
		}(), A()
});

/*ajaxchimp*/
(function ($) {
	"use strict";
	$.ajaxChimp = {
		responses: {
			"We have sent you a confirmation email": 0,
			"Please enter a value": 1,
			"An email address must contain a single @": 2,
			"The domain portion of the email address is invalid (the portion after the @: )": 3,
			"The username portion of the email address is invalid (the portion before the @: )": 4,
			"This email address looks fake or invalid. Please enter a real email address": 5
		},
		translations: {
			en: null
		},
		init: function (selector, options) {
			$(selector).ajaxChimp(options)
		}
	};
	$.fn.ajaxChimp = function (options) {
		$(this).each(function (i, elem) {
			var form = $(elem);
			var email = form.find("input[type=email]");
			var label = form.find("label[for=" + email.attr(" id") + "]");
			var settings = $.extend({
				url: form.attr("action"),
				language: "en"
			}, options);
			var url = settings.url.replace("/post?", "/post-json?").concat("&c=?");
			form.attr("novalidate", "true");
			email.attr("name", "EMAIL");
			form.submit(function () {
				var msg;

				function successCallback(resp) {
					if (resp.result === "success") {
						msg = "We have sent you a confirmation email";
						label.removeClass("error").addClass("valid");
						email.removeClass("error").addClass("valid")
					} else {
						email.removeClass("valid").addClass("error");
						label.removeClass("valid").addClass("error");
						var index = -1;
						try {
							var parts = resp.msg.split(" - ", 2);
							if (parts[1] === undefined) {
								msg = resp.msg
							} else {
								var i = parseInt(parts[0], 10);
								if (i.toString() === parts[0]) {
									index = parts[0];
									msg = parts[1]
								} else {
									index = -1;
									msg = resp.msg
								}
							}
						} catch (e) {
							index = -1;
							msg = resp.msg
						}
					}
					if (settings.language !== "en" && $.ajaxChimp.responses[msg] !== undefined && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]) {
						msg = $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]
					}
					label.html(msg);
					label.show(2e3);
					if (settings.callback) {
						settings.callback(resp)
					}
				}
				var data = {};
				var dataArray = form.serializeArray();
				$.each(dataArray, function (index, item) {
					data[item.name] = item.value
				});
				$.ajax({
					url: url,
					data: data,
					success: successCallback,
					dataType: "jsonp",
					error: function (resp, text) {
						console.log("mailchimp ajax submit error: " + text)
					}
				});
				var submitMsg = "Submitting...";
				if (settings.language !== "en" && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language]["submit"]) {
					submitMsg = $.ajaxChimp.translations[settings.language]["submit"]
				}
				label.html(submitMsg).show(2e3);
				return false
			})
		});
		return this
	}
})(jQuery);

/*! jQuery Validation Plugin - v1.15.0 - 2/24/2016
 * http://jqueryvalidation.org/
 * Copyright (c) 2016 Jörn Zaefferer; Licensed MIT */
! function (a) {
	"function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function (a) {
	a.extend(a.fn, {
		validate: function (b) {
			if (!this.length) return void(b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
			var c = a.data(this[0], "validator");
			return c ? c : (this.attr("novalidate", "novalidate"), c = new a.validator(b, this[0]), a.data(this[0], "validator", c), c.settings.onsubmit && (this.on("click.validate", ":submit", function (b) {
				c.settings.submitHandler && (c.submitButton = b.target), a(this).hasClass("cancel") && (c.cancelSubmit = !0), void 0 !== a(this).attr("formnovalidate") && (c.cancelSubmit = !0)
			}), this.on("submit.validate", function (b) {
				function d() {
					var d, e;
					return c.settings.submitHandler ? (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)), e = c.settings.submitHandler.call(c, c.currentForm, b), c.submitButton && d.remove(), void 0 !== e ? e : !1) : !0
				}
				return c.settings.debug && b.preventDefault(), c.cancelSubmit ? (c.cancelSubmit = !1, d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0, !1) : d() : (c.focusInvalid(), !1)
			})), c)
		},
		valid: function () {
			var b, c, d;
			return a(this[0]).is("form") ? b = this.validate().form() : (d = [], b = !0, c = a(this[0].form).validate(), this.each(function () {
				b = c.element(this) && b, b || (d = d.concat(c.errorList))
			}), c.errorList = d), b
		},
		rules: function (b, c) {
			if (this.length) {
				var d, e, f, g, h, i, j = this[0];
				if (b) switch (d = a.data(j.form, "validator").settings, e = d.rules, f = a.validator.staticRules(j), b) {
					case "add":
						a.extend(f, a.validator.normalizeRule(c)), delete f.messages, e[j.name] = f, c.messages && (d.messages[j.name] = a.extend(d.messages[j.name], c.messages));
						break;
					case "remove":
						return c ? (i = {}, a.each(c.split(/\s/), function (b, c) {
							i[c] = f[c], delete f[c], "required" === c && a(j).removeAttr("aria-required")
						}), i) : (delete e[j.name], f)
				}
				return g = a.validator.normalizeRules(a.extend({}, a.validator.classRules(j), a.validator.attributeRules(j), a.validator.dataRules(j), a.validator.staticRules(j)), j), g.required && (h = g.required, delete g.required, g = a.extend({
					required: h
				}, g), a(j).attr("aria-required", "true")), g.remote && (h = g.remote, delete g.remote, g = a.extend(g, {
					remote: h
				})), g
			}
		}
	}), a.extend(a.expr[":"], {
		blank: function (b) {
			return !a.trim("" + a(b).val())
		},
		filled: function (b) {
			var c = a(b).val();
			return null !== c && !!a.trim("" + c)
		},
		unchecked: function (b) {
			return !a(b).prop("checked")
		}
	}), a.validator = function (b, c) {
		this.settings = a.extend(!0, {}, a.validator.defaults, b), this.currentForm = c, this.init()
	}, a.validator.format = function (b, c) {
		return 1 === arguments.length ? function () {
			var c = a.makeArray(arguments);
			return c.unshift(b), a.validator.format.apply(this, c)
		} : void 0 === c ? b : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)), c.constructor !== Array && (c = [c]), a.each(c, function (a, c) {
			b = b.replace(new RegExp("\\{" + a + "\\}", "g"), function () {
				return c
			})
		}), b)
	}, a.extend(a.validator, {
		defaults: {
			messages: {},
			groups: {},
			rules: {},
			errorClass: "error",
			pendingClass: "pending",
			validClass: "valid",
			errorElement: "label",
			focusCleanup: !1,
			focusInvalid: !0,
			errorContainer: a([]),
			errorLabelContainer: a([]),
			onsubmit: !0,
			ignore: ":hidden",
			ignoreTitle: !1,
			onfocusin: function (a) {
				this.lastActive = a, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(a)))
			},
			onfocusout: function (a) {
				this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a)
			},
			onkeyup: function (b, c) {
				var d = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
				9 === c.which && "" === this.elementValue(b) || -1 !== a.inArray(c.keyCode, d) || (b.name in this.submitted || b.name in this.invalid) && this.element(b)
			},
			onclick: function (a) {
				a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
			},
			highlight: function (b, c, d) {
				"radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
			},
			unhighlight: function (b, c, d) {
				"radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
			}
		},
		setDefaults: function (b) {
			a.extend(a.validator.defaults, b)
		},
		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date ( ISO ).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			equalTo: "Please enter the same value again.",
			maxlength: a.validator.format("Please enter no more than {0} characters."),
			minlength: a.validator.format("Please enter at least {0} characters."),
			rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
			range: a.validator.format("Please enter a value between {0} and {1}."),
			max: a.validator.format("Please enter a value less than or equal to {0}."),
			min: a.validator.format("Please enter a value greater than or equal to {0}."),
			step: a.validator.format("Please enter a multiple of {0}.")
		},
		autoCreateRanges: !1,
		prototype: {
			init: function () {
				function b(b) {
					var c = a.data(this.form, "validator"),
						d = "on" + b.type.replace(/^validate/, ""),
						e = c.settings;
					e[d] && !a(this).is(e.ignore) && e[d].call(c, this, b)
				}
				this.labelContainer = a(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm), this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
				var c, d = this.groups = {};
				a.each(this.settings.groups, function (b, c) {
					"string" == typeof c && (c = c.split(/\s/)), a.each(c, function (a, c) {
						d[c] = b
					})
				}), c = this.settings.rules, a.each(c, function (b, d) {
					c[b] = a.validator.normalizeRule(d)
				}), a(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable]", b).on("click.validate", "select, option, [type='radio'], [type='checkbox']", b), this.settings.invalidHandler && a(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler), a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
			},
			form: function () {
				return this.checkForm(), a.extend(this.submitted, this.errorMap), this.invalid = a.extend({}, this.errorMap), this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
			},
			checkForm: function () {
				this.prepareForm();
				for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++) this.check(b[a]);
				return this.valid()
			},
			element: function (b) {
				var c, d, e = this.clean(b),
					f = this.validationTargetFor(e),
					g = this,
					h = !0;
				return void 0 === f ? delete this.invalid[e.name] : (this.prepareElement(f), this.currentElements = a(f), d = this.groups[f.name], d && a.each(this.groups, function (a, b) {
					b === d && a !== f.name && (e = g.validationTargetFor(g.clean(g.findByName(a))), e && e.name in g.invalid && (g.currentElements.push(e), h = h && g.check(e)))
				}), c = this.check(f) !== !1, h = h && c, c ? this.invalid[f.name] = !1 : this.invalid[f.name] = !0, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), a(b).attr("aria-invalid", !c)), h
			},
			showErrors: function (b) {
				if (b) {
					var c = this;
					a.extend(this.errorMap, b), this.errorList = a.map(this.errorMap, function (a, b) {
						return {
							message: a,
							element: c.findByName(b)[0]
						}
					}), this.successList = a.grep(this.successList, function (a) {
						return !(a.name in b)
					})
				}
				this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
			},
			resetForm: function () {
				a.fn.resetForm && a(this.currentForm).resetForm(), this.invalid = {}, this.submitted = {}, this.prepareForm(), this.hideErrors();
				var b = this.elements().removeData("previousValue").removeAttr("aria-invalid");
				this.resetElements(b)
			},
			resetElements: function (a) {
				var b;
				if (this.settings.unhighlight)
					for (b = 0; a[b]; b++) this.settings.unhighlight.call(this, a[b], this.settings.errorClass, ""), this.findByName(a[b].name).removeClass(this.settings.validClass);
				else a.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
			},
			numberOfInvalids: function () {
				return this.objectLength(this.invalid)
			},
			objectLength: function (a) {
				var b, c = 0;
				for (b in a) a[b] && c++;
				return c
			},
			hideErrors: function () {
				this.hideThese(this.toHide)
			},
			hideThese: function (a) {
				a.not(this.containers).text(""), this.addWrapper(a).hide()
			},
			valid: function () {
				return 0 === this.size()
			},
			size: function () {
				return this.errorList.length
			},
			focusInvalid: function () {
				if (this.settings.focusInvalid) try {
					a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
				} catch (b) {}
			},
			findLastActive: function () {
				var b = this.lastActive;
				return b && 1 === a.grep(this.errorList, function (a) {
					return a.element.name === b.name
				}).length && b
			},
			elements: function () {
				var b = this,
					c = {};
				return a(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function () {
					var d = this.name || a(this).attr("name");
					return !d && b.settings.debug && window.console && console.error("%o has no name assigned", this), this.hasAttribute("contenteditable") && (this.form = a(this).closest("form")[0]), d in c || !b.objectLength(a(this).rules()) ? !1 : (c[d] = !0, !0)
				})
			},
			clean: function (b) {
				return a(b)[0]
			},
			errors: function () {
				var b = this.settings.errorClass.split(" ").join(".");
				return a(this.settings.errorElement + "." + b, this.errorContext)
			},
			resetInternals: function () {
				this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = a([]), this.toHide = a([])
			},
			reset: function () {
				this.resetInternals(), this.currentElements = a([])
			},
			prepareForm: function () {
				this.reset(), this.toHide = this.errors().add(this.containers)
			},
			prepareElement: function (a) {
				this.reset(), this.toHide = this.errorsFor(a)
			},
			elementValue: function (b) {
				var c, d, e = a(b),
					f = b.type;
				return "radio" === f || "checkbox" === f ? this.findByName(b.name).filter(":checked").val() : "number" === f && "undefined" != typeof b.validity ? b.validity.badInput ? "NaN" : e.val() : (c = b.hasAttribute("contenteditable") ? e.text() : e.val(), "file" === f ? "C:\\fakepath\\" === c.substr(0, 12) ? c.substr(12) : (d = c.lastIndexOf("/"), d >= 0 ? c.substr(d + 1) : (d = c.lastIndexOf("\\"), d >= 0 ? c.substr(d + 1) : c)) : "string" == typeof c ? c.replace(/\r/g, "") : c)
			},
			check: function (b) {
				b = this.validationTargetFor(this.clean(b));
				var c, d, e, f = a(b).rules(),
					g = a.map(f, function (a, b) {
						return b
					}).length,
					h = !1,
					i = this.elementValue(b);
				if ("function" == typeof f.normalizer) {
					if (i = f.normalizer.call(b, i), "string" != typeof i) throw new TypeError("The normalizer should return a string value.");
					delete f.normalizer
				}
				for (d in f) {
					e = {
						method: d,
						parameters: f[d]
					};
					try {
						if (c = a.validator.methods[d].call(this, i, b, e.parameters), "dependency-mismatch" === c && 1 === g) {
							h = !0;
							continue
						}
						if (h = !1, "pending" === c) return void(this.toHide = this.toHide.not(this.errorsFor(b)));
						if (!c) return this.formatAndAdd(b, e), !1
					} catch (j) {
						throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + e.method + "' method.", j), j instanceof TypeError && (j.message += ".  Exception occurred when checking element " + b.id + ", check the '" + e.method + "' method."), j
					}
				}
				if (!h) return this.objectLength(f) && this.successList.push(b), !0
			},
			customDataMessage: function (b, c) {
				return a(b).data("msg" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()) || a(b).data("msg")
			},
			customMessage: function (a, b) {
				var c = this.settings.messages[a];
				return c && (c.constructor === String ? c : c[b])
			},
			findDefined: function () {
				for (var a = 0; a < arguments.length; a++)
					if (void 0 !== arguments[a]) return arguments[a]
			},
			defaultMessage: function (b, c) {
				var d = this.findDefined(this.customMessage(b.name, c.method), this.customDataMessage(b, c.method), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c.method], "<strong>Warning: No message defined for " + b.name + "</strong>"),
					e = /\$?\{(\d+)\}/g;
				return "function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)), d
			},
			formatAndAdd: function (a, b) {
				var c = this.defaultMessage(a, b);
				this.errorList.push({
					message: c,
					element: a,
					method: b.method
				}), this.errorMap[a.name] = c, this.submitted[a.name] = c
			},
			addWrapper: function (a) {
				return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))), a
			},
			defaultShowErrors: function () {
				var a, b, c;
				for (a = 0; this.errorList[a]; a++) c = this.errorList[a], this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass), this.showLabel(c.element, c.message);
				if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
					for (a = 0; this.successList[a]; a++) this.showLabel(this.successList[a]);
				if (this.settings.unhighlight)
					for (a = 0, b = this.validElements(); b[a]; a++) this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass);
				this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
			},
			validElements: function () {
				return this.currentElements.not(this.invalidElements())
			},
			invalidElements: function () {
				return a(this.errorList).map(function () {
					return this.element
				})
			},
			showLabel: function (b, c) {
				var d, e, f, g, h = this.errorsFor(b),
					i = this.idOrName(b),
					j = a(b).attr("aria-describedby");
				h.length ? (h.removeClass(this.settings.validClass).addClass(this.settings.errorClass), h.html(c)) : (h = a("<" + this.settings.errorElement + ">").attr("id", i + "-error").addClass(this.settings.errorClass).html(c || ""), d = h, this.settings.wrapper && (d = h.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(d) : this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b), h.is("label") ? h.attr("for", i) : 0 === h.parents("label[for='" + this.escapeCssMeta(i) + "']").length && (f = h.attr("id"), j ? j.match(new RegExp("\\b" + this.escapeCssMeta(f) + "\\b")) || (j += " " + f) : j = f, a(b).attr("aria-describedby", j), e = this.groups[b.name], e && (g = this, a.each(g.groups, function (b, c) {
					c === e && a("[name='" + g.escapeCssMeta(b) + "']", g.currentForm).attr("aria-describedby", h.attr("id"))
				})))), !c && this.settings.success && (h.text(""), "string" == typeof this.settings.success ? h.addClass(this.settings.success) : this.settings.success(h, b)), this.toShow = this.toShow.add(h)
			},
			errorsFor: function (b) {
				var c = this.escapeCssMeta(this.idOrName(b)),
					d = a(b).attr("aria-describedby"),
					e = "label[for='" + c + "'], label[for='" + c + "'] *";
				return d && (e = e + ", #" + this.escapeCssMeta(d).replace(/\s+/g, ", #")), this.errors().filter(e)
			},
			escapeCssMeta: function (a) {
				return a.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1")
			},
			idOrName: function (a) {
				return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
			},
			validationTargetFor: function (b) {
				return this.checkable(b) && (b = this.findByName(b.name)), a(b).not(this.settings.ignore)[0]
			},
			checkable: function (a) {
				return /radio|checkbox/i.test(a.type)
			},
			findByName: function (b) {
				return a(this.currentForm).find("[name='" + this.escapeCssMeta(b) + "']")
			},
			getLength: function (b, c) {
				switch (c.nodeName.toLowerCase()) {
					case "select":
						return a("option:selected", c).length;
					case "input":
						if (this.checkable(c)) return this.findByName(c.name).filter(":checked").length
				}
				return b.length
			},
			depend: function (a, b) {
				return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0
			},
			dependTypes: {
				"boolean": function (a) {
					return a
				},
				string: function (b, c) {
					return !!a(b, c.form).length
				},
				"function": function (a, b) {
					return a(b)
				}
			},
			optional: function (b) {
				var c = this.elementValue(b);
				return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch"
			},
			startRequest: function (b) {
				this.pending[b.name] || (this.pendingRequest++, a(b).addClass(this.settings.pendingClass), this.pending[b.name] = !0)
			},
			stopRequest: function (b, c) {
				this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[b.name], a(b).removeClass(this.settings.pendingClass), c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(), this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
			},
			previousValue: function (b, c) {
				return a.data(b, "previousValue") || a.data(b, "previousValue", {
					old: null,
					valid: !0,
					message: this.defaultMessage(b, {
						method: c
					})
				})
			},
			destroy: function () {
				this.resetForm(), a(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")
			}
		},
		classRuleSettings: {
			required: {
				required: !0
			},
			email: {
				email: !0
			},
			url: {
				url: !0
			},
			date: {
				date: !0
			},
			dateISO: {
				dateISO: !0
			},
			number: {
				number: !0
			},
			digits: {
				digits: !0
			},
			creditcard: {
				creditcard: !0
			}
		},
		addClassRules: function (b, c) {
			b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
		},
		classRules: function (b) {
			var c = {},
				d = a(b).attr("class");
			return d && a.each(d.split(" "), function () {
				this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
			}), c
		},
		normalizeAttributeRule: function (a, b, c, d) {
			/min|max|step/.test(c) && (null === b || /number|range|text/.test(b)) && (d = Number(d), isNaN(d) && (d = void 0)), d || 0 === d ? a[c] = d : b === c && "range" !== b && (a[c] = !0)
		},
		attributeRules: function (b) {
			var c, d, e = {},
				f = a(b),
				g = b.getAttribute("type");
			for (c in a.validator.methods) "required" === c ? (d = b.getAttribute(c), "" === d && (d = !0), d = !!d) : d = f.attr(c), this.normalizeAttributeRule(e, g, c, d);
			return e.maxlength && /-1|2147483647|524288/.test(e.maxlength) && delete e.maxlength, e
		},
		dataRules: function (b) {
			var c, d, e = {},
				f = a(b),
				g = b.getAttribute("type");
			for (c in a.validator.methods) d = f.data("rule" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()), this.normalizeAttributeRule(e, g, c, d);
			return e
		},
		staticRules: function (b) {
			var c = {},
				d = a.data(b.form, "validator");
			return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}), c
		},
		normalizeRules: function (b, c) {
			return a.each(b, function (d, e) {
				if (e === !1) return void delete b[d];
				if (e.param || e.depends) {
					var f = !0;
					switch (typeof e.depends) {
						case "string":
							f = !!a(e.depends, c.form).length;
							break;
						case "function":
							f = e.depends.call(c, c)
					}
					f ? b[d] = void 0 !== e.param ? e.param : !0 : (a.data(c.form, "validator").resetElements(a(c)), delete b[d])
				}
			}), a.each(b, function (d, e) {
				b[d] = a.isFunction(e) && "normalizer" !== d ? e(c) : e
			}), a.each(["minlength", "maxlength"], function () {
				b[this] && (b[this] = Number(b[this]))
			}), a.each(["rangelength", "range"], function () {
				var c;
				b[this] && (a.isArray(b[this]) ? b[this] = [Number(b[this][0]), Number(b[this][1])] : "string" == typeof b[this] && (c = b[this].replace(/[\[\]]/g, "").split(/[\s,]+/), b[this] = [Number(c[0]), Number(c[1])]))
			}), a.validator.autoCreateRanges && (null != b.min && null != b.max && (b.range = [b.min, b.max], delete b.min, delete b.max), null != b.minlength && null != b.maxlength && (b.rangelength = [b.minlength, b.maxlength], delete b.minlength, delete b.maxlength)), b
		},
		normalizeRule: function (b) {
			if ("string" == typeof b) {
				var c = {};
				a.each(b.split(/\s/), function () {
					c[this] = !0
				}), b = c
			}
			return b
		},
		addMethod: function (b, c, d) {
			a.validator.methods[b] = c, a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b], c.length < 3 && a.validator.addClassRules(b, a.validator.normalizeRule(b))
		},
		methods: {
			required: function (b, c, d) {
				if (!this.depend(d, c)) return "dependency-mismatch";
				if ("select" === c.nodeName.toLowerCase()) {
					var e = a(c).val();
					return e && e.length > 0
				}
				return this.checkable(c) ? this.getLength(b, c) > 0 : b.length > 0
			},
			email: function (a, b) {
				return this.optional(b) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)
			},
			url: function (a, b) {
				return this.optional(b) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(a)
			},
			date: function (a, b) {
				return this.optional(b) || !/Invalid|NaN/.test(new Date(a).toString())
			},
			dateISO: function (a, b) {
				return this.optional(b) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)
			},
			number: function (a, b) {
				return this.optional(b) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)
			},
			digits: function (a, b) {
				return this.optional(b) || /^\d+$/.test(a)
			},
			minlength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(b, c);
				return this.optional(c) || e >= d
			},
			maxlength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(b, c);
				return this.optional(c) || d >= e
			},
			rangelength: function (b, c, d) {
				var e = a.isArray(b) ? b.length : this.getLength(b, c);
				return this.optional(c) || e >= d[0] && e <= d[1]
			},
			min: function (a, b, c) {
				return this.optional(b) || a >= c
			},
			max: function (a, b, c) {
				return this.optional(b) || c >= a
			},
			range: function (a, b, c) {
				return this.optional(b) || a >= c[0] && a <= c[1]
			},
			step: function (b, c, d) {
				var e = a(c).attr("type"),
					f = "Step attribute on input type " + e + " is not supported.",
					g = ["text", "number", "range"],
					h = new RegExp("\\b" + e + "\\b"),
					i = e && !h.test(g.join());
				if (i) throw new Error(f);
				return this.optional(c) || b % d === 0
			},
			equalTo: function (b, c, d) {
				var e = a(d);
				return this.settings.onfocusout && e.not(".validate-equalTo-blur").length && e.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
					a(c).valid()
				}), b === e.val()
			},
			remote: function (b, c, d, e) {
				if (this.optional(c)) return "dependency-mismatch";
				e = "string" == typeof e && e || "remote";
				var f, g, h, i = this.previousValue(c, e);
				return this.settings.messages[c.name] || (this.settings.messages[c.name] = {}), i.originalMessage = i.originalMessage || this.settings.messages[c.name][e], this.settings.messages[c.name][e] = i.message, d = "string" == typeof d && {
					url: d
				} || d, h = a.param(a.extend({
					data: b
				}, d.data)), i.old === h ? i.valid : (i.old = h, f = this, this.startRequest(c), g = {}, g[c.name] = b, a.ajax(a.extend(!0, {
					mode: "abort",
					port: "validate" + c.name,
					dataType: "json",
					data: g,
					context: f.currentForm,
					success: function (a) {
						var d, g, h, j = a === !0 || "true" === a;
						f.settings.messages[c.name][e] = i.originalMessage, j ? (h = f.formSubmitted, f.resetInternals(), f.toHide = f.errorsFor(c), f.formSubmitted = h, f.successList.push(c), f.invalid[c.name] = !1, f.showErrors()) : (d = {}, g = a || f.defaultMessage(c, {
							method: e,
							parameters: b
						}), d[c.name] = i.message = g, f.invalid[c.name] = !0, f.showErrors(d)), i.valid = j, f.stopRequest(c, j)
					}
				}, d)), "pending")
			}
		}
	});
	var b, c = {};
	a.ajaxPrefilter ? a.ajaxPrefilter(function (a, b, d) {
		var e = a.port;
		"abort" === a.mode && (c[e] && c[e].abort(), c[e] = d)
	}) : (b = a.ajax, a.ajax = function (d) {
		var e = ("mode" in d ? d : a.ajaxSettings).mode,
			f = ("port" in d ? d : a.ajaxSettings).port;
		return "abort" === e ? (c[f] && c[f].abort(), c[f] = b.apply(this, arguments), c[f]) : b.apply(this, arguments)
	})
});
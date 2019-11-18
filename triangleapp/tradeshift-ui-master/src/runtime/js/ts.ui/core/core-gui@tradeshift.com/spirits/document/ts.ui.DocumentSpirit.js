/**
 * Spirit of the HTML element.
 * @extends {gui.DocumentSpirit} and not {ts.ui.Spirit}
 * @using {gui.Client} Client
 */
ts.ui.DocumentSpirit = (function using(Client) {
	/*
	 * These don't do anything in the New Chrome, should they?
	 *
	var APP_LOADING = ts.ui.BROADCAST_GLOBAL_APP_LOADING;
	var APP_ABORTED = ts.ui.BROADCAST_GLOBAL_APP_ABORTED;
	var APP_COMPLETE = ts.ui.BROADCAST_GLOBAL_APP_COMPLETE;
	*/
	return gui.DocumentSpirit.extend({
		/**
		 * Kickstart the plugins that manage layout, asides and dialogs.
		 * Prepare to parse global models posted from the parent frame.
		 * Setup to change location hash if and when the chrome says to.
		 */
		onconstruct: function() {
			this.super.onconstruct();
			this.layoutplugin.managelayout();
			this.dialogplugin.managedialogs();
			this.asideplugin.manageasides();
			this.input.connect(ts.ui.LayoutModel);
			// TODO: Either deprecate these things or support them in The New Chrome
			// this.broadcast.addGlobal([APP_LOADING, APP_ABORTED, APP_COMPLETE]);
			this.action
				.add([ts.ui.ACTION_HEADER_LEVEL, ts.ui.ACTION_FOOTER_LEVEL])
				.addGlobal([
					// ts.ui.ACTION_GLOBAL_MODELS_INITIALIZE,
					ts.ui.ACTION_GLOBAL_LOCATION_CHANGEHASH,
					ts.ui.ACTION_GLOBAL_LOCATION_HASHCHANGE
					// ts.ui.ACTION_GLOBAL_COMPLETED,
					// ts.ui.ACTION_GLOBAL_TERMINATE
				])
				.dispatchGlobal(ts.ui.ACTION_GLOBAL_DOCUMENT_TITLE, document.title);
		},

		/**
		 * Modernizr style classnames on the HTML element.
		 */
		onconfigure: function() {
			this.super.onconfigure();
			this.css
				.add('ts-engine-' + Client.agent)
				.shift(gui.hosted, 'ts-iframe-hosted')
				.shift(Client.isExplorer9, 'ts-engine-explorer9')
				.shift(Client.isTouchDevice, 'ts-device-touch')
				.shift(!Client.isTouchDevice, 'ts-device-mouse')
				.shift(!!Client.scrollBarSize, 'ts-scrollbars-on')
				.shift(!Client.scrollBarSize, 'ts-scrollbars-off');
		},

		/**
		 * This classname will show everything. It's all been hidden
		 * until now to avoid the "flash on non-spiritualized content"
		 * (so it's essentially a Runtime equivalent to `ng-cloak`).
		 */
		onready: function() {
			this.super.onready();
			this.css.add(ts.ui.CLASS_READY);
			this.broadcast.dispatch(ts.ui.BROADCAST_COMPLETED);
		},

		/**
		 * Handle action.
		 * @param {gui.Action} a
		 */
		onaction: function(a) {
			this.super.onaction(a);
			a.consume();
			switch (a.type) {
				// request to change location hash descending from the hosting frame
				case ts.ui.ACTION_GLOBAL_LOCATION_CHANGEHASH:
					ts.lib.Location.assign(a.data);
					break;
				// header initialized or changed height
				case ts.ui.ACTION_HEADER_LEVEL:
					this.guilayout.gotoLevel(a.data, 'ts-header-level');
					break;
				// footer initialized or changed height
				case ts.ui.ACTION_FOOTER_LEVEL:
					this.guilayout.gotoLevel(a.data, 'ts-footer-level');
					break;
			}
		},

		/**
		 * Handle the {ts.ui.LayoutModel}.
		 * @param {edb.Input} input
		 */
		oninput: function(input) {
			this.super.oninput(input);
			var model = input.data;
			switch (input.type) {
				case ts.ui.LayoutModel:
					this._breakpoints(model.breakpoints);
					this._breakpoint(model.breakpoint);
					model.addObserver(this);
					break;
			}
		},

		/**
		 * Model changed something.
		 * @param {Array<edb.Change>} changes
		 */
		onchange: function(changes) {
			this.super.onchange(changes);
			changes.forEach(function(c) {
				this._onmodelchange(c.object, c.name, c.newValue, c.oldValue);
			}, this);
		},

		/**
		 * This will crawl the document on window resize and
		 * invoke the `onflex` method on all spirits, but we
		 * make sure that the breakpoints are resolved first.
		 * @overwrites {gui.DocumentSpirit#reflex}
		 */
		reflex: function() {
			this.tick.time(function waitforbreakpoint2resolve() {
				this.super.reflex();
			});
		},

		/**
		 * @param {boolean} on
		 * @param {string|Array<string>} classnames
		 */
		shiftclassnames: function(on, cnames) {
			this.layoutplugin.shiftclassnames(!!on, gui.Array.make(cnames));
		},

		// Private .................................................................

		/**
		 * Output models in this window scope by recreating
		 * them from JSON posted by the hosting iframespirit.
		 * NOTE: Migrating models have been disabled for now!
		 * @see {ts.ui.FrameSpirit#_mapmodels}
		 * @param {Map.<String|object>} models
		 */
		_outputmodels: function(models) {
			gui.Object.each(
				models,
				function(name, json) {
					var Model = gui.Object.lookup(name);
					Model.syncGlobal(json).output();
				},
				this
			);
		},

		/**
		 * Model changed something.
		 * @param {edb.Object} model
		 * @param {string} prop
		 * @param {object} newval
		 * @param {object} oldval
		 */
		_onmodelchange: function(model, prop, newval, oldval) {
			switch (model.constructor) {
				case ts.ui.LayoutModel:
					this._onlayoutchange(prop, newval, oldval);
					break;
			}
		},

		/**
		 * Layout model changed.
		 * @param {string} prop
		 * @param {object} newval
		 * @param {object} oldval
		 */
		_onlayoutchange: function(prop, newval, oldval) {
			switch (prop) {
				case 'breakpoints':
					this._breakpoints(newval, oldval);
					break;
				case 'breakpoint':
					this._breakpoint(newval, oldval);
					break;
				case 'menuopen':
					this.css.shift(newval, 'ts-menu-open');
					break;
			}
		},

		/**
		 * Update classname for current breakpoint, then
		 * dispatch an custom event for anyone to handle.
		 * @param {string} newpoint
		 * @param {string=} opt_oldpoint
		 */
		_breakpoint: function(newpoint, opt_oldpoint) {
			function fix(p) {
				return 'ts-' + p + '-only';
			}
			this.css.remove('ts-mobile-only ts-tablet-only ts-desktop-only');
			this.css.add(fix(newpoint));
			this.event.dispatch('ts-breakpoint', { bubbles: true });
		},

		/**
		 * Update classname for derived breakpoints.
		 * @param {Array.<string>} newpoints
		 * @param {Array.<string>=} opt_oldpoints
		 */
		_breakpoints: function(newpoints, opt_oldpoints) {
			var css = this.css;
			function fix(p) {
				return 'ts-' + p;
			}
			(opt_oldpoints || []).forEach(function(val) {
				css.remove(fix(val));
			});
			newpoints.forEach(function(val) {
				css.add(fix(val));
			});
		}
	});
})(gui.Client);

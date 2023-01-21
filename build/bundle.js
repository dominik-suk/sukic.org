
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Button.svelte generated by Svelte v3.55.1 */

    const file$2 = "src\\Button.svelte";

    function create_fragment$2(ctx) {
    	let button;
    	let span;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-94izff");
    			add_location(span, file$2, 12, 55, 427);
    			attr_dev(button, "class", "custom-btn btn-3 svelte-94izff");
    			add_location(button, file$2, 12, 4, 376);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let darkmode = false;

    	function toggle() {
    		darkmode = !darkmode;
    		window.document.body.classList.toggle('dark-mode');

    		if (darkmode) {
    			document.getElementById("logo").src = "images/logo_darkmode.png";
    		} else {
    			document.getElementById("logo").src = "images/logo.png";
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ darkmode, toggle });

    	$$self.$inject_state = $$props => {
    		if ('darkmode' in $$props) darkmode = $$props.darkmode;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [toggle, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const defer = () => {
        var res, rej;

        var promise = new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        });

        promise.resolve = res;
        promise.reject = rej;

        return promise;
    };

    const browser$1 = (() => {
        return typeof window === "object" && typeof window.document === "object";
    })();

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /**
     * Helpers.
     */
    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    var ms = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse(val);
      } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'weeks':
        case 'week':
        case 'w':
          return n * w;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
      }
      return ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
    }

    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     */

    function setup(env) {
    	createDebug.debug = createDebug;
    	createDebug.default = createDebug;
    	createDebug.coerce = coerce;
    	createDebug.disable = disable;
    	createDebug.enable = enable;
    	createDebug.enabled = enabled;
    	createDebug.humanize = ms;
    	createDebug.destroy = destroy;

    	Object.keys(env).forEach(key => {
    		createDebug[key] = env[key];
    	});

    	/**
    	* The currently active debug mode names, and names to skip.
    	*/

    	createDebug.names = [];
    	createDebug.skips = [];

    	/**
    	* Map of special "%n" handling functions, for the debug "format" argument.
    	*
    	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
    	*/
    	createDebug.formatters = {};

    	/**
    	* Selects a color for a debug namespace
    	* @param {String} namespace The namespace string for the debug instance to be colored
    	* @return {Number|String} An ANSI color code for the given namespace
    	* @api private
    	*/
    	function selectColor(namespace) {
    		let hash = 0;

    		for (let i = 0; i < namespace.length; i++) {
    			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
    			hash |= 0; // Convert to 32bit integer
    		}

    		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    	}
    	createDebug.selectColor = selectColor;

    	/**
    	* Create a debugger with the given `namespace`.
    	*
    	* @param {String} namespace
    	* @return {Function}
    	* @api public
    	*/
    	function createDebug(namespace) {
    		let prevTime;
    		let enableOverride = null;
    		let namespacesCache;
    		let enabledCache;

    		function debug(...args) {
    			// Disabled?
    			if (!debug.enabled) {
    				return;
    			}

    			const self = debug;

    			// Set `diff` timestamp
    			const curr = Number(new Date());
    			const ms = curr - (prevTime || curr);
    			self.diff = ms;
    			self.prev = prevTime;
    			self.curr = curr;
    			prevTime = curr;

    			args[0] = createDebug.coerce(args[0]);

    			if (typeof args[0] !== 'string') {
    				// Anything else let's inspect with %O
    				args.unshift('%O');
    			}

    			// Apply any `formatters` transformations
    			let index = 0;
    			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
    				// If we encounter an escaped % then don't increase the array index
    				if (match === '%%') {
    					return '%';
    				}
    				index++;
    				const formatter = createDebug.formatters[format];
    				if (typeof formatter === 'function') {
    					const val = args[index];
    					match = formatter.call(self, val);

    					// Now we need to remove `args[index]` since it's inlined in the `format`
    					args.splice(index, 1);
    					index--;
    				}
    				return match;
    			});

    			// Apply env-specific formatting (colors, etc.)
    			createDebug.formatArgs.call(self, args);

    			const logFn = self.log || createDebug.log;
    			logFn.apply(self, args);
    		}

    		debug.namespace = namespace;
    		debug.useColors = createDebug.useColors();
    		debug.color = createDebug.selectColor(namespace);
    		debug.extend = extend;
    		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

    		Object.defineProperty(debug, 'enabled', {
    			enumerable: true,
    			configurable: false,
    			get: () => {
    				if (enableOverride !== null) {
    					return enableOverride;
    				}
    				if (namespacesCache !== createDebug.namespaces) {
    					namespacesCache = createDebug.namespaces;
    					enabledCache = createDebug.enabled(namespace);
    				}

    				return enabledCache;
    			},
    			set: v => {
    				enableOverride = v;
    			}
    		});

    		// Env-specific initialization logic for debug instances
    		if (typeof createDebug.init === 'function') {
    			createDebug.init(debug);
    		}

    		return debug;
    	}

    	function extend(namespace, delimiter) {
    		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    		newDebug.log = this.log;
    		return newDebug;
    	}

    	/**
    	* Enables a debug mode by namespaces. This can include modes
    	* separated by a colon and wildcards.
    	*
    	* @param {String} namespaces
    	* @api public
    	*/
    	function enable(namespaces) {
    		createDebug.save(namespaces);
    		createDebug.namespaces = namespaces;

    		createDebug.names = [];
    		createDebug.skips = [];

    		let i;
    		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    		const len = split.length;

    		for (i = 0; i < len; i++) {
    			if (!split[i]) {
    				// ignore empty strings
    				continue;
    			}

    			namespaces = split[i].replace(/\*/g, '.*?');

    			if (namespaces[0] === '-') {
    				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
    			} else {
    				createDebug.names.push(new RegExp('^' + namespaces + '$'));
    			}
    		}
    	}

    	/**
    	* Disable debug output.
    	*
    	* @return {String} namespaces
    	* @api public
    	*/
    	function disable() {
    		const namespaces = [
    			...createDebug.names.map(toNamespace),
    			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
    		].join(',');
    		createDebug.enable('');
    		return namespaces;
    	}

    	/**
    	* Returns true if the given mode name is enabled, false otherwise.
    	*
    	* @param {String} name
    	* @return {Boolean}
    	* @api public
    	*/
    	function enabled(name) {
    		if (name[name.length - 1] === '*') {
    			return true;
    		}

    		let i;
    		let len;

    		for (i = 0, len = createDebug.skips.length; i < len; i++) {
    			if (createDebug.skips[i].test(name)) {
    				return false;
    			}
    		}

    		for (i = 0, len = createDebug.names.length; i < len; i++) {
    			if (createDebug.names[i].test(name)) {
    				return true;
    			}
    		}

    		return false;
    	}

    	/**
    	* Convert regexp to namespace
    	*
    	* @param {RegExp} regxep
    	* @return {String} namespace
    	* @api private
    	*/
    	function toNamespace(regexp) {
    		return regexp.toString()
    			.substring(2, regexp.toString().length - 2)
    			.replace(/\.\*\?$/, '*');
    	}

    	/**
    	* Coerce `val`.
    	*
    	* @param {Mixed} val
    	* @return {Mixed}
    	* @api private
    	*/
    	function coerce(val) {
    		if (val instanceof Error) {
    			return val.stack || val.message;
    		}
    		return val;
    	}

    	/**
    	* XXX DO NOT USE. This is a temporary stub function.
    	* XXX It WILL be removed in the next major release.
    	*/
    	function destroy() {
    		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    	}

    	createDebug.enable(createDebug.load());

    	return createDebug;
    }

    var common = setup;

    /* eslint-env browser */

    var browser = createCommonjsModule(function (module, exports) {
    /**
     * This is the web browser implementation of `debug()`.
     */

    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
    	let warned = false;

    	return () => {
    		if (!warned) {
    			warned = true;
    			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    		}
    	};
    })();

    /**
     * Colors.
     */

    exports.colors = [
    	'#0000CC',
    	'#0000FF',
    	'#0033CC',
    	'#0033FF',
    	'#0066CC',
    	'#0066FF',
    	'#0099CC',
    	'#0099FF',
    	'#00CC00',
    	'#00CC33',
    	'#00CC66',
    	'#00CC99',
    	'#00CCCC',
    	'#00CCFF',
    	'#3300CC',
    	'#3300FF',
    	'#3333CC',
    	'#3333FF',
    	'#3366CC',
    	'#3366FF',
    	'#3399CC',
    	'#3399FF',
    	'#33CC00',
    	'#33CC33',
    	'#33CC66',
    	'#33CC99',
    	'#33CCCC',
    	'#33CCFF',
    	'#6600CC',
    	'#6600FF',
    	'#6633CC',
    	'#6633FF',
    	'#66CC00',
    	'#66CC33',
    	'#9900CC',
    	'#9900FF',
    	'#9933CC',
    	'#9933FF',
    	'#99CC00',
    	'#99CC33',
    	'#CC0000',
    	'#CC0033',
    	'#CC0066',
    	'#CC0099',
    	'#CC00CC',
    	'#CC00FF',
    	'#CC3300',
    	'#CC3333',
    	'#CC3366',
    	'#CC3399',
    	'#CC33CC',
    	'#CC33FF',
    	'#CC6600',
    	'#CC6633',
    	'#CC9900',
    	'#CC9933',
    	'#CCCC00',
    	'#CCCC33',
    	'#FF0000',
    	'#FF0033',
    	'#FF0066',
    	'#FF0099',
    	'#FF00CC',
    	'#FF00FF',
    	'#FF3300',
    	'#FF3333',
    	'#FF3366',
    	'#FF3399',
    	'#FF33CC',
    	'#FF33FF',
    	'#FF6600',
    	'#FF6633',
    	'#FF9900',
    	'#FF9933',
    	'#FFCC00',
    	'#FFCC33'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    // eslint-disable-next-line complexity
    function useColors() {
    	// NB: In an Electron preload script, document will be defined but not fully
    	// initialized. Since we know we're in Chrome, we'll just detect this case
    	// explicitly
    	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    		return true;
    	}

    	// Internet Explorer and Edge do not support colors.
    	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    		return false;
    	}

    	// Is webkit? http://stackoverflow.com/a/16459606/376773
    	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    		// Is firebug? http://stackoverflow.com/a/398120/376773
    		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    		// Is firefox >= v31?
    		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    		// Double check webkit in userAgent just in case we are in a worker
    		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
    	args[0] = (this.useColors ? '%c' : '') +
    		this.namespace +
    		(this.useColors ? ' %c' : ' ') +
    		args[0] +
    		(this.useColors ? '%c ' : ' ') +
    		'+' + module.exports.humanize(this.diff);

    	if (!this.useColors) {
    		return;
    	}

    	const c = 'color: ' + this.color;
    	args.splice(1, 0, c, 'color: inherit');

    	// The final "%c" is somewhat tricky, because there could be other
    	// arguments passed either before or after the %c, so we need to
    	// figure out the correct index to insert the CSS into
    	let index = 0;
    	let lastC = 0;
    	args[0].replace(/%[a-zA-Z%]/g, match => {
    		if (match === '%%') {
    			return;
    		}
    		index++;
    		if (match === '%c') {
    			// We only are interested in the *last* %c
    			// (the user may have provided their own)
    			lastC = index;
    		}
    	});

    	args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.debug()` when available.
     * No-op when `console.debug` is not a "function".
     * If `console.debug` is not available, falls back
     * to `console.log`.
     *
     * @api public
     */
    exports.log = console.debug || console.log || (() => {});

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */
    function save(namespaces) {
    	try {
    		if (namespaces) {
    			exports.storage.setItem('debug', namespaces);
    		} else {
    			exports.storage.removeItem('debug');
    		}
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */
    function load() {
    	let r;
    	try {
    		r = exports.storage.getItem('debug');
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}

    	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    	if (!r && typeof process !== 'undefined' && 'env' in process) {
    		r = process.env.DEBUG;
    	}

    	return r;
    }

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
    	try {
    		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    		// The Browser also has localStorage in the global context.
    		return localStorage;
    	} catch (error) {
    		// Swallow
    		// XXX (@Qix-) should we be logging these?
    	}
    }

    module.exports = common(exports);

    const {formatters} = module.exports;

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    formatters.j = function (v) {
    	try {
    		return JSON.stringify(v);
    	} catch (error) {
    		return '[UnexpectedJSONParseError]: ' + error.message;
    	}
    };
    });

    /* ..\..\..\..\..\..\node_modules\.pnpm\svelte-recaptcha-v2@0.0.2\node_modules\svelte-recaptcha-v2\src\Recaptcha.svelte generated by Svelte v3.55.1 */

    const { console: console_1$1 } = globals;
    const file$1 = "..\\..\\..\\..\\..\\..\\node_modules\\.pnpm\\svelte-recaptcha-v2@0.0.2\\node_modules\\svelte-recaptcha-v2\\src\\Recaptcha.svelte";

    function create_fragment$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", "googleRecaptchaDiv");
    			attr_dev(div, "class", "g-recaptcha");
    			add_location(div, file$1, 330, 0, 10340);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let recaptcha;
    let observer = defer();

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recaptcha', slots, []);
    	const dbg = browser("{Recaptcha}");
    	const debug = dbg;
    	const dispatch = createEventDispatcher();
    	let { sitekey } = $$props;
    	let { badge = "top" } = $$props;
    	let { size = "invisible" } = $$props;
    	let { sleepTime = 0 } = $$props;

    	/*wait time before starting injection*/
    	let instanceId = null;

    	/*behold the recaptcha instance*/
    	let retryTimer = null;

    	/*setInterval tracker for captcha*/
    	let wait = null;

    	/*promise to wait*/
    	let recaptchaModal = null;

    	/*div that houses recaptcha iframe*/
    	let iframeSrc = "google.com/recaptcha/api2/bframe";

    	/*src path of google's injected iframe - used with the timer*/
    	let openObserver = null;

    	/*observer tracker*/
    	let closeObserver = null;

    	/*observer tracker*/
    	/*---------------------------------------------| dispatchers |--*/
    	const eventEmitters = {
    		onExpired: async () => {
    			debug("expired?");
    			recaptcha.reset(instanceId);
    		},
    		onError: async err => {
    			const debug = dbg.extend("onError");
    			debug("an error occured during initialization");
    			dispatch("error", { msg: "please check your site key" });
    			captcha.errors.push("empty");
    			recaptcha.reset(instanceId);
    		},
    		onSuccess: async token => {
    			const debug = dbg.extend("onSuccess");
    			debug("dispatching success, we have a token");
    			dispatch("success", { msg: "ok", token });
    			setTimeout(() => recaptcha.reset(instanceId), 1000);
    			debug("resetting, google needs allowed time if visible recaptcha..");
    			observer = defer();
    			debug("resetting observer");
    		},
    		onReady: () => {
    			const debug = dbg.extend("onReady");
    			dispatch("ready");
    			debug("captcha is ready and available in DOM");
    		},
    		onOpen: mutations => {
    			const debug = dbg.extend("onOpen");
    			dispatch("open");
    			debug("captcha decided to ask a challange");
    		},
    		onClose: mutations => {
    			const debug = dbg.extend("onClose");

    			if (browser$1 && mutations.length === 1 && !window.grecaptcha.getResponse()) {
    				debug("captcha window was closed");
    				dispatch("close");
    			} /*
       │close mutation fires twice, probably because
       │of event bubbling or something. we also want
       │to avoid signalling when user solves the captcha.
       */
    		}
    	}; /*
        │these emitters are referenced to google recaptcha so
        │we can track its status through svelte.
        */

    	/*------------------------------------------| event-handlers |--*/
    	const captcha = {
    		ready: false,
    		/*captcha loading state*/
    		errors: [],
    		retryTimer: false,
    		/*setInterval timer to update state*/
    		isLoaded: () => {
    			const debug = dbg.extend("isLoaded");

    			captcha.ready = browser$1 && window && window.grecaptcha && window.grecaptcha.ready && document.getElementsByTagName("iframe").find(x => {
    				return x.src.includes(iframeSrc);
    			})
    			? true
    			: false;

    			debug("captcha.isLoaded(): " + captcha.ready);
    			return captcha.ready;
    		},
    		stopTimer: () => {
    			const debug = dbg.extend("stopTimer");
    			debug("stopping timer");
    			clearInterval(captcha.retryTimer);
    		},
    		startTimer: () => {
    			const debug = dbg.extend("startTimer");
    			debug("check in 1s intervals");

    			captcha.retryTimer = setInterval(
    				() => {
    					debug("checking every second");

    					if (captcha.isLoaded()) {
    						captcha.stopTimer();
    						captcha.modal();
    						captcha.openHandle();
    						captcha.closeHandle();
    						eventEmitters.onReady();
    					}

    					if (captcha.errors.length > 3) {
    						captcha.wipe();
    						debug("too many errors, no recaptcha for you at this  time");
    					}
    				},
    				1000
    			);
    		},
    		modal: () => {
    			const debug = dbg.extend("modal");
    			debug("finding recaptcha iframe");
    			const iframe = document.getElementsByTagName("iframe");

    			recaptchaModal = iframe.find(x => {
    				return x.src.includes(iframeSrc);
    			}).parentNode.parentNode;
    		},
    		openHandle: () => {
    			const debug = dbg.extend("openHandler");
    			debug("adding observer");

    			openObserver = new MutationObserver(x => {
    					return recaptchaModal.style.opacity == 1 && eventEmitters.onOpen(x);
    				});

    			openObserver.observe(recaptchaModal, {
    				attributes: true,
    				attributeFilter: ["style"]
    			});
    		},
    		closeHandle: () => {
    			const debug = dbg.extend("closeHandle");
    			debug("adding observer");

    			closeObserver = new MutationObserver(x => {
    					return recaptchaModal.style.opacity == 0 && eventEmitters.onClose(x);
    				});

    			closeObserver.observe(recaptchaModal, {
    				attributes: true,
    				attributeFilter: ["style"]
    			});
    		},
    		inject: () => {
    			const debug = dbg.extend("inject");
    			debug("initializing API, merging google API to svelte recaptcha");
    			recaptcha = window.grecaptcha;

    			/*
     │associate window component to svelte, this allows us
     │to export grecaptcha methods in parent components.
     */
    			window.grecaptcha.ready(() => {
    				instanceId = grecaptcha.render("googleRecaptchaDiv", {
    					badge,
    					sitekey,
    					"callback": eventEmitters.onSuccess,
    					"expired-callback": eventEmitters.onExpired,
    					"error-callback": eventEmitters.onError,
    					size
    				});
    			});
    		},
    		wipe: () => {
    			const debug = dbg.extend("onDestroy");

    			try {
    				if (browser$1) {
    					clearInterval(captcha.retryTimer);
    					debug("cleaning up clearInterval");

    					if (recaptcha) {
    						recaptcha.reset(instanceId);
    						debug("resetting captcha api");
    						delete window.grecaptcha;
    						delete window.apiLoaded;
    						delete window.recaptchaCloseListener;
    						debug("deleting window.grecaptcha");
    						if (openObserver) openObserver.disconnect();
    						if (closeObserver) closeObserver.disconnect();

    						document.querySelectorAll("script[src*=recaptcha]").forEach(script => {
    							script.remove();
    							debug("deleting google script tag");
    						});

    						document.querySelectorAll("iframe[src*=recaptcha]").forEach(iframe => {
    							iframe.remove();
    							debug("deleting google iframe");
    						});
    					}
    				}
    			} catch(err) {
    				console.log(err.message);
    			} /*
       │extremely important to cleanup our mess, otherwise
       │everytime the component is invoked, a new recaptcha
       │iframe will get instated. Also, with SSR we need to
       │make sure all this stuff is wrapped within browser.
       */
    		}
    	};

    	const apiLoaded = async () => {
    		const debug = dbg.extend("apiLoaded");
    		debug("invoked, resolving deferred promise");
    		wait.resolve(true);
    	};

    	onMount(async () => {
    		const debug = dbg.extend("onMount");
    		if (browser$1) window.apiLoaded = apiLoaded;
    		debug("associate apiLoad to window object");

    		if (sleepTime) {
    			debug("sleeping for a bit before inserting recaptcha script");
    			await sleep(sleepTime);
    		}

    		if (browser$1) {
    			const script = document.createElement("script");
    			script.id = "googleRecaptchaScript";
    			script.src = `https://www.google.com/recaptcha/api.js?render=explicit&sitekey{sitekey}&onload=apiLoaded`;
    			script.async = true;
    			script.defer = true;
    			document.head.appendChild(script);
    		}

    		wait = defer();
    		debug("waiting for google api to finish loading");
    		await Promise.resolve(wait);
    		debug("deferred promise was resolved...");
    		if (browser$1) captcha.inject();
    		debug("injecting captcha code");
    		if (browser$1) HTMLCollection.prototype.find = Array.prototype.find;

    		/*needed to detect iframe for open, close events*/
    		captcha.startTimer();

    		debug("polling for captcha to appear in DOM");
    	});

    	onDestroy(async () => {
    		dbg.extend("onDestroy");
    		captcha.wipe();
    	});

    	const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000)).catch(err => console.log("caught"));

    	$$self.$$.on_mount.push(function () {
    		if (sitekey === undefined && !('sitekey' in $$props || $$self.$$.bound[$$self.$$.props['sitekey']])) {
    			console_1$1.warn("<Recaptcha> was created without expected prop 'sitekey'");
    		}
    	});

    	const writable_props = ['sitekey', 'badge', 'size', 'sleepTime'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Recaptcha> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('sitekey' in $$props) $$invalidate(0, sitekey = $$props.sitekey);
    		if ('badge' in $$props) $$invalidate(1, badge = $$props.badge);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('sleepTime' in $$props) $$invalidate(3, sleepTime = $$props.sleepTime);
    	};

    	$$self.$capture_state = () => ({
    		defer,
    		recaptcha,
    		observer,
    		createEventDispatcher,
    		onMount,
    		onDestroy,
    		createDebug: browser,
    		browser: browser$1,
    		dbg,
    		debug,
    		dispatch,
    		sitekey,
    		badge,
    		size,
    		sleepTime,
    		instanceId,
    		retryTimer,
    		wait,
    		recaptchaModal,
    		iframeSrc,
    		openObserver,
    		closeObserver,
    		eventEmitters,
    		captcha,
    		apiLoaded,
    		sleep
    	});

    	$$self.$inject_state = $$props => {
    		if ('sitekey' in $$props) $$invalidate(0, sitekey = $$props.sitekey);
    		if ('badge' in $$props) $$invalidate(1, badge = $$props.badge);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('sleepTime' in $$props) $$invalidate(3, sleepTime = $$props.sleepTime);
    		if ('instanceId' in $$props) instanceId = $$props.instanceId;
    		if ('retryTimer' in $$props) retryTimer = $$props.retryTimer;
    		if ('wait' in $$props) wait = $$props.wait;
    		if ('recaptchaModal' in $$props) recaptchaModal = $$props.recaptchaModal;
    		if ('iframeSrc' in $$props) iframeSrc = $$props.iframeSrc;
    		if ('openObserver' in $$props) openObserver = $$props.openObserver;
    		if ('closeObserver' in $$props) closeObserver = $$props.closeObserver;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sitekey, badge, size, sleepTime];
    }

    class Recaptcha extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			sitekey: 0,
    			badge: 1,
    			size: 2,
    			sleepTime: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recaptcha",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get sitekey() {
    		throw new Error("<Recaptcha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sitekey(value) {
    		throw new Error("<Recaptcha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get badge() {
    		throw new Error("<Recaptcha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set badge(value) {
    		throw new Error("<Recaptcha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Recaptcha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Recaptcha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sleepTime() {
    		throw new Error("<Recaptcha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sleepTime(value) {
    		throw new Error("<Recaptcha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (99:51) <Button>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Darkmode");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(99:51) <Button>",
    		ctx
    	});

    	return block;
    }

    // (109:1) {#each test as t}
    function create_each_block_2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "TEST";
    			attr_dev(h1, "class", "svelte-1l8xxzw");
    			add_location(h1, file, 109, 2, 2889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(109:1) {#each test as t}",
    		ctx
    	});

    	return block;
    }

    // (113:1) {#each test as t}
    function create_each_block_1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "TEST";
    			attr_dev(h1, "class", "svelte-1l8xxzw");
    			add_location(h1, file, 113, 2, 2966);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(113:1) {#each test as t}",
    		ctx
    	});

    	return block;
    }

    // (117:1) {#each test as t}
    function create_each_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "TEST";
    			attr_dev(h1, "class", "svelte-1l8xxzw");
    			add_location(h1, file, 117, 2, 3047);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(117:1) {#each test as t}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let ul0;
    	let li0;
    	let img;
    	let img_src_value;
    	let t0;
    	let li1;
    	let button0;
    	let t1;
    	let ul1;
    	let li2;
    	let a0;
    	let t3;
    	let li3;
    	let a1;
    	let t5;
    	let li4;
    	let a2;
    	let t7;
    	let li5;
    	let a3;
    	let t9;
    	let t10;
    	let h10;
    	let t12;
    	let t13;
    	let h11;
    	let t15;
    	let t16;
    	let section;
    	let recaptcha_1;
    	let t17;
    	let div0;
    	let h12;
    	let t19;
    	let h2;
    	let t21;
    	let div1;
    	let pre;
    	let t22;
    	let t23_value = JSON.stringify(/*formValues*/ ctx[0], null, 2) + "";
    	let t23;
    	let t24;
    	let t25;
    	let form;
    	let div2;
    	let label0;
    	let t27;
    	let input;
    	let t28;
    	let div3;
    	let label1;
    	let t30;
    	let textarea;
    	let t31;
    	let button1;
    	let t33;
    	let div4;
    	let label2;
    	let t35;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t40;
    	let div5;
    	let label3;
    	let t42;
    	let select1;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_2 = /*test*/ ctx[7];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*test*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*test*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	recaptcha_1 = new Recaptcha({
    			props: {
    				sitekey: googleRecaptchaSiteKey,
    				badge: "top",
    				size: "invisible"
    			},
    			$$inline: true
    		});

    	recaptcha_1.$on("success", /*onCaptchaSuccess*/ ctx[2]);
    	recaptcha_1.$on("error", /*onCaptchaError*/ ctx[3]);
    	recaptcha_1.$on("expired", /*onCaptchaExpire*/ ctx[4]);
    	recaptcha_1.$on("close", /*onCaptchaClose*/ ctx[5]);
    	recaptcha_1.$on("ready", /*onCaptchaReady*/ ctx[1]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			ul0 = element("ul");
    			li0 = element("li");
    			img = element("img");
    			t0 = space();
    			li1 = element("li");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t3 = space();
    			li3 = element("li");
    			a1 = element("a");
    			a1.textContent = "Design";
    			t5 = space();
    			li4 = element("li");
    			a2 = element("a");
    			a2.textContent = "Projects";
    			t7 = space();
    			li5 = element("li");
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t9 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t10 = space();
    			h10 = element("h1");
    			h10.textContent = "Design";
    			t12 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t13 = space();
    			h11 = element("h1");
    			h11.textContent = "Projects";
    			t15 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t16 = space();
    			section = element("section");
    			create_component(recaptcha_1.$$.fragment);
    			t17 = space();
    			div0 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Contact";
    			t19 = space();
    			h2 = element("h2");
    			h2.textContent = "You can send me a message using this form.";
    			t21 = space();
    			div1 = element("div");
    			pre = element("pre");
    			t22 = text("\t\t\t\t");
    			t23 = text(t23_value);
    			t24 = text("\r\n\t\t\t");
    			t25 = space();
    			form = element("form");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t27 = space();
    			input = element("input");
    			t28 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Message";
    			t30 = space();
    			textarea = element("textarea");
    			t31 = space();
    			button1 = element("button");
    			button1.textContent = "Send";
    			t33 = space();
    			div4 = element("div");
    			label2 = element("label");
    			label2.textContent = "Country";
    			t35 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Select a country";
    			option1 = element("option");
    			option1.textContent = "India";
    			option2 = element("option");
    			option2.textContent = "Vietnam";
    			option3 = element("option");
    			option3.textContent = "Singapore";
    			t40 = space();
    			div5 = element("div");
    			label3 = element("label");
    			label3.textContent = "Job Location";
    			t42 = space();
    			select1 = element("select");
    			option4 = element("option");
    			option4.textContent = "Select a country";
    			option5 = element("option");
    			option5.textContent = "India";
    			option6 = element("option");
    			option6.textContent = "Vietnam";
    			option7 = element("option");
    			option7.textContent = "Singapore";
    			attr_dev(img, "id", "logo");
    			attr_dev(img, "href", "../App.svelte");
    			if (!src_url_equal(img.src, img_src_value = "images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "DSukic logo");
    			attr_dev(img, "width", "115");
    			add_location(img, file, 97, 6, 2333);
    			attr_dev(li0, "class", "svelte-1l8xxzw");
    			add_location(li0, file, 97, 2, 2329);
    			set_style(li1, "padding-left", "84%");
    			set_style(li1, "padding-bottom", "2%");
    			attr_dev(li1, "class", "svelte-1l8xxzw");
    			add_location(li1, file, 98, 2, 2430);
    			set_style(ul0, "position", "unset");
    			set_style(ul0, "padding-top", "1%");
    			attr_dev(ul0, "class", "svelte-1l8xxzw");
    			add_location(ul0, file, 96, 1, 2282);
    			attr_dev(a0, "href", "#Home");
    			attr_dev(a0, "class", "svelte-1l8xxzw");
    			add_location(a0, file, 102, 16, 2559);
    			attr_dev(li2, "id", "Home");
    			attr_dev(li2, "class", "svelte-1l8xxzw");
    			add_location(li2, file, 102, 2, 2545);
    			attr_dev(a1, "href", "#Design");
    			attr_dev(a1, "class", "svelte-1l8xxzw");
    			add_location(a1, file, 103, 6, 2625);
    			attr_dev(li3, "class", "svelte-1l8xxzw");
    			add_location(li3, file, 103, 2, 2621);
    			attr_dev(a2, "href", "#Projects");
    			attr_dev(a2, "class", "svelte-1l8xxzw");
    			add_location(a2, file, 104, 6, 2695);
    			attr_dev(li4, "class", "svelte-1l8xxzw");
    			add_location(li4, file, 104, 2, 2691);
    			attr_dev(a3, "href", "#Contact");
    			attr_dev(a3, "class", "svelte-1l8xxzw");
    			add_location(a3, file, 105, 28, 2791);
    			set_style(li5, "float", "right");
    			attr_dev(li5, "class", "svelte-1l8xxzw");
    			add_location(li5, file, 105, 2, 2765);
    			attr_dev(ul1, "class", "navbar svelte-1l8xxzw");
    			add_location(ul1, file, 101, 1, 2522);
    			attr_dev(h10, "id", "Design");
    			attr_dev(h10, "class", "svelte-1l8xxzw");
    			add_location(h10, file, 111, 1, 2915);
    			attr_dev(h11, "id", "Projects");
    			attr_dev(h11, "class", "svelte-1l8xxzw");
    			add_location(h11, file, 115, 1, 2992);
    			attr_dev(h12, "class", "svelte-1l8xxzw");
    			add_location(h12, file, 132, 3, 3356);
    			attr_dev(h2, "class", "svelte-1l8xxzw");
    			add_location(h2, file, 133, 3, 3377);
    			add_location(div0, file, 131, 2, 3346);
    			add_location(pre, file, 137, 3, 3454);
    			add_location(div1, file, 136, 2, 3444);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file, 143, 4, 3549);
    			attr_dev(input, "id", "name");
    			add_location(input, file, 144, 4, 3585);
    			add_location(div2, file, 142, 3, 3538);
    			attr_dev(label1, "for", "message");
    			add_location(label1, file, 148, 4, 3663);
    			attr_dev(textarea, "id", "message");
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "cols", "80");
    			attr_dev(textarea, "class", "svelte-1l8xxzw");
    			add_location(textarea, file, 149, 4, 3705);
    			add_location(div3, file, 147, 3, 3652);
    			add_location(button1, file, 151, 3, 3798);
    			attr_dev(label2, "for", "country");
    			add_location(label2, file, 154, 4, 3862);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file, 156, 5, 3964);
    			option1.__value = "india";
    			option1.value = option1.__value;
    			add_location(option1, file, 157, 5, 4013);
    			option2.__value = "vietnam";
    			option2.value = option2.__value;
    			add_location(option2, file, 158, 5, 4056);
    			option3.__value = "singapore";
    			option3.value = option3.__value;
    			add_location(option3, file, 159, 5, 4103);
    			attr_dev(select0, "id", "country");
    			if (/*formValues*/ ctx[0].country === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[10].call(select0));
    			add_location(select0, file, 155, 4, 3904);
    			add_location(div4, file, 153, 3, 3851);
    			attr_dev(label3, "for", "job-location");
    			add_location(label3, file, 164, 4, 4191);
    			option4.__value = "";
    			option4.value = option4.__value;
    			add_location(option4, file, 166, 5, 4321);
    			option5.__value = "india";
    			option5.value = option5.__value;
    			add_location(option5, file, 167, 5, 4370);
    			option6.__value = "vietnam";
    			option6.value = option6.__value;
    			add_location(option6, file, 168, 5, 4413);
    			option7.__value = "singapore";
    			option7.value = option7.__value;
    			add_location(option7, file, 169, 5, 4460);
    			attr_dev(select1, "id", "job-location");
    			select1.multiple = true;
    			if (/*formValues*/ ctx[0].jobLocation === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[11].call(select1));
    			add_location(select1, file, 165, 4, 4243);
    			add_location(div5, file, 163, 3, 4180);
    			add_location(form, file, 141, 2, 3527);
    			attr_dev(section, "id", "Contact");
    			add_location(section, file, 120, 1, 3075);
    			attr_dev(main, "class", "svelte-1l8xxzw");
    			add_location(main, file, 95, 0, 2273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, img);
    			append_dev(ul0, t0);
    			append_dev(ul0, li1);
    			mount_component(button0, li1, null);
    			append_dev(main, t1);
    			append_dev(main, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, a0);
    			append_dev(ul1, t3);
    			append_dev(ul1, li3);
    			append_dev(li3, a1);
    			append_dev(ul1, t5);
    			append_dev(ul1, li4);
    			append_dev(li4, a2);
    			append_dev(ul1, t7);
    			append_dev(ul1, li5);
    			append_dev(li5, a3);
    			append_dev(main, t9);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(main, null);
    			}

    			append_dev(main, t10);
    			append_dev(main, h10);
    			append_dev(main, t12);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(main, null);
    			}

    			append_dev(main, t13);
    			append_dev(main, h11);
    			append_dev(main, t15);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t16);
    			append_dev(main, section);
    			mount_component(recaptcha_1, section, null);
    			append_dev(section, t17);
    			append_dev(section, div0);
    			append_dev(div0, h12);
    			append_dev(div0, t19);
    			append_dev(div0, h2);
    			append_dev(section, t21);
    			append_dev(section, div1);
    			append_dev(div1, pre);
    			append_dev(pre, t22);
    			append_dev(pre, t23);
    			append_dev(pre, t24);
    			append_dev(section, t25);
    			append_dev(section, form);
    			append_dev(form, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t27);
    			append_dev(div2, input);
    			set_input_value(input, /*formValues*/ ctx[0].name);
    			append_dev(form, t28);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t30);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*formValues*/ ctx[0].message);
    			append_dev(form, t31);
    			append_dev(form, button1);
    			append_dev(form, t33);
    			append_dev(form, div4);
    			append_dev(div4, label2);
    			append_dev(div4, t35);
    			append_dev(div4, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(select0, option3);
    			select_option(select0, /*formValues*/ ctx[0].country);
    			append_dev(form, t40);
    			append_dev(form, div5);
    			append_dev(div5, label3);
    			append_dev(div5, t42);
    			append_dev(div5, select1);
    			append_dev(select1, option4);
    			append_dev(select1, option5);
    			append_dev(select1, option6);
    			append_dev(select1, option7);
    			select_options(select1, /*formValues*/ ctx[0].jobLocation);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", handleAnchorClick, false, false, false),
    					listen_dev(a1, "click", handleAnchorClick, false, false, false),
    					listen_dev(a2, "click", handleAnchorClick, false, false, false),
    					listen_dev(a3, "click", handleAnchorClick, false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[9]),
    					listen_dev(button1, "click", /*submitHandler*/ ctx[6], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[10]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			if ((!current || dirty & /*formValues*/ 1) && t23_value !== (t23_value = JSON.stringify(/*formValues*/ ctx[0], null, 2) + "")) set_data_dev(t23, t23_value);

    			if (dirty & /*formValues*/ 1 && input.value !== /*formValues*/ ctx[0].name) {
    				set_input_value(input, /*formValues*/ ctx[0].name);
    			}

    			if (dirty & /*formValues*/ 1) {
    				set_input_value(textarea, /*formValues*/ ctx[0].message);
    			}

    			if (dirty & /*formValues*/ 1) {
    				select_option(select0, /*formValues*/ ctx[0].country);
    			}

    			if (dirty & /*formValues*/ 1) {
    				select_options(select1, /*formValues*/ ctx[0].jobLocation);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(recaptcha_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(recaptcha_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button0);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(recaptcha_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const googleRecaptchaSiteKey = "6LeRwxQkAAAAAG1wudyYeYYm5TLTiDJQBdEve4j_";

    function handleAnchorClick(event) {
    	event.preventDefault();
    	const link = event.currentTarget;
    	const anchorId = new URL(link.href).hash.replace('#', '');
    	const anchor = document.getElementById(anchorId);

    	window.scrollTo({
    		top: anchor.offsetTop + -60,
    		behavior: "smooth"
    	});
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const onCaptchaReady = event => {
    		console.log("recaptcha init has completed.");
    	}; /*
    │You can enable your form button here.
    */

    	const onCaptchaSuccess = event => {
    		userTracker.resolve(event);
    		console.log("token received: " + event.detail.token);
    	}; /*
    │If using checkbox method, you can attach your
    │form logic here, or dispatch your custom event.
    */

    	const onCaptchaError = event => {
    		console.log("recaptcha init has failed.");
    	}; /*
    │Usually due to incorrect siteKey.
    |Make sure you have the correct siteKey..
    */

    	const onCaptchaExpire = event => {
    		console.log("recaptcha api has expired");
    	}; /*
    │Normally, you wouldn't need to do anything.
    │Recaptcha should reinit itself automatically.
    */

    	const onCaptchaOpen = event => {
    		console.log("google decided to challange the user");
    	}; /*
    │This fires when the puzzle frame pops.
    */

    	const onCaptchaClose = event => {
    		console.log("google decided to challange the user");
    	}; /*
    │This fires when the puzzle frame closes.
    │Usually happens when the user clicks outside
    |the modal frame.
    */

    	const submitHandler = async () => {
    		console.log("launching recaptcha");
    		recaptcha.execute();
    		console.log("pending for google response");
    		const event = await Promise.resolve(observer);
    		const recaptchaToken = (event.detail?.token) ? event.detail.token : false;

    		if (!recaptchaToken) {
    			console.log("recaptcha is NOT OK");
    			return false;
    		}

    		console.log("token retrieved", recaptchaToken);
    	};

    	const formValues = {
    		name: "",
    		message: "",
    		country: "",
    		jobLocation: ""
    	};

    	let test = [];

    	for (let i = 1; i < 11; i++) {
    		test.push(i);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		formValues.name = this.value;
    		$$invalidate(0, formValues);
    	}

    	function textarea_input_handler() {
    		formValues.message = this.value;
    		$$invalidate(0, formValues);
    	}

    	function select0_change_handler() {
    		formValues.country = select_value(this);
    		$$invalidate(0, formValues);
    	}

    	function select1_change_handler() {
    		formValues.jobLocation = select_multiple_value(this);
    		$$invalidate(0, formValues);
    	}

    	$$self.$capture_state = () => ({
    		Button,
    		Recaptcha,
    		recaptcha,
    		observer,
    		onCaptchaReady,
    		onCaptchaSuccess,
    		onCaptchaError,
    		onCaptchaExpire,
    		onCaptchaOpen,
    		onCaptchaClose,
    		submitHandler,
    		googleRecaptchaSiteKey,
    		formValues,
    		handleAnchorClick,
    		test
    	});

    	$$self.$inject_state = $$props => {
    		if ('test' in $$props) $$invalidate(7, test = $$props.test);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formValues,
    		onCaptchaReady,
    		onCaptchaSuccess,
    		onCaptchaError,
    		onCaptchaExpire,
    		onCaptchaClose,
    		submitHandler,
    		test,
    		input_input_handler,
    		textarea_input_handler,
    		select0_change_handler,
    		select1_change_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

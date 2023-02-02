
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
    function empty() {
        return text('');
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
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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

    /* src\components\Navbar.svelte generated by Svelte v3.55.1 */

    const file$f = "src\\components\\Navbar.svelte";

    function create_fragment$h(ctx) {
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Design";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Projects";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Contact";
    			attr_dev(a0, "href", "#Home");
    			attr_dev(a0, "class", "svelte-6ws5mf");
    			add_location(a0, file$f, 14, 18, 363);
    			attr_dev(li0, "id", "Home");
    			attr_dev(li0, "class", "svelte-6ws5mf");
    			add_location(li0, file$f, 14, 4, 349);
    			attr_dev(a1, "href", "#Design");
    			attr_dev(a1, "class", "svelte-6ws5mf");
    			add_location(a1, file$f, 15, 8, 431);
    			attr_dev(li1, "class", "svelte-6ws5mf");
    			add_location(li1, file$f, 15, 4, 427);
    			attr_dev(a2, "href", "#Projects");
    			attr_dev(a2, "class", "svelte-6ws5mf");
    			add_location(a2, file$f, 16, 8, 503);
    			attr_dev(li2, "class", "svelte-6ws5mf");
    			add_location(li2, file$f, 16, 4, 499);
    			attr_dev(a3, "href", "#Contact");
    			attr_dev(a3, "class", "svelte-6ws5mf");
    			add_location(a3, file$f, 17, 30, 601);
    			set_style(li3, "float", "right");
    			attr_dev(li3, "class", "svelte-6ws5mf");
    			add_location(li3, file$f, 17, 4, 575);
    			attr_dev(ul, "class", "navbar svelte-6ws5mf");
    			add_location(ul, file$f, 13, 0, 324);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, a3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", handleAnchorClick, false, false, false),
    					listen_dev(a1, "click", handleAnchorClick, false, false, false),
    					listen_dev(a2, "click", handleAnchorClick, false, false, false),
    					listen_dev(a3, "click", handleAnchorClick, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

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

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ handleAnchorClick });
    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const PollStore = writable([
            false,
            0
        ]);

    /* src\components\Darkmode.svelte generated by Svelte v3.55.1 */
    const file$e = "src\\components\\Darkmode.svelte";

    function create_fragment$g(ctx) {
    	let button;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			span.textContent = "Darkmode";
    			attr_dev(span, "class", "svelte-13a1g1m");
    			add_location(span, file$e, 32, 55, 863);
    			attr_dev(button, "class", "custom-btn btn-3 svelte-13a1g1m");
    			add_location(button, file$e, 32, 4, 812);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Darkmode', slots, []);
    	let darkmodeActive = false;
    	let darkmodeValue = 0;

    	PollStore.subscribe(data => {
    		darkmodeActive = data[0];
    	});

    	function toggle() {
    		darkmodeActive = !darkmodeActive;

    		if (darkmodeActive) {
    			darkmodeValue = 5;
    			document.getElementById("logo").src = "images/logo_darkmode.png";
    		} else {
    			darkmodeValue = 0;
    			document.getElementById("logo").src = "images/logo.png";
    		}

    		PollStore.update(DarkmodeData => {
    			return [darkmodeActive, darkmodeValue];
    		});

    		window.document.body.classList.toggle('dark-mode');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Darkmode> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		DarkmodeStore: PollStore,
    		darkmodeActive,
    		darkmodeValue,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('darkmodeActive' in $$props) darkmodeActive = $$props.darkmodeActive;
    		if ('darkmodeValue' in $$props) darkmodeValue = $$props.darkmodeValue;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [toggle];
    }

    class Darkmode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Darkmode",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\Header.svelte generated by Svelte v3.55.1 */
    const file$d = "src\\components\\Header.svelte";

    function create_fragment$f(ctx) {
    	let ul;
    	let li0;
    	let img;
    	let img_src_value;
    	let t;
    	let li1;
    	let darkmode;
    	let current;
    	darkmode = new Darkmode({ $$inline: true });

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			img = element("img");
    			t = space();
    			li1 = element("li");
    			create_component(darkmode.$$.fragment);
    			attr_dev(img, "id", "logo");
    			attr_dev(img, "href", "../App.svelte");
    			if (!src_url_equal(img.src, img_src_value = "./images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "DSukic logo");
    			attr_dev(img, "width", "115");
    			attr_dev(img, "class", "svelte-1h2zyjc");
    			add_location(img, file$d, 5, 8, 83);
    			attr_dev(li0, "class", "svelte-1h2zyjc");
    			add_location(li0, file$d, 5, 4, 79);
    			set_style(li1, "padding-left", "84%");
    			set_style(li1, "padding-bottom", "15px");
    			attr_dev(li1, "class", "svelte-1h2zyjc");
    			add_location(li1, file$d, 6, 4, 184);
    			attr_dev(ul, "class", "svelte-1h2zyjc");
    			add_location(ul, file$d, 4, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, img);
    			append_dev(ul, t);
    			append_dev(ul, li1);
    			mount_component(darkmode, li1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(darkmode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(darkmode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_component(darkmode);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Darkmode });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\Repeat.svelte generated by Svelte v3.55.1 */

    const file$c = "src\\components\\Repeat.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (8:0) {#each repititions as None}
    function create_each_block$3(ctx) {
    	let h1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "class", "svelte-1kvpq3u");
    			add_location(h1, file$c, 8, 0, 137);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    			if (detaching) detach_dev(h1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(8:0) {#each repititions as None}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*repititions*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$scope*/ 2) {
    				each_value = /*repititions*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Repeat', slots, ['default']);
    	let repititions = [];

    	for (let i = 1; i < 11; i++) {
    		repititions.push(i);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Repeat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ repititions });

    	$$self.$inject_state = $$props => {
    		if ('repititions' in $$props) $$invalidate(0, repititions = $$props.repititions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [repititions, $$scope, slots];
    }

    class Repeat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Repeat",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\components\Counter.svelte generated by Svelte v3.55.1 */

    const file$b = "src\\components\\Counter.svelte";

    // (14:0) {#if initial > 1}
    function create_if_block$3(ctx) {
    	let h3;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			t = text(/*seconds*/ ctx[1]);
    			attr_dev(h3, "id", "timerMessage");
    			add_location(h3, file$b, 14, 4, 268);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			append_dev(h3, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*seconds*/ 2) set_data_dev(t, /*seconds*/ ctx[1]);
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
    			if (detaching) detach_dev(h3);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(14:0) {#if initial > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*initial*/ ctx[0] > 1 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*initial*/ ctx[0] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*initial*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Counter', slots, ['default']);
    	let { initial } = $$props;
    	let seconds = initial;

    	function timer() {
    		for (let i = initial; i > 0; i--) {
    			setTimeout(
    				() => {
    					$$invalidate(1, seconds = i);
    				},
    				(initial - i) * 1000
    			);
    		}
    	}

    	timer();

    	$$self.$$.on_mount.push(function () {
    		if (initial === undefined && !('initial' in $$props || $$self.$$.bound[$$self.$$.props['initial']])) {
    			console.warn("<Counter> was created without expected prop 'initial'");
    		}
    	});

    	const writable_props = ['initial'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Counter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('initial' in $$props) $$invalidate(0, initial = $$props.initial);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ initial, seconds, timer });

    	$$self.$inject_state = $$props => {
    		if ('initial' in $$props) $$invalidate(0, initial = $$props.initial);
    		if ('seconds' in $$props) $$invalidate(1, seconds = $$props.seconds);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [initial, seconds, $$scope, slots];
    }

    class Counter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { initial: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Counter",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get initial() {
    		throw new Error("<Counter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initial(value) {
    		throw new Error("<Counter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\TicTacToe\Tile.svelte generated by Svelte v3.55.1 */
    const file$a = "src\\components\\TicTacToe\\Tile.svelte";

    function create_fragment$c(ctx) {
    	let img;
    	let img_class_value;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");

    			attr_dev(img, "class", img_class_value = "" + (/*clickable*/ ctx[2] && tileIsEmpty(/*currentSource*/ ctx[0])
    			? "clickable"
    			: "unclickable") + " tile" + " svelte-v4buoe");

    			if (!src_url_equal(img.src, img_src_value = /*currentSource*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Tic-Tac-Toe Tile");
    			add_location(img, file$a, 27, 0, 596);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						img,
    						"click",
    						function () {
    							if (is_function(/*clickable*/ ctx[2] ? /*click_handler*/ ctx[4] : "")) (/*clickable*/ ctx[2] ? /*click_handler*/ ctx[4] : "").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						img,
    						"keypress",
    						function () {
    							if (is_function(/*clickable*/ ctx[2] ? /*keypress_handler*/ ctx[5] : "")) (/*clickable*/ ctx[2] ? /*keypress_handler*/ ctx[5] : "").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*clickable, currentSource*/ 5 && img_class_value !== (img_class_value = "" + (/*clickable*/ ctx[2] && tileIsEmpty(/*currentSource*/ ctx[0])
    			? "clickable"
    			: "unclickable") + " tile" + " svelte-v4buoe")) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*currentSource*/ 1 && !src_url_equal(img.src, img_src_value = /*currentSource*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function tileIsEmpty(src) {
    	if (src === "./images/TicTacToe/Empty.png" || src === "./images/TicTacToe/Darkmode/EmptyDarkmode.png") {
    		return true;
    	} else {
    		return false;
    	}
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tile', slots, []);
    	let { currentSource } = $$props;
    	let { handleClick } = $$props;
    	let { clickable } = $$props;
    	let { index } = $$props;
    	let darkmodeValue = 0;

    	PollStore.subscribe(data => {
    		darkmodeValue = data[1];
    	});

    	$$self.$$.on_mount.push(function () {
    		if (currentSource === undefined && !('currentSource' in $$props || $$self.$$.bound[$$self.$$.props['currentSource']])) {
    			console.warn("<Tile> was created without expected prop 'currentSource'");
    		}

    		if (handleClick === undefined && !('handleClick' in $$props || $$self.$$.bound[$$self.$$.props['handleClick']])) {
    			console.warn("<Tile> was created without expected prop 'handleClick'");
    		}

    		if (clickable === undefined && !('clickable' in $$props || $$self.$$.bound[$$self.$$.props['clickable']])) {
    			console.warn("<Tile> was created without expected prop 'clickable'");
    		}

    		if (index === undefined && !('index' in $$props || $$self.$$.bound[$$self.$$.props['index']])) {
    			console.warn("<Tile> was created without expected prop 'index'");
    		}
    	});

    	const writable_props = ['currentSource', 'handleClick', 'clickable', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tile> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleClick(index);
    	const keypress_handler = () => handleClick(index);

    	$$self.$$set = $$props => {
    		if ('currentSource' in $$props) $$invalidate(0, currentSource = $$props.currentSource);
    		if ('handleClick' in $$props) $$invalidate(1, handleClick = $$props.handleClick);
    		if ('clickable' in $$props) $$invalidate(2, clickable = $$props.clickable);
    		if ('index' in $$props) $$invalidate(3, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		DarkmodeStore: PollStore,
    		currentSource,
    		handleClick,
    		clickable,
    		index,
    		tileIsEmpty,
    		darkmodeValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentSource' in $$props) $$invalidate(0, currentSource = $$props.currentSource);
    		if ('handleClick' in $$props) $$invalidate(1, handleClick = $$props.handleClick);
    		if ('clickable' in $$props) $$invalidate(2, clickable = $$props.clickable);
    		if ('index' in $$props) $$invalidate(3, index = $$props.index);
    		if ('darkmodeValue' in $$props) darkmodeValue = $$props.darkmodeValue;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentSource, handleClick, clickable, index, click_handler, keypress_handler];
    }

    class Tile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			currentSource: 0,
    			handleClick: 1,
    			clickable: 2,
    			index: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tile",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get currentSource() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentSource(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleClick() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleClick(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clickable() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clickable(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\TicTacToe\TicTacToe.svelte generated by Svelte v3.55.1 */
    const file$9 = "src\\components\\TicTacToe\\TicTacToe.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    // (139:4) {#each tiles as tile, index}
    function create_each_block$2(ctx) {
    	let tile;
    	let current;

    	tile = new Tile({
    			props: {
    				handleClick: /*handleClick*/ ctx[8],
    				clickable: /*clickable*/ ctx[4],
    				index: /*index*/ ctx[20],
    				currentSource: /*sources*/ ctx[9][/*tile*/ ctx[18] + /*darkmodeValue*/ ctx[6]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tile, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tile_changes = {};
    			if (dirty & /*clickable*/ 16) tile_changes.clickable = /*clickable*/ ctx[4];
    			if (dirty & /*tiles, darkmodeValue*/ 96) tile_changes.currentSource = /*sources*/ ctx[9][/*tile*/ ctx[18] + /*darkmodeValue*/ ctx[6]];
    			tile.$set(tile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(139:4) {#each tiles as tile, index}",
    		ctx
    	});

    	return block;
    }

    // (165:4) {:else}
    function create_else_block$1(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("It's player ");
    			t1 = text(/*player*/ ctx[0]);
    			t2 = text("'s turn");
    			add_location(h1, file$9, 165, 8, 3894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*player*/ 1) set_data_dev(t1, /*player*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(165:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (157:19) 
    function create_if_block_1(ctx) {
    	let h10;
    	let t1;
    	let div;
    	let counter;
    	let t2;
    	let h11;
    	let current;

    	counter = new Counter({
    			props: { initial: /*restartSeconds*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			h10.textContent = "It's a draw";
    			t1 = space();
    			div = element("div");
    			create_component(counter.$$.fragment);
    			t2 = space();
    			h11 = element("h1");
    			h11.textContent = "Restart...";
    			add_location(h10, file$9, 157, 8, 3694);
    			attr_dev(div, "class", "counter svelte-1umb93w");
    			add_location(div, file$9, 158, 8, 3724);
    			add_location(h11, file$9, 163, 8, 3851);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(counter, div, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h11, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(counter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(counter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(counter);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(157:19) ",
    		ctx
    	});

    	return block;
    }

    // (149:4) {#if won}
    function create_if_block$2(ctx) {
    	let h10;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let div;
    	let counter;
    	let t4;
    	let h11;
    	let current;

    	counter = new Counter({
    			props: { initial: /*restartSeconds*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			t0 = text("Player ");
    			t1 = text(/*playerWon*/ ctx[1]);
    			t2 = text(" has won");
    			t3 = space();
    			div = element("div");
    			create_component(counter.$$.fragment);
    			t4 = space();
    			h11 = element("h1");
    			h11.textContent = "Restart...";
    			add_location(h10, file$9, 149, 8, 3472);
    			attr_dev(div, "class", "counter svelte-1umb93w");
    			add_location(div, file$9, 150, 8, 3517);
    			add_location(h11, file$9, 155, 8, 3644);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			append_dev(h10, t0);
    			append_dev(h10, t1);
    			append_dev(h10, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(counter, div, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h11, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*playerWon*/ 2) set_data_dev(t1, /*playerWon*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(counter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(counter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			destroy_component(counter);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(149:4) {#if won}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let div2;
    	let current;
    	let each_value = /*tiles*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const if_block_creators = [create_if_block$2, create_if_block_1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*won*/ ctx[2]) return 0;
    		if (/*draw*/ ctx[3]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			if_block.c();
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "board svelte-1umb93w");
    			add_location(div0, file$9, 137, 0, 3157);
    			attr_dev(div1, "class", "score svelte-1umb93w");
    			add_location(div1, file$9, 147, 0, 3428);
    			set_style(div2, "clear", "both");
    			add_location(div2, file$9, 168, 0, 3951);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			if_blocks[current_block_type_index].m(div1, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handleClick, clickable, sources, tiles, darkmodeValue*/ 880) {
    				each_value = /*tiles*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TicTacToe', slots, []);
    	let player1 = true;
    	let player = "1";
    	let playerWon = "2";
    	let won = false;
    	let draw = false;
    	let clickable = true;
    	let restartSeconds = 5;
    	let tiles = [];

    	for (let i = 0; i < 9; i++) {
    		tiles.push(0);
    	}

    	let handleClick = tile => {
    		if (tiles[tile] != 0) {
    			return;
    		}

    		if (player1) {
    			$$invalidate(5, tiles[tile] = 1, tiles);
    		} else {
    			$$invalidate(5, tiles[tile] = 2, tiles);
    		}

    		checkWin();
    		checkDraw();
    		togglePlayer();
    	};

    	function togglePlayer() {
    		player1 = !player1;

    		if (player1) {
    			$$invalidate(0, player = "1");
    			$$invalidate(1, playerWon = "2");
    		} else {
    			$$invalidate(0, player = "2");
    			$$invalidate(1, playerWon = "1");
    		}
    	}

    	let winRanges = [
    		//rows
    		[0, 1, 2],
    		[3, 4, 5],
    		[6, 7, 8],
    		//columns
    		[0, 3, 6],
    		[1, 4, 7],
    		[2, 5, 8],
    		//diagonals
    		[0, 4, 8],
    		[2, 4, 6]
    	];

    	function checkWin() {
    		for (let i = 0; i < winRanges.length; i++) {
    			if (allEqual(winRanges[i])) {
    				winScreen(winRanges[i]);
    			}
    		}
    	}

    	function checkDraw() {
    		for (let i = 0; i < tiles.length; i++) {
    			if (tiles[i] === 0) {
    				return;
    			}
    		}

    		$$invalidate(3, draw = true);
    		$$invalidate(4, clickable = false);
    		setTimeout(restart, restartSeconds * 1000);
    	}

    	function allEqual(range) {
    		if (tiles[range[0]] === 0 || tiles[range[0]] === -1) {
    			return false;
    		}

    		if (tiles[range[0]] === tiles[range[1]] && tiles[range[1]] === tiles[range[2]]) {
    			return true;
    		}
    	}

    	function winScreen(range) {
    		$$invalidate(2, won = true);

    		for (let i = 0; i < range.length; i++) {
    			$$invalidate(5, tiles[range[i]] += 2, tiles);
    		}

    		$$invalidate(4, clickable = false);
    		setTimeout(restart, restartSeconds * 1000);
    	}

    	function restart() {
    		$$invalidate(4, clickable = true);
    		player1 = true;
    		$$invalidate(0, player = "1");
    		$$invalidate(2, won = false);
    		$$invalidate(3, draw = false);

    		for (let i = 0; i < tiles.length; i++) {
    			$$invalidate(5, tiles[i] = 0, tiles);
    		}
    	}

    	let sources = [
    		//Normal
    		"./images/TicTacToe/Empty.png",
    		"./images/TicTacToe/Cross.png",
    		"./images/TicTacToe/Circle.png",
    		"./images/TicTacToe/CrossWin.png",
    		"./images/TicTacToe/CircleWin.png",
    		//Darkmode
    		"./images/TicTacToe/Darkmode/EmptyDarkmode.png",
    		"./images/TicTacToe/Darkmode/CrossDarkmode.png",
    		"./images/TicTacToe/Darkmode/CircleDarkmode.png",
    		"./images/TicTacToe/Darkmode/CrossWinDarkmode.png",
    		"./images/TicTacToe/Darkmode/CircleWinDarkmode.png"
    	];

    	let darkmodeValue = 0;

    	PollStore.subscribe(data => {
    		$$invalidate(6, darkmodeValue = data[1]);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TicTacToe> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		DarkmodeStore: PollStore,
    		Counter,
    		Tile,
    		player1,
    		player,
    		playerWon,
    		won,
    		draw,
    		clickable,
    		restartSeconds,
    		tiles,
    		handleClick,
    		togglePlayer,
    		winRanges,
    		checkWin,
    		checkDraw,
    		allEqual,
    		winScreen,
    		restart,
    		sources,
    		darkmodeValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('player1' in $$props) player1 = $$props.player1;
    		if ('player' in $$props) $$invalidate(0, player = $$props.player);
    		if ('playerWon' in $$props) $$invalidate(1, playerWon = $$props.playerWon);
    		if ('won' in $$props) $$invalidate(2, won = $$props.won);
    		if ('draw' in $$props) $$invalidate(3, draw = $$props.draw);
    		if ('clickable' in $$props) $$invalidate(4, clickable = $$props.clickable);
    		if ('restartSeconds' in $$props) $$invalidate(7, restartSeconds = $$props.restartSeconds);
    		if ('tiles' in $$props) $$invalidate(5, tiles = $$props.tiles);
    		if ('handleClick' in $$props) $$invalidate(8, handleClick = $$props.handleClick);
    		if ('winRanges' in $$props) winRanges = $$props.winRanges;
    		if ('sources' in $$props) $$invalidate(9, sources = $$props.sources);
    		if ('darkmodeValue' in $$props) $$invalidate(6, darkmodeValue = $$props.darkmodeValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		player,
    		playerWon,
    		won,
    		draw,
    		clickable,
    		tiles,
    		darkmodeValue,
    		restartSeconds,
    		handleClick,
    		sources
    	];
    }

    class TicTacToe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TicTacToe",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Chess\Knight.svelte generated by Svelte v3.55.1 */

    function create_fragment$a(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Knight', slots, []);
    	let { currentCoordinates } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (currentCoordinates === undefined && !('currentCoordinates' in $$props || $$self.$$.bound[$$self.$$.props['currentCoordinates']])) {
    			console.warn("<Knight> was created without expected prop 'currentCoordinates'");
    		}
    	});

    	const writable_props = ['currentCoordinates'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Knight> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentCoordinates' in $$props) $$invalidate(0, currentCoordinates = $$props.currentCoordinates);
    	};

    	$$self.$capture_state = () => ({ currentCoordinates });

    	$$self.$inject_state = $$props => {
    		if ('currentCoordinates' in $$props) $$invalidate(0, currentCoordinates = $$props.currentCoordinates);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentCoordinates];
    }

    class Knight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { currentCoordinates: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Knight",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get currentCoordinates() {
    		throw new Error("<Knight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentCoordinates(value) {
    		throw new Error("<Knight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Chess\Pieces.svelte generated by Svelte v3.55.1 */
    const file$8 = "src\\components\\Chess\\Pieces.svelte";

    // (13:0) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "tile");
    			if (!src_url_equal(img.src, img_src_value = "./images/Chess/Tiles/EmptyTileBlack.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Black Empty Tile");
    			add_location(img, file$8, 13, 4, 289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(13:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:0) {#if Board[indexCol][indexRow] === 0}
    function create_if_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "tile");
    			if (!src_url_equal(img.src, img_src_value = "./images/Chess/Tiles/EmptyTileWhite.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "White Empty Tile");
    			add_location(img, file$8, 11, 4, 187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(11:0) {#if Board[indexCol][indexRow] === 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*Board*/ ctx[0][/*indexCol*/ ctx[1]][/*indexRow*/ ctx[2]] === 0) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pieces', slots, []);
    	let { Board } = $$props;
    	let { indexCol } = $$props;
    	let { indexRow } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (Board === undefined && !('Board' in $$props || $$self.$$.bound[$$self.$$.props['Board']])) {
    			console.warn("<Pieces> was created without expected prop 'Board'");
    		}

    		if (indexCol === undefined && !('indexCol' in $$props || $$self.$$.bound[$$self.$$.props['indexCol']])) {
    			console.warn("<Pieces> was created without expected prop 'indexCol'");
    		}

    		if (indexRow === undefined && !('indexRow' in $$props || $$self.$$.bound[$$self.$$.props['indexRow']])) {
    			console.warn("<Pieces> was created without expected prop 'indexRow'");
    		}
    	});

    	const writable_props = ['Board', 'indexCol', 'indexRow'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pieces> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('Board' in $$props) $$invalidate(0, Board = $$props.Board);
    		if ('indexCol' in $$props) $$invalidate(1, indexCol = $$props.indexCol);
    		if ('indexRow' in $$props) $$invalidate(2, indexRow = $$props.indexRow);
    	};

    	$$self.$capture_state = () => ({ Knight, Board, indexCol, indexRow });

    	$$self.$inject_state = $$props => {
    		if ('Board' in $$props) $$invalidate(0, Board = $$props.Board);
    		if ('indexCol' in $$props) $$invalidate(1, indexCol = $$props.indexCol);
    		if ('indexRow' in $$props) $$invalidate(2, indexRow = $$props.indexRow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [Board, indexCol, indexRow];
    }

    class Pieces extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { Board: 0, indexCol: 1, indexRow: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pieces",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get Board() {
    		throw new Error("<Pieces>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Board(value) {
    		throw new Error("<Pieces>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indexCol() {
    		throw new Error("<Pieces>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indexCol(value) {
    		throw new Error("<Pieces>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indexRow() {
    		throw new Error("<Pieces>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indexRow(value) {
    		throw new Error("<Pieces>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Chess\Chess.svelte generated by Svelte v3.55.1 */
    const file$7 = "src\\components\\Chess\\Chess.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (31:8) {#if index === 0}
    function create_if_block(ctx) {
    	let br;

    	const block = {
    		c: function create() {
    			br = element("br");
    			add_location(br, file$7, 31, 12, 617);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(31:8) {#if index === 0}",
    		ctx
    	});

    	return block;
    }

    // (35:8) {#each Board[index] as row}
    function create_each_block_3(ctx) {
    	let p1;
    	let t0_value = /*row*/ ctx[7] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p1 = element("p1");
    			t0 = text(t0_value);
    			t1 = text("  ");
    			add_location(p1, file$7, 35, 12, 690);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t0);
    			append_dev(p1, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(35:8) {#each Board[index] as row}",
    		ctx
    	});

    	return block;
    }

    // (30:4) {#each Board as tile, index}
    function create_each_block_2(ctx) {
    	let t0;
    	let t1;
    	let br;
    	let if_block = /*index*/ ctx[12] === 0 && create_if_block(ctx);
    	let each_value_3 = /*Board*/ ctx[0][/*index*/ ctx[12]];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = text("\r\n\r\n        ");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = text("\r\n        ");
    			br = element("br");
    			add_location(br, file$7, 37, 8, 733);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Board*/ 1) {
    				each_value_3 = /*Board*/ ctx[0][/*index*/ ctx[12]];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(30:4) {#each Board as tile, index}",
    		ctx
    	});

    	return block;
    }

    // (44:8) {#each Board[indexCol] as row, indexRow}
    function create_each_block_1(ctx) {
    	let pieces;
    	let current;

    	pieces = new Pieces({
    			props: {
    				knight: /*koordinates*/ ctx[1].knight,
    				Board: /*Board*/ ctx[0],
    				indexCol: /*indexCol*/ ctx[6],
    				indexRow: /*indexRow*/ ctx[9]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pieces.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pieces, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pieces.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pieces.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pieces, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(44:8) {#each Board[indexCol] as row, indexRow}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#each Board as column, indexCol}
    function create_each_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*Board*/ ctx[0][/*indexCol*/ ctx[6]];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*koordinates, Board*/ 3) {
    				each_value_1 = /*Board*/ ctx[0][/*indexCol*/ ctx[6]];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(43:4) {#each Board as column, indexCol}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div0;
    	let t0;
    	let pre;
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let current;
    	let each_value_2 = /*Board*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*Board*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			pre = element("pre");
    			t1 = text("    ");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = text("\r\n");
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div0, "clear", "both");
    			add_location(div0, file$7, 26, 0, 501);
    			attr_dev(pre, "class", "svelte-1oeb8p6");
    			add_location(pre, file$7, 28, 0, 537);
    			attr_dev(div1, "class", "board svelte-1oeb8p6");
    			add_location(div1, file$7, 41, 0, 764);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, pre, anchor);
    			append_dev(pre, t1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(pre, null);
    			}

    			append_dev(pre, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Board*/ 1) {
    				each_value_2 = /*Board*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(pre, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*Board, koordinates*/ 3) {
    				each_value = /*Board*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(pre);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chess', slots, []);
    	let Board = [];
    	let row1 = [0, 1, 0, 1, 0, 1, 0, 1];
    	let row2 = [1, 0, 1, 0, 1, 0, 1, 0];

    	for (let i = 0; i < 4; i++) {
    		Board.push(row1);
    		Board.push(row2);
    	}

    	let koordinates = { knight: "01" };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chess> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Pieces, Board, row1, row2, koordinates });

    	$$self.$inject_state = $$props => {
    		if ('Board' in $$props) $$invalidate(0, Board = $$props.Board);
    		if ('row1' in $$props) row1 = $$props.row1;
    		if ('row2' in $$props) row2 = $$props.row2;
    		if ('koordinates' in $$props) $$invalidate(1, koordinates = $$props.koordinates);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [Board, koordinates];
    }

    class Chess extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chess",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\Projects.svelte generated by Svelte v3.55.1 */
    const file$6 = "src\\components\\Projects.svelte";

    function create_fragment$7(ctx) {
    	let h10;
    	let t1;
    	let h11;
    	let t3;
    	let h12;
    	let t5;
    	let tictactoe;
    	let t6;
    	let h13;
    	let t8;
    	let h14;
    	let t10;
    	let chess;
    	let current;
    	tictactoe = new TicTacToe({ $$inline: true });
    	chess = new Chess({ $$inline: true });

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			h10.textContent = "Projects";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Tic-Tac-Toe";
    			t3 = space();
    			h12 = element("h1");
    			h12.textContent = "A simple Tic-Tac-Toe game made in Javascript";
    			t5 = space();
    			create_component(tictactoe.$$.fragment);
    			t6 = space();
    			h13 = element("h1");
    			h13.textContent = "Tic-Tac-Toe";
    			t8 = space();
    			h14 = element("h1");
    			h14.textContent = "A simple Tic-Tac-Toe game made in Javascript";
    			t10 = space();
    			create_component(chess.$$.fragment);
    			attr_dev(h10, "id", "Projects");
    			attr_dev(h10, "class", "svelte-1t4gdhk");
    			add_location(h10, file$6, 5, 0, 129);
    			attr_dev(h11, "class", "title svelte-1t4gdhk");
    			add_location(h11, file$6, 6, 0, 162);
    			attr_dev(h12, "class", "description svelte-1t4gdhk");
    			add_location(h12, file$6, 7, 0, 198);
    			attr_dev(h13, "class", "title svelte-1t4gdhk");
    			add_location(h13, file$6, 10, 0, 293);
    			attr_dev(h14, "class", "description svelte-1t4gdhk");
    			add_location(h14, file$6, 11, 0, 329);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h11, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h12, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(tictactoe, target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, h13, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h14, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(chess, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tictactoe.$$.fragment, local);
    			transition_in(chess.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tictactoe.$$.fragment, local);
    			transition_out(chess.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h11);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h12);
    			if (detaching) detach_dev(t5);
    			destroy_component(tictactoe, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(h13);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h14);
    			if (detaching) detach_dev(t10);
    			destroy_component(chess, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TicTacToe, Chess });
    	return [];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\Countries.svelte generated by Svelte v3.55.1 */

    const file$5 = "src\\components\\Countries.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (25:0) {#each countries as country}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*country*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*country*/ ctx[1];
    			option.value = option.__value;
    			add_location(option, file$5, 25, 4, 3404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(25:0) {#each countries as country}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let each_1_anchor;
    	let each_value = /*countries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*countries*/ 1) {
    				each_value = /*countries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Countries', slots, []);

    	let countries = [
    		'Afghanistan',
    		'Åland Islands',
    		'Albania',
    		'Algeria',
    		'American Samoa',
    		'Andorra',
    		'Angola',
    		'Anguilla',
    		'Antigua and Barbuda',
    		'Argentina',
    		'Armenia',
    		'Aruba',
    		'Australia',
    		'Austria',
    		'Azerbaijan',
    		'Bangladesh',
    		'Barbados',
    		'Bahamas',
    		'Bahrain',
    		'Belarus',
    		'Belgium',
    		'Belize',
    		'Benin',
    		'Bermuda',
    		'Bhutan',
    		'Bolivia',
    		'Bosnia and Herzegovina',
    		'Botswana',
    		'Brazil',
    		'British Indian Ocean Territory',
    		'British Virgin Islands',
    		'Brunei Darussalam',
    		'Bulgaria',
    		'Burkina Faso',
    		'Burma',
    		'Burundi',
    		'Cambodia',
    		'Cameroon',
    		'Canada',
    		'Cape Verde',
    		'Cayman Islands',
    		'Central African Republic',
    		'Chad',
    		'Chile',
    		'China',
    		'Christmas Island',
    		'Cocos (Keeling) Islands',
    		'Colombia',
    		'Comoros',
    		'Congo-Brazzaville',
    		'Congo-Kinshasa',
    		'Cook Islands',
    		'Costa Rica',
    		'Croatia',
    		'Curaçao',
    		'Cyprus',
    		'Czech Republic',
    		'Denmark',
    		'Djibouti',
    		'Dominica',
    		'Dominican Republic',
    		'East Timor',
    		'Ecuador',
    		'El Salvador',
    		'Egypt',
    		'Equatorial Guinea',
    		'Eritrea',
    		'Estonia',
    		'Ethiopia',
    		'Falkland Islands',
    		'Faroe Islands',
    		'Federated States of Micronesia',
    		'Fiji',
    		'Finland',
    		'France',
    		'French Guiana',
    		'French Polynesia',
    		'French Southern Lands',
    		'Gabon',
    		'Gambia',
    		'Georgia',
    		'Germany',
    		'Ghana',
    		'Gibraltar',
    		'Greece',
    		'Greenland',
    		'Grenada',
    		'Guadeloupe',
    		'Guam',
    		'Guatemala',
    		'Guernsey',
    		'Guinea',
    		'Guinea-Bissau',
    		'Guyana',
    		'Haiti',
    		'Heard and McDonald Islands',
    		'Honduras',
    		'Hong Kong',
    		'Hungary',
    		'Iceland',
    		'India',
    		'Indonesia',
    		'Iraq',
    		'Ireland',
    		'Isle of Man',
    		'Israel',
    		'Italy',
    		'Jamaica',
    		'Japan',
    		'Jersey',
    		'Jordan',
    		'Kazakhstan',
    		'Kenya',
    		'Kiribati',
    		'Kuwait',
    		'Kyrgyzstan',
    		'Laos',
    		'Latvia',
    		'Lebanon',
    		'Lesotho',
    		'Liberia',
    		'Libya',
    		'Liechtenstein',
    		'Lithuania',
    		'Luxembourg',
    		'Macau',
    		'Macedonia',
    		'Madagascar',
    		'Malawi',
    		'Malaysia',
    		'Maldives',
    		'Mali',
    		'Malta',
    		'Marshall Islands',
    		'Martinique',
    		'Mauritania',
    		'Mauritius',
    		'Mayotte',
    		'Mexico',
    		'Moldova',
    		'Monaco',
    		'Mongolia',
    		'Montenegro',
    		'Montserrat',
    		'Morocco',
    		'Mozambique',
    		'Namibia',
    		'Nauru',
    		'Nepal',
    		'Netherlands',
    		'New Caledonia',
    		'New Zealand',
    		'Nicaragua',
    		'Niger',
    		'Nigeria',
    		'Niue',
    		'Norfolk Island',
    		'Northern Mariana Islands',
    		'Norway',
    		'Oman',
    		'Pakistan',
    		'Palau',
    		'Panama',
    		'Papua New Guinea',
    		'Paraguay',
    		'Peru',
    		'Philippines',
    		'Pitcairn Islands',
    		'Poland',
    		'Portugal',
    		'Puerto Rico',
    		'Qatar',
    		'Réunion',
    		'Romania',
    		'Russia',
    		'Rwanda',
    		'Saint Barthélemy',
    		'Saint Helena',
    		'Saint Kitts and Nevis',
    		'Saint Lucia',
    		'Saint Martin',
    		'Saint Pierre and Miquelon',
    		'Saint Vincent',
    		'Samoa',
    		'San Marino',
    		'São Tomé and Príncipe',
    		'Saudi Arabia',
    		'Senegal',
    		'Serbia',
    		'Seychelles',
    		'Sierra Leone',
    		'Singapore',
    		'Sint Maarten',
    		'Slovakia',
    		'Slovenia',
    		'Solomon Islands',
    		'Somalia',
    		'South Africa',
    		'South Georgia',
    		'South Korea',
    		'Spain',
    		'Sri Lanka',
    		'Sudan',
    		'Suriname',
    		'Svalbard and Jan Mayen',
    		'Sweden',
    		'Swaziland',
    		'Switzerland',
    		'Syria',
    		'Taiwan',
    		'Tajikistan',
    		'Tanzania',
    		'Thailand',
    		'Togo',
    		'Tokelau',
    		'Tonga',
    		'Trinidad and Tobago',
    		'Tunisia',
    		'Turkey',
    		'Turkmenistan',
    		'Turks and Caicos Islands',
    		'Tuvalu',
    		'Uganda',
    		'Ukraine',
    		'United Arab Emirates',
    		'United Kingdom',
    		'United States',
    		'Uruguay',
    		'Uzbekistan',
    		'Vanuatu',
    		'Vatican City',
    		'Vietnam',
    		'Venezuela',
    		'Wallis and Futuna',
    		'Western Sahara',
    		'Yemen',
    		'Zambia',
    		'Zimbabwe'
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Countries> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ countries });

    	$$self.$inject_state = $$props => {
    		if ('countries' in $$props) $$invalidate(0, countries = $$props.countries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [countries];
    }

    class Countries extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Countries",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Recaptcha.svelte generated by Svelte v3.55.1 */

    const file$4 = "src\\components\\Recaptcha.svelte";

    function create_fragment$5(ctx) {
    	let script;
    	let script_src_value;

    	const block = {
    		c: function create() {
    			script = element("script");
    			if (!src_url_equal(script.src, script_src_value = "https://www.google.com/recaptcha/api.js?render=" + key)) attr_dev(script, "src", script_src_value);
    			script.async = true;
    			script.defer = true;
    			add_location(script, file$4, 28, 2, 506);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const key = "6LelNBYkAAAAAJUEuyoax3If2Oamnoca0NtSYTkS";

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recaptcha', slots, []);

    	let State = {
    		idle: "idle",
    		requesting: "requesting",
    		success: "success"
    	};

    	let token;
    	let state = State.idle;

    	function onSubmit() {
    		state = State.requesting;
    		doRecaptcha();
    	}

    	function doRecaptcha() {
    		grecaptcha.ready(function () {
    			grecaptcha.execute(key, { action: "submit" }).then(function (t) {
    				state = State.success;
    				token = t;
    			});
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Recaptcha> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		key,
    		State,
    		token,
    		state,
    		onSubmit,
    		doRecaptcha
    	});

    	$$self.$inject_state = $$props => {
    		if ('State' in $$props) State = $$props.State;
    		if ('token' in $$props) token = $$props.token;
    		if ('state' in $$props) state = $$props.state;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Recaptcha extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recaptcha",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\Form.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file$3 = "src\\components\\Form.svelte";

    function create_fragment$4(ctx) {
    	let form;
    	let input0;
    	let t0;
    	let div0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let input3;
    	let input3_value_value;
    	let t3;
    	let div1;
    	let input4;
    	let t4;
    	let div2;
    	let textarea;
    	let t5;
    	let div3;
    	let label;
    	let t7;
    	let select;
    	let option;
    	let countries;
    	let t9;
    	let input5;
    	let input5_value_value;
    	let t10;
    	let input6;
    	let t11;
    	let input7;
    	let t12;
    	let input8;
    	let t13;
    	let recaptcha;
    	let t14;
    	let div4;
    	let pre;
    	let t15;
    	let t16_value = JSON.stringify(/*formValues*/ ctx[0], null, 2) + "";
    	let t16;
    	let t17;
    	let current;
    	let mounted;
    	let dispose;
    	countries = new Countries({ $$inline: true });
    	recaptcha = new Recaptcha({ $$inline: true });

    	const block = {
    		c: function create() {
    			form = element("form");
    			input0 = element("input");
    			t0 = space();
    			div0 = element("div");
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			input3 = element("input");
    			t3 = space();
    			div1 = element("div");
    			input4 = element("input");
    			t4 = space();
    			div2 = element("div");
    			textarea = element("textarea");
    			t5 = space();
    			div3 = element("div");
    			label = element("label");
    			label.textContent = "Country";
    			t7 = space();
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select a country";
    			create_component(countries.$$.fragment);
    			t9 = space();
    			input5 = element("input");
    			t10 = space();
    			input6 = element("input");
    			t11 = space();
    			input7 = element("input");
    			t12 = space();
    			input8 = element("input");
    			t13 = space();
    			create_component(recaptcha.$$.fragment);
    			t14 = space();
    			div4 = element("div");
    			pre = element("pre");
    			t15 = text("        ");
    			t16 = text(t16_value);
    			t17 = text("\r\n    ");
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "accessKey");
    			input0.value = "7cb6f557-c5cd-4476-80d5-bcc8612cc3c3";
    			add_location(input0, file$3, 18, 4, 396);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "name");
    			attr_dev(input1, "placeholder", "Name");
    			add_location(input1, file$3, 20, 8, 500);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "placeholder", "Email");
    			add_location(input2, file$3, 21, 8, 589);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "name", "email");
    			attr_dev(input3, "placeholder", "Email");
    			input3.value = input3_value_value = /*formValues*/ ctx[0].email;
    			set_style(input3, "display", "None");
    			add_location(input3, file$3, 22, 8, 669);
    			add_location(div0, file$3, 19, 4, 485);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "name", "subject");
    			attr_dev(input4, "size", "78");
    			attr_dev(input4, "placeholder", "Subject");
    			add_location(input4, file$3, 25, 8, 800);
    			add_location(div1, file$3, 24, 4, 785);
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "cols", "80");
    			attr_dev(textarea, "placeholder", "Message");
    			attr_dev(textarea, "class", "svelte-1beppy5");
    			add_location(textarea, file$3, 28, 8, 931);
    			add_location(div2, file$3, 27, 4, 916);
    			attr_dev(label, "for", "country");
    			add_location(label, file$3, 31, 8, 1074);
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$3, 33, 12, 1155);
    			attr_dev(select, "id", "country");
    			add_location(select, file$3, 32, 8, 1120);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "name", "$country");
    			input5.value = input5_value_value = /*formValues*/ ctx[0].country;
    			set_style(input5, "display", "None");
    			add_location(input5, file$3, 36, 8, 1252);
    			attr_dev(input6, "id", "submitButton");
    			set_style(input6, "margin-left", "290px");
    			attr_dev(input6, "type", "submit");
    			input6.value = "Send";
    			add_location(input6, file$3, 37, 8, 1345);
    			add_location(div3, file$3, 30, 4, 1059);
    			attr_dev(input7, "type", "hidden");
    			attr_dev(input7, "name", "replyTo");
    			input7.value = "@";
    			add_location(input7, file$3, 39, 4, 1445);
    			attr_dev(input8, "type", "text");
    			attr_dev(input8, "name", "honeypot");
    			set_style(input8, "display", "none");
    			add_location(input8, file$3, 41, 4, 1595);
    			attr_dev(form, "action", "https://api.staticforms.xyz/submit");
    			attr_dev(form, "method", "post");
    			add_location(form, file$3, 17, 0, 326);
    			add_location(pre, file$3, 46, 4, 1697);
    			add_location(div4, file$3, 45, 0, 1686);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input0);
    			append_dev(form, t0);
    			append_dev(form, div0);
    			append_dev(div0, input1);
    			set_input_value(input1, /*formValues*/ ctx[0].name);
    			append_dev(div0, t1);
    			append_dev(div0, input2);
    			set_input_value(input2, /*formValues*/ ctx[0].email);
    			append_dev(div0, t2);
    			append_dev(div0, input3);
    			append_dev(form, t3);
    			append_dev(form, div1);
    			append_dev(div1, input4);
    			set_input_value(input4, /*formValues*/ ctx[0].subject);
    			append_dev(form, t4);
    			append_dev(form, div2);
    			append_dev(div2, textarea);
    			set_input_value(textarea, /*formValues*/ ctx[0].message);
    			append_dev(form, t5);
    			append_dev(form, div3);
    			append_dev(div3, label);
    			append_dev(div3, t7);
    			append_dev(div3, select);
    			append_dev(select, option);
    			mount_component(countries, select, null);
    			append_dev(div3, t9);
    			append_dev(div3, input5);
    			append_dev(div3, t10);
    			append_dev(div3, input6);
    			append_dev(form, t11);
    			append_dev(form, input7);
    			append_dev(form, t12);
    			append_dev(form, input8);
    			append_dev(form, t13);
    			mount_component(recaptcha, form, null);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, pre);
    			append_dev(pre, t15);
    			append_dev(pre, t16);
    			append_dev(pre, t17);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[1]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[2]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[3]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[4])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*formValues*/ 1 && input1.value !== /*formValues*/ ctx[0].name) {
    				set_input_value(input1, /*formValues*/ ctx[0].name);
    			}

    			if (dirty & /*formValues*/ 1 && input2.value !== /*formValues*/ ctx[0].email) {
    				set_input_value(input2, /*formValues*/ ctx[0].email);
    			}

    			if (!current || dirty & /*formValues*/ 1 && input3_value_value !== (input3_value_value = /*formValues*/ ctx[0].email) && input3.value !== input3_value_value) {
    				prop_dev(input3, "value", input3_value_value);
    			}

    			if (dirty & /*formValues*/ 1 && input4.value !== /*formValues*/ ctx[0].subject) {
    				set_input_value(input4, /*formValues*/ ctx[0].subject);
    			}

    			if (dirty & /*formValues*/ 1) {
    				set_input_value(textarea, /*formValues*/ ctx[0].message);
    			}

    			if (!current || dirty & /*formValues*/ 1 && input5_value_value !== (input5_value_value = /*formValues*/ ctx[0].country) && input5.value !== input5_value_value) {
    				prop_dev(input5, "value", input5_value_value);
    			}

    			if ((!current || dirty & /*formValues*/ 1) && t16_value !== (t16_value = JSON.stringify(/*formValues*/ ctx[0], null, 2) + "")) set_data_dev(t16, t16_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(countries.$$.fragment, local);
    			transition_in(recaptcha.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(countries.$$.fragment, local);
    			transition_out(recaptcha.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(countries);
    			destroy_component(recaptcha);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form', slots, []);

    	const formValues = {
    		name: "",
    		email: "",
    		subject: "",
    		message: "",
    		country: ""
    	};

    	var w = window.innerWidth;
    	console.log(w);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		formValues.name = this.value;
    		$$invalidate(0, formValues);
    	}

    	function input2_input_handler() {
    		formValues.email = this.value;
    		$$invalidate(0, formValues);
    	}

    	function input4_input_handler() {
    		formValues.subject = this.value;
    		$$invalidate(0, formValues);
    	}

    	function textarea_input_handler() {
    		formValues.message = this.value;
    		$$invalidate(0, formValues);
    	}

    	$$self.$capture_state = () => ({
    		Countries,
    		Counter,
    		Recaptcha,
    		formValues,
    		w
    	});

    	$$self.$inject_state = $$props => {
    		if ('w' in $$props) w = $$props.w;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formValues,
    		input1_input_handler,
    		input2_input_handler,
    		input4_input_handler,
    		textarea_input_handler
    	];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Contact.svelte generated by Svelte v3.55.1 */
    const file$2 = "src\\components\\Contact.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let div;
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let form;
    	let current;
    	form = new Form({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Contact";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "You can send me a message using this form";
    			t3 = space();
    			create_component(form.$$.fragment);
    			set_style(h1, "line-height", ".5");
    			attr_dev(h1, "class", "svelte-10bqzan");
    			add_location(h1, file$2, 6, 8, 131);
    			attr_dev(h2, "class", "svelte-10bqzan");
    			add_location(h2, file$2, 7, 8, 182);
    			add_location(div, file$2, 5, 4, 116);
    			attr_dev(section, "id", "Contact");
    			set_style(section, "margin-left", "20%");
    			add_location(section, file$2, 4, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, h2);
    			append_dev(section, t3);
    			mount_component(form, section, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Form });
    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.55.1 */

    const file$1 = "src\\components\\Footer.svelte";

    function create_fragment$2(ctx) {
    	let footer;
    	let p10;
    	let t1;
    	let p11;
    	let t3;
    	let p12;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			p10 = element("p1");
    			p10.textContent = "Dominik Sukic 2023";
    			t1 = space();
    			p11 = element("p1");
    			p11.textContent = "Dominik Sukic 2023";
    			t3 = space();
    			p12 = element("p1");
    			p12.textContent = "Dominik Sukic 2023";
    			attr_dev(p10, "class", "footer svelte-pp3v06");
    			add_location(p10, file$1, 1, 4, 14);
    			attr_dev(p11, "class", "footer svelte-pp3v06");
    			add_location(p11, file$1, 2, 4, 62);
    			attr_dev(p12, "class", "footer svelte-pp3v06");
    			add_location(p12, file$1, 3, 4, 110);
    			attr_dev(footer, "class", "svelte-pp3v06");
    			add_location(footer, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p10);
    			append_dev(footer, t1);
    			append_dev(footer, p11);
    			append_dev(footer, t3);
    			append_dev(footer, p12);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Homepage.svelte generated by Svelte v3.55.1 */
    const file = "src\\Homepage.svelte";

    // (14:1) <Repeat>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("TEST");
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(14:1) <Repeat>",
    		ctx
    	});

    	return block;
    }

    // (16:1) <Repeat>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("TEST");
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(16:1) <Repeat>",
    		ctx
    	});

    	return block;
    }

    // (18:1) <Repeat>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("TEST");
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
    		source: "(18:1) <Repeat>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let header;
    	let t0;
    	let navbar;
    	let t1;
    	let repeat0;
    	let t2;
    	let h1;
    	let t4;
    	let repeat1;
    	let t5;
    	let projects;
    	let t6;
    	let repeat2;
    	let t7;
    	let contact;
    	let t8;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });
    	navbar = new Navbar({ $$inline: true });

    	repeat0 = new Repeat({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	repeat1 = new Repeat({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	projects = new Projects({ $$inline: true });

    	repeat2 = new Repeat({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			create_component(repeat0.$$.fragment);
    			t2 = space();
    			h1 = element("h1");
    			h1.textContent = "Design";
    			t4 = space();
    			create_component(repeat1.$$.fragment);
    			t5 = space();
    			create_component(projects.$$.fragment);
    			t6 = space();
    			create_component(repeat2.$$.fragment);
    			t7 = space();
    			create_component(contact.$$.fragment);
    			t8 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h1, "id", "Design");
    			attr_dev(h1, "class", "svelte-d2aly4");
    			add_location(h1, file, 14, 1, 400);
    			attr_dev(main, "class", "svelte-d2aly4");
    			add_location(main, file, 9, 0, 341);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(navbar, main, null);
    			append_dev(main, t1);
    			mount_component(repeat0, main, null);
    			append_dev(main, t2);
    			append_dev(main, h1);
    			append_dev(main, t4);
    			mount_component(repeat1, main, null);
    			append_dev(main, t5);
    			mount_component(projects, main, null);
    			append_dev(main, t6);
    			mount_component(repeat2, main, null);
    			append_dev(main, t7);
    			mount_component(contact, main, null);
    			append_dev(main, t8);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const repeat0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				repeat0_changes.$$scope = { dirty, ctx };
    			}

    			repeat0.$set(repeat0_changes);
    			const repeat1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				repeat1_changes.$$scope = { dirty, ctx };
    			}

    			repeat1.$set(repeat1_changes);
    			const repeat2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				repeat2_changes.$$scope = { dirty, ctx };
    			}

    			repeat2.$set(repeat2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(navbar.$$.fragment, local);
    			transition_in(repeat0.$$.fragment, local);
    			transition_in(repeat1.$$.fragment, local);
    			transition_in(projects.$$.fragment, local);
    			transition_in(repeat2.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(navbar.$$.fragment, local);
    			transition_out(repeat0.$$.fragment, local);
    			transition_out(repeat1.$$.fragment, local);
    			transition_out(projects.$$.fragment, local);
    			transition_out(repeat2.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(navbar);
    			destroy_component(repeat0);
    			destroy_component(repeat1);
    			destroy_component(projects);
    			destroy_component(repeat2);
    			destroy_component(contact);
    			destroy_component(footer);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Homepage', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Homepage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Header,
    		Repeat,
    		Projects,
    		Contact,
    		Footer
    	});

    	return [];
    }

    class Homepage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Homepage",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.55.1 */

    function create_fragment(ctx) {
    	let homepage;
    	let current;
    	homepage = new Homepage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(homepage.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(homepage, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(homepage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(homepage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(homepage, detaching);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Homepage });
    	return [];
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

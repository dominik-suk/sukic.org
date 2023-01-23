
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

    const file$a = "src\\components\\Navbar.svelte";

    function create_fragment$b(ctx) {
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
    			add_location(a0, file$a, 14, 18, 363);
    			attr_dev(li0, "id", "Home");
    			attr_dev(li0, "class", "svelte-6ws5mf");
    			add_location(li0, file$a, 14, 4, 349);
    			attr_dev(a1, "href", "#Design");
    			attr_dev(a1, "class", "svelte-6ws5mf");
    			add_location(a1, file$a, 15, 8, 431);
    			attr_dev(li1, "class", "svelte-6ws5mf");
    			add_location(li1, file$a, 15, 4, 427);
    			attr_dev(a2, "href", "#Projects");
    			attr_dev(a2, "class", "svelte-6ws5mf");
    			add_location(a2, file$a, 16, 8, 503);
    			attr_dev(li2, "class", "svelte-6ws5mf");
    			add_location(li2, file$a, 16, 4, 499);
    			attr_dev(a3, "href", "#Contact");
    			attr_dev(a3, "class", "svelte-6ws5mf");
    			add_location(a3, file$a, 17, 30, 601);
    			set_style(li3, "float", "right");
    			attr_dev(li3, "class", "svelte-6ws5mf");
    			add_location(li3, file$a, 17, 4, 575);
    			attr_dev(ul, "class", "navbar svelte-6ws5mf");
    			add_location(ul, file$a, 13, 0, 324);
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
    		id: create_fragment$b.name,
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

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Darkmode.svelte generated by Svelte v3.55.1 */

    const file$9 = "src\\components\\Darkmode.svelte";

    function create_fragment$a(ctx) {
    	let button;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			span.textContent = "Darkmode";
    			attr_dev(span, "class", "svelte-563vtu");
    			add_location(span, file$9, 14, 55, 431);
    			attr_dev(button, "class", "custom-btn btn-3 svelte-563vtu");
    			add_location(button, file$9, 14, 4, 380);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Darkmode', slots, []);
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Darkmode> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ darkmode, toggle });

    	$$self.$inject_state = $$props => {
    		if ('darkmode' in $$props) darkmode = $$props.darkmode;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [toggle];
    }

    class Darkmode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Darkmode",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\Header.svelte generated by Svelte v3.55.1 */
    const file$8 = "src\\components\\Header.svelte";

    function create_fragment$9(ctx) {
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
    			if (!src_url_equal(img.src, img_src_value = "images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "DSukic logo");
    			attr_dev(img, "width", "115");
    			add_location(img, file$8, 5, 8, 134);
    			attr_dev(li0, "class", "svelte-1yxpgfw");
    			add_location(li0, file$8, 5, 4, 130);
    			set_style(li1, "padding-left", "84%");
    			set_style(li1, "padding-bottom", "2%");
    			attr_dev(li1, "class", "svelte-1yxpgfw");
    			add_location(li1, file$8, 6, 4, 233);
    			attr_dev(ul, "class", "top svelte-1yxpgfw");
    			set_style(ul, "position", "unset");
    			set_style(ul, "padding-top", "1%");
    			add_location(ul, file$8, 4, 0, 69);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\Repeat.svelte generated by Svelte v3.55.1 */

    const file$7 = "src\\components\\Repeat.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (8:0) {#each repititions as None}
    function create_each_block$1(ctx) {
    	let h1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "class", "svelte-1kvpq3u");
    			add_location(h1, file$7, 8, 0, 137);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(8:0) {#each repititions as None}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*repititions*/ ctx[0];
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Repeat",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\Countries.svelte generated by Svelte v3.55.1 */

    const file$6 = "src\\components\\Countries.svelte";

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
    			add_location(option, file$6, 25, 4, 3404);
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

    function create_fragment$7(ctx) {
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Countries",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\Counter.svelte generated by Svelte v3.55.1 */

    const file$5 = "src\\components\\Counter.svelte";

    // (17:0) {:else}
    function create_else_block(ctx) {
    	let h3;
    	let t_value = " " + /*seconds*/ ctx[0] + " second" + "";
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			t = text(t_value);
    			attr_dev(h3, "id", "timerMessage");
    			add_location(h3, file$5, 17, 4, 481);
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

    			if ((!current || dirty & /*seconds*/ 1) && t_value !== (t_value = " " + /*seconds*/ ctx[0] + " second" + "")) set_data_dev(t, t_value);
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(17:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if seconds > 5}
    function create_if_block(ctx) {
    	let h3;
    	let t_value = " " + /*seconds*/ ctx[0] + " seconds" + "";
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			t = text(t_value);
    			attr_dev(h3, "id", "timerMessage");
    			set_style(h3, "display", "None");
    			add_location(h3, file$5, 15, 4, 381);
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

    			if ((!current || dirty & /*seconds*/ 1) && t_value !== (t_value = " " + /*seconds*/ ctx[0] + " seconds" + "")) set_data_dev(t, t_value);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(15:0) {#if seconds > 5}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let button;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*seconds*/ ctx[0] > 5) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Test";
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(button, file$5, 12, 0, 316);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*timer*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
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

    const initial = 10;

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Counter', slots, ['default']);
    	let seconds = initial;

    	function timer() {
    		document.getElementById("timerMessage").style = "display: Unset;";

    		for (let i = initial; i >= 0; i--) {
    			setTimeout(
    				() => {
    					$$invalidate(0, seconds = i);
    				},
    				(initial - i) * 1000
    			);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Counter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ initial, seconds, timer });

    	$$self.$inject_state = $$props => {
    		if ('seconds' in $$props) $$invalidate(0, seconds = $$props.seconds);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [seconds, timer, $$scope, slots];
    }

    class Counter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Counter",
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

    // (45:0) <Counter>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("You can send another message in");
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(45:0) <Counter>",
    		ctx
    	});

    	return block;
    }

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
    	let counter;
    	let t15;
    	let div4;
    	let pre;
    	let t16;
    	let t17_value = JSON.stringify(/*formValues*/ ctx[0], null, 2) + "";
    	let t17;
    	let t18;
    	let current;
    	let mounted;
    	let dispose;
    	countries = new Countries({ $$inline: true });
    	recaptcha = new Recaptcha({ $$inline: true });

    	counter = new Counter({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

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
    			create_component(counter.$$.fragment);
    			t15 = space();
    			div4 = element("div");
    			pre = element("pre");
    			t16 = text("        ");
    			t17 = text(t17_value);
    			t18 = text("\r\n    ");
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "accessKey");
    			input0.value = "7cb6f557-c5cd-4476-80d5-bcc8612cc3c3";
    			add_location(input0, file$3, 17, 4, 394);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "name");
    			attr_dev(input1, "placeholder", "Name");
    			add_location(input1, file$3, 19, 8, 498);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "placeholder", "Email");
    			add_location(input2, file$3, 20, 8, 587);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "name", "email");
    			attr_dev(input3, "placeholder", "Email");
    			input3.value = input3_value_value = /*formValues*/ ctx[0].email;
    			set_style(input3, "display", "None");
    			add_location(input3, file$3, 21, 8, 667);
    			add_location(div0, file$3, 18, 4, 483);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "name", "subject");
    			attr_dev(input4, "size", "78");
    			attr_dev(input4, "placeholder", "Subject");
    			add_location(input4, file$3, 24, 8, 798);
    			add_location(div1, file$3, 23, 4, 783);
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "cols", "80");
    			attr_dev(textarea, "placeholder", "Message");
    			attr_dev(textarea, "class", "svelte-1beppy5");
    			add_location(textarea, file$3, 27, 8, 929);
    			add_location(div2, file$3, 26, 4, 914);
    			attr_dev(label, "for", "country");
    			add_location(label, file$3, 30, 8, 1072);
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$3, 32, 12, 1153);
    			attr_dev(select, "id", "country");
    			add_location(select, file$3, 31, 8, 1118);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "name", "$country");
    			input5.value = input5_value_value = /*formValues*/ ctx[0].country;
    			set_style(input5, "display", "None");
    			add_location(input5, file$3, 35, 8, 1250);
    			attr_dev(input6, "id", "submitButton");
    			set_style(input6, "margin-left", "290px");
    			attr_dev(input6, "type", "submit");
    			input6.value = "Send";
    			add_location(input6, file$3, 36, 8, 1343);
    			add_location(div3, file$3, 29, 4, 1057);
    			attr_dev(input7, "type", "hidden");
    			attr_dev(input7, "name", "replyTo");
    			input7.value = "@";
    			add_location(input7, file$3, 38, 4, 1443);
    			attr_dev(input8, "type", "text");
    			attr_dev(input8, "name", "honeypot");
    			set_style(input8, "display", "none");
    			add_location(input8, file$3, 40, 4, 1593);
    			attr_dev(form, "action", "https://api.staticforms.xyz/submit");
    			attr_dev(form, "method", "post");
    			add_location(form, file$3, 16, 0, 324);
    			add_location(pre, file$3, 47, 4, 1749);
    			add_location(div4, file$3, 46, 0, 1738);
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
    			mount_component(counter, target, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, pre);
    			append_dev(pre, t16);
    			append_dev(pre, t17);
    			append_dev(pre, t18);
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

    			const counter_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				counter_changes.$$scope = { dirty, ctx };
    			}

    			counter.$set(counter_changes);
    			if ((!current || dirty & /*formValues*/ 1) && t17_value !== (t17_value = JSON.stringify(/*formValues*/ ctx[0], null, 2) + "")) set_data_dev(t17, t17_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(countries.$$.fragment, local);
    			transition_in(recaptcha.$$.fragment, local);
    			transition_in(counter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(countries.$$.fragment, local);
    			transition_out(recaptcha.$$.fragment, local);
    			transition_out(counter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(countries);
    			destroy_component(recaptcha);
    			if (detaching) detach_dev(t14);
    			destroy_component(counter, detaching);
    			if (detaching) detach_dev(t15);
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

    // (13:1) <Repeat>
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
    		source: "(13:1) <Repeat>",
    		ctx
    	});

    	return block;
    }

    // (15:1) <Repeat>
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
    		source: "(15:1) <Repeat>",
    		ctx
    	});

    	return block;
    }

    // (17:1) <Repeat>
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
    		source: "(17:1) <Repeat>",
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
    	let h10;
    	let t3;
    	let repeat0;
    	let t4;
    	let h11;
    	let t6;
    	let repeat1;
    	let t7;
    	let h12;
    	let t9;
    	let repeat2;
    	let t10;
    	let contact;
    	let t11;
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
    			h10 = element("h1");
    			h10.textContent = "HALLO";
    			t3 = space();
    			create_component(repeat0.$$.fragment);
    			t4 = space();
    			h11 = element("h1");
    			h11.textContent = "Design";
    			t6 = space();
    			create_component(repeat1.$$.fragment);
    			t7 = space();
    			h12 = element("h1");
    			h12.textContent = "Projects";
    			t9 = space();
    			create_component(repeat2.$$.fragment);
    			t10 = space();
    			create_component(contact.$$.fragment);
    			t11 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h10, "class", "svelte-d2aly4");
    			add_location(h10, file, 11, 1, 321);
    			attr_dev(h11, "id", "Design");
    			attr_dev(h11, "class", "svelte-d2aly4");
    			add_location(h11, file, 13, 1, 362);
    			attr_dev(h12, "id", "Projects");
    			attr_dev(h12, "class", "svelte-d2aly4");
    			add_location(h12, file, 15, 1, 416);
    			attr_dev(main, "class", "svelte-d2aly4");
    			add_location(main, file, 8, 0, 286);
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
    			append_dev(main, h10);
    			append_dev(main, t3);
    			mount_component(repeat0, main, null);
    			append_dev(main, t4);
    			append_dev(main, h11);
    			append_dev(main, t6);
    			mount_component(repeat1, main, null);
    			append_dev(main, t7);
    			append_dev(main, h12);
    			append_dev(main, t9);
    			mount_component(repeat2, main, null);
    			append_dev(main, t10);
    			mount_component(contact, main, null);
    			append_dev(main, t11);
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

    	$$self.$capture_state = () => ({ Navbar, Header, Repeat, Contact, Footer });
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

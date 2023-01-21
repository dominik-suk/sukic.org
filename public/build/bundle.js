
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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

    /* src\Button.svelte generated by Svelte v3.55.1 */

    const file$1 = "src\\Button.svelte";

    function create_fragment$1(ctx) {
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
    			attr_dev(span, "class", "svelte-563vtu");
    			add_location(span, file$1, 14, 55, 431);
    			attr_dev(button, "class", "custom-btn btn-3 svelte-563vtu");
    			add_location(button, file$1, 14, 4, 380);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.55.1 */

    const { document: document_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (78:51) <Button>
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
    		source: "(78:51) <Button>",
    		ctx
    	});

    	return block;
    }

    // (88:1) {#each test as t}
    function create_each_block_3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "TEST";
    			attr_dev(h1, "class", "svelte-1koxhyx");
    			add_location(h1, file, 88, 2, 5350);
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
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(88:1) {#each test as t}",
    		ctx
    	});

    	return block;
    }

    // (92:1) {#each test as t}
    function create_each_block_2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "TEST";
    			attr_dev(h1, "class", "svelte-1koxhyx");
    			add_location(h1, file, 92, 2, 5427);
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
    		source: "(92:1) {#each test as t}",
    		ctx
    	});

    	return block;
    }

    // (96:1) {#each test as t}
    function create_each_block_1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "TEST";
    			attr_dev(h1, "class", "svelte-1koxhyx");
    			add_location(h1, file, 96, 2, 5508);
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
    		source: "(96:1) {#each test as t}",
    		ctx
    	});

    	return block;
    }

    // (123:4) {#each countries as country}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*country*/ ctx[13] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*country*/ ctx[13];
    			option.value = option.__value;
    			add_location(option, file, 123, 5, 6741);
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
    		source: "(123:4) {#each countries as country}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let ul0;
    	let li0;
    	let img;
    	let img_src_value;
    	let t1;
    	let li1;
    	let button;
    	let t2;
    	let ul1;
    	let li2;
    	let a0;
    	let t4;
    	let li3;
    	let a1;
    	let t6;
    	let li4;
    	let a2;
    	let t8;
    	let li5;
    	let a3;
    	let t10;
    	let t11;
    	let h10;
    	let t13;
    	let t14;
    	let h11;
    	let t16;
    	let t17;
    	let section;
    	let div0;
    	let h12;
    	let t19;
    	let h2;
    	let t21;
    	let form;
    	let input0;
    	let t22;
    	let div1;
    	let input1;
    	let t23;
    	let input2;
    	let t24;
    	let input3;
    	let input3_value_value;
    	let t25;
    	let div2;
    	let input4;
    	let t26;
    	let div3;
    	let textarea;
    	let t27;
    	let div4;
    	let label;
    	let t29;
    	let select;
    	let option;
    	let t31;
    	let input5;
    	let input5_value_value;
    	let t32;
    	let input6;
    	let t33;
    	let input7;
    	let t34;
    	let input8;
    	let t35;
    	let input9;
    	let t36;
    	let div5;
    	let pre;
    	let t37;
    	let t38_value = JSON.stringify(/*formValues*/ ctx[2], null, 2) + "";
    	let t38;
    	let t39;
    	let t40;
    	let div6;
    	let t41;
    	let t42;
    	let t43;
    	let br;
    	let t44;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_3 = /*test*/ ctx[5];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*test*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*test*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*countries*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			ul0 = element("ul");
    			li0 = element("li");
    			img = element("img");
    			t1 = space();
    			li1 = element("li");
    			create_component(button.$$.fragment);
    			t2 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t4 = space();
    			li3 = element("li");
    			a1 = element("a");
    			a1.textContent = "Design";
    			t6 = space();
    			li4 = element("li");
    			a2 = element("a");
    			a2.textContent = "Projects";
    			t8 = space();
    			li5 = element("li");
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t10 = space();

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t11 = space();
    			h10 = element("h1");
    			h10.textContent = "Design";
    			t13 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t14 = space();
    			h11 = element("h1");
    			h11.textContent = "Projects";
    			t16 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t17 = space();
    			section = element("section");
    			div0 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Contact";
    			t19 = space();
    			h2 = element("h2");
    			h2.textContent = "You can send me a message using this form";
    			t21 = space();
    			form = element("form");
    			input0 = element("input");
    			t22 = space();
    			div1 = element("div");
    			input1 = element("input");
    			t23 = space();
    			input2 = element("input");
    			t24 = space();
    			input3 = element("input");
    			t25 = space();
    			div2 = element("div");
    			input4 = element("input");
    			t26 = space();
    			div3 = element("div");
    			textarea = element("textarea");
    			t27 = space();
    			div4 = element("div");
    			label = element("label");
    			label.textContent = "Country";
    			t29 = space();
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select a country";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t31 = space();
    			input5 = element("input");
    			t32 = space();
    			input6 = element("input");
    			t33 = space();
    			input7 = element("input");
    			t34 = space();
    			input8 = element("input");
    			t35 = space();
    			input9 = element("input");
    			t36 = space();
    			div5 = element("div");
    			pre = element("pre");
    			t37 = text("\t\t\t");
    			t38 = text(t38_value);
    			t39 = text("\r\n\t\t");
    			t40 = space();
    			div6 = element("div");
    			t41 = text("state: ");
    			t42 = text(/*state*/ ctx[1]);
    			t43 = text("\r\n\t\ttoken: ");
    			br = element("br");
    			t44 = text(/*token*/ ctx[0]);
    			if (!src_url_equal(script.src, script_src_value = "https://www.google.com/recaptcha/api.js?render=" + key)) attr_dev(script, "src", script_src_value);
    			script.async = true;
    			script.defer = true;
    			add_location(script, file, 71, 2, 4626);
    			attr_dev(img, "id", "logo");
    			attr_dev(img, "href", "../App.svelte");
    			if (!src_url_equal(img.src, img_src_value = "images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "DSukic logo");
    			attr_dev(img, "width", "115");
    			add_location(img, file, 76, 6, 4794);
    			attr_dev(li0, "class", "svelte-1koxhyx");
    			add_location(li0, file, 76, 2, 4790);
    			set_style(li1, "padding-left", "84%");
    			set_style(li1, "padding-bottom", "2%");
    			attr_dev(li1, "class", "svelte-1koxhyx");
    			add_location(li1, file, 77, 2, 4891);
    			set_style(ul0, "position", "unset");
    			set_style(ul0, "padding-top", "1%");
    			attr_dev(ul0, "class", "svelte-1koxhyx");
    			add_location(ul0, file, 75, 1, 4743);
    			attr_dev(a0, "href", "#Home");
    			attr_dev(a0, "class", "svelte-1koxhyx");
    			add_location(a0, file, 81, 16, 5020);
    			attr_dev(li2, "id", "Home");
    			attr_dev(li2, "class", "svelte-1koxhyx");
    			add_location(li2, file, 81, 2, 5006);
    			attr_dev(a1, "href", "#Design");
    			attr_dev(a1, "class", "svelte-1koxhyx");
    			add_location(a1, file, 82, 6, 5086);
    			attr_dev(li3, "class", "svelte-1koxhyx");
    			add_location(li3, file, 82, 2, 5082);
    			attr_dev(a2, "href", "#Projects");
    			attr_dev(a2, "class", "svelte-1koxhyx");
    			add_location(a2, file, 83, 6, 5156);
    			attr_dev(li4, "class", "svelte-1koxhyx");
    			add_location(li4, file, 83, 2, 5152);
    			attr_dev(a3, "href", "#Contact");
    			attr_dev(a3, "class", "svelte-1koxhyx");
    			add_location(a3, file, 84, 28, 5252);
    			set_style(li5, "float", "right");
    			attr_dev(li5, "class", "svelte-1koxhyx");
    			add_location(li5, file, 84, 2, 5226);
    			attr_dev(ul1, "class", "navbar svelte-1koxhyx");
    			add_location(ul1, file, 80, 1, 4983);
    			attr_dev(h10, "id", "Design");
    			attr_dev(h10, "class", "svelte-1koxhyx");
    			add_location(h10, file, 90, 1, 5376);
    			attr_dev(h11, "id", "Projects");
    			attr_dev(h11, "class", "svelte-1koxhyx");
    			add_location(h11, file, 94, 1, 5453);
    			set_style(h12, "line-height", ".5");
    			attr_dev(h12, "class", "svelte-1koxhyx");
    			add_location(h12, file, 101, 3, 5598);
    			attr_dev(h2, "class", "svelte-1koxhyx");
    			add_location(h2, file, 102, 3, 5644);
    			add_location(div0, file, 100, 2, 5588);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "accessKey");
    			input0.value = "7cb6f557-c5cd-4476-80d5-bcc8612cc3c3";
    			add_location(input0, file, 106, 8, 5822);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "name");
    			attr_dev(input1, "placeholder", "Name");
    			add_location(input1, file, 108, 3, 5937);
    			attr_dev(input2, "type", "email");
    			attr_dev(input2, "placeholder", "Email");
    			add_location(input2, file, 109, 3, 6039);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "name", "email");
    			attr_dev(input3, "placeholder", "Email");
    			input3.value = input3_value_value = /*formValues*/ ctx[2].email;
    			set_style(input3, "display", "None");
    			add_location(input3, file, 110, 3, 6114);
    			add_location(div1, file, 107, 2, 5927);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "name", "subject");
    			attr_dev(input4, "size", "78");
    			attr_dev(input4, "placeholder", "Subject");
    			add_location(input4, file, 113, 3, 6254);
    			add_location(div2, file, 112, 2, 6244);
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "cols", "80");
    			attr_dev(textarea, "placeholder", "Message");
    			attr_dev(textarea, "class", "svelte-1koxhyx");
    			add_location(textarea, file, 116, 9, 6400);
    			add_location(div3, file, 115, 2, 6384);
    			attr_dev(label, "for", "country");
    			add_location(label, file, 119, 3, 6558);
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file, 121, 4, 6658);
    			attr_dev(select, "id", "country");
    			if (/*formValues*/ ctx[2].country === void 0) add_render_callback(() => /*select_change_handler*/ ctx[10].call(select));
    			add_location(select, file, 120, 3, 6599);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "name", "$country");
    			input5.value = input5_value_value = /*formValues*/ ctx[2].country;
    			set_style(input5, "display", "None");
    			add_location(input5, file, 126, 3, 6799);
    			attr_dev(input6, "id", "submitButton");
    			set_style(input6, "margin-left", "290px");
    			attr_dev(input6, "type", "submit");
    			input6.value = "Send";
    			add_location(input6, file, 128, 3, 6889);
    			add_location(div4, file, 118, 2, 6548);
    			attr_dev(input7, "type", "hidden");
    			attr_dev(input7, "name", "replyTo");
    			input7.value = "@";
    			add_location(input7, file, 130, 8, 6991);
    			attr_dev(input8, "type", "hidden");
    			attr_dev(input8, "name", "redirectTo");
    			input8.value = "https://sukic.org";
    			add_location(input8, file, 131, 8, 7065);
    			attr_dev(input9, "type", "text");
    			attr_dev(input9, "name", "honeypot");
    			set_style(input9, "display", "none");
    			add_location(input9, file, 132, 2, 7134);
    			attr_dev(form, "action", "https://api.staticforms.xyz/submit");
    			attr_dev(form, "method", "post");
    			add_location(form, file, 105, 4, 5712);
    			add_location(pre, file, 136, 2, 7347);
    			add_location(div5, file, 135, 1, 7338);
    			add_location(div6, file, 140, 2, 7417);
    			add_location(br, file, 141, 9, 7453);
    			attr_dev(section, "id", "Contact");
    			set_style(section, "margin-left", "20%");
    			add_location(section, file, 99, 1, 5536);
    			attr_dev(main, "class", "svelte-1koxhyx");
    			add_location(main, file, 74, 0, 4734);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, img);
    			append_dev(ul0, t1);
    			append_dev(ul0, li1);
    			mount_component(button, li1, null);
    			append_dev(main, t2);
    			append_dev(main, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, a0);
    			append_dev(ul1, t4);
    			append_dev(ul1, li3);
    			append_dev(li3, a1);
    			append_dev(ul1, t6);
    			append_dev(ul1, li4);
    			append_dev(li4, a2);
    			append_dev(ul1, t8);
    			append_dev(ul1, li5);
    			append_dev(li5, a3);
    			append_dev(main, t10);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(main, null);
    			}

    			append_dev(main, t11);
    			append_dev(main, h10);
    			append_dev(main, t13);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(main, null);
    			}

    			append_dev(main, t14);
    			append_dev(main, h11);
    			append_dev(main, t16);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(main, null);
    			}

    			append_dev(main, t17);
    			append_dev(main, section);
    			append_dev(section, div0);
    			append_dev(div0, h12);
    			append_dev(div0, t19);
    			append_dev(div0, h2);
    			append_dev(section, t21);
    			append_dev(section, form);
    			append_dev(form, input0);
    			append_dev(form, t22);
    			append_dev(form, div1);
    			append_dev(div1, input1);
    			set_input_value(input1, /*formValues*/ ctx[2].name);
    			append_dev(div1, t23);
    			append_dev(div1, input2);
    			set_input_value(input2, /*formValues*/ ctx[2].email);
    			append_dev(div1, t24);
    			append_dev(div1, input3);
    			append_dev(form, t25);
    			append_dev(form, div2);
    			append_dev(div2, input4);
    			set_input_value(input4, /*formValues*/ ctx[2].subject);
    			append_dev(form, t26);
    			append_dev(form, div3);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*formValues*/ ctx[2].message);
    			append_dev(form, t27);
    			append_dev(form, div4);
    			append_dev(div4, label);
    			append_dev(div4, t29);
    			append_dev(div4, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*formValues*/ ctx[2].country);
    			append_dev(div4, t31);
    			append_dev(div4, input5);
    			append_dev(div4, t32);
    			append_dev(div4, input6);
    			append_dev(form, t33);
    			append_dev(form, input7);
    			append_dev(form, t34);
    			append_dev(form, input8);
    			append_dev(form, t35);
    			append_dev(form, input9);
    			append_dev(section, t36);
    			append_dev(section, div5);
    			append_dev(div5, pre);
    			append_dev(pre, t37);
    			append_dev(pre, t38);
    			append_dev(pre, t39);
    			append_dev(section, t40);
    			append_dev(section, div6);
    			append_dev(div6, t41);
    			append_dev(div6, t42);
    			append_dev(section, t43);
    			append_dev(section, br);
    			append_dev(section, t44);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", handleAnchorClick, false, false, false),
    					listen_dev(a1, "click", handleAnchorClick, false, false, false),
    					listen_dev(a2, "click", handleAnchorClick, false, false, false),
    					listen_dev(a3, "click", handleAnchorClick, false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[8]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[9]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[10]),
    					listen_dev(form, "submit", prevent_default(/*onSubmit*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8388608) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*formValues, countries*/ 20 && input1.value !== /*formValues*/ ctx[2].name) {
    				set_input_value(input1, /*formValues*/ ctx[2].name);
    			}

    			if (dirty & /*formValues, countries*/ 20 && input2.value !== /*formValues*/ ctx[2].email) {
    				set_input_value(input2, /*formValues*/ ctx[2].email);
    			}

    			if (!current || dirty & /*formValues, countries*/ 20 && input3_value_value !== (input3_value_value = /*formValues*/ ctx[2].email) && input3.value !== input3_value_value) {
    				prop_dev(input3, "value", input3_value_value);
    			}

    			if (dirty & /*formValues, countries*/ 20 && input4.value !== /*formValues*/ ctx[2].subject) {
    				set_input_value(input4, /*formValues*/ ctx[2].subject);
    			}

    			if (dirty & /*formValues, countries*/ 20) {
    				set_input_value(textarea, /*formValues*/ ctx[2].message);
    			}

    			if (dirty & /*countries*/ 16) {
    				each_value = /*countries*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*formValues, countries*/ 20) {
    				select_option(select, /*formValues*/ ctx[2].country);
    			}

    			if (!current || dirty & /*formValues, countries*/ 20 && input5_value_value !== (input5_value_value = /*formValues*/ ctx[2].country) && input5.value !== input5_value_value) {
    				prop_dev(input5, "value", input5_value_value);
    			}

    			if ((!current || dirty & /*formValues*/ 4) && t38_value !== (t38_value = JSON.stringify(/*formValues*/ ctx[2], null, 2) + "")) set_data_dev(t38, t38_value);
    			if (!current || dirty & /*state*/ 2) set_data_dev(t42, /*state*/ ctx[1]);
    			if (!current || dirty & /*token*/ 1) set_data_dev(t44, /*token*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
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

    const key = "6LelNBYkAAAAAJUEuyoax3If2Oamnoca0NtSYTkS";

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

    	let State = {
    		idle: "idle",
    		requesting: "requesting",
    		success: "success"
    	};

    	let token;
    	let state = State.idle;

    	function onSubmit() {
    		$$invalidate(1, state = State.requesting);
    		doRecaptcha();
    	}

    	function doRecaptcha() {
    		grecaptcha.ready(function () {
    			grecaptcha.execute(key, { action: "submit" }).then(function (t) {
    				$$invalidate(1, state = State.success);
    				$$invalidate(0, token = t);

    				// document.getElementById("submitButton").style="display:None;";
    				timer();
    			});
    		});
    	}

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

    	const formValues = {
    		name: "",
    		email: "",
    		subject: "",
    		message: "",
    		country: ""
    	};

    	let test = [];

    	for (let i = 1; i < 11; i++) {
    		test.push(i);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		formValues.name = this.value;
    		$$invalidate(2, formValues);
    		$$invalidate(4, countries);
    	}

    	function input2_input_handler() {
    		formValues.email = this.value;
    		$$invalidate(2, formValues);
    		$$invalidate(4, countries);
    	}

    	function input4_input_handler() {
    		formValues.subject = this.value;
    		$$invalidate(2, formValues);
    		$$invalidate(4, countries);
    	}

    	function textarea_input_handler() {
    		formValues.message = this.value;
    		$$invalidate(2, formValues);
    		$$invalidate(4, countries);
    	}

    	function select_change_handler() {
    		formValues.country = select_value(this);
    		$$invalidate(2, formValues);
    		$$invalidate(4, countries);
    	}

    	$$self.$capture_state = () => ({
    		Button,
    		key,
    		State,
    		token,
    		state,
    		onSubmit,
    		doRecaptcha,
    		countries,
    		formValues,
    		handleAnchorClick,
    		test
    	});

    	$$self.$inject_state = $$props => {
    		if ('State' in $$props) State = $$props.State;
    		if ('token' in $$props) $$invalidate(0, token = $$props.token);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('countries' in $$props) $$invalidate(4, countries = $$props.countries);
    		if ('test' in $$props) $$invalidate(5, test = $$props.test);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		token,
    		state,
    		formValues,
    		onSubmit,
    		countries,
    		test,
    		input1_input_handler,
    		input2_input_handler,
    		input4_input_handler,
    		textarea_input_handler,
    		select_change_handler
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

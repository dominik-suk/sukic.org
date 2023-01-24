<<<<<<< HEAD
var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function a(e){e.forEach(t)}function r(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let o,l;function s(e,t){return o||(o=document.createElement("a")),o.href=t,e===o.href}function c(e,t,n,a){if(e){const r=u(e,t,n,a);return e[0](r)}}function u(e,t,n,a){return e[1]&&a?function(e,t){for(const n in t)e[n]=t[n];return e}(n.ctx.slice(),e[1](a(t))):n.ctx}function d(e,t,n,a){if(e[2]&&a){const r=e[2](a(n));if(void 0===t.dirty)return r;if("object"==typeof r){const e=[],n=Math.max(t.dirty.length,r.length);for(let a=0;a<n;a+=1)e[a]=t.dirty[a]|r[a];return e}return t.dirty|r}return t.dirty}function f(e,t,n,a,r,i){if(r){const o=u(t,n,a,i);e.p(o,r)}}function m(e){if(e.ctx.length>32){const t=[],n=e.ctx.length/32;for(let e=0;e<n;e++)t[e]=-1;return t}return-1}function p(e,t){e.appendChild(t)}function g(e,t,n){e.insertBefore(t,n||null)}function $(e){e.parentNode&&e.parentNode.removeChild(e)}function h(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function v(e){return document.createElement(e)}function y(e){return document.createTextNode(e)}function T(){return y(" ")}function b(){return y("")}function w(e,t,n,a){return e.addEventListener(t,n,a),()=>e.removeEventListener(t,n,a)}function x(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function S(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function C(e,t){e.value=null==t?"":t}function k(e,t,n,a){null===n?e.style.removeProperty(t):e.style.setProperty(t,n,a?"important":"")}function M(e){l=e}const B=[],E=[],N=[],A=[],_=Promise.resolve();let I=!1;function L(e){N.push(e)}const P=new Set;let j=0;function G(){if(0!==j)return;const e=l;do{try{for(;j<B.length;){const e=B[j];j++,M(e),z(e.$$)}}catch(e){throw B.length=0,j=0,e}for(M(null),B.length=0,j=0;E.length;)E.pop()();for(let e=0;e<N.length;e+=1){const t=N[e];P.has(t)||(P.add(t),t())}N.length=0}while(B.length);for(;A.length;)A.pop()();I=!1,P.clear(),M(e)}function z(e){if(null!==e.fragment){e.update(),a(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(L)}}const D=new Set;let H;function K(){H={r:0,c:[],p:H}}function F(){H.r||a(H.c),H=H.p}function R(e,t){e&&e.i&&(D.delete(e),e.i(t))}function q(e,t,n,a){if(e&&e.o){if(D.has(e))return;D.add(e),H.c.push((()=>{D.delete(e),a&&(n&&e.d(1),a())})),e.o(t)}else a&&a()}function J(e){e&&e.c()}function U(e,n,i,o){const{fragment:l,after_update:s}=e.$$;l&&l.m(n,i),o||L((()=>{const n=e.$$.on_mount.map(t).filter(r);e.$$.on_destroy?e.$$.on_destroy.push(...n):a(n),e.$$.on_mount=[]})),s.forEach(L)}function W(e,t){const n=e.$$;null!==n.fragment&&(a(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function O(e,t){-1===e.$$.dirty[0]&&(B.push(e),I||(I=!0,_.then(G)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function V(t,r,i,o,s,c,u,d=[-1]){const f=l;M(t);const m=t.$$={fragment:null,ctx:[],props:c,update:e,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(f?f.$$.context:[])),callbacks:n(),dirty:d,skip_bound:!1,root:r.target||f.$$.root};u&&u(m.root);let p=!1;if(m.ctx=i?i(t,r.props||{},((e,n,...a)=>{const r=a.length?a[0]:n;return m.ctx&&s(m.ctx[e],m.ctx[e]=r)&&(!m.skip_bound&&m.bound[e]&&m.bound[e](r),p&&O(t,e)),n})):[],m.update(),p=!0,a(m.before_update),m.fragment=!!o&&o(m.ctx),r.target){if(r.hydrate){const e=function(e){return Array.from(e.childNodes)}(r.target);m.fragment&&m.fragment.l(e),e.forEach($)}else m.fragment&&m.fragment.c();r.intro&&R(t.$$.fragment),U(t,r.target,r.anchor,r.customElement),G()}M(f)}class Y{$destroy(){W(this,1),this.$destroy=e}$on(t,n){if(!r(n))return e;const a=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return a.push(n),()=>{const e=a.indexOf(n);-1!==e&&a.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function Z(t){let n,r,i,o,l,s,c,u,d,f,m,h,y,b;return{c(){n=v("ul"),r=v("li"),i=v("a"),i.textContent="Home",o=T(),l=v("li"),s=v("a"),s.textContent="Design",c=T(),u=v("li"),d=v("a"),d.textContent="Projects",f=T(),m=v("li"),h=v("a"),h.textContent="Contact",x(i,"href","#Home"),x(i,"class","svelte-6ws5mf"),x(r,"id","Home"),x(r,"class","svelte-6ws5mf"),x(s,"href","#Design"),x(s,"class","svelte-6ws5mf"),x(l,"class","svelte-6ws5mf"),x(d,"href","#Projects"),x(d,"class","svelte-6ws5mf"),x(u,"class","svelte-6ws5mf"),x(h,"href","#Contact"),x(h,"class","svelte-6ws5mf"),k(m,"float","right"),x(m,"class","svelte-6ws5mf"),x(n,"class","navbar svelte-6ws5mf")},m(e,t){g(e,n,t),p(n,r),p(r,i),p(n,o),p(n,l),p(l,s),p(n,c),p(n,u),p(u,d),p(n,f),p(n,m),p(m,h),y||(b=[w(i,"click",Q),w(s,"click",Q),w(d,"click",Q),w(h,"click",Q)],y=!0)},p:e,i:e,o:e,d(e){e&&$(n),y=!1,a(b)}}}function Q(e){e.preventDefault();const t=e.currentTarget,n=new URL(t.href).hash.replace("#",""),a=document.getElementById(n);window.scrollTo({top:a.offsetTop+-60,behavior:"smooth"})}class X extends Y{constructor(e){super(),V(this,e,null,Z,i,{})}}function ee(t){let n,a,r;return{c(){n=v("button"),n.innerHTML='<span class="svelte-563vtu">Darkmode</span>',x(n,"class","custom-btn btn-3 svelte-563vtu")},m(e,i){g(e,n,i),a||(r=w(n,"click",t[0]),a=!0)},p:e,i:e,o:e,d(e){e&&$(n),a=!1,r()}}}function te(e){let t=!1;return[function(){t=!t,window.document.body.classList.toggle("dark-mode"),document.getElementById("logo").src=t?"images/logo_darkmode.png":"images/logo.png"}]}class ne extends Y{constructor(e){super(),V(this,e,te,ee,i,{})}}function ae(t){let n,a,r,i,o,l;return o=new ne({}),{c(){n=v("ul"),a=v("li"),a.innerHTML='<img id="logo" href="../App.svelte" src="./images/logo.png" alt="DSukic logo" width="115"/>',r=T(),i=v("li"),J(o.$$.fragment),x(a,"class","svelte-1yxpgfw"),k(i,"padding-left","84%"),k(i,"padding-bottom","2%"),x(i,"class","svelte-1yxpgfw"),x(n,"class","top svelte-1yxpgfw"),k(n,"position","unset"),k(n,"padding-top","1%")},m(e,t){g(e,n,t),p(n,a),p(n,r),p(n,i),U(o,i,null),l=!0},p:e,i(e){l||(R(o.$$.fragment,e),l=!0)},o(e){q(o.$$.fragment,e),l=!1},d(e){e&&$(n),W(o)}}}class re extends Y{constructor(e){super(),V(this,e,null,ae,i,{})}}function ie(e,t,n){const a=e.slice();return a[3]=t[n],a}function oe(e){let t,n;const a=e[2].default,r=c(a,e,e[1],null);return{c(){t=v("h1"),r&&r.c(),x(t,"class","svelte-1kvpq3u")},m(e,a){g(e,t,a),r&&r.m(t,null),n=!0},p(e,t){r&&r.p&&(!n||2&t)&&f(r,a,e,e[1],n?d(a,e[1],t,null):m(e[1]),null)},i(e){n||(R(r,e),n=!0)},o(e){q(r,e),n=!1},d(e){e&&$(t),r&&r.d(e)}}}function le(e){let t,n,a=e[0],r=[];for(let t=0;t<a.length;t+=1)r[t]=oe(ie(e,a,t));const i=e=>q(r[e],1,1,(()=>{r[e]=null}));return{c(){for(let e=0;e<r.length;e+=1)r[e].c();t=b()},m(e,a){for(let t=0;t<r.length;t+=1)r[t].m(e,a);g(e,t,a),n=!0},p(e,[n]){if(2&n){let o;for(a=e[0],o=0;o<a.length;o+=1){const i=ie(e,a,o);r[o]?(r[o].p(i,n),R(r[o],1)):(r[o]=oe(i),r[o].c(),R(r[o],1),r[o].m(t.parentNode,t))}for(K(),o=a.length;o<r.length;o+=1)i(o);F()}},i(e){if(!n){for(let e=0;e<a.length;e+=1)R(r[e]);n=!0}},o(e){r=r.filter(Boolean);for(let e=0;e<r.length;e+=1)q(r[e]);n=!1},d(e){h(r,e),e&&$(t)}}}function se(e,t,n){let{$$slots:a={},$$scope:r}=t,i=[];for(let e=1;e<11;e++)i.push(e);return e.$$set=e=>{"$$scope"in e&&n(1,r=e.$$scope)},[i,r,a]}class ce extends Y{constructor(e){super(),V(this,e,se,le,i,{})}}function ue(e){let t,n,a;const r=e[3].default,i=c(r,e,e[2],null);return{c(){t=v("h3"),i&&i.c(),n=y(e[1]),x(t,"id","timerMessage")},m(e,r){g(e,t,r),i&&i.m(t,null),p(t,n),a=!0},p(e,t){i&&i.p&&(!a||4&t)&&f(i,r,e,e[2],a?d(r,e[2],t,null):m(e[2]),null),(!a||2&t)&&S(n,e[1])},i(e){a||(R(i,e),a=!0)},o(e){q(i,e),a=!1},d(e){e&&$(t),i&&i.d(e)}}}function de(e){let t,n,a=e[0]>1&&ue(e);return{c(){a&&a.c(),t=b()},m(e,r){a&&a.m(e,r),g(e,t,r),n=!0},p(e,[n]){e[0]>1?a?(a.p(e,n),1&n&&R(a,1)):(a=ue(e),a.c(),R(a,1),a.m(t.parentNode,t)):a&&(K(),q(a,1,1,(()=>{a=null})),F())},i(e){n||(R(a),n=!0)},o(e){q(a),n=!1},d(e){a&&a.d(e),e&&$(t)}}}function fe(e,t,n){let{$$slots:a={},$$scope:r}=t,{initial:i}=t,o=i;return function(){for(let e=i;e>0;e--)setTimeout((()=>{n(1,o=e)}),1e3*(i-e))}(),e.$$set=e=>{"initial"in e&&n(0,i=e.initial),"$$scope"in e&&n(2,r=e.$$scope)},[i,o,r,a]}class me extends Y{constructor(e){super(),V(this,e,fe,de,i,{initial:0})}}function pe(e,t,n){const a=e.slice();return a[13]=t[n],a[15]=n,a}function ge(t){let n,a;return{c(){n=v("img"),x(n,"class","tile svelte-1gd8lwv"),s(n.src,a="./images/TicTacToe/Empty.png")||x(n,"src","./images/TicTacToe/Empty.png"),x(n,"alt","eTile")},m(e,t){g(e,n,t)},p:e,d(e){e&&$(n)}}}function $e(t){let n,a;return{c(){n=v("img"),x(n,"class","tile svelte-1gd8lwv"),s(n.src,a="./images/TicTacToe/CircleWin.png")||x(n,"src","./images/TicTacToe/CircleWin.png"),x(n,"alt","oWinTile")},m(e,t){g(e,n,t)},p:e,d(e){e&&$(n)}}}function he(t){let n,a;return{c(){n=v("img"),x(n,"class","tile svelte-1gd8lwv"),s(n.src,a="./images/TicTacToe/CrossWin.png")||x(n,"src","./images/TicTacToe/CrossWin.png"),x(n,"alt","xWinTile")},m(e,t){g(e,n,t)},p:e,d(e){e&&$(n)}}}function ve(t){let n,a;return{c(){n=v("img"),x(n,"class","tile svelte-1gd8lwv"),s(n.src,a="./images/TicTacToe/Circle.png")||x(n,"src","./images/TicTacToe/Circle.png"),x(n,"alt","oTile")},m(e,t){g(e,n,t)},p:e,d(e){e&&$(n)}}}function ye(t){let n,a;return{c(){n=v("img"),x(n,"class","tile svelte-1gd8lwv"),s(n.src,a="./images/TicTacToe/Cross.png")||x(n,"src","./images/TicTacToe/Cross.png"),x(n,"alt","xTile")},m(e,t){g(e,n,t)},p:e,d(e){e&&$(n)}}}function Te(e){let t,n,r,i;function o(){return e[5](e[15])}return{c(){t=v("img"),x(t,"id",e[15]),x(t,"class","eTile svelte-1gd8lwv"),s(t.src,n="./images/TicTacToe/Empty.png")||x(t,"src","./images/TicTacToe/Empty.png"),x(t,"alt","eTile")},m(n,a){g(n,t,a),r||(i=[w(t,"click",o),w(t,"keydown",e[4])],r=!0)},p(t,n){e=t},d(e){e&&$(t),r=!1,a(i)}}}function be(e){let t;function n(e,t){return 0===e[13]?Te:1===e[13]?ye:2===e[13]?ve:3===e[13]?he:4===e[13]?$e:ge}let a=n(e),r=a(e);return{c(){r.c(),t=b()},m(e,n){r.m(e,n),g(e,t,n)},p(e,i){a===(a=n(e))&&r?r.p(e,i):(r.d(1),r=a(e),r&&(r.c(),r.m(t.parentNode,t)))},d(e){r.d(e),e&&$(t)}}}function we(t){let n,a,r,i;return{c(){n=v("h1"),a=y("It's player "),r=y(t[0]),i=y("'s turn")},m(e,t){g(e,n,t),p(n,a),p(n,r),p(n,i)},p(e,t){1&t&&S(r,e[0])},i:e,o:e,d(e){e&&$(n)}}}function xe(e){let t,n,a,r,i,o,l,s,c,u;return l=new me({props:{initial:Ce}}),{c(){t=v("h1"),n=y("Player "),a=y(e[1]),r=y(" has won"),i=T(),o=v("div"),J(l.$$.fragment),s=T(),c=v("h1"),c.textContent="Restart...",x(o,"class","counter svelte-1gd8lwv")},m(e,d){g(e,t,d),p(t,n),p(t,a),p(t,r),g(e,i,d),g(e,o,d),U(l,o,null),g(e,s,d),g(e,c,d),u=!0},p(e,t){(!u||2&t)&&S(a,e[1])},i(e){u||(R(l.$$.fragment,e),u=!0)},o(e){q(l.$$.fragment,e),u=!1},d(e){e&&$(t),e&&$(i),e&&$(o),W(l),e&&$(s),e&&$(c)}}}function Se(e){let t,n,a,r,i,o,l,s,c=e[3],u=[];for(let t=0;t<c.length;t+=1)u[t]=be(pe(e,c,t));const d=[xe,we],f=[];function m(e,t){return e[2]?0:1}return r=m(e),i=f[r]=d[r](e),{c(){t=v("div");for(let e=0;e<u.length;e+=1)u[e].c();n=T(),a=v("div"),i.c(),o=T(),l=v("div"),x(t,"class","board svelte-1gd8lwv"),x(a,"class","score svelte-1gd8lwv"),k(l,"clear","both")},m(e,i){g(e,t,i);for(let e=0;e<u.length;e+=1)u[e].m(t,null);g(e,n,i),g(e,a,i),f[r].m(a,null),g(e,o,i),g(e,l,i),s=!0},p(e,[n]){if(24&n){let a;for(c=e[3],a=0;a<c.length;a+=1){const r=pe(e,c,a);u[a]?u[a].p(r,n):(u[a]=be(r),u[a].c(),u[a].m(t,null))}for(;a<u.length;a+=1)u[a].d(1);u.length=c.length}let o=r;r=m(e),r===o?f[r].p(e,n):(K(),q(f[o],1,1,(()=>{f[o]=null})),F(),i=f[r],i?i.p(e,n):(i=f[r]=d[r](e),i.c()),R(i,1),i.m(a,null))},i(e){s||(R(i),s=!0)},o(e){q(i),s=!1},d(e){e&&$(t),h(u,e),e&&$(n),e&&$(a),f[r].d(),e&&$(o),e&&$(l)}}}let Ce=5;function ke(e,t,n){let a=!0,r="1",i="2",o=!1,l=[0,0,0,0,0,0,0,0,0];function s(e){n(3,l[e]=a?1:2,l),function(){for(let e=0;e<c.length;e++)u(c[e])&&d(c[e])}(),a=!a,a?(n(0,r="1"),n(1,i="2")):(n(0,r="2"),n(1,i="1"))}let c=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];function u(e){return 0!==l[e[0]]&&-1!==l[e[0]]&&(l[e[0]]===l[e[1]]&&l[e[1]]===l[e[2]]||void 0)}function d(e){n(2,o=!0);for(let t=0;t<e.length;t++)n(3,l[e[t]]+=2,l);for(let e=0;e<l.length;e++)0===l[e]&&n(3,l[e]=-1,l);setTimeout(f,1e3*Ce)}function f(){a=!0,n(0,r="1"),n(2,o=!1);for(let e=0;e<l.length;e++)n(3,l[e]=0,l)}return[r,i,o,l,s,e=>s(e)]}class Me extends Y{constructor(e){super(),V(this,e,ke,Se,i,{})}}function Be(t){let n,a,r,i,o,l,s,c;return s=new Me({}),{c(){n=v("h1"),n.textContent="Projects",a=T(),r=v("h1"),r.textContent="Tic-Tac-Toe",i=T(),o=v("h1"),o.textContent="A simple Tic-Tac-Toe game made in Javascript",l=T(),J(s.$$.fragment),x(n,"id","Projects"),x(n,"class","svelte-1t4gdhk"),x(r,"class","title svelte-1t4gdhk"),x(o,"class","description svelte-1t4gdhk")},m(e,t){g(e,n,t),g(e,a,t),g(e,r,t),g(e,i,t),g(e,o,t),g(e,l,t),U(s,e,t),c=!0},p:e,i(e){c||(R(s.$$.fragment,e),c=!0)},o(e){q(s.$$.fragment,e),c=!1},d(e){e&&$(n),e&&$(a),e&&$(r),e&&$(i),e&&$(o),e&&$(l),W(s,e)}}}class Ee extends Y{constructor(e){super(),V(this,e,null,Be,i,{})}}function Ne(e,t,n){const a=e.slice();return a[1]=t[n],a}function Ae(t){let n,a,r=t[1]+"";return{c(){n=v("option"),a=y(r),n.__value=t[1],n.value=n.__value},m(e,t){g(e,n,t),p(n,a)},p:e,d(e){e&&$(n)}}}function _e(t){let n,a=t[0],r=[];for(let e=0;e<a.length;e+=1)r[e]=Ae(Ne(t,a,e));return{c(){for(let e=0;e<r.length;e+=1)r[e].c();n=b()},m(e,t){for(let n=0;n<r.length;n+=1)r[n].m(e,t);g(e,n,t)},p(e,[t]){if(1&t){let i;for(a=e[0],i=0;i<a.length;i+=1){const o=Ne(e,a,i);r[i]?r[i].p(o,t):(r[i]=Ae(o),r[i].c(),r[i].m(n.parentNode,n))}for(;i<r.length;i+=1)r[i].d(1);r.length=a.length}},i:e,o:e,d(e){h(r,e),e&&$(n)}}}function Ie(e){return[["Afghanistan","Åland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bangladesh","Barbados","Bahamas","Bahrain","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Indian Ocean Territory","British Virgin Islands","Brunei Darussalam","Bulgaria","Burkina Faso","Burma","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo-Brazzaville","Congo-Kinshasa","Cook Islands","Costa Rica","Croatia","Curaçao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","El Salvador","Egypt","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Federated States of Micronesia","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Lands","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard and McDonald Islands","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nauru","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn Islands","Poland","Portugal","Puerto Rico","Qatar","Réunion","Romania","Russia","Rwanda","Saint Barthélemy","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Martin","Saint Pierre and Miquelon","Saint Vincent","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Sint Maarten","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia","South Korea","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Sweden","Swaziland","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Vietnam","Venezuela","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"]]}class Le extends Y{constructor(e){super(),V(this,e,Ie,_e,i,{})}}function Pe(t){let n,a;return{c(){n=v("script"),s(n.src,a="https://www.google.com/recaptcha/api.js?render="+je)||x(n,"src",a),n.async=!0,n.defer=!0},m(e,t){p(document.head,n)},p:e,i:e,o:e,d(e){$(n)}}}const je="6LelNBYkAAAAAJUEuyoax3If2Oamnoca0NtSYTkS";function Ge(e){return[]}class ze extends Y{constructor(e){super(),V(this,e,Ge,Pe,i,{})}}function De(e){let t,n,r,i,o,l,s,c,u,d,f,m,h,b,M,B,E,N,A,_,I,L,P,j,G,z,D,H,K,F,O,V,Y,Z,Q,X,ee,te,ne,ae,re,ie,oe,le=JSON.stringify(e[0],null,2)+"";return P=new Le({}),Z=new ze({}),{c(){t=v("form"),n=v("input"),r=T(),i=v("div"),o=v("input"),l=T(),s=v("input"),c=T(),u=v("input"),f=T(),m=v("div"),h=v("input"),b=T(),M=v("div"),B=v("textarea"),E=T(),N=v("div"),A=v("label"),A.textContent="Country",_=T(),I=v("select"),L=v("option"),L.textContent="Select a country",J(P.$$.fragment),j=T(),G=v("input"),D=T(),H=v("input"),K=T(),F=v("input"),O=T(),V=v("input"),Y=T(),J(Z.$$.fragment),Q=T(),X=v("div"),ee=v("pre"),te=y("        "),ne=y(le),ae=y("\r\n    "),x(n,"type","hidden"),x(n,"name","accessKey"),n.value="7cb6f557-c5cd-4476-80d5-bcc8612cc3c3",x(o,"type","text"),x(o,"name","name"),x(o,"placeholder","Name"),x(s,"type","email"),x(s,"placeholder","Email"),x(u,"type","text"),x(u,"name","email"),x(u,"placeholder","Email"),u.value=d=e[0].email,k(u,"display","None"),x(h,"type","text"),x(h,"name","subject"),x(h,"size","78"),x(h,"placeholder","Subject"),x(B,"name","message"),x(B,"rows","10"),x(B,"cols","80"),x(B,"placeholder","Message"),x(B,"class","svelte-1beppy5"),x(A,"for","country"),L.__value="",L.value=L.__value,x(I,"id","country"),x(G,"type","text"),x(G,"name","$country"),G.value=z=e[0].country,k(G,"display","None"),x(H,"id","submitButton"),k(H,"margin-left","290px"),x(H,"type","submit"),H.value="Send",x(F,"type","hidden"),x(F,"name","replyTo"),F.value="@",x(V,"type","text"),x(V,"name","honeypot"),k(V,"display","none"),x(t,"action","https://api.staticforms.xyz/submit"),x(t,"method","post")},m(a,d){g(a,t,d),p(t,n),p(t,r),p(t,i),p(i,o),C(o,e[0].name),p(i,l),p(i,s),C(s,e[0].email),p(i,c),p(i,u),p(t,f),p(t,m),p(m,h),C(h,e[0].subject),p(t,b),p(t,M),p(M,B),C(B,e[0].message),p(t,E),p(t,N),p(N,A),p(N,_),p(N,I),p(I,L),U(P,I,null),p(N,j),p(N,G),p(N,D),p(N,H),p(t,K),p(t,F),p(t,O),p(t,V),p(t,Y),U(Z,t,null),g(a,Q,d),g(a,X,d),p(X,ee),p(ee,te),p(ee,ne),p(ee,ae),re=!0,ie||(oe=[w(o,"input",e[1]),w(s,"input",e[2]),w(h,"input",e[3]),w(B,"input",e[4])],ie=!0)},p(e,[t]){1&t&&o.value!==e[0].name&&C(o,e[0].name),1&t&&s.value!==e[0].email&&C(s,e[0].email),(!re||1&t&&d!==(d=e[0].email)&&u.value!==d)&&(u.value=d),1&t&&h.value!==e[0].subject&&C(h,e[0].subject),1&t&&C(B,e[0].message),(!re||1&t&&z!==(z=e[0].country)&&G.value!==z)&&(G.value=z),(!re||1&t)&&le!==(le=JSON.stringify(e[0],null,2)+"")&&S(ne,le)},i(e){re||(R(P.$$.fragment,e),R(Z.$$.fragment,e),re=!0)},o(e){q(P.$$.fragment,e),q(Z.$$.fragment,e),re=!1},d(e){e&&$(t),W(P),W(Z),e&&$(Q),e&&$(X),ie=!1,a(oe)}}}function He(e,t,n){const a={name:"",email:"",subject:"",message:"",country:""};var r=window.innerWidth;return console.log(r),[a,function(){a.name=this.value,n(0,a)},function(){a.email=this.value,n(0,a)},function(){a.subject=this.value,n(0,a)},function(){a.message=this.value,n(0,a)}]}class Ke extends Y{constructor(e){super(),V(this,e,He,De,i,{})}}function Fe(t){let n,a,r,i,o;return i=new Ke({}),{c(){n=v("section"),a=v("div"),a.innerHTML='<h1 style="line-height: .5;" class="svelte-10bqzan">Contact</h1> \n        <h2 class="svelte-10bqzan">You can send me a message using this form</h2>',r=T(),J(i.$$.fragment),x(n,"id","Contact"),k(n,"margin-left","20%")},m(e,t){g(e,n,t),p(n,a),p(n,r),U(i,n,null),o=!0},p:e,i(e){o||(R(i.$$.fragment,e),o=!0)},o(e){q(i.$$.fragment,e),o=!1},d(e){e&&$(n),W(i)}}}class Re extends Y{constructor(e){super(),V(this,e,null,Fe,i,{})}}function qe(t){let n;return{c(){n=v("footer"),n.innerHTML='<p1 class="footer svelte-pp3v06">Dominik Sukic 2023</p1> \n    <p1 class="footer svelte-pp3v06">Dominik Sukic 2023</p1> \n    <p1 class="footer svelte-pp3v06">Dominik Sukic 2023</p1>',x(n,"class","svelte-pp3v06")},m(e,t){g(e,n,t)},p:e,i:e,o:e,d(e){e&&$(n)}}}class Je extends Y{constructor(e){super(),V(this,e,null,qe,i,{})}}function Ue(e){let t;return{c(){t=y("TEST")},m(e,n){g(e,t,n)},d(e){e&&$(t)}}}function We(e){let t;return{c(){t=y("TEST")},m(e,n){g(e,t,n)},d(e){e&&$(t)}}}function Oe(e){let t;return{c(){t=y("TEST")},m(e,n){g(e,t,n)},d(e){e&&$(t)}}}function Ve(e){let t,n,a,r,i,o,l,s,c,u,d,f,m,h,y,b,w,S,C;return n=new re({}),r=new X({}),o=new ce({props:{$$slots:{default:[Ue]},$$scope:{ctx:e}}}),u=new ce({props:{$$slots:{default:[We]},$$scope:{ctx:e}}}),f=new Ee({}),h=new ce({props:{$$slots:{default:[Oe]},$$scope:{ctx:e}}}),b=new Re({}),S=new Je({}),{c(){t=v("main"),J(n.$$.fragment),a=T(),J(r.$$.fragment),i=T(),J(o.$$.fragment),l=T(),s=v("h1"),s.textContent="Design",c=T(),J(u.$$.fragment),d=T(),J(f.$$.fragment),m=T(),J(h.$$.fragment),y=T(),J(b.$$.fragment),w=T(),J(S.$$.fragment),x(s,"id","Design"),x(s,"class","svelte-d2aly4"),x(t,"class","svelte-d2aly4")},m(e,$){g(e,t,$),U(n,t,null),p(t,a),U(r,t,null),p(t,i),U(o,t,null),p(t,l),p(t,s),p(t,c),U(u,t,null),p(t,d),U(f,t,null),p(t,m),U(h,t,null),p(t,y),U(b,t,null),p(t,w),U(S,t,null),C=!0},p(e,[t]){const n={};1&t&&(n.$$scope={dirty:t,ctx:e}),o.$set(n);const a={};1&t&&(a.$$scope={dirty:t,ctx:e}),u.$set(a);const r={};1&t&&(r.$$scope={dirty:t,ctx:e}),h.$set(r)},i(e){C||(R(n.$$.fragment,e),R(r.$$.fragment,e),R(o.$$.fragment,e),R(u.$$.fragment,e),R(f.$$.fragment,e),R(h.$$.fragment,e),R(b.$$.fragment,e),R(S.$$.fragment,e),C=!0)},o(e){q(n.$$.fragment,e),q(r.$$.fragment,e),q(o.$$.fragment,e),q(u.$$.fragment,e),q(f.$$.fragment,e),q(h.$$.fragment,e),q(b.$$.fragment,e),q(S.$$.fragment,e),C=!1},d(e){e&&$(t),W(n),W(r),W(o),W(u),W(f),W(h),W(b),W(S)}}}class Ye extends Y{constructor(e){super(),V(this,e,null,Ve,i,{})}}function Ze(t){let n,a;return n=new Ye({}),{c(){J(n.$$.fragment)},m(e,t){U(n,e,t),a=!0},p:e,i(e){a||(R(n.$$.fragment,e),a=!0)},o(e){q(n.$$.fragment,e),a=!1},d(e){W(n,e)}}}return new class extends Y{constructor(e){super(),V(this,e,null,Ze,i,{})}}({target:document.body})}();
=======

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
>>>>>>> 81157505d0a13fe15d039e0193ecd6c4b82c2e42
//# sourceMappingURL=bundle.js.map

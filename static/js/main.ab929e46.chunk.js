(window.webpackJsonpweb=window.webpackJsonpweb||[]).push([[0],{32:function(e,t,n){e.exports=n(62)},37:function(e,t,n){},38:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},39:function(e,t,n){},62:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),s=n(21),c=n.n(s),o=(n(37),n(38),n(39),n(8)),l=n.n(o),u=n(22),i=n(10),d=n(23),p=n(24),h=n(29),f=n(25),m=n(30),v=n(63),b=n(64),g=n(65),y=n(27),E=n(66),w=n(67),k=n(68),O=n(69),j=n(70),x=n(11),H=n.n(x);function C(){return I.apply(this,arguments)}function I(){return(I=Object(i.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,H.a.get("http://localhost:8080/config");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}))).apply(this,arguments)}function P(e){return q.apply(this,arguments)}function q(){return(q=Object(i.a)(l.a.mark(function e(t){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,H.a.post("http://localhost:8080/config",t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}))).apply(this,arguments)}function S(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function A(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?S(n,!0).forEach(function(t){Object(u.a)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):S(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var D=function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(h.a)(this,Object(f.a)(t).call(this,e))).state={loaded:!1},n}return Object(m.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){var e=Object(i.a)(l.a.mark(function e(){var t,n;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C();case 2:t=e.sent,(n=t.data).requestHeaders=n.requestHeaders.join(", "),n.responseHeaders=n.responseHeaders.join(", "),this.setState(A({},n,{loaded:!0}));case 7:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"onSubmit",value:function(){var e=Object(i.a)(l.a.mark(function e(){var t;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return(t=A({},this.state)).requestHeaders=t.requestHeaders.split(", "),t.responseHeaders=t.responseHeaders.split(", "),e.prev=3,e.next=6,P(t);case 6:alert("Config saved!"),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(3),alert("Error: server might be down.");case 12:case"end":return e.stop()}},e,this,[[3,9]])}));return function(){return e.apply(this,arguments)}}()},{key:"handleInputChange",value:function(e){var t=Object.assign({},this.state),n=e.target,a="checkbox"===n.type?n.checked:n.value;t[n.name]=a,this.setState(t)}},{key:"handleFieldChange",value:function(e,t){var n=Object.assign({},this.state),a=e.target,r="checkbox"===a.type?a.checked:a.value,s=a.name;console.log(t),t?n.requestInfo[s]=r:n.responseInfo[s]=r,this.setState(n)}},{key:"renderFields",value:function(e){var t=this,n=e?this.state.requestInfo:this.state.responseInfo;return Object.keys(n).map(function(a,s){return r.a.createElement(v.a,{key:"".concat(e,"_").concat(a),id:"".concat(e,"_").concat(a),type:"checkbox",label:a,name:a,checked:n[a],onChange:function(n){return t.handleFieldChange(n,e)}})})}},{key:"renderHeadersInput",value:function(e){var t=this,n=e?"includeAllRequestHeaders":"includeAllResponseHeaders",a=e?this.state.requestHeaders:this.state.responseHeaders,s=e?" Include all request headers":" Include all response headers";return r.a.createElement(b.a,null,r.a.createElement(g.a,{addonType:"prepend"},r.a.createElement(y.a,null,r.a.createElement(E.a,{addon:!0,type:"checkbox",checked:this.state[n],name:n,onChange:function(e){return t.handleInputChange(e)},"aria-label":"Comma seperated headers"}),r.a.createElement("span",{style:{marginLeft:"8px"}},s))),r.a.createElement(E.a,{value:a,name:e?"requestHeaders":"responseHeaders",onChange:function(e){return t.handleInputChange(e)},placeholder:"Comma separated headers",disabled:this.state[n]}))}},{key:"render",value:function(){var e=this;return this.state.loaded?r.a.createElement("div",null,r.a.createElement(w.a,null,r.a.createElement(k.a,null,r.a.createElement(O.a,{for:"logPath"},"Log path"),r.a.createElement(E.a,{type:"text",name:"logPath",id:"logPath",placeholder:"Log path",value:this.state.logPath,onChange:function(t){return e.handleInputChange(t)}})),r.a.createElement(k.a,null,this.renderHeadersInput(!0)),r.a.createElement(k.a,null,r.a.createElement(O.a,null,"Additional request fields"),r.a.createElement("div",null,this.renderFields(!0))),r.a.createElement(k.a,null,this.renderHeadersInput(!1)),r.a.createElement(k.a,null,r.a.createElement(O.a,null,"Additional response fields"),r.a.createElement("div",null,this.renderFields(!1))),r.a.createElement(j.a,{onClick:function(){return e.onSubmit()}},"Submit"))):""}}]),t}(r.a.Component);D.defaultProps={};var F=D,L=n(71);var B=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"top"},r.a.createElement(L.a,null,r.a.createElement("h3",null,"Proxy configuration"))),r.a.createElement(L.a,null,r.a.createElement(F,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(61);c.a.render(r.a.createElement(B,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[32,1,2]]]);
//# sourceMappingURL=main.ab929e46.chunk.js.map
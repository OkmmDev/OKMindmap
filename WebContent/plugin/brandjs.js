(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var e,q=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}},r=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:q(a)}},t="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a},u=function(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==
typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");},v=u(this),y=function(a,b){if(b)a:{var c=v;a=a.split(".");for(var d=0;d<a.length-1;d++){var f=a[d];if(!(f in c))break a;c=c[f]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&t(c,a,{configurable:!0,writable:!0,value:b})}};y("Object.is",function(a){return a?a:function(b,c){return b===c?0!==b||1/b===1/c:b!==b&&c!==c}},"es6","es3");
y("Array.prototype.includes",function(a){return a?a:function(b,c){var d=this;d instanceof String&&(d=String(d));var f=d.length;c=c||0;for(0>c&&(c=Math.max(c+f,0));c<f;c++){var g=d[c];if(g===b||Object.is(g,b))return!0}return!1}},"es7","es3");
y("String.prototype.includes",function(a){return a?a:function(b,c){if(null==this)throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype.includes must not be a regular expression");return-1!==this.indexOf(b,c||0)}},"es6","es3");var z=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f="string"===typeof a?a.split(""):a,g=0;g<d;g++)g in f&&b.call(c,f[g],g,a)};function A(a){return Array.prototype.concat.apply([],arguments)}function aa(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};var B=function(a,b){this.b={};this.a=[];this.c=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.P(a)};e=B.prototype;e.l=function(){this.s();for(var a=[],b=0;b<this.a.length;b++)a.push(this.b[this.a[b]]);return a};e.j=function(){this.s();return this.a.concat()};e.D=function(a){return C(this.b,a)};
e.S=function(a){return C(this.b,a)?(delete this.b[a],this.c--,this.a.length>2*this.c&&this.s(),!0):!1};e.s=function(){if(this.c!=this.a.length){for(var a=0,b=0;a<this.a.length;){var c=this.a[a];C(this.b,c)&&(this.a[b++]=c);a++}this.a.length=b}if(this.c!=this.a.length){var d={};for(b=a=0;a<this.a.length;)c=this.a[a],C(d,c)||(this.a[b++]=c,d[c]=1),a++;this.a.length=b}};e.get=function(a,b){return C(this.b,a)?this.b[a]:b};e.set=function(a,b){C(this.b,a)||(this.c++,this.a.push(a));this.b[a]=b};
e.P=function(a){if(a instanceof B)for(var b=a.j(),c=0;c<b.length;c++)this.set(b[c],a.get(b[c]));else for(b in a)this.set(b,a[b])};e.forEach=function(a,b){for(var c=this.j(),d=0;d<c.length;d++){var f=c[d],g=this.get(f);a.call(b,g,f,this)}};e.R=function(){return new B(this)};var C=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)};var ba=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/,ca=function(a,b){if(a){a=a.split("&");for(var c=0;c<a.length;c++){var d=a[c].indexOf("="),f=null;if(0<=d){var g=a[c].substring(0,d);f=a[c].substring(d+1)}else g=a[c];b(g,f?decodeURIComponent(f.replace(/\+/g," ")):"")}}};var G=function(a,b){this.g=this.A=this.c="";this.o=null;this.u=this.v="";this.a=!1;var c;a instanceof G?(this.a=void 0!==b?b:a.a,this.K(a.c),this.L(a.A),this.F(a.g),this.I(a.o),this.H(a.v),this.J(a.b.N()),this.G(a.u)):a&&(c=String(a).match(ba))?(this.a=!!b,this.K(c[1]||"",!0),this.L(c[2]||"",!0),this.F(c[3]||"",!0),this.I(c[4]),this.H(c[5]||"",!0),this.J(c[6]||"",!0),this.G(c[7]||"",!0)):(this.a=!!b,this.b=new H(null,this.a))};e=G.prototype;
e.toString=function(){var a=[],b=this.c;b&&a.push(I(b,J,!0),":");var c=this.g;if(c||"file"==b)a.push("//"),(b=this.A)&&a.push(I(b,J,!0),"@"),a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.o,null!=c&&a.push(":",String(c));if(c=this.v)this.T()&&"/"!=c.charAt(0)&&a.push("/"),a.push(I(c,"/"==c.charAt(0)?da:ea,!0));(c=this.M())&&a.push("?",c);(c=this.u)&&a.push("#",I(c,fa));return a.join("")};e.K=function(a,b){if(this.c=b?K(a,!0):a)this.c=this.c.replace(/:$/,"");return this};
e.L=function(a,b){this.A=b?K(a):a;return this};e.F=function(a,b){this.g=b?K(a,!0):a;return this};e.T=function(){return!!this.g};e.I=function(a){if(a){a=Number(a);if(isNaN(a)||0>a)throw Error("Bad port number "+a);this.o=a}else this.o=null;return this};e.H=function(a,b){this.v=b?K(a,!0):a;return this};e.J=function(a,b){a instanceof H?(this.b=a,this.b.O(this.a)):(b||(a=I(a,ha)),this.b=new H(a,this.a));return this};e.M=function(){return this.b.toString()};e.h=function(a){return this.b.get(a)};
e.G=function(a,b){this.u=b?K(a):a;return this};var K=function(a,b){return a?b?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""},I=function(a,b,c){return"string"===typeof a?(a=encodeURI(a).replace(b,ia),c&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null},ia=function(a){a=a.charCodeAt(0);return"%"+(a>>4&15).toString(16)+(a&15).toString(16)},J=/[#\/\?@]/g,ea=/[#\?:]/g,da=/[#\?]/g,ha=/[#\?@]/g,fa=/#/g,H=function(a,b){this.b=this.a=null;this.c=a||null;this.g=!!b};e=H.prototype;
e.f=function(){if(!this.a&&(this.a=new B,this.b=0,this.c)){var a=this;ca(this.c,function(b,c){a.add(decodeURIComponent(b.replace(/\+/g," ")),c)})}};e.add=function(a,b){this.f();this.m();a=this.i(a);var c=this.a.get(a);c||this.a.set(a,c=[]);c.push(b);this.b=this.b+1;return this};e.C=function(a){this.f();a=this.i(a);return this.a.D(a)?(this.m(),this.b=this.b-this.a.get(a).length,this.a.S(a)):!1};e.B=function(a){this.f();a=this.i(a);return this.a.D(a)};
e.forEach=function(a,b){this.f();this.a.forEach(function(c,d){z(c,function(f){a.call(b,f,d,this)},this)},this)};e.j=function(){this.f();for(var a=this.a.l(),b=this.a.j(),c=[],d=0;d<b.length;d++)for(var f=a[d],g=0;g<f.length;g++)c.push(b[d]);return c};e.l=function(a){this.f();var b=[];if("string"===typeof a)this.B(a)&&(b=A(b,this.a.get(this.i(a))));else{a=this.a.l();for(var c=0;c<a.length;c++)b=A(b,a[c])}return b};
e.set=function(a,b){this.f();this.m();a=this.i(a);this.B(a)&&(this.b=this.b-this.a.get(a).length);this.a.set(a,[b]);this.b=this.b+1;return this};e.get=function(a,b){if(!a)return b;a=this.l(a);return 0<a.length?String(a[0]):b};e.U=function(a,b){this.C(a);0<b.length&&(this.m(),this.a.set(this.i(a),aa(b)),this.b=this.b+b.length)};
e.toString=function(){if(this.c)return this.c;if(!this.a)return"";for(var a=[],b=this.a.j(),c=0;c<b.length;c++){var d=b[c],f=encodeURIComponent(String(d));d=this.l(d);for(var g=0;g<d.length;g++){var m=f;""!==d[g]&&(m+="="+encodeURIComponent(String(d[g])));a.push(m)}}return this.c=a.join("&")};e.m=function(){this.c=null};e.N=function(){var a=new H;a.c=this.c;this.a&&(a.a=this.a.R(),a.b=this.b);return a};e.i=function(a){a=String(a);this.g&&(a=a.toLowerCase());return a};
e.O=function(a){a&&!this.g&&(this.f(),this.m(),this.a.forEach(function(b,c){var d=c.toLowerCase();c!=d&&(this.C(c),this.U(d,b))},this));this.g=a};var ja=function(a,b,c,d,f,g){var m=document.getElementById(escape(d))||document.getElementById("searchbox_demo");if(m&&m[b]){var k=m[b];b=navigator;var D=function(n,l){var h=document.createElement("input");h.setAttribute("name",n);h.setAttribute("value",l);h.setAttribute("type","hidden");m.appendChild(h);return h};d=function(n,l,h,w){if(encodeURIComponent&&decodeURIComponent){l=new G(l);l.h(n)&&(h=decodeURIComponent(l.h(n)));l=h.indexOf(f);0<=l&&(h=h.substring(l+f.length,h.length));for(h=h.substring(0,
w);encodeURIComponent(h).length>w;)h=h.substring(0,h.length-1);return D(n,h)}};var O=function(n){var l=0,h=0,w=0,E;return function(){var N=(new Date).getTime();if(E){var F=N-E;l+=F;h+=F*F}w++;E=N;n.value=[l,h,w].join("j")}},x=!1;if("Microsoft Internet Explorer"===b.appName)for(var P=r(m.parentNode.childNodes),p=P.next();!p.done;p=P.next()){if(p=p.value,"SCRIPT"==p.nodeName&&p.attributes.src&&p.attributes.src.nodeValue==unescape(escape(c))){x=!0;break}}else x=!0;x&&(c=document.location.toString(),
x=document.referrer,d("siteurl",c,c,250),d("ref",c,x,750),k.addEventListener?k.addEventListener("keyup",O(D("ss","")),!1):k.attachEvent&&k.attachEvent("onkeyup",O(D("ss",""))));"Win32"==b.platform&&(k.style.cssText="border: 1px solid #7e9db9; padding: 2px;");window.history.a&&(window.history.a="compatible");k.style.height="25px";k.style.width="263px";c=function(){""===k.value&&(k.placeholder="",k.style.background='#FFFFFF url("https://www.google.com/cse/static/images/1x/'+a+'/branding.png") top 50% left 9px no-repeat')};
k.onblur=c;k.onfocus=function(){k.placeholder="";k.style.background="#FFFFFF"};/[&?]q=[^&]/.test(g)||c()}},L;
a:{var M=document.currentScript;if(!M)for(var Q=r(document.getElementsByTagName("script")),R=Q.next();!R.done;R=Q.next()){var S=R.value,T=S.getAttribute("src"),U;if(U=T){var V=T.indexOf("?"),W=-1===V?T.length:V;U=/http(s?):\/\/((www)|(cse))\.google\.([a-z.]{2,})\/((coop\/)?)cse\/brand/.test(T.substring(0,W))||/http(s?):\/\/cse\.google\.([a-z.]{2,})\/brand/.test(T.substring(0,W))}if(U){L=S;break a}}L=M}var X=L;
if(X&&X.getAttribute("src")){var Y=X.getAttribute("src"),Z=new G(Y),ka=Z.h("lang")?Z.h("lang"):"en",la=Z.h("inputbox")?Z.h("inputbox"):"q",ma=Z.h("form")?Z.h("form"):"",na=Y.includes("https://")?Y.substring(6):Y.substring(5);ja(ka,la,na,ma,"://",location.search)};}).call(this);

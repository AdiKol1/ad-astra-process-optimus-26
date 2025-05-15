import{r as h,g as I,R as V}from"./react-vendor-7M8hEZ27.js";const p=e=>{let t;const n=new Set,u=(s,l)=>{const a=typeof s=="function"?s(t):s;if(!Object.is(a,t)){const c=t;t=l??(typeof a!="object"||a===null)?a:Object.assign({},t,a),n.forEach(i=>i(t,c))}},r=()=>t,v={setState:u,getState:r,getInitialState:()=>m,subscribe:s=>(n.add(s),()=>n.delete(s)),destroy:()=>{n.clear()}},m=t=e(u,r,v);return v},O=e=>e?p(e):p;var j={exports:{}},$={},w={exports:{}},x={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d=h;function R(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var D=typeof Object.is=="function"?Object.is:R,z=d.useState,M=d.useEffect,_=d.useLayoutEffect,C=d.useDebugValue;function G(e,t){var n=t(),u=z({inst:{value:n,getSnapshot:t}}),r=u[0].inst,o=u[1];return _(function(){r.value=n,r.getSnapshot=t,y(r)&&o({inst:r})},[e,n,t]),M(function(){return y(r)&&o({inst:r}),e(function(){y(r)&&o({inst:r})})},[e]),C(n),n}function y(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!D(e,n)}catch{return!0}}function L(e,t){return t()}var W=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?L:G;x.useSyncExternalStore=d.useSyncExternalStore!==void 0?d.useSyncExternalStore:W;w.exports=x;var k=w.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var b=h,B=k;function F(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var U=typeof Object.is=="function"?Object.is:F,A=B.useSyncExternalStore,H=b.useRef,J=b.useEffect,K=b.useMemo,N=b.useDebugValue;$.useSyncExternalStoreWithSelector=function(e,t,n,u,r){var o=H(null);if(o.current===null){var f={hasValue:!1,value:null};o.current=f}else f=o.current;o=K(function(){function v(c){if(!m){if(m=!0,s=c,c=u(c),r!==void 0&&f.hasValue){var i=f.value;if(r(i,c))return l=i}return l=c}if(i=l,U(s,c))return i;var E=u(c);return r!==void 0&&r(i,E)?(s=c,i):(s=c,l=E)}var m=!1,s,l,a=n===void 0?null:n;return[function(){return v(t())},a===null?void 0:function(){return v(a())}]},[t,n,u,r]);var S=A(e,o[0],o[1]);return J(function(){f.hasValue=!0,f.value=S},[S]),N(S),S};j.exports=$;var P=j.exports;const Q=I(P),{useDebugValue:T}=V,{useSyncExternalStoreWithSelector:X}=Q,Y=e=>e;function Z(e,t=Y,n){const u=X(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,n);return T(u),u}const g=e=>{const t=typeof e=="function"?O(e):e,n=(u,r)=>Z(t,u,r);return Object.assign(n,t),n},ee=e=>e?g(e):g;export{ee as c};
//# sourceMappingURL=store-vendor-BIS1mDOJ.js.map

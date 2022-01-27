// ==UserScript==
// @namespace   VA_i
// @version     8.0.0.20171116
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @include     /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp|imgres)/
// @match       https://news.google.com/*
// @match       https://cse.google.com/cse/*
// @run-at      document-start
// @name        Google: Bypass Result Page Redirect
// @name:zh-CN  Google：绕过搜索结果网页链接重定向
// @name:zh-TW  Google：繞過搜尋結果網頁鏈接重定向
// @description Avoid Google redirect for search result pages.
// @description:zh-CN 令 Google 直接链接至搜索结果网页，无须重定向。
// @description:zh-TW 令 Google 直接鏈接至搜尋結果網頁，無須重定向。
// @license     AGPL-3.0-or-later
// ==/UserScript==
var M='undefined'!=typeof GM?GM:{getValue:function(name,alt){var value=GM_getValue(name,alt);return{then:function(callback){callback(value)}}},setValue:function(name,value){return GM_setValue(name,value),{then:function(callback){callback()}}}};function getOption(){var opt_noopen=!1;
// For example: open https://ipv4.google.com/#x-option:open-inplace
switch(location.hash){
// Open links in the current tab.
case'#x-option:open-inplace':opt_noopen=!0;break;
// Do not ...
case'#x-option:no-open-inplace':opt_noopen=!1;break;default:return M.getValue('opt_noopen',opt_noopen)}return M.setValue('opt_noopen',opt_noopen),{then:function(callback){callback(opt_noopen)}}}function unsafeEval(func,opt){let body='return ('+func+').apply(this, arguments)';unsafeWindow.Function(body).call(unsafeWindow,opt)}getOption().then((function(opt_noopen){unsafeEval((function(opt_noopen){var count=0,options={opt_noopen:opt_noopen},re=/\burl\?.*?\b(?:url|q)=(https?\b[^&#]+)/i,restore=function(link,url){var oldUrl=link.getAttribute('href')||'',newUrl=url||oldUrl,matches=newUrl.match(re);matches?(link.setAttribute('href',decodeURIComponent(matches[1])),enhanceLink(link)):null!=url&&link.setAttribute('href',newUrl)},enhanceLink=function(a){!function(a){/\brwt\(/.test(a.getAttribute('onmousedown'))&&a.removeAttribute('onmousedown'),a.parentElement&&/\bclick\b/.test(a.parentElement.getAttribute('jsaction')||'')&&a.addEventListener('click',(function(e){e.stopImmediatePropagation(),e.stopPropagation()}),!0)}(a),a.setAttribute('rel','noreferrer'),a.setAttribute('referrerpolicy','no-referrer'),options.opt_noopen&&(a.setAttribute('target','_self'),a.addEventListener('click',(function(event){event.stopImmediatePropagation(),event.stopPropagation()}),!0))},fakeLink=document.createElement('a'),setter=function(v){v=String(v),restore(this,v)},getter=function(){return function(url){return fakeLink.href=url,fakeLink.href}(this.getAttribute('href'))},blocker=function(event){event.stopPropagation(),restore(this)},handler=function(a){a._x_id||(a._x_id=++count,Object.defineProperty?Object.defineProperty(a,'href',{get:getter,set:setter}):a.__defineSetter__?(a.__defineSetter__('href',setter),a.__defineGetter__('href',getter)):a.onmouseenter=a.onmousemove=a.onmouseup=a.onmousedown=a.ondbclick=a.onclick=a.oncontextmenu=blocker,(/^_(?:blank|self)$/.test(a.getAttribute('target'))||/\brwt\(/.test(a.getAttribute('onmousedown'))||/\bmouse/.test(a.getAttribute('jsaction'))||/\bclick\b/.test(a.parentElement.getAttribute('jsaction')))&&enhanceLink(a)),restore(a)},checkNewNodes=function(mutations){mutations.target?checkAttribute(mutations):mutations.forEach&&mutations.forEach(checkAttribute)},checkAttribute=function(mutation){var target=mutation.target;target&&'A'===target.nodeName.toUpperCase()?(mutation.attributeName||mutation.attrName,handler(target)):target instanceof Element&&[].slice.call(target.querySelectorAll('a')).forEach(handler)},MutationObserver=window.MutationObserver||window.WebKitMutationObserver;MutationObserver?new MutationObserver(checkNewNodes).observe(document.documentElement,{childList:!0,attributes:!0,attributeFilter:['href'],subtree:!0}):(document.addEventListener('DOMAttrModified',checkAttribute,!1),document.addEventListener('DOMNodeInserted',checkNewNodes,!1))}),opt_noopen)}));

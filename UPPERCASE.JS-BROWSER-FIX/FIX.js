RUN(function(){"use strict";var o,e,t,n;e=document.currentScript,void 0===e&&(t=document.getElementsByTagName("script"),e=t[t.length-1]),o=e.getAttribute("src"),o=o.substring(0,o.indexOf("/FIX.js")),n=function(e){LOAD(o+"/"+e+".js")},"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),void 0===Date.now&&(Date.now=function(){return(new Date).getTime()}),void 0===global.JSON&&n("JSON"),(void 0===global.console||void 0===console.log||void 0===console.log.apply)&&n("console.log"),void 0===global.localStorage&&n("BROWSER/STORE"),void 0===global.pageYOffset&&n("BROWSER/WINDOW/SCROLL_TOP"),void 0===global.pageXOffset&&n("BROWSER/WINDOW/SCROLL_LEFT"),void 0===global.onhashchange&&n("BROWSER/DOM/EVENT/EVENT_LOW"),void 0===DIV({style:{color:"rgba(88, 88, 88, 0.88)"}}).getStyle("color")&&n("BROWSER/DOM/STYLE/RGBA"),void 0===document.createElement("input").placeholder&&n("BROWSER/DOM/TAG/INPUT"),void 0===global.Audio&&n("BROWSER/SOUND"),("Microsoft Internet Explorer"===navigator.appName||"Netscape"===navigator.appName&&/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(navigator.userAgent)!==TO_DELETE)&&n("FIX_IE"),void 0!==navigator.userAgent&&-1!==navigator.userAgent.toLowerCase().indexOf("android")&&n("FIX_ANDROID")});
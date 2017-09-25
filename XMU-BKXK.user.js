// ==UserScript==
// @name         XMU-BKXK
// @namespace    undefined
// @version      0.1.0
// @description  厦门大学本科选课系统改造脚本
// @author       linjinzhen
// @match        http://bkxk.xmu.edu.cn/*
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function() {
  jQuery("script[src$=ggk\\.js]").after('<script type="text/javascript" src="https://gitee.com/linjinzhen/xmu-bkxk/raw/master/js/ggk.js"></script>');
  jQuery("script[src$=yxxx\\.js]").after('<script type="text/javascript" src="https://gitee.com/linjinzhen/xmu-bkxk/raw/master/js/yxxx.js"></script>');
  jQuery("script[src$=qxxbxk\\.js]").after('<script type="text/javascript" src="https://gitee.com/linjinzhen/xmu-bkxk/raw/master/js/qxxbxk.js"></script>');
  jQuery("script[src$=yxbxk\\.js]").after('<script type="text/javascript" src="https://gitee.com/linjinzhen/xmu-bkxk/raw/master/js/yxbxk.js"></script>');
  //jQuery("script[src$=qxxxx\\.js]").after('<script type="text/javascript" src="https://gitee.com/linjinzhen/xmu-bkxk/raw/master/js/qxxxx.js"></script>');
})();
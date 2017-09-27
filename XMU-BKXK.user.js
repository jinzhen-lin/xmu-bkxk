// ==UserScript==
// @name         XMU-BKXK
// @namespace    undefined
// @version      0.1.2
// @description  厦门大学本科选课系统改造脚本
// @author       linjinzhen
// @match        http://bkxk.xmu.edu.cn/*
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function() {
  if (!$("#show_rs_global, #show_ym_global, #show_ct_global, #show_yx_global, #show_zc_global", top.document).length) {
    $("head", top.document).after('<input type="hidden" id="show_zc_global">');
    $("head", top.document).after('<input type="hidden" id="show_rs_global">');
    $("head", top.document).after('<input type="hidden" id="show_ym_global">');
    $("head", top.document).after('<input type="hidden" id="show_ct_global">');
    $("head", top.document).after('<input type="hidden" id="show_yx_global">');
    $("#show_zc_global", top.document).attr("checked", true);
    $("#show_rs_global", top.document).attr("checked", false);
    $("#show_ym_global", top.document).attr("checked", true);
    $("#show_ct_global", top.document).attr("checked", true);
    $("#show_yx_global", top.document).attr("checked", false);
  }

  var base_url = "https://gitee.com/linjinzhen/xmu-bkxk/raw/master/js/";
  //var base_url = "http://127.0.0.1:12347/js/";

  $("script[src$=ggk\\.js]").after('<script type="text/javascript" src="' + base_url + 'ggk.js"></script>');
  $("script[src$=yxxx\\.js]").after('<script type="text/javascript" src="' + base_url + 'yxxx.js"></script>');
  $("script[src$=qxxbxk\\.js]").after('<script type="text/javascript" src="' + base_url + 'qxxbxk.js"></script>');
  $("script[src$=yxbxk\\.js]").after('<script type="text/javascript" src="' + base_url + 'yxbxk.js"></script>');
  //$("script[src$=qxxxx\\.js]").after('<script type="text/javascript" src="' + base_url + 'qxxxx.js"></script>');
})();
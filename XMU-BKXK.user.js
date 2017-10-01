// ==UserScript==
// @name         XMU-BKXK
// @namespace    undefined
// @version      0.1.4
// @description  厦门大学本科选课系统改造脚本
// @author       linjinzhen
// @match        http://bkxk.xmu.edu.cn/*
// @grant        none
// @run-at       document-body
// ==/UserScript==





$("#zxxk_tab li:eq(3)").attr("onclick", "");

$("#zxxk_tab li:eq(3)").click(function() {
  if ($(this).attr("class") == "tabin") {
    return;
  }

  $("#zxxk_tab li.tabin").removeClass("tabin");
  $(this).removeClass("over");
  $(this).addClass("tabin");

  //将原来显示的内容区域进行隐藏
  $("#zxxkCnt div.zxxkContent").removeClass("zxxkContentIn");

  //当前标签所对应的内容区域显示出来
  $("#zxxkCnt div.zxxkContent:eq(3)").addClass("zxxkContentIn");

  // 当前点击的是哪个IFRAME
  var iFrame_var = "";
  var src_var = "";

  iFrame_var = "iFrame_qxxxxk";
  src_var = "qxxxx.html?pagination=1000";

  //检查时间戳是否有变化
  var result = $.ajax({
    url: "compareTimestone.html",
    data: {
      type: timestone[iFrame_var].type,
      timestone: timestone[iFrame_var].timestone
    },
    async: false
  }).responseText;

  var resultObj = eval('(' + result + ')');
  var hasChanged = resultObj.hasChanged;

  if (eval(hasChanged) || $("#" + iFrame_var).attr("src") == "") {
    $("#" + iFrame_var).attr("src", src_var);
    //更新本地时间戳
    timestone[iFrame_var].timestone = resultObj.clusterTimestone;
    return;
  } else { //刷新页面上表格
    window.frames[iFrame_var].drawJxbView();
  }
});


(function() {
  if (!$("#show_rs_global, #show_ym_global, #show_ct_global, #show_yx_global, #show_zc_global", top.document).length) {
    $("head", top.document).after('<input type="hidden" id="show_zc_global">');
    $("head", top.document).after('<input type="hidden" id="show_rs_global">');
    $("head", top.document).after('<input type="hidden" id="show_ym_global">');
    $("head", top.document).after('<input type="hidden" id="show_ct_global">');
    $("head", top.document).after('<input type="hidden" id="show_yx_global">');
    $("head", top.document).after('<input type="hidden" id="show_hs_global">');
    $("#show_zc_global", top.document).attr("checked", true);
    $("#show_rs_global", top.document).attr("checked", false);
    $("#show_ym_global", top.document).attr("checked", true);
    $("#show_ct_global", top.document).attr("checked", true);
    $("#show_yx_global", top.document).attr("checked", false);
    $("#show_hs_global", top.document).attr("checked", false);
  }

  var base_url = "https://gitee.com/linjinzhen/xmu-bkxk/raw/master/js/";
  //base_url = "http://127.0.0.1:12347/js/";

  $("script[src$=ggk\\.js]").after('<script type="text/javascript" src="' + base_url + 'ggk.js"></script>');
  $("script[src$=yxxx\\.js]").after('<script type="text/javascript" src="' + base_url + 'yxxx.js"></script>');
  $("script[src$=qxxbxk\\.js]").after('<script type="text/javascript" src="' + base_url + 'qxxbxk.js"></script>');
  $("script[src$=yxbxk\\.js]").after('<script type="text/javascript" src="' + base_url + 'yxbxk.js"></script>');
  $("script[src$=qxxxx\\.js]").after('<script type="text/javascript" src="' + base_url + 'qxxxx.js"></script>');
})();
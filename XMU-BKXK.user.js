// ==UserScript==
// @name         XMU-BKXK
// @namespace    undefined
// @version      0.1.6
// @description  厦门大学本科选课系统改造脚本
// @author       linjinzhen
// @match        http://bkxk.xmu.edu.cn/*
// @grant        none
// @run-at       document-body
// ==/UserScript==


if (top.document.getElementById("zxxkLink") !== null) {
  $("#zxxk_tab li:eq(3)", top.document).attr("onclick", "");

  $("#zxxk_tab li:eq(3)", top.document).click(function() {
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
}

if (top.document.getElementById("zxxkLink") !== null &&
  top.document.getElementById("zxxkLink").getAttribute("class") == "tabin") {
  (function() {
    if (!$("#show_rs_global", top.document).length) {
      $("head", top.document).append($('<input type="hidden" id="show_zc_global">').attr("checked", true));
      $("head", top.document).append($('<input type="hidden" id="show_rs_global">').attr("checked", false));
      $("head", top.document).append($('<input type="hidden" id="show_ym_global">').attr("checked", true));
      $("head", top.document).append($('<input type="hidden" id="show_ct_global">').attr("checked", true));
      $("head", top.document).append($('<input type="hidden" id="show_yx_global">').attr("checked", false));
      $("head", top.document).append($('<input type="hidden" id="show_hs_global">').attr("checked", true));
    }

    var base_url = "https://gitee.com/linjinzhen/xmu-bkxk/raw/master/js/";
    //base_url = "http://127.0.0.1:12347/js/";

    $("script[src$=ggk\\.js]").after('<script type="text/javascript" src="' + base_url + 'ggk.js"></script>');
    $("script[src$=yxxx\\.js]").after('<script type="text/javascript" src="' + base_url + 'yxxx.js"></script>');
    $("script[src$=qxxbxk\\.js]").after('<script type="text/javascript" src="' + base_url + 'qxxbxk.js"></script>');
    $("script[src$=yxbxk\\.js]").after('<script type="text/javascript" src="' + base_url + 'yxbxk.js"></script>');
    $("script[src$=qxxxx\\.js]").after('<script type="text/javascript" src="' + base_url + 'qxxxx.js"></script>');
  })();
}
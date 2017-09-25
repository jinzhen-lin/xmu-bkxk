$(document).ready(function() {
  $("#beginPage").parent().append('，每页<input size="2" id="pagesize" type="text" onkeydown="forwardPage(event)">条记录</div>');
  $("#dialog-qrxk").after('<div id="dialog-setting" style="display: none"><p id="dialog-setting-nr"></p></div>');
  $("#moreOrLess").parent().after('<div style="float:left;height:22px;line-height:23px;width:50px">' +
    '<a id="show_setting" href="#" style="float:right">显示设置</a></div>');
  $("#show_setting").click(setShowType);
});

// 用于存储已选课程信息列表
var yxList = {}

var show_rs = false; // 是否显示已满课程已选人数
var show_ym = true; // 是否显示已满课程
var show_ct = true; // 是否显示冲突课程
var show_yx = false; // 是否显示已选课程
var show_zc = true; // 是否显示正常课程

/**
 * 根据业务规则过滤页面加载的教学班列表
 */
function generateFilterJxbs() {
  delete jxbFilters;
  delete results;

  jxbFilters = new Array();
  results = new Array();

  // 获取全部课程已选人数
  var jxbList = [];
  var jxb_xkrs = {};
  for (jxbid in ggkJxb) {
    jxbList.push({
      "jxbid": jxbid
    })
  }

  $.ajax({
    success: function(responseData, statusText) {
      if (responseData.success) {
        for (let jxb of responseData.data) {
          jxb_xkrs[jxb["jxbid"]] = jxb;
        }
      }
    },
    url: 'calJxbRs.html?method=getRsToZxxk',
    type: 'post',
    async: false,
    data: {
      "jxbs": $.toJSON(jxbList)
    },
    dataType: 'json'
  });


  //班级选择情况过滤（与选课结果比较是否已选、冲突判断）
  for (jxbid in ggkJxb) {

    var jxbObj = ggkJxb[jxbid];

    var jgObj = loadJxbXkFilter(jxbObj);
    yxList[jxbid] = jgObj.isYx;
    ctxxList[jxbid] = jgObj.ctHtmlTxt;

    var fit = true;
    if (!show_zc) {
      fit = false;
    }

    if (jgObj.ctHtmlTxt.length) {
      fit = show_ct;
    }

    if (Number(jxb_xkrs[jxbid]["kxrs"]) <= Number(jxb_xkrs[jxbid]["yxrs"])) {
      fit = show_ym;
    }

    if (jgObj.isYx) {
      fit = show_yx;
    }

    //正进行普通查询
    if (fit && commonQuerying) {
      var kcorjs = $("#kcjsmc").val();
      var b = false;
      if (jxbObj["kcdm"].indexOf(kcorjs) >= 0) {
        b = true;
      }
      if (!b && jxbObj["kcmc"].indexOf(kcorjs) >= 0) {
        b = true;
      }
      if (!b && jxbObj["zjls"].indexOf(kcorjs) >= 0) {
        b = true;
      }
      if (fit && !b) {
        fit = false;
      }
    }

    //正在进行高级查询
    if (fit && advancedQuerying) {
      fit = advanceVal(jxbObj);
    }

    if (fit) {
      results[jxbid] = jxbObj;
      jxbFilters[jxbid] = jgObj;
    }
  }
}


/*
 * ================================================================================
 * 功能描述 : 设置每个显示教学班相关的属性（人数，可选情况） 作用窗体 : 输入参数 : 无 输出参数 :
 * ================================================================================
 */
function setJxbViewAttr(datas, view_table, jxbfjxxList) {
  for (var i = 0; i < datas.length; i++) {
    //教学班容纳人数
    var jxbObj = ggkJxb[datas[i].jxbid];

    //2013-06-26hnn
    //var jxbKxrs = jxbObj.bjrnrs;
    var jxbKxrs = datas[i].kxrs;

    //班级已选课人数
    var jxbYxrs = datas[i].yxrs;

    //记录已满信息
    if (parseInt(jxbYxrs) >= parseInt(jxbKxrs)) {
      fullJxbs[datas[i].jxbid] = true;
    } else {
      fullJxbs[datas[i].jxbid] = false;
    }

    //正选且人数已满,则显示“已满”标识否则显示人数
    if (parseInt(jxbYxrs) >= parseInt(jxbKxrs) &&
      top.zxXklcObj.xkcl != "1" && !show_rs) {
      //人数显示"已满"
      $("#" + view_table + "_xkrs_" + datas[i].jxbid).html(
        "<font style='color:red'>已满</font>");
    } else {
      //人数显示显示
      $("#" + view_table + "_xkrs_" + datas[i].jxbid).html(jxbKxrs + "&nbsp;/&nbsp;" +
        "<font style='color:red'>" + jxbYxrs);
    }

    //选课按钮显示2013-05-23hnn
    if (parseInt(jxbKxrs) > 0 && !yxList[datas[i].jxbid]) {
      var oper = $("#" + view_table + "_xkbut_" + datas[i].jxbid);
      oper.html('<a href="javascript:prepareSelectCourse(\'' +
        datas[i].jxbid +
        '\')" style="font-size:12px;font-weight:bold;color:blue">选课</a>');
    }
  }

  //设置表格单元格的样式
  $("#" + view_table + " tr:even").addClass("table-app-odd");
  $("#" + view_table + " tr:odd").addClass("table-app-even");

  $("#" + view_table).show();
}


/**
 *直接跳转页面(回车触发)
 *
 */
function forwardPage(e) {

  var e = e || window.event;
  if (e.keyCode == 13) {
    beginPage();
  }
}

/**
 * 跳页
 */
function beginPage() {
  var new_page_size = $("#pagesize").val().replace(" ", "");
  if (new_page_size.length) {
    if (isNaN(new_page_size) || new_page_size <= 0) {
      alert("提示：请输入有效每页记录数!");
      return;
    }
    pagination = new_page_size;
  }

  var to_page = document.getElementById("beginPage").value.replace(" ", "");
  if (to_page.length) {
    if (isNaN(to_page) || to_page <= 0) {
      alert("提示：请输入有效页数!");
      return;
    }
    var total = getLengthOfObj(results);
    var pageCount = Math.ceil(total / pagination);
    if (parseInt(to_page, "10") > parseInt(pageCount, "10")) {
      alert("已超出最大页数!");
      return;
    }
    pageNo = to_page;
  }
  drawJxbView();
  $("#pagid").html(pagination);
}

/**
 * 显示选项设置对话框
 */
function setShowType() {
  var setting_dialog =
    '<div><input type="checkbox" id="show_rs"><label for="show_rs">是否显示已满课程已选人数</label></div>' +
    '<div><input type="checkbox" id="show_ym"><label for="show_ym">是否显示已满课程</label></div>' +
    '<div><input type="checkbox" id="show_ct"><label for="show_ct">是否显示冲突课程</label></div>' +
    '<div><input type="checkbox" id="show_yx"><label for="show_yx">是否显示已选课程</label></div>' +
    '<div><input type="checkbox" id="show_zc"><label for="show_zc">是否显示正常课程</label></div>';
  $("#dialog-setting-nr").html(setting_dialog)
  $("#show_rs").attr("checked", show_rs);
  $("#show_ym").attr("checked", show_ym);
  $("#show_ct").attr("checked", show_ct);
  $("#show_zc").attr("checked", show_zc);
  $("#show_yx").attr("checked", show_yx);

  $("#dialog-setting").dialog({
    title: "显示选项设置：公共课",
    buttons: {
      "确定": function() {
        var before_change = [show_zc, show_rs, show_ym, show_ct, show_yx];
        show_zc = $("#show_zc").attr("checked");
        show_rs = $("#show_rs").attr("checked");
        show_ym = $("#show_ym").attr("checked");
        show_ct = $("#show_ct").attr("checked");
        show_yx = $("#show_yx").attr("checked");
        var after_change = [show_zc, show_rs, show_ym, show_ct, show_yx];
        if (before_change.toString() != after_change.toLocaleString()) {
          drawJxbView();
        }
        $(this).dialog("close");
      }
    }
  });
}
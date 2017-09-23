$(document).ready(function() {

});


/**
 * 根据业务规则过滤页面加载的教学班列表
 */
function generateFilterJxbs() {
  delete jxbFilters;
  delete results;

  jxbFilters = new Array();
  results = new Array();

  //班级选择情况过滤（与选课结果比较是否已选、冲突判断）
  for (jxbid in qxxbxkJxb) {

    var jxbObj = qxxbxkJxb[jxbid];

    var jgObj = loadJxbXkFilter(jxbObj);

    var fit = true;
    //已选，则过滤
    if (jgObj.isYx) {
      fit = false;
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
    var jxbObj = qxxbxkJxb[datas[i].jxbid];

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
      top.zxXklcObj.xkcl != "1") {
      //人数显示"已满"
      $("#" + view_table + "_xkrs_" + datas[i].jxbid).html(
        "<font style='color:red'>已满</font>");
    } else {
      //人数显示显示
      $("#" + view_table + "_xkrs_" + datas[i].jxbid).html(jxbKxrs + "&nbsp;/&nbsp;" +
        "<font style='color:red'>" + jxbYxrs);
    }

    //选课按钮显示2013-07-02hnn
    if (parseInt(jxbKxrs) > 0) {
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
 *直接跳转页面
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
  var to_page = document.getElementById("beginPage").value;

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
  drawJxbView();

}
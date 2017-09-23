var view_table = "view_table";
// 快速选课教学班列表
var qxxxxJxb = new Array();

// 记录业务规则过滤后的教学班列表，查询等页面操作都是针对此列表
var filterJxbs = new Array();
// 过滤后教学班相应的过滤信息
var jxbFilters = new Array();
//定义装载当前显示的教学班信息列表，用于从后台抓起人数
var xsJxbidList = new Array();
//教学班附加信息，用于下面的业务处理
var jxbfjxxList = new Array();

//用于存储冲突信息列表
var ctxxList = {};

// 需更新的教学班相关附加信息列表
var commJxbfjxx = null;

$(document).ready(function() {
  // 定义人数更新判断方法
  var options = {
    success: function(responseData, statusText) {
      if (responseData.success) {
        var datas = responseData.data;
        // 根据教学班已选情况加载教学班显示
        setJxbViewAttr(datas, view_table, commJxbfjxx);
      }
    },
    url: 'calJxbRs.html?method=getRsToZxxk',
    type: 'post',
    dataType: 'json',
    forceSync: true
  };

  $('#hiddenForm').submit(function() {
    $('#hiddenForm').ajaxSubmit(options);
    return false;
  });

  $("#dialog").dialog({
    autoOpen: false,
    show: "blind",
    hide: "explode"
  });

  drawJxbView();
  $("#pagid").html(top.pagination);
});

/**
 * 根据业务规则过滤页面加载的教学班列表
 */
function drawJxbView() {
  delete filterJxbs;
  delete jxbFilters;
  delete xsJxbidList;
  delete jxbfjxxList;

  filterJxbs = new Array();
  jxbFilters = new Array();
  xsJxbidList = new Array();
  jxbfjxxList = new Array();

  // 班级选择情况过滤（与选课结果比较是否已选、冲突判断）
  for (jxbid in qxxxxJxb) {
    var jxbObj = qxxxxJxb[jxbid];
    var jgObj = loadJxbXkFilter(jxbObj);
    filterJxbs[jxbid] = jxbObj;
    jxbFilters[jxbid] = jgObj;

    var kclbmc = "&nbsp;"
    if (top.kclbMap[jxbObj.kclbdm] != null) {
      kclbmc = top.kclbMap[jxbObj.kclbdm];
    }

    var kcxzmc = "&nbsp;";
    if (top.kcxzMap[jxbObj.kcxzdm] != null) {
      kcxzmc = top.kcxzMap[jxbObj.kcxzdm];
    }

    var xqmc = "&nbsp;";
    if (top.xqiuMap[jxbObj.xqdm] != null) {
      xqmc = top.xqiuMap[jxbObj.xqdm];
    }

    var kkdwmc = "&nbsp;";
    if (top.yxObjList[jxbObj.kkdw] != null) {
      kkdwmc = top.yxObjList[jxbObj.kkdw];
    }

    $("#" + view_table + "_kclbdm_" + jxbid).html(kclbmc);
    $("#" + view_table + "_kcxzdm_" + jxbid).html(kcxzmc);
    $("#" + view_table + "_kkdw_" + jxbid).html(kkdwmc);

    //设置校区
    //  $("#" + view_table + "_xqdm_" + jxbid).html(xqmc);

    //拼接上课时间、地点信息
    var pkxxList = jxbObj.pkxxlist;
    var sksjTxt = "";
    var skddTxt = "";
    for (var yxIndex in pkxxList) {
      var pkxxObj = pkxxList[yxIndex];
      if (sksjTxt != "") {
        sksjTxt += "<br>";
      }

      var jcxx = "";
      if (pkxxObj.ksjc != "" && pkxxObj.jsjc != "" && pkxxObj.ksjc == pkxxObj.jsjc) {
        jcxx = pkxxObj.ksjc;
      } else {
        jcxx = pkxxObj.ksjc + "-" + pkxxObj.jsjc;
      }
      sksjTxt += top.transformWeek(pkxxObj.xq) + " 第" + jcxx + "节 " + pkxxObj.zcmc + "周";

      if (skddTxt != "") {
        skddTxt += "<br>";
      }
      skddTxt += pkxxObj.skjsmc;
    }
    if (sksjTxt == "")
      sksjTxt = "&nbsp;";
    if (skddTxt == "")
      skddTxt = "&nbsp;";

    //填充上课时间
    $("#" + view_table + "_sksj_" + jxbid).html(sksjTxt);
    //填充上课地点
    $("#" + view_table + "_skdd_" + jxbid).html(skddTxt);

    // 存在冲突的班级
    if (jgObj.ctHtmlTxt != "") {
      ctxxList[jxbid] = jgObj.ctHtmlTxt;
      // 班级冲突信息查看绑定
      jxbCtxxBind(view_table, jxbid);
    }

    // 装载显示教学班列表
    var jxb = new Object();
    jxb.jxbid = jxbid;
    xsJxbidList.push(jxb);

    // 转载教学班附加信息
    var fjxxObj = new Object();
    fjxxObj.bjrnrs = jxbObj.bjrnrs; // 班级容纳人数
    fjxxObj.ctHtmlTxt = jgObj.ctHtmlTxt;
    jxbfjxxList[jxbid] = fjxxObj;
  }

  // 获取教学班已选人数
  refreshJxbRs(xsJxbidList, jxbfjxxList);

  //查看课程简介操作     
  $("#" + view_table + " a.kcjj").click(function() {
    var kcdm = $(this).html();

    //获取课程简介
    var rev = eval('(' + $.ajax({
      url: "courseDetail.html",
      data: {
        kcdm: kcdm
      },
      async: false
    }).responseText + ')');

    var kcmc = "";
    var kcjj = "无";

    if (rev.kcmc != undefined && rev.kcmc != "") {
      kcmc = rev.kcmc;
    }
    if (rev.kcjj != undefined && rev.kcjj != "") {
      kcjj = rev.kcjj;
    }

    $("#dialog-kcjj-nr").html(kcjj);
    $("#dialog-kcjj").dialog({
      title: "课程简介：" + kcmc,
      modal: true,
      width: 350,
      height: 200,
      buttons: {
        "确定": function() {
          $(this).dialog("close");
        }
      }
    });

    return false;
  });

  //查看教学班教学进度2013-07-03hnn     
  $("#" + view_table + " a.jxjd").click(function() {
    var jxbid1 = $(this).attr("id");
    //获取课程简介
    var rev = eval('(' + $.ajax({
      url: "courseJxjd.html",
      data: {
        jxbid: jxbid1
      },
      async: false
    }).responseText + ')');

    var kcmc = "";
    var kcxzmdrw = "无";
    var jcxx = "无";
    var jxjbyq = "无";
    var kslx = "无";

    var bz = "无";
    var dh = "无";
    var zcmc = "无";
    var email = "无";
    var zjls = "无";

    var innerHTML = "";
    if (rev.kcxzmdrw != undefined && rev.kcxzmdrw != "") {
      kcxzmdrw = rev.kcxzmdrw;
      innerHTML += "<b>课程性质目的任务:</b><br> ";
      innerHTML += kcxzmdrw;
      innerHTML += "<br><br>";
    }
    if (rev.jcxx != undefined && rev.jcxx != "") {
      jcxx = rev.jcxx;
      innerHTML += "<b>课程教材、参考书:</b><br> ";
      innerHTML += jcxx;
      innerHTML += "<br><br>";
    }
    if (rev.jxjbyq != undefined && rev.jxjbyq != "") {
      jxjbyq = rev.jxjbyq;
      innerHTML += "<b>教学基本要求:</b><br> ";
      innerHTML += jxjbyq;
      innerHTML += "<br><br>";
    }
    if (rev.kslx != undefined && rev.kslx != "") {
      kslx = rev.kslx;
      innerHTML += "<b>考试要求:</b><br> ";
      innerHTML += kslx;
      innerHTML += "<br><br>";
    }

    innerHTML += "<table id='jxjd_table' width='100%' class='jxjd_table' cellpadding='0' cellspacing='0'>";
    innerHTML += "<tr><th width='20%'>主讲老师</th><td width='30%'>";

    if (rev.zjls != undefined && rev.zjls != "") {
      zjls = rev.zjls;
      innerHTML += zjls;
    } else {
      innerHTML += "&nbsp;";
    }

    innerHTML += "</td>";
    innerHTML += "<th width='15%'>职称</th><td width='35%'>";
    if (rev.zcmc != undefined && rev.zcmc != "") {
      zcmc = rev.zcmc;
      innerHTML += zcmc;
    } else {
      innerHTML += "&nbsp;";
    }
    innerHTML += "</td></tr>";
    innerHTML += "<tr><th>电话</th><td>";

    if (rev.dh != undefined && rev.dh != "") {
      dh = rev.dh;
      innerHTML += dh;
    } else {
      innerHTML += "&nbsp;";
    }
    innerHTML += "</td><th>EMAIL</th><td>";

    if (rev.email != undefined && rev.email != "") {
      email = rev.email;
      innerHTML += email;
    } else {
      innerHTML += "&nbsp;";
    }

    innerHTML += "</td></tr><tr><th>备注</th><td colspan='3'>";
    if (rev.bz != undefined && rev.bz != "") {
      bz = rev.bz;
      innerHTML += bz;
    } else {
      innerHTML += "&nbsp;";
    }
    innerHTML += "</td></tr></table>";

    $("#dialog-jxjd-nr").html(innerHTML);
    $("#dialog-jxjd").dialog({
      title: "课程及教师介绍信息" + kcmc,
      modal: true,
      width: 600,
      height: 400,
      buttons: {
        "确定": function() {
          $(this).dialog("close");
        }
      }
    });

    return false;
  });
}

// 记录当前页已满的教学班
var fullJxbs = {};
/*
 * ================================================================================
 * 功能描述 : 设置每个显示教学班相关的属性（人数，可选情况） 作用窗体 : 输入参数 : 无 输出参数 :
 * ================================================================================
 */
function setJxbViewAttr(datas, view_table, jxbfjxxList) {
  delete fullJxbs;
  fullJxbs = {};

  for (var i = 0; i < datas.length; i++) {
    //教学班容纳人数
    var jxbObj = qxxxxJxb[datas[i].jxbid];

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
      //人数显示显示2013-06-03hnn
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
 * 
 * @param jxbObj
 *            待比较班级对象；
 * 
 * @returns jxbObj;jxbObj.isYx 是否已选 jxbObj.ctHtmlTxt 冲突信息
 */
function loadJxbXkFilter(jxbObj) {
  var jgObj = new Object();

  jgObj.isYx = false;
  jgObj.ctHtmlTxt = "";

  //英语课过滤，学生自己选择自己的英语级别课程
  for (var i = 0; i < parseInt(top.dljbkcList.length); i++) {
    var jbkcObj = top.dljbkcList[i];
    if (jxbObj.kcdm == jbkcObj.kcdm) {
      jgObj.isYx = true;
      for (var j = 0; j < parseInt(top.yykList.length); j++) {
        var yykObj = top.yykList[j];
        if (jxbObj.kcdm == yykObj.kcdm) {
          jgObj.isYx = false;
          break;
        }
      }
      //说明不是学生个人级别的英语课则不可选
      if (eval(jgObj.isYx)) {
        return jgObj;
      } else { //否则可选
        break;
      }
    }
  }

  //当前传入可选教学班信息
  var yxJxbList = top.yxJxbList;

  //判断已选列表是否有该课程的教学班
  for (var jxbid in yxJxbList) {
    if (jxbObj.kcdm == yxJxbList[jxbid].kcdm) {
      jgObj.isYx = true;
      return jgObj;
    }
  }

  //过滤历史已选课程信息
  var lsyxList = top.lsyxList;
  for (var kcdm in lsyxList) {
    if (jxbObj.kcdm == kcdm) {
      jgObj.isYx = true;
      return jgObj;
    }
  }

  //判断是否是历史已选课程，如果是历史已选课程则进行显示
  /*   if(jxbObj.sftykczx!="1"){		//体育课可选重复修读，所以不过滤历史课程
    	var lsyxList = top.lsyxList;
	    for ( var kcdm in lsyxList) {
	        if(jxbObj.kcdm == kcdm) {
	            jgObj.isYx = true;
	            return jgObj;
	        }
	    }
    } */

  //与选课结果中所有的教学班比较
  var kxPkxxList = jxbObj.pkxxlist;
  for (var jxbid in yxJxbList) {
    /** 判断已选教学班排课信息冲突校验 */
    var yxPkxxList = yxJxbList[jxbid].pkxxlist;
    for (var yxIndex in yxPkxxList) {
      var yxPkObj = yxPkxxList[yxIndex];

      //与可选课程的排课信息进行比较
      for (var kxIndex in kxPkxxList) {
        var kxPkObj = kxPkxxList[kxIndex];

        //判断星期是否相同
        if (kxPkObj.xq == yxPkObj.xq) {

          //判断周次
          if ((parseInt(kxPkObj.zcbh, "2") & parseInt(yxPkObj.zcbh, "2")) * 1 != 0) {

            //判断节次
            if ((parseInt(kxPkObj.jsjc) >= parseInt(yxPkObj.ksjc) && parseInt(kxPkObj.ksjc) <= parseInt(yxPkObj.jsjc))) {

              //拼接上课时间、地点信息
              var ctts = "<b>当前班级上课时间与已选课程上课时间冲突</b><br>"
              var ctkc = "<br>冲突课程：" + yxJxbList[yxPkObj.jxbid].kcmc;
              if (yxJxbList[yxPkObj.jxbid].bjmc != "") {
                ctkc += "(" + yxJxbList[yxPkObj.jxbid].bjmc + "班)";
              }
              var ctsj = "<br>冲突时间：" + yxPkObj.zcmc + "周 " + top.transformWeek(yxPkObj.xq) +
                " 第" + yxPkObj.ksjc + "-" + yxPkObj.jsjc + "节";

              //拼接总体冲突信息
              jgObj.ctHtmlTxt = ctts + ctkc + ctsj;

              return jgObj;
            }
          }
        }
      }
    }
  }
  return jgObj;
}

/*
 * ================================================================================
 * 功能描述 : 班级冲突信息查看方法绑定 作用窗体 : 输入参数 : 教学班ID，冲突信息 输出参数 : 无
 * ================================================================================
 */
function jxbCtxxBind(view_table, jxbid) {
  var ctViewObj = $("#" + view_table + "_ctxx_" + jxbid);
  ctViewObj.unbind('click');
  //2013-07-04hnn
  ctViewObj.html('');
  ctViewObj.append("<a href=javascript:ctxxView('" + jxbid + "') class='xkct'>冲突</a>");
}


/*
 * ===============================================================
 * 功能描述 :冲突信息显示
 * ===============================================================
 */
function ctxxView(jxbid) {
  var ctxx = ctxxList[jxbid];
  $("#ctxx").html(ctxx);
  $("#ct-message").dialog({
    modal: true,
    width: 350,
    height: 200,
    buttons: {
      "确定": function() {
        $(this).dialog("close");
      }
    }
  });
}

/*
 * ================================================================================
 * 功能描述 : 更新教学班选课人数(从后台获取) 作用窗体 : 输入参数 : 无 输出参数 :
 * ================================================================================
 */
function refreshJxbRs(xsJxbidList, jxbfjxxList) {
  commJxbfjxx = jxbfjxxList;
  document.getElementById("jxbs").value = $.toJSON(xsJxbidList);
  // 提交人数更新请求，加载可选教学班显示
  $('#hiddenForm').submit();
}


var pagination = top.pagination; // 分页时，每页的记录数
var pageNo = 1; // 起始记录


/**
 * 高级查询
 * 
 * @param pageNo
 */
function advancedQuery() {
  var ksjc = $("#jcstart_select").val();
  var jsjc = $("#jcend_select").val();
  if ((ksjc != "" && jsjc == "") || (ksjc == "" && jsjc != "")) {
    alert("开始节次、结束节次必须同时选择，请正确选择节次信息进行查询！");
    return;
  }
  if (parseInt(ksjc) > parseInt(jsjc)) {
    alert("开始节次不能大于结束节次，请正确选择节次信息进行查询！");
    return;
  }

  indexPage();
}


/**
 * 首页
 */
function indexPage() {
  pageNo = 1;
  $("#pagination").val(pagination);
  $("#pageNo").val(pageNo);
  $("#js_text").val(encodeURI($("#js_text").val()));
  $("#kcmc_text").val(encodeURI($("#kcmc_text").val()));
  document.all["queryForm"].submit();
}

/**
 * 末页
 */
function endPage() {
  pageNo = $("#endPage").attr("pageNo");
  if (queryChanged) {
    pageNo = 1;
  }
  $("#pagination").val(pagination);
  $("#pageNo").val(pageNo);
  $("#js_text").val(encodeURI($("#js_text").val()));
  $("#kcmc_text").val(encodeURI($("#kcmc_text").val()));
  document.all["queryForm"].submit();
}

/**
 * 下一页
 */
function nextPage() {
  pageNo = $("#nextPage").attr("pageNo");
  if (queryChanged) {
    pageNo = 1;
  }
  $("#pagination").val(pagination);
  $("#pageNo").val(pageNo);
  $("#js_text").val(encodeURI($("#js_text").val()));
  $("#kcmc_text").val(encodeURI($("#kcmc_text").val()));
  document.all["queryForm"].submit();
}

/**
 * 上一页
 */
function prevPage() {
  pageNo = $("#prevPage").attr("pageNo");
  if (queryChanged) {
    pageNo = 1;
  }
  $("#pagination").val(pagination);
  $("#pageNo").val(pageNo);
  $("#js_text").val(encodeURI($("#js_text").val()));
  $("#kcmc_text").val(encodeURI($("#kcmc_text").val()));
  document.all["queryForm"].submit();
}

function getLengthOfObj(obj) {
  var len = 0;
  for (var key in obj) {
    len++;
  }
  return len;
}

//查询选中的值
var va = {};

function setVa(key, value) {
  va[key] = value;
}

//查询条件改变标识
var queryChanged = false;
$(document).ready(function() {
  //开课院列表 
  var kkyList = top.loadKkyList();
  for (var i = 0; i < kkyList.length; i++) {
    var kkyObj = kkyList[i];
    $("#kkyList").append("<option value='" + kkyObj.dwdm + "'>" + kkyObj.yxmc);
  }
  $("#kkyList").val(va["kkyList"]);

  if (va["kkyList"] != null && va["kkyList"] != "") {
    //按开课院加载
    loadKkxList();
  } else {
    //开课系列表
    var kkxList = top.loadKkxList();
    for (var j = 0; j < kkxList.length; j++) {
      var kkxObj = kkxList[j];
      $("#kkxList").append("<option value='" + kkxObj.dwdm + "'>" + kkxObj.yxmc);
    }
  }
  $("#kkxList").val(va["kkxList"]);

  // 初始化星期
  $("#xq_select").append("<option value='1'>星期一");
  $("#xq_select").append("<option value='2'>星期二");
  $("#xq_select").append("<option value='3'>星期三");
  $("#xq_select").append("<option value='4'>星期四");
  $("#xq_select").append("<option value='5'>星期五");
  $("#xq_select").append("<option value='6'>星期六");
  $("#xq_select").append("<option value='7'>星期日");
  $("#xq_select").val(va["xq_select"]);

  // 初始化节次代码
  for (var jcdm in top.jcList) {
    $("#jcstart_select").append("<option value='" + jcdm + "'>" + top.jcList[jcdm] + "</option>");
    $("#jcend_select").append("<option value='" + jcdm + "'>" + top.jcList[jcdm] + "</option>");
  }

  $("#jcstart_select").val(va["jcstart_select"]);
  $("#jcend_select").val(va["jcend_select"]);

  $("#kcmc_text").val(va["kcmc_text"]);
  $("#xf_text").val(va["xf_text"]);
  $("#js_text").val(va["js_text"]);

  $("#kkxList").bind("change", function() {
    queryChanged = true;
  });

  $("#xq_select").bind("change", function() {
    queryChanged = true;
  });
  $("#jcstart_select").bind("change", function() {
    queryChanged = true;
  });
  $("#jcend_select").bind("change", function() {
    queryChanged = true;
  });
  $("#kcmc_text").bind("change", function() {
    queryChanged = true;
  });
  $("#xf_text").bind("change", function() {
    queryChanged = true;
  });
  $("#js_text").bind("change", function() {
    queryChanged = true;
  });

  // 高级查询按钮事件
  $("#advQueryFun").click(function() {
    advancedQuery();
  });

  $("#indexPage").click(function() {
    indexPage();
  });
  $("#prevPage").click(function() {
    prevPage();
  });
  $("#nextPage").click(function() {
    nextPage();
  });
  $("#endPage").click(function() {
    endPage();
  });

});


/*
 * ===================================================
 * 功能描述 : 开课院联动开课系加载
 * ===================================================
 */
function loadKkxList() {
  var kkyVal = $("#kkyList").val();

  //开课系列表
  var kkxList;
  if (kkyVal != null && kkyVal != "") {
    kkxList = top.loadKkyOnKkxList(kkyVal);
  } else {
    kkxList = top.loadKkxList();
  }

  //重修初始化开课系列表
  $("#kkxList").empty();

  $("#kkxList").append("<option value=''>-请选择-");
  for (var j = 0; j < kkxList.length; j++) {
    var kkxObj = kkxList[j];
    $("#kkxList").append("<option value='" + kkxObj.dwdm + "'>" + kkxObj.yxmc);
  }

  //查询改动标志2013-05-24hnn(初始化不用修改)
  //queryChanged = true;
}


// 选课前条件检查
var checks = new Array();

/**
 * 选教学班
 * 
 * @param jxbid
 */
function prepareSelectCourse(jxbid) {
  var jxb = qxxxxJxb[jxbid];

  delete checks;
  checks = new Array();

  /** 选课前台校验 */
  //读取前台选课轮次信息中的主修选课开放时间，如果不在选课时间范围内，不能进行选课，给出提示信息；
  //获取数据库时间
  var rev = eval('(' + $.ajax({
    url: "currentTime.html",
    async: false
  }).responseText + ')');
  var now = new Date(Date.parse(rev.stime.replace(/-/g, "/")));

  //主修开始时间
  var zxStartTime = new Date(Date.parse((top.zxXklcObj.xkksrq + " " + top.zxXklcObj.xkkssf).replace(/-/g, "/")));
  //主修结束时间
  var zxEndTime = new Date(Date.parse((top.zxXklcObj.xkjsrq + " " + top.zxXklcObj.xkjssf).replace(/-/g, "/")));
  if (now < zxStartTime || now > zxEndTime) {
    var o = new Object();
    o.isOk = false;
    o.msg = "当前不在主修选课开放时间范围内，不能进行选课，请查看选课指导页面上主修选课开放情况！";
    checks[checks.length] = o;
  }

  //判断当前选课轮次是否可退轮次2013-07-03hnn
  //if(top.zxXklcObj.xkkz=="3"){
  if (top.zxXklcObj.xkkz == "03") {
    var o = new Object();
    o.isOk = false;
    o.msg = "当前主修选课轮次已设置了‘只可退选’控制，不能进行选课！";
    checks[checks.length] = o;
  }

  var jgObj = jxbFilters[jxbid];

  //读取当前是否允许冲突选课
  if (top.xksz.SZ_YXCTXK == "0") {
    if (jgObj.ctHtmlTxt.length > 0) {
      var o = new Object();
      o.isOk = false;
      o.msg = "当前选择的班级上课时间与已选课程中上课时间冲突，不能进行选课！";
      checks[checks.length] = o;
    }
  } else { //判断当前是否冲突选课，如果是冲突选课则给出提示确认；
    if (jgObj.ctHtmlTxt.length > 0) {
      var o = new Object();
      o.isOk = true;
      o.msg = "当前选择课程班级与已选课程班级存在时间冲突，你确认继续选择？";
      checks[checks.length] = o;
    }
  }

  //正选阶段判断教学班容量是否已满
  if (top.zxXklcObj.xkcl != "1") {
    if (fullJxbs[jxbid]) {
      var o = new Object();
      o.isOk = false;
      o.msg = "当前教学班选课人数已满，无法选择此班级，请选择相同课程其它班级！";
      checks[checks.length] = o;
    }
  }

  //选课方法
  selectCourse(jxbid);
}

/**
 * 选课操作
 * 
 * @param jxbid
 * @param xkzy
 */
function selectCourse(jxbid) {
  var jxb = qxxxxJxb[jxbid];

  var okMsg = "";
  var cancelMsg = "";

  //选课类别
  var xxlx = 3;

  for (k in checks) {
    var o = checks[k];
    if (o.isOk) {
      if (o.msg && o.msg.length > 0) {
        okMsg += o.msg;
        okMsg += "<br>";
      }
    } else {
      if (o.msg && o.msg.length > 0) {
        cancelMsg += o.msg;
        cancelMsg += "<br>";
      }
    }
  }

  if (cancelMsg.length > 0) {
    $("#dialog-ts-nr").html(cancelMsg);
    $("#dialog-ts").dialog({
      modal: true,
      buttons: {
        "确定": function() {
          $(this).dialog("close");
        }
      }
    });
    return;
  }
  if (okMsg.length > 0) {
    $("#dialog-ts-nr").html(okMsg);
    $("#dialog-ts").dialog({
      modal: true,
      buttons: {
        "确定": function() {
          $(this).dialog("close");
          //调用选课
          submitSelectCourse(jxbid, xxlx);
        },
        "取消": function() {
          $(this).dialog("close");
        }
      }
    });
    return;
  }

  //确认选课
  $("#dialog-qrxk").dialog({
    modal: true,
    buttons: {
      "确定": function() {
        $(this).dialog("close");
        //调用选课
        submitSelectCourse(jxbid, xxlx);
      },
      "取消": function() {
        $(this).dialog("close");
      }
    }
  });
}

/**
 * 提交选课
 * @param jxbid
 * @param xklx
 * @param xkzy
 */
function submitSelectCourse(jxbid, xxlx) {
  var jxb = qxxxxJxb[jxbid];

  var rev = eval('(' + $.ajax({
    url: "elect.html?method=handleZxxk",
    data: {
      jxbid: jxbid,
      xxlx: xxlx,
      xklc: top.zxXklcObj.lcid
    },
    async: false
  }).responseText + ')');

  if (rev.success) { //选课成功
    //加入已选列表中
    jxb.lcid = top.zxXklcObj.lcid
    jxb.sfcxxk = "0";
    jxb.xdxz = "1";
    jxb.xssfkt = "1";
    jxb.xksj = rev.xksj;
    if ("1" == top.zxXklcObj.xkcl) {
      jxb.xkzt = "1";
    } else {
      jxb.xkzt = "2";
    }

    //提示选课不成功
    $("#dialog-ts-nr").html("选课成功！");
    $("#dialog-ts").dialog({
      modal: true,
      buttons: {
        "确定": function() {
          $(this).dialog("close");

          //加入到前台选课结果
          top.addYxJxbObj(jxb);
          indexPage();
        }
      }
    });

  } else {
    //提示选课不成功
    $("#dialog-ts-nr").html(rev.message);
    $("#dialog-ts").dialog({
      modal: true,
      buttons: {
        "确定": function() {
          $(this).dialog("close");
          //重新刷新页面
          drawJxbView();
        }
      }
    });
  }
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
 * @param to_page
 */
function beginPage() {
  var to_page = document.getElementById("beginPage").value;

  if (isNaN(to_page) || to_page <= 0) {
    alert("提示：请输入有效页数!");
    return;
  }
  var totalCount = document.getElementById("totalPageCount").innerText;
  if (parseInt(to_page, "10") > parseInt(totalCount, "10")) {
    alert("已超出最大页数!");
    return;
  }
  pageNo = to_page;
  if (queryChanged) {
    pageNo = 1;
  }
  $("#pagination").val(pagination);
  $("#pageNo").val(pageNo);
  $("#js_text").val(encodeURI($("#js_text").val()));
  $("#kcmc_text").val(encodeURI($("#kcmc_text").val()));
  document.all["queryForm"].submit();
}
# 厦门大学本科选课系统改造脚本
用来对厦门大学本科选课系统做一些简单的修改，主要是增加一些显示设置选项。

弄这个脚本一方面是因为觉得选课功能提供的功能还有所欠缺，另一方面是想再练习下最近刚接触的JavaScript。

## 使用说明
这个脚本在（主修选课的）院系必修课、全校性必修课、院系选修课和公共课几个页面增加了“显示设置”按钮（全校性选修课页面结构不大一样，暂未修改完成），按钮位于课程列表右上角的查询处。设置页面的选项包括：

- 是否显示已满课程已选人数（默认为否）：在第三轮和第四轮选课时，当选课人数大于等于可选人数时人数会显示已满而不显示已选人数，这个选项可以用于在此时强制显示课程已选人数。需要显示人数的原因可能包括：想要知道教学班的可选人数；便于换课（当已选人数大于可选人数时，应避免换课）；无聊想看看。

- 是否显示已满课程（默认为是）：字面意思，设定不显示时会隐藏已满课程。

- 是否显示冲突课程（默认为是）：还是字面意思，设定不显示时会隐藏冲突课程。和上一次选项一起可以便于选课时筛选自己所需课程。

- 是否显示已选课程（默认为否）：默认情况下，当你选了某个课程后（或者是以往学期选过这个课程），这个课程所有的教学班都不再显示。设定显示已选课程后就能显示这些被隐藏的教学班，但只能看，不能选。

- 是否显示正常课程（默认为是）：字面意思。正常课程指除了已满、冲突、已选课程以外的其他课程。

- 每页课程数（默认为20）：每页显示多少课程。这个选项也可以通过页面底部翻页处设置。

- 是否全局设置（默认为否）：默认情况下，以上选项仅针对当前页面，切换其他页面后就会失效（恢复默认）。选中该选项后就能让选项变成全局选项，切换其他页面不失效。


## 其他说明
这个脚本是在第三轮选课时写的，不保证在其他轮次时不会出现一些科学难以解释的错误。同时，院系必修课和全校性必修课两个页面也没有经过详细的测试（没有必修课了= =）。有啥错误或者有啥需要的新功能可以报告（不包括抢课功能），但相应的需要提供测试账号。

## TODO
完成对全校性选修课的修改
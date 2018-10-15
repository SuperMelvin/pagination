(function () {
	function pageTable(obj) {
		var thead = "<th scope='col'>Id</th><th scope='col'>Title</th><th scope='col'>Year</th>" //表头
		var select = "<option value='5'>5条/页</option><option value='10'>10条/页</option><option value='20'>20条/页</option>" //选择每页几项
		$("#pagination").html("<div class='row'><div class='col'><table class='table'><thead><tr>" + thead + "</tr></thead><tbody id='table'></tbody></table></div></div><div class='row'><div class='col'><select id='pageSelect' class='custom-select sel-right'>" + select + "</select><nav aria-label='Page navigation example' class='pg-right'><ul class='pagination' id='page'></ul></nav></div></div><img src='loading.gif' alt='loading...' class='load' id='loading'/>") //表格、页码绘制
		var limit = obj.limit //每页大小，入参
		var offset = obj.offset //当前页数，入参
		var ol = { //作为参数传给tablePage方法
			limit: limit,
			offset: offset,
		}
		$("#pageSelect").change(function(){
			var newLimit = $("#pageSelect").val() //根据select框里的值改变limit的值
			tablePage({limit: newLimit, offset: 1})
		})
		function tablePage (ol) { 
			console.log(ol)
			$("#loading").show() //显示加载动画
			var limit = ol.limit //每页大小，入参
			var offset = ol.offset //当前页数，入参
			var start = limit * (offset - 1)//从第几项开始
			var data = {
				start: start,
				count: limit,
			}
			$.ajax({
				type: "POST",
				dataType: "jsonp",
				data: data,
				timeout: 60000, //超时时间60s
				url: "http://api.douban.com/v2/movie/top250",
				success: function (res) {
					console.log(res)
					$("#loading").hide() //隐藏加载动画
					var count = res.total % limit //总页数与每页大小取余数
					var page = parseInt(res.total / limit) //总页数（能整除情况）
					var p = "" //页码拼接变量
					if (count != 0) {
						page += 1 //有余数，则页数+1
					}
					var list = res.subjects //请求返回的数组
					var it = "" //表格拼接变量
					for (var i = 0; i < list.length; i++) { //表格生成
						it = it + "<tr class='ttbb" + i + "'><td>" + list[i].id + "</td><td>" + list[i].title + "</td><td>" + list[i].year + "</td></tr>"
					}
					$("#table").html(it)
					for (var i = 0; i < page; i++) { //页码拼接
						p = p + "<li class='page-item ppgg" + i + "'><a class='page-link' href='javascript:;' onclick='tablePage({ limit: " + limit + ", offset: " + (i + 1) + " })'>" + (i + 1) + "</a></li>"
					}
					//添加首页、尾页、前一页、后一页
					var pp = "<li class='page-item ff'><a class='page-link' href='javascript:;' aria-label='Previous' onclick='tablePage({ limit: " + limit + ", offset: 1 })'><span aria-hidden='true'>&laquo;</span></a></li><li class='page-item ff'><a class='page-link' href='javascript:;' onclick='tablePage({ limit: " + limit + ", offset: " + (offset - 1) + " })'>←</a></li>" + p + "<li class='page-item ll'><a class='page-link' href='javascript:;' onclick='tablePage({ limit: " + limit + ", offset: " + (offset + 1) + " })'>→</a></li><li class='page-item ll'><a class='page-link' href='javascript:;' aria-label='Next' onclick='tablePage({ limit: " + limit + ", offset: " + page + " })'><span aria-hidden='true'>&raquo;</span></a></li>"
					$("#page").html(pp) //页码生成
					for (var i = 0; i < page; i++) {
						if (i == (offset - 1)) { //当前页码样式
							$(".ppgg" + i).addClass("active")
						}
					}
					if (offset == 1) {
						$(".ff").addClass("disabled") //当页码为第一页时，禁用首页、前一页
					}
					if (offset == page) {
						$(".ll").addClass("disabled")	//当页码为最后一页时，禁用尾页、后一页
					}
					if (page > 5) {
						if ((page - offset) == 1) {
							for (var i = 0; i < page; i++) {
								if (i < (offset - 4) || i > offset) { //隐藏多余页码（倒数第二页时）
									$(".ppgg" + i).css("display", "none")
								}
							}
						} else if ((page - offset) == 0) {
							for (var i = 0; i < page; i++) {
								if (i < (offset - 5)) { //隐藏多余页码（末页时）
									$(".ppgg" + i).css("display", "none")
								}
							}
						} else if (offset == 2){
							for (var i = 0; i < page; i++) {
								if (i > (offset + 2)) { //隐藏多余页码（第二页时）
									$(".ppgg" + i).css("display", "none")
								}
							}
						} else if (offset == 1){
							for (var i = 0; i < page; i++) {
								if (i > (offset + 3)) { //隐藏多余页码（首页时）
									$(".ppgg" + i).css("display", "none")
								}
							}
						} else {
							for (var i = 0; i < page; i++) {
								if (i < (offset - 3) || i > (offset + 1)) { //隐藏多余页码（显示5个页码）
									$(".ppgg" + i).css("display", "none")
								}
							}
						}
					}
				},
				error: function (res) {
					$("#loading").hide()
					alert("请求失败") //请求失败 
				}
			})
			return tablePage
		}
		window.tablePage = tablePage(ol)
	}
	window.pageTable = pageTable
})()

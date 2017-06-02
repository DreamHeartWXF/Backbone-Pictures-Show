//定义图片模型模块
define(function (require,exports,module) {
	// 容器宽度 窗口宽度一半，减去左边的边距，右边边距
	var w = $(window).width() / 2- 6 - 3;
	// console.log(w);
	//创建模型类
	var ImgModel = Backbone.Model.extend({
		//创建构造函数
		initialize:function () {
			// console.log(111);
			// 我们要求小图片的高度，求完，还要为实例化对象赋值，所以我们可以在构造函数里面执行 
			// H / W * w
			var h = this.attributes.height / this.attributes.width * w;
			// console.log(h);
			//添加属性
			this.attributes.viewWidth = w;
			this.attributes.viewHight = h;
		}
	})
	//暴露接口
	module.exports = ImgModel;

	/*// 实例化
	var data = {
			"title": "精彩建筑摄影作品",
			"url": "img/01.jpg",
			"type": 1,
			"width": 640,
			"height": 400
		}
	console.log(new ImgModel(data))*/
})
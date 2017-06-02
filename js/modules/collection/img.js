////定义图片集合模块
define(function (require,exports,module) {
	//引入图片模型文件
	var ImgModel = require('modules/model/img');
	//拓展图片集合类
	var ImgCollection = Backbone.Collection.extend({
		model:ImgModel,
		//模型id计数
		idNum:0,
		//实现拉取数据的方法，作用：
			//对返回的结果随机排序
			//对每一个模型添加一个id
		//定义拉取数据的方法
		fetchData:function () {
			//缓存this
			var me = this;
			//异步请求数据
			$.get('data/imagelist.json',function (res) {
				// console.log(res);
				if(res && res.errno === 0){
					//对返回的数据进行随机排序
					res.data.sort(function () {
						//乱序就返回一个随机布尔值
						return Math.random() > 0.5 ? true : false;
					})
					//为每一个成员添加一个id
					res.data.forEach(function (obj) {
						obj.id = ++me.idNum;
					})
					//将返回的数据添加到集合中
					me.add(res.data);
					// console.log(me.toJSON());
				}
			})
		}
	})
	//暴露接口
	module.exports = ImgCollection;
	/*//实例化图片集合
	var ic = new ImgCollection();
	ic.fetchData();*/
})

define(function (require,exports,module) {
	//引入样式文件
	require('./layer.css');
	//获取框口的高度
	var height = $(window).height();
	//创建大图页视图类
	var Layer = Backbone.View.extend({
		//定义当前图片的id
		modelId:0,
		//保存浏览过的图片
		imageList:[],
		tpl: _.template($('#tpl_layer').html()),
		//定义事件
		events:{
			//点击图片切换header的显隐
			'tap .container img':'toggleHeader',
			'swipeLeft .container img':'showNextImg',
			'swipeRight .container img':'showPreImg',
			//绑定返回事件
			'tap .go-back':'goBack'
		},
		//定义返回逻辑
		goBack:function (){
			//第一种方案，返回列表页
			// location.hash = '';
			// history.go(-1);
			// Backbone.history.location.replace('');
			//第二种方案，返回上一张图片，如果图片存在显示，不存在返回列表页
			//删除当前的，显示上一张
			this.imageList.pop();
			if(this.imageList.length) {
				//获取上一张图片的id
				var id = this.imageList[this.imageList.length-1];
				//根据上一张图片的id,获取上一张图片的模型实例化对象
				var model = this.collection.get(id);
				//渲染上一张图片
				this.updateView(model);
			}else{
				//没有图片进入列表页
				location.hash = '';
			}

		},
		// 显示下一张图片
		showNextImg:function () {
			// console.log('下一张图片');
			this.modelId ++;
			// 看看能不能获取到这张图片
			var model = this.collection.get(this.modelId);
			if(model){
				//渲染这张图片
				this.updateView(model);
				//存储更新的图片
				this.imageList.push(this.modelId)
			}else{
				//不存在
				// 将id加回来，提示用户
				this.modelId++;
				alert('已经是最后一张了');
			}
		},
		showPreImg:function () {
			// console.log('上一张图片');
			this.modelId--;
			// 看看能不能获取到这张图片
			var model = this.collection.get(this.modelId);
			if (model) {
				// 渲染这张图片
				this.updateView(model)
				// 存储更新的图片
				this.imageList.push(this.modelId)
			} else {
				// 不存在
				// 将id加回来，提示用户
				this.modelId++;
				alert('已经是第一张了')
			}
		},
		/**
		 * 根据模型实例化对象，更新视图
		 * @model 	图片模型实例化对象
		 **/
		updateView:function (model) {
			//更新title
			this.$el.find('header h1')
				//更新内容
				.html(model.get('title'))
			//更新image
			this.$el.find('.container img')
				//更新src属性
				.attr('src',model.get('url'))
		},
		// 切换header的显隐
		toggleHeader:function () {
			this.$el.find('header').toggle()
		},
		render:function (num) {
			//根据num获取模型
			var model = this.collection.get(num);
			//判断模型是否存在，不存在我们进入列表页
			if(!model){
				//进入列表页
				window.location.hash = '';
				//后面的逻辑不能再执行了
				return;
			}
			//存储当前模型的id
			this.modelId = model.get('id');
			//这是第一张浏览的图片，我们保存
			this.imageList.push(this.modelId)
			//按照渲染视图的顺序去渲染
			//1、获取容器
			// this.$el
			//2、获取数据
			var data = {
				//图片地址
				src:model.get('url'),
				//标题
				title:model.get('title'),
				//图片父元素的样式
				style:'line-height:' + height + 'px;'
			}
			//3、获取模板
			var tpl = this.tpl;
			//4、格式化模板
			var html = tpl(data);
			//5、渲染到页面中
			this.$el.html(html);
		}
	})

	//暴露接口
	module.exports = Layer;
})
//第一步，定义模块
define(function (require,exports,module) {
	//第五步，引入样式文件
	require('./list.css');
	//第二步，创建列表页视图类
	var List = Backbone.View.extend({
		//绑定事件
		events:{
			//点击搜一搜，搜索图片
			'tap .search span':'searchImg',
			//为每一个类绑定tap事件
			'tap .nav li':'getImgByType',
			//点击返回顶部按钮，返回顶部
			'tap .go-top':'goTop'
		},
		//定义模板
		tpl:_.template('<a href="<%=link%>"><img style="<%=style%>" src="<%=src%>" alt="" /></a>'),
		//我们定义两个变量来缓存dom的高度
		leftHeight:0,
		rightHeight:0,
		//定义构造函数
		initialize:function () {
			//缓存this
			var me = this;
			//缓存一些必要的dom元素
			this.initDom();
			//订阅集合事件
			this.listenTo(this.collection,'add',function (model,collection,option) {
				//这里可以直接访问视图
				this.render(model);
			})
			//定义节流方法
			var fn = _.throttle(function () {
				me.getData();
			},2000)
			//绑定事件
			$(window).on('scroll',function () {
				//判断加载条件
				if($('body').height() < $(window).scrollTop() + $(window).height() + 200){
					//加载图片
					// me.getData();
					fn();
				}
				me.CheckShowGoTop();
			})
			//让集合去请求数据
			this.getData();
		},
		/**
		*检测是否显示返回顶部按钮
		**/
		CheckShowGoTop:function () {
			//滚动超过300px显示
			if($(window).scrollTop() > 300){
				this.$el.find('.go-top').show();
			}else{
				//小于300px要隐藏
				this.$el.find('.go-top').hide();
			}
		},
		//返回顶部
		goTop:function () {
			window.scrollTo(0,0);
		},
		//获取一些必要的元素
		initDom:function () {
			//获取左右容器元素
			this.leftDom = this.$el.find('.left-container');
			this.rightDom = this.$el.find('.right-container');
		},
		//请求集合数据
		getData:function () {
			//通过集合请求数据
			this.collection.fetchData();
		},
		//定义渲染方法
		render:function (model) {
			var height = model.get('viewHight');
			//1.获取元素
			//2.获取数据
			var data = {
				//定义链接地址
				link:'#layer/' + model.get('id'),
				//定义图片地址
				src:model.get('url'),
				//定义图片样式
				style:'width:' + model.get('viewWidth') + 'px;height:' + height + 'px;'
			}
			//3.定义模板
			var tpl = this.tpl;
			//4.格式化模板
			var html = tpl(data);
			//5.渲染到页面中
			//应该先判断向左边渲染还是向右边渲染，看左右两边容器的高度谁的比较小
			if(this.leftHeight <= this.rightHeight){
				this.renderLeft(html,height);
			}else{
				//我们向右边容器渲染
				this.renderRight(html,height);
			}
		},
		/**
		*我们向左边容器渲染
		*@html 渲染的内容(图片)
		*@height 更改的高度(图片的高度)
		**/
		renderLeft:function (html,height) {
			//渲染内容
			this.leftDom.append(html);
			//更新高度，图片的高度以及底边的边距
			this.leftHeight += height + 6;
		},
		//向右边渲染的方法
		renderRight:function (html,height) {
			//渲染内容
			this.rightDom.append(html);
			//更新高度，图片的高度以及底边的边距
			this.rightHeight += height + 6;
		},
		//获取搜索框内容
		getSearchVal:function () {
			return this.$el.find('.search input').val();
		},
		/**
		*校验搜索框内容是否合法
		*@value 搜索框的内容
		*return 是否有错误，有错误返回true
		**/
		checkSearchValError:function (value) {
			//value 不为空
			if(/^\s*$/.test(value)){
				alert('请输入内容');
				return true;
			}
			return false;
		},
		/** 
		*定义集合过滤方法
		*@value 过滤的字段
		*过滤的字段名称
		*return 符合条件的数组
		**/
		collectionFilter:function (value,type) {
			//调用集合的过滤方法过滤
			return this.collection.filter(function (model,index,models) {
				//如果过滤type字段，我们判断属性值是否相等
				if(type === 'type'){
					return model.get('type') == value;
				}
				//过滤条件：title中是否包含该字段
				return model.get('title').indexOf(value) > -1;
			})
		},
		/*collectionFilterType:function (value) {
			return this.collection.filter(function (model,index,models) {
				return model.get('type') === value;
			})
		},*/
		//清空视图
		clearView:function () {
			//清空左右容器内容
			this.leftDom.html('');
			this.rightDom.html('');
			//清空左右容器的高度
			this.leftHeight = 0;
			this.rightHeight = 0;
		},
		/**
		*渲染结果
		*@result 包含图片模型实例化对象的数组
		**/
		renderResult:function (result) {
			var me = this;
			//遍历模型渲染
			result.forEach(function (model,index) {
				//作用域是全局作用域，所以要先缓存this
				me.render(model);
			})
		},
		//点击搜索按钮，搜索图片
		searchImg:function () {
			//获取内容
			var value = this.getSearchVal();
			//进行校验
			if(this.checkSearchValError(value)){
				//阻止后面的程序继续执行
				return;
			}
			//处理内容
			//去除首位空白符
			value = value.replace(/^\s+|\s+$/g,'');
			// console.log(value);
			//集合过滤
			var result = this.collectionFilter(value);
			// console.log(result);
			//清空视图
			this.clearView();
			//渲染过滤的图片
			this.renderResult(result);
		},
		/**
		*获取类别的data-id数据
		*return 类别id
		**/
		getNavTypeValue:function (e) {
			//获取点击的dom元素
			return $(e.target).attr('data-id');
			// console.log($(e.target).data('id'));
		},
		/**
		* 点击类别按钮过滤图片
		**/
		getImgByType:function (e) {
			//获取data-id数据
			var value = this.getNavTypeValue(e);
			//过滤集合
			var result = this.collectionFilter(value,'type');
			//清空视图
			this.clearView();
			//渲染结果
			this.renderResult(result);
		}

	})
	//第三步，暴露接口
	module.exports = List;
})
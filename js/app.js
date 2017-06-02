define(function (require,exports,module) {
	//引入大图页视图模块
	var Layer = require('modules/layer/layer');
	//第六步，引入列表页视图模块
	var List = require('modules/list/list');
	/*//引入图片模型模块
	var imgModel = require('modules/model/img');*/
	//引入图片集合模块
	var ImgCollection = require('modules/collection/img');
	//实例化集合类
	var ic = new ImgCollection();
	//实例化大图页
	var layer = new Layer({
		el: $('#layer'),
		collection:ic
	})
	//第七步，实例化列表页
	var list = new List({
		el: $('#list'),
		//将集合实例化对象传递给列表视图
		collection:ic
	})
	//定义路由
	//第一步，拓展路由类
	var Router = Backbone.Router.extend({
		//定义路由规则
		routes:{
			//页面分为列表页和大图页
			//列表页的路由规则要设置成默认路由
			//只能定义在后面，所以先定义大图页的路由规则
			'layer/:num':'showLayer',
			//列表页
			'*other':'showList'
		},
		//展示大图页
		showLayer:function (num) {
			// console.log('layer');
			//当进入大图页，渲染大图页，将大图页显示
			//根据num从集合中选择model实例化对象
			layer.render(num);
			layer.$el.show();
		},
		//展示列表页
		showList:function () {
			// console.log('list');
			//第八步，渲染列表页
			// list.render();
			//当进入列表页，将大图页隐藏
			layer.$el.hide();
		}
	})
	//第二步，实例化路由
	var router = new Router();
	//第三步，启动路由
	Backbone.history.start();
})
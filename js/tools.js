//获取任意元素的任意样式
function getStyle(obj, name) {
	return window.getComputedStyle ? getComputedStyle(obj, null)[name] : obj.currentStyle[name];
}

/*
 * 现在我们将这个timer作为全局变量保存，
 * 	那么所有的动画效果都共享同一个timer，
 * 	这样将导致一个动画的执行，将会立即停止上一个动画
 * 解决这个问题，可以将timer作为对象的属性保存到执行动画的对象当中
 */
//var timer = null;

//提取一个公共的函数，专门用来处理各种动画效果
/*
 * obj 要执行动画的对象
 * attr 要执行动画的样式
 * target 执行动画的目标位置
 * speed 动画执行的速度 
 * callback 回调函数，当动画执行完毕以后执行该函数
 */
function move(obj, attr, target, speed, callback) {
	//关闭上一个定时器
	clearInterval(obj.timer);

	//判断speed是正还是负
	//当前元素的位置0  目标是800 速度 正
	//当前元素的位置800 目标是0 速度 负
	var current = parseInt(getStyle(obj, attr), 10);
	if(current > target) {
		//速度是负值
		speed = -speed;
	}

	obj.timer = setInterval(function() {

		//获取元素的原来的值
		var oldValue = parseInt(getStyle(obj, attr), 10);

		//创建一个新值
		var newValue = oldValue + speed;

		//判断newValue的值
		//当向右移动，需要判断newValue是否大于target
		//当向左移动，需要判断newValue是否小于target
		if((speed > 0 && newValue > target) || (speed < 0 && newValue < target)) {
			newValue = target;
		}

		//将新值设置给元素
		obj.style[attr] = newValue + "px";

		//元素移动到800px时就停止
		if(newValue == target) {
			//停止定时器
			clearInterval(obj.timer);

			//动画执行完毕，调用回调函数
			callback && callback();
		}

	}, 30);

}

//向一个元素添加一个新的class属性
function addClass(obj, cn) {
	//检查元素是否已经含有该class
	if(!hasClass(obj, cn)) {
		//如果当前元素中没有该class，则添加之
		obj.className += " " + cn;
	}

}

//判断一个元素中是否含有指定的class属性值
//会返回一个布尔值，如果有则返回true，否则返回false
function hasClass(obj, cn) {
	//创建一个正则表达式
	var reg = new RegExp("\\b" + cn + "\\b");
	return reg.test(obj.className);
}

//定义一个用于删除一个元素中的class属性的方法
function removeClass(obj, cn) {
	//创建一个正则表达式
	var reg = new RegExp("\\b" + cn + "\\b");
	//将obj中的className中的指定内容替换为空串
	obj.className = obj.className.replace(reg, "");

}

//切换一个元素中指定class属性值
//如果有该class，则移除，如果没有，则添加
function toggleClass(obj, cn) {
	//判断obj中是否含有cn
	if(hasClass(obj, cn)) {
		//有，移除
		removeClass(obj, cn);
	} else {
		//没有，则添加
		addClass(obj, cn);
	}

}

//自定义一个根据class属性查询元素的方法
function getEleByClass(className) {
	//创建一个数组，用来保存元素
	var result = [];
	//获取到页面中所有的元素
	var all = document.all;
	//创建一个正则表达式
	var reg = new RegExp("\\b" + className + "\\b");

	//遍历all
	for(var i = 0; i < all.length; i++) {
		//获取当前元素的class属性
		var cn = all[i].className;
		//依次判断这些元素是否具有指定的class
		//判断cn是否和className一样
		/*if(cn == className){
			//如果相等，证明当前元素中含有指定的class，则将其放入到数组当中
			result.push(all[i]);
		}*/

		//检查cn是否符合reg
		if(reg.test(cn)) {
			result.push(all[i]);
		}

	}
	//将数组返回
	return result;
}
//事件方法的绑定
function bind(obj , eventStr , callback){
	var thisa=document.getElementById(obj);
	if(thisa.addEventListener)
	{return thisa.addEventListener(eventStr,callback,false)}
	else{
		return thisa.attachEvent("on"+eventStr,function(){
			//我们要统一this的话 只要把attach事件的window变成button 即 这里的thisa
			//所以 应该是 回掉函数中 回掉函数.call(thisa)
			callback.call(thisa);
		})
	}
}
// 在Cloud code里初始化express框架
var express = require('express');
var app = express();
var name = require('cloud/name.js');
var avosExpressHttpsRedirect = require('avos-express-https-redirect');


// App全局配置
//设置模板目录
if(__production)
	app.set('views', 'cloud/views');
else
	app.set('views', 'cloud/dev_views');
app.set('view engine', 'ejs');    // 设置template引擎
app.use(avosExpressHttpsRedirect()); //启用HTTPS
app.use(express.bodyParser());    // 读取请求body的中间件

//使用express路由API服务/hello的http GET请求
app.get('/hello', function(req, res) {
	res.render('hello', { message: 'Congrats, you just set up your app!' });
});

var Info = AV.Object.extend('Info');
function renderIndex(res, parent){
	var query = new AV.Query(Info);
	query.skip(0);
	query.limit(10);
	query.descending('createdAt');
	query.find({
		success: function(results){
			res.render('index',{ parent: parent, infos: results});
		},
		error: function(error){
			console.log(error);
			res.render('500',500)
		}
	});
}

function renderQuery(res,parent,phone,weixin,study){
	var query = new AV.Query(Info);
	query.skip(0);
	query.limit(10);
	query.descending('createdAt');
	query.find({
		success: function(results){
			res.render('query',{ parent:parent, phone:phone, weixin:weixin, study:study, infos: results});
		},
		error: function(error){
			console.log(error);
			res.render('500',500)
		}
	});
}

function renderSuccess(res,parent,phone,weinxin,study){
	var query = new AV.Query(Info);
	query.skip(0);
	query.limit(10);
	query.descending('createdAt');
	query.find({
		success: function(results){
			res.render('success',{ parent:parent,phone:phone,weinxin:weinxin,study:study,infos: results});
		},
		error: function(error){
			console.log(error);
			res.render('500',500)
		}
	});
}

app.get('/query',function(req,res){
	var parent=req.query.parent;
	var phone=req.query.phone;
	var weixin=req.query.weixin;
	var study=req.quert.study;
	renderQuery(res,parent,phone,weixin,study);
});

app.get('/', function(req, res){
	var parent = req.query.parent;
	if(!parent)
		parent = 'AVOS Cloud';
	renderIndex(res, parent);
});

app.get('/info',function(req,res){
			
});

app.post('/',function(req, res){
	var parent = req.body.parent;
	var phone = req.body.phone;
	var weixin = req.body.weixin;
	var study = req.body.study;
	if(parent && parent.trim() !=''){
		//Save visitor
		var info = new Info();
		info.set('parent', parent);
		info.set('phone', phone);
		info.set('weixin', weixin);
		info.set('study', study);
		
		info.save(null, {
			success: function(gameScore) {
				renderSuccess(res,parent,phone,weixin,study);
			},
			error: function(gameScore, error) {
				res.render('500', 500);
			}
		});
	}else{
		res.redirect('/');
	}
});

// This line is required to make Express respond to http requests.
app.listen();

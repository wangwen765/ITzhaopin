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
//app.get('/hello', function(req, res) {
//	res.render('hello', { message: 'Congrats, you just set up your app!2015-07-15' });
//});

var Visitor = AV.Object.extend('Visitor');
function renderIndex(res, position){
	var query = new AV.Query(Visitor);
	query.skip(0);
	query.limit(10000);
	query.descending('createdAt');
	query.find({
		success: function(results){
			res.render('index',{ position: position, visitors: results});
		},
		error: function(error){
			console.log(error);
			res.render('500',500)
		}
	});
}

function renderQuery(res,position,Pname,PAge,jobage,Ppone,Pmail,jplevel){
	var query = new AV.Query(Visitor);
	query.skip(0);
	query.limit(10000);
	query.descending('createdAt');
	query.find({
		success: function(results){
			res.render('query',{ position: position,Pname:Pname, PAge:PAge,jobage:jobage,Ppone:Ppone,Pmail:Pmail,jplevel:jplevel,visitors: results});
		},
		error: function(error){
			console.log(error);
			res.render('500',500)
		}
	});
}

function renderSuccess(res,position,Pname,PAge,jobage,Ppone,Pmail,jplevel){
	var query = new AV.Query(Visitor);
	query.skip(0);
	query.limit(10000);
	query.descending('createdAt');
	query.find({
		success: function(results){
			res.render('success',{ position: position,Pname:Pname, PAge:PAge,jobage:jobage,Ppone:Ppone,Pmail:Pmail,jplevel:jplevel,visitors: results});
		},
		error: function(error){
			console.log(error);
			res.render('500',500)
		}
	});
}

app.get('/query',function(req,res){
	var position=req.query.position;
	var Pname=req.query.Pname;
	var PAge=req.query.PAge;
	var jobage=req.query.jobage;
	var Ppone=req.query.Ppone;
	var Pmail=req.query.Pmail;
	var jplevel=req.query.jplevel;
	renderQuery(res,position,Pname,PAge,jobage,Ppone,Pmail,jplevel);
});

app.get('/', function(req, res){
	var position = req.query.position;
	if(!position)
		position = 'AVOS Cloud';
	renderIndex(res, position);
});


app.post('/',function(req, res){
	var position=req.query.position;
	var Pname=req.query.Pname;
	var PAge=req.query.PAge;
	var jobage=req.query.jobage;
	var Ppone=req.query.Ppone;
	var Pmail=req.query.Pmail;
	var jplevel=req.query.jplevel;
	if(position && position.trim() !=''){
		//Save visitor
		var visitor = new Visitor();
		visitor.set('position', position);
		visitor.set('Pname', Pname);
		visitor.set('PAge', PAge);
		visitor.set('jobage', jobage);
		visitor.set('Ppone', Ppone);
		visitor.set('Pmail', Pmail);
		visitor.set('jplevel', jplevel);
	
		visitor.save(null, {
			success: function(gameScore) {
				renderSuccess(res,position,Pname,PAge,jobage,Ppone,Pmail,jplevel);
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

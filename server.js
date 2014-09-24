//Tidrapport API
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var address = 'mongodb://localhost:27017';
var session = require('express-session')
var bodyParser = require('body-parser');
var moment = require('moment');
var excelbuilder = require('msexcel-builder');

var app = express();

app.use(session({secret: 'bosse lasse'}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser()); 

var months = require("./modules/months.js");
var pwhash = require("./modules/pwhash.js");
var salt = "kahi3hn4";
var validation = require('./modules/validation.js');

mongoose.connect(address + "/tidrapport");

mongoose.connection.on('connected', function(){
	console.log("connected to mongo");
});

mongoose.connection.on('error', function(){
	console.log("error connected to mongo");
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: {type: String, required: true},
	password: {type: String, required: true},
	fname: String,
	lname: String,
	isadmin: {type: Boolean, default: false},
	statistics: {
		signup: {type: Date, default: Date.now},
		lastlogin: {type: Date, default: Date.now},
		numlogins: Number
	}
});
userSchema.index({email: 1}, {unique: true});

var timeSchema = new Schema({
	inh: Number,
	inm: Number,
	lunch: Number,
	outh: Number,
	outm: Number,
	tot: Number,
	date: String,
	uid: Schema.Types.ObjectId
});
timeSchema.index({uid: 1});

var User = mongoose.model('User', userSchema);
var Time = mongoose.model('Time', timeSchema);

app.get('/', function (req, res){
	res.sendfile('index.html');
});

app.post('/signup', function (req, res){

	console.log('/signup');

	if (!req.body || !req.body.email || !req.body.password){
		console.log('no/wrong body');
		return res.send(400);
	}
	
	//if (!validation.email(req.body.email)){
	//	console.log('invalid email');
	//	return res.send(400);
	//}
	
	// Validate email and password
	// Perhaps seperate them for better error handling messages?
	if (!validation.email(req.body.email) || !validation.pw(req.body.password)){
		console.log('Invalid email or password');
		//return res.send(400);
		return res.json(400, {error:"Ogiltig epost eller lösenord"});
	}

	var newUser = new User({
		email: req.body.email,
		password: pwhash.sha1(req.body.email+salt+req.body.password),
		statistics: {
			signup: Date.now(),
			lastlogin: Date.now(),
			numlogins: 0
		}
	}).save(function(err){
		if (err){
			console.log(err);
			return res.send(500);
		}
	});
	return res.json({ok:true});
});

app.post('/login', function (req, res){
	console.log('post /login');

	if (!req.body || !req.body.email || !req.body.password){
		return res.send(400);
	}

	//if (!validation.email(req.body.email)){
	//	return res.send(400);
	//}

	//Validate email and password
	if (!validation.email(req.body.email) || !validation.pw(req.body.password)){
		return res.send(400);
		//return res.json(400, {error:"blubbblubb"});
	}

	var pw = pwhash.sha1(req.body.email+salt+req.body.password);

	User.findOne({email: req.body.email}, function (err, user){
		if (err){
			console.log(err);
			return res.send(500);
		}
		if (!user){
			return res.json(400, {error:"No such user"});
			return res.send(400);
		}
		if (user.password !== pw){
			return res.json(400, {error:"Faulty username/password"});
			return res.send(400);
		}

		user.statistics.numlogins++;
		user.statistics.lastlogin = Date.now();
		user.save(function (err, user){
			if (err){
				console.log(err);
				return res.send(500);
			}
		});

		req.session.expires = moment().add(1,'days').valueOf();
		req.session.uid = user._id;
		req.session.email = user.email;
		req.session.isadmin = user.isadmin;

		return res.json({isadmin: user.isadmin});
	});
});

app.delete('/login', function (req, res){
	console.log('delete /login');

	if (!req.session && !req.session.uid){
		return res.send(400);
	}

	req.session.destroy(function (err) {
	  if (err){
	  	console.log(err);
	  }
	  return res.sendfile('index.html');
	});
});

app.get('/settings', function (req, res){
	console.log('get /settings');

	if (!req.session && !req.session.uid){
		return res.send(400);
	}

	User.findOne({_id: req.session.uid}, {fname: 1, lname: 1}, function (err, user){
		if (err){
			console.log(err);
			return res.send(500);
		}
		return res.json(user);
	});
});

app.put('/settings', function (req, res){
	console.log('put /settings');

	// Need to check the entire body. lname, fname.
	if (!req.body){
		return res.send(400);
	}

	if (!req.session && !req.session.uid){
		return res.send(400);
	}

	User.findOne({_id: req.session.uid}, function (err, user){
		if (err){
			console.log(err);
			return res.send(500);
		}
		user.fname = req.body.fname;
		user.lname = req.body.lname;
		user.save(function (err, user){
			if (err){
				console.log(err);
				return res.send(500);
			}
		});
		return res.json({ok:true});
	});
});

app.post('/today', function (req, res){
	console.log('post /today');

	if (!req.session && !req.session.uid){
		return res.send(400);
	}

	//Need to check the entire body. inh, inm, lunch etc.
	if (!req.body){
		return res.send(400);
	}

	var newTime = new Time({

		inh: req.body.inh,
		inm: req.body.inm,
		lunch: req.body.lunch,
		outh: req.body.outh,
		outm: req.body.outm,
		tot: req.body.tot,
		date: moment().format('YYYY-MM-DD'),
		uid: req.session.uid

	}).save(function (err){
		if (err){
			console.log(err);
			return res.send(500);
		}
		return res.json({ok:true});
	});
});

app.get('/checktoday', function (req, res){
	console.log('get /checktoday');

	if (!req.session && !req.session.uid){
		return res.send(400);
	}

	Time.find({uid: req.session.uid}).sort({_id: -1}).limit(1).exec(function (err, time){
		if (err){
			console.log(err);
			return res.send(500);
		}

		if (!time.length){
			return res.json({});
		}
		if (time[0].date == moment().format('YYYY-MM-DD')){
			return res.json({tot: time[0].tot});
		}
		return res.json({});
	});
});

app.get('/getmonth/:month', function (req, res){
	console.log('get /getmonth/'+req.params.month);

	if (!req.session && !req.session.uid){
		return res.send(400);
	}

	if (!(req.params.month == 'this' || req.params.month == 'last')){
		return res.send(400);
	}

	Time.find({uid: req.session.uid}).sort({_id: -1}).limit(65).exec(function (err, time){
		if (err){
			console.log(err);
			return res.send(500);
			//res.json(500, {error:"internal server error"});
		}

		//Get correct data with months.module.
		var data = months.months(req.params.month, time);

		return res.json(data);
	});
});

app.get('/excel/:type/:period', function (req, res){
	console.log('get /excel/'+req.params.type+'/'+req.params.period);

	if (!req.session && !req.session.uid){
		return res.send(400);
	}

	if(!(req.params.period == 'this' || req.params.period == 'last')){
		return res.send(400);
	}
	User.findOne({_id: req.session.uid}, {fname: 1, lname: 1, email: 1}, function (err, user){
		if (err){
			console.log(err);
			return res.send(500);
		}

		Time.find({uid: req.session.uid}).sort({_id:-1}).limit(65).exec(function (err, time){
			if (err){
				console.log(err);
				return res.send(500);
			}

			//Get correct data with months.module.
			var data = months.months(req.params.period, time);

			var excelName = 'tidrapport_'+moment().format('YYYYMMDDHmmss') + '_' + Math.floor((Math.random() * 3600) + 1) + '.xlsx';
			var excelDir = './excel/';

			// Create a new workbook file in ./excel
			var workbook = excelbuilder.createWorkbook(excelDir, excelName);

			// Create a new worksheet with 5 columns and 40 rows
			var sheet1 = workbook.createSheet('Tidrapport', 5, 40);

			// var style = workbook.st.font2id({name: 'Calibri', sz: 12});

			// font = {
			// 	name: 'Calibri',
			// 	sz: 12
			// }
			// Style.font2id(font);
			// Style.font2id({name: 'Calibri', sz: 12});

			//sheet1.set(col, row, value);
			sheet1.set(1, 1, 'Rapport för:');
			sheet1.font(1, 1, {name:'Calibri', sz:'14', family:'3', bold:'true'});
			if (user.fname && user.lname){
				sheet1.set(2, 1, user.fname + ' ' + user.lname);
			}
			else{
				sheet1.set(2, 1, user.email);
			}
			sheet1.font(2, 1, {name:'Calibri', sz:'12', family:'3'});
			sheet1.set(1, 2, 'Utskrivet:');
			sheet1.font(1, 2, {name:'Calibri', sz:'14', family:'3', bold:'true'});
			sheet1.set(2, 2, moment().format('YYYY-MM-DD'));
			sheet1.font(2, 2, {name:'Calibri', sz:'12', family:'3'});

			//Headers
			sheet1.set(1, 4, 'Datum');
			sheet1.font(1, 4, {name:'Calibri', sz:'14', family:'3', bold:'true'});
			sheet1.width(1, 15);
			sheet1.set(2, 4, 'In');
			sheet1.font(2, 4, {name:'Calibri', sz:'14', family:'3', bold:'true'});
			sheet1.width(2, 15);
			sheet1.set(3, 4, 'Lunch');
			sheet1.font(3, 4, {name:'Calibri', sz:'14', family:'3', bold:'true'});
			sheet1.width(3, 15);
			sheet1.set(4, 4, 'Ut');
			sheet1.font(4, 4, {name:'Calibri', sz:'14', family:'3', bold:'true'});
			sheet1.width(4, 15);
			sheet1.set(5, 4, 'Summa');
			sheet1.font(5, 4, {name:'Calibri', sz:'14', family:'3', bold:'true'});
			sheet1.width(5, 15);
			
			//Populate the worksheet
			var x = 0;
			var sum = 0
			for (var i = 5; i < data.length+5; i++){
				sheet1.set(1, i, data[x].date);
				sheet1.font(1, i, {name:'Calibri', sz:'12', family:'3'});
				sheet1.set(2, i, data[x].inh+'.'+data[x].inm);
				sheet1.font(2, i, {name:'Calibri', sz:'12', family:'3'});
				sheet1.set(3, i, data[x].lunch);
				sheet1.font(3, i, {name:'Calibri', sz:'12', family:'3'});
				sheet1.set(4, i, data[x].outh+'.'+data[x].outm);
				sheet1.font(4, i, {name:'Calibri', sz:'12', family:'3'});
				sheet1.set(5, i, data[x].tot);
				sheet1.font(5, i, {name:'Calibri', sz:'12', family:'3'});
				
				sum += data[x].tot;
				x++;
			}

			//Summa
			sheet1.set(4, data.length+6, 'Summa:');
			sheet1.font(4, data.length+6, {name:'Calibri', sz:'12', family:'3', bold: 'true'});
			sheet1.set(5, data.length+6, sum);
			sheet1.font(5, data.length+6, {name:'Calibri', sz:'12', family:'3'});

			// Save it
			workbook.save(function(err){
				if (err){
					workbook.cancel();
				}	
				else{
					res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				 	res.setHeader("Content-Disposition", "attachment; filename=" +excelName);
					return res.sendfile(excelDir+excelName);
					// res.sendFile(excelDir+excelName, function (err){
					// 	if (err){
					// 		console.log(err);
					// 	}
					// 	fs.unlinkSync(excelDir+excelName);
					// });

					// var fs = require('fs');

					// fs.unlink('/tmp/hello', function (err) {
					// 	if (err) throw err;
					// 	console.log('successfully deleted /tmp/hello');
					// });
					//return res.json({ok:true});
				}
			});
		});
	});
});

app.get('/admin', function (req, res){
	console.log('get /admin');

	if (!req.session && !req.session.isadmin){
		return res.send(400);
	}

	return res.sendfile('admin/index.html');
});

app.get('/adminusers', function (req, res){
	console.log('get /adminuser');

	if (!req.session && !req.session.isadmin){
		return res.send(400);
	}

    User.find({}, {fname: 1, lname: 1, email:1, isadmin: 1, statistics: 1}, function (err, user){
    	if (err){
    		console.log(err);
    		return res.send(500);
    	}

    	for (var i = 0; i < user.length; i++){
    		if (user[i]._id == req.session.uid){
    			var me = {
    				_id: req.session.uid,
    				fname: user[i].fname,
    				lname: user[i].lname,
    				email: user[i].email,
    				statistics: {
    					lastlogin: user[i].statistics.lastlogin,
    					signup: user[i].statistics.signup,
    					numlogins: user[i].statistics.numlogins
    				},
    				isme: true,
    				isadmin: user[i].isadmin
    			}
    			user[i] = me;
    		}
    	}
    	return res.json(user);
    });
});

app.put('/adminpermission/:uid/:type', function (req, res){
	console.log('put /adminpermission/'+req.params.uid+'/'+req.params.type);

	if (!req.session && !req.session.isadmin){
		return res.send(400);
	}
	if (!(req.params.type == 'mk' || req.params.type == 'rm')){
		return res.send(400);
	}

	User.findOne({_id: req.params.uid}, function (err, user){
		if (req.params.type == 'mk'){
			user.isadmin = true;
		}
		if (req.params.type == 'rm'){
			user.isadmin = false;
		}
		user.save(function (err){
			if (err){
				console.log(err);
				return res.send(500);
			}
		});
		return res.json({ok:true});
	});
});

app.get('/adminreport/:uid', function (req, res){
	console.log('get /adminreport/'+req.params.uid);

	if (!req.session && !req.session.isadmin){
		return res.send(400);
	}

	User.findOne({_id: req.params.uid}, {fname:1, lname:1, email:1}, function (err, user){
		if (err){
			console.log(err);
			return res.send(500);
		}

		Time.find({uid: req.params.uid}).sort({_id:-1}).limit(65).exec(function (err, time){
			if (err){
				console.log(err);
				return res.send(500);
			}
			return res.json({user:user, tidtabell:time});
		});
	});
});

http.createServer(app).listen(3000);
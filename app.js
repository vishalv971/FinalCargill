var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser =    require("body-parser");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(__dirname));
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./.scratch');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vishal',
  port      : 3306,
  password : 'vishal',
  database : 'DBMSMiniProject'
});

connection.connect();

app.get("/", function(req, res) {
    res.render("index.ejs");
});
app.get("/loggedIn/farmer", function(req, res) {
	res.render("farmer.ejs");
});

app.get("/loggedIn/commercial", function(req, res) {
	res.render("commercial.ejs");
});
app.get("/loggedIn/truck", function(req,res) {
	res.render("truck.ejs");
});
app.get("/loggedIn/gps", function(req,res) {
	res.render("gps.ejs");
})
app.post("/loggedIn", function(req, res) {

	var a = req.body.uname;
	var b = req.body.pass;
	connection.query("select Type from Auth where Username=\""+a+"\" and Password=\""+b+"\"", function(err, results) {
		if(err) {
			console.error(err);
			return;
		}
		else{
			if(results[0].Type==="f"){
				res.redirect("/loggedIn/farmer");
			}
			if(results[0].Type==="c"){
				res.redirect("/loggedIn/commercial");
			}
		console.log(results);
		}
	});

});

app.post("/truck", function(req,res) {
	var a = req.body.source;
	var b = req.body.dest;
	var f1=0,f2=0;
	connection.query("insert into Source (Name) values(\""+a+"\")", function(err,results){
		if(err){
			console.log(err);
			return;
		}
		else{
			console.log(results);
		}
	});
	connection.query("insert into Destination (Name) values(\""+b+"\")", function(err,results){
		if(err){
			console.log(err);
			return;
		}
		else{
			console.log(results);
		}
	});

	localStorage.setItem("Source",a);
	localStorage.setItem("Destination",b);
	res.redirect("/loggedIn/truck");

});

app.post("/rtlTracking",function(req,res) {

	var src = localStorage.getItem("Source");
	var dest = localStorage.getItem("Destination");

	connection.query("insert into Truck (Source,Destination,AcceptedRide) values(\""+src+"\",\""+dest+"\",\"Yes\")",function (err,results) {
		if(err){
			console.log(err);
		}
		else{
			console.log(results);
		}
	});
	res.redirect("/loggedIn/gps");
});

app.get("*", function(req, res) {
	res.send("<h1>Invalid URL!</h1>");
});
app.listen(3000, "localhost", function() {
    console.log("Server started on port number 3000...");
});

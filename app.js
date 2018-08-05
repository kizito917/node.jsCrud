
//required modules for the application
var express = require('express');  //express module
var http = require('http');  		//http module
var mysql = require('mysql');		//mysql module
var app = express();				//variable holding express module
var bodyParser = require('body-parser');		//bodyparser module


app.use(bodyParser.urlencoded({extended: true}));



// view engine(Templating engine).....
app.set('view engine', 'ejs');


//directory for all related javascript, bootstrap and css files....
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));



//database connection...
var conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "mydb"
});

var siteTitle = "Crud application";
var baseUrl = "http://localhost:8080";

/*
	Selecting all from database... 
*/
app.get('/', function (req, res) {

	conn.query("SELECT * FROM info ORDER BY id", function (err, result) {
		res.render('index', {
		siteTitle: siteTitle,
		pageTitle: "EventList",
		items: result
	});

	});

});


/*
	Add new data
*/
app.get('/event/add', function (req, res) {
	res.render('add', {
		siteTitle: siteTitle,
		pageTitle: "Add New",
		items: ''
	});
});

//inserting into database
app.post('/event/add', function (req, res) {
	var query = "INSERT INTO info (name, email) VALUES ('"+req.body.name+"', '"+req.body.email+"')";
	
	conn.query(query, function (err, result) {
		if (err) {
			console.log('error');
		}else{
			res.redirect(baseUrl);
		}
		
	})
});

/*
Getting parameter to be edited from the database.....
*/
app.get('/event/edit/:id', function (req, res) {
	conn.query("SELECT * FROM info WHERE id = '"+req.params.id+"'", function (err, result) {
		res.render('edit', {
			siteTitle: siteTitle,
			pageTitle: "Edit",
			items: result
		});
	});
});

/* 
	Updating to database
*/

app.post('/event/edit/:id', function (req, res) {
	conn.query("UPDATE info SET name='"+req.body.name+"', email='"+req.body.email+"' WHERE id ='"+req.params.id+"'", 
		function (err, result) {
		res.redirect(baseUrl);
	});
});

/*
	 Deleting from databse
*/

app.get('/event/delete/:id', function (req, res) {
	conn.query("DELETE FROM info WHERE id = '"+req.params.id+"'", function (err, result) {
		res.redirect(baseUrl);
	});
});



//connecting to the server with the stated port.... 
app.listen(8080, function () {
	console.log('Server listening to port 8080');
});


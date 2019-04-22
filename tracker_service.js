/*Author: Saul Manzano & Miranda Hampton
Filename: tracker_service.js
Purpose: This file parses data and sends 
Class: CSC 337 Spring 2019
*/
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static('public'));

function read_file(file_name) {
	var info = ""
	try {  
	    info = fs.readFileSync(file_name, 'utf8');
	       
	} catch(e) {
	    console.log('Error:', e.stack);
	}
	return info;
}

function parse_info(info_data){
	var lines = info_data.split("\n");
	return lines;
}

//http://localhost:3000/?mode=initial
console.log('web service started');
app.get('/', function (req, res) {
	
	res.header("Access-Control-Allow-Origin", "*");
	let title = req.query.title;
	let mode = req.query.mode;

	if(mode == undefined) {
		res.status(400);
		res.send("Missing required parameters");
	}
	
	

	if (mode == "initial"){

		let file_name =  "roster.txt";
		let info_data = read_file(file_name);
		output = parse_info(info_data);
		console.log(output);
		res.send(JSON.stringify(output));
		//console.log(info_data);
	}
	


	
})


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
	next();
});


app.post('/', jsonParser, function (req, res) {
	fs.writeFile("checkedIn.txt", "", function(err) {
		console.log("cleared");
	});

	for(let i =0; i < req.body.length; i++){
		let email = req.body[i].email;
		let name = req.body[i].name;
		let inp = "\r\n" + name + ":::" + email;	
		console.log(inp);
		fs.appendFile("checkedIn.txt", inp, function(err) {
		
	});
	}




});

app.listen(3000);
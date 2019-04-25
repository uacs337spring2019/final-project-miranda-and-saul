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
	let mode = req.query.mode;

	if(mode == undefined) {
		res.status(400);
		res.send("Missing required parameters");
	}
	
	

	if (mode == "initial"){

		let file_name =  "roster.txt";
		let info_data = read_file(file_name);
		output = parse_info(info_data);
		res.send(JSON.stringify(output));
		
	}
	/*
	This is used to get the data from past meeting attendance 
	*/
	if (mode == "graph"){

		let file_name =  "pastMeetings.txt";
		let info_data = read_file(file_name);
		output = parse_info(info_data);
		console.log(output);
		res.send(JSON.stringify(output));
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
	res.header("Access-Control-Allow-Origin", "*");
	let mode = req.query.mode;
	if(mode != "update"){
		fs.writeFile("checkedIn.txt", "", function(err) {
		console.log("cleared");
	});
	}
	
	fs.writeFile('lateBros.txt', "", function(){console.log('done')});

	for(let i =0; i < req.body[0].length; i++){
		let email = req.body[0][i].email;
		let name = req.body[0][i].name;
		let inp = "\r\n" + name + ":::" + email;	
		//console.log(inp);
		fs.appendFile("checkedIn.txt", inp, function(err) {

		
	});
	}

	for(let j =0; j < req.body[1].length; j++){
		let mail = req.body[1][j].email;
		let nme = req.body[1][j].name;
		let np = "\r\n" + nme + ":::" + mail;	
		console.log(np);
		fs.appendFile("lateBros.txt", np, function(err) {
	
		
	});
	}




});

app.listen(process.env.PORT);
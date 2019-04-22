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
	


	
})

app.listen(3000);
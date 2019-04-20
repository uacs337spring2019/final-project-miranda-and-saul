//Miranda Hampton
//CSC 337
//Due: 3/29/2019
//This code uses node.js to read messages from a text file with names and comments. 
//A user is able to upload any message they want, and it is posted in the text file. 
//There is an interval to display comments.

(function(){
	"use strict";

	window.onload = function(){
		fillCheckboxes();
		document.getElementById("submitrole").onclick = getCheckIn;
	}

function fillCheckboxes(){
	let url = "http://localhost:3000/?";
		fetch(url)
			.then(checkStatus)
			.then(function(responseText){

			})
}

function getCheckIn(){
	let checkedB = [];
	let checkboxes = document.querySelectorAll(".cb");
	for(let i = 0; i < checkboxes.length; i++){
		if(checkboxes[i].checked){
			checkedB.push(i);
		}
	}
	checkedB.forEach(function (e){
		alert(e);
	});
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response.text();
	}
	else {
		return Promise.reject(new Error(response.status+":"+response.statusText));
	}
}


})();
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
	}

function fillCheckboxes(){
	let url = "http://localhost:3000/?";
		fetch(url)
			.then(checkStatus)
			.then(function(responseText){

			})
}
function makeChecklist(lis){
	for(i=0;i<lis.length;i++){
		let bar = document.createElement("div");
		bar.className = "check"
		bar.idName = lis[i];
		let d_name = lis[i];
		let id_name = lis[i].replace(" ","");
		bar.innerHTML = "<input type='checkbox' name='attendance' id="+id_name+" value="+d_name+" />";
		document.getElementById("checkboxes").appendChild(bar);
	}
}
function initialList(){
	let url = 
	fetch(url)
			.then(checkStatus)
		    .then(function(responseText) {
				let lis = JSON.parse(responseText);
		        
		    })
		    .catch(function(error) {
		        document.getElementById("errors").innerHTML="Page not found";
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
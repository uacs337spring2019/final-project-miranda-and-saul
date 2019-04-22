//Miranda Hampton
//CSC 337
//Due: 3/29/2019
//This code uses node.js to read messages from a text file with names and comments. 
//A user is able to upload any message they want, and it is posted in the text file. 
//There is an interval to display comments.

(function(){
	"use strict";

	window.onload = function(){
		initialList();
		document.getElementById("submitrole").onclick = getCheckIn;
		document.getElementById("personleft").onclick = personleft;

	}

	function getCheckIn(){
		let checkedB = [];
		let ret = "";
		let checkboxes = document.querySelectorAll(".cb");
		for(let i = 0; i < checkboxes.length; i++){
			if(checkboxes[i].checked){
				ret += "<option id='" + checkboxes[i].id + "' value='" + checkboxes[i].value + "'>" + checkboxes[i].value + "</option>";
				let val = {
					email: checkboxes[i].id,
					name: checkboxes[i].value
				}
				checkedB.push(val);
			}
		}
		let child = document.getElementById("quorum").firstElementChild;
		child.id = checkedB.length;
		child.innerHTML = checkedB.length;
		document.getElementById("current").innerHTML = ret;
		document.getElementById("init").style.display = "none";
		document.getElementById("dropdown").style.display = "inline";

		let fetchOptions = {
			method : 'POST', 
			headers : {'Accept': 'application/json','Content-Type' : 'application/json'},
			body : JSON.stringify(checkedB)
		};
		let url = "http://localhost:3000/";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText){
			})
			.catch(function(error){
				alert("something happened");

			})
	}

function personleft(){
	let child = document.getElementById("quorum").firstElementChild;
	child.id = parseInt(child.id) - 1;
	child.innerHTML = parseInt(child.id);
	let person = document.getElementById("current").value;
	let now = new Date();
	let untilmin = new Date(now.getTime() + 10*60000);
	let e = document.getElementById("outofroom");
	let len = e.childNodes.length;
	untilmin = untilmin.getTime();
	let timer = setInterval(function(){
		let curr = new Date().getTime();
		let amt = untilmin - curr;
		let min = Math.floor((amt%(3600000))/(60000));
		let div = document.getElementById("person" + person.replace(" ", ""));
		if(div != null){
			let span = document.getElementById("span" + person.replace(" ", ""));
			span.innerHTML = min + " m";
			if(min > 1 && min < 5)
				span.style.color = "#ffcc99";
			else if(min > 0 && min < 2)
				span.style.color = "#ff0000";

		}
		else{
			div = document.createElement("div");
			div.id = "person" + person.replace(" ", "");
			div.innerHTML = person;
			let span = document.createElement("span");
			span.id = "span" + person.replace(" ", "");
			span.innerHTML = min + " m";
			div.appendChild(span);
			let btn = document.createElement("button");
			btn.innerHTML = "Check Back In"; 
			e.appendChild(div);
		}
		if(min < 0){
			clearInterval(timer);
		}

	}, 1000);


}

function makeChecklist(lis){
	for(let i=0;i<lis.length;i++){
		let bar = document.createElement("div");
		bar.className = "check";
		let whole = lis[i].split(" ");
		let val = whole[whole.length - 1];
		bar.idName = lis[i];
		let d_name = whole.slice(0,whole.length-1).join(" ");
		bar.innerHTML = "<input type='checkbox' name='attendance' id='"+val+"'' value='"+d_name+"'' class='cb' />" + d_name;
		document.getElementById("checkboxes").appendChild(bar);
	}
}

function initialList(){
	let url = "http://localhost:3000/?mode=initial";
	fetch(url)
			.then(checkStatus)
		    .then(function(responseText) {
				let lis = JSON.parse(responseText);
				makeChecklist(lis);
		        
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
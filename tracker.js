//Miranda Hampton
//CSC 337
//Due: 3/29/2019
//This code uses node.js to read messages from a text file with names and comments. 
//A user is able to upload any message they want, and it is posted in the text file. 
//There is an interval to display comments.

(function(){
	"use strict";

	window.onload = function(){
		document.getElementById("latelist").style.display = "none";
		initialList();
		document.getElementById("submitrole").onclick = getCheckIn;
		document.getElementById("personleft").onclick = personleft;
		document.getElementById("lateperson").onclick = redisplay;
		document.getElementById("resubmitrole").onclick = addLateBrother;

	}
	function redisplay(){
		document.getElementById("init").style.display = "none";
		document.getElementById("dropdown").style.display = "none";
		document.getElementById("latelist").style.display = "inline";
	}
	function addLateBrother(){
		let bigList = [];
		let checkedB = [];
		let notChecked = [];
		let ret = "";
		let lateList = "";
		
		let checkboxes = document.querySelectorAll(".cl");
		console.log(checkboxes);
		for(let i = 0; i < checkboxes.length; i++){
			if(checkboxes[i].checked){
				ret += "<option id='" + checkboxes[i].id + "' value='" + checkboxes[i].value + "'>" + checkboxes[i].value + "</option>";
				let val = {
					email: checkboxes[i].id,
					name: checkboxes[i].value
				}
				checkedB.push(val);
			}else{
				lateList += "<input type='checkbox' name='attendance' id='"+checkboxes[i].id+"'' value='"+checkboxes[i].value+"'' class='cl' />" + checkboxes[i].value+"<br>";
				let lVal = {
					email: checkboxes[i].id,
					name: checkboxes[i].value
				}
				notChecked.push(lVal);
			}
		}
		let child = document.getElementById("quorum").firstElementChild;
		let toAdd = checkedB.length;
		console.log(toAdd);
		console.log(child.id);
		child.id = parseInt(child.id)+toAdd;
		console.log(child.id);
		child.innerHTML = child.id;
		document.getElementById("latecheck").innerHTML = "";
		document.getElementById("latecheck").innerHTML = lateList;
		document.getElementById("current").innerHTML += ret;
		document.getElementById("init").style.display = "none";
		document.getElementById("dropdown").style.display = "inline";
		document.getElementById("latelist").style.display = "none";
		bigList.push(checkedB);
		bigList.push(notChecked);

		let fetchOptions = {
			method : 'POST', 
			headers : {'Accept': 'application/json','Content-Type' : 'application/json'},
			body : JSON.stringify(bigList)
		};
		let url = "http://localhost:3000/?mode=update";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText){
			})
			.catch(function(error){
				alert("something happened");

			})

	}
	function getCheckIn(){
		let bigList = [];
		let checkedB = [];
		let notChecked = [];
		let ret = "";
		let lateList = "";
		let checkboxes = document.querySelectorAll(".cb");
		for(let i = 0; i < checkboxes.length; i++){
			if(checkboxes[i].checked){
				ret += "<option id='" + checkboxes[i].id + "' value='" + checkboxes[i].value + "'>" + checkboxes[i].value + "</option>";
				let val = {
					email: checkboxes[i].id,
					name: checkboxes[i].value
				}
				checkedB.push(val);
			}else{
				lateList += "<input type='checkbox' name='attendance' id='"+checkboxes[i].id+"'' value='"+checkboxes[i].value+"'' class='cl' />" + checkboxes[i].value+"<br>";
				let lVal = {
					email: checkboxes[i].id,
					name: checkboxes[i].value
				}
				notChecked.push(lVal);
			}
		}
		let child = document.getElementById("quorum").firstElementChild;
		child.id = checkedB.length;
		child.innerHTML = checkedB.length;
		document.getElementById("latecheck").innerHTML = lateList;
		document.getElementById("current").innerHTML = ret;
		document.getElementById("init").style.display = "none";
		document.getElementById("dropdown").style.display = "inline";
		bigList.push(checkedB);
		bigList.push(notChecked);
		let fetchOptions = {
			method : 'POST', 
			headers : {'Accept': 'application/json','Content-Type' : 'application/json'},
			body : JSON.stringify(bigList)
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
		    	console.log("here");
				let lis = JSON.parse(responseText);
				console.log(lis);
		        makeChecklist(lis);
		    })
		    .catch(function(error) {
		        console.log("Blunder");
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
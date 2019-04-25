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
		document.getElementById("endmeeting").onclick = statistics;
	}

	function redisplay(){
		document.getElementById("init").style.display = "none";
		document.getElementById("dropdown").style.display = "none";
		document.getElementById("latelist").style.display = "inline";
	}

	function checkQuorum(){
		let e = document.getElementById("quorum").firstElementChild;
		let q = parseInt(e.id);
		if(q < 41)
			e.style.color = "#ff0000";
		else
			e.style.color = "#00f21c";



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
				ret += "<option class='present' id='" + checkboxes[i].id + "' value='" + checkboxes[i].value + "'>" + checkboxes[i].value + "</option>";
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
	checkQuorum();

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
				ret += "<option class='present' id='" + checkboxes[i].id + "' value='" + checkboxes[i].value + "'>" + checkboxes[i].value + "</option>";
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
	checkQuorum();
	}

function personleft(){
	let child = document.getElementById("quorum").firstElementChild;
	child.id = parseInt(child.id) - 1;
	child.innerHTML = parseInt(child.id);
	let select = document.getElementById("current");
	let person = select.value;
	select.remove(select.selectedIndex);
	let now = new Date();
	let untilmin = new Date(now.getTime() + 10*60000);
	let e = document.getElementById("outofroom");
	let len = e.childNodes.length;
	untilmin = untilmin.getTime();
	window.timer = setInterval(function(){
		let curr = new Date().getTime();
		let amt = untilmin - curr;
		let min = Math.floor((amt%(3600000))/(60000));
		let sec = Math.floor((amt%60000)/1000);
		let div = document.getElementById("person" + person.replace(" ", ""));
		if(div != null){
			let span = document.getElementById("span" + person.replace(" ", ""));
			span.innerHTML = min + " m " + sec + " s";
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
			span.innerHTML = min + " m " + sec + " s";
			div.appendChild(span);
			let btn = document.createElement("button");
			btn.innerHTML = "Check Back In"; 
			btn.value = person;
			btn.addEventListener("click", checkBackIn);
			div.appendChild(btn);
			e.appendChild(div);
		}
		if(min < 0){
			clearInterval(timer);
		}

	}, 1000);
	checkQuorum();


}

function checkBackIn(){
	let personVal = this.value;
	let option = document.createElement("option");
	option.text = personVal;
	option.value = personVal;
	document.getElementById("current").add(option);
	let e = document.getElementById("person" + personVal.replace(" ", ""));
	e.parentNode.removeChild(e);
	clearInterval(timer);
	checkQuorum();
}


function makeChecklist(lis){
	for(let i=0;i<lis.length;i++){
		let bar = document.createElement("div");
		bar.className = "check";
		let whole = lis[i].split(" ");
		let val = whole[whole.length - 1];
		bar.idName = lis[i];
		let d_name = whole.slice(0,whole.length-1).join(" ");
		d_name = d_name.replace(/\uFEFF/g,"");
		bar.innerHTML = "<input type='checkbox' name='attendance' id='"+val+"'' value='"+d_name+"'' class='cb' />" + d_name;
		document.getElementById("checkboxes").appendChild(bar);
	}
}
/*
takes list and converts data to dictionary
*/
function makeDic(list){
	let dic = {}
	//console.log(list);
	for(let i=0; i<list.length;i++){
		//console.log(list[i]);
		let data = list[i];
		data = data.replace(/\t/g," ").replace("\r","");
		//console.log(data);
		let l = data.split(" ");
		//console.log(l)
		let num = parseInt(l[l.length-1]);
		l.pop();
		
		let name = l[0]+" "+l[l.length-1];
		console.log(name);
		dic[name] = num;

	}
	//console.log(dic);
	return dic;
}
/*
Uses data from list and creates bar graph that displays the attendance 
based on the 10 total meetings per semester and how many a member has gone to sofar.
*/
function makeGraph(list){
	//console.log("b");
	let dict = makeDic(list);
	console.log("b");
	var sorted = [];
	for(var key in dict) {
	    sorted[sorted.length] = key;
	}
	sorted.sort();
	//console.log(sorted);
	let inMeeting = document.getElementsByClassName('present');
	console.log(inMeeting);
	for (let i = 0; i < inMeeting.length; i++) {
	  dict[inMeeting[i].value] += 1;
	}
	let color = true;
	for(var j = 0; j < sorted.length; j++) {
        let n = dict[sorted[j]];
        let percent =  (n/(10))*100;
        //console.log(percent);
        let bar = document.createElement("div");
        if(color){
        	bar.className = "red"
        	color = false;
        }else{
        	bar.className = "gold"
        	color = true;
        }
        bar.style.width = (percent+100)+"%";
        bar.innerHTML = sorted[j]+" "+n;
        let outer = document.createElement("div");
		
		outer.appendChild(bar);
        document.getElementById("endgame").appendChild(outer);

    }
    document.getElementById("init").style.display = "none";
	document.getElementById("dropdown").style.display = "none";
	document.getElementById("latelist").style.display = "none"
	document.getElementById("endgame").style.display = "inline"



}
/*
This fucntion pulls a file that has data on past meetings and adds that data to the those currently
present and gets the new total
*/
function statistics(){
	//console.log("here");
	let url = "http://localhost:3000/?mode=graph";
	fetch(url)
			.then(checkStatus)
		    .then(function(responseText) {
		    	console.log("a");
				let lis = JSON.parse(responseText);
				makeGraph(lis);
				
		    })
		    
}
function initialList(){
	let url = "http://localhost:3000/?mode=initial";
	fetch(url)
			.then(checkStatus)
		    .then(function(responseText) {
		    	//console.log("here");
				let lis = JSON.parse(responseText);
				//console.log(lis);
		        makeChecklist(lis);
		    })
		    .catch(function(error) {
		        console.log("ERROR");
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
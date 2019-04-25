//Miranda Hampton & Saul Manzano
//CSC 337
//Due: 3/29/2019
//This code uses node.js to read messages from a text file with names and comments. 
//A user is able to upload any message they want, and it is posted in the text file. 
//There is an interval to display comments.

(function(){
	"use strict";
	let timers = {};
	window.onload = function(){
		document.getElementById("latelist").style.display = "none";
		initialList();
		document.getElementById("submitrole").onclick = getCheckIn;
		document.getElementById("personleft").onclick = personleft;
		document.getElementById("lateperson").onclick = redisplay;
		document.getElementById("resubmitrole").onclick = addLateBrother;
		document.getElementById("endmeeting").onclick = statistics;
		document.getElementById("back").onclick = back;
	}
	/*
	This function is used to redisplay different divs after a button is clicked
	*/
	function redisplay(){
		document.getElementById("init").style.display = "none";
		document.getElementById("dropdown").style.display = "none";
		document.getElementById("latelist").style.display = "inline";
	}

	//This function just checks to see if we have enough people in the room to run meeting
	function checkQuorum(){
		let e = document.getElementById("quorum").firstElementChild;
		let q = parseInt(e.id);
		if(q < 41)
			e.style.color = "#ff0000";
		else
			e.style.color = "#00f21c";
	}
	/*
	This function adds the ability to add people who show up to meeting late and 
	need to be checked in
	*/
	function addLateBrother(){
		let bigList = [];
		let checkedB = [];
		let notChecked = [];
		let ret = "";
		let lateList = "";
		
		let checkboxes = document.querySelectorAll(".cl");
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
		child.id = parseInt(child.id)+toAdd;
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
		let url = "http://quorumtracker.herokuapp.com:process.env.PORT/?mode=update";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText){
			})
			.catch(function(error){

			})
	checkQuorum();
	}

	//this function finds all the people who checked in in the beginning 
	function getCheckIn(){
		let bigList = [];
		let checkedB = [];
		let notChecked = [];
		let ret = "";
		let lateList = "";
		let checkboxes = document.querySelectorAll(".cb");
		for(let i = 0; i < checkboxes.length; i++){
			if(checkboxes[i].checked){
				ret += "<option class='present' id='" + checkboxes[i].value.replace(" ", "") + "' value='0'>" + checkboxes[i].value + "</option>";
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
		let url = "http://quorumtracker.herokuapp.com:process.env.PORT/";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText){
			})
			.catch(function(error){

			})
	checkQuorum();
	}

//when a person leaves the room they are checked out. The quorum number is decreased 
//and a timer is stsrted to keep track of how long they are gone for
function personleft(){
	let child = document.getElementById("quorum").firstElementChild;
	child.id = parseInt(child.id) - 1;
	child.innerHTML = parseInt(child.id);
	let select = document.getElementById("current");
	let person = select.options[select.selectedIndex].text;

	let timer = setInterval(function(){
		let e = document.getElementById("outofroom");
		let time = parseInt(document.getElementById(person.replace(" ","")).value);
		let min = parseInt(time/60);
		let sec = time %60;
		let div = document.getElementById("person" + person.replace(" ", ""));
		if(div != null){
			let span = document.getElementById("span" + person.replace(" ", ""));
			span.innerHTML = min + " m " + sec + " s";
			let btn = document.getElementById(time-1 + person.replace(" ", ""));
			btn.id = time + person.replace(" ", "");
			if(min > 5 && min < 9)
				span.style.color = "#ffcc99";
			else if(min >= 9)
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
			btn.id = time +person.replace(" ", "");
			btn.value = person;
			btn.addEventListener("click", checkBackIn);
			div.appendChild(btn);
			e.appendChild(div);
		}
		time += 1;
		document.getElementById(person.replace(" ","")).value = time;


	}, 1000);

	hideDD(person.replace(" ", ""));
	 timers[person.replace(" ", "")] = timer;
	checkQuorum();


}


//When a person comes back into the room, this function will add them back int the dropdown list
//and adds them to the quorum number
function checkBackIn(){
	let personVal = parseInt(this.id);
	let person = this.value;
	let child = document.getElementById("quorum").firstElementChild;
	child.id = parseInt(child.id) + 1;
	child.innerHTML = parseInt(child.id);
	let option = document.getElementById(person.replace(" ", "")).style.display = "block";
	let e = document.getElementById("person" + person.replace(" ", ""));
	e.parentNode.removeChild(e)	
	clearInterval(timers[person.replace(" ", "")]);
	delete timers[personVal]
	checkQuorum();
}

/*
Takes a list of all those who can be present at meeting
and creates a list of checkboxes to be checked in
*/
function makeChecklist(lis){
	for(let i=0;i<lis.length;i++){
		let bar = document.createElement("div");
		bar.className = "check";
		let whole = lis[i].split(" ");
		let val = whole[whole.length - 1];
		bar.idName = lis[i];
		let d_name = whole.slice(0,whole.length-1).join(" ");
		d_name = d_name.replace(/\uFEFF/g,"");
		let l = document.createElement("LABEL");
		l.setAttribute("for", val);
  		let t = document.createTextNode(d_name);
  		l.appendChild(t);
  		let inp = document.createElement("input");
  		inp.setAttribute("type", "checkbox");
  		inp.setAttribute("name", "attendence");
  		inp.id = val;
  		inp.value = d_name;
  		inp.classList.add("cb");
  		bar.appendChild(inp);
  		bar.appendChild(l);
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
		//console.log(name);

		dic[name] = num;
		//console.log(dic[name], name);

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
	console.log(dict);
	//console.log("b");
	var sorted = [];
	for(var key in dict) {
	    sorted[sorted.length] = key;
	}
	sorted.sort();
	//console.log(sorted);
	let inMeeting = document.getElementsByClassName('present');
	//console.log(inMeeting);
	for (let i = 0; i < inMeeting.length; i++) {
		
	  dict[inMeeting[i].innerHTML] += 1;
	  console.log(dict[inMeeting[i]],inMeeting[i] )
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
	let url = "http://quorumtracker.herokuapp.com:process.env.PORT/?mode=graph";
	fetch(url)
			.then(checkStatus)
		    .then(function(responseText) {
		    	console.log("a");
				let lis = JSON.parse(responseText);
				makeGraph(lis);
				
		    })
		    
}
/*
This function gets the initial list of actives from a text file
to use to make a list of checkboxes to check in those present
*/
function initialList(){
	let url = "http://quorumtracker.herokuapp.com:process.env.PORT/?mode=initial";
	fetch(url)
			.then(checkStatus)
		    .then(function(responseText) {
		    	//console.log("here");
				let lis = JSON.parse(responseText);
		        makeChecklist(lis);
		    })
		    .catch(function(error) {
		        console.log("ERROR");
		});
}


//This function was just for physical appearance. 
//It removes them from the dropdown but readds them so they aren't still selected
function hideDD(person){
	let s = document.getElementById("current");
	for(let i = 0; i <s.length; i++){
		if(s.options[i].id == person){
			let text = s.options[i].text;
			let val = s.options[i].value;
			s.remove(i);
			let o = document.createElement("option");
			o.text = text;
			o.id = person;
			o.value = val;
			s.add(o);
			o.style.display = "none";
		}
	}

}

//This function just returns to the previous page
function back(){

	document.getElementById("dropdown").style.display = "inline";
	document.getElementById("endgame").style.display = "none"
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

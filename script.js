var todo = (JSON.parse(localStorage.getItem("todo"))||[]) ,inprogress = (JSON.parse(localStorage.getItem("inprogress"))||[]), completed =(JSON.parse(localStorage.getItem("completed"))||[]);

$(document).ready(function(){
	    $("#login").click(function(){
    	$("#email_input,.info").hide();
    	$(".model").slideDown();
    	$(".model button").html('LOGIN');
    	$("input").val('');
	    });
    $("#signup").click(function(){
    	$("#email_input").show();
    	$(".info").hide();
	        $(".model").slideDown();
    	$(".model button").html('SIGN UP');
	    	$("input").val('');
    });
    $(".model span").click(function(){
    	$(".model").slideUp();
	    })
    $(".model button").click(function(){
    	$(".model").slideUp();
    	$(".info").hide();
    	$("#add_note,#bin").show()
    	$("#dashboard").css({"display":"flex"});

    })
    $(".tag_holder div").click(function(){
 		var status = $(this).text() , input = $("#add_todo_input").val() ;
    	if(input.length==0){
    		return;
    	}

     	if(status=="To Do"){
     		todo.push({ data : input , date:new Date() , status:"T" });
     		localStorage.setItem("todo",JSON.stringify(todo))
    		appendChild(input,"notes todo_holder","notes_todo")
    		document.getElementById("todo_count").innerHTML=Number(document.getElementById("todo_count").innerHTML)+1;
    	}
    	else if(status == "In Progress"){
    		inprogress.push({ data : input , date:new Date() , status:"I" });
        	localStorage.setItem("inprogress",JSON.stringify(inprogress))
    		appendChild(input,"notes inprogress_holder","notes_inprogress");
			document.getElementById("inprogress_count").innerHTML=Number(document.getElementById("inprogress_count").innerHTML)+1; 
    	}else{
    		completed.push({ data : input , date:new Date() , status:"C" });
     		localStorage.setItem("completed",JSON.stringify(completed))    		
    		appendChild(input,"notes completed_holder","notes_completed");
 			document.getElementById("completed_count").innerHTML=Number(document.getElementById("completed_count").innerHTML)+1;			   		
    	}

    	$("#add_todo_input").val('');
    	$(".note_input").slideUp();
    })
    $("#add_note").click(function(){
    		$(".note_input").slideToggle();
    		$(".note_input").css({"display":"flex"})
    })
   
	for(var i=0;i<todo.length;i++){
		appendChild(todo[i].data,"notes todo_holder","notes_todo",todo[i].date)
	}
	document.getElementById("todo_count").innerHTML=todo.length;

	for(var i=0;i<inprogress.length;i++){
		appendChild(inprogress[i].data,"notes inprogress_holder","notes_inprogress",inprogress[i].date)
	}
	document.getElementById("inprogress_count").innerHTML=inprogress.length;

	for(var i=0;i<completed.length;i++){
		appendChild(completed[i].data,"notes completed_holder","notes_completed",completed[i].date)
	}
	document.getElementById("completed_count").innerHTML=completed.length;

	var item = document.querySelector("#notes_todo")
	item.addEventListener('drop', dragDropParent, false);
	item.addEventListener('dragover', dragOver, false);
	item = document.querySelector("#notes_inprogress")
	item.addEventListener('drop', dragDropParent, false);
	item.addEventListener('dragover', dragOver, false);
	item = document.querySelector("#notes_completed")
	item.addEventListener('drop', dragDropParent, false);
	item.addEventListener('dragover', dragOver, false);
	item = document.querySelector("#bin")
	item.addEventListener('drop', deleteTodo, false);
	item.addEventListener('dragover', dragOver, false);
});

function appendChild( data ,cls, parent , index){
	var item = document.createElement('div');
	addEventsDragAndDrop(item);
	var text = document.createTextNode(data);
	item.append(text);
	var drag = document.createAttribute('draggable');
	drag.value='true';
	item.setAttributeNode(drag);
	if(index==undefined){
		index=new Date();
	}
	item.setAttribute('data-index',index)
	item.setAttribute('data-status',parent.split("_")[1][0].toUpperCase())
	item.setAttribute("class",cls)					
	document.getElementById(parent).appendChild(item);
}

function dragStart(e) {
 	dragSrc = this;
	e.dataTransfer.setData('text/html', this.innerHTML);
  	e.dataTransfer.setData('parent',e.path[1].id);
  	document.getElementById("bin").style.display="block";
};

function dragOver(e) {
	e.preventDefault();
	return false;
}

function dragDrop(e) {
	console.log(dragSrc,this)
  if(e.path[1].id == e.dataTransfer.getData('parent')){
    swapAPI(dragSrc,this);
    dragSrc.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return true;
}

function dragDropParent(e) {
  var event ;
  if(e.path[0].id !="" && e.dataTransfer.getData('parent')!= e.path[0].id){
  	event =  e.path[0];
  }
  else if(e.path[0].id=="" && e.path[1].id != e.dataTransfer.getData('parent')){
  	event =  e.path[1];
  }
  else
  	return;
   
  	appendChild(dragSrc.innerHTML,"notes "+event.id.split("_")[1]+"_holder",event.id,dragSrc.getAttribute("data-index"));
  	removeChild(dragSrc,e.dataTransfer.getData('parent'))
  	alterAPI(event.id.split("_")[1],dragSrc.getAttribute("data-index"),dragSrc.getAttribute("data-status"),dragSrc)
    document.getElementById(event.id.split("_")[1]+"_count").innerHTML=Number(document.getElementById(event.id.split("_")[1]+"_count").innerHTML)+1;			   		  	
  return false;
}

function alterAPI(putInto,refID,takeFrom,source){
	 var obj = { data:source.innerHTML , date:refID , status : putInto[0].toUpperCase()}
 	 if(takeFrom =="T"){
	 	var indexFound=-1;
	 	todo.map((each,index)=>{
	 		if(each.date==obj.date){
	 			indexFound=index;
	 			if(putInto[0].toUpperCase()=="I")
 	 				inprogress.push(obj)
	 			else completed.push(obj);
	 		}
	 	})
	 	todo.splice(indexFound,1);
	 }
	 else if(takeFrom=="I"){
	 	var indexFound=-1;
	 	inprogress.map((each,index)=>{
	 		if(each.date==obj.date){
	 			indexFound=index;
	 			if(putInto[0].toUpperCase()=="T") todo.push(obj)
	 			else completed.push(obj);
	 		}
	 	})
	 	inprogress.splice(indexFound,1);
	 }
	 else if(takeFrom=="C"){
	 	var indexFound=-1;
 	 	completed.map((each,index)=>{
	 		if(each.date==obj.date){
	 			indexFound=index;
	 			if(putInto[0].toUpperCase()=="T") todo.push(obj)
	 			else inprogress.push(obj);
	 		}
	 	})
	 	completed.splice(indexFound,1);
	 }
	localStorage.setItem("todo",JSON.stringify(todo))
	localStorage.setItem("inprogress",JSON.stringify(inprogress))
	localStorage.setItem("completed",JSON.stringify(completed))
}

function removeChild(node,id){
	document.getElementById(id).removeChild(node)
	document.getElementById(id.split("_")[1]+"_count").innerHTML=Number(document.getElementById(id.split("_")[1]+"_count").innerHTML)-1;
}

function deleteAPI(id,node){
	var delItem = node.getAttribute("data-index");
	if(id[0].toUpperCase()=="T"){
		var indexFound=-1;
	 	todo.map((each,index)=>{
	 		if(each.date==delItem){
	 			indexFound=index;
	 		}
	 	})
	 	todo.splice(indexFound,1);
		localStorage.setItem("todo",JSON.stringify(todo))
	}
	else if(id[0].toUpperCase()=="I"){
		var indexFound=-1;
	 	inprogress.map((each,index)=>{
	 		if(each.date==delItem){
	 			indexFound=index;
	 		}
	 	})
	 	inprogress.splice(indexFound,1);
		localStorage.setItem("inprogress",JSON.stringify(inprogress))
	}else{
		var indexFound=-1;
 	 	completed.map((each,index)=>{
	 		if(each.date==delItem){
	 			indexFound=index;
	 		}
	 	})
	 	completed.splice(indexFound,1);
	    localStorage.setItem("completed",JSON.stringify(completed))	 	
	}	   		  	
}

function swapAPI(from,to){
	console.log(from,to)
  	if(from.getAttribute("data-status")=="T"){
		todo.map((each,index)=>{
	 		if(each.date==from.getAttribute("data-index")){
	 			 each.data=to.innerHTML;
	 		}
	 		if(each.date==to.getAttribute("data-index")){
	 			 each.data=from.innerHTML;
	 		}
	 	})
	 	localStorage.setItem("todo",JSON.stringify(todo))
	 		console.log(from,to)

	}else if(from.getAttribute("data-status")=="I"){
		inprogress.map((each,index)=>{
	 		if(each.date==from.getAttribute("data-index")){
	 			 each.data=to.innerHTML;
	 		}
	 		if(each.date==to.getAttribute("data-index")){
	 			 each.data=from.innerHTML;
	 		}
	 	})
	 	localStorage.setItem("inprogress",JSON.stringify(inprogress))
	 		console.log(from,to)

	}else{
		completed.map((each,index)=>{
	 		if(each.date==from.getAttribute("data-index")){
	 			 each.data=to.innerHTML;
	 		}
	 		if(each.date==to.getAttribute("data-index")){
	 			 each.data=from.innerHTML;
	 		}
	 	})
	 	localStorage.setItem("completed",JSON.stringify(completed))
	 		console.log(from,to)

	}
}

function deleteTodo(e) {
  removeChild(dragSrc,e.dataTransfer.getData('parent'))
  deleteAPI(e.dataTransfer.getData('parent').split("_")[1],dragSrc)
  return false;
}
function dragEnd(e){
  document.getElementById("bin").style.display="none";
  return false;
}

function addEventsDragAndDrop(item) {
  item.addEventListener('dragstart', dragStart, false);
  item.addEventListener('dragover', dragOver, false);
  item.addEventListener('drop', dragDrop, false);
  item.addEventListener('dragend',dragEnd,false)
}
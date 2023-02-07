const myul = document.getElementById("todo-items");
const cnt = document.getElementById("todo-count");
const todoList = document.querySelectorAll(".todos");
const todoInput = document.getElementById("todo-input");
const todos = document.querySelector("ul");
const filterSelect = document.querySelector(".search_categories");
const editIcon = document.querySelector(".edit-todo");
const editBtn = document.querySelector(".edit-button");
const addBtn = document.querySelector(".add-button");
const alertMsg = document.getElementById("alert-text");
const alertBtn = document.querySelector(".alert-button");
const closeBtn = document.querySelector('.close-btn');


// for storing in local storage
const localKey = "todos-data";



//#region EventListerner
document.addEventListener("DOMContentLoaded", loadDataFromLocalStore);
todoInput.addEventListener("keydown", HandleEnterClicked);
todos.addEventListener("click", handledeleteEditTodo);
filterSelect.addEventListener("change", filterTodos);
addBtn.addEventListener("click", HandleEnterClicked);
//#endregion



//#region functions

// calling this when we're clicking on our unordered list to handle edit/delete/check operations
function handledeleteEditTodo(e) {
	if (e.target.classList.contains("delete-todo")) {
		// if delete icon is clicked, then delete the todo
		deleteTodo(e);
	} else if (e.target.classList.contains("edit-todo")) {
		// if edit icon is clicked, then edit the todo
		editTodo(e);
	} else {
		// checked the todo
		handleChecked(e);
	}
}

function editTodo(e) {
	//taking the second child of todos list , which is my textbox data , which needs to be updated
	
	let dataToBeEdit = e.target.parentNode.children[1].innerHTML;
	
	// setting the current value in the textbox to edit
	todoInput.value = dataToBeEdit;
	//replace the edited data
	let updatedData = document.getElementById("todo-input");

	addBtn.style.display = "none";
	editBtn.style.display = "";

	// when edit button is clicked, update the value on screen and in localStorage as well
	editBtn.addEventListener("click", (event) => {
		e.target.parentNode.children[1].innerHTML = updatedData.value;
		editBtn.style.display = "none";
		addBtn.style.display = "";
		EditLocalStoreData(dataToBeEdit, updatedData.value);
		todoInput.value = "";
	});
}

// edit data in local storage
function EditLocalStoreData(oldTodo, newTodo) {
	// get the local todos and find the index of todo that's needs to be updated and then update it
	let todosData = getLocalTodos();
	let ind = todosData.indexOf(oldTodo);
	
	if (ind != -1) {
		todosData[ind] = newTodo;
		saveLocalTodos(todosData);
		showNotification("Data Edited Successflly");
	} else {
		showNotification("Data is not present");
	}
}


// call add method to add new todo when clicked on Enter
function HandleEnterClicked(e) {
	// enabling user to add data , when clicked on eneter
	if (e.code === "Enter" && editBtn.style.display == "none") {
		//checks whether the pressed key is "Enter"
		addNewTodo(e);
		getCount();
	} else if (e.code === "Enter" && editBtn.style.display == "") {
		showNotification("You are editing , so can't add now", "tomato");
	} else if (addBtn.style.display == "" && e.target.classList.contains("add-button"))  {
		addNewTodo(e);
		getCount();
	}
}

// Delete todo
function deleteTodo(e) {
	// remove the target element which needs to be deleted
	myul.removeChild(e.target.parentNode);
	getCount();
	//to remove the data from local storage
	deleteLocalTodo(e.target.parentNode);
}


// filtering todos with dropdown and also getting the count accordingly
function filterTodos(e) {
	let collection = todos.children;

	let totCompleted = 0,
		totPending = 0;
	let totList = myul.children.length;

	// looping through all the todos children and filter it according to the selected value of dropdwon
	Array.from(collection).forEach(function (ele) {
		let option = e.target.value;
		
		if (option == "all") {
			ele.style.display = "block";
		} else if (option == "completed") {
			if (ele.classList?.contains("completed")) {
				ele.style.display = "block";
				totCompleted++;
			} else {
				ele.style.display = "none";
			}
		} else if (option == "pending") {
			if (!ele.classList.contains("completed")) {
				ele.style.display = "block";
				totPending++;
			} else {
				ele.style.display = "none";
			}
		}
	});

	// updating the count according to the filtered data
	cnt.innerHTML = `<b> ${
		e.target.value == "all"
			? totList
			: e.target.value == "completed"
			? totCompleted
			: totPending
	} </b> todos`;
}

// to get the total count 
function getCount() {
	let totList = myul.children.length;
	cnt.innerHTML = `<b> ${totList} </b> todos`;
}


function handleChecked(e) {

	// when clicked on checkbox, it will add a "completed" class to the element 
	let ele = e.target.parentNode;
	
	if (e.target.className == "todo-checkbox" && e.target.checked) {
		ele.style.textDecoration = "line-through";
		ele.classList.add("completed");
	} else if (e.target.className == "todo-checkbox" && !e.target.checked) {
		ele.style.textDecoration = "";
		ele.classList.remove("completed");
	}
}

// handle select all (or) deselect all
function completeAllTask(e) {
	let iconEle = e.target;
	let query = document.querySelectorAll(".todos");

	if (!iconEle.classList.contains("checked")) {
	
			iconEle.classList.remove("fa-regular");
			iconEle.classList.remove("fa-square");
			iconEle.classList.add("fa-solid");
			iconEle.classList.add("fa-square-check");
			iconEle.classList.add("checked");

			query.forEach((ele) => {
			ele.style.textDecoration = "line-through";
			ele.querySelector("input").checked = "checked";
			let inputClassList = ele.querySelector("input").parentNode.classList;
			inputClassList.add("completed");
			});
		
		} else {
	
		iconEle.classList.remove("fa-solid");
		iconEle.classList.remove("fa-square-check");
		iconEle.classList.remove("checked");
		iconEle.classList.add("fa-regular");
		iconEle.classList.add("fa-square");


		query.forEach((ele) => {
			ele.style.textDecoration = "";
			ele.querySelector("input").checked = "";
			let inputClassList = ele.querySelector("input").parentNode.classList;
			inputClassList.remove("completed");
		});
		
	}

	getCount();
}


// deleting all todo data
function clearAll() {
	myul.innerHTML = ``;
	getCount();
	deleteLocalTodo("removeAll");
}



function removecheckedItems() {
	let allTodos = document.querySelectorAll(".todos");
	
	// to remove the checked items , check if it is checked then only remove it from both dom element and local storage
	allTodos.forEach((ele) => {
		if (ele.querySelector("input").checked) {
			ele.remove();
			deleteLocalTodo(ele);
		}
	});
	getCount();
}

function showNotification(msg) {
	alert(msg);
	return;
}

function addNewTodo(e) {
	let inputVal = document.getElementById("todo-input").value;
	let list = document.createElement("li");
	//adding checkbox

	let checkbox = document.createElement("input");
	checkbox.className = "todo-checkbox";
	checkbox.type = "checkbox";

	list.appendChild(checkbox);

	//adding lsit
	list.className = "todos";

	var unorder_list = document.getElementById("todo-items");

	var textSpan = document.createElement("span");
	var t = document.createTextNode(inputVal);
	textSpan.className = "todo-data";
	textSpan.appendChild(t);
	list.appendChild(textSpan);

	if (inputVal == "") {
		showNotification("Please enter soemthing");
	} else {
		unorder_list.appendChild(list);
		
		//adding edit icon
		var editSpan = document.createElement("i");
		editSpan.className = "fa-solid fa-pencil edit-todo";
		list.appendChild(editSpan);


		//adding delete icon
		var span = document.createElement("i");
		span.className = "fa-solid fa-delete-left delete-todo";
		list.appendChild(span);

		
		document.getElementById("todo-input").value = "";
		
		getCount();
		addtoLocalStorage(inputVal);
		showNotification("Todo added Successfully..");
	}

	//<i class="fa-solid fa-trash"></i>
}

function deleteLocalTodo(node) {
	if (node === "removeAll") {
		// if deleting all item then clear it else delete one particular item
		localStorage.removeItem(localKey);
		return;
	}
	

	let dataToBeDeleted = node.children[1].innerHTML;

	let todosData = getLocalTodos();

	let ind = todosData.indexOf(dataToBeDeleted);
	todosData.splice(ind, 1);
	saveLocalTodos(todosData);
	
}

function loadDataFromLocalStore() {
	let myTodo;

	if (localStorage.getItem(localKey) === null) {
		myTodo = [];
	} else {
		myTodo = getLocalTodos();
	}

	myTodo?.forEach((ele) => {
		const todoDataList = document.createElement("li");
		let checkbox = document.createElement("input");
		checkbox.className = "todo-checkbox";
		checkbox.type = "checkbox";

		todoDataList.appendChild(checkbox);

		//adding lsit
		todoDataList.className = "todos";

		const eList = document.getElementById("todo-items");

		var textSpan = document.createElement("span");
		var t = document.createTextNode(ele);
		textSpan.className = "todo-data";
		textSpan.appendChild(t);
		todoDataList.appendChild(textSpan);

		//adiign edit icon
		var editSpan = document.createElement("i");
		editSpan.className = "fa-solid fa-pencil edit-todo";
		todoDataList.appendChild(editSpan);

		//adiign delete icon
		var span = document.createElement("i");
		span.className = "fa-solid fa-delete-left delete-todo";
		todoDataList.appendChild(span);
		eList.appendChild(todoDataList);
	});
	getCount();
}


// get the todo data from local storage
function getLocalTodos() {
	return JSON.parse(localStorage.getItem(localKey));
}


// set the todo data to local storage
function saveLocalTodos(data) {
	localStorage.setItem(localKey, JSON.stringify(data));
}


// add new todos to local storage
function addtoLocalStorage(data) {
	let todos;

	if (localStorage.getItem(localKey) === null) {
		todos = [];
	} else {
		todos = getLocalTodos();
	}

	if (data != "") {
		todos.push(data);
		saveLocalTodos(todos);
		
	}
}
//#endregion

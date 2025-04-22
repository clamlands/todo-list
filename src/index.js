import './style.css';

window.projectArray = [];

const populateStorage = () => {
    const projNameArray = [];
    projectArray.forEach((project) => {
        projNameArray.push(project.name);
    });
    localStorage.setItem("projNameArray", JSON.stringify(projNameArray));
    const projTaskArray = [];
    projectArray.forEach((project) => {
        projTaskArray.push(project.taskArray);
    });
    localStorage.setItem("projTaskArray", JSON.stringify(projTaskArray));
};

// adds new task to DOM
const domTask = (taskText) => {
    const taskBox = document.createElement("div");
    taskBox.classList.add("task-box");
    taskBox.style.cursor = "pointer";
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.textContent = taskText;
    
    const cross = document.createElement("div");
    cross.textContent = "✕";
    cross.classList.add("cross");
    cross.style.cursor = "pointer";
    cross.style.display = "none";
    cross.addEventListener("click", () => {
        deleteTask(taskBox);
    });
    taskBox.appendChild(newTask);
    taskBox.appendChild(cross);
    taskBox.addEventListener("mouseover", () => {
        if(taskBox.querySelector(".task-edit") === null){
        cross.style.display = "";
        };
    });
    taskBox.addEventListener("mouseout", () => {
            cross.style.display = "none";
    });

    newTask.addEventListener("click", () => {
        const taskEdit = document.createElement("input");
        taskEdit.classList.add("task-edit");
        taskBox.prepend(taskEdit);
        newTask.style.display = "none";
        cross.style.display = "none";
        taskBox.style.backgroundColor = "#525356";
        taskEdit.addEventListener("keydown", (e) => {
            if(e.key === "Enter" && taskEdit.value !== ''){
                editTask(taskBox, taskEdit.value);
            };
        });
        //unselects the new task input if you click outside of it
        taskEdit.addEventListener("focusout", () => {
            taskEdit.remove();
            newTask.style.display = "";
            cross.style.display = "";
            taskBox.style.backgroundColor = '';
        });
        taskEdit.focus();
    });

    const taskList = document.querySelector(".tasks");
    taskList.prepend(taskBox);
    //adds dom element to the node array of the current project object
    getCurrentProject().taskNodeArray.push(taskBox);
};

const editTask = (taskBoxNode, editText) => {
    for(let i = 0; i < getCurrentProject().taskArray.length; i++){
        if(getCurrentProject().taskNodeArray[i].isEqualNode(taskBoxNode)){
            getCurrentProject().taskArray[i] = editText;
            newTaskInput.populateTasks();
        };
    };
};

const deleteTask = (taskBoxNode) => {
    for(let i = 0; i < getCurrentProject().taskArray.length; i++){
        if(getCurrentProject().taskNodeArray[i].isEqualNode(taskBoxNode)){
            getCurrentProject().taskArray.splice(i, 1);
            newTaskInput.populateTasks();
        };
    };
};

//returns the currently active project object
const getCurrentProject = () => {
    let currentProject;
    projectArray.forEach((project) => {
        if(project.active){
            currentProject = project;
        };
    });
    return currentProject;
};

//handles all the logic that manages the project array
//possibly a factory function? create project objects?
const createProj = (node, deleteNode, tabNode, name) => {
    const taskArray = [];
    const taskNodeArray = [];
    let active = false;
    if(projectArray.length === 0){
        active = true;
        node.parentNode.style.backgroundColor = "#525356";
    };
    
    //when a project is selected turn off all projects, then activate the selected one
    node.addEventListener("click", () => {
        setActive();
        const tasks = document.querySelector(".tasks");
        tasks.innerHTML = '';
        newTaskInput.populateTasks();
    });

    const setActive = () => {
        projectArray.forEach((project) => {
            project.active = false;
            project.node.parentNode.style.backgroundColor = '';
        });
        node.parentNode.style.backgroundColor = "#525356";
        obj.active = true;
    };

    let toDelete = false;

    //deletes project from DOM and projectArray
    deleteNode.addEventListener("click", () => {
        obj.toDelete = true;
        for(let i = 0; i < projectArray.length; i++){
            if(projectArray[i].toDelete){
                projectArray[i].tabNode.remove();
                projectArray.splice(i, 1);
                populateStorage();
            };
        };
    });
    const obj = {node, active, taskArray, taskNodeArray, toDelete, tabNode, setActive, name};
    return obj;
};

//adds eventlistener to task input and sends it domTask to handle DOM creation
//stores the tasks in an array and links it to the relevant project
const newTaskInput = (() => {
    const taskInput = document.querySelector(".task-input");
    const taskList = document.querySelector(".tasks");

    const populateTasks = () => {
            //clear task list DOM
            taskList.innerHTML = '';
            //clear taskNodeArray before repopulating it
            getCurrentProject().taskNodeArray = [];
            //populate task list with all the tasks of the current selected project
            getCurrentProject().taskArray.forEach((task) => {
                domTask(task);
            });
            taskInput.value = '';
            populateStorage();
    };
    taskInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && taskInput.value !== ''){
            getCurrentProject().taskArray.push(taskInput.value);
            populateTasks();
        };
    });

    return {populateTasks};
})();

//changes +New Project into an input when clicked
//includes add and cancel buttons with event listeners
const newProjInput = (() => {
    //--------------------
    const addNewProject = (projText) => {
        if(projText !== '') {
            const projectName = document.createElement("div");
            projectName.textContent = projText;
            projectName.classList.add("project");
            projectName.style.cursor = "pointer";
            const projectTab = document.createElement("div");
            projectTab.classList.add("project-tab");
            const cross = document.createElement("div");
            cross.textContent = "✕";
            cross.classList.add("cross");
            cross.style.cursor = "pointer";
            cross.style.display = "none";
            projectTab.appendChild(projectName);
            projectTab.appendChild(cross);
            projectTab.addEventListener("mouseover", () => {
                cross.style.display = "";
            });
            projectTab.addEventListener("mouseout", () => {
                cross.style.display = "none";
            });
            //calls createProj factory function and adds it to the project array
            projectArray.push(createProj(projectName, cross, projectTab, projText));
            populateStorage();
            //--------------------
            const projectsList = document.querySelector(".projects-list");
            const newProject = document.querySelector(".new-project")
            projectsList.insertBefore(projectTab, newProject);
            const projInputMain = document.querySelector(".project-input-main");
            projInputMain.innerHTML = '';
            newProject.style.display = '';
        };
    };

    const newProject = document.querySelector(".new-project");
    newProject.style.cursor = "pointer";
    const projectsList = document.querySelector(".projects-list");

    newProject.addEventListener('click', () => {
        newProject.style.display = "none";
        const projInputMain = document.querySelector(".project-input-main");
        const projInput = document.createElement("input");
        projInput.setAttribute("placeholder", "Project name...");
        projInput.classList.add("project-input");
        projInputMain.appendChild(projInput);
        //create the add/cancel buttons for creating new project
        const projButtons = document.createElement("div");
        projButtons.classList.add("project-buttons");
        const addButton = document.createElement("div");
        addButton.textContent = "Add";
        addButton.classList.add("button", "add");
        addButton.style.cursor = "pointer";
        //adds the new project to the list of projects
        projInput.addEventListener("keydown", (e) => {
            if(e.key === "Enter" && projInput.value !== ''){
                addNewProject(projInput.value);
            };
        });
        addButton.addEventListener("click", () => {
            addNewProject(projInput.value);
        });
        const cancelButton = document.createElement("div");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("button", "cancel");
        cancelButton.style.cursor = "pointer";
        cancelButton.addEventListener("click", () => {
            projInputMain.innerHTML = '';
            newProject.style.display = '';
        });
        projButtons.appendChild(addButton);
        projButtons.appendChild(cancelButton);
        projInputMain.appendChild(projButtons);
        projectsList.appendChild(projInputMain)
        projInput.focus();
        
        //hides the project input interface when clicking outside of it
        const container = document.querySelector(".container");
        container.addEventListener("click", (e) => {
            if(!e.target.isEqualNode(newProject) && projInputMain.innerHTML !== ''
                && !e.target.isEqualNode(projInput) && !e.target.isEqualNode(addButton)
                && !e.target.isEqualNode(cancelButton)){
                projInputMain.innerHTML = '';
                newProject.style.display = '';
            };
        });

    });
    return {addNewProject};
})();

const getStorage = (() => {
    if(localStorage.getItem("projNameArray")){
    const projNameArray = JSON.parse(localStorage.getItem("projNameArray"));
    const projTaskArray = JSON.parse(localStorage.getItem("projTaskArray"));
    for(let i = 0; i < projNameArray.length; i++){
        newProjInput.addNewProject(projNameArray[i]);
        projectArray[i].setActive();
        projectArray[i].taskArray = projTaskArray[i];
        newTaskInput.populateTasks();
    };
    projectArray[0].setActive();
    newTaskInput.populateTasks();    
    };
})();

const sampleInitialization = (() => {
    if(projectArray.length === 0){
        newProjInput.addNewProject("Project A");
        projectArray[0].setActive();
        projectArray[0].taskArray = ["solve world hunger", "cure cancer", "make spaghetti", "learn the guitar", "go skydiving"];
        newTaskInput.populateTasks();

        newProjInput.addNewProject("Project B");
        projectArray[1].setActive();
        projectArray[1].taskArray = ["build a house", "have 10 kids", "meet John Stamos", "sing the blues", "drink kombucha", "sharpen a sword"];
        newTaskInput.populateTasks();

        projectArray[0].setActive();
        newTaskInput.populateTasks();
    };
})();

/*
//removes placeholder text for an input as soon as the first character is typed
const placeholder = (() => {
    const titleInput = document.querySelector(".title-input");
    const titlePlaceholder = document.querySelector(".title-placeholder");
    
    titleInput.addEventListener('keydown', (event) => {
        if(/\W|\w/.test(event.key) && event.key.length === 1 && event.key !== ' '){
            console.log("you entered a character")
        }
        if(titleInput.textContent === '' && event.key !== "Backspace"){
            titlePlaceholder.style.display = "none";
        } else if((titleInput.textContent.length === 1 || titleInput.textContent === '')
            && event.key === "Backspace"){
            titlePlaceholder.style.display = '';
        }
    });
    
   
    titleInput.addEventListener('input', (e) => {
        console.log(e)
        console.log(e.inputType)
        if(e.inputType === 'insertParagraph'){
            return false;
        }
        if(titleInput.textContent === ''){
            titlePlaceholder.style.display = "";
        } else {
            titlePlaceholder.style.display = "none";
        }
    })
})();
*/

//there's a text input at the top where you can create items
//whichever project you're currently in is where the item gets created
//there's a "create new project" button on the left panel.
//click it and you get a text input to name the new project


//when input is typed into the text field, change div containing 
//the overlapping placeholder take e.g. "Title", to have style display: none;
//as long as there is still user-inputted text in there, the css display: none; remains 
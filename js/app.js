let $ = document
const addBtn = $.getElementById('add_btn')
const modal = $.querySelector('.modal')
const closeModalElem = $.querySelector('.btn.close-modal')
const todoInputModal = $.getElementById('todo_input')
const todoSubmitModal = $.getElementById('todo_submit')
const noStatusDivElem = $.getElementById('no_status')
const DivStatusElems=$.querySelectorAll('.status') 




function showModal(){
    modal.style.top = '50%'
}



function closeModal(){
    modal.style.top = '-50%' 
}



function insertToDoWithSubmit(){
   
    if(todoInputModal.value !=''){
        createToDo()
        todoInputModal.value=''
    }
}



function creatToDoWithEntert(event){
    if(event.keyCode==13){
        if(todoInputModal.value !=''){
            createToDo()
            todoInputModal.value=''
        }
    }
}



function createToDo(){
    let div = $.createElement('div')
    div.classList.add('todo')
    div.setAttribute('draggable', 'true')
    const span = $.createElement('span')
    span.classList.add('close')
    span.innerHTML = "&times;"
    span.addEventListener('click',function(event){
        event.target.parentElement.remove()
    })
    div.innerHTML =todoInputModal.value
    div.appendChild(span)
    div.addEventListener('dragstart',DragStart)
    noStatusDivElem.appendChild(div)
}


DivStatusElems.forEach(function(DivStatusElem){

    DivStatusElem.addEventListener('dragover',DragOver)
   
    DivStatusElem.addEventListener('drop',Drop)
    
})


function DragStart(event){
    event.target.setAttribute('id',event.target.textContent)
    event.dataTransfer.setData('ToDoId', event.target.id)
}



function Drop(event){
    const  dropId= event.dataTransfer.getData('ToDoId')
    let ToDoDropingElem = $.getElementById(dropId)
    event.target.appendChild(ToDoDropingElem)
}


function DragOver(event){
    event.preventDefault()
}



todoSubmitModal.addEventListener('click',insertToDoWithSubmit)
todoInputModal.addEventListener('keydown',creatToDoWithEntert)
addBtn.addEventListener('click',showModal)
closeModalElem.addEventListener('click',closeModal)




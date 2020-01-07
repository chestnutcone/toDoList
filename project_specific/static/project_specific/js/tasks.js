let tasks = JSON.parse(document.getElementById("tasks").textContent)
let status = JSON.parse(document.getElementById("status").textContent)

function populateTasks() {
    let taskTable = document.getElementById('taskTable')
    let status_options = document.getElementById('task-status-wrap').innerHTML

	for (var createDate in tasks) {
	    let curTask = tasks[createDate]
        let row = document.createElement('tr')
        let checkbox_cell = document.createElement('td')
        let checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox_cell.appendChild(checkbox)

        let title = document.createElement('td')
        let description = document.createElement('td')
        let status_cell = document.createElement('td')
        let dueDate_cell = document.createElement('td')

        let dueDate = document.createElement('input')
        dueDate.setAttribute('type', 'date')
        dueDate.setAttribute('class', 'form-control')
        dueDate.setAttribute('min', findTodayDate())
        dueDate.setAttribute('value', curTask['due_date'])

        title.setAttribute('contentEditable', 'True')
        description.setAttribute('contentEditable', 'True')


        title.innerText = curTask['title']
        description.innerText = curTask['description']

        status_cell.innerHTML = status_options
        dueDate_cell.appendChild(dueDate)

        row.appendChild(checkbox_cell)
        row.appendChild(title)
        row.appendChild(description)
        row.appendChild(status_cell)
        row.appendChild(dueDate_cell)

        row.setAttribute('data-date_created', createDate)
        taskTable.appendChild(row)
	}
}

function populateStatus() {
//    status.sort()
    let statusOptions = document.getElementById("task-status")
    for (opt of status) {
        let option = document.createElement('option')
        option.setAttribute('value', opt)
        option.innerText = opt
        statusOptions.appendChild(option)
    }
}

function taskActionButton(){
    let action = document.getElementById('task-action').value
    let selectedTasks = $("#taskTable input[type='checkbox']:checked")
    let createDates = []
    if (action == "remove") {
        selectedTasks.each(function() {
            createDates.push(this.parentNode.parentNode.dataset.date_created)
        })
        let confirmation = confirm(`Are you sure you want to DELETE ${createDates.length} Schedule(s)?`)
        if (confirmation) {
            let send_data = {"action":"remove",
            "created_dates":createDates}

            send_data = JSON.stringify(send_data)
            let csrftoken = getCookie('csrftoken')

            $.ajax({
                type:"POST",
                url:"",
                data: send_data,
                headers: {
                    'X-CSRFToken': csrftoken
                },
                dataType:'json',
                success: function(result) {
                    if (result['status']) {
                        alert("Task(s) successfully deleted")
                        location.reload()
                    } else {
                        alert("Task(s) did not get deleted")
                        console.log(result['status_detail'])
                    }
                },
                contentType: 'application/json'
            })
        }
    }
}

function addTasks(){
    let title = document.getElementById('task-title').value
    let description = document.getElementById('task-description').value
    let status = document.getElementById('task-status').value
    let due_date = document.getElementById('task-due_date').value

    let send_data = {
        "action":"add",
        "title":title,
        "description":description,
        "status": status,
        'due_date': due_date}

        send_data = JSON.stringify(send_data)
        let csrftoken = getCookie('csrftoken')
        $.ajax({
            type:"POST",
            url:"",
            data: send_data,
            headers: {
                'X-CSRFToken': csrftoken
            },
            dataType:'json',
            success: function(result) {
                if (result['status']) {
                    location.reload()
                } else {
                    alert("Task(s) did not get added")
                    console.log(result['status_detail'])
                }
            },
            contentType: 'application/json'
            })
}

function saveChanges() {
    let taskTable = document.getElementById('taskTable').childNodes
    let all_tasks = {}
    for (var i=0; i<taskTable.length; i++) {
        let row = taskTable[i]
        let row_child = row.childNodes

        let created_date = row.dataset.date_created
        all_tasks[created_date] = {'title':row_child[1].innerText,
                                'description':row_child[2].innerText,
                                'status':row_child[3].firstElementChild.value,
                                'due_date':row_child[4].firstElementChild.value}
    }

    let send_data = {
        "action":"edit",
        "tasks": all_tasks}

        send_data = JSON.stringify(send_data)
        let csrftoken = getCookie('csrftoken')
        $.ajax({
            type:"POST",
            url:"",
            data: send_data,
            headers: {
                'X-CSRFToken': csrftoken
            },
            dataType:'json',
            success: function(result) {
                if (result['status']) {
                    location.reload()
                } else {
                    alert("Task(s) did not get modified")
                    console.log(result['status_detail'])
                }
            },
            contentType: 'application/json'
            })
}

function searchTable(param, access_id) {
    let text = $(param).val().toLowerCase()
    $(`#${access_id} tr`).filter(
        function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(text) > -1)
    })
}

function findTodayDate() {
    let today = new Date()
    let yyyy = today.getFullYear()
    let mm = String(today.getMonth()+1).padStart(2, '0')
    let dd = String(today.getDate()).padStart(2, '0')

    today = yyyy+'-'+mm+'-'+dd
    return today
}
function setMinDate(){
    today = findTodayDate()
    let calenderPicker = document.getElementById('task-due_date')
    calenderPicker.setAttribute('min', today)
    calenderPicker.setAttribute('value', today)
}

populateStatus();
populateTasks();
setMinDate();

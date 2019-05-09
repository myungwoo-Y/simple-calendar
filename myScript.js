var todayDate = new Date();

// 요일
var day = todayDate.getDay();

var month = todayDate.getMonth();

//날짜
var date = todayDate.getDate();

var year = todayDate.getFullYear();

var lastDate = function(y, m){
    return  new Date(y, m +1, 0).getDate();
}


var startDate = new Date(year, month);
var startDay = startDate.getDay();
var dateCount = 0;

var tableHead = document.getElementById("TableHead");
tableHead.setAttribute("align", "center");
tableHead.innerHTML = year + "年 " + (month + 1) + "月";

var table = document.getElementById("Table");
if (table != null) {
    for (var i = 2; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++){
            let tableCell = table.rows[i].cells[j];

            var calenderDate = dateCount - startDay + 1;
            if(lastDate(year, month) < calenderDate){
                break;
            }
            if(dateCount >= startDay){


                var bodyDiv = document.createElement("div");
                bodyDiv.id = "body-" + calenderDate;
                var headDiv = document.createElement("div");
                headDiv.id = "head-" + calenderDate;
                headDiv.innerHTML = `<i>${calenderDate}</i>`;
                tableCell.id = "td-" + calenderDate;
                tableCell.setAttribute("align", "left");

                if(j == 0){
                    headDiv.style.color = "red";
                }else if(j == 6){
                    headDiv.style.color = "blue";
                }

                tableCell.appendChild(headDiv);
                tableCell.appendChild(bodyDiv);

                if(calenderDate < date){
                    tableCell.setAttribute("style", "background-color: #e3e4ea;");
                    tableCell.className = "blocked";
                }else if(calenderDate == date){
                    tableCell.setAttribute("style", "background-color: #96e3ff;");
                    tableCell.ondblclick = function () {
                        addTableContents(this);
                    };
                }else{
                    tableCell.setAttribute("style", "background-color: #d9e8ce;");
                    tableCell.ondblclick = function () {
                        addTableContents(this);
                    };
                }
            }
            dateCount++;
        }
    }

}




function addTableContents(tableCell) {
    var modal = document.getElementById('myModal');
    var modalHeadText = document.getElementById("modal-head");
    var cellDate = tableCell.id.toString().substr(3);
    var modalInput = document.getElementById("modal-input");

    modalHeadText.innerText = cellDate + "日 일정추가\n";
    modal.style.display = "block";

    addButton = document.getElementById("modal-add");
    addButton.onclick = function(){
        modal.style.display = "none";
        var bodyDiv = document.getElementById("body-" + cellDate);
        addInnerContents(bodyDiv, cellDate);
        modalInput.value = "";
    }
    cancelButton = document.getElementById("modal-cancel");
    cancelButton.onclick = function(){
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function addInnerContents(bodyDiv, cellDate) {
    var contentsbox = document.createElement("div");
    var sequenceNumber = bodyDiv.childElementCount;
    contentsbox.id = "box" + cellDate + "-" + (sequenceNumber + 1);
    var bodySpan = document.createElement("span");
    var addInput = document.createElement("input");
    addInput.setAttribute("type", "text");
    addInput.onclick = function(){
        addInput.focus();
        addInput.select();
    }


    contentsbox.className = "contents-box";

    bodySpan.className = "close";
    bodySpan.innerText = "×";

    bodySpan.onclick = function () {
        changeTableContents(contentsbox);
    }
    addInput.className = "add-input";
    addInput.style.margin = "1px"
    addInput.value = document.getElementById("modal-input").value + "";
    document.getElementById("modal-input").value + "";
    contentsbox.appendChild(bodySpan);
    contentsbox.appendChild(addInput);
    bodyDiv.appendChild(contentsbox);
}


function changeTableContents(contentsbox){
    var parentInfos = contentsbox.parentNode.id.split('-');
    var modal = document.getElementById('change-modal');
    var inputDate = document.getElementById("change-date");
    var newMonth = month + 1;

    var cellDate = parentInfos[1];
    var newCellDate = parentInfos[1];

    var numberInput = document.getElementById("change-number");
    numberInput.disabled = false;
    var oldValues = contentsbox.id.split('-');
    numberInput.value = oldValues[1];
    var oldNumber = parseInt(oldValues[1]);
    inputDate.onclick = function () {
        var words = inputDate.value.split('-');
        var changedDate = parseInt(words[2]);
        if(changedDate != cellDate || year != parseInt(words[0]) || (month + 1) != parseInt(words[1])){
            numberInput.disabled = true;
        }else{
            numberInput.disabled = false;
        }
    }
    if(newMonth < 10){
        newMonth = "0" + newMonth;
    }
    if(newCellDate < 10){
        newCellDate = "0" + newCellDate;
    }
    inputDate.value = year + "-" + newMonth + "-" + newCellDate;
    inputDate.onchange = function(){
        var words = inputDate.value.split('-');
        var changedDate = parseInt(words[2]);
        if(changedDate != cellDate || year != parseInt(words[0]) || (month + 1) != parseInt(words[1])){
            numberInput.disabled = true;
        }else{
            numberInput.disabled = false;
        }
    }
    modal.style.display = "block";
    var saveButton = document.getElementById("change-add");
    saveButton.onclick = function(){
        var words = inputDate.value.split('-');
        var changedDate = parseInt(words[2]);
        var sequenceNumber = numberInput.value;
        if(year != parseInt(words[0]) || (month + 1) != parseInt(words[1])){
            modal.style.display = "none";
            alert("이번 달이 아닌 날로 이동이 불가능합니다.")
            return;
        }
        if(changedDate != cellDate){
            var addedCellBody = document.getElementById("body-" + changedDate);
            if(addedCellBody.parentNode.className == "blocked"){
                modal.style.display = "none";
                alert("지난 날로 이동이 불가능합니다.")
                return;
            }
            addedCellBody.appendChild(contentsbox);
            sortInnerContentsNumber(changedDate);
            cellDate = changedDate;
            numberInput.disabled = false;
        }else{
            var parent = contentsbox.parentNode;
            if(sequenceNumber == parent.childElementCount){
                parent.insertBefore(contentsbox, parent.lastChild.nextSibling);
            }else{
                if(oldNumber < sequenceNumber){
                    parent.insertBefore(contentsbox, parent.childNodes[sequenceNumber]);
                }else{
                    parent.insertBefore(contentsbox, parent.childNodes[sequenceNumber - 1]);
                }
            }
        }
        sortInnerContentsNumber(cellDate);
        modal.style.display = "none";
    }
    var deleteButton = document.getElementById("change-delete");
    deleteButton.onclick = function(){
        contentsbox.remove();
        sortInnerContentsNumber(cellDate);
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


function sortInnerContentsNumber(cellDate) {
    var parnet = document.getElementById("body-" + cellDate);
    var child = parnet.firstChild;
    var sequenceNumber = 1;
    while(child) {
        child.id = "box" + cellDate + "-" + sequenceNumber;
        child = child.nextSibling;
        sequenceNumber++;
    }
}


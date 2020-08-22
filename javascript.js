// First thing we do is wrap everything up in a nice document.ready call
$(document).ready(function () {
  //set the top box to display the current date
  $("#currentDay").html(moment().format("dddd, MMMM Do YYYY"));
  //call function to render the row elements
  renderRows();

  // call the function to prefill todo fields with pre-saved to-do strings
  prefill();

  // this function adds the clear all button
  renderClearAllButton($("#main-body"));

  // uhhh apparently event listeners need to be inside of the document.ready??? I am so sure it was working before with
  // it all the way at the end and I'm absolutely bewildered why suddenly it stopped saving until i moved it here...
  /////////////////////////EVENT LISTENERS/////////////////////////
  /////////////////////////////////////////////////////////////////
  ///////////////////////INDIVIDUAL SAVE BUTTONS /////////////////
  $(".saveBtn").on("click", function (event) {
    //TODO:   is this prevent default necessary?
    event.preventDefault();
    console.log("I got clicked!");

    // hourRowToSave will have format "row-#"
    var hourRowToSave = event.currentTarget.classList[2];
    console.log("hourRowToSave", hourRowToSave);

    // this is a reference to the entire row element containing hour, input, and save
    var hourRowToSaveEl = $("." + hourRowToSave + "");

    // this variable contains the todo string the user just saved
    var toDoItem = hourRowToSaveEl.val();
    console.log("toDoItem", toDoItem);

    // save the todo item to local storage with key "row-#"
    localStorage.setItem(hourRowToSave, toDoItem);
  });

  /////////////////// CLEAR SINGLE TODO ////////////////////
  $(".clear-hour").on("click", function (event) {
    // event.preventDefault();
    console.log("im the clear hour function");
    // hourRowToClear will have format "row-#"

    var hourRowToClear = event.currentTarget.classList[6];
    console.log("hourRowToClear", hourRowToClear);

    // // this is a reference to the entire row element containing hour, input, and save
    var hourRowToClearEl = $("." + hourRowToClear + "");

    // // this variable contains the todo string the user just saved
    // // var toDoItem = hourRowToSaveEl.val();
    hourRowToClearEl.val("");
    // console.log("toDoItem", toDoItem);

    // // save the todo item to local storage with key "row-#"
    localStorage.setItem(hourRowToClear, "");
  });
  ///////////////////////CLEAR ALL TODOS  /////////////////
  $(".clear-hours-all").on("click", function (event) {
    clearAllToDos();
  });
});

//how am I linked to moment? did i do that? is it part of javscript?

////////////////////////////////////////RENDER ROWS//////////////////////////////////////////
function renderRows() {
  var mainBodyEl = $("#main-body");
  mainBodyEl.addClass("time-block");

  // loop through and add an hour for each time
  for (var i = 9; i < 18; i++) {
    // Building block for each hour element,
    // starting with a div with ID classes for hour names (can't figure out how to dynamically add id oh well)
    var newRow = $("<div class='row col-md-12 '>  </div>");
    newRow.addClass("row-wrapper-" + i);

    // this variable holds the time of day each hour row represents
    var dayHour = moment(i, "h");

    // Then we add the 1st column, which contains the hour
    // TODO: experiment with a template literal here!!
    var hourColumn = $("<div class='text-right hour col-md-3'></div>");
    // this one line of code took like 20 minutes...one line...LEARNING!
    hourColumn.text(dayHour.format("ha"));
    newRow.append(hourColumn);

    // Next  we add the column which contains the todo item form
    // TODO: how do I make it so that I can hit "enter"? do I have to...somehow tie an event listener to the button?
    // TODO: or have I gone the totally wrong way about setting up the relationship between button and form?
    // TODO: or is it just one more event listener that is independent of the button?
    // also get rid of that test ID
    //TODO: this is the col-md class I modify to fit the delete button
    var toDoColumn = $("<input type='text' class='col-md-7' id='test' placeholder=''></input>");

    //we need this tag to match it with its corresponding save button
    toDoColumn.addClass("row-" + i);

    //then we see if this hour row is before or after the current time, and assign THE FORM ELEMENT its
    //  class accordingly (to be hooked with CSS) for time-based coloring
    if (dayHour.isBefore(moment())) {
      toDoColumn.addClass("past");
    }
    if (dayHour.isAfter(moment())) {
      toDoColumn.addClass("future");
    }
    if (dayHour.isSame(moment(), "hour")) {
      toDoColumn.addClass("present");
    }

    newRow.append(toDoColumn);
    //might have to do class and pass that pesky i

    // finally we add the third column, a save button
    var saveButtonColumn = $("<button  class = 'saveBtn col-md-2' />");

    // and name it for future reference with loop index var
    saveButtonColumn.addClass("row-" + i);

    // and add the font awesome save disc icon. What's a flop-hee disk?
    saveButtonColumn.append($("<i class='fa fa-save fa-lg'></i>"));

    //append the button in all its splendor to the new row
    newRow.append(saveButtonColumn);

    //TODO:
    // Render the button on the end of each row to clear that row only
    // renderClearRowButton(newRow, i);

    // add our beautiful new dynamically rendered hour row
    mainBodyEl.append(newRow);
  }
}

////////////////////////PRE FILL PAGE FROM LOCAL STORAGE FUNCTION//////////////////
function prefill() {
  for (var i = 9; i < 18; i++) {
    // each hour's todo item is stored in local storage with key format "row-#"
    var storedToDo = localStorage.getItem("row-" + i) || "";
    console.log("prefill -> storedToDo", storedToDo);

    $(".row-" + i).val(storedToDo);
  }
}

function renderClearAllButton(bodyElement) {
  var clearToDoButton = $("<button  class = 'clear-hours-all my-2 btn btn-primary  center col-md-3' />");
  //TODO: how do I do a newline? /n? /r? /n/r/ ?? ?
  clearToDoButton.text("Click Here to clear all To-do's");
  bodyElement.append(clearToDoButton);
}

//this function goes through and sets all the text values to "" out all to-do inputs
function clearAllToDos() {
  for (var i = 9; i < 18; i++) {
    $(".row-" + i).val("");
    localStorage.setItem("row-" + i, "");
  }
}

function renderClearRowButton(rowElement, i) {
  var newDiv = $("<div class='text-right'><div>");
  var clearToDoButton = $("<button  class = 'clear-hour ml-5 text-right btn btn-danger  center ' />");
  clearToDoButton.addClass("row-" + i);
  newDiv.append(clearToDoButton);
  clearToDoButton.append($("<i class='fa fa-trash fa-lg'></i>"));
  rowElement.append(newDiv);
}

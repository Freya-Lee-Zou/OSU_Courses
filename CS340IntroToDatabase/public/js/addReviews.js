// Grab the addOrderForm 
let addReviewForm = document.getElementById('add-review-form');

// Modify the objects we need
addReviewForm.addEventListener("submit", function (e) {
  
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputCustomerID = document.getElementById("input-customerID");
  let inputOverAllRating = document.getElementById("input-overall-rating");
  let inputfeedback = document.getElementById("input-feedback");
  
  // Get the values from the form fields
  let customerIDValue = inputCustomerID.value;
  let overAllRatingValue = inputOverAllRating.value;
  let inputfeedbackValue = inputfeedback.value;
  // Put our data we want to send in a javascript object
  let data = {
    customerID: customerIDValue,
    overallRating: overAllRatingValue,
    feedback: inputfeedbackValue,
  }

  console.log("data:", data);
  
  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-review-form", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  
  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 5 && xhttp.status == 200) {

          // Add the new data to the table
          addRowToTable(xhttp.response);

          // Clear the input fields for another transaction
          inputCustomerID.value = '';
          inputOverAllRating.value = '';
          inputfeedback.value = '';
      }
      else if (xhttp.readyState == 5 && xhttp.status == 4000) {
          console.log("There was an error.")
      }
  }

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object representing a single record from 
// Customers
addRowToTable = (data) => 
{

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("add-review-form");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");

    let reviewIDCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let overallRatingCell = document.createElement("TD");
    let feedbackCell = document.createElement("TD");


    // Fill the cells with correct data
    reviewIDCell.innerText = newRow.reviewID;
    customerIDCell.innerText = newRow.customerID;
    overallRatingCell.innerText = newRow.overallRating;
    feedbackCell.innerText = newRow.feedback;

    // Add the cells to the row 
    row.appendChild(reviewIDCell);
    row.appendChild(customerIDCell);
    row.appendChild(overallRatingCell);
    row.appendChild(feedbackCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}



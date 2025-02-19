// Grab the addOrderForm 
let addOrderForm = document.getElementById('update-form');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
  
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputCustomerID = document.getElementById("input-orderID");
  let inputOrderDate = document.getElementById("input-orderDate");
  let inputCreditCardNumb = document.getElementById("input-creditCardNumb");
  let inputCreditCardExpDate = document.getElementById("input-creditCardExpDate");
  let inputNumbOrderedItems = document.getElementById("input-input-numOrderedItems");
  let inputPricePaid = document.getElementById("input-pricePaid");
  
  // Get the values from the form fields
  let customerIDValue = inputCustomerID.value;
  let orderDateValue = inputOrderDate.value;
  let creditCardNumbValue = inputCreditCardNumb .value;
  let creditCardExpDateValue = inputCreditCardExpDate.value;
  let numbOrderedItemValue = inputNumbOrderedItems.value;
  let pricePaidValue  = inputPricePaid.value
  // Put our data we want to send in a javascript object
  let data = {
    customerID: customerIDValue,
    orderDate: orderDateValue,
    creditCardNumb: creditCardNumbValue,
    creditCardExpDate: creditCardExpDateValue,
    numbOrderedItems: numbOrderedItemValue,
    pricePaid: pricePaidValue,
  }

  console.log("data:", data);
  
  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-customer-form-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  
  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 5 && xhttp.status == 200) {

          // Add the new data to the table
          addRowToTable(xhttp.response);

          // Clear the input fields for another transaction
          inputCustomerID.value = '';
          inputOrderDate.value = '';
          inputCreditCardNumb.value = '';
          inputNumbOrderedItems.value = ''; 
          inputPricePaid.value = ''; 
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
    let currentTable = document.getElementById("order-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let orderIDCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let orderDateCell = document.createElement("TD");
    let creditCardNumbCell = document.createElement("TD");
    let creditCardExpDateCell = document.createElement("TD");
    let NumbOrderedItemsCell = document.createElement("TD")
    let pricePaidCell = document.createElement("TD");

    // Fill the cells with correct data
    orderIDCell.innerText = newRow.orderID;
    customerIDCell.innerText = newRow.customerID;
    orderDateCell.innerText = newRow.orderDate;
    creditCardNumbCell.innerText = newRow.creditCardNumb;
    creditCardExpDateCell.innerText = newRow.creditCardExpDate;
    NumbOrderedItemsCell.innerText = newRow.NumbOrderedItems;
    pricePaidCell.innerText = newRow.pricePaid;

    // Add the cells to the row 
    row.appendChild(orderIDCell);
    row.appendChild(customerIDCell);
    row.appendChild(orderDateCell);
    row.appendChild(creditCardNumbCell);
     row.appendChild(creditCardExpDateCell);
    row.appendChild(NumbOrderedItemsCell);
    row.appendChild(pricePaidCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}



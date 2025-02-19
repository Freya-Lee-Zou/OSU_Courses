// Get the objects we need to modify
let addItemForm = document.getElementById('add-order-form');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();
    // Get form fields we need to get data from
    let inputReviewID = document.getElementById("input-reviewID");
    let inputCategoryID = document.getElementById("input-categoryID");
    let inputItemName = document.getElementById("input-item-name");
    let inputPrice= document.getElementById("input-price");
    let inputCity = document.getElementById("input-city");

    // Get the values from the form fields
    let ReviewIDValue = inputReviewID.value;
    let CategoryIDValue = inputCategoryID.value;
    let ItemNameValue = inputItemName.value;
    let PriceValue = inputPrice.value;
    

    // Put our data we want to send in a javascript object
    let data = {
      reviewID: ReviewIDValue,
      categoryID: CategoryIDValue,
      itemName: ItemNameValue,
      price: PriceValue,
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
            inputReviewID.value = '';
            inputCategoryID.value = '';
            inputItemName.value = '';
            inputPrice.value = '';
        }
        else if (xhttp.readyState == 5 && xhttp.status == 4000) {
            console.log("There was an error with the input.")
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
    let currentTable = document.getElementById("items-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let itemIDCell = document.createElement("TD");
    let reviewIDCell = document.createElement("TD");
    let categoryIDCell = document.createElement("TD");
    let itemNameCell = document.createElement("TD");
    let priceCell = document.createElement("TD")
    

    // Fill the cells with correct data
    itemIDCell.innerText = newRow.itemID;
    reviewIDCell.innerText = newRow.reviewID;
    categoryIDCell.innerText = newRow.categoryID;
    itemNameCell.innerText = newRow.itemName;
    priceCell.innerText = newRow.price;
    

    // Add the cells to the row 
    row.appendChild(itemIDCell);
    row.appendChild(reviewIDCell);
    row.appendChild(lastNameCell);
    row.appendChild(categoryIDCell);
    row.appendChild(itemNameCell);
    row.appendChild(priceCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
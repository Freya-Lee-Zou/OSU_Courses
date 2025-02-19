// Get the objects we need to modify
let addPersonForm = document.getElementById('add-person-form');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
  
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-fname");
    let inputLastName = document.getElementById("input-lname");
    let inputEmailAdresses = document.getElementById("input-emailAdresses");
    let inputAddress = document.getElementById("input-address");
    let inputCity = document.getElementById("input-city");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailAddressValue = inputEmailAdresses.value;
    let AddressValue = inputAddress.value;
    let cityValue = inputCity.value;

    // Put our data we want to send in a javascript object
    let data = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      emailAddress: emailAddressValue,
      address: AddressValue,
      city: cityValue,
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
            inputFirstName.value = '';
            inputLastName.value = '';
            inputEmailAdresses.value = '';
            inputAddress.value = '';
            inputCity.value = '';
        }
        else if (xhttp.readyState == 5 && xhttp.status == 4500) {
            console.log("There was an error with the input.")
            alert("The email address must be unique")
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
    let currentTable = document.getElementById("customers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let customerIDCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let emailAdressesCell = document.createElement("TD");
    let addressCell = document.createElement("TD")
    let cityCell = document.createElement("TD");

    // Fill the cells with correct data
    customerIDCell.innerText = newRow.customerID;
    firstNameCell.innerText = newRow.firstName;
    lastNameCell.innerText = newRow.lastName;
    emailAdressesCell.innerText = newRow.emailAddress;
    addressCell.innerText = newRow.address;
    cityCell.innerText = newRow.city;

    // Add the cells to the row 
    row.appendChild(customerIDCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(emailAdressesCell);
    row.appendChild(addressCell);
    row.appendChild(cityCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
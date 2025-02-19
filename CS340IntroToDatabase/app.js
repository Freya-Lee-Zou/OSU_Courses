/* ======================SETUP=====================*/
// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
PORT = 9053;
// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({
    defaultLayout:"main",
    extname: ".hbs"

}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters an *.hbs file.
// Static Files

app.use(express.static(__dirname + '/public')); 
app.use(express.static(__dirname + '/js'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/home.html');
  });



/*====================ROUTES===========================*/
app.post('/searchCustomer', function(req, res)
{
    // Declare Query 1

    // let query1;
    let userInput = req.body.lname

    if (userInput === undefined)
    {

        query1 = `SELECT 
                 * FROM Customers;`
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * 
                FROM Customers 
                WHERE lastName LIKE "${userInput}%";`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Use the data to render the HTML page
        
        let customer = rows;
        res.render('customers', {data:customer});
        
    })
});


app.post("/deleteCustomer",function(req,res){
    let userInput1 = req.body
    let data = userInput1['delete-customer']
    console.log("userinput1",data)
    if (data === undefined){
        query1 = `SELECT 
        * FROM Customers;`
    }else{
        query1 = `DELETE 
                       FROM Customers
                       WHERE customerID = ${data};`
     }
     //Run query
     db.pool.query(query1, function(error, rows, fields){
        // Save the customer
        return res.redirect('customers')
    })

})

app.post("/deleteOrder",function(req,res){
    let userInput1 = req.body
    let data = userInput1['delete-order']
    console.log("userinput1",data)
    if (data === undefined){
        queryDeleteOrder = `SELECT 
        * FROM Orders;`
    }else{
        queryDeleteOrder = `DELETE 
                       FROM Orders
                       WHERE orderID = ${data};`
     }
     //Run query
     db.pool.query(queryDeleteOrder, function(error, rows, fields){
        // Save the customer
        return res.redirect('/orders')
    })

})


// delete an item
app.post("/deleteItem",function(req,res){
    let deleteItemVal = req.body
    let data = deleteItemVal['input-item']
    console.log("deleteItemVal",deleteItemVal)
    if (data === undefined){
         queryDeleteItem = `SELECT 
        * FROM Items;`
    }else{
         queryDeleteItem = `DELETE 
                       FROM Items
                       WHERE itemID = ${data};`
     }
     //Run query
     db.pool.query(queryDeleteItem, function(error, rows, fields){
        // Save the customer
        return res.redirect('/items')
    })

})




  

//POST ROUTES
app.post('/add-person-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log("recived data:",data)

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (firstName, lastName, emailAddress, address,city) VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-emailAdresses']}','${data['input-address']}', '${data['input-city']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error && error.sqlState === '45000'){
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(404).render('error', {
                page: req.url,
                errorContent:"Invalid email address format. Please provide a valid email address in the format user@example.com"
            });
        }
        else if (error && error.sqlState === '43000'){
            console.log(error)
            res.status(404).render('error', {
                page: req.url,
                errorContent:"Email address already exists. Please provide a unique email address."
            });
        }else
        {
            res.redirect('/');
        }
    })
})

app.post('/update-order-form', function(req,res,next){
    let data = req.body;
    console.log("data in update order from", data)
    let OrderIDVal = data["input-orderID"];
    let CustomerIDVal= data["input-customerID"];
    let orderDateVal = data['input-orderDate'];
    let creditCarNumbVal = data['input-creditCardNumb'];
    let creditCardExpDateVal = data['input-creditCardExpDate'];
    let numbOrderedItemVal = data['input-numOrderedItems'];
    let pricePaidVal = data['input-pricePaid'];
    
    let queryUpdateOrder = `UPDATE Orders 
                            SET orderDate = "${orderDateVal}",
                            creditCardNumb = "${creditCarNumbVal}", 
                            creditCardExpDate = "${creditCardExpDateVal}", 
                            numOrderedItems= "${numbOrderedItemVal}",
                            pricePaid = "${pricePaidVal}"
                            WHERE orderID = ${OrderIDVal} AND customerID = ${CustomerIDVal}`;
    
          // Run the 1st query
    db.pool.query(queryUpdateOrder, function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {    
            res.redirect('orders');       
        }
    })

});







//POST ROUTES
app.post('/add-order-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log("recived data:",data)

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customerID, orderDate, creditCardNumb, creditCardExpDate,numOrderedItems,pricePaid) VALUES ('${data['input-customerID']}', '${data['input-orderDate']}', '${data['input-creditCardNumb']}','${data['input-creditCardExpDate']}', '${data['input-numOrderedItems']}','${data['input-pricePaid']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(404).render('error', {
                page: req.url,
            });
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/orders');
        }
    })
})


app.post('/add-item-form',function(req,res){
     // Capture the incoming data and parse it back to a JS object
     let data = req.body;
     console.log("recived data from  add order form:",data)
     // Create the query and run it on the database
     inserItems = `INSERT INTO Items (reviewID, categoryID, itemName, price) VALUES ('${data['input-reviewID']}', '${data['input-categoryID']}', '${data['input-item-name']}','${data['input-price']}')`;
     db.pool.query(inserItems, function(error, rows, fields){
 
         // Check to see if there was an error
         if (error) {
             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
             console.log(error)
             res.status(404).render('error', {
                 page: req.url,
             });
         }
         else{
            res.redirect('/items');
         }
     })


})

// POST ROUTE
app.post('/add-review-form',function(req,res){
    let data = req.body;
     console.log("recived data from  add-review-from form:",data)
     // Create the query and run it on the database
     inserItems = `INSERT INTO Reviews (customerID, overallRating, feedback) VALUES('${data['input-customerID']}', '${data['input-overall-rating']}', '${data['input-feedback']}')`;
     db.pool.query(inserItems, function(error, rows, fields){
         // Check to see if there was an error
         if (error) {
             console.log(error)
             res.status(404).render('error', {
                 page: req.url,
             });
         }
         else{
            res.redirect('/reviews');
         }
     })


})


app.post('/add-category-form',function(req,res){
    let data = req.body;
    console.log ("data recevied in the add category form: ",data)
    categoryQuery = `INSERT INTO Categories(categoryName) VALUES('${data.categoryName}')`;
    db.pool.query(categoryQuery, function(error, rows, fields){
        // Check to see if there was an error
        if (error){
            console.log(error)
            res.status(404).render('error', {
                errorTitle: "opps! page cant be found" 
            });
        }else{
           res.redirect('/categories');
        }
          
     });

});

app.post('/update-item', function(req,res,next){
    let data = req.body;
    console.log("data in update order from", data)
    let itemIDVal = data["update-itemID"];
    let reviewIDVal= data["update-reviewID"];
    let categoryIDVal = data['update-categoryID'];
    let itemNameVal = data['input-item-name'];
    let priceVal = data['input-price'];
    
    let queryUpdateItem = `UPDATE Items 
                            SET itemName = "${itemNameVal}",
                            price = "${priceVal}"
                            WHERE itemID = ${itemIDVal } AND reviewID = ${reviewIDVal} AND categoryID = ${categoryIDVal}`;
    
          // Run the 1st query
    db.pool.query(queryUpdateItem, function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {    
            res.redirect('items');       
        }
    })

});







app.get('/customers',function(req,res){
   
    query1 = "SELECT * FROM Customers;";
    db.pool.query(query1, function(error, rows, fields){
        
        // Use the data to render the HTML page
        let customer = rows;
        res.render('customers', {data:customer});  
    })
     
 });


 app.get('/orders',function(req,res){
   
    query1 = "SELECT orderID, customerID, DATE_FORMAT(orderDate, '%b %e, %Y') as orderDate, creditCardNumb, DATE_FORMAT(creditCardExpDate, '%b %e, %Y') as creditCardExpDate, numOrderedItems, pricePaid FROM Orders;"
    
    CustomerQU2 = "SELECT * FROM Customers;"

    db.pool.query(query1, function(error, orders, fields){
          
        db.pool.query(CustomerQU2,function(error,customer,fields){
                
           
            res.render(
                'orders',{orders:orders,
                customers:customer}
             );     
        })
       
    })
     
 });


 app.get('/items',function(req,res){
   
    queryReview = "SELECT * FROM Reviews;"
    queryCategory = "SELECT * FROM Categories"
    queryItems = "SELECT * FROM Items;"
    db.pool.query(queryReview, function(error, reviewRows, fields){
        db.pool.query(queryCategory, function(error, categoryRows, fields){
            db.pool.query(queryItems, function(error, itemrows, fields){  
               if (error){

               }else{
                res.render('items', {
                    Reviews:reviewRows,
                    Categories: categoryRows,
                    Items: itemrows
                });  
               }
                
            })

        })
       
    })
     
 });


 app.get('/categories',function(req,res){
   
    query4 = "SELECT * FROM Categories;";
    db.pool.query(query4, function(error, rows, fields){
        
        // Use the data to render the HTML page
        let categories = rows;
        res.render('categories', {data:categories});  
    })
     
 });


 app.get('/reviews',function(req,res){
   
    queryReview = "SELECT * FROM Reviews;";
    queryCustomer = "SELECT * FROM Customers;"
    db.pool.query( queryReview, function(error, reviewRows, fields){
        
        db.pool.query(queryCustomer , function(error, customerRows, fields){
            
            res.render('reviews', {Reviews:reviewRows,
                Customers: customerRows
            }); 
        })
         
    })
     
 });


 app.get('/',function(req,res){
   
    res.render('home',{title: "Home Page",
        path:"./public/img/OSU_symbol.jpeg"

    });  
    
 });


/*=============================LISTENER=========================*/
app.listen(PORT, function () {
    console.log("express start to listen:",PORT + '; press Ctrl-C to terminate.');
});


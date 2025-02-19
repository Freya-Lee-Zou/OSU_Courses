-- ************************************************************************
--                         Requirment
-- We have 5 tables( Categories, Cutstomers, Items, Orders, Reviews) and 1 composite table(ordersItem): we need to  implement 3 SELECTS, 5 INSERTS, 1 update(M:N),1 DELETE (M:N; )causing no data anomalies), 1 NULLable relationship, and 1 Search/Dynamic for a total of 14 functions.
-- *************************************************************************


-- *************************************************************************
--                      Select Statements
-- ************************************************************************

-- =========Seletc Statements for displaying sample data on different pages
SELECT *
FROM Customers;

SELECT *
FROM Categories 
WHERE;

SELECT *
FROM Items 
WHERE;

SELECT orderID, customerID, DATE_FORMAT(orderDate, '%b %e, %Y') as orderDate, creditCardNumb, DATE_FORMAT(creditCardExpDate, '%b %e, %Y') as creditCardExpDate, numOrderedItems, pricePaid 
FROM Orders;

SELECT * 
FROM Reviews;

-- Select for the Dinamically search on the Customers page 
SELECT * 
FROM Customers 
WHERE lastName LIKE ${req.query.lastName}%;


-- *************************************************************************
--                      Insert Statements
-- ************************************************************************
INSERT INTO Customers (firstName, lastName, emailAddress, address,city) 
VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-emailAdresses']}','${data['input-address']}', '${data['input-city']}');

INSERT INTO Categories(categoryName)
VALUES
(:categoryName_input);

INSERT INTO Items (reviewID, categoryID, itemName, price) 
VALUES ('${data['input-reviewID']}', '${data['input-categoryID']}', '${data['input-item-name']}','${data['input-price']}');

 INSERT INTO Orders (customerID, orderDate, creditCardNumb, creditCardExpDate,numOrderedItems,pricePaid) 
 VALUES ('${data['input-orderID']}', '${data['input-orderDate']}', '${data['input-creditCardNumb']}','${data['input-creditCardExpDate']}', '${data['input-numOrderedItems']}','${data['input-pricePaid']}');

INSERT into Reviews(customerID, overallRating, feedback)
VALUES
(:customerID_input_dropdown, overallRating_input, feedback_input);

-- --------------------------------------------------------------------------------------------
-- ---------------------------------DeleteStatements------------------------------------------

DELETE from Items where itemName = :itemName_input;
Update orderItems
set itemID, totalNumItems = NULL
where itemID = (select itemID from Items where itemName = :itemName_input)

DELETE FROM Categories
WHERE categoryID = :categoryID_input_dropdown;

DELETE FROM Customers
WHERE customerID = :customerID_input_dropdown;


-- --------------------------------------------------------------------------------------------
-- -----------------------------Update  Statements---------------------------------------------

update Customers
set address = :address_input
where customerID  = :customerID_input_dropdown


-- filter Reviews

select * from Reviews 
where overallRating >= :overallRating_input_dropdown
and
overallRating < (:overallRating_input_dropdown + 1)












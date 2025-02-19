 -- We have 5 tables( Categories, Cutstomers, Items, Orders, Reviews) and 1 composite table(ordersItem):

-- create Customers table 
DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
    customerID INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    emailAddress VARCHAR(50),
    address VARCHAR(50),
    city VARCHAR(50),
    PRIMARY KEY (customerID)
);
ALTER TABLE Customers
AUTO_INCREMENT = 1000;

-- create table Reviews
DROP TABLE IF EXISTS Reviews;
CREATE TABLE Reviews (
    reviewID INT NOT NULL AUTO_INCREMENT,
    customerID INT,
    overallRating DECIMAL(3,2),
    feedback VARCHAR(200),
    PRIMARY KEY (reviewID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID)ON DELETE SET NULL
);
ALTER TABLE Reviews
AUTO_INCREMENT = 100;

-- create table Orders
DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders (
    orderID INT NOT NULL AUTO_INCREMENT,
    customerID INT(11),
    orderDate DATE,
    creditCardNumb INT,
    creditCardExpDate DATE,
    numOrderedItems int(9),
    pricePaid int,
    PRIMARY KEY (orderID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) on delete cascade
);
ALTER TABLE Orders
AUTO_INCREMENT = 10000;


-- create Categories table
DROP TABLE IF EXISTS Categories;
CREATE TABLE Categories (
    categoryID INT NOT NULL AUTO_INCREMENT,
    categoryName VARCHAR(50),
    PRIMARY KEY (categoryID)
);
ALTER TABLE Categories
AUTO_INCREMENT = 500;


-- create Items table 
DROP TABLE IF EXISTS Items;
CREATE TABLE Items (
    itemID INT NOT NULL AUTO_INCREMENT,
    reviewID INT,
    categoryID int,
    itemName VARCHAR(50),
    price INT(9),
    PRIMARY KEY (itemID),
    FOREIGN KEY (reviewID) REFERENCES Reviews(reviewID)on delete cascade,
    FOREIGN KEY (categoryID) REFERENCES Categories(categoryID)on delete SET NULL
);
ALTER TABLE Items
AUTO_INCREMENT = 30;

-- create tbale orderItems
DROP TABLE IF EXISTS orderItems;
CREATE TABLE ordersItems (
    orderID INT,
    itemID INT,
    totalNumItems int,
    PRIMARY KEY (orderID, itemID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)on delete cascade,
    FOREIGN KEY (itemID) REFERENCES Items(itemID)on delete cascade
);

-- -----------------------------Inserting Values-------------------------------
INSERT into Customers(firstName,lastName, emailAddress,address, city)
VALUES
    ('Jack','Spring','JackSprin23g@hello.com','123NW lane dr', 'corvallis'),
    ('Alice','Summer','AliceSummer@helllo.com', 'sw ln dr 1256','Salem'),
    ('Iris','Winter','IrisWinter@hello.com','420 Database Cr', 'Portland');


INSERT INTO Reviews (customerID, overallRating, feedback)
VALUES
    ((SELECT CustomerID FROM Customers WHERE firstName = 'Jack' AND lastName = 'Spring'), 4.8, 'excellent'),
    ((SELECT CustomerID FROM Customers WHERE firstName = 'Alice' AND lastName = 'Summer'), 1.3, 'bad'),
    ((SELECT CustomerID FROM Customers WHERE firstName = 'Iris' AND lastName = 'Winter'), 3.3, 'good');


INSERT INTO Orders (customerID,	orderDate,	creditCardNumb,	creditCardExpDate,numOrderedItems,pricePaid) 
VALUES
    ((SELECT CustomerID FROM Customers WHERE firstName = 'Jack' AND lastName = 'Spring'),'2019-02-02', 1234567, '2021-02-16',2, 1628),
    ((SELECT CustomerID FROM Customers WHERE firstName = 'Jack' AND lastName = 'Spring'),'2019-02-02', 1234567, '2021-02-16',2, 1628),
    ((SELECT CustomerID FROM Customers WHERE firstName = 'Alice' AND lastName = 'Summer'),'2018-10-12', 1234568, '2023-04-13',1, 629),
    ((SELECT CustomerID FROM Customers WHERE firstName = 'Iris' AND lastName = 'Winter'),'2017-02-15', 1234569, '2021-09-07',1, 729);

INSERT INTO Categories (categoryName)
VALUES
    ('Ipads'),
    ('Phones'),
    ('Laptops');

INSERT INTO Items (reviewID,categoryID,itemName,price)
VALUES
    ((SELECT reviewID FROM Reviews WHERE feedback = 'excellent'),
     (SELECT categoryID FROM Categories WHERE categoryName = 'Ipads'), 'ipad', 729),
     
    ((SELECT reviewID FROM Reviews WHERE feedback = 'good'),
     (SELECT categoryID FROM Categories WHERE categoryName = 'Phones'), 'phone', 629),
     
    ((SELECT reviewID FROM Reviews WHERE feedback = 'bad'), 
     (SELECT categoryID FROM Categories WHERE categoryName = 'Laptops'), 'laptop', 999);


INSERT INTO ordersItems (orderID, itemID, totalNumItems)
SELECT o.orderID, i.itemID, totalNumItems
FROM Orders o
JOIN Items i ON o.creditCardNumb IN (1234567, 1234568, 1234569) AND i.itemName IN ('laptop', 'ipad')
JOIN (
    SELECT 1234567 AS creditCardNumb, 43 AS totalNumItems
    UNION ALL
    SELECT 1234568, 56
    UNION ALL
    SELECT 1234569, 96
) AS t ON o.creditCardNumb = t.creditCardNumb AND i.itemName = (
    CASE 
        WHEN o.creditCardNumb = 1234567 THEN 'laptop'
        WHEN o.creditCardNumb = 1234568 THEN 'ipad'
        WHEN o.creditCardNumb = 1234569 THEN 'laptop'
    END
) AND totalNumItems = t.totalNumItems;


-- Define the trigger
DELIMITER //

CREATE TRIGGER validateUniqueEmail
BEFORE INSERT ON Customers
FOR EACH ROW
BEGIN
    DECLARE emailPattern VARCHAR(255);
    SET emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$';
    
    IF NEW.emailAddress NOT REGEXP emailPattern THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email address must be in a valid format';
    ELSEIF EXISTS (
        SELECT 1
        FROM Customers
        WHERE emailAddress = NEW.emailAddress
    ) THEN
        SIGNAL SQLSTATE '43000'
        SET MESSAGE_TEXT = 'Email address must be unique';
    END IF;
END;//

DELIMITER ;




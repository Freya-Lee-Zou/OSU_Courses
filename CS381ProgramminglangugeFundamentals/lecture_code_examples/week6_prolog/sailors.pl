boat(101, interlake, pink).
boat(102, interlake, red).
boat(103, clipper, green).
boat(104, marine, red).
reserves(21, 101, feb0122).
reserves(21, 102, feb0522).
reserves(21, 103, feb1622).
reserves(21, 104, jan1222).
reserves(21, 104, feb1122).
reserves(31, 101, jan0722).
reserves(31, 103, feb0822).
reserves(31, 104, feb2122).
reserves(64, 104, jan1222).
reserves(64, 102, dec1221).
reserves(74, 103, dec2221).
sailor(21, dustin, 7, 45).
sailor(29, brutus, 1, 31).
sailor(31, lubber, 8, 56).
sailor(32, andy, 8, 25).
sailor(58, rusty, 10, 35).
sailor(64, horatio, 7, 35).
sailor(74, horatio, 9, 38).
sailor(99, art, 3, 25).

# predicates
nameage(Name, Age) :- sailor(_,Name,_,Age).
nameboatdate(Name,Boat,Date):-sailor(Sid,Name,_,_),reserves(Sid,Bid,Date),boat(Bid,Boat,_).
nameboat(Sname,Boat):-sailor(Sid,Sname,Rating,_),reserves(Sid,Bid,_),boat(Bid,Boat,_)

redorpink(Name) :- sailor(Sid,Name,_,_),reserves(Sid,Bid,_),boat(Bid,_,red).
redorpink(Name) :- sailor(Sid,Name,_,_),reserves(Sid,Bid,_),boat(Bid,_,pink).
redandpink(Name) :- sailor(Sid,Name,_,_),reserves(Sid,Bid1,_),boat(Bid1,_,pink),reserves(Sid,Bid2,_),boat(Bid2,_,red).


twice(Name,Boat) :- sailor(Sid,Name,_,_),reserves(Sid,Bid,Date1),boat(Bid,Boat,_),reserves(Sid,Bid,Date2), Date1 \= Date2.

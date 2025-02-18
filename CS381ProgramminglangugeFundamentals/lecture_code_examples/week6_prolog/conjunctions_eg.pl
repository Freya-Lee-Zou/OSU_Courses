successor(1,2).
successor(2,3).
successor(3,4).
successor(5,6).
lessT(X,Y): - successor(X,Y).
lessT(X,Y): - successor(Z,Y), lessT(X,Z).

it[1,2]
it[2,3]
it[3,4]
color(red).
color(blue).
color(green).
likes(john,red).
likes(mary,red).
likes(john,mary).
likes(mary,steve).
isRich(john).
isRich(mary).

marry(X,Y):- likes(X,Y), likes(Y,X). # :- it denotes if
marry(X,Y):- likes(X,Y), isRich(Y).
friends(X,Y): -likes(X,Z), likes(Y,Z).
before(X,Y): -successor(X,Y).
before(X,Y): -successor(X,Z),before(Z,Y)

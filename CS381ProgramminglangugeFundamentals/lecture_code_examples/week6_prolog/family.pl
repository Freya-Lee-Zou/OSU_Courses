male(tywin).
male(jaime).
male(tyrion).
male(joffrey).
male(tommen).

female(joanna).
female(cersei).
female(myrcella).

parent(tywin,jaime).
parent(tywin,cersei).
parent(tywin,tyrion).
parent(joanna,jaime).
parent(joanna,cersei).
parent(joanna,tyrion).
parent(jaime,joffrey).
parent(jaime,tommen).
parent(jaime,myrcella).
parent(cersei,joffrey).
parent(cersei,tommen).
parent(cersei,myrcella).


father(X,Y)      :- parent(X,Y), male(X).
mother(X,Y)      :- parent(X,Y), female(X).
grandfather(X,Y) :- father(X,Z), parent(Z,Y).
grandmother(X,Y) :- mother(X,Z), parent(Z,Y).

child(X,Y)    :- parent(Y,X).
son(X,Y)      :- child(X,Y), male(X).
daughter(X,Y) :- child(X,Y), female(X).


/* */


grandchild(X,Y)    :- child(X,Z), child(Z,Y).
grandson(X,Y)      :- grandchild(X,Y), male(X).
granddaughter(X,Y) :- grandchild(X,Y), female(X).


/* */


ancestor(X,Y) :- parent(X,Y).
ancestor(X,Y) :- parent(X,Z), ancestor(Z,Y).


/* will not terminate after last response */
ancestor2(X,Y) :- parent(X,Y).
ancestor2(X,Y) :- ancestor2(Z,Y), parent(X,Z).


/* will not terminate at all */
ancestor3(X,Y) :- ancestor3(Z,Y), parent(X,Z).
ancestor3(X,Y) :- parent(X,Y).


/* */


sibling(X,Y) :- parent(Z,X), parent(Z,Y), X\=Y.
brother(X,Y) :- sibling(X,Y), male(X).
sister(X,Y) :- sibling(X,Y), female(X).


/* */


aunt(X,Y) :- parent(Z,Y), sister(X,Z), \+ parent(X,Y).
uncle(X,Y) :- parent(Z,Y), brother(X,Z), \+ parent(X,Y).


/* */



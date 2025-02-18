likes(mary,X) :- animal(X), not(snake(X)).

animal(dog).
animal(python).

snake(python).




/*

The built-in negation predicate "not" is defined
as follows. We are using "noT" to avoid a conflict
with the built-in predicate.

*/

noT(P) :- P, !, fail.
noT(P).

/*

Try several predicates and their negation

noT(3=4).

noT(3=3).

noT(X=4).

noT(fail).

*/

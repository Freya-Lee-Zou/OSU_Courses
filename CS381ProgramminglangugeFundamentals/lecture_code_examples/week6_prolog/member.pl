/* member0(_,[])    :- fail. */
member0(X,[X|_]).
member0(X,[_|Y]) :- member0(X,Y).

member1(X,[X|_]) :- !.
member1(X,[_|Y]) :- member1(X,Y).

member2(X,[X|_]).
member2(X,[_|Y]) :- member2(X,Y), !.

member3(X,[X|_]).
member3(X,[_|Y]) :- true, !, member3(X,Y).


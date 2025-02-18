story([3, little, pigs]).
story([maskateers]).
story([and, 3, bears]).



del(_, [], []).
del(X, [X|L], L).
del(X, [Y|L], [Y|M]) :- X\=Y, del(X, L, M).
/*
del(X, [Y|L], [Y|M]) :- X\=Y, del(X, L, M).
*/


delAll(_, [], []).
delAll(X, [X|L], M) :- delAll(X,L,M). 
delAll(X, [Y|L], [Y|M]) :-  X\=Y, delAll(X, L, M).



delOne(X,    [],    [])    :- X\=s(Y).
delOne(X,    [X|L], L).
delOne(s(X), [X|L], L).
delOne(X,    [Y|L], [Y|M]) :- X\=Y, delOne(X, L, M).
delOne(s(X), [Y|L], [Y|M]) :- X\=Y, delOne(s(X), L, M).
delOne(X,    [X|L], [X|M]) :- delOne(s(X), L, M).



sublist(S, L) :- append(L1, L2, L), append(S, L3, L2).



lenT([],0).
lenT([_|L], N+1) :- lenT(L, N).



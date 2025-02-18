fac(1,1).
fac(N,M) :- K is N - 1, fac(K,L), M is L * N.

edge(a,b).
edge(a,e).
edge(b,d).
edge(d,c).
edge(c,d).
edge(e,d).
dpath(X,Y):-edge (X,Y).
dpath(X,Y):-edge(X,Z),dpath(Z,Y).




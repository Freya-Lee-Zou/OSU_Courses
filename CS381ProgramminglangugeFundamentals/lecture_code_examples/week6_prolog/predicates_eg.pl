# % Predicates

human(john). 
human(julie).
human(amy).
human(pat).
human(socrates).

cat(trigger).
cat(trigrt).
cat(tasha).
cat(victoria).
dog(goldie).
dog(ginger).
dog(max).
horse(fella).

companion(chris, goldie).
companion(amy, trigger).
companion(julie, trigger).
companion(pat, max).
companion(tiger, trigger).

parent(john, amy).
parent(goldie, max).

% Sibling predicate:
dogperson(A) :- companion(A, B), dog(B).
dogperson(A) :- companion(A, B), cat(B), human(A).
notcat(A) :- \+catperson(A).
mortal(X) :- human(X).
mortal(X) :- cat(X).

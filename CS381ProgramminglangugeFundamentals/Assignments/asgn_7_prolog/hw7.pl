/* course(course_number, course_name, credits) */

course(cs101,python, 2).
course(mth210, calculusI, 5).
course(cs120, web_design, 3).
course(cs200, data_structures, 4).
course(cs210, algorithms, 4).
course(wrt101, basic_writing, 3).

/* section(CRN, course_number) */

section(1522,cs101).
section(1122,cs101).
section(2322,mth210).
section(2421,cs120).
section(8522,mth210).
section(1621,cs200).
section(7822,mth210).
section(2822,cs210).
section(3522,wrt101).

/* place( CRN, building, time) */

place(1522,owen102,10).
place(1122,dear118,11).
place(2322,with210,11).
place(2421,cov216,15).
place(8522,kec1001,13).
place(1621,cov216,14).
place(7822,kec1001,14).
place(2822,owen102,13).
place(3522,with210,15).

/* enroll(sid, CRN) */

enroll(122,1522).
enroll(122,8522).
enroll(150,1522).
enroll(150,2421).
enroll(212,7822).
enroll(300,2822).
enroll(300,8522).
enroll(310,3522).
enroll(310,8522).
enroll(310,1621).
enroll(175,2822).
enroll(175,7822).
enroll(175,3522).
enroll(410,1621).
enroll(410,7822).
enroll(113,3522).

/* student(sid, student_name, major) */

student(122, mary, cs).
student(150, john, math).
student(212, jim, ece).
student(300, lee, cs).
student(310, pat, cs).
student(175, amy, math).
student(410, john, cs).
student(113, zoe, ece).


/******** Problem 1: Database Application**********/ 

/* S-> sid, C->courseName  CRN-> CRN, courseNum ->M, B->building*/
/* a) */
schedule(S, C, B, T) :- enroll(S, CRN), section(CRN,M), course(M, C, _), place(CRN, B, T).

/* b) */
schedule(S, N, C) :- student(S, N, _), enroll(S, CRN), section(CRN, M), course(M, C, _).

/* c) */
offer(M,N, CRN, T) :- course(M,N, _), section(CRN, M), place(CRN, _, T).

/* d) */ 
conflict(Sid, CRN1, CRN2) :-
  enroll(Sid, CRN1),
  enroll(Sid, CRN2),
  CRN1 \= CRN2,
  place(CRN1, _, Time),
  place(CRN2, _, Time).

/* e) */ 
meet(S1,S2) :- enroll(S1,C), enroll(S2,C), S1 \= S2;
               enroll(S1,C1), enroll(S2,C2), place(C1,B,T1), place(C2,B,T2), succ(T1,T2), S1 \= S2.
    

/* f) */ 

roster(CRN, Student_name) :-
    section(CRN, _),
    enroll(Student_id, CRN),
    student(Student_id, Student_name, _).


/* g) */ 
highCredits(Cname) :-
    course(_, Cname, Credits),
    Credits >= 4.


/******** Problem 2: List Predicates and Arthmetic**********/    

/* 2a) */ 
rdup([],[]).
rdup([X|Xs], Out) :- member(X, Xs), !, rdup(Xs, Out).
rdup([X|Xs], [X|Out]) :- rdup(Xs, Out).


/* 2b) */ 
flat([], []).
flat([X|Xs], F) :- is_list(X),flat(X, G),flat(Xs, H),append(G, H, F).
flat([X|Xs], [X|F]) :- \+ is_list(X),flat(Xs, F).




/* 2c) */ 
project(_,[],[]) :- !.
project([1|I], [L|Ls], R) :- !, append([L],Rs,R), subOneList(I,Is), project(Is, Ls, Rs).
project(I,[_|Ls],R) :- subOneList(I,Is), project(Is, Ls, R).

subOneList(Xs, Ys) :- maplist(decElem, Xs, Ys).
decElem(X, Y) :- Y is X-1.
import Stacklang1
-- Student Name: Ya Zou
-- Part 1: Stack Language Part 1

-- LD Int – loads its integer parameter onto the stack.
--  ADD – removes the two topmost integers from the stack and puts their sum onto the stack. If the stack contains fewer than two elements, ADD produces an error.
-- MULT – removes the two topmost integers from the stack and puts their product onto the stack. If the stack contains fewer than two elements, MULT produces an error.
--  DUP – places a copy of the stack’s topmost element on the stack. If the stack is empty then   DUP produces an error.


type Prog = [Cmd] 

type Stack = [Int]

data Cmd = LD Int
      | ADD
      | MULT
      | DUP 
      deriving Show



semCmd :: Cmd ->Stack -> Maybe Stack


semCmd (LD n ) s  = Just (n:s)

semCmd ADD  []           = Nothing
semCmd ADD  (x :[])      = Nothing
semCmd ADD  (x : y : s)  = Just ((x+y):s)

semCmd MULT []           = Nothing
semCmd MULT (x:[])       = Nothing
semCmd MULT (x: (y:s))    = Just ((x*y):s)


semCmd DUP [] = Nothing
semCmd DUP  (x:s)     = Just (x:(x:s))




run :: Prog -> Stack -> Maybe Stack
run []        s = Just s
run (c:cs) s = case semCmd c s of
                  Nothing -> Nothing
                  Just s' -> run cs s'


-- *****************Test Cases************
-- stack1 = [1, 2, 3, 4, 5]                 
-- test1 = [LD 3,DUP,ADD,DUP,MULT] 
-- test2 = [LD 3,ADD]
-- test3 = []
-- test4 = [ADD, ADD, ADD, ADD]

-- run test1 []
-- run test1 stack1
-- run test2 stack1
-- run test3 stack1
-- run test4 []
-- run test4 stack1

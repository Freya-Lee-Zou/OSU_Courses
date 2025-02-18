-- This implementation assumes that the expressions are well-formed and do not raise any errors or exceptions. It also uses integer values as booleans, which can be a bit confusing and is not a standard practice. A more common approach would be to use the Bool type for boolean values.
-- Therefore it is not safe language




-- 
-- Two-Type Expression Language
--
module Expr2Unsafe where

data Expr = N Int
          | Plus Expr Expr
          | Equal Expr Expr
          | Not Expr
          deriving Show


-- Some examples expressions are:
--
x = N 2
y = Plus (N 3) (Plus (N 4) (N 5))
z = Not (Equal (Plus (N 1) (N 1)) (N 2))


-- Unsafe evaluator maps into integers
--
eval :: Expr -> Int
eval (N i)        = i
eval (Plus e e')  = eval e+eval e'
eval (Equal e e') | eval e == eval e' = 1
                  | otherwise         = 0
eval (Not e)      | eval e==0 = 1 -- 1 and 0 used as boolean value, if e == 0 then make it equal to 1
                  | otherwise = 0


false = N 1 `Equal` N 2
myTrue = N 2

e1 = Not myTrue
e2 = e1 `Plus` N 1
e3 = myTrue `Equal` Not (Not myTrue)


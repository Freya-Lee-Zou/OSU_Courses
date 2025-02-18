-- 
-- Two-Type Expression Language
--
module Expr2 where

data Expr = N Int      --  one I type
          | Plus Expr Expr  -- two I types
          | Equal Expr Expr  -- two I or two B
          | Not Expr    --  one boolean
          deriving Show


-- Some examples expressions
--
x = N 2
y = Plus (N 3) (Plus (N 4) (N 5))

-- check if N1 + N 2 equals to N2, return true or flase
z = Not (Equal (Plus (N 1) (N 1)) (N 2))

-- Not is expecting a boolean type
typeError = Not (N 2)



-- A data type to represent the union type of
-- semantic values
-- 
data Val = I Int
         | B Bool
         deriving Show

-- Semantics maps into union type
-- No error handling yet.
--
sem :: Expr -> Val
-- if  i = 3 then return i3
sem (N i)        = I i
-- sem(Plus) takes two value and if they are integers, adds up
sem (Plus e e')  = case (sem e,sem e') of
                     (I i,I j) -> I (i+j)

--                    
sem (Equal e e') = case (sem e,sem e') of
                     (I i,I j) -> B (i==j)
                     (B b,B c) -> B (b==c)
sem (Not e)      = case sem e of
                     B b  -> B (not b)


-- A semantics definition is like a language interpreter.
-- The following interpreter uses local where definitions 
-- to perform a minimal form of dynamic type checking.
--
eval :: Expr -> Val
eval (N i)        = I i
eval (Plus e e')  = I (int x+int y)   where (x,y) = (eval e,eval e')
eval (Equal e e') = B (int x==int y)  where (x,y) = (eval e,eval e')
eval (Not e)      = B (not (bool x))  where x = eval e

-- int (bool) forces its argument value to be Int (or Bool).
-- If the value is not an Int (or Bool), the function fails
--
int :: Val -> Int
int (I i) = i
int v     = error ("Value "++show v++" is not an integer")

bool :: Val -> Bool
bool (B b) = b
bool v     = error ("Value "++show v++" is not a boolean")


-- The error messages for type errors are based on the 
-- values only and do not indicate the source of error.
--
-- We can implement an interpreter with slightly better 
-- error reporting by putting the type expectation into 
-- the evaluator directly so that the original expressions 
-- can be exploited as context in error messages.
--
evalI :: Expr -> Int
evalI (N i)       = i
evalI (Plus e e') = evalI e+evalI e'
evalI e           = error ("Expression "++show e++
                           " does not evaluate to an integer") 

evalB :: Expr -> Bool
evalB (Equal e e') = evalI e==evalI e'
evalB (Not e)      = not (evalB e)
evalB e            = error ("Expression "++show e++
                           " does not evaluate to a boolean") 

-- Dynamic type checker :  
-- if N is integer then I is integer
-- if e and e' are not integer then though an error, therefore it only evaluate two integers
-- if two integer are equal.
  
evalDynTC :: Expr -> Val
evalDynTC (N i)        = I i
evalDynTC (Plus e e')  = I (evalI e+evalI e')
evalDynTC (Equal e e') = B (evalI e==evalI e')
evalDynTC (Not e)      = B (not (evalB e))

e1 = N 2 `Equal` N 2
e2 = N 1 `Equal` e1
e3 = Not (N 2 `Plus` N 2)





-- Running Record
-- ghci> x
-- N 2
-- ghci> sem y
-- I 12
-- ghci> z
-- Not (Equal (Plus (N 1) (N 1)) (N 2))
-- ghci> sem z
-- B False
-- ghci> let w = Plus y z
-- ghci> w
-- Plus (Plus (N 3) (Plus (N 4) (N 5))) (Not (Equal (Plus (N 1) (N 1)) (N 2)))
-- ghci> sem w 
-- *** Exception: Expr2.hs:(40,20)-(41,41): Non-exhaustive patterns in case
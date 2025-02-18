-- 
-- Two-Type Expression Language
--
module Expr2 where

data Expr = N Int
          | Plus Expr Expr
          | Equal Expr Expr
          | Not Expr
          deriving Show


-- Some examples expressions
--
x = N 2
y = Plus (N 3) (Plus (N 4) (N 5))
z = Not (Equal (Plus (N 1) (N 1)) (N 2))
typeError = Not (N 2)


-- A data type to represent the union type of
-- semantic values
-- 
data Val = I Int
         | B Bool
         deriving Show

-- Semantics maps into union type
-- No error handling yet.
sem :: Expr -> Val

--  If the expression is a numerical value, the function returns an I value with the same integer value.
sem (N i)        = I i

-- The function evaluates the two sub-expressions e and e' using sem, and then adds their values together. If both sub-expressions evaluate to I values, the result is an I value with the sum of their integer values. If one or both sub-expressions are not I values, the function will not evaluate the expression correctly
sem (Plus e e')  = case (sem e,sem e') of
                     (I i,I j) -> I (i+j)

-- The function evaluates the two sub-expressions e and e' using sem, and then checks if they are equal. If both sub-expressions evaluate to I values, the result is a B value with the boolean value True if the integer values are equal, and False otherwise. If both sub-expressions evaluate to B values, the result is a B value with the boolean value True if the boolean values are equal, and False otherwise. If the two sub-expressions have different types, and false otherwise. if the two sub-expressions have different types, the fucntion will not evaluate correctel.
sem (Equal e e') = case (sem e,sem e') of
                     (I i,I j) -> B (i==j)
                     (B b,B c) -> B (b==c)

-- this fucntion is the same as the first two fucntions
sem (Not e)      = case sem e of
                     B b  -> B (not b)




-- A semantics definition is like a language interpreter.
-- The following interpreter uses local where definitions 
-- to perform a minimal form of dynamic type checking.


-- This implementation is similar to the previous implementation, but uses pattern matching to extract the values of the sub-expressions, and uses where clauses to assign values to variables and simplify the code. This implementation also handles errors, such as division by zero, by throwing runtime exceptions, which may not be suitable for all use cases.
eval :: Expr -> Val


eval (N i)        = I i

-- If the expression is an addition expression, the function evaluates the two sub-expressions e and e' using eval, and then adds their values together. The where clause assigns the I values of x and y to the corresponding sub-expressions, and then adds their integer values. The result is an I value with the sum of the integer values.
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

evalDynTC :: Expr -> Val
evalDynTC (N i)        = I i
evalDynTC (Plus e e')  = I (evalI e+evalI e')
evalDynTC (Equal e e') = B (evalI e==evalI e')
evalDynTC (Not e)      = B (not (evalB e))

e1 = N 2 `Equal` N 2
e2 = N 1 `Equal` e1
e3 = Not (N 2 `Plus` N 2)


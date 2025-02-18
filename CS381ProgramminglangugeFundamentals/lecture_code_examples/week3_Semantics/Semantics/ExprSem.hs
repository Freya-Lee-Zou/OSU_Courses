--
-- Semantics of arithmetic expressions
--
module ExprSem where

-- import ExprSyn

data Expr = N Int
          | Plus Expr Expr
          | Neg Expr
          | Mult Expr Expr
          | Div Expr Expr
          deriving Show

-- The semantics is defined as a function that maps
-- expressions of type Expr to integers.
--
sem :: Expr -> Int
sem (N i)       = i
sem (Plus e e') = sem e + sem e' 
sem (Mult e e') = sem e * sem e'
--
sem (Div e e') = sem e `div` sem e' 

sem (Neg e)     = -(sem e)

e = Plus (Neg (N 5)) (N 7)



-- ************************lecture notes runing *****************
-- 10-251-47-212:Semantics suzyzou$ ghci ExprSem.hs
-- GHCi, version 9.2.5: https://www.haskell.org/ghc/  :? for help
-- [1 of 1] Compiling ExprSem          ( ExprSem.hs, interpreted )
-- Ok, one module loaded.
-- ghci> let x = (N 5)
-- ghci> x
-- N 5
-- ghci> sem x
-- 5
-- ghci> let y = Plus x (N 4)
-- ghci> y
-- Plus (N 5) (N 4)
-- ghci> sem y
-- 9
-- ghci> let z = Mult x y
-- ghci> z
-- Mult (N 5) (Plus (N 5) (N 4))
-- ghci> sem z
-- 45
-- ghci> sem (Neg z)
-- -45
-- ghci> let q = Mult (N 2) y
-- ghci> q
-- Mult (N 2) (Plus (N 5) (N 4))
-- ghci> sem q
-- 18
-- ghci> let w = Plus (Mult (N2) (N5)) (N4)

-- <interactive>:14:21: error:
--     • Data constructor not in scope: N2 :: Expr
--     • Perhaps you meant ‘N’ (line 8)

-- <interactive>:14:26: error:
--     • Data constructor not in scope: N5 :: Expr
--     • Perhaps you meant ‘N’ (line 8)

-- <interactive>:14:32: error:
--     • Data constructor not in scope: N4 :: Expr
--     • Perhaps you meant ‘N’ (line 8)
-- ghci> let w = Plus ( Mult (N 2) (N 5)) (N 4)
-- ghci> sem w
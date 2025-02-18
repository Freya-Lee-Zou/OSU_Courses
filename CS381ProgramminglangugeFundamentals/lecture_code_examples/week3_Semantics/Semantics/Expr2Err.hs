-- 
-- Two-Type Expression Language
--
module Expr2 where

data Expr   = N Int
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
-- semantic values and errors
-- 
data Val = I Int
         | B Bool
         | Err
         deriving Show

-- Semantics maps into union type
-- Plus catching of type errors.
--
sem :: Expr -> Val
sem (N i)        = I i
sem (Plus e e')  = case (sem e,sem e') of 
                     (I i,I j) -> I (i+j)
                     _         -> Err
sem (Equal e e') = case (sem e,sem e') of
                     (I i,I j) -> B (i==j)
                     (B b,B c) -> B (b==c)
                     _         -> Err
sem (Not e)      = case sem e of
                     B b  -> B (not b)
                     _         -> Err


data Val0 = I0 Int
          | B0 Bool
          deriving Show
 
type Val' = Maybe Val0

sem' :: Expr -> Val'
sem' (N i)        = Just (I0 i)
sem' (Plus e e')  = case (sem' e,sem' e') of
                     (Just (I0 i),Just (I0 j)) -> Just (I0 (i+j))
                     _         -> Nothing
-- sem' (Equal e e') = case (sem' e,sem' e') of
--                      (I i,I j) -> B (i==j)
--                      (B b,B c) -> B (b==c)
--                      _         -> Err
-- sem (Not e)      = case sem e of
--                      B b  -> B (not b)
--                      _         -> Err
-- 


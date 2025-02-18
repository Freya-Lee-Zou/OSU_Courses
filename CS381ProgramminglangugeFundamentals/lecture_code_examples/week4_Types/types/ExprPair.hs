module ExprPair where

data Expr = N Int
          | Pair Expr Expr
          | Fst Expr
          | Swap Expr
          deriving Show

data Type = Int | IPair | TypeError
            deriving (Eq, Show)



-- A data type to represent the union type of
-- semantic values
--
data Val = I Int
        | P Int Int
        | TCError
        | Error
        deriving Show

-- Semantics maps into union type
-- No error handling yet.
--
sem :: Expr -> Val
sem (N i)       = I i
sem (Pair e e') = case (sem e,sem e') of
                     (I i,I j) -> P i j
                     _         -> Error
sem (Fst e)     = case sem e of
                     (P i _) -> I i
                     _       -> Error
sem (Swap e)    = case sem e of
                     P i j -> P j i
                     _     -> Error


psem :: Expr -> String
psem e = show e++" ==> "++show (sem e)++"\n"

semAll :: IO ()
semAll = putStrLn $ concatMap psem ex


-- type checker
--
tc :: Expr -> Type
tc (N i)                                  = Int
tc (Pair e e') | tc e==Int  && tc e'==Int = IPair  -- type check if it is Pair integers
tc (Fst e)     | tc e==IPair              = Int   -- return an integer 
tc (Swap e)    | tc e==IPair              = IPair  
tc _                                      = TypeError   -- oterwise you get typewrror 

ptc :: Expr -> String
ptc e =  show e++" :: "++show (tc e)++"\n"

tcAll :: IO ()
tcAll = putStrLn $ concatMap ptc ex

typeCorrect :: Expr -> Bool
typeCorrect e = tc e /= TypeError

semTC :: Expr -> Val
semTC e | typeCorrect e = sem e
        | otherwise  = TCError

-- semTC is a helper function which detects the errors 
run :: Expr -> String
run e = show e++" ==> "++show (semTC e)++"\n"

runAll :: IO ()
runAll = putStrLn (concatMap run ex)

-- Some examples expressions are:

a = N 5
b = N 10
zero = N 0
c = Pair a b
d = Pair (N 3) (N 4)
{-
e = Plus c d
f = Plus a b
g = Plus a c
h = Plus d b
i = Equal a b
j = Equal (N 15) f
k = Equal c d
l = Equal (Pair (N 8) (N 14)) e
m = Equal a c
n = Div (N 10) zero
o = Div b a
p = Div c zero 
ex = [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o, p]
-}

ex = [a,b,c]

-- 
-- Expression Language with Nested Pairs
--
module ExprNPair where

data Expr = N Int
          | Pair Expr Expr
          | Fst Expr
          | Swap Expr
          | Div Expr Expr
          deriving Show

-- the PairT constructor takes two arguments of type Type and represents a pair type whose first element has the type of the first argument, and whose second element has the type of the second argument. This can be used to represent, for example, the type of a tuple expression in the language.
data Type = Int | PairT Type Type | TypeError
            -- The deriving clause at the end of the definition automatically generates implementations for the Eq and Show type classes. This allows us to compare types for equality using == and to convert types to strings using show.
            deriving (Eq, Show)
 

-- Some examples expressions are:
--
a = N 1
b = Pair a (N 2)
c = Pair a b
d = Swap c
e = Fst b
f = Fst (Fst d)
g = Fst a
h = Swap a
j = Pair h (N 3)
k = Swap j

ex = [a,b,c,d,e,f,g,h,j,k]

-- A data type to represent the union type of
-- semantic values
-- 
data Val = I Int
         | P Val Val
         | RuntimeError
         deriving Show

-- Semantics maps into union type
-- No error handling yet.
--
sem :: Expr -> Val
sem (N i)       = I i

sem (Div e e') = case (sem e , sem e') of 
                  (_ , (I 0)) -> RuntimeError
                  ((I x),(I y)) -> I (x `div` y)
                  _            -> RuntimeError

sem (Pair e e') = P (sem e) (sem e')  -- Note: Lazy Evaluation!
sem (Fst e)     = case sem e of
                     (P v _) -> v  -- if it is a prair return v otherwise return Error
                     _       -> RuntimeError
sem (Swap e)    = case sem e of
                     P v w -> P w v   -- Note: Lazy Evaluation!
                     _     -> RuntimeError


psem :: Expr -> String
psem e = show e++" ==> "++show (sem e)++"\n"

semAll :: IO ()
semAll = putStrLn $ concatMap psem ex


-- type checker ()
--
tc :: Expr -> Type
tc (N i)       = Int
-- tc (Pair e e') = PairT (tc e) (tc e')
tc (Pair e e') | ok t && ok u = PairT t u
               | otherwise    = TypeError
                 where (t,u) = (tc e,tc e')
tc (Fst e)     = case tc e of
                   PairT t _ -> t
                   _         -> TypeError
tc (Swap e)    = case tc e of
                   PairT t u -> PairT u t
                   _         -> TypeError

tc (Div e e')  = case (tc e, tc e') of 
                    (Int, Int) -> Int
                    (_,_)      -> TypeError -- if two types are not integers, it means not correct type 

ok :: Type -> Bool
ok TypeError = False
ok _         = True


ptc :: Expr -> String
ptc e =  show e++" :: "++show (tc e)++"\n"

tcAll :: IO ()
tcAll = putStrLn $ concatMap ptc ex

-- we can do this in HW5
run :: Expr -> String
run e | tc (e) == TypeError = "Type checker Type Error"
      | otherwise = show (sem(e))

--runAll :: IO()
--runAll = putStrLn $ concatMap run ex


-- *****************************Testing Results******************

-- ghci> :load exprNPair.hs
-- [1 of 1] Compiling ExprNPair        ( exprNPair.hs, interpreted )
-- Ok, one module loaded.
-- ghci> lat a = N1
-- ghci> let a = N 1
-- ghci> let b = Pair a (N 2)
-- ghci> let c = Pair b a
-- ghci> c
-- Pair (Pair (N 1) (N 2)) (N 1)
-- ghci> sem (Fst c)
-- P (I 1) (I 2)
-- ghci> sem (Swap c)
-- P (I 1) (P (I 1) (I 2))
-- ghci> sem (Swap a)
-- Error
-- ghci> tc a
-- Int
-- ghci> tc c
-- PairT (PairT Int Int) Int
-- ghci> 
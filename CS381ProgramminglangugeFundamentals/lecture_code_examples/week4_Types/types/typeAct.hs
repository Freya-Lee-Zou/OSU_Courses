-- Expression Language with Pairs
--
module ExprPair where

-- Modified version for activities 3 function added to this data Epr(Type Activity )


data Expr = N Int
          | Plus Expr Expr -- added
          | Equal Expr Expr -- added
          | Bb Bool   -- added
          | Div   Expr Expr -- added
          | Pair Expr Expr
          | Fst Expr
          | Swap Expr
          deriving Show

data Type = Int | IPair | TypeError |Boolean -- added
            deriving (Eq, Show)



-- Some examples expressions are:
--
-- a = N 1
-- b = Pair a (N 2)
-- c = Fst b
-- d = Swap b
-- e = Swap (Swap d)
-- f = Fst e
-- g = Fst a
-- h = Fst (Fst d)
-- i = Pair b b

-- ex = [a,b,c,d,e,f,g,h,i]

-- A data type to represent the union type of
-- semantic values
--
data Val = I Int
         | P Int Int
         | B Bool   -- we added bool here to do type chcking 
         | Error
         deriving Show

-- Semantics maps into union type
-- No error handling yet.
--
sem :: Expr -> Val
sem (N i)       = I i
sem (Bb i)      = B i

sem (Pair e e') = case (sem e,sem e') of
                     (I i,I j) -> P i j
                     _         -> Error
sem (Fst e)     = case sem e of
                     (P i _) -> I i
                     _       -> Error
sem (Swap e)    = case sem e of
                     P i j -> P j i
                     _     -> Error

-- the code below is added for typeActiviy                  
sem (Div e e')  = case (sem e, sem e') of 
                (I i, I j) ->if (j /=0) then I (i `div` j) else Error
                -- _     -> Error  we dont need this line 

sem (Plus e e') = case (sem e, sem e') of  
                  (I i, I j)     -> I (i+j) -- if both integers then add two integers together
                  (P i j, P m n) -> P (i+m) (j+n) -- if both are pair of integes then add two pairs together

sem (Equal e e') = case (sem e, sem e') of 
                  (I i, I j)     -> (B (i==j))
                  (P i j, P m n) -> (B ((i==m) && (j==n)))
                  (B b, B b')    -> (B (b == b'))




psem :: Expr -> String
psem e = show e++" ==> "++show (sem e)++"\n"

semAll :: IO ()
semAll = putStrLn $ concatMap psem ex


-- type checker
--
tc :: Expr -> Type
tc (N i)                                  = Int
tc (Pair e e') | tc e==Int  && tc e'==Int = IPair
tc (Fst e)     | tc e==IPair              = Int
tc (Swap e)    | tc e==IPair              = IPair

tc (Plus e e') | tc e==Int && tc e' == Int = Int -- this line is added for Plus which add two integers 
               | tc e== IPair && tc e' == IPair = IPair -- add two pairs

tc(Div e e')   | tc e== Int && tc e' == Int  = Int

tc (Equal e e')| tc e== Int && tc e' == Int = Boolean
               | tc e==IPair && tc e' == IPair = Boolean
               | tc e==Boolean && tc e' == Boolean = Boolean
               
tc _                                      = TypeError

ptc :: Expr -> String
ptc e =  show e++" :: "++show (tc e)++"\n"

tcAll :: IO ()
tcAll = putStrLn $ concatMap ptc ex

typeCorrect :: Expr -> Bool
typeCorrect e = tc e /= TypeError

semTC :: Expr -> Maybe Val
semTC e | typeCorrect e = Just (sem e)
        | otherwise  = Nothing

psemTC :: Expr -> String
psemTC e = show e++" ==> "++show (semTC e)++"\n"

semTCAll :: IO ()
semTCAll = putStrLn $ concatMap psemTC ex


a = N 1
b = Pair a (N 2)
c = Fst b
d = Swap b
e = Swap (Swap d)
f = Fst e
g = Fst a
h = Fst (Fst d)
i = Pair b b

ex = [a,b,c,d,e,f,g,h,i]
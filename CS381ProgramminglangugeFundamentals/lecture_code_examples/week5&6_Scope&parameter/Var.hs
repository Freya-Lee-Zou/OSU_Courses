-- 
-- Extending arithmetic expressions by variables
--
module Var where

import Trace 


type Name = String

data Expr = N Int                -- integer constant
          | Plus Expr Expr       -- addition
          | Var Name             -- reference to a variable
          | Let Name Expr Expr   -- local definition


instance Show Expr where
  show (N i)        = show i
  show (Plus e e')  = showP e++"+"++showP e'
  show (Var x)      = x
  show (Let x e e') = "let "++x++"="++show e++" in "++show e'

showP e@(N _)   = show e
showP e@(Var _) = show e
showP e         ="("++show e++")"

data Val = I Int        -- integer constants
         | Error

instance Show Val where
  show (I i)   = show i
  show Error   = "error"


type Stack = [(Name,Val)]


-- The semantics are defined as a function that maps
-- expressions of type Expr to values. Values are
-- integers, functions, or errors. Note that eval
-- takes as an additional argument a runtime stack
-- for storing local definitions of variables.
--
eval :: Stack -> Expr -> Val
eval _ (N i)        = I i
eval s (Plus e e')  = add (eval s e) (eval s e')
eval s (Var x)      = getVar x s
eval s (Let x e e') = eval ((x,eval s e):s) e'


add :: Val -> Val -> Val
add (I i) (I j) = I (i+j)
add _     _     = Error

getVar :: Name -> Stack -> Val
getVar x s = case lookup x s of
               Just v  -> v
               Nothing -> Error


-- "smart constructors" to simplify the construction
-- of syntax trees
-- 
[i1,i2,i3] = map I [1,2,3] 
[n1,n2,n3] = map N [1,2,3] 
[x,y,z,f]  = map Var ["x","y","z","f"]


-- example expressions
--
--- definitions
letxy = Let "x" n1 (Let "y" n2 (x `Plus` y))
letxy' = Let "x" n1 ((Let "y" n2 x) `Plus` y)
letxy'' = Let "x" n1 ((Let "y" n2 y) `Plus` x)
letxx = Let "x" n1 (Let "x" n2 (x `Plus` x))
letxx' = Let "x" n1 ((Let "x" n2 x) `Plus` x)
noRec = Let "x" x x
noRec' = Let "x" x n1 -- lazy evaluation
loop  = Let "x" (Let "x" x x) x


-- tracing evaluator
--
evalT :: Stack -> Expr -> Trace Expr Val Val
evalT s a@(N i)        = Tr a s [] (I i)
evalT s a@(Plus e e')  = Tr a s [te,te'] (add (getVal te) (getVal te'))
                         where (te,te') = (evalT s e,evalT s e')
evalT s a@(Var x)      = Tr a s [] (getVar x s)
evalT s a@(Let x e e') = Tr a s [te,te'] (getVal te') 
                         where te  = evalT s e
                               te' = evalT ((x,getVal te):s) e'

tr :: Expr -> Trace Expr Val Val
tr e = evalT [] e




{-ghci> letxy
let x=1 in let y=2 in x+y
ghci> tr letxy
>> let x=1 in let y=2 in x+y    []
    >> 1    []
     = 1
    >> let y=2 in x+y    [x:1]
        >> 2    [x:1]
         = 2
        >> x+y    [y:2,x:1]
            >> x    [y:2,x:1]
             = 1
            >> y    [y:2,x:1]
             = 2
         = 3
     = 3
 = 3

ghci> letxy
let x=1 in let y=2 in x+y
ghci> letxy'
let x=1 in (let y=2 in x)+y
ghci> tr letxy'
>> let x=1 in (let y=2 in x)+y    []
    >> 1    []
     = 1
    >> (let y=2 in x)+y    [x:1]
        >> let y=2 in x    [x:1]
            >> 2    [x:1]
             = 2
            >> x    [y:2,x:1]
             = 1
         = 1
        >> y    [x:1]  -- there is no x left thats why we got errors
         = error
     = error
 = error

 ghci> letxx'
let x=1 in (let x=2 in x)+x
ghci> tr letxy''
>> let x=1 in (let y=2 in y)+x    []
    >> 1    []
     = 1
    >> (let y=2 in y)+x    [x:1]
        >> let y=2 in y    [x:1]
            >> 2    [x:1]
             = 2
            >> y    [y:2,x:1]
             = 2
         = 2
        >> x    [x:1]
         = 1
     = 3
 = 3

ghci> letxx
let x=1 in let x=2 in x+x
ghci> tr letxx
>> let x=1 in let x=2 in x+x    []
    >> 1    []
     = 1
    >> let x=2 in x+x    [x:1]
        >> 2    [x:1]
         = 2
        >> x+x    [x:2,x:1]
            >> x    [x:2,x:1]
             = 2
            >> x    [x:2,x:1]
             = 2
         = 4
     = 4
 = 4

ghci> 
 
 -}


--
-- Extending arithmetic expressions by functions (dynamic scoping)
--
module FunDynScope where

import Trace


type Name = String

data Expr = N Int                -- integer constant
          | Plus Expr Expr       -- addition
          | Var Name             -- reference to a variable
          | Let Name Expr Expr   -- local definition
          | Fun Name Expr        -- function abstraction
          | App Expr Expr        -- application

data Val = I Int              -- integer constants
         | F Name Expr        -- function values
         | Error

instance Show Expr where
  show (N i)        = show i
  show (Plus e e')  = showP e++"+"++showP e'
  show (Var x)      = x
  show (Let x e e') = "let "++x++"="++show e++" in "++show e'
  show (Fun x e)    = showFun x e
  show (App e e')   = case e of
                        App _ _ -> show e++" "++showP e'
                        _       -> showP e++" "++showP e'

showFun x e = "\\"++x++"->"++show e

showP e@(N _)   = show e
showP e@(Var _) = show e
showP e         ="("++show e++")"

instance Show Val where
  show (I i)   = show i
  show (F x e) = showFun x e
  show Error   = "error"


type Stack = [(Name,Val)]


-- The semantics is defined as a function that maps
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
eval s (Fun x e)    = F x e
eval s (App f e')   = case eval s f of
                        F x e -> eval ((x,eval s e'):s) e
                        _     -> Error


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
[n0,n1,n2,n3] = map N [0 .. 3]
[x,y,z,f]  = map Var ["x","y","z","f"]


-- example expressions
--
--- functions
suc = Fun "y" (y `Plus` n1)
dbl = Fun "x" (x `Plus` x)
--- applications
ds3 = App dbl (App suc n3)
--- definitions
letxy = Let "x" n1 (Let "y" n2 (x `Plus` y))
letxy' = Let "x" n1 ((Let "y" n2 y) `Plus` x)
letxx = Let "x" n1 ((Let "x" n2 x) `Plus` x)
noRec = Let "x" x x
noRec' = Let "x" x n1
loop  = Let "x" (Let "x" x x) x
--- function definition
letfx = Let "x" (Let "f" suc (App f n1)) x
--- CBValue vs. CBName evaluation
one = Let "x" y n1
four = Let "f" suc (App f (n1 `Plus` n2))
--- dynamic scope
-- f = Fun "x" (x `Plus` (Fun "y" ()))
dysc = Let "x" n1
           (Let "f" (Fun "y" (y `Plus` x))
                (Let "x" n2
                     (App f n0)))


-- tracing evaluator
--
isFun :: Val -> Bool
isFun (F _ _) = True
isFun _       = False

evalT :: Stack -> Expr -> Trace Expr Val Val
evalT s a@(N i)        = Tr a s [] (I i)
evalT s a@(Plus e e')  = Tr a s [te,te'] (add (getVal te) (getVal te'))
                         where (te,te') = (evalT s e,evalT s e')
evalT s a@(Var x)      = Tr a s [] (getVar x s)
evalT s a@(Let x e e') = Tr a s [te,te'] (getVal te')
                         where te  = evalT s e
                               te' = evalT ((x,getVal te):s) e'
evalT s a@(Fun x e)    = Tr a s [] (F x e)
evalT s a@(App f e) | isFun tfv = Tr a s [te,tfe] (getVal tfe)
                    | otherwise = Tr a s [] Error
                         where tf    = evalT s f
                               tfv   = getVal tf
                               F x b = tfv
                               te    = evalT s e
                               tfe   = evalT ((x,getVal te):s) b

tr :: Expr -> Trace Expr Val Val
tr e = evalT [] e




--
-- Semantics of boolean expressions
--

module BoolSem where

import BoolSyn  -- import syntax definition
import BoolPP

-- syntax is imported, so i commented out
-- data BExpr = T | F
--            | Not BExpr
--            | Or BExpr BExpr
--            deriving Show

-- data BExpr = C Bool | ...

nnt :: BExpr
nnt = Not (Not T)

tonnt :: BExpr
tonnt = Or T nnt

sem :: BExpr -> Bool
sem T         = True
sem F         = False
sem (Not b)   = not (sem b)
sem (Or b b') = sem b || sem b'
--sem (And b b') = sem b && sem b'

-- sem (Or b b') | sem b     = True
--               | otherwise = sem b'
-- sem (Or b b') = case sem b of
--				     True  -> True
--                   False -> sem b'


fonnf = F `Or` Not (Not F)


f = fonnf `Or` fonnf
t = T `Or` fonnf

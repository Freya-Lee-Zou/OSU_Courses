module HW5sol where
import HW5types
import GHC.IO.Exception (IOErrorType(NoSuchThing))

-- **********************************
-- HW5 - Types                      *
-- Group: 8                         *
-- Student1 Name : Ya Zou           *
-- Student2 Name : Haofan Wang      *
-- Student3 Name : Ali  Akturin     *
-- **********************************
--This fucntion used the folowing type(type Rank = Int ,typeCmdRank(int,int) )to represent the operation tanks, it maps each stack operation to its rank
rankC :: Cmd -> CmdRank
rankC (LDI _) = (0,1)
rankC ADD     = (2,1)
rankC MULT    = (2,1)
rankC DUP     = (1,2)
rankC DEC     = (1,1)
rankC SWAP    = (2,2)
rankC (POP i) = (i,0)
rankC (LDB _) = (0,1)
rankC LEQ     = (2,1)
--rankC (IFELSE _ _) = (2, 0) -- special case for IFELSE ( this line of code has some problems)
rankC(IFELSE p1 p2) = prosMinRank((minRank (rankList p1) (rankList p2)))

rankList :: Prog -> CmdRank
rankList [] = (0,0)
rankList (c:cs) = (addRank (rankC c) (rankList cs))
-- compute rank of command
addRank :: CmdRank -> CmdRank -> CmdRank
addRank (x1, x2) (y1, y2) = (x1+y1, x2+y2)
-- get minimum rank  of commands
minRank :: CmdRank -> CmdRank -> CmdRank
minRank (x1, x2) (y1, y2) | (x2 - x1) < (y2 - y2) = (x1, x2)
                          | otherwise = (y1, y2)

prosMinRank :: CmdRank -> CmdRank
prosMinRank (x, y) = ((x+1), y)


--This is  an auxiliary function rank 
rank :: Prog -> Rank -> Maybe Rank
rank [] r           = Just r
rank (c:cs) r = let nr = r + (dRank c)
                 in if nr >= 0 then
                      (rank cs nr)
                    else
                      Nothing

-- how a command changes rank
dRank :: Cmd -> Rank
dRank c = let (d, a) = (rankC c)
           in a - d


-- compute rank
rankP :: Prog -> Rank -> Maybe Rank
rankP [] r = Just r 
rankP [DUP, _] 0 = Nothing
rankP [DUP] 0 = Nothing
rankP p r = case rank p r of
            Nothing -> Nothing
            Just r' -> if r' <= 0 then -- in case just 0
                        Nothing
                        else
                          Just r'







-- New operations:(old operations can see form the file Stacklang2)
-- DEC – decrements the topmost element (must be Int) on the stack
-- SWAP- exchanges the two topmost elements on the stack
-- POP k – pops k elements off the stack

sem :: Cmd -> Stack -> Maybe Stack
sem (LDI n)      s = Just (I n : s)
sem(LDB b)      s = Just (B b : s)

sem LEQ          []              = Nothing
sem LEQ          (I m : I n : s) = Just (B (m <= n) : s)

sem ADD          []              = Nothing
sem ADD          (I m : I n : s) = Just (I (n + m) : s)

sem MULT          []              = Nothing
sem MULT         (I m : I n : s) = Just (I (n * m) : s)

sem DUP          []              = Nothing
sem DUP          (x : s)         = Just (x : x : s)

sem (IFELSE p q) (B b : s) = semProg (if b then p else q) s
sem (IFELSE _ _) _ = Nothing

sem DEC          []              = Nothing
sem DEC          (I n : s)       = Just (I (n - 1) : s)

sem SWAP          []              = Nothing
sem SWAP         (x : y : s)     = Just (y : x : s)


sem (POP k) s                    = Just (drop k s)
sem _            _               = Nothing




-- helper fucntion for run
semProg :: Prog -> Stack -> Maybe Stack
semProg []           s = Just s
semProg (cmd : p)    s = case sem cmd s of
                          Just s' -> semProg p s'
                          Nothing -> Nothing




--this a function run for evaluating a program with a given stack
run :: Prog -> Stack -> Result
run program stack = case rankP program (length stack) of
                      Nothing -> RankError
                      Just r -> case semProg program stack of
                                  Just resultStack -> A resultStack
                                  Nothing -> TypeError
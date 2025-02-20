--
-- Simple machine with one register
--
module RegMachine where

-- syntax of the assembly language
-- 
type Prog = [Op]

data Op = LD Int
        | INC     -- increment
        | DUP     -- double
        deriving Show

-- Semantics of an operation and a program is a 
-- transformation of the register content.
--
type RegContent = Int

-- you can define a returen type
type D = RegContent -> RegContent

-- semOp :: Op -> D
semOp :: Op -> RegContent -> RegContent
semOp (LD i) _ = i   -- if it is empty, then return i
semOp INC    c = c+1  -- increse by 1
semOp DUP    c = c*2  
--
--semOp (LD i) = \_ -> i       --  \_is lamda funtion 
--semOp INC    = \c -> c+1     -- return a lamda fucntion,taking c anad performing the operation
--semOp DUP    = \c -> c*2     -- 
--

-- using bulit in operators
--semOp (LD i) = (const i)
--semOp INC    = (+1)
--semOp DUP    = (*2)

-- sem :: Prog -> D
sem:: Prog -> RegContent -> RegContent
sem []     c = c
sem (o:os) c = sem os (semOp o c)

-- machine interpreter "starts with" 0 in the register
--
run :: Prog -> RegContent
run p = sem p 0

-- example programs
--
p :: Prog 
p = [LD 2,INC,DUP]

q :: Prog
q = [INC,DUP]


-- The Prog type alias represents a program and is defined as a list of Cmd commands.
type Prog = [Cmd]


--The Cmd data type defines the possible commands in the language, which are ADD and LEQ. These two commands are the only operations that can be performed in the program.
type Stack = [Either Bool Int] -- either boolean or integer
data Cmd = ADD
          | LEQ

--  It returns a Maybe Stack, which is Just the result of executing the command on the stack, or Nothing if the command cannot be executed.
semCmd :: Cmd ->Stack -> Maybe Stack

semCmd ADD [] = Nothing 
semCmd ADD ((Right x):[]) = Nothing
semCmd ADD ((Right x):(Right y):s) = Just ((Right(x+y)):s)
semCmd ADD _ = Nothing


semCmd LEQ [] = Nothing
semCmd LEQ ((Right x):[]) = Nothing
semCmd LEQ ((Right x):(Right y):s) = Just ((Left(x<=y)):s)
-- if value is not integer then return nothing
semCmd LEQ _ = Nothing

semCmd (IFELSE p1 p2) (x:s) 

-- if the program is not empty, the function evaluates the first command in the program (c) on the input stack (s) using the semCmd function. If the result is Nothing, the program execution stops and Nothing is returned. If the result is Just s', the function recursively calls run with the remaining commands (cs) and the result stack (s'). This process continues until all the commands in the program have been executed or until the execution of a command returns Nothing.
run :: Prog -> Stack -> Maybe Stack
run [] s = Just s
--run [] [] = Just []
-- c is top command, case statement, if semCmd has nothong then retuern a nothing, if stack is returned, then return recursivrly run the command.
run (c:cs) s = case semCmd c s of
                  Nothing -> Nothing
                  Just s' -> run cs s'

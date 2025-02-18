-- Prog: a list of commands of type Prog

-- Stack: a stack of either boolean or integer values


run :: Prog -> Stack -> Maybe Stack

type Stack = [Either Bool Int]
s :: Stack
s = [Right 6, Right 8, Left False, Right 3]

-- If the stack is empty, the function returns Nothing.
sem ADD [] = Nothing 
-- If the stack has only one element, which is an integer value, the function returns Nothing.
sem ADD (Right x:[]) = Nothing

-- If the stack has two elements, which are integer values, the function adds the two values and pushes the result back onto the stack. The result is returned as Just with the new stack.
sem ADD (Right x:Right y:xs) = Just (([Right(x+y)])++xs)

-- other cases return nothing 
sem ADD (_) =Nothing


-- the code defines the value p1 as the list of commands [ADD] and applies the run function on the stack s with the commands p1.
p1 = [ADD]

-- If the list of commands is empty, the function simply returns the original stack as a Just value.
run [] s = Just s

-- run (x:xs) s: If the list of commands is not empty, the function first tries to execute the first command x on the stack s using the sem function. The result of sem x s is a Maybe Stack. If the result is Nothing, the function returns Nothing. If the result is Just r, the function continues executing the rest of the commands xs on the new stack r using a recursive call to run xs r.
run (x:xs) s = case sem x s of 
  Nothing -> Nothing
  Just r -> run xs r
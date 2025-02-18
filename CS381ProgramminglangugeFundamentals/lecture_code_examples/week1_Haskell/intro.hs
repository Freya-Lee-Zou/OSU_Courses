import Data.List

import Data.Char

square :: Integer -> Integer
square x = x*x
-- min can equal max
in_range :: Integer -> Integer -> Integer -> Bool
in_range min max x =
  if min > max then False else 
    x>= min && x <= max

-- Guards
fac :: Integer -> Integer
fac n
  | n <= 1 = 1
  | otherwise = n * fac(n-1)

-- Pattern Matching
is_zero 0 = True
is_zero _ = False

-- Accumulators & tail recursion
fact n = temp n 1
  where
    temp n acc 
      | n <= 1 = acc
      | otherwise = temp (n-1) (n*acc)

-- Generating an ascending List
asc :: Int -> Int -> [Int]
asc n m
  | m < n = []
  | m == n = [m]
  | m > n = n : asc (n+1) m 

-- List Comprehensions
-- Pairs tuples
evens :: [Int]  -> [Int]
evens []        = []
evens (x:xs)
  | mod x 2 == 0  = x: evens xs
  | otherwise     = evens xs

-- tuples
first :: (a,b) -> a 
first (x,_) = x 

second :: (a,b) -> b
second (_,y) = y

allX :: [(Int, Int)] -> [Int]
allX xs = [ x | (x,y) <- xs ]

allY :: [(Int, Int)] -> [Int]
allY xs = [ y | (x,y) <- xs ]


addTuples :: [(Int,Int)] -> [Int]
addTuples xs = [ x+y | (x,y) <- xs ]

sumXY :: [ (Int, Int)] -> (Int,Int)
sumXY [] = (0, 0)
sumXY xs = (sum (allX xs), sum (allY xs)) 
-- graphs
graph1 = [(1,2), (1,3), (2,4), (3,4), (2,5), (4,5) ]


alledge :: Int -> Int -> [(Int, Int)]
alledge _ 0 = []
alledge 1 _ = []
alledge m k = (m, k) : alledge m (k-1)

completeGraph :: Int -> [(Int, Int)]
completeGraph 0 = []
completeGraph n = [(x,y) | x<-[1..n], y <-[1..n], x/=y ]

-- Returns true if a list is in ascending order
ascOrder :: [Int] -> Bool
ascOrder [] = True
ascOrder [x] = True
ascOrder (x:y:xs) = 
  ( x <= y) && ascOrder (y:xs)

-- hasPath directed graph
hasPath :: [(Int, Int)] -> Int -> Int -> Bool
hasPath [] x y = x == y 
hasPath xs x y 
  | x == y = True
  | otherwise = 
    let xs' = [ (n,m) | (n,m) <- xs, n /= x ] in 
    or [ hasPath xs' m y | (n,m) <- xs, n == x ]

-- Higher order and anonymous functions
-- map :: (a -> b) -> [a] -> [b]
-- map (\(x,y) -> x+y) [(1,2), (2,3), (3,4)]
-- map newAdd [(1,2), (2,3), (3,4)]

newAdd :: (Int, Int) -> Int
newAdd (x,y) = x+y

cubic :: Integer -> Integer
cubic x = x*x*x

-- Filter   filter :: (a-> Bool) -> [a] -> [a]
-- filter (\(x,y) -> x/+ y) [(1,2),(2,2)]

-- Data Types


data Temperature = C Float | F Float
  deriving Show

instance Eq Temperature where
  (==) (C n) (C m) = n == m 
  (==) (F n) (F m) = n == m 
  (==) (C n) (F m) = (1.8*n + 32) == m 
  (==) (F n) (C m) = (1.8*m + 32) == n 

  
todayTemp :: Temperature
todayTemp = C 0 

-- Maybe
safediv :: Integral a => a -> a -> Maybe a
safediv a b =
  if b == 0 then Nothing else Just $ div a b 

-- IO action
greet :: IO()
greet = do
  putStrLn "What is your name?"
  name <- getLine
  let uname = map toUpper name
  putStrLn ("Hello " ++ uname ++ ".")

--f :: [Int] -> [Int]
f []     = []
f (x:xs) = f ys ++ [x] ++ f zs
           where
            ys = [a | a <-xs, a <= x]
            zs = [b | b <- xs, b > x]

myDouble :: Num a => a -> a 
myDouble x = x + x 

intDouble :: Int -> Int
intDouble x = x + x 

myFactorial n = product[1..n]

myAverage ns = (sum ns) `div` (length ns)

n = a `div` length xs
    where
      a = 10
      xs = [1,2,3,4,5]

myAdd :: Int -> Int -> Int
myAdd x y = x + y 

myAdd2 = myAdd 2

add :: (Int, Int) -> Int
add (x,y) = x+y

--data Pet = Cat | Dog 

data Tree = Node Int Tree Tree | Leaf 
  deriving Show

myTree :: Tree
myTree = Node 5 (Node 3(Node 1 Leaf Leaf)(Node 4 Leaf Leaf))
    (Node 7 (Node 6 Leaf Leaf) (Node 9 Leaf Leaf))

inorder :: Tree -> [Int]
inorder Leaf = []
inorder (Node x l r) = inorder l ++ [x] ++ inorder r

occurs :: Int -> Tree -> Bool
occurs m (Leaf) = False
occurs m (Node n l r) 
  | m==n = True
  | m<n  = occurs m l
  | m>n  = occurs m r

myElem :: (Eq a) => a -> [a] -> Bool
myElem _ [] = False
myElem e (x:xs) = (e == x) || (myElem e xs)

isAsc :: [Int] -> Bool
isAsc [] = True
isAsc [x] = True
isAsc (x:y:xs) = (x <= y) && isAsc (y:xs)



myLength :: [a] -> Int
myLength [] = 0
myLength [x] = 1
myLength (x:xs) = 1 + myLength xs


factors :: Int -> [Int]
factors n = 
  [x | x <- [1..n], n `mod` x == 0]

prime :: Int -> Bool
prime n = factors n == [1,n]

-- return all primes
primes :: Int -> [Int]
primes n = [x| x <- [2..n], prime x]

twice :: (a -> a) -> a -> a
twice f x = f (f (x) )

th :: [[a]] -> [a]
th = tail . head

-- second element
secondElement = head.tail
dropFirst2 = tail.tail

positive :: Int -> Int
positive x 
      | x > 0 = 1
      | x == 0 = 0
      | otherwise = -1

fib :: Int -> Int
fib 0 = 0
fib 1 = 1
fib n = fib(n-1) + fib(n-2)

listfib :: Int -> [Int]
listfib n = map fib [1..n]

isEven :: Int -> Bool
isEven n = mod n 2 == 0

myyLength :: [a] -> Int
myyLength [] = 0
myyLength(_:xs) = 1 + myyLength(xs)

mysum :: [Int] -> Int
mysum [] = 0
mysum (x:xs) = x + mysum xs

listStats :: [Int] -> [Int]
listStats xs = [myyLength xs, mysum xs]

listOflists :: [[Int]] -> [[Int]]
listOflists xs = map listStats xs


mypair :: [Int] -> (Int,Int)
mypair xs = ( head xs, (head.reverse) xs)

myList :: [[Int]] -> [(Int,Int)]
myList xs = map mypair xs

h _ [] = 0
h y (x:xs) | y>0       = y + h (y) xs
           | otherwise = 0

replFst :: a-> [a] -> [a]
replFst x [] = x:[]
replFst x (_:xs) = x:xs

type VertexList = [Int]
type EdgeList = [ (Int,Int) ]
type Graph = (VertexList, EdgeList)
myGraph :: Graph
myGraph = ([1,2,3,4], [ (1,2), (2,3) ])

module HW2sol where
import HW2types
sname = "Ya Zou"
-- ********************************
-- Student Name: Ya Zou           *
-- Email:zouy2@oregonstate.edu    * 
-- Date: Jan,22,2023              *
-- ********************************



-- ==============================================================
-- ===============Exercise 1. Programming with Lists=============


-- (a) Define the function ins that inserts an element into a multiset. 

ins ::Eq a => a -> Bag a -> Bag a
ins x [] = [(x, 1)]
ins x ((y,n):ys)
  | x == y      = (y,n+1):ys
  | otherwise   = (y,n):ins x ys


-- (b) Define the function del that removes an element from a multiset.

del :: Eq a => a -> Bag a -> Bag a
del _ [] = []
del el ((b1, 1):bs)
  | el == b1 = bs
  | otherwise = (b1, 1) : del el bs
del el (b:bs)
  | el == fst b = (fst b, snd b - 1) : bs
  | otherwise = b : del el bs



-- (c)Define a function bag that takes a list of values and produces a multiset representation.


bag :: Eq a => [a] -> Bag a
emptyBag :: Bag a
emptyBag = []
bag elts = foldr add emptyBag elts

-- helper function
add :: Eq a => a -> Bag a -> Bag a
add x [] = [(x, 1)]
add x ((y,n):ys) 
  | x == y = (x,n+1):ys
  | otherwise = (y,n):add x ys

-- (d) Define a function subbag that determines whether or not its first argument bag is contained in the second.


subbag :: (Eq a )=> Bag a -> Bag a -> Bool
subbag [] _ = True
subbag ((x,n):xs) ys = case lookup x ys of
  Just m  -> m >= n && subbag xs ys
  Nothing -> False


--(e) Define a function isSet that tests whether a bag is actually a set,which is the case when each element occurs only once.  isSet :: Eq a => Bag a -> Bool

isSet :: Eq a => Bag a -> Bool
isSet [] = True
isSet ((_, count):xs)
  | count /= 1 = False
  | otherwise = isSet xs


-- (f) Define a function size that computes the number of elements contained in a bag. size :: Bag a -> Int

size :: Bag a -> Int
size [] = 0
size xs = sum [y|(x,y) <- xs]


--  ====================Exercise 2. Graphs========================

-- let g = [ (1,2), (1,3), (2,3), (2,4),(3,4)]
-- let h = [ (1,2), (1,3), (2,1), (3,2), (4,4) ]
-- let g2 = [ (1,5), (1,7), (2,5), (7,2) ]

-- (a) Define the function nodes :: Graph -> [Node] that computes the list of nodes contained in a given graph. For example, nodes g = [1,2,3,4].

nodes :: Graph -> [Node]
nodes g = norm $ concat [[fst a, snd a] | a <- g]

--(b) Define the function suc :: Node -> Graph -> [Node] that computes the list of successors for a node in a given graph. For example,suc 2 g = [3,4],suc 4 g = [], andsuc 4 h = [4].


suc :: Node -> Graph -> [Node]
suc h g = [y | (x,y) <- g, x == h]

   
-- (c) Define the function detach :: Node->Graph->Graph that removes a node together with all of its incident edges from a graph.For example, detach 3 g = [(1,2),(2,4)] and detach 2 h = [(1,3),(4,4)].


detach :: Node -> Graph -> Graph
detach h g = [(x,y) | (x,y) <- g, not (x == h || y == h)]


-- (d)Define the function cyc :: Int -> Graph that creates a cycle of any given number. For example, cyc 4 = [(1,2),(2,3),(3,4),(4,1)].

cyc :: Int -> Graph
cyc n = zip [1..n] (drop 1 (cycle [1..n]))


-- ==============================================================
-- ===============Exercise 3. Programming with Data Type=========



-- (a)Define the function width that computes the width of a shape.

width :: Shape -> Length
width (Pt _ ) = 0
width (Circle _ r) = 2*r
width (Rect _ w h) = w


-- (b) Define the function bbox that computes the bounding box of a shape. bbox :: Shape -> BBox
-- The bounding boxes of the shapes in the figure f are as follows.
--  map bbox f [((4,4),(4,4)),((2,2),(8,8)),((3,3),(10,5))]

bbox :: Shape -> BBox
bbox (Pt p) = (p, p)
bbox (Circle (x,y) r) = ((x-r, y-r), (x+r, y+r))
bbox (Rect (x,y) w h) = ((x, y), (x+w, y+h))


-- (c) Define the function minX that computes the minimum x coordinate of a shape. minX :: Shape -> Number
-- The minimum x coordinates of the shapes in the figure f are as follows. > map minX f
-- [4,2,3]

minX :: Shape -> Number
minX (Pt (x,_)) = x
minX (Circle (x,_) r) = x - r
minX (Rect (x,_) _ _) = x

-- (d) Define a function move that moves the position of a shape by a vector given by apoint a sits second argument.
--    move :: Shape -> Point -> Shape
-- It is probably a good idea to define and use an auxiliary function addPt :: Point -> Point -> Point, which adds two points component wise.
 

addPt :: Point -> Point -> Point
addPt (x1, y1) (x2, y2) = (x1 + x2, y1 + y2)

move :: Shape -> Point -> Shape
move (Pt p) d       = Pt (addPt p d)
move (Circle p r) d = Circle (addPt p d) r
move (Rect p w h) d = Rect (addPt p d) w h


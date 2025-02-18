module HW2types where

import Data.List 

b4 :: Bag Int
b4 = []
b1 :: Bag Int
b1 = [(3,2), (4,1),(7,3),(12,5)]
b2 :: Bag Int
b2 = [(3,1), (7,2)]
b3 :: Bag Int
b3 = [(3,1), (4,1),(7,1),(10,1) ]
-- Types for Exercise 1
--
type Bag a = [(a,Int)]


-- Types and functions for Exercise 2
--
type Node  = Int
type Edge  = (Node,Node)
type Graph = [Edge]
type Path  = [Node]

norm :: Ord a => [a] -> [a]
norm = sort . nub


-- Types for Exercise 3
--
type Number = Int

type Point = (Number,Number)
type Length = Number

data Shape = Pt Point
           | Circle Point Length
           | Rect Point Length Length
           deriving Show

type Figure = [Shape]

type BBox = (Point,Point)

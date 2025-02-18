# CS331 F24 Homework 1
# TODO: Write your full name and student id here
# Name: Ya Zou
# Student ID: 934417686
# Implement Breadth First Search and Depth First Search
# Tested with Python 3.9.12

import pandas as pd
from collections import deque

def main():
	# Don't modify main
	graph = {'S' : ['1','2', '3'],
	  '1' : ['4', '5'],
	  '2' : ['6', '7', '8'],
	  '3' : ['9'],
	  '4' : ['10', '11'],
	  '5' : ['G', '12'],
	  '6' : ['13', '14'],
	  '7' : ['15', '16'],
	  '8' : ['17', '18'],
	  '9' : ['19']
	  }
	visited = set()
	# Visited_order will contain a list of nodes in the order visited
	visited_order = []
	dfs(visited, graph, 'S', visited_order)
	print("Depth First Search:", visited_order)
	df_dfs = pd.DataFrame()	
	df_dfs["solution"] = visited_order
	visited_order = []
	bfs(visited, graph, 'S', visited_order)
	print("Breadth First Search:", visited_order)
	# Recall visited_order is a mutable list aka a pointer under the hood, so you can modify it anywhere
	# and get the same value outside the function you modified it in.
	# Thus you don't need to return anything for these functions.

	# Write the results to a file
	df_bfs = pd.DataFrame()
	df_bfs["bfs"] = visited_order
	df_dfs.to_csv("dfs.csv")
	df_bfs.to_csv("bfs.csv")

 
def dfs(visited, graph, node, solution):
	"""Depth First Search Function to implement
	visited (set): set of visited nodes
	graph (dictionary): input graph to search on
	node (string): node to expand
	solution (list): the solution
	"""
	# TODO: Write your code here
	if node not in visited:
		visited.add(node)
		solution.append(node)
		if node =='G':
			return True
		for adjacent in graph.get(node,[]):
			if dfs(visited, graph, adjacent, solution):
				return True
	return False


def bfs(visited, graph, node, solution):
	"""Breadth First Search Function to implement
	visited (set): set of visited nodes
	graph (dictionary): input graph to search on
	node (string): node to expand
	solution (list): the solution
	"""
	# TODO: Write your code here
	visited = set()
	queue = [node] 
	visited.add(node)
	while queue:
		current_node = queue.pop(0)
		solution.append(current_node)
		if current_node == 'G':
			break
		for adjacent in graph.get(current_node, []):
				if adjacent not in visited:
						visited.add(adjacent)
						queue.append(adjacent) 
		
		

if __name__ == "__main__":
    main()

# CS331 F24 Homework 2 
# TODO: Freya Zou
# Implement A* Search
# Tested with Python 3.9.12

from time import time


class Node:
    # Don't modify
    """Node class
    name (string): Node name like "S" or "1"
    heuristic (int): h value
    neighbors (dictionary): dictionary of neighboring nodes with values as neighbors
    cost (int): cost from S to the node 
    """
    def __init__(self, name, heuristic):
        self.name = name
        self.heuristic = heuristic
        self.neighbors = {}
        self.cost = float('inf') 

    def add_neighbor(self, neighbor, cost):
        self.neighbors[neighbor] = cost


def a_star_search(start, goal):
    """Implement A* Search
    start: start node S
    goal: goal node G
    shortest_path (list of strings)
    solution_cost (int)
    nodes_expanded (list of strings)"""
    # TODO: Write your code here
    open_set = {start}
    closed_list = [] 
    start.cost = 0
    came_from = {}
    while open_set:
        current = min(open_set, key=lambda o: o.cost + o.heuristic)

        if current == goal:
            path = []
            while current in came_from:
                path.append(current.name)
                current = came_from[current]
            path.append(start.name)
            path.reverse()
            return path, goal.cost, [node.name for node in closed_list]

        open_set.remove(current)
        # Add to closed list to maintain order
        closed_list.append(current)  

        for neighbor, cost in current.neighbors.items():
            if neighbor in closed_list:
                continue

            tentative_cost = current.cost + cost

            if neighbor not in open_set:
                open_set.add(neighbor)
            elif tentative_cost >= neighbor.cost:
                continue

            came_from[neighbor] = current
            neighbor.cost = tentative_cost
            
    return [], float('inf'), [node.name for node in closed_list]


def q1():
    # Don't modify this function
    # Graph
    S = Node("S", 7)
    node1 = Node("1", 6)
    node2 = Node("2", 5)
    node3 = Node("3", 4)
    node4 = Node("4", 2)
    node5 = Node("5", 3)
    G = Node("G", 0)

    # Adding edges
    S.add_neighbor(node1, 6)
    S.add_neighbor(node2, 5)
    node1.add_neighbor(node3, 3)
    node1.add_neighbor(node4, 4)
    node2.add_neighbor(node4, 6)
    node2.add_neighbor(node5, 5)
    node3.add_neighbor(node4, 5)
    node4.add_neighbor(G, 4)
    node5.add_neighbor(node4, 8)

    # Running A*
    start_time = time()
    shortest_path, solution_cost, nodes_expanded = a_star_search(S, G)
    end_time = time()

    # Outputting the results
    print("Shortest path", shortest_path)
    print("Solution cost:", solution_cost)
    print("Number of nodes expanded:", nodes_expanded)
    print("Time taken to solve: {:.5f} seconds".format(end_time - start_time))


def q2():
    #TODO: Modify the heuristics below
    # Modified all heuristic value to 1 
    # Graph
    S = Node("S", 1)
    node1 = Node("1", 1)
    node2 = Node("2", 1)
    node3 = Node("3", 1)
    node4 = Node("4", 1)
    node5 = Node("5", 1)
    G = Node("G", 0)

    # Adding edges
    S.add_neighbor(node1, 6)
    S.add_neighbor(node2, 5)
    node1.add_neighbor(node3, 3)
    node1.add_neighbor(node4, 4)
    node2.add_neighbor(node4, 6)
    node2.add_neighbor(node5, 5)
    node3.add_neighbor(node4, 5)
    node4.add_neighbor(G, 4)
    node5.add_neighbor(node4, 8)

    # Running A*
    start_time = time()
    shortest_path, solution_cost, nodes_expanded = a_star_search(S, G)
    end_time = time()

    # Outputting the results
    print("Shortest path", shortest_path)
    print("Solution cost:", solution_cost)
    print("Number of nodes expanded:", nodes_expanded)
    print("Time taken to solve: {:.5f} seconds".format(end_time - start_time))


if __name__ == "__main__":
    q1()
    q2()

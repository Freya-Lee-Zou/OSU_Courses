class Node:
    def __init__(self, name, value=None):
        self.name = name
        self.value = value
        self.children = []

    def add_child(self, child):
        self.children.append(child)

def alpha_beta_search(node):
    def max_value(node, alpha, beta):
        if terminal_test(node):
            return node.value
        v = float('-inf')
        for child in node.children:
            v = max(v, min_value(child, alpha, beta))
            if v >= beta:
                pruned_nodes.append(child.name)
                return v
            alpha = max(alpha, v)
        return v

    def min_value(node, alpha, beta):
        if terminal_test(node):
            return node.value
        v = float('inf')
        for child in node.children:
            v = min(v, max_value(child, alpha, beta))
            if v <= alpha:
                pruned_nodes.append(child.name)
                return v
            beta = min(beta, v)
        return v

    def terminal_test(node):
        return len(node.children) == 0

    pruned_nodes = []
    value = max_value(node, float('-inf'), float('inf'))
    return value, pruned_nodes

# Example usage:
if __name__ == "__main__":
    # Create tree nodes
    A = Node('A')
    B = Node('B')
    C = Node('C')
    D = Node('D')
    E = Node('E')
    F = Node('F')
    G = Node('G')
    H = Node('H')
    I = Node('I')
    J = Node('J')
    K = Node('K')
    L = Node('L', 2)
    M = Node('M', 3)
    N = Node('N', 8)
    O = Node('O', 5)
    P = Node('P', 7)
    Q = Node('Q', 6)
    R = Node('R', 0)
    S = Node('S', 1)
    T = Node('T', 5)
    U = Node('U', 2)
    V = Node('V', 8)
    W = Node('W', 4)
    X = Node('X', 10)
    Y = Node('Y', 2)

    # Build the tree structure (as per your image)
    A.add_child(B)
    A.add_child(C)
    A.add_child(D)
    B.add_child(E)
    B.add_child(F)
    B.add_child(G)
    C.add_child(H)
    C.add_child(I)
    D.add_child(J)
    D.add_child(K)
    E.add_child(L)
    E.add_child(M)
    F.add_child(N)
    F.add_child(O)
    G.add_child(P)
    G.add_child(Q)
    H.add_child(R)
    H.add_child(S)
    I.add_child(T)
    I.add_child(U)
    J.add_child(V)
    J.add_child(W)
    K.add_child(X)
    K.add_child(Y)

    # Run alpha-beta pruning
    best_value, pruned_nodes = alpha_beta_search(A)

    print(f"Best Value: {best_value}")
    print(f"Pruned Nodes: {pruned_nodes}")

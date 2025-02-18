class Node:
    def __init__(self, value=None, name=None):
        self.value = value
        self.children = []
        self.name = name
    def add_child(self, child_node):
        self.children.append(child_node)

def buildTree():
    root = Node(name="root")
    nodeB = Node(name="B")
    nodeC = Node(name="C")
    nodeD = Node(name="D")
    nodeE = Node(name="E")
    nodeF = Node(name="F")
    nodeG = Node(name="G")
    nodeH = Node(name="H")
    nodeI = Node(name="I")
    nodeJ = Node(name="J")
    nodeK = Node(name="K")
    nodeL = Node(2, name="L")
    nodeM = Node(3, name="M")
    nodeN = Node(8, name="N")
    nodeO = Node(5, name="O")
    nodeP = Node(7, name="p")
    nodeQ = Node(6, name="q")
    nodeR = Node(0, name="r")
    nodeS = Node(1, name="s")
    nodeT = Node(5, name="t")
    nodeU = Node(2, name="u")
    nodeV = Node(8, name="v")
    nodeW = Node(4, name="w")
    nodeX = Node(10, name="x")
    nodeY = Node(2, name="y")

    root.add_child(nodeB)
    root.add_child(nodeC)
    root.add_child(nodeD)

    nodeB.add_child(nodeE)
    nodeB.add_child(nodeF)
    nodeB.add_child(nodeG)

    nodeC.add_child(nodeH)
    nodeC.add_child(nodeI)

    nodeD.add_child(nodeJ)
    nodeD.add_child(nodeK)

    nodeE.add_child(nodeL)
    nodeE.add_child(nodeM)

    nodeF.add_child(nodeN)
    nodeF.add_child(nodeO)

    nodeG.add_child(nodeP)
    nodeG.add_child(nodeQ)

    nodeH.add_child(nodeR)
    nodeH.add_child(nodeS)

    nodeI.add_child(nodeT)
    nodeI.add_child(nodeU)

    nodeJ.add_child(nodeV)
    nodeJ.add_child(nodeW)

    nodeK.add_child(nodeX)
    nodeK.add_child(nodeY)

    return root

def alpha_beta(node, depth, alpha, beta, maximizing_player):
    if depth == 0 or not node.children:
        return node.value
    
    if maximizing_player:
        max_eval = float('-inf')
        for child in node.children:
            eval = alpha_beta(child, depth-1, alpha, beta, False)
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                print(f"Pruned at node {node.name}, just finished going to: {child.name}")
                break
        return max_eval

    if not maximizing_player:
        min_eval = float('inf')
        for child in node.children:
            eval = alpha_beta(child, depth-1, alpha, beta, True)
            min_eval = min(eval, min_eval)
            beta = min(beta, eval)
            if beta <= alpha:
                print(f"Pruned at node {node.name}, just finished going to: {child.name}")
                break
        return min_eval

root = buildTree()
result = alpha_beta(root, depth=4, alpha=float('-inf'), beta=float('inf'), maximizing_player=True)
print(result)




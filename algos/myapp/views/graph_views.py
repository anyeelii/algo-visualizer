from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import GraphSearchSerializer

class DepthFirstSearchView(APIView):
    def post(self, request):
        serializer = GraphSearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        graph = serializer.validated_data['graph']
        start = serializer.validated_data['start']

        visited = []
        steps = []

        # Added 'parent' to track where we came from
        def dfs(node, parent=None):
            if node in visited:
                return
            visited.append(node)
            
            # Action: Visiting a new node
            steps.append({
                "action": "visit",
                "node": node,
                "parent": parent,
                "current": len(visited) - 1,
                "visited": visited.copy()
            })
            
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    dfs(neighbor, node)
                    
                    # Action: Backtracking after returning from a neighbor
                    steps.append({
                        "action": "backtrack",
                        "node": node,
                        "from_node": neighbor,
                        "current": visited.index(node), # Shift focus back to the parent
                        "visited": visited.copy()
                    })

        dfs(start, None)
        
        # Action: Finished
        if steps:
            steps.append({
                "action": "complete",
                "current": -1, # No active node
                "visited": visited.copy()
            })
            
        return Response({"steps": steps}, status=status.HTTP_200_OK)


class BreadthFirstSearchView(APIView):
    def post(self, request):
        serializer = GraphSearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        graph = serializer.validated_data['graph']
        start = serializer.validated_data['start']

        visited = []
        steps = []
        queue = []

        if start:
            queue.append(start)
            visited.append(start)

            steps.append({
                "action": "visit",
                "node": start,
                "parent": None,
                "current": visited.index(start),
                "visited": visited.copy()
            })

            while queue:
                current_node = queue.pop(0)

                steps.append({
                    "action": "explore",
                    "node": current_node,
                    "current": visited.index(current_node),
                    "visited": visited.copy()
                })

                for neighbor in graph.get(current_node, []):
                    if neighbor not in visited:
                        visited.append(neighbor)
                        queue.append(neighbor)

                        steps.append({
                                "action": "visit",
                                "node": neighbor,
                                "parent": current_node,
                                "current": visited.index(neighbor),
                                "visited": visited.copy()
                            })
        if steps:
            steps.append({
                "action": "complete",
                "current": -1,
                "visited": visited.copy()
            })

        return Response({"steps": steps}, status=status.HTTP_200_OK)
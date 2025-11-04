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

        def dfs(node):
            if node in visited:
                return
            visited.append(node)
            steps.append({"visit": node, "visited": visited.copy()})
            for neighbor in graph.get(node, []):
                dfs(neighbor)

        dfs(start)
        return Response({"steps": steps}, status=status.HTTP_200_OK)
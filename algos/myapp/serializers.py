from rest_framework import serializers

# For array-based algorithms (Binary, Linear)
class ArraySearchSerializer(serializers.Serializer):
    array = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Sorted or unsorted list of integers"
    )
    target = serializers.IntegerField(help_text="Target value to find")


# For graph-based algorithms (DFS, BFS)
class GraphSearchSerializer(serializers.Serializer):
    graph = serializers.DictField(
        child=serializers.ListField(child=serializers.CharField()),
        help_text="Adjacency list representation of the graph"
    )
    start = serializers.CharField(help_text="Starting node for traversal")
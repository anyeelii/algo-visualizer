from django.urls import path
from .views.array_views import BinarySearchView
from .views.graph_views import DepthFirstSearchView, BreadthFirstSearchView

urlpatterns = [
    # Array-based search algorithms
    path("api/array-searches/binary/", BinarySearchView.as_view(), name="binary-search"),

    # Graph-based search algorithms
    path("api/graph-searches/dfs/", DepthFirstSearchView.as_view(), name="dfs-search"),
    path("api/graph-searches/bfs/", BreadthFirstSearchView.as_view(), name="bfs-search"),

]
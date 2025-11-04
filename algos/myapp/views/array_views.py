from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import ArraySearchSerializer


class MergeSortView(APIView):
    def post(self, request):
        serializer = ArraySearchSerializer(data=request.data)



class BinarySearchView(APIView):
    def post(self, request):
        serializer = ArraySearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        arr = serializer.validated_data['array']
        target = serializer.validated_data['target']

        steps = []
        l, r = 0, len(arr) - 1

        while l <= r:
            m = (l + r) // 2
            step = {"left": l, "mid": m, "right": r, "mid_value": arr[m]}
            if arr[m] == target:
                step["found"] = True
                steps.append(step)
                break
            elif arr[m] < target:
                steps.append(step)
                l = m + 1
            else:
                steps.append(step)
                r = m - 1

        return Response({"steps": steps}, status=status.HTTP_200_OK)
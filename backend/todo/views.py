from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView

from .serializers import TodoSerializer
from .models import Todo

# Create your views here.


class TodoViewSet(ModelViewSet):
    """
    View for creating deleting and updating todos.
    Only fetching the todos which are not deleted.
    """

    permission_classes = [AllowAny]
    queryset = Todo.objects.filter(is_deleted=False)
    serializer_class = TodoSerializer


class BulkDestroyView(APIView):
    def delete(self, request, *args, **kwargs):
        todo_ids = request.data.get("todo_ids", [])
        if not todo_ids:
            return Response(
                {"error": "No todo IDs provided."}, status=HTTP_400_BAD_REQUEST
            )

        Todo.objects.filter(id__in=todo_ids).delete()
        return Response(
            {"message": "Selected todos deleted successfully."},
            status=HTTP_204_NO_CONTENT,
        )

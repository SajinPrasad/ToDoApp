from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

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
    
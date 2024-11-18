from rest_framework.serializers import ModelSerializer
from rest_framework.exceptions import ValidationError, NotFound
from datetime import datetime

from .models import Todo


class TodoSerializer(ModelSerializer):
    """
    Serializer for model Todo.
    Validating creating and editing todos.
    """

    class Meta:
        model = Todo
        fields = [
            "id",
            "title",
            "description",
            "deadline",
            "is_completed",
            "is_deleted",
        ]

    def validate(self, attrs):
        title = attrs.get("title", "")
        deadline = attrs.get("deadline", "")

        # Validate title
        if title:
            if Todo.objects.filter(title=title).exists():
                raise ValidationError("A Todo with this title already exists.")

        # Validate deadline
        if deadline:
            current_time = datetime.now()
            if deadline < current_time:
                raise ValidationError("The deadline cannot be in the past.")

        return attrs
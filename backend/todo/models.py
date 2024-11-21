from django.db import models

# Create your models here.


class Todo(models.Model):
    """ToDo Model"""

    title = models.CharField(max_length=150, unique=True)
    description = models.TextField()
    deadline = models.DateTimeField()
    is_completed = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['deadline']
        
    def __str__(self):
        return self.title

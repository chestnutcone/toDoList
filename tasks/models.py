from django.db import models

# Create your models here.
class Status(models.Model):
    status_name = models.CharField(max_length=30)

    def __str__(self):
        return self.status_name

    @staticmethod
    def aggregate_json_format(queryset):
        return [str(s) for s in queryset]

class Task(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    status = models.ForeignKey(Status,
                               on_delete=models.SET_NULL,
                               null=True,
                               blank=True)
    due_date = models.DateField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def json_format(self):
        result = {'title': self.title,
                  'description': self.description,
                  'status':self.status.status_name,
                  'due_date': str(self.due_date),}
        return result

    @staticmethod
    def aggregate_json_format(queryset):
        return {str(t.created): t.json_format() for t in queryset}




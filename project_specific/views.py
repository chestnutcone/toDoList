from django.shortcuts import render
from tasks.models import Task, Status
from django.http import HttpResponseRedirect, HttpResponse
import json
import datetime
from dateutil.parser import parse

# Create your views here.
def main_view(request):
    if request.method == "GET":
        tasks = Task.aggregate_json_format(Task.objects.all())
        status = Status.aggregate_json_format(Status.objects.all())
        return render(request, 'project_specific/index.html', context={"tasks": tasks,
                                                                       "status": status})
    elif request.method == 'POST':
        str_data = request.body
        str_data = str_data.decode('utf-8')
        json_data = json.loads(str_data)
        status = True
        status_detail = ""

        try:
            if json_data['action'] == 'remove':
                created_dates = json_data['created_dates']
                for str_time in created_dates:
                    created_time = parse(str_time)
                    Task.objects.get(created=created_time).delete()

            elif json_data['action'] == 'edit':
                tasks = json_data['tasks']
                for k,v in tasks.items():
                    created_time = parse(k)
                    task = Task.objects.get(created=created_time)
                    task.title = v['title']
                    task.description = v['description']

                    task_status = Status.objects.get(status_name=v['status'])
                    task.status = task_status
                    task.due_date = parse(v['due_date'])
                    task.save()

            elif json_data['action'] == 'add':
                task_status = Status.objects.get(status_name=json_data['status'])
                new_task = Task(title=json_data['title'],
                                description=json_data['description'],
                                due_date=json_data['due_date'],
                                status=task_status,
                                )
                new_task.save()
        except Exception as e:
            status = False
            status_detail = str(e)

        return HttpResponse(json.dumps({'status': status,
                                        'status_detail': status_detail}), content_type='application/json')

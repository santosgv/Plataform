import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE','Plataform.settings')

app =Celery('Plataform')

app.conf.enable_utc= False
app.conf.update(timezone ='America/Sao_Paulo')

app.config_from_object('django.conf.settings',namespace='CELERY')


app.conf.beat_schedule ={
    'desativar_clientes_todos_os_dias':{
        'task':'Cliente.tasks.desativar_clientes',
        'schedule': crontab(minute=0, hour=0)
    }
}

app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
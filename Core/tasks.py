from celery import shared_task

@shared_task
def minha_tarefa():
    return 'teste'
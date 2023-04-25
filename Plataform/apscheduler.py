from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.models import DjangoJobExecution
from django.utils import timezone
from Cliente.models import Cliente


def desativar_cliente():
    clientes = Cliente.objects.filter(is_active=True, pago_ate__lte=timezone.now())
    for cliente in clientes:
        cliente.is_active = False
        cliente.save()


scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), "default")
scheduler.add_job(
    desativar_cliente,
    "interval",
    minutes=2,  # intervalo de tempo para executar a função
    id="desativar_cliente",
    replace_existing=True,
)
scheduler.start()
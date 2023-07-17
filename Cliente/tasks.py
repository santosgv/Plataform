from celery import shared_task
from django_tenants.utils import tenant_context,get_tenant_model,schema_context
from django.utils import timezone
from .models import Cliente
from django.contrib.auth.models import User
from django.core.mail import send_mail
from decouple import config
from celery import Celery


tenant_model = get_tenant_model()
tenants = tenant_model.objects.all()

class TenantAwareCelery(Celery):
    def execute(self, *args, **kwargs):
        tenant_id = kwargs.pop('tenant_id', None)
        if tenant_id is not None:
            tenant_model = get_tenant_model()
            try:
                tenant = tenant_model.objects.get(id=tenant_id)
            except tenant_model.DoesNotExist:
                raise ValueError(f"Tenant {tenant_id} does not exist")
            set_current_tenant(tenant)
            set_tenant_schema_name(tenant.schema_name)
        return super().execute(*args, **kwargs)


@shared_task
def Envia_email_com_super_usuario(client):
    subject = 'Novo Cliente Criado'
    message = f'''O Cliente {client.nome} foi criado com sucesso!
    Nome do Banco : {client.schema_name}
    Usuario Administrador : {client.schema_name}
    Senha Administrador : {client.schema_name}
    valido ate : {client.pago_ate}
    Descricao : {client.descricao}
    '''
    from_email = config('EMAIL_HOST_USER')
    recipient_list = [config('recipient_list')]
    #send_mail(subject, message, from_email, recipient_list, fail_silently=False)
    return 'email disparado'


@shared_task
def desativar_clientes():
    today = timezone.now().date()
    clientes = Cliente.objects.filter(pago_ate__lt=today, is_active=True)
    for cliente in clientes:
        with schema_context(cliente.schema_name):
            cliente.is_active = False
            cliente.save()
            return 'Desativado o cliente por falta de pagamento'

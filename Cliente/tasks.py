from celery import shared_task
from django_tenants.utils import tenant_context
from django.utils import timezone
from .models import Cliente
from django.contrib.auth.models import User
from django.core.mail import send_mail
from decouple import config

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
    send_mail(subject, message, from_email, recipient_list, fail_silently=False)
    return 'email disparado'


@shared_task
def desativar_clientes(instance_id):
     try:
         instance = Cliente.objects.get(id=instance_id)
         if not instance.is_active_now():
             instance.is_active = False
             instance.save()
 
             # adiciona o resultado ao banco redis
             return 'cliente desativado'
     except Cliente.DoesNotExist:
         return 'cliente nao existe'
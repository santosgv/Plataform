from celery import shared_task
from django.core.mail import send_mail
from decouple import config
from django_tenants.utils import schema_context
from django.contrib.auth.models import User
from .models import Cliente

@shared_task
def created_user_client(client):
    with schema_context(client.schema_name):
        super_user = User.objects.create_superuser(
            username=client.schema_name,
            first_name=client.nome,
            password=client.schema_name
        )
        super_user.save()
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

        # adiciona o resultado ao banco redis
        return subject

@shared_task
def desativar_cliente(instance_id):
    try:
        instance = Cliente.objects.get(id=instance_id)
        if not instance.is_active_now():
            instance.is_active = False
            instance.save()

            # adiciona o resultado ao banco redis
            return 'cliente desativado'
    except Cliente.DoesNotExist:
        pass
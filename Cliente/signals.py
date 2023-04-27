from django.dispatch import receiver
from django_tenants.signals import  post_schema_sync
from django.db.models.signals import pre_save
from django_tenants.models import TenantMixin
from django.utils import timezone
from .models import Cliente
from django_tenants.utils import tenant_context
from django.contrib.auth.models import User
from django.core.mail import send_mail
from decouple import config
from .tasks import Envia_email_com_super_usuario,desativar_clientes

@receiver(post_schema_sync, sender=TenantMixin)
def created_user_client(sender, **kwargs):
    client = kwargs['tenant']
    with tenant_context(client):
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
        return 'Super Usuario Criado'
    

@receiver(pre_save, sender=Cliente)
def desativar_cliente(sender, instance, **kwargs):
	if not instance.is_active_now():       instance.is_active = False
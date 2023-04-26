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
from .tasks import created_user_client

@receiver(post_schema_sync, sender=TenantMixin)
def created_user_client(sender, **kwargs):
    client = kwargs['tenant']
    with tenant_context(client):
        created_user_client.delay(client)

@receiver(pre_save, sender=Cliente)
def desativar_cliente(sender, instance, **kwargs):
    desativar_cliente.delay(instance.id)

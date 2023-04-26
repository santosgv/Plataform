from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Pedido
from .tasks import enviar_email_novo_pedido



    
@receiver(post_save, sender=Pedido)
def pedido_salvo(sender, instance,created, **kwargs):
    if created == True:
        enviar_email_novo_pedido.delay(instance.id)
   
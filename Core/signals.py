from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Pedido
    
@receiver(post_save, sender=Pedido)
def pedido_salvo(sender, instance,created, **kwargs):
    if created == True:
        print('Novo pedido Criado')
   
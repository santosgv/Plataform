from pathlib import Path
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Pedido
from django.core.mail import send_mail
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

    
@receiver(post_save, sender=Pedido)
def pedido_salvo(sender, instance,created, **kwargs):
    if created == True:
        subject = 'Novo pedido criado'
        message = f'O pedido {instance.id} foi criado com sucesso!'
        #from_email = config('EMAIL_HOST_USER')
        #recipient_list = config('recipient_list')
        #send_mail(subject, message, from_email, recipient_list, fail_silently=False)
   
from celery import shared_task
from django.core.mail import send_mail
from decouple import config

@shared_task
def enviar_email_novo_pedido(pedido_id):
    subject = 'Novo pedido criado'
    message = f'O pedido {pedido_id} foi criado com sucesso!'
    #from_email = config('EMAIL_HOST_USER')
    #recipient_list = [config('recipient_list')]
    #send_mail(subject, message, from_email, recipient_list, fail_silently=False)
    #return message
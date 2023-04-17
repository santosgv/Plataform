from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Core'

    def ready(self):
        from django.db.models.signals import pre_save
        from .models import Pedido
        from .signals import pedido_salvo
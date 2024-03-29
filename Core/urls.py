
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.urls import reverse
from django.utils.html import format_html

app_name ='Core'

urlpatterns = [
    path("", views.index, name='index'),
    path("sobre", views.sobre, name='sobre'),
    path("termos", views.termos, name='termos'),
    path("politica", views.politica, name='politica'),
    path("pricing",views.pricing, name='pricing'),
    path("categoria/<int:id>", views.categoria , name='categoria'),
    path("produto/<int:id>", views.produto, name='produto'),
    path("add_carrinho", views.add_carrinho, name='add_carrinho'),
    path("ver_carrinho", views.ver_carrinho, name='ver_carrinho'),
    path("remover_carrinho/<int:id>", views.remover_carrinho, name='remover_carrinho'),
    path("finalizar_pedido/", views.finalizar_pedido, name='finalizar_pedido'),
    path("validaCupom/", views.validaCupom, name='validaCupom'),
    path("freteBairro/", views.freteBairro, name='freteBairro'),
    path("dashbords/", views.dashbords, name='dashbords'),
    path("total_vendas/", views.total_vendas, name='total_vendas'),
    path("ticket_medio/", views.ticket_medio, name='ticket_medio'),
    path("mais_vendidos/", views.mais_vendidos, name='mais_vendidos'),
    path("bairro_mais_pedido/", views.bairro_mais_pedido, name='bairro_mais_pedido'),
    path("vendas_ultimos_12_meses/", views.vendas_ultimos_12_meses, name='vendas_ultimos_12_meses'),
    path("sinalizar_pedidos/", views.sinalizar_pedidos, name='sinalizar_pedidos'),
    path("transacoes_mensais/", views.transacoes_mensais, name='transacoes_mensais'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path("categoria/<int:id>", views.categoria , name='categoria'),
    path("produto/<int:id>", views.produto, name='produto'),
    path("add_carrinho", views.add_carrinho, name='add_carrinho'),
    path("ver_carrinho", views.ver_carrinho, name='ver_carrinho'),
    path("remover_carrinho/<int:id>", views.remover_carrinho, name='remover_carrinho'),
    path("login/", views.login, name='login'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
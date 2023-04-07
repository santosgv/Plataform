from django.shortcuts import render
from .models import Produto

def index(response):
    Produtos = Produto.objects.all()
    print(Produtos)
    return render(response,'index.html',{'Produtos':Produtos})

def produto(response):
    return render(response,'templates/home')
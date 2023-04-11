from django.shortcuts import render
from .models import Produto,Categoria

def index(response):
    Categorias = Categoria.objects.all()
    Produtos = Produto.objects.all()
    print(Produtos)
    return render(response,'index.html',{'Produtos':Produtos,
                                         'Categorias':Categorias})

def produto(response):
    return render(response,'templates/home')
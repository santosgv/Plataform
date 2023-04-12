from django.shortcuts import render
from .models import Produto,Categoria

def index(response):
    Categorias = Categoria.objects.all()
    Produtos = Produto.objects.all().filter(ativo=True)
    return render(response,'index.html',{
                                         'Categorias':Categorias,
                                         'Produtos':Produtos,
                                         })

def categoria(response,id):
    Categorias = Categoria.objects.all()
    Produtos = Produto.objects.all().filter(categoria=id).filter(ativo=True)

    return render(response,'index.html',{
                                         'Produtos':Produtos,
                                         'Categorias':Categorias,
                                         })

def login(response):
    return render(response,'login.html')
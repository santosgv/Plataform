from django.shortcuts import render

def index(response):
    return render(response,'index.html')

def produto(response):
    return render(response,'templates/home')
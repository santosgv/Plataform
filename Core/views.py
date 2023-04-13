import json
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import Adicional, CupomDesconto, ItemPedido, Opcao, Pedido, Produto,Categoria , Bairro , MeioPagamento
from django.contrib import messages
from django.contrib.messages import constants

def index(request):
    if not request.session.get('carrinho'):
        request.session['carrinho'] = []
        request.session.save()
    Categorias = Categoria.objects.all()
    Produtos = Produto.objects.all().filter(ativo=True)
    return render(request,'index.html',{
                                         'Categorias':Categorias,
                                         'Produtos':Produtos,
                                          'carrinho': len(request.session['carrinho']),
                                         })

def categoria(request,id):
    if not request.session.get('carrinho'):
        request.session['carrinho'] = []
        request.session.save()
    Categorias = Categoria.objects.all()
    Produtos = Produto.objects.all().filter(categoria=id).filter(ativo=True)

    return render(request,'index.html',{
                                         'Produtos':Produtos,
                                         'Categorias':Categorias,
                                         })

def login(request):
    return render(request,'login.html')

def produto(request, id):
    if not request.session.get('carrinho'):
        request.session['carrinho'] = []
        request.session.save()
    produto = Produto.objects.filter(id=id)[0]

    return render(request, 'produto.html', {'produto': produto,
                                            'carrinho': len(request.session['carrinho']),
                                           })



def add_carrinho(request):
    if not request.session.get('carrinho'):
        request.session['carrinho'] = []
        request.session.save()

    x = dict(request.POST)

    def removeLixo():
        adicionais = x.copy()
        adicionais.pop('id')
        adicionais.pop('csrfmiddlewaretoken')
        adicionais.pop('observacoes')
        adicionais.pop('quantidade')
        adicionais = list(adicionais.items())

        return adicionais

    adicionais = removeLixo()

    id = int(x['id'][0])
    preco_total = Produto.objects.filter(id=id)[0].preco
    adicionais_verifica = Adicional.objects.filter(produto=id)
    aprovado = True

    for i in adicionais_verifica:
        encontrou = False
        minimo = i.minimo
        maximo = i.maximo
        for j in adicionais:
            if i.nome == j[0]:
                encontrou = True
                if len(j[1]) < minimo or len(j[1]) > maximo:
                    aprovado = False
        if minimo > 0 and encontrou == False:
            aprovado = False

    if not aprovado:
        messages.add_message(request, constants.ERROR, 'Confira a quantidade de adicionais selecionados')
        return redirect(f'/produto/{id}')

    for i, j in adicionais:
        for k in j:
            preco_total += Opcao.objects.filter(id=int(k))[0].acrecimo

    def troca_id_por_nome_adicional(adicional):
        adicionais_com_nome = []
        for i in adicionais:
            opcoes = []
            for j in i[1]:
                op = Opcao.objects.filter(id=int(j))[0].nome
                opcoes.append(op)
            adicionais_com_nome.append((i[0], opcoes))
        return adicionais_com_nome

    adicionais = troca_id_por_nome_adicional(adicionais)

    preco_total *= int(x['quantidade'][0])
    data = {'id_produto': int(x['id'][0]),
            'observacoes': x['observacoes'][0],
            'preco': preco_total,
            'adicionais': adicionais,
            'quantidade': x['quantidade'][0]}

    request.session['carrinho'].append(data)
    request.session.save()

    return redirect('index')



def ver_carrinho(request):
    categorias = Categoria.objects.all()
    dados_motrar = []
    for i in request.session['carrinho']:
        prod = Produto.objects.filter(id=i['id_produto'])
        dados_motrar.append(
            {'imagem': prod[0].img.url,
             'nome': prod[0].nome_produto,
             'quantidade': i['quantidade'],
             'observacoes': i['observacoes'],
             'preco': i['preco'],
             'id': i['id_produto']
             }
        )
    total = sum([float(i['preco']) for i in request.session['carrinho']])

    return render(request, 'carrinho.html', {'dados': dados_motrar,
                                             'total': total,
                                             'carrinho': len(request.session['carrinho']),
                                             'categorias': categorias
                                             })
def remover_carrinho(request, id):
    request.session['carrinho'].pop(id)
    request.session.save()
    return redirect('/ver_carrinho')


def finalizar_pedido(request):
    if request.method == "GET":
        categorias = Categoria.objects.all()
        bairros = Bairro.objects.all()
        meiosPagamento = MeioPagamento.objects.all()
        total = sum([float(i['preco']) for i in request.session['carrinho']])
        return render(request, 'finalizar_pedido.html', {'carrinho': len(request.session['carrinho']),
                                                         'bairros': bairros,
                                                         'meiosPagamento':meiosPagamento,
                                                         'categorias': categorias,
                                                         'total': total,
                                                         })
    else:
        if len(request.session['carrinho']) > 0:
            x = request.POST
            total = sum([float(i['preco']) for i in request.session['carrinho']])
            cupom = CupomDesconto.objects.filter(codigo=x['cupom'])
            cupom_salvar = None
            if len(cupom) > 0 and cupom[0].ativo:
                total = total - ((total * cupom[0].desconto) / 100)
                cupom[0].usos += 1
                cupom[0].save()
                cupom_salvar = cupom[0]

            carrinho = request.session.get('carrinho')
            listaCarrinho = []
            for i in carrinho:
                listaCarrinho.append({
                    'produto': Produto.objects.filter(id=i['id_produto'])[0],
                    'observacoes': i['observacoes'],
                    'preco': i['preco'],
                    'adicionais': i['adicionais'],
                    'quantidade': i['quantidade'],
                })

            lambda_func_troco = lambda x: int(x['troco_para']) - total if not x['troco_para'] == '' else ""
            lambda_func_pagamento = lambda x: 'Cartão' if x['meio_pagamento'] == '2' else 'Dinheiro'
            pedido = Pedido(usuario=x['nome'],
                            total=total,
                            troco=lambda_func_troco(x),
                            cupom=cupom_salvar,
                            pagamento=lambda_func_pagamento(x),
                            ponto_referencia=x['pt_referencia'],
                            cep=x['cep'],
                            rua=x['rua'],
                            numero=x['numero'],
                            bairro=x['bairro'],
                            telefone=x['telefone'],
                            )
            pedido.save()

            ItemPedido.objects.bulk_create(
                ItemPedido(
                    pedido=pedido,
                    produto=v['produto'],
                    quantidade=v['quantidade'],
                    preco=v['preco'],
                    descricao=v['observacoes'],
                    adicionais=str(v['adicionais'])
                ) for v in listaCarrinho

            )

            request.session['carrinho'].clear()
            request.session.save()
            return render(request, 'pedido_realizado.html')
        else:
            messages.add_message(request, constants.ERROR, 'Escolha ao menos um produto antes de efetuar a compra!')
            return redirect('/pedidofinalizar_pedido/')

def validaCupom(request):
    cupom = request.POST.get('cupom')
    cupom = CupomDesconto.objects.filter(codigo = cupom)
    if len(cupom) > 0 and cupom[0].ativo:
        desconto = cupom[0].desconto
        total = sum([float(i['preco']) for i in request.session['carrinho']])
        total_com_desconto = total - ((total*desconto)/100)
        data_json = json.dumps({'status': 0,
                                'desconto': desconto,
                                'total_com_desconto': str(total_com_desconto).replace('.', ',')

                                })
        return HttpResponse(data_json)
    else:
        return HttpResponse(json.dumps({'status': 1}))
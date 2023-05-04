from django.contrib import admin
from .models import Aviso, Categoria, CupomDesconto, ItemPedido, Loja, Pedido, Produto, Adicional, Opcao,Bairro

# Actions

@admin.action(description="Realizar Entregas Selecionadas")
def action_entregar_pedidos(modeladmin,request,queryset):
    for pedido in queryset:
        pedido.entregue =True
        pedido.save()

@admin.action(description="Desativar Produtos Selecionados")
def action_desativar_produtos(modeladmin,request,queryset):
    for produto in queryset:
        produto.ativo =False
        produto.save()

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('icone', 'nome_produto', 'categoria', 'preco', 'ativo')
    list_editable = ('preco','ativo')
    actions= [action_desativar_produtos,]

@admin.register(Loja)
class LojaAdmin(admin.ModelAdmin):
    list_display=('nome_Loja','aberta','texto')
    list_editable=('aberta',)

@admin.register(Opcao)
class OpcaoAdmin(admin.ModelAdmin):
    list_display=('nome','acrecimo','ativo')
    list_editable= ('acrecimo','ativo',)
    list_filter=('nome','ativo')

@admin.register(Bairro)
class BairroAdmin(admin.ModelAdmin):
    list_display=('Nome','Frete')
    list_editable=('Frete',)
    list_filter=('Nome','Frete')

@admin.register(CupomDesconto)
class CupomDescontoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'desconto', 'ativo')
    readonly_fields=('usos',)
    list_editable= ('ativo',)


@admin.register(Adicional)
class AdicionalAdmin(admin.ModelAdmin):
    list_display = ('nome', 'maximo', 'minimo','ativo')
    list_editable=('maximo', 'minimo','ativo')


class itemPedidoInline(admin.TabularInline):
    list_display = ('observacoes')
    readonly_fields = ('produto', 'quantidade', 'preco', 'descricao', 'adicionais','id',)
    model = ItemPedido
    extra = 0



class PedidoAdmin(admin.ModelAdmin):
    inlines = [
        itemPedidoInline
    ]
    list_display = ('id','usuario', 'total','data','entregue',)
    search_fields = ('entregue',)
    readonly_fields = ('usuario', 'total','cupom','frete', 'troco', 'pagamento', 'ponto_referencia', 'data', 'cep', 'rua', 'numero', 'bairro', 'telefone')
    list_filter = ('entregue','data',)
    actions = [action_entregar_pedidos,]


admin.site.register(Pedido, PedidoAdmin)

admin.site.register(Categoria)
admin.site.register(Aviso)


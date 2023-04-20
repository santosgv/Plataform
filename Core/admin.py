from django.contrib import admin
from .models import Aviso, Categoria, CupomDesconto, ItemPedido, Logo, Pedido, Produto, Adicional, Opcao,Bairro



@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('icone', 'nome_produto', 'categoria', 'preco', 'ativo')
    list_editable = ('preco','ativo')



@admin.register(CupomDesconto)
class CupomDescontoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'desconto', 'ativo')
    readonly_fields=('usos',)


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
    readonly_fields = ('usuario', 'total', 'troco', 'pagamento', 'ponto_referencia', 'data', 'cep', 'rua', 'numero', 'bairro', 'telefone')
    list_filter = ('entregue','data',)

admin.site.register(Pedido, PedidoAdmin)

admin.site.register(Categoria)
admin.site.register(Adicional)
admin.site.register(Opcao)
admin.site.register(Bairro)
admin.site.register(Aviso)
admin.site.register(Logo)




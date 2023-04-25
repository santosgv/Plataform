from django.contrib import admin
from .models import Aviso, Categoria, CupomDesconto, ItemPedido, Loja, Pedido, Produto, Adicional, Opcao,Bairro



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
    readonly_fields = ('usuario', 'total','cupom','frete', 'troco', 'pagamento', 'ponto_referencia', 'data', 'cep', 'rua', 'numero', 'bairro', 'telefone')
    list_filter = ('entregue','data',)


admin.site.register(Pedido, PedidoAdmin)

admin.site.register(Categoria)
admin.site.register(Adicional)
admin.site.register(Opcao)
admin.site.register(Bairro)
admin.site.register(Aviso)
admin.site.register(Loja)




class MyAdminSite(admin.AdminSite):
    disable_add_button = False

    def has_add_permission(self, request):
        return not self.disable_add_button
    
my_admin_site = MyAdminSite(name='myadmin')


@admin.register(Produto, site=my_admin_site)
class MyModel1Admin(admin.ModelAdmin):
    def get_urls(self):
        urls = super().get_urls()
        if my_admin_site.disable_add_button:
            return []
        return urls

    def has_change_permission(self, request, obj=None):
        return not my_admin_site.disable_add_button

    def has_delete_permission(self, request, obj=None):
        return not my_admin_site.disable_add_button
from django.db import models
from datetime import datetime
from django.utils.safestring import mark_safe

class Categoria(models.Model):
    categoria = models.CharField(max_length=200)

    def __str__(self):
        return self.categoria

class Opcao(models.Model):
    nome = models.CharField(max_length=100)
    acrecimo = models.FloatField(default=0)
    ativo = models.BooleanField(default=True)
    def __str__(self):
        return self.nome

class Adicional(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    maximo = models.IntegerField()
    minimo = models.IntegerField()
    opcoes = models.ManyToManyField(Opcao)
    ativo = models.BooleanField(default=True)
    def __str__(self):
        return self.nome

class Produto(models.Model):
    nome_produto = models.CharField(max_length=100)
    img = models.ImageField(upload_to='post_img')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    preco = models.FloatField()
    descricao = models.TextField()
    ingredientes = models.CharField(max_length=2000)
    adicionais = models.ManyToManyField(Adicional, blank=True)
    ativo = models.BooleanField(default=True)

    @mark_safe
    def icone(self):
        return f'<img width="30px" src="/media/{self.img}">'


    def __str__(self):
        return self.nome_produto
    
class Bairro(models.Model):
    Nome = models.CharField(max_length=100)
    Frete = models.FloatField()

    def __str__(self):
        return self.Nome
   
class CupomDesconto(models.Model):
    codigo = models.CharField(max_length=8, unique=True)
    desconto = models.FloatField()
    usos = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.codigo

class Pedido(models.Model):
    usuario = models.CharField(max_length=200)
    total = models.FloatField()
    troco = models.CharField(blank=True, max_length=20)
    cupom = models.ForeignKey(CupomDesconto, null=True, blank=True, on_delete=models.DO_NOTHING)
    pagamento = models.CharField(max_length=20)
    ponto_referencia = models.CharField(max_length=2000, blank=True)
    data = models.DateTimeField(default=datetime.now())
    cep = models.CharField(max_length=50, blank=True)
    rua = models.CharField(max_length=200)
    numero = models.CharField(max_length=10)
    bairro = models.CharField(max_length=200, blank=True)
    telefone = models.CharField(max_length=30)
    entregue = models.BooleanField(default=False)

    def __str__(self):
        return self.usuario

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    preco = models.FloatField()
    descricao = models.TextField()
    adicionais = models.TextField()

class Aviso(models.Model):
    PAGINAS = (
        ('1','Pagina Inicial'),
        ('2','Pagina de Obrigado')
    )
    MESSAGE_TAGS =(
        ('alert-success','Sucesso'),
        ('alert-info','Informativo'),
        ('alert-warning','Aviso'),
    )
    mensagem = models.TextField()
    para = models.CharField(max_length=1, choices=PAGINAS,default='1')
    ativo = models.BooleanField(default=True)
    tag = models.CharField(max_length=50,choices=MESSAGE_TAGS, default='alert-info')

    def __str__(self) -> str:
        return self.mensagem
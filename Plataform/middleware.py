from django.http import HttpResponse
from django_tenants.middleware.main import TenantMainMiddleware
from django_tenants.utils import get_tenant_model,remove_www

class TenantActiveMiddleware(TenantMainMiddleware):
    def process_request(self, request):
        # Get the current tenant
        tenant = request.tenant

        # Get the Tenant model
        TenantModel = get_tenant_model()

        # Check if the tenant is active
        if not TenantModel.objects.filter(schema_name=tenant.schema_name, is_active=True).exists():
            return HttpResponse("Cliente esta Inativo.", status=403)

        # Continue with the request if the tenant is active
        response = super().process_request(request)
        return response

class RemoveWWWMiddleware(TenantMainMiddleware):
    """
    Middleware que remove o 'www.' inicial da requisição antes de identificar o Tenant correspondente.
    """
    def process_request(self, request):
        hostname = remove_www(request.get_host().split(":")[0]).lower()
        TenantModel = get_tenant_model()

        try:
            tenant = TenantModel.objects.get(domains__contains=[hostname])
            request.tenant = tenant
        except TenantModel.DoesNotExist:
            pass

        if request.get_host() != hostname:
            return HttpResponsePermanentRedirect("{}://{}".format(request.scheme, hostname) + request.path)
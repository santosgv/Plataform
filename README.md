# Plataform
 Plataform with Django SaaS

# run the migrations
~~~linux
python manage.py makemigrations
~~~
# You may need to run migrations for specific app
~~~linux
python manage.py makemigrations Core
~~~
# Apply migrations
~~~linux
python manage.py migrate_schemas
~~~

-> Setup Initial User, Tenant and Admin

# create first user
~~~linux
python manage.py createsuperuser
~~~
# Create the Public Schema
~~~linux
python manage.py create_tenant
~~~
# Create the Administrator
~~~linux
python manage.py create_tenant_superuser
python manage.py runserver
~~~

# precisa do banco redis instalado para rodar as funçoes como envio de email e desativar clientes apos a data de pagamento

# Rodar o celery com o flower
~~~linux
celery -A Plataform flower --loglevel=INFO
~~~

# Rodar o celery worker
~~~linux
celery -A Plataform worker --loglevel=INFO
~~~

# Rodar o celery worker
~~~linux
celery -A Plataform beat -l INFO
~~~


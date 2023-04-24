# Plataform
 Plataform with Django SaaS

# run o Tenent
~~~linux
python manage.py makemigrations
# You may need to run migrations for specific app
~~~linux
python manage.py makemigrations Core
# Apply migrations
~~~
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
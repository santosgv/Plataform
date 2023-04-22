# Plataform
 Plataform with Django Rest API and Vue.js

# Rodar o Tenent

python manage.py makemigrations
# You may need to run migrations for specific app
python manage.py makemigrations Core
# Apply migrations
python manage.py migrate_schemas


-> Setup Initial User, Tenant and Admin

# create first user
python manage.py createsuperuser
# Create the Public Schema
python manage.py create_tenant
# Create the Administrator
python manage.py create_tenant_superuser
python manage.py runserver
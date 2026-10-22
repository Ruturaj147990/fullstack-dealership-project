import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')

application = get_wsgi_application()
app = application

# Auto-migration and initial seed check on serverless startup
try:
    from django.core.management import call_command
    from djangoapp.models import Dealership
    if Dealership.objects.count() == 0:
        call_command('migrate', interactive=False)
        from djangoapp.populate import initiate
        initiate()
        from django.contrib.auth.models import User
        if not User.objects.filter(username='root').exists():
            User.objects.create_superuser('root', 'root@example.com', 'RootPass123!@#')
        if not User.objects.filter(username='demo_user').exists():
            User.objects.create_user('demo_user', 'demo@example.com', 'DemoUserPass123!')
except Exception as e:
    pass

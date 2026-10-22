import os
import sys
from pathlib import Path

# Add server directory to sys.path
root_dir = Path(__file__).resolve().parent.parent
server_dir = root_dir / 'server'
if str(server_dir) not in sys.path:
    sys.path.insert(0, str(server_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')

# Ensure migrations and initial data are present in production database if needed
try:
    import django
    django.setup()
    from django.core.management import call_command
    from djangoapp.populate import initiate
    from django.contrib.auth.models import User
    
    # Auto-populate if database is empty
    from djangoapp.models import Dealership
    if Dealership.objects.count() == 0:
        call_command('migrate', interactive=False)
        initiate()
        if not User.objects.filter(username='root').exists():
            User.objects.create_superuser('root', 'root@example.com', 'RootPass123!@#')
        if not User.objects.filter(username='demo_user').exists():
            User.objects.create_user('demo_user', 'demo@example.com', 'DemoUserPass123!')
except Exception as e:
    print(f"Database setup error (can proceed): {e}")

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()

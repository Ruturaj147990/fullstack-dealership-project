import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
from django.http import HttpResponse

def frontend_index(request, *args, **kwargs):
    build_index = os.path.join(settings.BASE_DIR, 'frontend', 'build', 'index.html')
    if os.path.exists(build_index):
        with open(build_index, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    # Fallback to static Dealers landing page if build does not exist
    landing_file = os.path.join(settings.BASE_DIR, 'frontend', 'static', 'index.html')
    if os.path.exists(landing_file):
        with open(landing_file, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    return HttpResponse("<h1>Cars Dealership Application</h1>", content_type='text/html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    
    # Static HTML pages
    path('static/About.html', TemplateView.as_view(template_name='About.html'), name='about_static'),
    path('static/Contact.html', TemplateView.as_view(template_name='Contact.html'), name='contact_static'),
    path('about/', TemplateView.as_view(template_name='About.html'), name='about'),
    path('contact/', TemplateView.as_view(template_name='Contact.html'), name='contact'),

    # Static file serving
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR, 'frontend', 'static')}),

    # SPA routes served by frontend_index
    path('', frontend_index, name='home'),
    path('dealers/', frontend_index, name='dealers'),
    path('dealer/<int:id>/', frontend_index, name='dealer_detail'),
    path('postreview/<int:id>/', frontend_index, name='post_review'),
    path('login/', frontend_index, name='login_page'),
    path('register/', frontend_index, name='register_page'),
]

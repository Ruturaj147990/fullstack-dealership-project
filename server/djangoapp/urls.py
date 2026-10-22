from django.urls import path
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # Authentication
    path('login', views.login_user, name='login'),
    path('login/', views.login_user, name='login_slash'),
    path('logout', views.logout_request, name='logout'),
    path('logout/', views.logout_request, name='logout_slash'),
    path('registration', views.registration, name='registration'),
    path('registration/', views.registration, name='registration_slash'),

    # Dealerships
    path('get_dealers', views.get_dealerships, name='get_dealers'),
    path('get_dealers/', views.get_dealerships, name='get_dealers_slash'),
    path('get_dealers/<str:state>', views.get_dealerships, name='get_dealers_by_state'),
    path('dealer/<int:dealer_id>', views.get_dealer_details, name='dealer_details'),
    path('get_dealer/<int:dealer_id>', views.get_dealer_details, name='get_dealer_details'),

    # Reviews
    path('reviews/dealer/<int:dealer_id>', views.get_dealer_reviews, name='dealer_reviews'),
    path('get_reviews/<int:dealer_id>', views.get_dealer_reviews, name='get_dealer_reviews'),
    path('add_review', views.add_review, name='add_review'),
    path('add_review/', views.add_review, name='add_review_slash'),

    # Cars and Inventory
    path('get_cars', views.get_cars, name='get_cars'),
    path('get_cars/', views.get_cars, name='get_cars_slash'),

    # Sentiment Analysis
    path('analyze_review', views.analyze_review_view, name='analyze_review'),
    path('analyze_review/', views.analyze_review_view, name='analyze_review_slash'),
]

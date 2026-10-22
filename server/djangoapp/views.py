import json
import logging
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.core.management import call_command
from .models import CarMake, CarModel, Dealership, DealerReview
from .sentiment import analyze_text_sentiment

logger = logging.getLogger(__name__)

def ensure_db_initialized():
    try:
        tables = connection.introspection.table_names()
        if 'djangoapp_dealership' not in tables:
            call_command('migrate', interactive=False)
            from .populate import initiate
            initiate()
            if not User.objects.filter(username='root').exists():
                User.objects.create_superuser('root', 'root@example.com', 'RootPass123!@#')
            if not User.objects.filter(username='demo_user').exists():
                User.objects.create_user('demo_user', 'demo@example.com', 'DemoUserPass123!')
    except Exception as e:
        logger.error(f"Error in ensure_db_initialized: {e}")

@csrf_exempt
def login_user(request):
    ensure_db_initialized()
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        username = data.get("userName") or data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"userName": username, "status": "Authenticated"})
        else:
            return JsonResponse({"userName": username, "status": "Failed", "error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def logout_request(request):
    logout(request)
    return JsonResponse({"userName": "", "status": "Logged Out"})

@csrf_exempt
def registration(request):
    ensure_db_initialized()
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        username = data.get("userName") or data.get("username")
        password = data.get("password")
        first_name = data.get("firstName") or data.get("firstname", "")
        last_name = data.get("lastName") or data.get("lastname", "")
        email = data.get("email", "")

        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"userName": username, "error": "Already Registered"}, status=400)

        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email
        )
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})
    return JsonResponse({"error": "Method not allowed"}, status=405)

def get_dealerships(request, state="all"):
    ensure_db_initialized()
    if state == "all" or not state:
        dealerships = Dealership.objects.all()
    else:
        dealerships = Dealership.objects.filter(state__iexact=state) | Dealership.objects.filter(st__iexact=state)
    
    dealers_list = []
    for d in dealerships:
        dealers_list.append({
            "id": d.id,
            "city": d.city,
            "state": d.state,
            "st": d.st,
            "address": d.address,
            "zip": d.zip,
            "lat": d.lat,
            "long": d.long,
            "short_name": d.short_name,
            "full_name": d.full_name
        })
    return JsonResponse(dealers_list, safe=False)

def get_dealer_details(request, dealer_id):
    ensure_db_initialized()
    try:
        d = Dealership.objects.get(id=dealer_id)
        return JsonResponse({
            "id": d.id,
            "city": d.city,
            "state": d.state,
            "st": d.st,
            "address": d.address,
            "zip": d.zip,
            "lat": d.lat,
            "long": d.long,
            "short_name": d.short_name,
            "full_name": d.full_name
        })
    except Dealership.DoesNotExist:
        return JsonResponse({"error": "Dealership not found"}, status=404)

def get_dealer_reviews(request, dealer_id):
    ensure_db_initialized()
    reviews = DealerReview.objects.filter(dealer_id=dealer_id).order_by('-id')
    reviews_list = []
    for r in reviews:
        reviews_list.append({
            "id": r.id,
            "dealer_id": r.dealer_id,
            "name": r.name,
            "dealership": r.dealer_id,
            "review": r.review,
            "purchase": r.purchase,
            "purchase_date": r.purchase_date or "",
            "car_make": r.car_make or "",
            "car_model": r.car_model or "",
            "car_year": r.car_year or 2023,
            "sentiment": r.sentiment
        })
    return JsonResponse(reviews_list, safe=False)

@csrf_exempt
def add_review(request):
    ensure_db_initialized()
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        dealer_id = data.get("dealer_id") or data.get("dealership")
        name = data.get("name", "Anonymous")
        review_text = data.get("review", "")
        purchase = data.get("purchase", True)
        purchase_date = data.get("purchase_date", "")
        car_make = data.get("car_make", "")
        car_model = data.get("car_model", "")
        car_year = data.get("car_year")
        
        try:
            car_year = int(car_year) if car_year else 2023
        except (ValueError, TypeError):
            car_year = 2023

        try:
            dealer_id = int(dealer_id)
        except (ValueError, TypeError):
            return JsonResponse({"error": "Invalid dealer_id"}, status=400)

        sentiment = analyze_text_sentiment(review_text)

        dealership_obj = Dealership.objects.filter(id=dealer_id).first()

        review = DealerReview.objects.create(
            dealership=dealership_obj,
            dealer_id=dealer_id,
            name=name,
            purchase=bool(purchase),
            review=review_text,
            purchase_date=purchase_date,
            car_make=car_make,
            car_model=car_model,
            car_year=car_year,
            sentiment=sentiment
        )

        return JsonResponse({
            "status": 200,
            "message": "Review posted successfully",
            "id": review.id,
            "sentiment": sentiment
        })
    return JsonResponse({"error": "Method not allowed"}, status=405)

def get_cars(request):
    ensure_db_initialized()
    car_models = CarModel.objects.select_related('car_make').all()
    cars_list = []
    for cm in car_models:
        cars_list.append({
            "CarMake": cm.car_make.name,
            "CarModel": cm.name,
            "Type": cm.type,
            "Year": cm.year
        })
    return JsonResponse({"CarModels": cars_list})

@csrf_exempt
def analyze_review_view(request):
    text = ""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            text = data.get("text", "")
        except Exception:
            text = request.POST.get("text", "")
    else:
        text = request.GET.get("text", "")

    sentiment = analyze_text_sentiment(text)
    return JsonResponse({
        "status": 200,
        "text": text,
        "sentiment": sentiment
    })

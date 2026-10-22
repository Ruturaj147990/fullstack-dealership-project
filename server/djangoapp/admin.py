from django.contrib import admin
from .models import CarMake, CarModel, Dealership, DealerReview

class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1

@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    inlines = [CarModelInline]

@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year')
    list_filter = ('type', 'year', 'car_make')
    search_fields = ('name', 'car_make__name')

@admin.register(Dealership)
class DealershipAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'city', 'state', 'st', 'zip')
    list_filter = ('state', 'st')
    search_fields = ('full_name', 'city', 'address')

@admin.register(DealerReview)
class DealerReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'dealer_id', 'name', 'purchase', 'car_make', 'car_model', 'sentiment', 'created_at')
    list_filter = ('sentiment', 'purchase', 'car_make')
    search_fields = ('name', 'review')

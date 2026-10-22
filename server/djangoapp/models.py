from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class CarModel(models.Model):
    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    HATCHBACK = 'Hatchback'
    COUPE = 'Coupe'
    TRUCK = 'Truck'

    CAR_TYPE_CHOICES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon'),
        (HATCHBACK, 'Hatchback'),
        (COUPE, 'Coupe'),
        (TRUCK, 'Truck'),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CAR_TYPE_CHOICES, default=SEDAN)
    year = models.IntegerField(
        default=2023,
        validators=[
            MinValueValidator(2010),
            MaxValueValidator(2026)
        ]
    )

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"

class Dealership(models.Model):
    id = models.IntegerField(primary_key=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    st = models.CharField(max_length=10)
    address = models.CharField(max_length=255)
    zip = models.CharField(max_length=20)
    lat = models.FloatField(default=0.0)
    long = models.FloatField(default=0.0)
    short_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.full_name} ({self.st})"

class DealerReview(models.Model):
    id = models.AutoField(primary_key=True)
    dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    dealer_id = models.IntegerField(db_index=True)
    name = models.CharField(max_length=100)
    purchase = models.BooleanField(default=True)
    review = models.TextField()
    purchase_date = models.CharField(max_length=50, blank=True, null=True)
    car_make = models.CharField(max_length=100, blank=True, null=True)
    car_model = models.CharField(max_length=100, blank=True, null=True)
    car_year = models.IntegerField(blank=True, null=True)
    sentiment = models.CharField(max_length=20, default='neutral')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.name} for Dealer {self.dealer_id} ({self.sentiment})"

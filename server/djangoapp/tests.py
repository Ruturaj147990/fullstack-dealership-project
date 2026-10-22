import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import CarMake, CarModel, Dealership, DealerReview
from .sentiment import analyze_text_sentiment

class DealershipAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.demo_user = User.objects.create_user(
            username='test_user',
            password='Password123!',
            email='test@example.com'
        )
        self.make = CarMake.objects.create(name='Toyota', description='Reliable cars')
        self.model = CarModel.objects.create(
            name='Camry',
            type=CarModel.SEDAN,
            year=2023,
            car_make=self.make
        )
        self.dealer_ks = Dealership.objects.create(
            id=1,
            city='Wichita',
            state='Kansas',
            st='KS',
            address='742 Evergreen Expressway',
            zip='67202',
            lat=37.6872,
            long=-97.3301,
            short_name='Midwest Auto',
            full_name='Midwest Premier Auto Center'
        )
        self.dealer_tx = Dealership.objects.create(
            id=2,
            city='Austin',
            state='Texas',
            st='TX',
            address='4500 South Congress',
            zip='78745',
            lat=30.2223,
            long=-97.7654,
            short_name='Lone Star Auto',
            full_name='Lone Star Premier Auto'
        )
        self.review = DealerReview.objects.create(
            dealership=self.dealer_ks,
            dealer_id=1,
            name='Test Reviewer',
            purchase=True,
            review='Fantastic services and great support.',
            purchase_date='2024-01-01',
            car_make='Toyota',
            car_model='Camry',
            car_year=2023,
            sentiment='positive'
        )

    def test_sentiment_analysis(self):
        self.assertEqual(analyze_text_sentiment('Fantastic services'), 'positive')
        self.assertEqual(analyze_text_sentiment('Terrible experience and awful service'), 'negative')
        self.assertEqual(analyze_text_sentiment('Routine inspection on Monday'), 'neutral')

    def test_get_all_dealers(self):
        response = self.client.get('/djangoapp/get_dealers')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 2)

    def test_get_dealers_by_state_kansas(self):
        response = self.client.get('/djangoapp/get_dealers/Kansas')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(all(d['state'] == 'Kansas' or d['st'] == 'KS' for d in data))

    def test_get_dealer_by_id(self):
        response = self.client.get('/djangoapp/dealer/1')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['city'], 'Wichita')

    def test_get_dealer_reviews(self):
        response = self.client.get('/djangoapp/reviews/dealer/1')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 1)
        self.assertEqual(data[0]['sentiment'], 'positive')

    def test_get_all_cars(self):
        response = self.client.get('/djangoapp/get_cars')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('CarModels', data)
        self.assertTrue(any(c['CarModel'] == 'Camry' for c in data['CarModels']))

    def test_login_user(self):
        response = self.client.post(
            '/djangoapp/login',
            data=json.dumps({'userName': 'test_user', 'password': 'Password123!'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'Authenticated')

    def test_logout_user(self):
        response = self.client.get('/djangoapp/logout')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['userName'], '')

    def test_registration(self):
        response = self.client.post(
            '/djangoapp/registration',
            data=json.dumps({
                'userName': 'new_user',
                'password': 'NewPassword123!',
                'firstName': 'New',
                'lastName': 'User',
                'email': 'new@example.com'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['userName'], 'new_user')

    def test_add_review(self):
        response = self.client.post(
            '/djangoapp/add_review',
            data=json.dumps({
                'dealer_id': 1,
                'name': 'Customer John',
                'review': 'Fantastic services from the dealer!',
                'purchase': True,
                'purchase_date': '2024-03-01',
                'car_make': 'Toyota',
                'car_model': 'Camry',
                'car_year': 2023
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['sentiment'], 'positive')

    def test_analyze_review_view(self):
        response = self.client.get('/djangoapp/analyze_review?text=Fantastic%20services')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['sentiment'], 'positive')

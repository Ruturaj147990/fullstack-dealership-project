from django.core.management.base import BaseCommand
from djangoapp.populate import initiate

class Command(BaseCommand):
    help = 'Populates the database with initial car makes, models, dealerships, and reviews'

    def handle(self, *args, **options):
        initiate()
        self.stdout.write(self.style.SUCCESS('Successfully populated database'))

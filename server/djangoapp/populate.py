from .models import CarMake, CarModel, Dealership, DealerReview

def initiate():
    print("Populating Car Makes and Models...")
    car_make_data = [
        {"name": "Toyota", "description": "Japanese multinational automotive manufacturer renowned for reliability."},
        {"name": "Honda", "description": "Japanese public multinational manufacturer of automobiles and power equipment."},
        {"name": "Ford", "description": "American multinational automobile manufacturer founded by Henry Ford."},
        {"name": "BMW", "description": "German multinational manufacturer of luxury performance vehicles and motorcycles."},
        {"name": "Audi", "description": "German automotive manufacturer of luxury vehicles under the Volkswagen Group."},
        {"name": "Nissan", "description": "Japanese multinational automobile manufacturer headquartered in Yokohama."},
        {"name": "Chevrolet", "description": "American automobile division of the American manufacturer General Motors."}
    ]

    car_make_instances = {}
    for data in car_make_data:
        make, _ = CarMake.objects.get_or_create(name=data["name"], defaults={"description": data["description"]})
        car_make_instances[data["name"]] = make

    car_model_data = [
        {"name": "Camry", "type": CarModel.SEDAN, "year": 2023, "car_make": car_make_instances["Toyota"]},
        {"name": "Corolla", "type": CarModel.SEDAN, "year": 2024, "car_make": car_make_instances["Toyota"]},
        {"name": "RAV4", "type": CarModel.SUV, "year": 2024, "car_make": car_make_instances["Toyota"]},
        {"name": "Highlander", "type": CarModel.SUV, "year": 2023, "car_make": car_make_instances["Toyota"]},
        
        {"name": "Civic", "type": CarModel.SEDAN, "year": 2023, "car_make": car_make_instances["Honda"]},
        {"name": "Accord", "type": CarModel.SEDAN, "year": 2024, "car_make": car_make_instances["Honda"]},
        {"name": "CR-V", "type": CarModel.SUV, "year": 2024, "car_make": car_make_instances["Honda"]},
        
        {"name": "F-150", "type": CarModel.TRUCK, "year": 2023, "car_make": car_make_instances["Ford"]},
        {"name": "Mustang", "type": CarModel.COUPE, "year": 2024, "car_make": car_make_instances["Ford"]},
        {"name": "Explorer", "type": CarModel.SUV, "year": 2023, "car_make": car_make_instances["Ford"]},
        
        {"name": "3 Series", "type": CarModel.SEDAN, "year": 2024, "car_make": car_make_instances["BMW"]},
        {"name": "X5", "type": CarModel.SUV, "year": 2024, "car_make": car_make_instances["BMW"]},
        {"name": "M4", "type": CarModel.COUPE, "year": 2023, "car_make": car_make_instances["BMW"]},
        
        {"name": "A4", "type": CarModel.SEDAN, "year": 2023, "car_make": car_make_instances["Audi"]},
        {"name": "Q5", "type": CarModel.SUV, "year": 2024, "car_make": car_make_instances["Audi"]},
        
        {"name": "Altima", "type": CarModel.SEDAN, "year": 2023, "car_make": car_make_instances["Nissan"]},
        {"name": "Rogue", "type": CarModel.SUV, "year": 2024, "car_make": car_make_instances["Nissan"]},
        
        {"name": "Silverado", "type": CarModel.TRUCK, "year": 2023, "car_make": car_make_instances["Chevrolet"]},
        {"name": "Malibu", "type": CarModel.SEDAN, "year": 2023, "car_make": car_make_instances["Chevrolet"]},
        {"name": "Tahoe", "type": CarModel.SUV, "year": 2024, "car_make": car_make_instances["Chevrolet"]}
    ]

    for data in car_model_data:
        CarModel.objects.get_or_create(
            name=data["name"],
            car_make=data["car_make"],
            year=data["year"],
            defaults={"type": data["type"]}
        )

    print("Populating Dealerships (including Kansas)...")
    dealership_data = [
        {
            "id": 1,
            "city": "Wichita",
            "state": "Kansas",
            "st": "KS",
            "address": "742 Evergreen Expressway",
            "zip": "67202",
            "lat": 37.6872,
            "long": -97.3301,
            "short_name": "Midwest Auto Wichita",
            "full_name": "Midwest Premier Auto Center Wichita"
        },
        {
            "id": 2,
            "city": "Topeka",
            "state": "Kansas",
            "st": "KS",
            "address": "1200 S Kansas Ave",
            "zip": "66612",
            "lat": 39.0473,
            "long": -95.6752,
            "short_name": "Topeka Motors",
            "full_name": "Capital City Auto & Dealership Topeka"
        },
        {
            "id": 3,
            "city": "Austin",
            "state": "Texas",
            "st": "TX",
            "address": "4500 South Congress Ave",
            "zip": "78745",
            "lat": 30.2223,
            "long": -97.7654,
            "short_name": "Lone Star Auto Austin",
            "full_name": "Lone Star Premier Automotive Austin"
        },
        {
            "id": 4,
            "city": "Dallas",
            "state": "Texas",
            "st": "TX",
            "address": "1800 N Stemmons Fwy",
            "zip": "75207",
            "lat": 32.7981,
            "long": -96.8229,
            "short_name": "Metroplex Dealership",
            "full_name": "Metroplex Automotive Center Dallas"
        },
        {
            "id": 5,
            "city": "San Francisco",
            "state": "California",
            "st": "CA",
            "address": "1699 Van Ness Ave",
            "zip": "94109",
            "lat": 37.7915,
            "long": -122.4226,
            "short_name": "Bay City Auto",
            "full_name": "Bay City Automotive San Francisco"
        },
        {
            "id": 6,
            "city": "Los Angeles",
            "state": "California",
            "st": "CA",
            "address": "3333 Wilshire Blvd",
            "zip": "90010",
            "lat": 34.0617,
            "long": -118.2987,
            "short_name": "Pacific Coast Motors",
            "full_name": "Pacific Coast Auto Dealership Los Angeles"
        },
        {
            "id": 7,
            "city": "New York",
            "state": "New York",
            "st": "NY",
            "address": "555 11th Ave",
            "zip": "10019",
            "lat": 40.7629,
            "long": -73.9972,
            "short_name": "Manhattan Motorcars",
            "full_name": "Manhattan Luxury Motorcars New York"
        },
        {
            "id": 8,
            "city": "Miami",
            "state": "Florida",
            "st": "FL",
            "address": "2060 Biscayne Blvd",
            "zip": "33137",
            "lat": 25.7967,
            "long": -80.1901,
            "short_name": "Sunshine State Auto",
            "full_name": "Sunshine State Dealership Miami"
        }
    ]

    dealership_instances = {}
    for d in dealership_data:
        dealer, _ = Dealership.objects.update_or_create(
            id=d["id"],
            defaults={
                "city": d["city"],
                "state": d["state"],
                "st": d["st"],
                "address": d["address"],
                "zip": d["zip"],
                "lat": d["lat"],
                "long": d["long"],
                "short_name": d["short_name"],
                "full_name": d["full_name"]
            }
        )
        dealership_instances[d["id"]] = dealer

    print("Populating Reviews for Dealership 1...")
    review_data = [
        {
            "dealer_id": 1,
            "name": "Sarah Jenkins",
            "purchase": True,
            "review": "Fantastic services! The sales team was knowledgeable, patient, and made the entire car buying process effortless. Highly recommended!",
            "purchase_date": "2024-02-15",
            "car_make": "Toyota",
            "car_model": "Camry",
            "car_year": 2023,
            "sentiment": "positive"
        },
        {
            "dealer_id": 1,
            "name": "Robert Miller",
            "purchase": True,
            "review": "Great experience overall. Got a fair trade-in value for my older vehicle and drove home in a brand new RAV4 the very same afternoon.",
            "purchase_date": "2024-03-01",
            "car_make": "Toyota",
            "car_model": "RAV4",
            "car_year": 2024,
            "sentiment": "positive"
        },
        {
            "dealer_id": 1,
            "name": "Emily Watson",
            "purchase": False,
            "review": "Visited for a scheduled maintenance checkup. Service was prompt, clean waiting lounge, and reasonable pricing for routine inspection.",
            "purchase_date": "",
            "car_make": "Honda",
            "car_model": "Civic",
            "car_year": 2023,
            "sentiment": "positive"
        },
        {
            "dealer_id": 2,
            "name": "David Clark",
            "purchase": True,
            "review": "Excellent customer support from Topeka Motors. The financing department explained every warranty option clearly without pressure.",
            "purchase_date": "2024-01-20",
            "car_make": "Ford",
            "car_model": "F-150",
            "car_year": 2023,
            "sentiment": "positive"
        },
        {
            "dealer_id": 3,
            "name": "Jessica Taylor",
            "purchase": True,
            "review": "Smooth transaction and very friendly staff. Loving my new BMW 3 Series!",
            "purchase_date": "2024-03-10",
            "car_make": "BMW",
            "car_model": "3 Series",
            "car_year": 2024,
            "sentiment": "positive"
        }
    ]

    for r in review_data:
        dealer_obj = dealership_instances.get(r["dealer_id"])
        DealerReview.objects.get_or_create(
            dealer_id=r["dealer_id"],
            name=r["name"],
            review=r["review"],
            defaults={
                "dealership": dealer_obj,
                "purchase": r["purchase"],
                "purchase_date": r["purchase_date"],
                "car_make": r["car_make"],
                "car_model": r["car_model"],
                "car_year": r["car_year"],
                "sentiment": r["sentiment"]
            }
        )

    print("Data population completed successfully!")

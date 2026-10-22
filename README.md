# Cars Dealership — Full-Stack Web Application

Repository name: **fullstack-dealership-project**  
Project name: **Cars Dealership — Full-Stack Web Application**

## Overview
A comprehensive full-stack automotive dealership web platform built using **Django** and **React**, featuring persistent databases, sentiment analysis for customer reviews, car make and model cataloging, dealership state filtering, and user authentication.

## Tech Stack
- **Backend**: Django 5.x, Django REST / JSON Views, SQLite (Local) / PostgreSQL (Cloud)
- **Frontend**: React 18, HTML5, CSS3, Modern Responsive UI
- **DevOps & CI/CD**: GitHub Actions, Git
- **Deployment**: Vercel Cloud Platform

## Features
- **Dealership Locator**: View nationwide car dealerships, filter by state (including Kansas).
- **Reviews & Ratings**: Read real customer feedback per dealership with sentiment analysis.
- **Review Submission**: Authenticated users can post verified reviews with car make/model details.
- **Vehicle Catalog**: Search and browse car makes and models.
- **User Authentication**: Secure sign-up, login, and logout.
- **Administrative Portal**: Django Admin with superuser management.

## Project Structure
```
fullstack-dealership-project/
├── .github/workflows/          # CI/CD Workflows
├── server/
│   ├── djangoproj/             # Django Core Configuration
│   ├── djangoapp/              # Dealership, Review, & Car Catalog Services
│   │   ├── models.py           # Data Models (CarMake, CarModel, Dealership, Review)
│   │   ├── views.py            # API & Authentication Endpoints
│   │   ├── urls.py             # URL Routing
│   │   └── populate.py         # Database Seeding Utility
│   └── frontend/               # React & Static Frontend
│       ├── static/
│       │   ├── About.html      # About Us Page
│       │   └── Contact.html    # Contact Us Page
│       └── src/
│           ├── components/     # React Components (Register, Header, Dealers, Dealer, PostReview)
│           └── App.js          # Main Application Routing
├── submission/                 # Submission Documentation & Verification Artifacts
└── README.md                   # Project Documentation
```

## Running the Application Locally
1. Activate the Python virtual environment:
   ```bash
   source .venv/bin/activate
   ```
2. Navigate to the server directory and run migrations:
   ```bash
   cd server
   python manage.py migrate
   python manage.py populate
   ```
3. Start the development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
4. Access the web interface at `http://127.0.0.1:8000/`.

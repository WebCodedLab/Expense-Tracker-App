# Expense Tracker API

![Expense Tracker Logo](https://via.placeholder.com/150) <!-- Replace with your project logo -->

A robust and scalable backend API for managing personal and shared expenses, with advanced analytics and insights.

## Features

- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Expense Management**: Create, read, update, and delete expenses
- **Advanced Analytics**:
  - Monthly and yearly expense summaries
  - Category-wise spending breakdown
  - Daily spending trends
  - Top expenses tracking
- **Caching**: Redis-based caching for improved performance
- **File Uploads**: Cloudinary integration for profile picture management
- **Data Validation**: Comprehensive validation for all inputs
- **Error Handling**: Graceful error handling and meaningful error messages

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **File Storage**: Cloudinary
- **Authentication**: JWT
- **Other Libraries**:
  - Mongoose (ODM)
  - Bcrypt (password hashing)
  - Multer (file uploads)
  - Helmet (security)
  - Morgan (logging)

## API Endpoints

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - User login
- `POST /users/logout` - User logout
- `POST /users/refresh-token` - Refresh access token

### User Management
- `GET /users/current` - Get current user details
- `PATCH /users/update-details` - Update user details
- `POST /users/update-profile-picture` - Update profile picture

### Expense Management
- `POST /expenses` - Create a new expense
- `GET /expenses` - Get all expenses
- `GET /expenses/:id` - Get a specific expense
- `PATCH /expenses/:id` - Update an expense
- `DELETE /expenses/:id` - Delete an expense

### Insights
- `GET /insights/monthly-comparison` - Compare current and previous month expenses
- `GET /insights/category-spending` - Get category-wise spending
- `GET /insights/daily-trend` - Get daily spending trend
- `GET /insights/yearly-summary` - Get yearly expense summary
- `GET /insights/top-expenses` - Get top 5 expenses
- `GET /insights/month-total-spent` - Get total spent this month
- `GET /insights/year-total-spent` - Get total spent this year

## Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis
- Cloudinary account

### Installation Steps

1. Clone the repository:
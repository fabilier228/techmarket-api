# TechMarket API

A robust e-commerce API built with Node.js, Express, and MongoDB, providing a complete backend solution for an online marketplace.

## Features

- **User Management**: Authentication, authorization, and user profile management
- **Product Catalog**: Comprehensive product management with categories
- **Shopping Cart**: Cart functionality for users
- **Reviews & Ratings**: Product review system
- **Analytics**: Business intelligence and analytics endpoints
- **Recommendations**: Product recommendation system
- **Data Synchronization**: Synchronization endpoints for data consistency

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, PostgreSQL (via Sequelize)
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, Supertest
- **Data Validation**: Joi
- **Security**: bcrypt for password hashing
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/fabilier228/techmarket-api.git
cd techmarket-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

## Available Scripts

- `npm start`: Starts the server using the start.sh script
- `npm run fill`: Fills the database with sample data

## API Endpoints

- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/users` - User management
- `/api/categories` - Category management
- `/api/reviews` - Review system
- `/api/cart` - Shopping cart
- `/api/analytics` - Analytics and reporting
- `/api/recommendation` - Product recommendations
- `/api/products` - Data synchronization

## Development

The project uses a modular structure with separate routes, controllers, and models. The main server configuration is in `server.js`, and the application is organized into the following directories:

- `src/routes/` - API route definitions
- `src/controllers/` - Business logic
- `src/models/` - Data models
- `src/config/` - Configuration files
- `src/scripts/` - Utility scripts

## License

ISC License 

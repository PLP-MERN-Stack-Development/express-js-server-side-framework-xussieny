

# RESTful API with Express.js 

## Project Overview
This is a fully functional RESTful API built with Express.js for managing a collection of products. It supports standard CRUD operations, middleware for logging, authentication, and validation, as well as advanced features like filtering, pagination, searching, and statistics. The API uses MongoDB as the database for persistent storage.

- **Key Features**:
  - CRUD operations for products (Create, Read, Update, Delete).
  - Custom middleware for request logging, JSON parsing, authentication (via API key), and input validation.
  - Error handling with custom error classes and appropriate HTTP status codes.
  - Advanced querying: Filter by category, paginate results, search by product name, and get product statistics.
  - Initial sample data is seeded into the database on startup if it's empty.

This project is ideal for learning Express.js, RESTful API design, and basic database integration.

## Installation
To set up and run this project, follow these steps:

- **Prerequisites**:
  - Node.js (v14 or higher) installed on your machine.
  - MongoDB server running locally (or a remote instance).

- **Steps**:
  1. Clone the repository or create a new project directory.
  2. Navigate to the project directory in your terminal.
  3. Run `npm init -y` to create a `package.json` file.
  4. Install the required dependencies by running:
     ```
     npm install express body-parser uuid mongoose
     ```
  5. Copy the provided `server.js` file into your project directory.

## Running the Server
Once installed, start the server as follows:

- **Command**:
  ```
  node server.js
  ```
- **Expected Output**: The server will connect to the database and start listening on port 3000 (or the port specified in the `PORT` environment variable).
- **Access the API**: Open your browser or a tool like Postman and visit `http://localhost:3000`. You should see a welcome message.

- **Environment Variables**:
  - Set `PORT` if you want to use a different port (e.g., in a `.env` file).
  
## API Documentation
The API endpoints are protected by an authentication middleware that requires an `api-key` header 

### Endpoints
Here are the available routes:

- **GET /**  
  - Description: Returns a welcome message.  
  - Response: HTML string (e.g., "Welcome to the Product API!").  
  - Example: `GET http://localhost:3000`

- **GET /api/products**  
  - Description: Lists all products with optional filtering and pagination.  
  - Query Parameters:
    - `category`: Filter by category (e.g., `?category=electronics`).
    - `page`: Page number for pagination (default: 1).
    - `limit`: Number of items per page (default: 10).
  - Response: JSON array of products with pagination metadata.  
  - Example: `GET http://localhost:3000/api/products?category=electronics&page=1&limit=5`

- **GET /api/products/:id**  
  - Description: Retrieves a specific product by ID.  
  - Response: JSON object of the product.  
  - Example: `GET http://localhost:3000/api/products/1`

- **POST /api/products**  
  - Description: Creates a new product.  
  - Request Body: JSON with fields: `name` (string), `description` (string), `price` (number), `category` (string), `inStock` (boolean).  
  - Response: 201 Created with the new product object.  
  - Example: `POST http://localhost:3000/api/products` with body: `{ "name": "New Product", "description": "Description", "price": 100, "category": "electronics", "inStock": true }`

- **PUT /api/products/:id**  
  - Description: Updates an existing product (partial updates allowed).  
  - Request Body: JSON with fields to update (e.g., `{ "price": 150 }`).  
  - Response: Updated product object.  
  - Example: `PUT http://localhost:3000/api/products/1` with body: `{ "price": 150 }`

- **DELETE /api/products/:id**  
  - Description: Deletes a product by ID.  
  - Response: JSON message (e.g., { "message": "Product deleted successfully" }).  
  - Example: `DELETE http://localhost:3000/api/products/1`

- **GET /api/products/search?q=<query>**  
  - Description: Searches products by name (case-insensitive).  
  - Query Parameters: `q` (search query string).  
  - Response: JSON array of matching products.  
  - Example: `GET http://localhost:3000/api/products/search?q=laptop`

- **GET /api/products/stats**  
  - Description: Gets statistics, such as the count of products by category.  
  - Response: JSON object (e.g., { "electronics": 2, "kitchen": 1 }).  
  - Example: `GET http://localhost:3000/api/products/stats`

## Middleware and Error Handling
- **Middleware**:
  - Logging: Automatically logs each request with method, URL, and timestamp.
  - Authentication: Checks for a valid API key in the request headers.
  - Validation: Ensures incoming data for product creation and updates meets required formats.
  - JSON Parsing: Handles JSON request bodies.

- **Error Handling**:
  - Custom errors (e.g., NotFoundError for 404, ValidationError for 400).
  - Global error handler returns appropriate HTTP status codes and JSON error messages.
  - All routes handle asynchronous errors gracefully.

## Dependencies
The project relies on the following npm packages:
- `express`: For building the web server.
- `body-parser`: For parsing JSON request bodies.
- `uuid`: For generating unique IDs.
- `mongoose`: For MongoDB object modeling.

You can view and manage these in your `package.json` file.

## How to test in Postman (use one of these headers):

Header: Authorization: Bearer 12345687890edrfg
OR Header: x-api-key: 12345687890edrfg (Replace value with your API_KEY from the .env)
If you want, paste index.js (if present) or server.js and I’ll propose minimal edits.


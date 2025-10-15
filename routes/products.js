

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError, BadRequestError } = require('../errors');
const { authenticate, validateProduct } = require('../middleware/index'); // Import specific middleware

const router = express.Router();

// Sample in-memory products database (as provided in starter code)
// In a real application, this would interact with a persistent database.
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  },
  {
    id: '4',
    name: 'Desk Chair',
    description: 'Ergonomic office chair',
    price: 150,
    category: 'furniture',
    inStock: true
  },
  {
    id: '5',
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with clear audio',
    price: 75,
    category: 'electronics',
    inStock: true
  },
  {
    id: '6',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable material',
    price: 120,
    category: 'footwear',
    inStock: false,
},{
    id: '7',
    name: 'Backpack',
    description: 'Durable backpack with multiple compartments',
    price: 80,
    category: 'accessories',
    inStock: true,
},
{    id: '8',
    name: 'Wristwatch',
    description: 'Stylish wristwatch with leather strap',
    
    price: 250,
    category: 'accessories',
    inStock: true,
},{
    id: '9',
    name: 'Electric Kettle',        
    description: 'Fast-boiling electric kettle with auto shut-off',
    price: 60,
    category: 'appliances',
    inStock: true,
},{
    id: '10',  
    name: 'Tablet',
    description: '10-inch tablet with high-resolution display',
    price: 300,
    category: 'electronics',
    inStock: false,
},{   id: '11',
    name: 'Gaming Console',
    description: 'Next-gen gaming console with 4K support',
    price: 500,
    category: 'electronics',
    inStock: true,

},{   id: '12',
    name: 'Office Desk',
    description: 'Spacious office desk with cable management',
    price: 350,
    category: 'furniture',
    inStock: true,
},
];

// --- Apply Middleware to specific routes ---
// Apply authentication to all product routes
router.use(authenticate);

// --- RESTful API Routes ---

// GET /api/products: List all products (Task 2, Task 5: Filtering, Pagination, Search)
router.get('/', async (req, res, next) => {
  try {
    let filteredAndSearchedProducts = [...products]; // Start with a copy of all products

    // Task 5: Filtering by category
    const { category, search, limit, page } = req.query;

    if (category) {
      filteredAndSearchedProducts = filteredAndSearchedProducts.filter(p =>
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Task 5: Searching by name (and description for broader search)
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredAndSearchedProducts = filteredAndSearchedProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }

    
// DELETE /api/products: Delete all products
router.delete('/', async (req, res, next) => {
  try {
    products = [];
    // 204 No Content for successful deletion
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
    // Task 5: Pagination
    const pageNumber = parseInt(page) || 1; // Default to page 1
    const limitPerPage = parseInt(limit) || 10; // Default to 10 items per page

    const startIndex = (pageNumber - 1) * limitPerPage;
    const endIndex = pageNumber * limitPerPage;

    const paginatedProducts = filteredAndSearchedProducts.slice(startIndex, endIndex);

    // Calculate total pages for pagination metadata
    const totalItems = filteredAndSearchedProducts.length;
    const totalPages = Math.ceil(totalItems / limitPerPage);

    // Construct pagination metadata
    const pagination = {
      currentPage: pageNumber,
      itemsPerPage: limitPerPage,
      totalItems: totalItems,
      totalPages: totalPages,
      nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
      prevPage: pageNumber > 1 ? pageNumber - 1 : null
    };

    res.status(200).json({
      data: paginatedProducts,
      pagination: pagination
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});


// POST /api/products: Create a new product (Task 2, Task 3: Validation)
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const newProductData = req.body;

    const newProduct = {
      id: uuidv4(), // Generate a unique ID
      name: newProductData.name,
      description: newProductData.description || '', // Default to empty string if not provided
      price: parseFloat(newProductData.price), // Ensure price is a number
      category: newProductData.category,
      inStock: newProductData.inStock !== undefined ? newProductData.inStock : true // Default to true
    };

    products.push(newProduct);

    // Respond with 201 Created status and the new product
    res.status(201).json(newProduct);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// PUT /api/products/:id: Update an existing product (Task 2, Task 3: Validation)
router.put('/:id', validateProduct, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundError('Product'); // Use custom NotFoundError
    }

    // Merge existing product data with the updated data
    // Ensure the ID remains unchanged
    const existingProduct = products[productIndex];
    products[productIndex] = {
      ...existingProduct,
      ...updatedData,
      id: existingProduct.id // Preserve original ID
    };

    res.status(200).json(products[productIndex]);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});



// DELETE /api/products/:id: Delete a product (Task 2)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialLength) {
      throw new NotFoundError('Product'); // Use custom NotFoundError if product not found for deletion
    }

    // 204 No Content for successful deletion
    res.status(204).send();
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// --- Task 5: Advanced Features ---

// GET /api/products/stats: Get product statistics (e.g., count by category)
router.get('/stats', async (req, res, next) => {
    try {
        const stats = {};

        products.forEach(product => {
            const category = product.category;
            if (!stats[category]) {
                stats[category] = { count: 0, totalValue: 0, inStockCount: 0 };
            }
            stats[category].count++;
            stats[category].totalValue += product.price;
            if (product.inStock) {
                stats[category].inStockCount++;
            }
        });
        
// GET /api/products/:id: Get a specific product by ID (Task 2)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (!product) {
      throw new NotFoundError('Product'); // Use custom NotFoundError
    }

    res.status(200).json(product);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

        // Convert the stats object into an array for a cleaner API response
        const formattedStats = Object.keys(stats).map(category => ({
            category: category,
            productCount: stats[category].count,
            totalValue: stats[category].totalValue,
            inStockCount: stats[category].inStockCount
        }));

        res.status(200).json(formattedStats);
    } catch (error) {
        next(error); // Pass error to global error handler
    }
});


module.exports = router;


// tests/stock.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Make sure your server.js exports the app
const Inventory = require('../models/inventory');
const Stock = require('../models/stock');
const Supplier = require('../models/supplier');

// Connect to a test database before all tests
beforeAll(async () => {
  const MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/motocare_test';
  await mongoose.connect(MONGO_URI_TEST);
});

// Clear the database after each test
afterEach(async () => {
  await Inventory.deleteMany({});
  await Stock.deleteMany({});
  await Supplier.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Stock Movement API', () => {
  let inventoryItem;
  let supplier;

  // Create a supplier and an inventory item before each test
  beforeEach(async () => {
    supplier = await Supplier.create({ name: 'Test Supplier' });
    inventoryItem = await Inventory.create({
      partId: 'TEST-PART-01',
      name: 'Test Part',
      quantity: 0,
    });
  });

  it('should create a stock IN movement and increase inventory quantity', async () => {
    const stockData = {
      inventory: inventoryItem._id.toString(),
      supplier: supplier._id.toString(),
      type: 'IN',
      quantity: 10,
      notes: 'Initial stock',
    };
//methana change kara
    const res = await request(app).post('/api/stock').send(stockData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('quantity', 10);

    // Verify inventory quantity was updated
    const updatedInventory = await Inventory.findById(inventoryItem._id);
    expect(updatedInventory.quantity).toEqual(10);
  });

  it('should create a stock OUT movement and decrease inventory quantity', async () => {
    // Add initial stock first
    await Stock.create({
      inventory: inventoryItem._id,
      supplier: supplier._id,
      type: 'IN',
      quantity: 15,
    });

    // Manually update inventory quantity for this test
    const updatedInv = await Inventory.findByIdAndUpdate(inventoryItem._id, { quantity: 15 }, { new: true });
    expect(updatedInv.quantity).toEqual(15);

    const stockData = {
      inventory: inventoryItem._id.toString(),
      type: 'OUT',
      quantity: 5,
    };

    const res = await request(app).post('/api/stock').send(stockData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('quantity', 5);

    // Verify inventory quantity was decreased
    const finalInventory = await Inventory.findById(inventoryItem._id);
    expect(finalInventory.quantity).toEqual(10); // 15 - 5 = 10
  });

  it('should return 400 if OUT quantity is greater than available stock', async () => {
    const stockData = {
      inventory: inventoryItem._id.toString(),
      type: 'OUT',
      quantity: 10,
    };

    const res = await request(app).post('/api/stock').send(stockData);
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Not enough stock to fulfill this request.');
  });
});
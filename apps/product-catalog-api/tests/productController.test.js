const ProductController = require('../src/controllers/ProductController');
const { Product } = require('../src/models');

jest.mock('../src/models', () => ({
  Product: { findAll: jest.fn() },
  SubCategory: {},
  ProductAttribute: {},
  InventoryItem: {}
}));

describe('ProductController', () => {
  it('returns all products', async () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    Product.findAll.mockResolvedValue([{ id: '1', name: 'Test Product' }]);

    await ProductController.getAllProducts(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: '1', name: 'Test Product' }]);
  });
});

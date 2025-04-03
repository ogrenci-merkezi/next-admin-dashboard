////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering
import { Board, BoardType } from './data';

// Generate mock board data
function generateMockBoards(count: number): Board[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `board-${i + 1}`,
    name:
      i % 3 === 0
        ? `Üniversite ${i + 1}`
        : i % 3 === 1
          ? `Şehir ${i + 1}`
          : `Ülke ${i + 1}`,
    slug: `board-${i + 1}-slug`,
    type: (i % 3 === 0
      ? 'SCHOOL'
      : i % 3 === 1
        ? 'CITY'
        : 'COUNTRY') as BoardType,
    code: `CODE${i + 1}`,
    profileImage: `https://source.unsplash.com/random/64x64?sig=${i}`,
    coverImage: `https://source.unsplash.com/random/800x200?sig=${i}`,
    studentCount: Math.floor(Math.random() * 10000),
    postCount: Math.floor(Math.random() * 50000),
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    status: Math.random() > 0.2 ? 'active' : 'inactive',
    parentId: i % 3 === 0 ? `board-${Math.floor(i / 3) + 30}` : null,
    parentName: i % 3 === 0 ? `Şehir ${Math.floor(i / 3) + 30}` : null
  }));
}

// Mock boards API
export const fakeBoards = {
  getBoards: async (filters?: {
    page?: string | null;
    limit?: string | null;
    search?: string;
    type?: string;
  }) => {
    await delay(800);

    const page = Number(filters?.page || '1');
    const limit = Number(filters?.limit || '10');
    const search = filters?.search || '';
    const type = filters?.type || '';

    let boards = generateMockBoards(100);

    // Apply search filter
    if (search) {
      boards = boards.filter(
        (board) =>
          board.name.toLowerCase().includes(search.toLowerCase()) ||
          board.slug.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply type filter
    if (type) {
      const types = type.split(',');
      boards = boards.filter((board) => types.includes(board.type));
    }

    const total_boards = boards.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBoards = boards.slice(start, end);

    return {
      boards: paginatedBoards,
      total_boards,
      page,
      limit,
      total_pages: Math.ceil(total_boards / limit)
    };
  },

  getBoard: async (id: string) => {
    await delay(500);
    const boards = generateMockBoards(100);
    return boards.find((board) => board.id === id) || null;
  }
};

// ...existing code...

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: number): Product {
      const categories = [
        'Electronics',
        'Furniture',
        'Clothing',
        'Toys',
        'Groceries',
        'Books',
        'Jewelry',
        'Beauty Products'
      ];

      return {
        id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();

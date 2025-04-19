export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'fruit' | 'vegetable';
  stock: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Apples',
    description: 'Crisp and juicy red apples, perfect for snacking or baking.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1568702846914-96b0d0e4b0c1',
    category: 'fruit',
    stock: 100,
  },
  {
    id: '2',
    name: 'Organic Bananas',
    description: 'Sweet and creamy organic bananas, rich in potassium.',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    category: 'fruit',
    stock: 150,
  },
  {
    id: '3',
    name: 'Fresh Carrots',
    description: 'Crunchy and sweet carrots, great for snacking or cooking.',
    price: 1.49,
    image: 'https://images.unsplash.com/photo-1447175008436-054164d60219',
    category: 'vegetable',
    stock: 200,
  },
  {
    id: '4',
    name: 'Ripe Tomatoes',
    description: 'Juicy and flavorful tomatoes, perfect for salads and sauces.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
    category: 'vegetable',
    stock: 120,
  },
  {
    id: '5',
    name: 'Sweet Strawberries',
    description: 'Sweet and fragrant strawberries, great for desserts.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6',
    category: 'fruit',
    stock: 80,
  },
  {
    id: '6',
    name: 'Fresh Broccoli',
    description: 'Nutritious broccoli florets, perfect for stir-fries and salads.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c',
    category: 'vegetable',
    stock: 90,
  },
  {
    id: '7',
    name: 'Sweet Oranges',
    description: 'Juicy and sweet oranges, packed with vitamin C.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f',
    category: 'fruit',
    stock: 110,
  },
  {
    id: '8',
    name: 'Fresh Spinach',
    description: 'Tender and nutritious spinach leaves, great for salads and cooking.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
    category: 'vegetable',
    stock: 70,
  },
]; 
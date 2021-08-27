const products: Product[] = [
  {
    count: 4,
    description: 'Mercedes-AMG Petronas F1 Team',
    id: '59f5d715-ea70-4123-a78c-0380eec93ede',
    price: 200,
    title: 'Mercedes Poster',
  },
  {
    count: 6,
    description: 'Scuderia Ferrari Mission Winnow',
    id: 'f38353f0-9aec-44a3-a7e9-60aaed03d712',
    price: 50,
    title: 'Ferrari Poster',
  },
  {
    count: 7,
    description: 'Red Bull Racing Honda',
    id: '64468629-1d15-4e5e-895f-7767551cbdf6',
    price: 23,
    title: 'Red Bull Poster',
  },
  {
    count: 12,
    description: 'Alpine F1 Team',
    id: '8749b8c4-6efd-4b39-95d2-facf4b6e42ef',
    price: 129,
    title: 'Alpine-Renault Poster',
  },
  {
    count: 7,
    description: 'Scuderia AlphaTauri Honda',
    id: 'bd812a8a-30f3-48fc-973a-afd7b2a7ed3a',
    price: 50,
    title: 'AlphaTauri Poster',
  },
  {
    count: 8,
    description: 'Alfa Romeo Racing Orlen',
    id: 'beefb95a-82b1-44b7-aa69-dbf7da5b9b42',
    price: 15,
    title: 'Alfa Romeo Poster',
  },
  {
    count: 2,
    description: 'Aston Martin Cognizant F1 Team',
    id: '38cd209a-51d4-4c02-a8bb-63d662cbcd9f',
    price: 448,
    title: 'Aston Martin Poster',
  },
  {
    count: 3,
    description: '52d904f7-165e-4142-8bea-540eb2813318',
    id: 'McLaren F1 Team',
    price: 119,
    title: 'McLaren Poster',
  },
  {
    count: 3,
    description: 'Williams Racing',
    id: '151688e1-e38f-4a25-8294-dadf80f91514',
    price: 119,
    title: 'Williams Poster',
  },
  {
    count: 7,
    description: 'Uralkali Haas F1 Team',
    id: 'f07d26e8-2e80-48da-9514-d54588cff978',
    price: 99,
    title: 'Haas Poster',
  },
];

interface Product {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

export const getProducts = () =>
  new Promise<Product[]>((resolve, reject) => {
    try {
      resolve(products);
    } catch (e) {
      reject(e);
    }
  });

export const getProduct = (id: string) =>
  new Promise<Product>((resolve, reject) => {
    try {
      const product = products.find((p) => p.id === id);
      if (product) {
        resolve(product);
      }
      resolve(null);
    } catch (e) {
      reject(e);
    }
  });

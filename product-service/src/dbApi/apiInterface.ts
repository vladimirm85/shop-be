export interface DbApiInterface {
  get: () => Promise<Product[]>;
  getOne: (id: string) => Promise<Product>;
  postOne: (productData: ProductData) => Promise<Product>;
}

export interface ProductData {
  title: string;
  description: string;
  price: number;
  count: number;
}

export interface Product extends ProductData {
  id: string;
}

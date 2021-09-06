import { Product, ProductData } from 'src/models';

export interface DbApiInterface {
  get: () => Promise<Product[]>;
  getOne: (id: string) => Promise<Product>;
  postOne: (productData: ProductData) => Promise<Product>;
}

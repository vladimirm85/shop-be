import { Client } from 'pg';

export interface DbApiInterface {
  client: Client;
  get: () => Promise<Product[]>;
  getOne: (id: string) => Promise<Product>;
}

export interface Product {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

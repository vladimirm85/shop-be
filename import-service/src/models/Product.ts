export interface ProductData {
  title: string;
  description: string;
  price: number;
  count: number;
}

export interface Product extends ProductData {
  id: string;
}

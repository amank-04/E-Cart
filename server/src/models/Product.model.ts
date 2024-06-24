export interface Product {
  id: string;
  name: string;
  imageurl: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
}

export interface ProductDetails {
  imageurls: string[];
  title: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  originalprice: number;
  limiteddeaal: boolean;
  product_id?: string;
  details: object;
}



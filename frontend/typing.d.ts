export interface Product {
  id: string;
  imageurl: string;
  description: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  limiteddeal: boolean;
}

type Prop = {
  key: string;
  val: string;
};

export interface ProductDetails {
  name: string;
  title: string;
  description: string;
  imageurls: string[];
  rating: number;
  reviews: number;
  price: number;
  originalprice: number;
  details: Prop[];
}

export interface CartItem {
  id: string;
  imageurl: string;
  selected: Boolean;
  description: string;
  count: number;
  name: string;
  price: number;
}

export interface User {
  firstname: string;
  lastname: string;
  imageurl: string;
  email: string;
  isAdmin: boolean;
}

export interface OrderItem {
  id: string;
  imageurl: string;
  name: string;
  count: number;
  price: number;
}

export interface Order {
  id: number;
  placed: string;
  total: number;
  status: string;
  products: OrderItem[];
  email: string;
}

export interface Review {
  name: string;
  profile_img: string;
  rating: number;
  comment: string;
  time: Date;
}

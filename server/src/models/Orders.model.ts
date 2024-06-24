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
  status: "confirmed" | "shipped" | "delivered";
  products: OrderItem[];
}

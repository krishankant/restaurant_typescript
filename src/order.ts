// src/order.ts

import { FoodCategory, RestaurantMenu } from "./menu";

// Utility type for order status
type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

// Interface for order item
interface OrderItem {
  menuItemId: number;
  quantity: number;
}

// Interface for order
interface Order {
  id: number;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
}

// Order processor class
export class OrderProcessor {
  private orders: Order[] = [];
  private currentId = 1;

  constructor(private menu: RestaurantMenu) {}

  createOrder(items: OrderItem[]): Order {
    const order: Order = {
      id: this.currentId++,
      items,
      status: "pending",
      total: this.calculateTotal(items),
    };
    this.orders.push(order);
    return order;
  }

  updateOrderStatus(orderId: number, status: OrderStatus): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
    }
  }

  getOrder(orderId: number): Order | undefined {
    return this.orders.find((o) => o.id === orderId);
  }

  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => {
      const menuItem = this.menu.getItems().find((mi) => mi.id === item.menuItemId);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  }
}

// src/reporting.ts

import { FoodCategory, RestaurantMenu } from "./menu";

import { OrderProcessor } from "./order";

// Mixin for date range
type Constructor<T = {}> = new (...args: any[]) => T;

function DateRangeMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private startDate: Date = new Date();
    private endDate: Date = new Date();

    setDateRange(startDate: Date, endDate: Date): void {
      this.startDate = startDate;
      this.endDate = endDate;
    }

    protected isInRange(date: Date): boolean {
      return date >= this.startDate && date <= this.endDate;
    }
  };
}

// Reporting class
export class Reporting extends DateRangeMixin(class {}) {
  constructor(private menu: RestaurantMenu, private orderProcessor: OrderProcessor) {
    super();
  }

  generateReport<T extends "sales" | "popular">(
    type: T
  ): T extends "sales" ? number : { itemId: number; name: string; quantity: number }[] {
    if (type === "sales") {
      // Calculate total sales
      const totalSales = this.orderProcessor["orders"].reduce((total, order) => total + order.total, 0);
      return totalSales as any;
    } else {
      // Calculate popular items
      const itemCounts: { [key: number]: number } = {};
      this.orderProcessor["orders"]
        .filter((order) => this.isInRange(new Date())) // Assume order date is current date for simplicity
        .forEach((order) => {
          order.items.forEach((item) => {
            itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.quantity;
          });
        });

      const popularItems = Object.entries(itemCounts)
        .map(([itemId, quantity]) => {
          const menuItem = this.menu.getItems().find((item) => item.id === parseInt(itemId));
          return { itemId: parseInt(itemId), name: menuItem?.name || "Unknown", quantity };
        })
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      return popularItems as any;
    }
  }
}

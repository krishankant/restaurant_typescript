// src/menu.ts

// Decorator for logging
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args: ${JSON.stringify(args)}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// Generic interface for menu items
interface MenuItem<T> {
  id: number;
  name: string;
  price: number;
  category: T;
}

// Enum for food categories
export enum FoodCategory {
  Appetizer,
  MainCourse,
  Dessert,
  Beverage,
}

// Type alias for food menu item
type FoodMenuItem = MenuItem<FoodCategory>;

// Menu class with generic type
class Menu<T> {
  private items: MenuItem<T>[] = [];

  @log
  addItem(item: MenuItem<T>): void {
    this.items.push(item);
  }

  @log
  removeItem(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  getItems(): MenuItem<T>[] {
    return this.items;
  }
}

// Restaurant menu
export class RestaurantMenu extends Menu<FoodCategory> {
  // Method to get items by category
  getItemsByCategory(category: FoodCategory): FoodMenuItem[] {
    return this.getItems().filter((item) => item.category === category);
  }
}

// src/index.ts

import * as readline from "readline";

import { FoodCategory, RestaurantMenu } from "./menu";

import { OrderProcessor } from "./order";
import { Reporting } from "./reporting";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = new RestaurantMenu();
const orderProcessor = new OrderProcessor(menu);
const reporting = new Reporting(menu, orderProcessor);

// Initialize menu
menu.addItem({ id: 1, name: "Caesar Salad", price: 8.99, category: FoodCategory.Appetizer });
menu.addItem({ id: 2, name: "Steak", price: 24.99, category: FoodCategory.MainCourse });
menu.addItem({ id: 3, name: "Chocolate Cake", price: 6.99, category: FoodCategory.Dessert });
menu.addItem({ id: 4, name: "Soda", price: 2.99, category: FoodCategory.Beverage });

function displayMenu(): void {
  console.log("Menu:");
  menu.getItems().forEach((item) => {
    console.log(`${item.id}. ${item.name} - $${item.price.toFixed(2)}`);
  });
}

function createOrder(): void {
  const items: { menuItemId: number; quantity: number }[] = [];

  function askForItem() {
    rl.question("Enter item ID (or 0 to finish): ", (itemId) => {
      if (itemId === "0") {
        const order = orderProcessor.createOrder(items);
        console.log("Order created:", order);
        mainMenu();
      } else {
        rl.question("Enter quantity: ", (quantity) => {
          items.push({ menuItemId: parseInt(itemId), quantity: parseInt(quantity) });
          askForItem();
        });
      }
    });
  }

  askForItem();
}

function generateReport(): void {
  rl.question("Enter report type (sales/popular): ", (type) => {
    if (type === "sales") {
      const salesReport = reporting.generateReport("sales");
      console.log("Total sales:", salesReport.toFixed(2));
    } else if (type === "popular") {
      const popularItems = reporting.generateReport("popular");
      console.log("Popular items:");
      popularItems.forEach((item) => {
        console.log(`${item.name}: ${item.quantity}`);
      });
    } else {
      console.log("Invalid report type");
    }
    mainMenu();
  });
}

function mainMenu(): void {
  console.log("\n1. Display Menu");
  console.log("2. Create Order");
  console.log("3. Generate Report");
  console.log("4. Exit");

  rl.question("Select an option: ", (option) => {
    switch (option) {
      case "1":
        displayMenu();
        mainMenu();
        break;
      case "2":
        createOrder();
        break;
      case "3":
        generateReport();
        break;
      case "4":
        rl.close();
        break;
      default:
        console.log("Invalid option");
        mainMenu();
    }
  });
}

console.log("Welcome to the Restaurant Management System!");
mainMenu();

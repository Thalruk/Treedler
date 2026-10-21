# Treedler 🌳

A high-performance incremental game built to explore reactive state management and custom game loops in modern Angular.

## 🎯 Overview
Treedler is a browser-based incremental game where players manage the growth, evolution, and resource economy of a tree. While on the surface it's a resource management game, under the hood it serves as a comprehensive study of **Angular Signals**, advanced dependency injection, and scalable architecture for real-time web applications.

## 🏗️ Architectural Highlights
This project was built with a strict focus on clean code, performance, and maintainability. Key engineering decisions include:

* **Signal-Driven Reactivity:** The entire state management and UI binding layer is built exclusively with Angular Signals (`signal`, `computed`). This allows for highly optimized, granular DOM updates happening dozens of times per second without relying on Zone.js dirty checking.
* **Decoupled Micro-Service Architecture:** Business logic is strictly separated from presentation components. The engine is divided into focused singleton services (`ResourceService`, `UpgradeService`, `MutationService`, `SaveService`) utilizing Angular's Dependency Injection.
* **Data-Driven Design:** Game elements (upgrades, costs, effects) are not hardcoded in views. They use a generic, configuration-based class system (`UpgradeBase`). Adding new content requires only defining a new object instance, adhering strictly to the Open-Closed Principle (SOLID).
* **Custom Game Loop:** Implemented a continuous `tick` system that calculates complex temporal logic, dynamic cost multipliers, and resource generation/drains independently of the rendering cycle.
* **Robust Persistence:** Custom serialization engine for `localStorage` capable of handling deeply nested game states, dynamically merging loaded dictionaries with current code definitions to prevent version conflicts.

## 💻 Tech Stack
* **Framework:** Angular 18+ (Standalone Components, Control Flow syntax)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (utility-first, fully responsive design)
* **State Management:** Angular Signals 

## 🎮 Core Mechanics
* **Dynamic Economy:** Multi-resource generation (Water, Minerals, Energy) heavily dependent on interconnected multipliers and upkeep costs.
* **Evolution System (Mutations):** Energy-driven progression that dynamically alters base game rules (e.g., modifying specific upgrade formulas or unlocking new UI layers).
* **Prestiging (Upcoming):** Multi-stage "hard reset" system utilizing persistent DNA modifiers to alter gameplay loops across runs.

## 🚀 Local Setup

1. Clone the repository: 
   git clone https://github.com/yourusername/treedler.git

2. Install dependencies:
   npm install

3. Run the development server:
   npm start

4. Navigate to http://localhost:4200

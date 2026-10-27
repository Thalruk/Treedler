# Treedler 🌳

[![Play in Browser](https://img.shields.io/badge/▶_Play_Live_Demo-Treedler-22c55e?style=for-the-badge)](https://thalruk.github.io/Treedler/)
[![Angular](https://img.shields.io/badge/Angular-18+-dd0031?style=for-the-badge&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

A high-performance, unfolding incremental game built to explore reactive state management, procedural audio synthesis, and custom game loops in modern Angular.

👉 **Play the game in your browser:** **[https://thalruk.github.io/Treedler/](https://thalruk.github.io/Treedler/)**

---

## 🎯 Overview
**Treedler** is a browser-based incremental & resource-management game where players guide the growth, vascular engineering, and genetic evolution of a sentient tree. While on the surface it is a strategic idle game, under the hood it serves as a practical engineering study of **Angular Signals**, strict separation of concerns, and scalable architecture for real-time, tick-driven web applications.

---

## 🏗️ Architectural Highlights
This project was engineered with a strict focus on clean code, zero magic strings, predictable performance, and maintainability:

* **100% Signal-Driven Reactivity:** The entire state management and UI binding layer is powered exclusively by Angular Signals (`signal`, `computed`). Complex dependency graphs—such as multi-layered production multipliers, dynamic level caps, and real-time tooltip breakdowns—recalculate deterministically without relying on heavy change-detection cycles.
* **Dual-Frequency Game Loop (`10Hz` & `1Hz`):** Implemented a custom `GameLoopService` split into two independent ticks:
  * **Fast Tick (`100ms`):** Handles continuous resource drains (active mutations, life cycle stages) prior to production clamping, ensuring smooth progress bars and eliminating UI cap jitter.
  * **Slow Tick (`1000ms`):** Evaluates narrative milestones, triggers procedural flavor events, and manages debounced auto-saving.
* **Decoupled Service Architecture:** Business logic is strictly isolated from presentation components. The core engine is modularized into focused, injectable singleton services (`ResourceService`, `UpgradeService`, `MutationService`, `BloomService`, `StorylineService`, `LogService`, `SaveService`, `AudioService`).
* **Data-Driven & Enum-Strict Design:** Upgrades, evolutionary nodes, and storyline milestones are decoupled into dedicated configuration dictionaries (`core/config/`) backed by strict TypeScript enums. Upgrades inherit from a generic `UpgradeBase` class, adhering to the Open-Closed Principle (SOLID).
* **Procedural Web Audio API Synthesizer:** Features a zero-asset `AudioService` that generates ambient Zen drones, filtered pink/brown noise for canopy wind and leaf rustling, and UI sound effects entirely in real time using native browser oscillators and biquad filters.
* **Fault-Tolerant Persistence:** Custom `localStorage` serialization engine (`SaveService`) that dynamically maps and merges saved signal states with current code definitions, ensuring forward compatibility across balance patches.

---

## 🎮 Core Mechanics
* **Interconnected Multi-Resource Economy:** Balance the extraction and upkeep of **Water**, **Minerals**, and **Energy**. Growing foliage increases energy output but imposes heavy transpiration upkeep on your root system.
* **Hydrostatic Sap Pressure (Capacity-to-Production):** Expand global storage limits through bark and vascular upgrades, then pressurize internal conduits to convert a percentage of your Total Max Capacity directly into passive resource generation.
* **Progressive 12-Node Evolution Tree:** Unlock the **Mutations** system to research biological adaptations. Completing starter adaptations dynamically reveals deeper evolutionary tiers that alter base formulas, reduce leaf upkeep, and raise hard level caps.
* **Metabolic Overdrive (Over-Mutation):** Funnel massive production surpluses directly into active genetic research—consuming full extra multiples of base resource drain to accelerate mutation speed.
* **Life Cycle (Endgame Bloom) & Storyline:** Progress through narrative milestones, unlock permanent passive modifiers, and channel vast resource reserves into a multi-stage reproductive bloom.
* **Granular Telemetry & QoL:** Real-time hover breakdowns for every resource and upgrade (separating flat base values from global multipliers), smart bulk-buying (`x1`, `x5`, `x10`, `MAX` via keyboard shortcuts), and customizable UI filters.

---

## 💻 Tech Stack
* **Framework:** Angular 18+ (Standalone Components, Native `@if` / `@for` Control Flow)
* **Language:** TypeScript (Strict Mode)
* **State Management:** Angular Signals (`signal`, `computed`)
* **Styling:** Tailwind CSS (Full-viewport responsive dashboard layout)
* **Audio:** Native Web Audio API (Procedural sound & ambient synthesis)

---

## 🚀 Local Setup & Development

If you want to play immediately without setting up the repository, visit the **[Live Version](https://thalruk.github.io/Treedler/)**.

To run the project locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/thalruk/treedler.git](https://github.com/thalruk/treedler.git)
   cd treedler

    Install dependencies:
    Bash

    npm install

    Start the development server:
    Bash

    npm start

    Open in browser:
    Navigate to http://localhost:4200/ (or play the deployed build at https://thalruk.github.io/Treedler/).

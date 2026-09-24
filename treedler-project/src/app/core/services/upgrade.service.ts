import { Injectable, signal, computed, inject } from '@angular/core';
import { ResourceService } from './resource';
import { ResourceId } from '../enums/resource.enum';
import { ResearchService } from './research.service';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  private resourceService = inject(ResourceService);
  private researchService = inject(ResearchService);

  // ==========================================
  // 1. STATE (SIGNALS)
  // ==========================================

  public hasFirstRoot = signal<boolean>(false);
  public hasFirstStem = signal<boolean>(false);

  public rootWidthLevel = signal<number>(0);
  public rootDepthLevel = signal<number>(0);
  public barkThicknessLevel = signal<number>(0);
  public branchLevel = signal<number>(0);
  public leafLevel = signal<number>(0);

  // ==========================================
  // 2. LIMITS & CONSTRAINTS (COMPUTED)
  // ==========================================

  public maxLeaves = computed(() => {
    const leavesPerBranch = this.researchService.branchExpansionCompleted() ? 2 : 1;
    return this.branchLevel() * leavesPerBranch;
  });

  // ==========================================
  // 3. COSTS (COMPUTED & CONSTANTS)
  // ==========================================

  public readonly firstRootCost = 5;
  public readonly firstStemCost = 5;

  public rootWidthCost = computed(() => ({
    energy: Math.floor(5 * Math.pow(1.15, this.rootWidthLevel())),
    minerals: Math.floor(4 * Math.pow(1.15, this.rootWidthLevel())),
  }));

  public rootDepthCost = computed(() => ({
    energy: Math.floor(5 * Math.pow(1.15, this.rootDepthLevel())),
    water: Math.floor(4 * Math.pow(1.15, this.rootDepthLevel())),
  }));

  public barkThicknessCost = computed(() => ({
    energy: Math.floor(6 * Math.pow(1.15, this.barkThicknessLevel())),
    minerals: Math.floor(8 * Math.pow(1.15, this.barkThicknessLevel())),
  }));

  public branchCost = computed(() => ({
    energy: Math.floor(8 * Math.pow(1.25, this.branchLevel())),
    water: Math.floor(6 * Math.pow(1.25, this.branchLevel())),
    minerals: Math.floor(6 * Math.pow(1.25, this.branchLevel())),
  }));

  public leafCost = computed(() => ({
    energy: Math.floor(5 * Math.pow(1.3, this.leafLevel())),
    water: Math.floor(5 * Math.pow(1.3, this.leafLevel())),
  }));

  // ==========================================
  // 4. RESOURCE GENERATION & BREAKDOWNS (COMPUTED)
  // ==========================================

  // Water
  public waterGeneration = computed(() => {
    let base = this.hasFirstRoot() ? 1 : 0;
    let fromRoots = this.rootWidthLevel() * 1;
    let leafUpkeep = this.leafLevel() * 0.5;
    return base + fromRoots - leafUpkeep;
  });

  public waterBreakdown = computed(() => ({
    base: this.hasFirstRoot() ? 1 : 0,
    roots: this.rootWidthLevel() * 1,
    leaves: -(this.leafLevel() * 0.5),
  }));

  // Minerals
  public mineralsGeneration = computed(() => {
    let base = this.hasFirstRoot() ? 1 : 0;
    let fromRoots = this.rootDepthLevel() * 1;
    let leafUpkeep = this.leafLevel() * 0.5;
    return base + fromRoots - leafUpkeep;
  });

  public mineralsBreakdown = computed(() => ({
    base: this.hasFirstRoot() ? 1 : 0,
    roots: this.rootDepthLevel() * 1,
    leaves: -(this.leafLevel() * 0.5),
  }));

  // Energy
  public energyGeneration = computed(() => {
    let base = this.hasFirstStem() ? 1 : 0;
    let fromLeaves = this.leafLevel() * 1;
    return base + fromLeaves;
  });

  public energyBreakdown = computed(() => ({
    base: this.hasFirstStem() ? 1 : 0,
    leaves: this.leafLevel() * 1,
  }));

  public capacityBreakdown = computed(() => {
    return {
      base: 10,
      bark: this.barkThicknessLevel() * 10,
    };
  });
  // ==========================================
  // 5. ACTIONS (METHODS)
  // ==========================================

  public buyFirstRoot(): void {
    if (!this.hasFirstRoot() && this.resourceService.water().amount >= this.firstRootCost) {
      this.resourceService.consume(ResourceId.Water, this.firstRootCost);
      this.resourceService.unlock(ResourceId.Water);
      this.resourceService.unlock(ResourceId.Minerals);
      this.hasFirstRoot.set(true);
    }
  }

  public buyFirstStem(): void {
    if (!this.hasFirstStem() && this.resourceService.water().amount >= this.firstStemCost) {
      this.resourceService.consume(ResourceId.Water, this.firstStemCost);
      this.resourceService.unlock(ResourceId.Energy);
      this.hasFirstStem.set(true);
    }
  }

  public buyRootWidth(): void {
    const cost = this.rootWidthCost();
    const energy = this.resourceService.energy().amount;
    const minerals = this.resourceService.minerals().amount;

    if (energy >= cost.energy && minerals >= cost.minerals) {
      this.resourceService.consume(ResourceId.Energy, cost.energy);
      this.resourceService.consume(ResourceId.Minerals, cost.minerals);
      this.rootWidthLevel.update((l) => l + 1);
    }
  }

  public buyRootDepth(): void {
    const cost = this.rootDepthCost();
    const energy = this.resourceService.energy().amount;
    const water = this.resourceService.water().amount;

    if (energy >= cost.energy && water >= cost.water) {
      this.resourceService.consume(ResourceId.Energy, cost.energy);
      this.resourceService.consume(ResourceId.Water, cost.water);
      this.rootDepthLevel.update((l) => l + 1);
    }
  }

  public buyBarkThickness(): void {
    const cost = this.barkThicknessCost();
    const energy = this.resourceService.energy().amount;
    const minerals = this.resourceService.minerals().amount;

    if (energy >= cost.energy && minerals >= cost.minerals) {
      this.resourceService.consume(ResourceId.Energy, cost.energy);
      this.resourceService.consume(ResourceId.Minerals, cost.minerals);
      this.resourceService.increaseMaxAmount(10);
      this.barkThicknessLevel.update((l) => l + 1);
    }
  }

  public buyBranch(): void {
    const cost = this.branchCost();
    const energy = this.resourceService.energy().amount;
    const water = this.resourceService.water().amount;
    const minerals = this.resourceService.minerals().amount;

    if (energy >= cost.energy && water >= cost.water && minerals >= cost.minerals) {
      this.resourceService.consume(ResourceId.Energy, cost.energy);
      this.resourceService.consume(ResourceId.Water, cost.water);
      this.resourceService.consume(ResourceId.Minerals, cost.minerals);
      this.branchLevel.update((l) => l + 1);
    }
  }

  public buyLeaf(): void {
    const cost = this.leafCost();
    const energy = this.resourceService.energy().amount;
    const water = this.resourceService.water().amount;

    if (energy >= cost.energy && water >= cost.water && this.leafLevel() < this.maxLeaves()) {
      this.resourceService.consume(ResourceId.Energy, cost.energy);
      this.resourceService.consume(ResourceId.Water, cost.water);
      this.leafLevel.update((l) => l + 1);
    }
  }
}

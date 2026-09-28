import { Injectable, signal, computed, inject } from '@angular/core';
import { ResourceService } from './resource';
import { ResourceId, ResourceName } from '../enums/resource.enum';
import { MutationService } from './mutation.service';
import { UpgradeBase } from '../classes/upgrade-base';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  private resourceService = inject(ResourceService);
  private mutationService = inject(MutationService);

  // ==========================================
  // 1. MILESTONES & BASE COSTS
  // ==========================================

  public hasFirstRoot = signal<boolean>(false);
  public hasFirstStem = signal<boolean>(false);

  public readonly firstRootCost = 5;
  public readonly firstStemCost = 5;

  // ==========================================
  // 2. UPGRADES REGISTRY (OBJECT-ORIENTED)
  // ==========================================

  public rootWidth = new UpgradeBase('rootWidth', [
    { resourceId: ResourceId.Energy, baseCost: 5, multiplier: 1.15 },
    { resourceId: ResourceId.Minerals, baseCost: 4, multiplier: 1.15 },
  ]);

  public rootDepth = new UpgradeBase('rootDepth', [
    { resourceId: ResourceId.Energy, baseCost: 5, multiplier: 1.15 },
    { resourceId: ResourceId.Water, baseCost: 4, multiplier: 1.15 },
  ]);

  public barkThickness = new UpgradeBase('barkThickness', [
    { resourceId: ResourceId.Energy, baseCost: 6, multiplier: 1.15 },
    { resourceId: ResourceId.Minerals, baseCost: 8, multiplier: 1.15 },
  ]);

  public branch = new UpgradeBase('branch', [
    { resourceId: ResourceId.Energy, baseCost: 8, multiplier: 1.25 },
    { resourceId: ResourceId.Water, baseCost: 6, multiplier: 1.25 },
    { resourceId: ResourceId.Minerals, baseCost: 6, multiplier: 1.25 },
  ]);

  public leaf = new UpgradeBase('leaf', [
    { resourceId: ResourceId.Energy, baseCost: 5, multiplier: 1.3 },
    { resourceId: ResourceId.Water, baseCost: 5, multiplier: 1.3 },
  ]);

  // Nowe ulepszenia
  public sunwardReach = new UpgradeBase('sunwardReach', [
    { resourceId: ResourceId.Energy, baseCost: 60, multiplier: 1.4 },
  ]);

  public vascularTissues = new UpgradeBase('vascularTissues', [
    { resourceId: ResourceId.Energy, baseCost: 45, multiplier: 1.3 },
    { resourceId: ResourceId.Water, baseCost: 35, multiplier: 1.3 },
  ]);

  public rootHairs = new UpgradeBase('rootHairs', [
    { resourceId: ResourceId.Energy, baseCost: 35, multiplier: 1.2 },
    { resourceId: ResourceId.Minerals, baseCost: 50, multiplier: 1.2 },
  ]);

  public canopySpread = new UpgradeBase('canopySpread', [
    { resourceId: ResourceId.Energy, baseCost: 100, multiplier: 1.3 },
    { resourceId: ResourceId.Water, baseCost: 80, multiplier: 1.3 },
  ]);

  public resinSecretion = new UpgradeBase('resinSecretion', [
    { resourceId: ResourceId.Water, baseCost: 100, multiplier: 1.3 },
    { resourceId: ResourceId.Minerals, baseCost: 100, multiplier: 1.3 },
  ]);

  public mycorrhizalNetwork = new UpgradeBase('mycorrhizalNetwork', [
    { resourceId: ResourceId.Energy, baseCost: 150, multiplier: 1.3 },
  ]);
  // ==========================================
  // 3. LIMITS & CONSTRAINTS
  // ==========================================

  public maxLeaves = computed(() => {
    const leavesPerBranch = this.mutationService.denseBranchingCompleted() ? 2 : 1;
    return this.branch.level() * leavesPerBranch;
  });

  // ==========================================
  // 4. RESOURCE GENERATION & BREAKDOWNS
  // ==========================================

  public waterGeneration = computed(() => {
    let base = this.hasFirstRoot() ? 1 : 0;
    let fromRoots = this.rootWidth.level() * 1;
    let fromRootHairs = this.rootHairs.level() * 2;
    let leafUpkeep = this.leaf.level() * 0.5;
    return base + fromRoots + fromRootHairs - leafUpkeep;
  });

  public waterBreakdown = computed(() => ({
    base: this.hasFirstRoot() ? 1 : 0,
    roots: this.rootWidth.level() * 1,
    rootHairs: this.rootHairs.level() * 2,
    leaves: -(this.leaf.level() * 0.5),
  }));

  public mineralsGeneration = computed(() => {
    let base = this.hasFirstRoot() ? 1 : 0;
    let fromRoots = this.rootDepth.level() * 1;
    let fromFungi = this.mycorrhizalNetwork.level() * 3;
    let leafUpkeep = this.leaf.level() * 0.5;
    return base + fromRoots + fromFungi - leafUpkeep;
  });

  public mineralsBreakdown = computed(() => ({
    base: this.hasFirstRoot() ? 1 : 0,
    roots: this.rootDepth.level() * 1,
    mycorrhizalNetwork: this.mycorrhizalNetwork.level() * 3,
    leaves: -(this.leaf.level() * 0.5),
  }));

  public energyGeneration = computed(() => {
    let base = this.hasFirstStem() ? 1 : 0;
    let leafMultiplier = 1 + this.sunwardReach.level() * 0.2;
    let fromLeaves = this.leaf.level() * leafMultiplier;
    let fromVascular = this.vascularTissues.level() * 1;
    return base + fromLeaves + fromVascular;
  });

  public energyBreakdown = computed(() => ({
    base: this.hasFirstStem() ? 1 : 0,
    leaves: this.leaf.level() * (1 + this.sunwardReach.level() * 0.2),
    vascularTissues: this.vascularTissues.level() * 1,
  }));

  public capacityBreakdown = computed(() => ({
    base: 10,
    bark: this.barkThickness.level() * 10,
    vascularTissues: this.vascularTissues.level() * 5,
    canopySpread: this.canopySpread.level() * 15,
    resinSecretion: this.resinSecretion.level() * 20,
  }));

  // ==========================================
  // 5. HELPER METHODS FOR UI
  // ==========================================

  private getResourceAmount(id: ResourceId): number {
    if (id === ResourceId.Water) return this.resourceService.water().amount;
    if (id === ResourceId.Minerals) return this.resourceService.minerals().amount;
    if (id === ResourceId.Energy) return this.resourceService.energy().amount;
    return 0;
  }

  private getResourceMaxAmount(id: ResourceId): number {
    if (id === ResourceId.Water) return this.resourceService.water().maxAmount;
    if (id === ResourceId.Minerals) return this.resourceService.minerals().maxAmount;
    if (id === ResourceId.Energy) return this.resourceService.energy().maxAmount;
    return 0;
  }

  public canAfford(upgrade: UpgradeBase): boolean {
    return upgrade.costs().every((c) => this.getResourceAmount(c.resourceId) >= c.amount);
  }

  public isReachable(upgrade: UpgradeBase): boolean {
    return upgrade.costs().every((c) => this.getResourceMaxAmount(c.resourceId) >= c.amount);
  }

  public getFormattedCosts(upgrade: UpgradeBase): { amount: number; resourceName: string }[] {
    return upgrade
      .costs()
      .sort((a, b) => a.resourceId - b.resourceId)
      .map((c) => ({
        amount: c.amount,
        resourceName: ResourceName[c.resourceId],
      }));
  }

  // ==========================================
  // 6. ACTIONS (METHODS)
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

  public buyUpgrade(upgrade: UpgradeBase, maxLevelLimit?: number): void {
    if (maxLevelLimit !== undefined && upgrade.level() >= maxLevelLimit) return;

    if (this.canAfford(upgrade)) {
      upgrade.costs().forEach((cost) => {
        this.resourceService.consume(cost.resourceId, cost.amount);
      });

      if (upgrade.id === 'barkThickness') this.resourceService.increaseMaxAmount(10);
      if (upgrade.id === 'vascularTissues') this.resourceService.increaseMaxAmount(5);
      if (upgrade.id === 'canopySpread') this.resourceService.increaseMaxAmount(15);
      if (upgrade.id === 'resinSecretion') this.resourceService.increaseMaxAmount(20);

      upgrade.level.update((l) => l + 1);
    }
  }
}

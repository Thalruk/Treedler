import { Injectable, signal, computed, inject } from '@angular/core';
import { ResourceService } from './resource';
import { ResourceId, ResourceName } from '../enums/resource.enum';
import { MutationService } from './mutation.service';
import { UpgradeBase } from '../classes/upgrade-base';
import { ShortcutService } from './shortcut.service';
import { UPGRADES_CONFIG } from '../config/upgrades.config';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  private resourceService = inject(ResourceService);
  private mutationService = inject(MutationService);
  private shortcutService = inject(ShortcutService);

  // ==========================================
  // 1. MILESTONES & BASE COSTS
  // ==========================================

  public hasFirstRoot = signal<boolean>(false);
  public hasFirstStem = signal<boolean>(false);

  // STORYLINE PERMANENT REWARDS
  public hasPermanentLeafDiscount = signal<boolean>(false);

  public readonly firstRootCost = 5;
  public readonly firstStemCost = 5;

  // ==========================================
  // 2. UPGRADES REGISTRY
  // ==========================================

  // --- CROWN ---
  public branch = new UpgradeBase('branch', UPGRADES_CONFIG['branch']);
  public leaf = new UpgradeBase('leaf', UPGRADES_CONFIG['leaf']);
  public sunwardReach = new UpgradeBase('sunwardReach', UPGRADES_CONFIG['sunwardReach']);
  public canopySpread = new UpgradeBase('canopySpread', UPGRADES_CONFIG['canopySpread']);

  // --- BARK ---
  public barkThickness = new UpgradeBase('barkThickness', UPGRADES_CONFIG['barkThickness']);
  public vascularTissues = new UpgradeBase('vascularTissues', UPGRADES_CONFIG['vascularTissues']);
  public resinSecretion = new UpgradeBase('resinSecretion', UPGRADES_CONFIG['resinSecretion']);

  // --- ROOTS ---
  public rootWidth = new UpgradeBase('rootWidth', UPGRADES_CONFIG['rootWidth']);
  public rootDepth = new UpgradeBase('rootDepth', UPGRADES_CONFIG['rootDepth']);
  public rootHairs = new UpgradeBase('rootHairs', UPGRADES_CONFIG['rootHairs']);
  public mycorrhizalNetwork = new UpgradeBase(
    'mycorrhizalNetwork',
    UPGRADES_CONFIG['mycorrhizalNetwork'],
  );
  public rootVigor = new UpgradeBase('rootVigor', UPGRADES_CONFIG['rootVigor']);
  // ==========================================
  // 3. LIMITS & CONSTRAINTS
  // ==========================================

  public maxLeaves = computed(() => {
    const bonusLeaves = this.mutationService.isCompleted('dense_branching') ? 5 : 0;
    return this.branch.level() * (50 + bonusLeaves);
  });

  // ==========================================
  // 4. RESOURCE GENERATION & BREAKDOWNS
  // ==========================================

  public leafWaterUpkeep = computed(() =>
    this.mutationService.isCompleted('stomata_optimization') ? 0.015 : 0.02,
  );

  public leafEnergyBase = computed(() =>
    this.mutationService.isCompleted('chloroplast_refinement') ? 0.12 : 0.1,
  );

  public rootMultiplier = computed(() => 1 + this.rootVigor.level() * 0.1);

  public waterGeneration = computed(() => {
    let base = this.hasFirstRoot() ? 1 : 0;
    let fromRoots =
      (this.rootWidth.level() * 1 + this.rootHairs.level() * 2) * this.rootMultiplier();
    let leafUpkeep = this.leaf.level() * this.leafWaterUpkeep();
    return base + fromRoots - leafUpkeep;
  });

  public waterBreakdown = computed(() => ({
    base: this.hasFirstRoot() ? 1 : 0,
    rootWidth: this.rootWidth.level() * 1,
    rootHairs: this.rootHairs.level() * 2,
    rootVigorPercent: this.rootVigor.level() * 10,
    subtotalRoots:
      (this.rootWidth.level() * 1 + this.rootHairs.level() * 2) * this.rootMultiplier(),
    leaves: -(this.leaf.level() * this.leafWaterUpkeep()),
  }));

  public mineralsGeneration = computed(() => {
    let base = this.hasFirstRoot() ? 1 : 0;
    let fromRoots =
      (this.rootDepth.level() * 1 + this.mycorrhizalNetwork.level() * 3) * this.rootMultiplier();
    let leafUpkeep = this.leaf.level() * 0.02;
    return base + fromRoots - leafUpkeep;
  });

  public mineralsBreakdown = computed(() => ({
    base: this.hasFirstRoot() ? 1 : 0,
    rootDepth: this.rootDepth.level() * 1,
    mycorrhizalNetwork: this.mycorrhizalNetwork.level() * 3,
    rootVigorPercent: this.rootVigor.level() * 10,
    subtotalRoots:
      (this.rootDepth.level() * 1 + this.mycorrhizalNetwork.level() * 3) * this.rootMultiplier(),
    leaves: -(this.leaf.level() * 0.02),
  }));
  public energyGeneration = computed(() => {
    let base = this.hasFirstStem() ? 1 : 0;
    let leafMultiplier = this.leafEnergyBase() + this.sunwardReach.level() * 0.02;
    let fromLeaves = this.leaf.level() * leafMultiplier;
    let fromVascular = this.vascularTissues.level() * 1;
    return base + fromLeaves + fromVascular;
  });

  public energyBreakdown = computed(() => ({
    base: this.hasFirstStem() ? 1 : 0,
    leaves: this.leaf.level() * (this.leafEnergyBase() + this.sunwardReach.level() * 0.02),
    vascularTissues: this.vascularTissues.level() * 1,
  }));

  public capacityBreakdown = computed(() => ({
    base: this.hasFirstStem() ? 30 : 10,
    bark: this.barkThickness.level() * 10,
    vascularTissues: this.vascularTissues.level() * 5,
    canopySpread: this.canopySpread.level() * 15,
    resinSecretion: this.resinSecretion.level() * 20,
  }));

  // ==========================================
  // 5. HELPER METHODS FOR UI & MULTIPLIERS
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

  public getTargetQuantity(
    upgrade: UpgradeBase,
    requestedQuantity: number,
    limit?: number,
  ): number {
    let maxAllowed = limit !== undefined ? limit - upgrade.level() : Infinity;
    if (maxAllowed <= 0) return 1;
    return Math.min(requestedQuantity, maxAllowed);
  }

  private getCostsForQuantity(
    upgrade: UpgradeBase,
    quantity: number,
  ): { resourceId: ResourceId; amount: number }[] {
    return upgrade.costConfigs.map((config) => {
      let total = 0;
      let discount = 1.0;

      // ==========================================
      // STORYLINE MILESTONES DISCOUNTS
      // ==========================================
      if (upgrade.id === 'leaf' && this.hasPermanentLeafDiscount()) {
        discount = 0.9;
      }

      for (let i = 0; i < quantity; i++) {
        total += Math.floor(
          config.baseCost * Math.pow(config.multiplier, upgrade.level() + i) * discount,
        );
      }
      return { resourceId: config.resourceId, amount: total };
    });
  }

  public getFormattedCosts(
    upgrade: UpgradeBase,
    limit?: number,
  ): { amount: number; resourceName: string }[] {
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    return this.getCostsForQuantity(upgrade, qty)
      .sort((a, b) => a.resourceId - b.resourceId)
      .map((c) => ({
        amount: c.amount,
        resourceName: ResourceName[c.resourceId],
      }));
  }

  public canAfford(upgrade: UpgradeBase, limit?: number): boolean {
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    const costs = this.getCostsForQuantity(upgrade, qty);
    return costs.every((c) => this.getResourceAmount(c.resourceId) >= c.amount);
  }

  public isReachable(upgrade: UpgradeBase, limit?: number): boolean {
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    const costs = this.getCostsForQuantity(upgrade, qty);
    return costs.every((c) => this.getResourceMaxAmount(c.resourceId) >= c.amount);
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
      this.resourceService.increaseMaxAmount(20);
      this.hasFirstStem.set(true);
    }
  }

  public buyUpgrade(upgrade: UpgradeBase, limit?: number): void {
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    if (limit !== undefined && upgrade.level() + qty > limit) return;

    if (this.canAfford(upgrade, limit)) {
      const costs = this.getCostsForQuantity(upgrade, qty);
      costs.forEach((cost) => {
        this.resourceService.consume(cost.resourceId, cost.amount);
      });

      if (upgrade.id === 'barkThickness') this.resourceService.increaseMaxAmount(10 * qty);
      if (upgrade.id === 'vascularTissues') this.resourceService.increaseMaxAmount(5 * qty);
      if (upgrade.id === 'canopySpread') this.resourceService.increaseMaxAmount(15 * qty);
      if (upgrade.id === 'resinSecretion') this.resourceService.increaseMaxAmount(20 * qty);

      upgrade.level.update((l) => l + qty);
    }
  }
}

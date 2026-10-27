import { Injectable, signal, computed, inject } from '@angular/core';
import { ResourceService } from './resource.service';
import { ResourceId, ResourceName } from '../enums/resource.enum';
import { UpgradeId } from '../enums/upgrade.enum';
import { MutationId } from '../enums/mutation.enum';
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
  public hasDeepAnchorageBonus = signal<boolean>(false);
  public hasAncientTimberBonus = signal<boolean>(false);
  public hasApexFloraBonus = signal<boolean>(false);

  public readonly firstRootCost = 5;
  public readonly firstStemCost = 5;

  // ==========================================
  // 2. UPGRADES REGISTRY
  // ==========================================

  // --- CROWN ---
  public branch = new UpgradeBase(UpgradeId.Branch, UPGRADES_CONFIG[UpgradeId.Branch]);
  public leaf = new UpgradeBase(UpgradeId.Leaf, UPGRADES_CONFIG[UpgradeId.Leaf]);
  public sunwardReach = new UpgradeBase(
    UpgradeId.SunwardReach,
    UPGRADES_CONFIG[UpgradeId.SunwardReach],
  );
  public canopySpread = new UpgradeBase(
    UpgradeId.CanopySpread,
    UPGRADES_CONFIG[UpgradeId.CanopySpread],
  );

  // --- BARK ---
  public barkThickness = new UpgradeBase(
    UpgradeId.BarkThickness,
    UPGRADES_CONFIG[UpgradeId.BarkThickness],
  );
  public vascularTissues = new UpgradeBase(
    UpgradeId.VascularTissues,
    UPGRADES_CONFIG[UpgradeId.VascularTissues],
  );
  public sapPressure = new UpgradeBase(
    UpgradeId.SapPressure,
    UPGRADES_CONFIG[UpgradeId.SapPressure],
  );
  public resinSecretion = new UpgradeBase(
    UpgradeId.ResinSecretion,
    UPGRADES_CONFIG[UpgradeId.ResinSecretion],
  );

  // --- ROOTS ---
  public rootWidth = new UpgradeBase(UpgradeId.RootWidth, UPGRADES_CONFIG[UpgradeId.RootWidth]);
  public rootDepth = new UpgradeBase(UpgradeId.RootDepth, UPGRADES_CONFIG[UpgradeId.RootDepth]);
  public rootHairs = new UpgradeBase(UpgradeId.RootHairs, UPGRADES_CONFIG[UpgradeId.RootHairs]);
  public mycorrhizalNetwork = new UpgradeBase(
    UpgradeId.MycorrhizalNetwork,
    UPGRADES_CONFIG[UpgradeId.MycorrhizalNetwork],
  );
  public rootVigor = new UpgradeBase(UpgradeId.RootVigor, UPGRADES_CONFIG[UpgradeId.RootVigor]);

  // ==========================================
  // 3. LIMITS & CONSTRAINTS (DYNAMIC CAPS)
  // ==========================================

  public leavesPerBranch = computed(() => {
    let base = 10;
    if (this.mutationService.isCompleted(MutationId.DenseBranching)) base += 3;
    if (this.mutationService.isCompleted(MutationId.FractalCanopy)) base += 6;
    return base;
  });

  public maxLeaves = computed(() => this.branch.level() * this.leavesPerBranch());

  public maxSunwardReach = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted(MutationId.CuticleWaxing)) cap += 2;
    if (this.mutationService.isCompleted(MutationId.ChloroplastRefinement)) cap += 4;
    if (this.mutationService.isCompleted(MutationId.PhotosyntheticCascade)) cap += 5;
    return cap;
  });

  public maxCanopySpread = computed(() => {
    let cap = 4;
    if (this.mutationService.isCompleted(MutationId.DenseBranching)) cap += 3;
    if (this.mutationService.isCompleted(MutationId.FractalCanopy)) cap += 7;
    return cap;
  });

  public maxBarkThickness = computed(() => {
    let cap = 10;
    if (this.mutationService.isCompleted(MutationId.CuticleWaxing)) cap += 5;
    if (this.mutationService.isCompleted(MutationId.LigninSynthesis)) cap += 5;
    if (this.mutationService.isCompleted(MutationId.HeartwoodFormation)) cap += 10;
    return cap;
  });

  public maxVascularTissues = computed(() => {
    let cap = 5;
    if (this.mutationService.isCompleted(MutationId.StomataOptimization)) cap += 4;
    if (this.mutationService.isCompleted(MutationId.XylemConduits)) cap += 5;
    return cap;
  });

  public maxSapPressure = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted(MutationId.StomataOptimization)) cap += 3;
    if (this.mutationService.isCompleted(MutationId.XylemConduits)) cap += 4;
    if (this.mutationService.isCompleted(MutationId.HeartwoodFormation)) cap += 5;
    return cap;
  });

  public maxResinSecretion = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted(MutationId.LigninSynthesis)) cap += 3;
    if (this.mutationService.isCompleted(MutationId.HeartwoodFormation)) cap += 5;
    if (this.mutationService.isCompleted(MutationId.FractalCanopy)) cap += 5;
    return cap;
  });

  public maxRootHairs = computed(() => {
    let cap = 4;
    if (this.mutationService.isCompleted(MutationId.FibrousRootlets)) cap += 3;
    if (this.mutationService.isCompleted(MutationId.DenseBranching)) cap += 3;
    if (this.mutationService.isCompleted(MutationId.SymbioticMycelium)) cap += 4;
    return cap;
  });

  public maxMycorrhizalNetwork = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted(MutationId.SymbioticMycelium)) cap += 5;
    if (this.mutationService.isCompleted(MutationId.DeepTaproot)) cap += 3;
    return cap;
  });

  public maxRootVigor = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted(MutationId.FibrousRootlets)) cap += 2;
    if (this.mutationService.isCompleted(MutationId.DeepTaproot)) cap += 5;
    return cap;
  });

  public isMaxed(upgrade: UpgradeBase, limit?: number): boolean {
    return limit !== undefined && upgrade.level() >= limit;
  }
  // ==========================================
  // 4. CAPACITY CALCULATION & BREAKDOWN (PER RESOURCE)
  // ==========================================

  private globalCapacityMultipliers = computed(() => {
    const resinPercent = this.resinSecretion.level() * 5;
    const resinMultiplier = 1 + resinPercent / 100;
    const ligninMultiplier = this.mutationService.isCompleted(MutationId.LigninSynthesis)
      ? 1.2
      : 1.0;
    const heartwoodMultiplier = this.mutationService.isCompleted(MutationId.HeartwoodFormation)
      ? 1.35
      : 1.0;
    const timberMultiplier = this.hasAncientTimberBonus() ? 1.25 : 1.0;

    return {
      resinPercent,
      hasLignin: this.mutationService.isCompleted(MutationId.LigninSynthesis),
      hasHeartwood: this.mutationService.isCompleted(MutationId.HeartwoodFormation),
      hasAncientTimber: this.hasAncientTimberBonus(),
      totalMultiplier: resinMultiplier * ligninMultiplier * heartwoodMultiplier * timberMultiplier,
    };
  });

  public waterCapacityBreakdown = computed(() => {
    const base = this.hasFirstStem() ? 25 : 10;
    const bark = this.barkThickness.level() * 15;
    const rootWidthCap = this.rootWidth.level() * 10;
    const vascularTissues = this.vascularTissues.level() * 35;
    const canopySpread = this.canopySpread.level() * 25;

    const flatTotal = base + bark + rootWidthCap + vascularTissues + canopySpread;
    const mults = this.globalCapacityMultipliers();
    const total = Math.floor(flatTotal * mults.totalMultiplier);

    return {
      base,
      bark,
      rootWidthCap,
      vascularTissues,
      canopySpread,
      flatTotal,
      ...mults,
      total,
    };
  });

  public mineralsCapacityBreakdown = computed(() => {
    const base = this.hasFirstStem() ? 25 : 10;
    const bark = this.barkThickness.level() * 15;
    const rootDepthCap = this.rootDepth.level() * 10;
    const resinSecretion = this.resinSecretion.level() * 50;

    const flatTotal = base + bark + rootDepthCap + resinSecretion;
    const mults = this.globalCapacityMultipliers();
    const total = Math.floor(flatTotal * mults.totalMultiplier);

    return {
      base,
      bark,
      rootDepthCap,
      resinSecretion,
      flatTotal,
      ...mults,
      total,
    };
  });

  public energyCapacityBreakdown = computed(() => {
    const base = this.hasFirstStem() ? 25 : 10;
    const bark = this.barkThickness.level() * 15;
    const canopySpread = this.canopySpread.level() * 60;
    const resinSecretion = this.resinSecretion.level() * 50;

    const flatTotal = base + bark + canopySpread + resinSecretion;
    const mults = this.globalCapacityMultipliers();
    const total = Math.floor(flatTotal * mults.totalMultiplier);

    return {
      base,
      bark,
      canopySpread,
      resinSecretion,
      flatTotal,
      ...mults,
      total,
    };
  });

  public waterMaxCapacity = computed(() => this.waterCapacityBreakdown().total);
  public mineralsMaxCapacity = computed(() => this.mineralsCapacityBreakdown().total);
  public energyMaxCapacity = computed(() => this.energyCapacityBreakdown().total);

  // ==========================================
  // 5. RESOURCE GENERATION & BREAKDOWNS
  // ==========================================

  public sapPressureRate = computed(() =>
    this.mutationService.isCompleted(MutationId.XylemConduits) ? 0.001 : 0.0005,
  );

  public waterSapPressure = computed(
    () => this.sapPressure.level() * this.waterMaxCapacity() * this.sapPressureRate(),
  );
  public mineralsSapPressure = computed(
    () => this.sapPressure.level() * this.mineralsMaxCapacity() * this.sapPressureRate(),
  );
  public energySapPressure = computed(
    () => this.sapPressure.level() * this.energyMaxCapacity() * this.sapPressureRate(),
  );
  public leafResourceUpkeep = computed(() => {
    let upkeep = 0.08;
    if (this.mutationService.isCompleted(MutationId.CuticleWaxing)) upkeep = 0.065;
    if (this.mutationService.isCompleted(MutationId.StomataOptimization)) upkeep = 0.05;
    if (this.mutationService.isCompleted(MutationId.PhotosyntheticCascade)) upkeep = 0.035;
    return upkeep;
  });

  public leafEnergyBase = computed(() => 0.12);

  public leafEnergyMultiplier = computed(() => {
    let mult = 1.0;
    if (this.mutationService.isCompleted(MutationId.ChloroplastRefinement)) mult *= 1.25;
    if (this.mutationService.isCompleted(MutationId.PhotosyntheticCascade)) mult *= 1.25;
    if (this.hasApexFloraBonus()) mult *= 1.5;
    return mult;
  });

  public singleLeafEnergy = computed(
    () => (this.leafEnergyBase() + this.sunwardReach.level() * 0.03) * this.leafEnergyMultiplier(),
  );

  public rootMultiplier = computed(() => {
    let mult = 1 + this.rootVigor.level() * 0.1;
    if (this.mutationService.isCompleted(MutationId.FibrousRootlets)) mult *= 1.15;
    if (this.mutationService.isCompleted(MutationId.DeepTaproot)) mult *= 1.25;
    if (this.hasDeepAnchorageBonus()) mult *= 1.25;
    return mult;
  });

  public waterGeneration = computed(() => {
    const base = this.hasFirstRoot() ? 1 : 0;
    const myceliumBonus = this.mutationService.isCompleted(MutationId.SymbioticMycelium)
      ? this.mycorrhizalNetwork.level() * 1.5
      : 0;
    const fromRoots =
      (this.rootWidth.level() * 1 + this.rootHairs.level() * 2.5 + myceliumBonus) *
      this.rootMultiplier();
    const fromSapPressure = this.waterSapPressure();
    const leafUpkeep = this.leaf.level() * this.leafResourceUpkeep();
    return base + fromRoots + fromSapPressure - leafUpkeep;
  });

  public waterBreakdown = computed(() => {
    const myceliumBonus = this.mutationService.isCompleted(MutationId.SymbioticMycelium)
      ? this.mycorrhizalNetwork.level() * 1.5
      : 0;
    return {
      base: this.hasFirstRoot() ? 1 : 0,
      rootWidth: this.rootWidth.level() * 1,
      rootHairs: this.rootHairs.level() * 2.5,
      myceliumWater: myceliumBonus,
      rootVigorPercent: this.rootVigor.level() * 10,
      hasFibrousRootlets: this.mutationService.isCompleted(MutationId.FibrousRootlets),
      hasDeepTaproot: this.mutationService.isCompleted(MutationId.DeepTaproot),
      hasDeepAnchorage: this.hasDeepAnchorageBonus(),
      subtotalRoots:
        (this.rootWidth.level() * 1 + this.rootHairs.level() * 2.5 + myceliumBonus) *
        this.rootMultiplier(),
      sapPressure: this.waterSapPressure(),
      leaves: -(this.leaf.level() * this.leafResourceUpkeep()),
    };
  });

  public mineralsGeneration = computed(() => {
    const base = this.hasFirstRoot() ? 1 : 0;
    const fromRoots =
      (this.rootDepth.level() * 1 + this.mycorrhizalNetwork.level() * 3.5) * this.rootMultiplier();
    const fromSapPressure = this.mineralsSapPressure();
    const leafUpkeep = this.leaf.level() * this.leafResourceUpkeep();
    return base + fromRoots + fromSapPressure - leafUpkeep;
  });

  public mineralsBreakdown = computed(() => ({
    base: this.hasFirstRoot() ? 1 : 0,
    rootDepth: this.rootDepth.level() * 1,
    mycorrhizalNetwork: this.mycorrhizalNetwork.level() * 3.5,
    rootVigorPercent: this.rootVigor.level() * 10,
    hasFibrousRootlets: this.mutationService.isCompleted(MutationId.FibrousRootlets),
    hasDeepTaproot: this.mutationService.isCompleted(MutationId.DeepTaproot),
    hasDeepAnchorage: this.hasDeepAnchorageBonus(),
    subtotalRoots:
      (this.rootDepth.level() * 1 + this.mycorrhizalNetwork.level() * 3.5) * this.rootMultiplier(),
    sapPressure: this.mineralsSapPressure(),
    leaves: -(this.leaf.level() * this.leafResourceUpkeep()),
  }));

  public energyGeneration = computed(() => {
    const apexMult = this.hasApexFloraBonus() ? 1.5 : 1.0;
    const base = (this.hasFirstStem() ? 1 : 0) * apexMult;
    const fromLeaves = this.leaf.level() * this.singleLeafEnergy();
    const fromVascular = this.vascularTissues.level() * 1.0 * apexMult;
    const fromSapPressure = this.energySapPressure() * apexMult;
    const fromMycelium =
      (this.mutationService.isCompleted(MutationId.SymbioticMycelium)
        ? this.mycorrhizalNetwork.level() * 1.5
        : 0) * apexMult;
    return base + fromLeaves + fromVascular + fromSapPressure + fromMycelium;
  });

  public energyBreakdown = computed(() => {
    const apexMult = this.hasApexFloraBonus() ? 1.5 : 1.0;
    const leafCount = this.leaf.level();
    return {
      base: (this.hasFirstStem() ? 1 : 0) * apexMult,
      leaves: leafCount * this.singleLeafEnergy(),
      leafBaseTotal: leafCount * this.leafEnergyBase(),
      sunwardReachTotal: leafCount * (this.sunwardReach.level() * 0.03),
      hasChloroplast: this.mutationService.isCompleted(MutationId.ChloroplastRefinement),
      hasCascade: this.mutationService.isCompleted(MutationId.PhotosyntheticCascade),
      hasApexFlora: this.hasApexFloraBonus(),
      vascularTissues: this.vascularTissues.level() * 1.0 * apexMult,
      sapPressure: this.energySapPressure() * apexMult,
      symbioticMycelium:
        (this.mutationService.isCompleted(MutationId.SymbioticMycelium)
          ? this.mycorrhizalNetwork.level() * 1.5
          : 0) * apexMult,
    };
  });

  // ==========================================
  // 6. HELPER METHODS FOR UI & MULTIPLIERS
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

  public getAffordableQuantity(
    upgrade: UpgradeBase,
    requestedQuantity: number,
    limit?: number,
  ): number {
    const maxAllowed = limit !== undefined ? limit - upgrade.level() : Infinity;
    if (maxAllowed <= 0) return 0;

    const cap = Math.min(requestedQuantity, maxAllowed);
    let affordableQty = 0;

    for (let i = 1; i <= cap; i++) {
      const costs = this.getCostsForQuantity(upgrade, i);
      const canAfford = costs.every((c) => this.getResourceAmount(c.resourceId) >= c.amount);

      if (canAfford) {
        affordableQty = i;
      } else {
        break;
      }
    }
    return affordableQty;
  }

  public getTargetQuantity(
    upgrade: UpgradeBase,
    requestedQuantity: number,
    limit?: number,
  ): number {
    return Math.max(1, this.getAffordableQuantity(upgrade, requestedQuantity, limit));
  }

  private getCostsForQuantity(
    upgrade: UpgradeBase,
    quantity: number,
  ): { resourceId: ResourceId; amount: number }[] {
    return upgrade.costConfigs.map((config) => {
      let total = 0;
      let discount = 1.0;

      if (upgrade.id === UpgradeId.Leaf && this.hasPermanentLeafDiscount()) {
        const branchCount = this.branch.level();
        const discountPercentage = branchCount * 0.01;
        discount = Math.max(0.2, 1.0 - discountPercentage);
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
    if (this.isMaxed(upgrade, limit)) return false;
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    const costs = this.getCostsForQuantity(upgrade, qty);
    return costs.every((c) => this.getResourceAmount(c.resourceId) >= c.amount);
  }

  public isReachable(upgrade: UpgradeBase, limit?: number): boolean {
    if (this.isMaxed(upgrade, limit)) return true;
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    const costs = this.getCostsForQuantity(upgrade, qty);
    return costs.every((c) => this.getResourceMaxAmount(c.resourceId) >= c.amount);
  }

  // ==========================================
  // 7. ACTIONS (METHODS)
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

  public buyUpgrade(upgrade: UpgradeBase, limit?: number): void {
    if (this.isMaxed(upgrade, limit)) return;
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    if (limit !== undefined && upgrade.level() + qty > limit) return;

    if (this.canAfford(upgrade, limit)) {
      const costs = this.getCostsForQuantity(upgrade, qty);
      costs.forEach((cost) => {
        this.resourceService.consume(cost.resourceId, cost.amount);
      });

      upgrade.level.update((l) => l + qty);
    }
  }
}

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../../core/services/resource.service';
import { UpgradeService } from '../../../core/services/upgrade.service';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { MutationService } from '../../../core/services/mutation.service';
import { UpgradeButtonComponent } from '../../../shared/ui/upgrade-button/upgrade-button';
import { UpgradeBase } from '../../../core/classes/upgrade-base';

export interface UpgradeView {
  model: UpgradeBase;
  title: string;
  description: string;
  effect: string[];
  limit?: number;
  isVisible?: () => boolean;
}

@Component({
  selector: 'app-tree-tab',
  standalone: true,
  imports: [CommonModule, UpgradeButtonComponent],
  templateUrl: './tree-tab.html',
})
export class TreeTabComponent {
  public resourceService = inject(ResourceService);
  public upgradeService = inject(UpgradeService);
  public shortcutService = inject(ShortcutService);
  public mutationService = inject(MutationService);

  public getTitle(upgrade: UpgradeBase, baseTitle: string, limit?: number): string {
    if (this.upgradeService.isMaxed(upgrade, limit)) return baseTitle;

    const mult = this.shortcutService.multiplier();
    if (mult <= 1) return baseTitle;

    const affordable = this.upgradeService.getAffordableQuantity(upgrade, mult, limit);
    return `${baseTitle} [+${affordable}/${mult}]`;
  }

  public crownUpgrades = computed<UpgradeView[]>(() => [
    {
      model: this.upgradeService.branch,
      title: this.getTitle(
        this.upgradeService.branch,
        `Grow Branch (Lvl ${this.upgradeService.branch.level()})`,
      ),
      description: 'Extends the tree structure, creating space for new Leaves.',
      effect: [`+${this.upgradeService.leavesPerBranch()} Leaf Capacity`],
    },
    {
      model: this.upgradeService.leaf,
      title: this.getTitle(
        this.upgradeService.leaf,
        `Sprout Leaf (Lvl ${this.upgradeService.leaf.level()} / ${this.upgradeService.maxLeaves()})`,
        this.upgradeService.maxLeaves(),
      ),
      description: 'Converts water and minerals into precious energy in small amounts.',
      effect: [
        `-${this.upgradeService.leafResourceUpkeep()} Water/s`,
        `-${this.upgradeService.leafResourceUpkeep()} Minerals/s`,
        `+${this.upgradeService.singleLeafEnergy().toFixed(2)} Energy/s`,
      ],
      limit: this.upgradeService.maxLeaves(),
    },
    {
      model: this.upgradeService.sunwardReach,
      title: this.getTitle(
        this.upgradeService.sunwardReach,
        `Sunward Reach (Lvl ${this.upgradeService.sunwardReach.level()} / ${this.upgradeService.maxSunwardReach()})`,
        this.upgradeService.maxSunwardReach(),
      ),
      description: 'Bend your branches towards the sun, optimizing light absorption.',
      effect: ['+0.03 Base Energy per Leaf'],
      limit: this.upgradeService.maxSunwardReach(),
      isVisible: () => this.upgradeService.branch.level() >= 3,
    },
    {
      model: this.upgradeService.canopySpread,
      title: this.getTitle(
        this.upgradeService.canopySpread,
        `Canopy Spread (Lvl ${this.upgradeService.canopySpread.level()} / ${this.upgradeService.maxCanopySpread()})`,
        this.upgradeService.maxCanopySpread(),
      ),
      description:
        'Broaden the leafy canopy to capture more rain and dew, increasing global storage.',
      effect: ['+75 All Max Limits'],
      limit: this.upgradeService.maxCanopySpread(),
      isVisible: () => this.upgradeService.leaf.level() >= 25,
    },
  ]);

  public barkUpgrades = computed<UpgradeView[]>(() => [
    {
      model: this.upgradeService.barkThickness,
      title: this.getTitle(
        this.upgradeService.barkThickness,
        `Thicken Bark (Lvl ${this.upgradeService.barkThickness.level()})`,
      ),
      description: 'Increases structural integrity, allowing you to store more resources.',
      effect: ['+25 All Max Limits'],
    },
    {
      model: this.upgradeService.vascularTissues,
      title: this.getTitle(
        this.upgradeService.vascularTissues,
        `Vascular Tissues (Lvl ${this.upgradeService.vascularTissues.level()} / ${this.upgradeService.maxVascularTissues()})`,
        this.upgradeService.maxVascularTissues(),
      ),
      description: 'Develop internal channels to better distribute and store resources.',
      effect: ['+20 All Max Limits', '+1.5 Energy/s'],
      limit: this.upgradeService.maxVascularTissues(),
      isVisible: () => this.upgradeService.barkThickness.level() >= 3,
    },
    {
      model: this.upgradeService.resinSecretion,
      title: this.getTitle(
        this.upgradeService.resinSecretion,
        `Resin Secretion (Lvl ${this.upgradeService.resinSecretion.level()} / ${this.upgradeService.maxResinSecretion()})`,
        this.upgradeService.maxResinSecretion(),
      ),
      description: 'Seal the outer bark with hardened resin to vastly expand resource containment.',
      effect: ['+100 All Max Limits', '+10% Global Max Capacity'],
      limit: this.upgradeService.maxResinSecretion(),
      isVisible: () => this.upgradeService.vascularTissues.level() >= 4,
    },
  ]);

  public rootUpgrades = computed<UpgradeView[]>(() => [
    {
      model: this.upgradeService.rootWidth,
      title: this.getTitle(
        this.upgradeService.rootWidth,
        `Expand Roots (Lvl ${this.upgradeService.rootWidth.level()})`,
      ),
      description: 'Spread wide to catch passing moisture.',
      effect: ['+1 Water/s'],
    },
    {
      model: this.upgradeService.rootDepth,
      title: this.getTitle(
        this.upgradeService.rootDepth,
        `Deepen Roots (Lvl ${this.upgradeService.rootDepth.level()})`,
      ),
      description: 'Burrow deeper to extract rich minerals.',
      effect: ['+1 Minerals/s'],
    },
    {
      model: this.upgradeService.rootHairs,
      title: this.getTitle(
        this.upgradeService.rootHairs,
        `Root Hairs (Lvl ${this.upgradeService.rootHairs.level()} / ${this.upgradeService.maxRootHairs()})`,
        this.upgradeService.maxRootHairs(),
      ),
      description: 'Grow microscopic hairs on root tips, drastically increasing absorption area.',
      effect: ['+2.5 Water/s'],
      limit: this.upgradeService.maxRootHairs(),
      isVisible: () =>
        this.upgradeService.rootWidth.level() >= 4 && this.upgradeService.rootDepth.level() >= 4,
    },
    {
      model: this.upgradeService.mycorrhizalNetwork,
      title: this.getTitle(
        this.upgradeService.mycorrhizalNetwork,
        `Mycorrhizal Network (Lvl ${this.upgradeService.mycorrhizalNetwork.level()} / ${this.upgradeService.maxMycorrhizalNetwork()})`,
        this.upgradeService.maxMycorrhizalNetwork(),
      ),
      description: 'Trade energy with underground fungi for a massive influx of minerals.',
      effect: this.mutationService.isCompleted('symbiotic_mycelium')
        ? ['+3.5 Minerals/s', '+2 Water/s', '+2 Energy/s']
        : ['+3.5 Minerals/s'],
      limit: this.upgradeService.maxMycorrhizalNetwork(),
      isVisible: () => this.upgradeService.rootHairs.level() >= 4,
    },
    {
      model: this.upgradeService.rootVigor,
      title: this.getTitle(
        this.upgradeService.rootVigor,
        `Root Vigor (Lvl ${this.upgradeService.rootVigor.level()} / ${this.upgradeService.maxRootVigor()})`,
        this.upgradeService.maxRootVigor(),
      ),
      description:
        'Strengthen the root system structure, boosting all water and mineral extraction by 10% per level.',
      effect: ['+10% Root Production'],
      limit: this.upgradeService.maxRootVigor(),
      isVisible: () =>
        this.upgradeService.rootWidth.level() >= 6 &&
        this.upgradeService.rootDepth.level() >= 6 &&
        this.upgradeService.mycorrhizalNetwork.level() >= 2,
    },
  ]);
}

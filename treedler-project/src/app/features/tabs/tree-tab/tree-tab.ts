import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../../core/services/resource';
import { UpgradeService } from '../../../core/services/upgrade.service';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { MutationService } from '../../../core/services/mutation.service';
import { UpgradeButtonComponent } from '../../../shared/ui/upgrade-button';
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
    const qty = this.upgradeService.getTargetQuantity(
      upgrade,
      this.shortcutService.multiplier(),
      limit,
    );
    return qty > 1 ? `${baseTitle} [+${qty}]` : baseTitle;
  }

  public crownUpgrades = computed<UpgradeView[]>(() => [
    {
      model: this.upgradeService.branch,
      title: this.getTitle(
        this.upgradeService.branch,
        `Grow Branch (Lvl ${this.upgradeService.branch.level()})`,
      ),
      description: 'Extends the tree structure, creating space for new Leaves.',
      effect: [`+${this.mutationService.isCompleted('dense_branching') ? 55 : 50} Leaf Capacity`],
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
        `-${this.upgradeService.leafWaterUpkeep()} Water/s`,
        '-0.02 Minerals/s',
        `+${(this.upgradeService.leafEnergyBase() + this.upgradeService.sunwardReach.level() * 0.02).toFixed(2)} Energy/s`,
      ],
      limit: this.upgradeService.maxLeaves(),
    },
    {
      model: this.upgradeService.sunwardReach,
      title: this.getTitle(
        this.upgradeService.sunwardReach,
        `Sunward Reach (Lvl ${this.upgradeService.sunwardReach.level()})`,
      ),
      description: 'Bend your branches towards the sun, optimizing light absorption.',
      effect: ['+20% Energy per Leaf'],
      isVisible: () => this.upgradeService.branch.level() >= 5,
    },
    {
      model: this.upgradeService.canopySpread,
      title: this.getTitle(
        this.upgradeService.canopySpread,
        `Canopy Spread (Lvl ${this.upgradeService.canopySpread.level()})`,
      ),
      description:
        'Broaden the leafy canopy to capture more rain and dew, increasing global storage.',
      effect: ['+15 All Max Limits'],
      isVisible: () => this.upgradeService.leaf.level() >= 20,
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
      effect: ['+10 All Max Limits'],
    },
    {
      model: this.upgradeService.vascularTissues,
      title: this.getTitle(
        this.upgradeService.vascularTissues,
        `Vascular Tissues (Lvl ${this.upgradeService.vascularTissues.level()})`,
      ),
      description: 'Develop internal channels to better distribute and store resources.',
      effect: ['+5 All Max Limits', '+1 Energy/s'],
      isVisible: () => this.upgradeService.barkThickness.level() >= 3,
    },
    {
      model: this.upgradeService.resinSecretion,
      title: this.getTitle(
        this.upgradeService.resinSecretion,
        `Resin Secretion (Lvl ${this.upgradeService.resinSecretion.level()})`,
      ),
      description: 'Seal the outer bark with hardened resin to vastly expand resource containment.',
      effect: ['+20 All Max Limits'],
      isVisible: () => this.upgradeService.vascularTissues.level() >= 5,
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
        `Root Hairs (Lvl ${this.upgradeService.rootHairs.level()})`,
      ),
      description: 'Grow microscopic hairs on root tips, drastically increasing absorption area.',
      effect: ['+2 Water/s'],
      isVisible: () =>
        this.upgradeService.rootWidth.level() >= 5 && this.upgradeService.rootDepth.level() >= 5,
    },
    {
      model: this.upgradeService.mycorrhizalNetwork,
      title: this.getTitle(
        this.upgradeService.mycorrhizalNetwork,
        `Mycorrhizal Network (Lvl ${this.upgradeService.mycorrhizalNetwork.level()})`,
      ),
      description: 'Trade energy with underground fungi for a massive influx of minerals.',
      effect: ['+3 Minerals/s'],
      isVisible: () => this.upgradeService.rootHairs.level() >= 5,
    },
    {
      model: this.upgradeService.rootVigor,
      title: this.getTitle(
        this.upgradeService.rootVigor,
        `Root Vigor (Lvl ${this.upgradeService.rootVigor.level()})`,
      ),
      description:
        'Strengthen the root system structure, boosting all water and mineral extraction by 10% per level.',
      effect: ['+10% Root Production'],
      isVisible: () =>
        this.upgradeService.rootWidth.level() >= 8 &&
        this.upgradeService.rootDepth.level() >= 8 &&
        this.upgradeService.mycorrhizalNetwork.level() >= 3,
    },
  ]);
}

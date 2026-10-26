import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../../core/services/resource.service';
import { UpgradeService } from '../../../core/services/upgrade.service';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { MutationService } from '../../../core/services/mutation.service';
import { SettingsService } from '../../../core/services/settings.service';
import {
  UpgradeButtonComponent,
  UpgradeBreakdownRow,
} from '../../../shared/ui/upgrade-button/upgrade-button';
import { UpgradeBase } from '../../../core/classes/upgrade-base';
import { MutationId } from '../../../core/enums/mutation.enum';

export interface UpgradeView {
  model: UpgradeBase;
  title: string;
  description: string;
  effect: string[];
  breakdown: UpgradeBreakdownRow[];
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
  public settingsService = inject(SettingsService);

  public shouldShowUpgrade(item: UpgradeView): boolean {
    if (item.isVisible && !item.isVisible()) return false;
    if (
      this.settingsService.hideMaxedUpgrades() &&
      this.upgradeService.isMaxed(item.model, item.limit)
    ) {
      return false;
    }
    return true;
  }

  public getTitle(upgrade: UpgradeBase, baseTitle: string, limit?: number): string {
    if (this.upgradeService.isMaxed(upgrade, limit)) return baseTitle;

    const mult = this.shortcutService.multiplier();
    if (mult <= 1) return baseTitle;

    const affordable = this.upgradeService.getAffordableQuantity(upgrade, mult, limit);
    return `${baseTitle} [+${affordable}/${mult}]`;
  }

  public crownUpgrades = computed<UpgradeView[]>(() => {
    const branchLvl = this.upgradeService.branch.level();
    const leafLvl = this.upgradeService.leaf.level();
    const reachLvl = this.upgradeService.sunwardReach.level();
    const spreadLvl = this.upgradeService.canopySpread.level();
    const capMult = this.upgradeService.capacityBreakdown().totalMultiplier;

    return [
      {
        model: this.upgradeService.branch,
        title: this.getTitle(this.upgradeService.branch, `Grow Branch (Lvl ${branchLvl})`),
        description: 'Extends the tree structure, creating space for new Leaves.',
        effect: [`+${this.upgradeService.leavesPerBranch()} Leaf Capacity`],
        breakdown: [
          { label: 'Base Capacity / Lvl:', value: '+10 Leaves' },
          ...(this.upgradeService.leavesPerBranch() > 10
            ? [
                {
                  label: 'Mutation Bonus / Lvl:',
                  value: `+${this.upgradeService.leavesPerBranch() - 10} Leaves`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Total Max Leaves:',
            value: `${this.upgradeService.maxLeaves()}`,
            tone: 'total',
          },
        ],
      },
      {
        model: this.upgradeService.leaf,
        title: this.getTitle(
          this.upgradeService.leaf,
          `Sprout Leaf (Lvl ${leafLvl} / ${this.upgradeService.maxLeaves()})`,
          this.upgradeService.maxLeaves(),
        ),
        description: 'Converts water and minerals into precious energy in small amounts.',
        effect: [
          `-${this.upgradeService.leafResourceUpkeep()} Water & Minerals/s`,
          `+${this.upgradeService.singleLeafEnergy().toFixed(2)} Energy/s`,
        ],
        breakdown: [
          {
            label: 'Base Energy / Leaf:',
            value: `+${this.upgradeService.leafEnergyBase().toFixed(2)}/s`,
          },
          ...(reachLvl > 0
            ? [
                {
                  label: 'Sunward Reach Bonus:',
                  value: `+${(reachLvl * 0.03).toFixed(2)}/s`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          ...(this.upgradeService.leafEnergyMultiplier() > 1
            ? [
                {
                  label: 'Evolution Multiplier:',
                  value: `x${this.upgradeService.leafEnergyMultiplier().toFixed(2)}`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Total All Leaves Energy:',
            value: `+${(leafLvl * this.upgradeService.singleLeafEnergy()).toFixed(2)}/s`,
            tone: 'total',
          },
          {
            label: 'Total Upkeep (W & M):',
            value: `-${(leafLvl * this.upgradeService.leafResourceUpkeep()).toFixed(2)}/s`,
            tone: 'negative',
          },
        ],
        limit: this.upgradeService.maxLeaves(),
        isVisible: () => this.upgradeService.branch.level() >= 1,
      },
      {
        model: this.upgradeService.sunwardReach,
        title: this.getTitle(
          this.upgradeService.sunwardReach,
          `Sunward Reach (Lvl ${reachLvl} / ${this.upgradeService.maxSunwardReach()})`,
          this.upgradeService.maxSunwardReach(),
        ),
        description: 'Bend your branches towards the sun, optimizing light absorption.',
        effect: ['+0.03 Base Energy per Leaf'],
        breakdown: [
          { label: 'Bonus per Leaf:', value: `+${(reachLvl * 0.03).toFixed(2)}/s`, tone: 'bonus' },
          {
            label: `Total across ${leafLvl} Leaves:`,
            value: `+${(reachLvl * 0.03 * leafLvl * this.upgradeService.leafEnergyMultiplier()).toFixed(2)}/s`,
            tone: 'total',
          },
        ],
        limit: this.upgradeService.maxSunwardReach(),
        isVisible: () => this.upgradeService.branch.level() >= 3,
      },
      {
        model: this.upgradeService.canopySpread,
        title: this.getTitle(
          this.upgradeService.canopySpread,
          `Canopy Spread (Lvl ${spreadLvl} / ${this.upgradeService.maxCanopySpread()})`,
          this.upgradeService.maxCanopySpread(),
        ),
        description:
          'Broaden the leafy canopy to capture more rain and dew, increasing global storage.',
        effect: ['+75 Base Max Limits'],
        breakdown: [
          { label: 'Flat Capacity:', value: `+${spreadLvl * 75}` },
          ...(capMult > 1
            ? [
                {
                  label: 'Global Multipliers:',
                  value: `x${capMult.toFixed(2)}`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Effective Storage Added:',
            value: `+${Math.floor(spreadLvl * 75 * capMult)}`,
            tone: 'total',
          },
        ],
        limit: this.upgradeService.maxCanopySpread(),
        isVisible: () => this.upgradeService.leaf.level() >= 25,
      },
    ];
  });

  public barkUpgrades = computed<UpgradeView[]>(() => {
    const barkLvl = this.upgradeService.barkThickness.level();
    const vascLvl = this.upgradeService.vascularTissues.level();
    const sapLvl = this.upgradeService.sapPressure.level();
    const resinLvl = this.upgradeService.resinSecretion.level();
    const capMult = this.upgradeService.capacityBreakdown().totalMultiplier;
    const apexMult = this.upgradeService.hasApexFloraBonus() ? 1.5 : 1.0;

    return [
      {
        model: this.upgradeService.barkThickness,
        title: this.getTitle(this.upgradeService.barkThickness, `Thicken Bark (Lvl ${barkLvl})`),
        description: 'Increases structural integrity, allowing you to store more resources.',
        effect: ['+25 Base Max Limits'],
        breakdown: [
          { label: 'Flat Capacity:', value: `+${barkLvl * 25}` },
          ...(capMult > 1
            ? [
                {
                  label: 'Global Multipliers:',
                  value: `x${capMult.toFixed(2)}`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Effective Storage Added:',
            value: `+${Math.floor(barkLvl * 25 * capMult)}`,
            tone: 'total',
          },
        ],
      },
      {
        model: this.upgradeService.vascularTissues,
        title: this.getTitle(
          this.upgradeService.vascularTissues,
          `Vascular Tissues (Lvl ${vascLvl} / ${this.upgradeService.maxVascularTissues()})`,
          this.upgradeService.maxVascularTissues(),
        ),
        description: 'Develop internal channels to better distribute and store resources.',
        effect: ['+20 Base Max Limits', '+1.5 Energy/s'],
        breakdown: [
          {
            label: 'Effective Storage Added:',
            value: `+${Math.floor(vascLvl * 20 * capMult)}`,
            tone: 'bonus',
          },
          {
            label: 'Total Energy Output:',
            value: `+${(vascLvl * 1.5 * apexMult).toFixed(2)}/s`,
            tone: 'total',
          },
        ],
        limit: this.upgradeService.maxVascularTissues(),
        isVisible: () => this.upgradeService.barkThickness.level() >= 3,
      },
      {
        model: this.upgradeService.sapPressure,
        title: this.getTitle(
          this.upgradeService.sapPressure,
          `Sap Pressure (Lvl ${sapLvl} / ${this.upgradeService.maxSapPressure()})`,
          this.upgradeService.maxSapPressure(),
        ),
        description:
          'Pressurize internal sap channels, converting 0.05% of your Total Max Capacity per level into passive resource generation.',
        effect: [
          `+${this.upgradeService.sapPressurePerLevel().toFixed(2)} All Resources/s (0.05% Cap)`,
        ],
        breakdown: [
          {
            label: 'Current Max Capacity:',
            value: `${this.upgradeService.totalMaxCapacity()}`,
          },
          {
            label: 'Conversion Rate:',
            value: `${(sapLvl * 0.05).toFixed(2)}% of Cap`,
            tone: 'bonus',
          },
          {
            label: 'Total All Resources/s:',
            value: `+${this.upgradeService.sapPressureProduction().toFixed(2)}/s`,
            tone: 'total',
          },
        ],
        limit: this.upgradeService.maxSapPressure(),
        isVisible: () => this.upgradeService.vascularTissues.level() >= 2,
      },
      {
        model: this.upgradeService.resinSecretion,
        title: this.getTitle(
          this.upgradeService.resinSecretion,
          `Resin Secretion (Lvl ${resinLvl} / ${this.upgradeService.maxResinSecretion()})`,
          this.upgradeService.maxResinSecretion(),
        ),
        description:
          'Seal the outer bark with hardened resin to vastly expand resource containment.',
        effect: ['+100 Base Max Limits', '+10% Total Max Capacity (Global)'],
        breakdown: [
          { label: 'Flat Storage Added:', value: `+${resinLvl * 100}` },
          {
            label: 'Global Storage Bonus:',
            value: `+${resinLvl * 10}% to ALL Storage`,
            tone: 'bonus',
          },
          {
            label: 'Bonus Storage from %:',
            value: `+${Math.floor(this.upgradeService.capacityBreakdown().flatTotal * (resinLvl * 0.1))}`,
            tone: 'total',
          },
        ],
        limit: this.upgradeService.maxResinSecretion(),
        isVisible: () => this.upgradeService.vascularTissues.level() >= 4,
      },
    ];
  });

  public rootUpgrades = computed<UpgradeView[]>(() => {
    const widthLvl = this.upgradeService.rootWidth.level();
    const depthLvl = this.upgradeService.rootDepth.level();
    const hairsLvl = this.upgradeService.rootHairs.level();
    const mycoLvl = this.upgradeService.mycorrhizalNetwork.level();
    const vigorLvl = this.upgradeService.rootVigor.level();
    const rootMult = this.upgradeService.rootMultiplier();
    const hasMycelium = this.mutationService.isCompleted(MutationId.SymbioticMycelium);

    return [
      {
        model: this.upgradeService.rootWidth,
        title: this.getTitle(this.upgradeService.rootWidth, `Expand Roots (Lvl ${widthLvl})`),
        description: 'Spread wide to catch passing moisture.',
        effect: [`+${(1 * rootMult).toFixed(2)} Water/s`],
        breakdown: [
          { label: 'Base Water:', value: `+${widthLvl.toFixed(1)}/s` },
          ...(rootMult > 1
            ? [
                {
                  label: 'Root Multipliers:',
                  value: `x${rootMult.toFixed(2)}`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Total Water Output:',
            value: `+${(widthLvl * rootMult).toFixed(2)}/s`,
            tone: 'total',
          },
        ],
      },
      {
        model: this.upgradeService.rootDepth,
        title: this.getTitle(this.upgradeService.rootDepth, `Deepen Roots (Lvl ${depthLvl})`),
        description: 'Burrow deeper to extract rich minerals.',
        effect: [`+${(1 * rootMult).toFixed(2)} Minerals/s`],
        breakdown: [
          { label: 'Base Minerals:', value: `+${depthLvl.toFixed(1)}/s` },
          ...(rootMult > 1
            ? [
                {
                  label: 'Root Multipliers:',
                  value: `x${rootMult.toFixed(2)}`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Total Minerals Output:',
            value: `+${(depthLvl * rootMult).toFixed(2)}/s`,
            tone: 'total',
          },
        ],
      },
      {
        model: this.upgradeService.rootHairs,
        title: this.getTitle(
          this.upgradeService.rootHairs,
          `Root Hairs (Lvl ${hairsLvl} / ${this.upgradeService.maxRootHairs()})`,
          this.upgradeService.maxRootHairs(),
        ),
        description: 'Grow microscopic hairs on root tips, drastically increasing absorption area.',
        effect: [`+${(2.5 * rootMult).toFixed(2)} Water/s`],
        breakdown: [
          { label: 'Base Water:', value: `+${(hairsLvl * 2.5).toFixed(1)}/s` },
          ...(rootMult > 1
            ? [
                {
                  label: 'Root Multipliers:',
                  value: `x${rootMult.toFixed(2)}`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Total Water Output:',
            value: `+${(hairsLvl * 2.5 * rootMult).toFixed(2)}/s`,
            tone: 'total',
          },
        ],
        limit: this.upgradeService.maxRootHairs(),
        isVisible: () =>
          this.upgradeService.rootWidth.level() >= 4 && this.upgradeService.rootDepth.level() >= 4,
      },
      {
        model: this.upgradeService.mycorrhizalNetwork,
        title: this.getTitle(
          this.upgradeService.mycorrhizalNetwork,
          `Mycorrhizal Network (Lvl ${mycoLvl} / ${this.upgradeService.maxMycorrhizalNetwork()})`,
          this.upgradeService.maxMycorrhizalNetwork(),
        ),
        description: 'Trade energy with underground fungi for a massive influx of minerals.',
        effect: hasMycelium
          ? [
              `+${(3.5 * rootMult).toFixed(2)} Minerals/s`,
              `+${(2 * rootMult).toFixed(2)} Water/s`,
              '+2.00 Energy/s',
            ]
          : [`+${(3.5 * rootMult).toFixed(2)} Minerals/s`],
        breakdown: [
          { label: 'Base Minerals:', value: `+${(mycoLvl * 3.5).toFixed(1)}/s` },
          ...(rootMult > 1
            ? [
                {
                  label: 'Root Multipliers:',
                  value: `x${rootMult.toFixed(2)}`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Total Minerals Output:',
            value: `+${(mycoLvl * 3.5 * rootMult).toFixed(2)}/s`,
            tone: 'total',
          },
          ...(hasMycelium
            ? [
                {
                  label: 'Symbiotic Water & Energy:',
                  value: `+${(mycoLvl * 2 * rootMult).toFixed(1)} W / +${mycoLvl * 2} E`,
                  tone: 'bonus' as const,
                },
              ]
            : []),
        ],
        limit: this.upgradeService.maxMycorrhizalNetwork(),
        isVisible: () => this.upgradeService.rootHairs.level() >= 4,
      },
      {
        model: this.upgradeService.rootVigor,
        title: this.getTitle(
          this.upgradeService.rootVigor,
          `Root Vigor (Lvl ${vigorLvl} / ${this.upgradeService.maxRootVigor()})`,
          this.upgradeService.maxRootVigor(),
        ),
        description:
          'Strengthen the root system structure, boosting all water and mineral extraction by 10% per level.',
        effect: ['+10% Root Production'],
        breakdown: [
          { label: 'Vigor Multiplier:', value: `+${vigorLvl * 10}%`, tone: 'bonus' },
          ...(this.upgradeService.hasDeepAnchorageBonus()
            ? [
                {
                  label: 'Deep Anchorage Milestone:',
                  value: 'x1.25',
                  tone: 'bonus' as const,
                },
              ]
            : []),
          {
            label: 'Combined Root Multiplier:',
            value: `x${rootMult.toFixed(2)}`,
            tone: 'total',
          },
        ],
        limit: this.upgradeService.maxRootVigor(),
        isVisible: () =>
          this.upgradeService.rootWidth.level() >= 6 &&
          this.upgradeService.rootDepth.level() >= 6 &&
          this.upgradeService.mycorrhizalNetwork.level() >= 2,
      },
    ];
  });
}

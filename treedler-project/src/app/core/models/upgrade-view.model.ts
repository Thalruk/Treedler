import { UpgradeBase } from '../classes/upgrade-base';
import { UpgradeBreakdownRow } from '../../shared/ui/upgrade-button/upgrade-button';

export interface UpgradeView {
  model: UpgradeBase;
  title: string;
  description: string;
  effect: string[];
  breakdown: UpgradeBreakdownRow[];
  limit?: number;
  isVisible?: () => boolean;
}

import { AmrapStrategy } from './AmrapStrategy.js';
import { RftStrategy } from './RftStrategy.js';
import { EmomStrategy } from './EmomStrategy.js';
import { ChipperStrategy } from './ChipperStrategy.js';
import { TabataStrategy } from './TabataStrategy.js';
import { LadderStrategy } from './LadderStrategy.js';
import { DeathByStrategy } from './DeathByStrategy.js';

const STRATEGIES = {
  AMRAP: AmrapStrategy,
  RFT: RftStrategy,
  EMOM: EmomStrategy,
  Chipper: ChipperStrategy,
  Tabata: TabataStrategy,
  Ladder: LadderStrategy,
  'Death By': DeathByStrategy,
};

export const getStrategy = (templateName) => {
  return STRATEGIES[templateName] || AmrapStrategy;
};

export const getRandomTemplate = () => {
  const keys = Object.keys(STRATEGIES);
  return keys[Math.floor(Math.random() * keys.length)];
};

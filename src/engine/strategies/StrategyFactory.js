import { AmrapStrategy } from './AmrapStrategy';
import { RftStrategy } from './RftStrategy';
import { EmomStrategy } from './EmomStrategy';
import { ChipperStrategy } from './ChipperStrategy';
import { TabataStrategy } from './TabataStrategy';
import { LadderStrategy } from './LadderStrategy';
import { DeathByStrategy } from './DeathByStrategy';

const STRATEGIES = {
    'AMRAP': AmrapStrategy,
    'RFT': RftStrategy,
    'EMOM': EmomStrategy,
    'Chipper': ChipperStrategy,
    'Tabata': TabataStrategy,
    'Ladder': LadderStrategy,
    'Death By': DeathByStrategy
};

export const getStrategy = (templateName) => {
    return STRATEGIES[templateName] || AmrapStrategy;
};

export const getRandomTemplate = () => {
    const keys = Object.keys(STRATEGIES);
    return keys[Math.floor(Math.random() * keys.length)];
};

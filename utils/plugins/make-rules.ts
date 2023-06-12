import * as fs from 'fs';
import * as path from 'path';
import colorLog from '../log';
import rules from '../../src/rules';
import { PluginOption } from 'vite';

const { resolve } = path;

const outDir = resolve(__dirname, '..', '..', 'public');

export default function makeRules(): PluginOption {
  return {
    name: 'make-rules',
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }

      const rulesPath = resolve(outDir, 'rules.json');

      fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2));

      colorLog(`Manifest file copy complete: ${rulesPath}`, 'success');
    },
  };
}

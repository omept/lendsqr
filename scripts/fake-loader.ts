import chalk from 'chalk';

import * as fake from '../src/utils/fake';
import { bindModel } from '../src/config/db';
import factories, { FactoryType } from '../src/database/factories';

const { info } = console;

function print<T>(data: T): void {
  const jsonData = JSON.stringify(data, null, ' ');

  info(chalk.green(jsonData));
}

(async (): Promise<void> => {
  try {
    const table = process.argv[2];
    const total = +process.argv[3] || 1;

    const factoryCallback = factories[table as FactoryType].run;

    bindModel();

    print(await fake.generate(factoryCallback, total));

    process.exit(0);
  } catch (err) {
    info(chalk`{red ${err.message}}`);

    process.exit(1);
  }
})();

import * as semver from 'semver';
import * as fs from 'graceful-fs';
import * as os from 'os';
import { TypeScriptReporterConfiguration } from './TypeScriptReporterConfiguration';
import { assertPnpSupport } from './extension/pnp/assertPnpSupport';
import { assertVueSupport } from './extension/vue/assertVueSupport';

function assertTypeScriptSupport(configuration: TypeScriptReporterConfiguration) {
  let typescriptVersion: string;

  try {
    typescriptVersion = require('typescript').version;
  } catch (error) {
    throw new Error(
      'When you use this plugin with typescript reporter enabled, you must install `typescript`.'
    );
  }

  if (semver.lt(typescriptVersion, '2.1.0')) {
    throw new Error(
      `Cannot use current typescript version of ${typescriptVersion}, the minimum required version is 2.1.0`
    );
  }

  if (!fs.existsSync(configuration.tsconfig)) {
    throw new Error(
      [
        `Cannot find "${configuration.tsconfig}" file.`,
        `Please check webpack and ForkTsCheckerWebpackPlugin configuration.`,
        `Possible errors:`,
        '  - wrong `context` directory in webpack configuration (if `tsconfig` is not set or is a relative path in fork plugin configuration)',
        '  - wrong `typescript.tsconfig` path in the plugin configuration (should be a relative or absolute path)',
      ].join(os.EOL)
    );
  }

  if (configuration.extensions.vue.enabled) {
    assertVueSupport(configuration.extensions.vue);
  }

  if (configuration.extensions.pnp.enabled) {
    assertPnpSupport();
  }
}

export { assertTypeScriptSupport };

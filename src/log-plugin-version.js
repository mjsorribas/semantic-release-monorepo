import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import readPkg from 'read-pkg';
import createDebug from 'debug';

const debug = createDebug('semantic-release:monorepo');

const logPluginVersion = (type) => (plugin) => async (pluginConfig, config) => {
  if (config.options.debug) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const { version } = await readPkg(resolve(__dirname, '../'));
    debug('Running %o version %o', type, version);
  }

  return plugin(pluginConfig, config);
};

export default logPluginVersion;

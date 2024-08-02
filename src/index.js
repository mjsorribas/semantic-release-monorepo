const { compose } = require('ramda');
const { wrapStep } = require('semantic-release-plugin-decorators');
const { withOnlyPackageCommits } = require('./only-package-commits.js');
const versionToGitTag = require('./version-to-git-tag.js');
const logPluginVersion = require('./log-plugin-version.js');
const {
  mapNextReleaseVersion,
  withOptionsTransforms,
} = require('./options-transforms.js');

async function main() {
  const { readPkg } = await import('read-pkg'); // Importación dinámica

  const readPkgData = readPkg.sync(); // Llama a sync() para obtener el objeto
  const tagFormat = `${readPkgData.name}-v\${version}`;

  const analyzeCommits = wrapStep(
    'analyzeCommits',
    compose(logPluginVersion('analyzeCommits'), withOnlyPackageCommits),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

  const generateNotes = wrapStep(
    'generateNotes',
    compose(
      logPluginVersion('generateNotes'),
      withOnlyPackageCommits,
      withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

  const success = wrapStep(
    'success',
    compose(
      logPluginVersion('success'),
      withOnlyPackageCommits,
      withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

  const fail = wrapStep(
    'fail',
    compose(
      logPluginVersion('fail'),
      withOnlyPackageCommits,
      withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

  module.exports = {
    analyzeCommits,
    generateNotes,
    success,
    fail,
    tagFormat,
    readPkg: readPkgData,
  };
}

// Ejecuta la función principal
main();

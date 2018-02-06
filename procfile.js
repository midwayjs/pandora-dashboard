module.exports = (pandora) => {
  pandora.process('worker').scale(1);
  if(pandora.dev) {
    pandora.process('worker').nodeArgs().push('-r', 'ts-node/register', '--trace-warnings');
    pandora.service('dashboard', './src/Dashboard').process('worker');
  } else {
    pandora.service('dashboard', './dist/Dashboard').process('worker');
  }
};

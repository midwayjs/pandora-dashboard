module.exports = (pandora) => {
  if(pandora.dev) {
    pandora.process('worker').argv().push('-r', 'ts-node/register');
    pandora.service('dashboard', './src/Dashboard').process('worker');
  } else {
    pandora.service('dashboard', './dist/Dashboard').process('worker');
  }
};

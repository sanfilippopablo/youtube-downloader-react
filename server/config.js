var pathutils = require('path');

module.exports = {
  development: {
    port: 3000,
    public_folder: pathutils.join(__dirname, '../.tmp')
  },
  production: {
    port: 80,
    public_folder: pathutils.join(__dirname, '../build')
  }
}

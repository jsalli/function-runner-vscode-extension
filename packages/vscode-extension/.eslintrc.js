const path = require('path');
const config = require('../../.eslintrc.js');

config.parserOptions.project.push(path.join(__dirname, 'tsconfig.eslint.json'));
config.env = { node: true };
config.ignorePatterns.push('src/test/testContent/**');

module.exports = config;

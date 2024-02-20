const path = require('path');

const buildEslintCommand = filenames => {
  return `eslint --fix ${filenames.map(f => path.relative(process.cwd(), f)).join(' ')}`;
};

module.exports = {
  'website/**/*.{js,jsx,ts,tsx}': [buildEslintCommand],
  'packages/**/*.{js,ts}': [buildEslintCommand],
};

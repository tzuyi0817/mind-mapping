const path = require('path');

const buildEslintCommand = filenames => {
  return `cd website && next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`;
};

module.exports = {
  'website/**/*.{js,jsx,ts,tsx}': [buildEslintCommand],
  'mind-mapping/**/*.{js,ts}': ['cd .. && pnpm lint'],
};

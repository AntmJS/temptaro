module.exports = {
  '**/*.{js,jsx,ts,tsx}': ['npx eslint -c eslint.config.js --fix', 'git add'],
  '**/*.ts?(x)': () => 'npx tsc -p tsconfig.json --skipLibCheck',
  '**/*.{css,less}': [
    'npx stylelint --aei --config stylelint.config.js --fix',
    'git add',
  ],
  // '*.{js,jsx,ts,tsx,md,html,css,less}': ['npx prettier --write', 'git add'],
}

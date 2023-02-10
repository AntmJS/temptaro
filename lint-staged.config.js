module.exports = {
  '**/*.{js,jsx,ts,tsx}': [
    'npx eslint -c .eslintrc.js --fix',
    'npx prettier --write',
  ],
  '**/*.ts?(x)': () => 'npx tsc -p tsconfig.json --skipLibCheck',
  '**/*.{css,less}': ['npx stylelint --aei --config stylelint.config.js --fix'],
  '**/*.{md,html,css,less}': ['npx prettier --write'],
}

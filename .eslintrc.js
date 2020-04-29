module.exports = {
  extends: 'airbnb-base',
  plugins: ['import'],
  rules: {
    'no-console': 'off',
    'import/newline-after-import': 'off',
    'no-unused-vars': 0,
    'max-len': 0,
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'no-tabs': 0,
    'no-mixed-spaces-and-tabs': 0
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest:true
  }
}

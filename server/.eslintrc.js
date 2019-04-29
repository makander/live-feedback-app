module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base', 'prettier'],
  plugins: ['promise', 'import'],
  rules: {
    'func-names': [0],
    'no-underscore-dangle': [0]
  }
};

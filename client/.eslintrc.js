module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["react", "jsx-a11y", "import"],
  env: {
    browser: true,
    es6: true
  },
  rules: {
    "react/jsx-filename-extension": [0],
    "react/forbid-prop-types": [0]
  }
};

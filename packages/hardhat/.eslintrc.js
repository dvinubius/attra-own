module.exports = {
  env: {
    mocha: true,
    es6: true,
  },
  extends: [
    // "airbnb", // creates lots of lint errors with standard eth-scaffold code (hardhat tasks)
    // "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2017,
  },
  plugins: ["babel"],
  rules: {
    // "prettier/prettier": ["error"],
    // "import/extensions": [
    //   "error",
    //   "ignorePackages",
    //   {
    //     js: "never",
    //     ts: "never",
    //   },
    // ],
    "import/prefer-default-export": "off",
    "prefer-destructuring": "off",
    "prefer-template": "off",
    "no-console": "off",
    "func-names": "off",
  },
};

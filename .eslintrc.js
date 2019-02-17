module.exports = {
  extends: "airbnb-base",
  plugins: ["jest"],
  env: {
    "jest/globals": true
  },
  rules: {
    "arrow-body-style": 0,
    "object-curly-newline": 0,
    "function-paren-newline": 0,
    "no-console": 0,
    "max-len": 0,
  }
};

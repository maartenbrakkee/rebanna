module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    // Alwasys use braces.
    "brace-style": ["error"],
    "curly": ["error"],
    // Remap this to _self . When iterating the scope of this may change.
    "consistent-this": ["error", "_self"],
    // The use of the == equality operator allows for frustrating bugs to
    // slip through almost undetected. It allows for weak typing. The use
    // of the strict equality operator === does not run type coercion and
    // therefore strictly evaluates the difference between two objects.
    "eqeqeq": ["error", "always"],
    // we use soft tabs of 2 spaces
    "indent": ["error", 2],
    // Disable no-console rule
    "no-console": "off",
    // Disallow Functions in Loops
    "no-loop-func": "error",
    // disallow trailing whitespace at the end of lines
    "no-trailing-spaces": ["error"],
    // Disallow unmodified conditions of loops
    "no-unmodified-loop-condition": ["error"],
    // disallow unreachable code after return, throw, continue, and break
    // statements
    "no-unreachable": ["error"],
    // strings should be wrapped in double qoutes
    "quotes": ["error", "double"],
    // When parsing a string to an integer, it is considered good practice
    // to specify the second ‘radix’ parameter. The default setting
    // will trigger a radix of 16 whenever the string is lead by a 0. For
    // example: alert( parseInt("08", 10) ); alerts 8 times instead of 2.
    "radix": ["error"],
    // always require ending semicolon ;
    "semi": ["error", "always"],
    // no BOM
    "unicode-bom": ["error", "never"]
  }
};

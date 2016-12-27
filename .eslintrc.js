module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module",
        "ecmaVersion": "6"
    },
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-console":"off"
    }
};

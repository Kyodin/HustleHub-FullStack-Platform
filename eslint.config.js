module.exports = [
    {
        files: [
            "*.js",
            "src/**/*.js"
        ],

        ignores: [
            "node_modules/**",
            "frontend/**",
            "logs/**",
            "ssl/**",
            "evidence/**"
        ],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",

            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly"
            }
        },

        rules: {
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_"
                }
            ],

            "no-undef": "error",
            "no-unreachable": "error",
            "no-constant-condition": "warn",
            "no-dupe-keys": "error",
            "no-duplicate-case": "error"
        }
    },

    {
        files: [
            "tests/**/*.js"
        ],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",

            globals: {
                console: "readonly",
                process: "readonly",
                module: "readonly",
                require: "readonly",

                describe: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                jest: "readonly"
            }
        },

        rules: {
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_"
                }
            ],

            "no-undef": "error"
        }
    }
];
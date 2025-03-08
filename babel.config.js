module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        "better-auth/react": "better-auth/dist/react.js",
                        "@better-auth/expo/client":
                            "@better-auth/expo/dist/client.js",
                    },
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            ],
            [
                "module:react-native-dotenv",
                {
                    moduleName: "@env",
                    path: ".env",
                    blacklist: null,
                    whitelist: null,
                    safe: false,
                    allowUndefined: true,
                },
            ],
        ],
    };
};

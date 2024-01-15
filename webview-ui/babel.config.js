module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: "commonjs",
                loose: true,
            },
        ],
    ],
    plugins: ["@babel/plugin-transform-modules-commonjs"],
};

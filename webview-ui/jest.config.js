module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    // see: https://github.com/react-dnd/react-dnd/issues/3443#issuecomment-1121131998
    transform: {
        "node_modules/(prompt-schema)/.+\\.(j|t)sx?$": "ts-jest",
        "^.+\\.js$": "babel-jest",
    },
    transformIgnorePatterns: ["node_modules/(?!prompt-schema)"],
};

module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["html", "text", "lcov"],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": "babel-jest",
    },
    moduleNameMapper: {
        // pour gérer les fichiers CSS si utilisés
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
};

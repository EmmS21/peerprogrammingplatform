const {defaults} = require('jest-config');
module.exports = {
    preset: "ts-jest/presets/js-with-ts",
    verbose: true,
    collectCoverageFrom: [ 'src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts' ],
    setupFiles: [
        '<rootDir>/node_modules/react-app-polyfill/jsdom.js'
    ],
    setupFilesAfterEnv: [],
    resolver: '<rootDir>/resolver.js',
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
    ],
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/react-scripts/config/jest/babelTransform.js',
        '^.+\\.css$': '<rootDir>/node_modules/react-scripts/config/jest/cssTransform.js',
        '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/node_modules/react-scripts/config/jest/fileTransform.js',
        "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest-amcharts",
        "\\.[jt]sx?$": "babel-jest",
        "^.+\\.css$": "jest-transform-css",
        "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
    },
    transformIgnorePatterns: [
//      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$',
        "[/\\\\]node_modules[/\\\\](?!(@amcharts)\\/).+\\.(js|jsx|ts|tsx)$",
        "/node_modules/(?!react-file-drop)",
        "node_modules/(?!variables/.*)"
    ],
    modulePaths: [],
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mocks/fileMock.js",
        "\\.(css|less)$": "<rootDir>/mocks/fileMock.js",
        "^.+\\.(css|less|scss)$": "babel-jest",
    },
    moduleFileExtensions: [
        'web.js',  'js',
        'web.ts',  'ts',
        'web.tsx', 'tsx',
        'json',    'web.jsx',
        'jsx',     'node'
    ],
    moduleDirectories: ["node_modules", "src"],
    watchPlugins: [ 'jest-watch-typeahead/filename', 'jest-watch-typeahead/testname' ],
    rootDir: '.',
}
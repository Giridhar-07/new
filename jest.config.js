module.exports = {
  // Basic Configuration
  verbose: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Coverage Configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/setupTests.{js,ts}',
    '!src/reportWebVitals.{js,ts}',
    '!src/serviceWorker.{js,ts}'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },

  // Module Resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js'
  },
  
  // Transform Configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js'
  },

  // Module File Extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // Test Match Patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],

  // Test Environment Configuration
  testEnvironmentOptions: {
    url: 'http://localhost'
  },

  // Watch Configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],

  // Runtime Configuration
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: false
    }
  },

  // Snapshot Configuration
  snapshotSerializers: [
    'jest-serializer-html'
  ],

  // Resolver Configuration
  resolver: undefined,

  // Error Handling
  errorOnDeprecated: true,

  // Test Timeout
  testTimeout: 10000,

  // Custom Reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'js-test-results.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ]
  ],

  // Custom Matchers
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ],

  // Cache Configuration
  cache: true,
  cacheDirectory: '.jest-cache',

  // Clear Mocks
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,

  // Notify Mode
  notify: true,
  notifyMode: 'failure-change',

  // Bail Configuration
  bail: 0,

  // Display Configuration
  verbose: true,
  silent: false,

  // Maximum Workers
  maxWorkers: '50%',

  // Projects Configuration
  projects: undefined,

  // Transform Ignore Patterns
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ]
};

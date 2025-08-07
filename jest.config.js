const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      lines: 5,
      statements: 5,
      branches: 5,
      functions: 5
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/types.{js,jsx,ts,tsx}',
    '!src/**/constants.{js,jsx,ts,tsx}',
    '!src/app/api/**/*',
    '!src/app/globals.css',
    '!src/styles/**/*'
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/e2e-tests/',
    '<rootDir>/tests/e2e/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
    '^@supabase/supabase-js$': '<rootDir>/src/__mocks__/supabase-js.ts',
    '^@supabase/realtime-js$': '<rootDir>/src/__mocks__/realtime-js.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(isows|@supabase/ssr|@supabase/auth-helpers-nextjs|@supabase/realtime-js|@supabase/supabase-js|node-fetch)/)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

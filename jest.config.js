module.exports = {
  // Target a Node.js execution environment since we are testing an Express/Prisma API (no DOM required)
  testEnvironment: 'node',

  // Automatically execute the global database cleanup routines before executing testing suites
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Ensure mock states are wiped cleanly between tests naturally
  clearMocks: true,

  // Ignore dist / out directories if they ever generate
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Optional: Define coverage mapping expectations
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/setup.js']
};

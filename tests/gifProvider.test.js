// Placeholder test for gifProvider. To run: npm install && npm test

const { getRandomLibraryGif } = require('../src/lib/gifProvider');

test('getRandomLibraryGif returns null without TENOR_API_KEY', async () => {
  const oldKey = process.env.TENOR_API_KEY;
  delete process.env.TENOR_API_KEY;
  const res = await getRandomLibraryGif();
  expect(res).toBeNull();
  process.env.TENOR_API_KEY = oldKey;
});

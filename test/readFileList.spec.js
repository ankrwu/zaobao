import readFileList from '../scripts/build';

test("This directory doesn't exists.", () => {
  expect(readFileList('2019', '13')).toEqual([]);
});

test('Directory exists, files are not empty.', () => {
  expect(readFileList('2026', '03').length).not.toBe(0);
});

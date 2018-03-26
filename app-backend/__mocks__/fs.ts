let fs: any = jest.genMockFromModule('fs');

export let readFileSync = fs.readFileSync;

// readFileSync Mocking
export let setMockReadFileSync = jest.fn((data) => {
  return JSON.stringify(data);
});

readFileSync.mockImplementation(() => setMockReadFileSync());

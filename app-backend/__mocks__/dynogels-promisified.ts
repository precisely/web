let dynogels: any = jest.genMockFromModule('dynogels-promisified');

export let createTables = dynogels.createTables;

export const define = jest.fn();

export const types = {
  uuid: jest.fn()
};

export const AWS = {
  config: {
    update: jest.fn().mockImplementation(jest.fn())
  }
};

// CreateTable Mocking
export let mockedCreateTable = jest.fn(callback => {
  callback(null);
});

createTables.mockImplementation(() => mockedCreateTable);

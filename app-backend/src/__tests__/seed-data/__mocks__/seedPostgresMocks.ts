const user = {
  user_id: 'dummyId',
  opaque_id: 'a72078c2-83c3-465d-9526-d80622dd01b3',
  vendor_data_type: 'precisely:genotype'
};

jest.doMock('fs', () => ({
  readFileSync: jest.fn()
    .mockImplementation(() => {
      return JSON.stringify([user]);
    })
    .mockImplementationOnce(() => {
      return JSON.stringify([{ ...user, user_id: 'invalid' }]);
    }),
}));

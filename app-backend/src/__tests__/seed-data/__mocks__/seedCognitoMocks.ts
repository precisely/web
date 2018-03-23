const dummyUser = {
  user_id: 'dummyId',
  opaque_id: 'a72078c2-83c3-465d-9526-d80622dd01b3',
  vendor_data_type: 'precisely:genotype'
};

jest.doMock('fs', () => ({
  readFileSync: jest.fn()
  .mockImplementation(() => {
    return JSON.stringify([dummyUser]);
  })
  .mockImplementationOnce(() => {
    return JSON.stringify([dummyUser, {...dummyUser, email: 'demo-email2@demo-precisely.com'}]);
  }),
}));

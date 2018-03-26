function mockUserDataMapService() {
  return {
    getOpaqueId: jest.fn(() => {
      return 'demo-id';
    }),
    __resetUserDataMapServiceMock: () => {
      UserDataMapService = mockUserDataMapService();
    }
  };
}

export let UserDataMapService = mockUserDataMapService();

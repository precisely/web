function mockGenotypeService() {
  return {
    getGenotypes: jest.fn(),
    __resetGenotypeServiceMock: () => {
      GenotypeService = mockGenotypeService();
    }
  };
}

export let GenotypeService = mockGenotypeService();

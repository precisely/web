function mockGenotype() {
  return {
    query: () => ({
      filter: () => ({
        in: () => ({
          execAsync: () => ({
            Items: [{
              get: () => ({
                opaqueId: 'demo',
                sampleId: 'demo',
              })
            }]
          })
        })
      })
    }),
    __resetGenotypeMock: () => {
      Genotype = mockGenotype();
    }
  };
}

export let Genotype = mockGenotype();

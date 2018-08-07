# VariantCall

Stores variant call entries for each user of the system.

## Lambda API

### VariantCallBatchCreate

**Payload**: Array of VariantCallAttributes. It must include `userId`, `refName`, `start`, `altBases`, `refBases`,`sampleType`, `sampleId`, `genotype`, and ideally also `genotypeLikelihood` and `filter`
```js
[
  { refName: 'chr1',  start: 10, altBases: ['A', 'T'], refBases: 'C', sampleType: '23andme',
    sampleId: 'b4ccfd7a87a', userId: '4b76ff8a12c', genotype: [0,1] },
  ...
]
```
**Returns**: Array of data and optional error JSON objects, where data is the created object or the creation parameters which failed.

```js
[
  { data: { refName: 'chr1',  start: 10, altBases: ['A', 'T'], refBases: 'C',  sampleType: '23andme',
    sampleId: 'b4ccfd7a87a', userId: '4b76ff8a12c', genotype: [0,1], createdAt: '...', updatedAt: '...', id: '...', }},
  { data: { ... }, error: 'Error:...' }
]
```

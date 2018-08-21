# VariantCall

Stores variant call entries for each user of the system.

## Lambda API

### VariantCallBatchCreate

**Payload**: Array of VariantCallAttributes. It must include `userId`, `refName`, `refVersion`, `start`, `altBases`, `refBases`,`sampleType`, `sampleId`, `genotype`, and ideally also `genotypeLikelihood` and `filter`.

Note: currently, refVersion should only be `37p13`.

```js
[
  // valid input:
  { refName: 'chr1',  refVersion: '37p13', start: 10, altBases: ['A', 'T'], refBases: 'C', 
    filter: 'PASS', imputed: false, genotypeLikelihood: [.98, .1, .1], genotype: [0, 1] 
    sampleType: '23andme', sampleId: 'b4ccfd7a87a', userId: '4b76ff8a12c',},
  // invalid input:
  { refName: 'chr2',  refVersion: 'invalid-ref-version', start: 20, altBases: ['G'], refBases: 'T', 
    filter: 'PASS',imputed: false, genotypeLikelihood: [.98, .1, .1], genotype: [0, 1] 
    sampleType: '23andme', sampleId: 'b4ccfd7a87a', userId: '4b76ff8a12c' },
]
```
**Returns**: Array of data and optional error JSON objects, where data is the created object or the creation parameters which failed.

```js
[
  // valid input response:
  { data: { variantId: 'chr1:37p13:10:23andme:b4ccfd7a87a:11', 
            refName: 'chr1',  refVersion: '37p13', start: 10, altBases: ['A', 'T'], refBases: 'C',  sampleType: '23andme',
            sampleId: 'b4ccfd7a87a', userId: '4b76ff8a12c', genotype: [0, 1], createdAt: '...', updatedAt: '...', id: '...', }},
  // invalid input response:
  { data: { refName: 'chr2',  refVersion: 'invalid-ref-version', start: 20, altBases: ['G'], refBases: 'T', sampleType: '23andme',
            sampleId: 'b4ccfd7a87a', userId: '4b76ff8a12c', genotype: [0, 1] },
    error: 'Error: invalid refVersion' } // or similar error message
]
```

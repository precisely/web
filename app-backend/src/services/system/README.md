# SystemService

Service for managing system-level resources

## Background

An imputed genotype contains ~3.5M-4M variant calls per user. It's not feasible to load all of these, so we load only the ones required by the system. Currently, these are just the variant calls which are required by reports.

Each requirement is stored in the SystemVariantRequirement table.

## Lambda Function API

### SysAddNewVariantRequirementsFromReports

Checks reports and generates new SystemVariantRequirement entries as necessary, returning the newly generated SystemVariantRequirement entries. Note: previous SystemVariantRequirement entries in `new` state will not be returned.  Use the `SysGetVariantRequirements` method to get a complete list.

**Payload**: None

**Returns**: Array of JSON objects with data key and optional error key, where data represents the created object or the attributes for which creation failed.
```js
[
  { data: { id: 'refIndex:chr1:GRCh37:100', refName: 'chr1', start: 100,  refVersion:'GRCh37', status: 'new', createdAt: '<ISO8601 date>', updatedAt: '<ISO8601 date>' } },
  { data: { id: 'refIndex:chr2:GRCh37:200', refName: 'chr2', start: 200,  status: 'new', createdAt: '<ISO8601 date>', updatedAt: '<ISO8601 date>' } },
  
  // error example:
  { data: { refName: 'invalidRefName', start: undefined  }, error: 'Error: example of error message... Invalid attribute values' },
  etc
]
```

### SysUpdateVariantRequirementStatuses

Updates the status field of SystemVariantRequirement. 

**Payload**: Array of JSON objects with data and optional error field, where data represents the updated SystemVariantRequirement object

Note, if refVersion is not provided, it is assumed to be `'GRCh37'`.

The status field is a string representing one of the values of the enum SystemVariantRequirementStatus (at time of writing, one of `new`, `pending`, `ready`, `error`).
```js
[
    // update chr1:GRCh37:100 to pending
    { refName: 'chr1', start: 100,  status: 'pending' },
    // update chr1:GRCh37:200 to ready
    { refName: 'chr2', start: 200,  status: 'ready' },
    // this should produce an error:
    { refName: 'chr2',  status: 'ready' },
]
```

**Returns**: Array of JSON objects with data and optional error field, where data represents the updated SystemVariantRequirement object

```js
[
  { data: { id: 'refIndex:chr1:GRCh37:100', start: 100, refName: 'chr1', refVersion:'GRCh37', status: 'pending', createdAt: '<ISO8601 date>', updatedAt: '<ISO8601 date>' }},
  { data: { id: 'refIndex:chr2:GRCh37:200', start: 200, refName: 'chr2', status: 'ready', createdAt: '<ISO8601 date>', updatedAt: '<ISO8601 date>' },
  { data: { refName: 'chr2',  status: 'ready' }, error: 'Error: some error message' }
]
```

### SysGetVariantRequirements

**Payload**: string representing the SystemVariantRequirementStatus (see above). Defaults to `new`.

**Returns**: Array of JSON objects representing the attributes of the SystemVariantRequirementStatus objects

```js
[
  { id: 'refIndex:chr1:GRCh37:100', start: 100, refName: 'chr1', refVersion:'GRCh37', status: 'new', createdAt: '<ISO8601 date>', updatedAt: '<ISO8601 date>' },
  { id: 'refIndex:chr2:GRCh37:200', start: 200, refName: 'chr2', status: 'new', createdAt: '<ISO8601 date>', updatedAt: '<ISO8601 date>' }
]
```

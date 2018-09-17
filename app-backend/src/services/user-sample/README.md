# UserSample

The UserSample model keeps a record of availibility of user samples and their state of processing. This is used by Reports to determine the appropriate UI to display.

## example: 23andme

When the user submits a copy of their 23andme file, a UserSample entry is created as follows:

```js
  userId: 'the-user-id',
  sampleId: 'hash-of-23andme-file',
  type: 'genetics',
  source: '23andme',
  status: 'processing'
}
```

When processing completes, the status is updated to `'ready'`, or `'error'` as appropriate.

### API

#### UserSampleCreate


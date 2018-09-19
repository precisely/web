# UserSample

The UserSample model keeps a record of availibility of user samples and their state of processing. This is used by Reports to determine the appropriate UI to display.

## example: 23andme

When the user submits a copy of their 23andme file, a UserSample entry should be created using the `UserSampleCreate` lambda with arguments like:

```js
{
  userId: 'the-user-id', 
  sampleId: 'hash-of-23andme-file',
  type: 'genetics',  // required
  source: '23andme', // required for 23andme file
  status: 'processing'
}
```

When processing completes, the status is updated to `'ready'`, or `'error'` as appropriate.

### API

#### UserSampleCreate
```js
{
   userId: 'the-user-id', // required
   sampleId: 'the-sample-id', // required
   type: 'genetics', // required - only genetics as of time of writing
   source: '23andme', // required - this can only be '23andme' as of time of writing
   status: 'processing' | 'ready' | 'error' // normally, update to ready or error state
   statusMessage: 'some arbitrary message' // optional 
}
```

#### UserSampleUpdate

Arguments:
```js
{
   userId: 'the-user-id', // required
   sampleId: 'the-sample-id', // required
   status: 'processing' | 'ready' | 'error' // normally, update to ready or error state
   statusMessage: 'some arbitrary message' // optional 
}
```


# Scripts

These are usually called by yarn.

## deploy

```shell
deploy stage {region}
```

Prepares files and calls `serverless deploy -s stage -r region`. Uses the region in `config/defaults.env` if one is not provided

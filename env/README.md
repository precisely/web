# Stage specific environments

The yarn script `sls` automatically includes one of the environments in this directory, if available. The main use is to provide a developer-specific `default.env` which binds `STAGE` to the developer name.

```shell
yarn sls # includes default.env
STAGE=prod yarn sls # includes prod.env
STAGE=beta yarn sls # includes prod.env
# etc
```

All .env files in this directory are .gitignored.

## Variables

These env vars are used by serverless.yml via `scripts/sls`

* STAGE
* REGION
* PROFILE
* NODE_ENV

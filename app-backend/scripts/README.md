# Scripts

These are usually called by yarn.

## sls

Runs serverless using environment variables defined in `../config`

### default deploy
```shell
yarn sls deploy
```
Uses the `STAGE` set in `../config/default.env`.
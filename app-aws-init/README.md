# AWS environment — one-time setup

Run this to create a CloudFormation template which performs necessary _one-time_ setup for a particular environment. In other words, when creating a new overall environment (like we have `beta` and `dev` now), use this template. Otherwise, it should not be necessary.

NB: This is only separate from `app-backend` because it needs a separate `serverless.yml` file, and Serverless does not support multiple `serverless.yml` files. FIXME.

Use:
```
REGION=us-east-1 yarn deploy
```

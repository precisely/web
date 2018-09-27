# AWS environment — one-time setup

Run this to create a CloudFormation template which performs necessary _one-time_ setup for a particular environment. In other words, when creating a new overall environment (like we have `beta` and `dev` now), use this template. Otherwise, it should not be necessary.

NB: This is only separate from `app-backend` because it needs a separate `serverless.yml` file, and Serverless does not support multiple `serverless.yml` files.

Use:
```
yarn deploy # deploy to the account in ../env/deploy.env
ENV=beta yarn deploy # deploy to the beta account
```

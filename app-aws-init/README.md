# AWS environment — one-time setup

Run this to create a CloudFormation template which performs necessary _one-time_ setup for a particular AWS account. We have beta, prod and dev accounts.

NB: This is only separate from `app-backend` because it needs a separate `serverless.yml` file, and Serverless does not support multiple `serverless.yml` files.

Use:
```
ENV=prod yarn deploy # prod.env sets ACCOUNT=prod
```

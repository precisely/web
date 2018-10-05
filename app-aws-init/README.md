# AWS environment — one-time setup

## CloudFormation

Run this to create a CloudFormation template which performs necessary _one-time_ setup for a particular AWS account. We have beta, prod and dev accounts.

NB: This is only separate from `app-backend` because it needs a separate `serverless.yml` file, and Serverless does not support multiple `serverless.yml` files.

Use:
```
ENV=prod yarn deploy # prod.env sets ACCOUNT=prod
```


## API keys

Add API keys for third-party services to the environment. To do this, make sure you have AWS credentials for the account you are setting up properly configured and use the following command:

```
aws ssm put-parameter --name API_TOKEN_NAME --type String --value api_token_value
```

The current list of API tokens is:
- `API_TOKEN_SENDGRID`

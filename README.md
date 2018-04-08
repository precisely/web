### Precisely-web (v0.0.6)
[![CircleCI](https://circleci.com/gh/precisely/web/tree/dev.svg?style=shield&circle-token=e8a280413512b633fffbf56266e4687bab29b60d)](https://circleci.com/gh/precisely/web/tree/dev) [![Test Coverage](https://api.codeclimate.com/v1/badges/e00c72ba626c116fd8cf/test_coverage)](https://codeclimate.com/repos/5a8b3859ebe4ae027e0022e2/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/e00c72ba626c116fd8cf/maintainability)](https://codeclimate.com/repos/5a8b3859ebe4ae027e0022e2/maintainability)

---

## Quick Setup

### Dependencies

* Ensure nvm is installed:
https://github.com/creationix/nvm#installation

### Clone this repo
```shell
git clone git@github.com:precisely/web
cd web
```

### Use correct node version
```shell
nvm use
```

You may need to `nvm install {recommended-version}`
- If you are a [zsh](http://ohmyz.sh) user then you can configure your shell to call `nvm use` automatically in a directory with a .nvmrc file. [Read here.](https://github.com/creationix/nvm#zsh)


### Install packages
```shell
yarn install
```

### Configure AWS profiles
Setup AWS credentials for environments, and name them as follows:
* `dev-precisely`
* `stage-precisely`
* `prod-precisely` - if you are a prod admin

You'll need your developer access key and secret. Ask Aneil.

```shell
sls config credentials --provider aws -n dev-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>
```

### Stack

* AWS: Lambda, Cognito, DynamoDB, KMS, ECS, APIGateway
* Typescript, Apollo, GraphQL
* Serverless

### AWS Accounts

We maintain 3 AWS accounts: dev, staging and prod.

### Serverless Stages

#### offline
Entirely offline.  (Not yet implemented).

#### {developerName}
Developer-specific stages residing on the AWS dev account: https://dev-precisely.signin.aws.amazon.com/console.

AWS resources will be provisioned using the developer's name as a prefix. This provides a way for each developer to work with AWS services independently.

#### test
Like a developer specific account, but local DynamoDB is used, if possible.


#### staging
Automatically deployed to our AWS staging account.

#### prod

### Backend Server

`yarn server`

- Api endpoint ([http://localhost:4000/api](http://localhost:4000/api))
- Local Dynamodb ([http://localhost:8000/shell](http://localhost:8000/shell))
- Start GraphiQL ([http://localhost:4000/graphiql](http://localhost:4000/graphiql))
- Start GraphQL Playground ([http://localhost:4000/playground](http://localhost:4000/playground))

### Frontend Client

`yarn client`

- React App ([http://localhost:3000](http://localhost:3000))

### Both (Backend & Frontend)

`yarn all`

This will run both concurrently but is not recommended when you want to view backend logs in console.

## Developer Notes

* Branching structure to be followed:
    * https://graysonkoonce.com/stacked-pull-requests-keeping-github-diffs-small/

* All the secrets are managed using AWS KMS. To know more about how to encrypt new secrets or update/use them, read [wiki](https://github.com/precisely/web/wiki/AWS-Key-Management#usage).

* Currently available environment variables are listed [here](https://github.com/precisely/web/wiki/AWS-Key-Management#list-of-the-environment-variables-stored-currently-for-reference). Please do not forget to update the list if (and when) you add new variables.

### Seeding Data

* To create seed data and cognito users,
    * For `dev` environment:
        * `yarn seed:create:dev [LIMIT]`: will create users in cognito pool of dev account and other DB data at `"app-backend\src\seed-data\data\"` in JSON format.
    * For `stage` environment:
        * `yarn seed:create:stage [LIMIT]`: will create users in cognito pool of stage account and other DB data at `"app-backend\src\seed-data\data\"` in JSON format.
    * LIMIT is optional here with default value of 10. E.g: `yarn seed:create:stage 100`

* To seed data in Database:
    * For `local` databases (helpful during active development):
        * `yarn seed:local`: will put the created seed data from JSON files to appropriate tables.
        * NOTE: Make sure to run postgres and dynamoDB locally before seeding data.
    * For `dev` databases:
        * `yarn seed:dev`: will put the created seed data from JSON files to appropriate tables.'
        * Will pick up credentials from `dev-profile-precisely` set [here](#setup-for-deployment).
    * For `stage` databases:
        * `yarn seed:stage`: will put the created seed data from JSON files to appropriate tables.
        * Will pick up credentials from `stage-profile-precisely` set [here](#setup-for-deployment).

## Managing Roles

* Admin can assign individual users to specific groups under IAM, AWS Console.

* Currently two groups are created with fine-tuned permission grants, namely:
    * `StageDeployAccess` Group and `ReadOnlyLogsAccess` Group in staging environment.
    * `ProdDeployAccess` Group and `ReadOnlyLogsAccess` Group in production environment.

* The `deployAccess` groups contain the minimal permissions required to successfully deploy functions and `ReadOnlyLogsAccess` group users have only read access to CloudWatch logs, for debugging and support.

* More info provided [here](https://github.com/precisely/web/wiki/Managing-Roles-for-AWS-Users).

## Usage

### Usage of Local DynamoDB
To use the local dynamodb, open `:8000/shell` of your localhost. `http://localhost:8000/shell`.

<img width="800" height="500" alt="dynamodb" src="https://www.packtpub.com/graphics/9781784393755/graphics/3755OT_01_28.jpg">

### Usage of GraphQL Playground
To use the GraphQL Playground, open `/playground` of your Serverless service. With serverless offline it is `http://localhost:4000/playground`.

<img width="800" height="500" alt="playground" src="https://user-images.githubusercontent.com/1587005/32695336-96dbbe16-c70d-11e7-96b9-c7ef4e9ba32c.gif">

### Usage of GraphiQL
 To use the GraphiQL, open `/graphiql` of your Serverless service. With serverless offline it is `http://localhost:4000/graphiql`.

<img width="800" height="500" alt="graphiql" src="https://user-images.githubusercontent.com/1587005/32695300-943e355e-c70c-11e7-9fac-2c9324a242c4.gif">


## Setup for Deployment

Configure your AWS keys. Here you can find a [2min walkthrough](https://www.youtube.com/watch?v=mRkUnA3mEt4) how to do retrieve the keys.

- For `Development`

    Make sure you have your development access key and secret token saved under `dev-profile-precisely` profile.

    ```
    sls config credentials --provider aws -n dev-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>
    ```

    You need to make sure you have access to your deployed lambda functions.

    - Both (Backend and Frontend)
        ```
        yarn deploy:dev
        ```

    - Backend Server only
        ```
        cd app-backend/
        yarn deploy:dev
        ```

    - Frontend Client only
        ```
        cd app-client/
        yarn deploy:dev
        ```
        - Your deployment url will be : http://dev-precisely-01.s3-website-us-east-1.amazonaws.com/

- For `Staging`: (**Auto Deployed on commits in `dev` branch**)

    Make sure you have your staging access key and secret token saved under `stage-profile-precisely` profile.

    ```
    sls config credentials --provider aws -n stage-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>
    ```

    You need to make sure you have access to your deployed lambda functions.

    - Both (Backend and Frontend)
        ```
        yarn deploy:stage
        ```

    - Backend Server only
        ```
        cd app-backend/
        yarn deploy:stage
        ```

    - Frontend Client only
        ```
        cd app-client/
        yarn deploy:stage
        ```
        - Your deployment url will be : http://stage-precisely-01.s3-website-us-east-1.amazonaws.com/

- For `Production`:

    Make sure you have your production access key and secret token saved under `prod-profile-precisely` profile.

    ```
    sls config credentials --provider aws -n prod-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>
    ```

    You need to make sure you have access to your deployed lambda functions.

   - Both (Backend and Frontend)
        ```
        yarn deploy:prod
        ```

    - Backend Server only
        ```
        cd app-backend/
        yarn deploy:prod
        ```

    - Frontend Client only
        ```
        cd app-client/
        yarn deploy:prod
        ```
        - Your deployment url will be : http://prod-precisely-01.s3-website.us-east-2.amazonaws.com/
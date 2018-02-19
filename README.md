### Precisely-web (v0.0.3) 
[![CircleCI](https://circleci.com/gh/precisely/web/tree/dev.svg?style=shield&circle-token=e8a280413512b633fffbf56266e4687bab29b60d)](https://circleci.com/gh/precisely/web/tree/dev)

---

## Quick Setup

You need to have Node 6 or higher and `nvm` [installed](https://github.com/creationix/nvm#installation) on your system.

- Install Dependencies.

   `npm i -g serverless`

   `yarn install`

- Install required packages and Node v6.10.3 (If you haven't fixed [npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions), you may have to use `sudo`)

   `yarn setup`

## Managing Node Version

- As AWS Lambda only supports v6.10.3 and v4.3.2 of Node.js, we are using `nvm` to manage versions.
- Make sure to run `nvm use` in this directory if you have changed your nodeJS version for any reason.
- If you are a [zsh](http://ohmyz.sh) user then you can configure your shell to call `nvm use` automatically in a directory with a .nvmrc file. [Read here.](https://github.com/creationix/nvm#zsh)


## Quick Start

Make sure you have your developer access key and secret token saved under `dev-profile-precisely` profile.

    sls config credentials --provider aws -n dev-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>

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

* All the secrets are managed using AWS KMS. To know more about how to encrypt new secrets or update/use them, read [wiki](https://github.com/precisely/web/wiki/AWS-Key-Management#usage).

* Currently available environment variables are listed [here](https://github.com/precisely/web/wiki/AWS-Key-Management#list-of-the-environment-variables-stored-currently-for-reference). Please do not forget to update the list if (and when) you add new variables.

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

- For `Staging`:

    Make sure you have your staging access key and secret token saved under `stage-profile-precisely` profile.

    ```
    sls config credentials --provider aws -n stage-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>
    ```

    You need to make sure you have access to your deployed lambda functions.

    - Backend Server
        ```
        cd app-backend/
        yarn deploy-stage
        ```

    - Frontend Client
        - First you will need to choose custom s3 bucket name for client. For ex: s3-firstname-serverless-graphql. Please note that bucket name must be unique across all aws buckets.

        - Now, in `app-client/serverless.yml` edit the `custom.client.bucketName` property and replace it the bucket name above.

        - Now, in `app-client/package.json` edit the `homepage` property with `https://${yourBucketName}.s3-website-${regionName}.amazonaws.com`. For ex: https://s3-bucketname-serverless-graphql.s3-website-us-east-1.amazonaws.com

        - Run the deployment command
            ```
            cd app-client/
            yarn deploy-prod
            # Your deployment url will be printed on the console
            ```
        - Your deployment url will be : http://[bucket-name].s3-website-[region-name].amazonaws.com/

- For `Production`:

    Make sure you have your production access key and secret token saved under `prod-profile-precisely` profile.

    ```
    sls config credentials --provider aws -n prod-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>
    ```

    You need to make sure you have access to your deployed lambda functions.

    - Backend Server
        ```
        cd app-backend/
        yarn deploy-prod
        ```

    - Frontend Client
        - First you will need to choose custom s3 bucket name for client. For ex: s3-firstname-serverless-graphql. Please note that bucket name must be unique across all aws buckets.

        - Now, in `app-client/serverless.yml` edit the `custom.client.bucketName` property and replace it the bucket name above.

        - Now, in `app-client/package.json` edit the `homepage` property with `https://${yourBucketName}.s3-website-${regionName}.amazonaws.com`. For ex: https://s3-bucketname-serverless-graphql.s3-website-us-east-1.amazonaws.com

        - Run the deployment command
            ```
            cd app-client/
            yarn deploy-prod
            # Your deployment url will be printed on the console
            ```
        - Your deployment url will be : http://[bucket-name].s3-website-[region-name].amazonaws.com/
### Precisely-web (v0.0.1)

---

## Quick Setup

You need to have Node 6 or higher installed.

`npm install -g serverless`

Install Dependencies.

`npm install`


## Quick Start

### Backend Server

`npm run server`

- Api endpoint ([http://localhost:4000/api](http://localhost:4000/api))
- Local Dynamodb ([http://localhost:8000/shell](http://localhost:8000/shell))
- Start GraphiQL ([http://localhost:4000/graphiql](http://localhost:4000/graphiql))
- Start GraphQL Playground ([http://localhost:4000/playground](http://localhost:4000/playground))

### Frontend Client

`npm run client`

- React App ([http://localhost:3000](http://localhost:3000))

### Both (Backend & Frontend)

`npm run all`

This will run both concurrently but is not recommended when you want to view backend logs in console.


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


## Setup for Production

Configure your AWS keys. Here you can find a [2min walkthrough](https://www.youtube.com/watch?v=mRkUnA3mEt4) how to do retrieve the keys.

```
sls config credentials --provider aws --key <your_aws_access_key> --secret <your_aws_secret_key>
```

You need to make sure you have access to your deployed lambda functions.

- Backend Server
    ```
    cd app-backend/
    npm deploy-prod
    ```

- Frontend Client
    - First you will need to choose custom s3 bucket name for client. For ex: s3-firstname-serverless-graphql. Please note that bucket name must be unique across all aws buckets.

    - Now, in `app-client/serverless.yml` edit the `custom.client.bucketName` property and replace it the bucket name above.

    - Now, in `app-client/package.json` edit the `homepage` property with `https://${yourBucketName}.s3-website-${regionName}.amazonaws.com`. For ex: https://s3-bucketname-serverless-graphql.s3-website-us-east-1.amazonaws.com

    - Run the deployment command
        ```
        cd app-client/
        npm deploy-prod
        # Your deployment url will be printed on the console
        ```
    - Your deployment url will be : http://[bucket-name].s3-website-[region-name].amazonaws.com/
# Precisely-web (v0.0.6)
[![CircleCI](https://circleci.com/gh/precisely/web/tree/dev.svg?style=shield&circle-token=e8a280413512b633fffbf56266e4687bab29b60d)](https://circleci.com/gh/precisely/web/tree/dev)

---
## Overview
This repo contains the code for Precise.ly's GraphQL API and React client.

### Stack

* AWS: Lambda, DynamoDB, ECS, APIGateway, CloudFormation, Route53
* Auth0
* Typescript, Apollo, GraphQL
* Serverless

### Structure
```text
/                   root folder
   app-backend/     GraphQL API node module & serverless app
   app-client/      React node module & serverless app
   app-aws-init/    One-time AWS serverless setup
   serverless/      Common configuration
   config/          Environment variables (not committed)
```

## Quick Start

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

### Run Locally

We use [serverless-offline](https://github.com/dherault/serverless-offline) and[dynamodb-local](https://github.com/99xt/serverless-dynamodb-local) to run a subset of the functionality in a local developer environment.

#### Running backend tests locally

```shell
yarn dynamodb:test-offline # offline mode starts a dynamo instance at port 8100
# in a new terminal window:
yarn test # uses the test-offline.env environment by default

# watch changes:
yarn test:watch

# generate coverage:
yarn test:coverage

# flags (use with any test:* script)
yarn test -t 'authorization' # only tests with description matching regex /authorization/
yarn test -f handler # only load test files matching /handler/ 
yarn test -f 'handler|resolver' # only load tests in files matching regex /handler|resolver/ 

# run tests in a specific environment:
ENV=aneil yarn test # uses config/aneil.env environment

# run tests with more logging (test-offline default level is `warn`)
LOG_LEVEL=silly yarn test
```

#### Start Backend Server

If you want to run the backend locally:

```shell
cd app-backend
yarn start
```

Note: this command automatically starts (and stops) DynamoDB local.

- By default, GraphQL API endpoint is at ([http://localhost:3001/graphql](http://localhost:3001/graphql))
  - GET (GraphQL Playground GUI) and POST (GraphQL API)
- Local Dynamodb ([http://localhost:8000/shell](http://localhost:8000/shell))


#### Frontend Client

```shell
cd app-client
yarn start # points at offline.env backend
ENV=deploy yarn start # points at the deployed backend (on AWS)
ENV=prod yarn start # points at prod backend
```
This starts a static web server at ([http://localhost:3000](http://localhost:3000)). The port can be customize by setting  `FRONTEND_PORT` environment variable.  The domain can be customized by setting `FRONTEND_HOST` (not recommended).

#### Offline Auth

Bypass Auth0 authentication by starting both the client and server in offline-auth mode.

```shell
yarn start:offline-auth # in app-client
yarn start:offline-auth # in app-backend
```

You can set various env variables to control authentication information:

```shell
USER_ID (default "auth0-offlineid")
USER_EMAIL (default "aneil@precise.ly")
USER_ROLES (default "user,author,admin")
```

### Deploying to AWS Developer Account

The infrastructure allows for deployment of multiple isolated developer environments, each with its own resources (tables, domain names, gateways, S3 buckets, etc) so developers can work on and test independent branches on the AWS cloud. This is achieved by setting the `STAGE` environment variable, which  `serverless` uses to generate distinctly named [CloudFormation stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html).

Developer stages are deployed to the dev account (see below for details on our AWS accounts) and can be accessed using `{stage}.codeprecisely.net`, where `{stage}` is typically the developer's name. To create your subdomain, you need to take a few steps:

#### Configure AWS profiles
Setup AWS credentials for environments, and name them as follows:
* `dev-precisely`
* `beta-precisely`
* `prod-precisely` - if you are a prod admin

You'll need your developer access key and secret. Ask Aneil.

```shell
sls config credentials --provider aws -n dev-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>
```
#### Configure the AWS Account
There are a small number of one-time actions that need to be taken when configuring an AWS account for deployment:

1. Create a Public Hosted Zone using AWS Route53
  Point the DNS registrar at the name servers provided by the hosted zone.
  Copy the hostedZoneId and add an entry for the rootHostedZoneId in `serverless/common.js`

2. Create a wildcard certificate using [AWS Certificate Manager](https://console.aws.amazon.com/acm/home?region=us-east-1#/firstrun/ )
  
  a. Click "Provision Certificates"
  b. Create a wildcard certificate by entering `*.precisionhealth.site` if the domain is `precisionhealth.site`
  c. The domain will be in "Pending validation" state.
     Expand the domain and click the "Create Record in Route53" to add the CNAME validation entry to the DNS

3. Create a deployment bucket
  It should be named "{accountName}-precisely-deployment-bucket"

4. Setup Auth0
  We set up one Auth0 tenant per AWS account. You'll need to create one application representing the React client and one API, representing the GraphQL API. See one of the other tenants for details.

  Copy the React app client id and create an entry in `serverless/common.js`.

#### Set up your stage

##### Backend

1. Set `STAGE`, and other variables in `config/deploy.env`, as per the instructions in that folder (see [`README.md`](config/README.md) and [`config/deploy.env.sample`](config/deploy.env.sample))

2. Run first time deployment script
  ```shell
  cd app-backend
  yarn sls deploy:new # only needed when you first create a stage
  ```

You should be able to access the API at `https://{stage}.codeprecisely.net/graphql`

For subsequent deployments use:

```shell
yarn deploy
```

To delete a deployment, use:

```shell
yarn deploy:delete # remove all resources, including 
```

If you do this, you must `yarn:deploy:new` to use the stage again.

##### DynamoDB Local

Default endpoint: `http://localhost:8000`
Test endpoint: `http://localhost:8100`

The `DYNAMODB_LOCAL_PORT` environment variable determines where DynamoDB local will be started, and where it is expected. This value defaults to 8000, which means that DynamoDB Local will start at `http://localhost:8000`, however tests use `http://localhost:8100` (configured in `env/test-offline.env`). This way, `yarn start` and `yarn test` can independently of each other.

##### Running backend tests

```shell
# in one terminal window 
yarn dynamodb:test-offline
# in your main terminal window
yarn test # runs all tests
yarn test --coverage # make coverage report
yarn test -t 'pattern matching specific test'
```

Note: to use the integrated test and debugging tools in VSCode, open the workspace file instead of the web directory.

### Seeding Data

```shell
# add all reports, optionally assigning owner
yarn seed:reports [--ownerId {ownerId}]

# add variants for given user matching a particular profile 
# (e.g., all heterozygotic mutants, all wildtype, etc)
yarn seed:genetics --user {userId} --genetics {wt|hom|het|less-common-het|compound-het} # adds a 

# add a specific variant
yarn seed:variant {userId} {gene.variant:zygosity}
# e.g.,
yarn seed:variant --user 'auth0|d6ba63b91f' --variant mthfr.c677t:het # add heterozygotic variant call for c677t

# add the system-wide variant requirements:
yarn sls invoke local -f SysAddNewVariantRequirementsFromReports
```

### Reseting DynamoDB

```shell
yarn seed:clear # removes all seed data from all tables
yarn seed:clear --models Report,VariantCall # removes seed data from Report and VariantCall tables
yarn dynamodb:reset  # deletes then re-creates all tables, delete ALL data (seed and non-seed)
```

##### DynamoDB Admin local
Provides an easy to use GUI.
See https://github.com/aaronshaf/dynamodb-admin
```
npm install -g dynamodb-admin
```

#### Frontend

Just one step:

```shell
cd app-client
yarn deploy
```

## Background

### Configuration Values

How serverless environment variables are determined:

* Serverless scripts in package.json set `ENV` (or use provided `ENV` value)
* `withenv` loads `{ENV}.env` from top level `config` dir; 
  - `config/offline.env` is used by default by most yarn scripts
  - `config/deploy.env` is used by default by `yarn deploy` scripts
* Serverless loads `serverless/config.js`, which sets common variables used by both frontend and backend: domain name, Auth0 ids, GraphQL API endpoint, etc.
* The serverless.yml file generates environment variables available to transpilation, execution and scripting environments. In practical terms, the `environment:` section variables are available to webpack, lambda handlers and EC2/ECS, and to `serverless-plugin-scripts` scripts.

#### Key Environment Variables

`ENV` - determines which environment file is selected by `config/withenv`. Any package.json script which invokes serverless calls `withenv` first.

`IS_OFFLINE` - used by `common.js` to generate settings for running the backend locally. This value is set automatically if `yarn sls offline` is invoked in `app-backend`. To point the client at your local backend, build it with this flag set.

`REGION` - used by Serverless to set the AWS region

`STAGE` - used by Serverless to namespace CloudFormation resources

`LOG_LEVEL` - one of [silly, debug, verbose, info, warn, error](https://github.com/winstonjs/winston#logging )

`DYNAMODB_LOCAL_PORT` - port where dynamodb local is expected / will be started

`DYNAMODB_MODE` - either `memory` or `disk`

### AWS Accounts

We maintain 3 AWS accounts: dev, stage and prod.

When an account is first created, it must undergo a one-time CloudFormation setup using instructions in `app-aws-init/README.md`.

#### dev
https://dev-precisely.signin.aws.amazon.com/console
Used for development. Serverless creates separate resources for each developer, deployed as a separate serverless stage. This is configured by setting `STAGE` in config/deploy.env to your name. 

#### beta
https://beta-precisely.signin.aws.amazon.com/console
This is the staging account, it is intended to be as close as possible to the prod account. After code from the dev branch passes tests, CircleCI automatically deploys the beta stage to the beta account. The serverless.yml file uses the developer's local `beta-precisely-profile` AWS profile to deploy, so this account should be configured with the beta credentials.

#### prod
https://prod-precisely.signin.aws.amazon.com/console
The production account. Admin access to this account is restricted to a few people. Like beta, the prod account is selected via the developer's local `prod-precisely-profile` AWS profile.


## Developer Notes

* Branching structure to be followed:
    * https://graysonkoonce.com/stacked-pull-requests-keeping-github-diffs-small/

If you add a secret, update the `environmentSecrets:` section of serverless.yml to provide access to the values in code.

## Managing Roles

* Admin can assign individual users to specific groups under IAM, AWS Console.

* Currently two groups are created with fine-tuned permission grants, namely:
    * `StageDeployAccess` Group and `ReadOnlyLogsAccess` Group in staging environment.
    * `ProdDeployAccess` Group and `ReadOnlyLogsAccess` Group in production environment.

* The `deployAccess` groups contain the minimal permissions required to successfully deploy functions and `ReadOnlyLogsAccess` group users have only read access to CloudWatch logs, for debugging and support.

* More info provided [here](https://github.com/precisely/web/wiki/Managing-Roles-for-AWS-Users).

## Auth0
We maintain 3 tenants, matching the three different AWS environments:

* dev-precisely.auth0.com
* beta-precisely.auth0.com
* prod-precisely.auth0.com

Currently, all dev stages share the same dev tenant and users.

## Usage
https://www.packtpub.com/graphics/9781784393755/graphics/3755OT_01_28.jpg">

### GraphQL GUI

1. Login on the site (this gets an auth token from Auth0 and saves it in your local storage)
2. Navigate to `/api/gui`

<img width="800" height="500" alt="playground" src="https://user-images.githubusercontent.com/1587005/32695336-96dbbe16-c70d-11e7-96b9-c7ef4e9ba32c.gif">


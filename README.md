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
* `beta-precisely`
* `prod-precisely` - if you are a prod admin

You'll need your developer access key and secret. Ask Aneil.

```shell
sls config credentials --provider aws -n dev-profile-precisely --key <your_aws_access_key> --secret <your_aws_secret_key>
```

### Stack

* AWS: Lambda, DynamoDB, ECS, APIGateway, CloudFormation, Route53
* Auth0
* Typescript, Apollo, GraphQL
* Serverless

### AWS Accounts

We maintain 3 AWS accounts: dev, stage and prod.

#### dev
https://dev-precisely.signin.aws.amazon.com/console
Used for development. Serverless creates separate resources for each developer, deployed as a separate serverless stage. This is configured by setting `STAGE` in config/default.env to your name. When you invoke `yarn sls {cmd}`, the environment is setup using config/default.env.

#### beta
https://beta-precisely.signin.aws.amazon.com/console
This is the staging account, it is intended to be as close as possible to the prod account. After code from the dev branch passes tests, CircleCI automatically deploys the beta stage to the beta account. The serverless.yml file uses the developer's local `beta-precisely-profile` AWS profile to deploy, so this account should be configured with the beta credentials.

#### prod
https://prod-precisely.signin.aws.amazon.com/console
The production account. Admin access to this account is restricted to a few people. Like beta, the prod account is selected via the developer's local `prod-precisely-profile` AWS profile.

## Developer subdomains

Developer stages deployed to the dev account can be accessed using `{stage}.codeprecisely.net`.  To create your subdomain, you need to take a few steps:

1. Set STAGE=your name in `config/default.env`, as per the instructions in that folder

2. Create the domain:
    ```shell
    yarn sls create_domain
    ```

3. Temporarily comment out the serverless-domain-manager plugin in `app-backend/serverless.yml`:

    ```yaml
    plugins:
      # - serverless-domain-manager
      - ...
    ```

    This is necessary because of [an incompatibility](https://github.com/leftclickben/serverless-api-stage/issues/12 ) beween serverless-domain-manager and the APIGateway logging plugin, serverless-api-stage during initial deployment.

4. Do you first deployment:
    ```shell
    yarn sls deploy
    ```

5. Uncomment the line from (3)

You have a domain
## Offline mode

```shell
cd app-backend
yarn sls dynamodb install # one time setup
yarn offline # start the backend server
```
Run the service using serverless-offline and a local dynamodb.

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

* All the secrets are managed using [serverless-secrets](https://github.com/trek10inc/serverless-secrets ) which uses [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html ) under the hood.

Environment variables are set and retrieved using:
```shell
yarn sls secrets list-remote # list
yarn sls secrets get -n {secret-name}
yarn sls secrets set -n {secret-name} -t {secret-value}
```

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

## Deployment


Configure your AWS keys. Here you can find a [2min walkthrough](https://www.youtube.com/watch?v=mRkUnA3mEt4) how to do retrieve the keys.

1. Create default.env file

    * Copy `config/default.env.sample` to `config.default.env`
    * Modify `config/default.env`, e.g., if your name is "Narasimha":
    ```shell
    # default.env
    STAGE=narasimha
    ```

2. Configure AWS profile(s):
    Get keys from Aneil

    ```shell
    # dev profile
    sls config credentials --provider aws -n dev-profile-precisely --key <dev_aws_access_key> --secret <dev_aws_secret_key>

    # beta profile
    sls config credentials --provider aws -n beta-profile-precisely --key <beta_aws_access_key> --secret <beta_aws_secret_key>

    # prod profile
    sls config credentials --provider aws -n prod-profile-precisely --key <prod_aws_access_key> --secret <prod_aws_secret_key>
    ```

3. Deploy!

    ```shell
    yarn sls deploy # both back and front end to dev account & STAGE={your-name}
    cd app-backend && yarn sls deploy # backend only
    cd app-frontend && yarn sls deploy # front end only

    STAGE=beta yarn sls deploy # both to beta acct using your beta-profile-precisely creds
    STAGE=prod yarn sls deploy # both to prod acct using your prod-profile-precisely creds
    ```

    ### Notes
    `beta` is normally deployed automatically by CircleCI, so you should only deploy to beta in special circumstances.

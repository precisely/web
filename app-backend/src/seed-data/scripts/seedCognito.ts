import * as fs from 'fs';
import * as path from 'path';
import * as AWS from 'aws-sdk';

type AdminCreateUserResponse = AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserResponse;
type AdminInitiateAuthResponse = AWS.CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse;
type AdminRespondAuthChallengeResponse = AWS.CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse;

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1',
  credentials: new AWS.SharedIniFileCredentials({ profile: 'dev-profile-precisely' })
});

const jsonPath = path.join(__dirname, '..', 'data/');
const allCognitoData = JSON.parse(fs.readFileSync(jsonPath + 'CognitoData.json', 'utf8'));
const userId: string[] = [];

export const seedCognito = async () => {
  allCognitoData.forEach((user: any) => {
    cognito.adminCreateUser({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID,
      Username: user.email,
      TemporaryPassword: user.password,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        {
          Name: 'custom:roles',
          Value: user.roles
        }
      ]
    }, (createError: Error, createdData: AdminCreateUserResponse) => {
      if (createError) {
        console.log(createError, createError.stack);
      } else {
        console.log(createdData);
        userId.push(createdData.User.Username);
        cognito.adminInitiateAuth({
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          ClientId: process.env.REACT_APP_CLIENT_APP_ID,
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          AuthParameters: {
            USERNAME: createdData.User.Username,
            PASSWORD: user.password
          }
        }, (authError: Error, authData: AdminInitiateAuthResponse) => {
          if (authError) {
            console.log(authError, authError.stack);
          } else {
            console.log(authData);
            cognito.adminRespondToAuthChallenge({
              ChallengeName: 'NEW_PASSWORD_REQUIRED',
              ClientId: process.env.REACT_APP_CLIENT_APP_ID,
              UserPoolId: process.env.REACT_APP_USER_POOL_ID,
              Session: authData.Session,
              ChallengeResponses: {
                NEW_PASSWORD: user.password,
                USERNAME: createdData.User.Username
              }
            }, (responseError: Error, responseData: AdminRespondAuthChallengeResponse) => {
              if (responseError) {
                console.log(responseError, responseError.stack);
              } else {
                console.log(responseData);
              }
            });
          }
        });
      }
    });
  });
};

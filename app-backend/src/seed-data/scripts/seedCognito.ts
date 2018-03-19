import * as fs from 'fs';
import * as path from 'path';
import * as AWS from 'aws-sdk';

type AdminCreateUserResponse = AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserResponse;
type AdminInitiateAuthResponse = AWS.CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse;

export const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.REACT_APP_AWS_AUTH_REGION,
  credentials: new AWS.SharedIniFileCredentials({ profile: process.env.NODE_ENV + '-profile-precisely' })
});

export const seedCognito = (): Promise<string[]> => {
  const jsonPath = path.join(__dirname, '..', 'data/');
  const allCognitoData = JSON.parse(fs.readFileSync(jsonPath + 'CognitoData.json', 'utf8'));
  let length: number = allCognitoData.length;
  const userId: string[] = [];

  return new Promise((resolve, reject) => {
      allCognitoData.forEach(async (user: {[key: string]: string}) => {

        const createdUser: AdminCreateUserResponse = await cognito.adminCreateUser({
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
        }).promise();
        
        userId.push(createdUser.User.Username);

        const authData: AdminInitiateAuthResponse = await cognito.adminInitiateAuth({
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          ClientId: process.env.REACT_APP_CLIENT_APP_ID,
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          AuthParameters: {
            USERNAME: createdUser.User.Username,
            PASSWORD: user.password
          }
        }).promise();

        await cognito.adminRespondToAuthChallenge({
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ClientId: process.env.REACT_APP_CLIENT_APP_ID,
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          Session: authData.Session,
          ChallengeResponses: {
            NEW_PASSWORD: user.password,
            USERNAME: createdUser.User.Username
          }
        }).promise();

        length = length - 1;
        if (!length) {
          resolve(userId);
        }
      });
  });
};

import * as fs from 'fs';
import * as path from 'path';
import * as AWS from 'aws-sdk';

type AdminCreateUserResponse = AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserResponse;
type AdminInitiateAuthResponse = AWS.CognitoIdentityServiceProvider.Types.AdminInitiateAuthResponse;
type AdminRespondToAuthChallengeResponse = AWS.CognitoIdentityServiceProvider.Types.AdminRespondToAuthChallengeResponse;

export const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.REACT_APP_AWS_AUTH_REGION,
  credentials: new AWS.SharedIniFileCredentials({ profile: process.env.NODE_ENV + '-profile-precisely' })
});

const createUser = (email: string, password: string, roles: string): Promise<AdminCreateUserResponse> => {
  return cognito.adminCreateUser({
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    Username: email,
    TemporaryPassword: password,
    MessageAction: 'SUPPRESS',
    UserAttributes: [
      {
        Name: 'custom:roles',
        Value: roles
      }
    ]
  }).promise();
};

const initiateAuth = (username: string, password: string): Promise<AdminInitiateAuthResponse> => {
  return cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    ClientId: process.env.REACT_APP_CLIENT_APP_ID,
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  }).promise();
};

const confirmUser = (session: string, username: string, password: string): 
    Promise<AdminRespondToAuthChallengeResponse> => {

  return cognito.adminRespondToAuthChallenge({
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: process.env.REACT_APP_CLIENT_APP_ID,
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    Session: session,
    ChallengeResponses: {
      NEW_PASSWORD: password,
      USERNAME: username
    }
  }).promise();
};

export const seedCognito = (): Promise<string[]> => {
  const jsonPath = path.join(__dirname, '..', 'data/');
  const allCognitoData = JSON.parse(fs.readFileSync(jsonPath + 'CognitoData.json', 'utf8'));
  let length: number = allCognitoData.length;
  const userId: string[] = [];

  return new Promise((resolve, reject) => {
      allCognitoData.forEach(async (user: {[key: string]: string}) => {
        
        const createdUser: AdminCreateUserResponse = await createUser(user.email, user.password, user.roles);

        userId.push(createdUser.User.Username);

        const authData: AdminInitiateAuthResponse = await initiateAuth(
          createdUser.User.Username,
          user.password
        );

        await confirmUser(authData.Session, createdUser.User.Username, user.password);

        length = length - 1;
        if (!length) {
          resolve(userId);
        }
      });
  });
};

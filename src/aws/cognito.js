/*
  Lightweight Cognito helper using amazon-cognito-identity-js.
  Configure the following env vars in your .env file at project root:
  VITE_COGNITO_USER_POOL_ID
  VITE_COGNITO_CLIENT_ID
  VITE_AWS_REGION

  Note: Assigning a user to `PassengerGroup` requires an admin action (Lambda PostConfirmation
  or a backend service using AWS SDK). See README notes in this file.
*/
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

let _userPool = null;

function getUserPool() {
  if (_userPool) return _userPool;
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
  if (!userPoolId || !clientId) {
    // Do not throw during module init; throw when code actually tries to use the pool.
    return null;
  }
  _userPool = new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });
  return _userPool;
}

export function signUp({ email, phoneNumber, givenName, familyName, birthdate, password }) {
  const userPool = getUserPool();
  if (!userPool) return Promise.reject(new Error('Cognito UserPoolId and ClientId must be configured'));
  const attributeList = [];
  if (givenName) {
    attributeList.push(new CognitoUserAttribute({ Name: 'given_name', Value: givenName }));
  }
  if (familyName) {
    attributeList.push(new CognitoUserAttribute({ Name: 'family_name', Value: familyName }));
  }
  if (birthdate) {
    attributeList.push(new CognitoUserAttribute({ Name: 'birthdate', Value: birthdate }));
  }
  if (phoneNumber) {
    attributeList.push(new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber }));
  }
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export function confirmSignUp({ email, code }) {
  const userPool = getUserPool();
  if (!userPool) return Promise.reject(new Error('Cognito UserPoolId and ClientId must be configured'));
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export function login({ email, password }) {
  const userPool = getUserPool();
  if (!userPool) return Promise.reject(new Error('Cognito UserPoolId and ClientId must be configured'));
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
      newPasswordRequired: () => reject(new Error('New password required')),
    });
  });
}

export function signOut() {
  const userPool = getUserPool();
  if (!userPool) return;
  const current = userPool.getCurrentUser();
  if (current) current.signOut();
}

/*
  Important: Automatically adding a user to `PassengerGroup` cannot be securely performed
  from client-side code because it requires AWS credentials and Admin APIs. Recommended options:

  1) Add a Cognito Post Confirmation Lambda trigger that runs `adminAddUserToGroup` using an IAM role
     with permissions to update user pools. This is the most secure and common approach.

  2) Have your backend call `AdminAddUserToGroup` after verifying the user's signup (using server-side
     AWS SDK and proper IAM credentials).

  Example (Node.js server-side) using AWS SDK v3:

  const { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } = require('@aws-sdk/client-cognito-identity-provider');
  const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
  const cmd = new AdminAddUserToGroupCommand({ UserPoolId, Username: email, GroupName: 'passenger' });
  await client.send(cmd);

*/

import {CognitoIdentityCredentialProvider} from '@aws-sdk/credential-provider-cognito-identity';

export type AwsConfig = {
  region: string,
  credentials?: CognitoIdentityCredentialProvider,
};

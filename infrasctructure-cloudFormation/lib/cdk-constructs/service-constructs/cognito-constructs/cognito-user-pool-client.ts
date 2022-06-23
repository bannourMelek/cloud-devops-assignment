import { aws_cognito as cognito } from 'aws-cdk-lib';
import { ServiceStack } from '../../../service-stack';
import { APP_NAME } from '../../../stack-base';
import { MicroserviceCognitoProps } from './cognito-user-pool';

export class CognitoUserPoolClient extends cognito.UserPoolClient {
  constructor(stack: ServiceStack, props: MicroserviceCognitoProps) {
    super(stack, `CognitoUserPoolClient`, {
      userPoolClientName: `${APP_NAME}-UserPoolClient`,
      userPool: props.sharedServiceComponents.cognitoUserPool,
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      authFlows: {
        userPassword: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          new cognito.ResourceServerScope({
            scopeName: '*',
            scopeDescription: 'Full access',
          }),
        ],
        callbackUrls: ['http://localhost:3000'],
        logoutUrls: ['http://localhost:3000'],
      },
    });
  }
}

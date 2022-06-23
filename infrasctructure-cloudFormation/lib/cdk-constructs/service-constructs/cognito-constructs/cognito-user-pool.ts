import { aws_cognito as cognito } from 'aws-cdk-lib';
import { ServiceStack } from '../../../service-stack';
import { APP_NAME } from '../../../stack-base';
import { SharedServiceComponents } from '../shared-service-components';

export interface MicroserviceCognitoProps {
  sharedServiceComponents: SharedServiceComponents;
}

export class CognitoUserPool extends cognito.UserPool {
  constructor(stack: ServiceStack) {
    super(stack, `CognitoUserPool`, {
      userPoolName: `${APP_NAME}-UserPool`,
      selfSignUpEnabled: true,
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
      signInAliases: {
        username: true,
        email: true,
      },
      autoVerify: { email: true },
      /*userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },*/
    });
  }
}

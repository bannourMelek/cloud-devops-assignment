import { aws_cognito as cognito } from 'aws-cdk-lib';
import { ServiceStack } from '../../../service-stack';
import { MicroserviceCognitoProps } from './cognito-user-pool';

export class CognitoUserPoolDomain extends cognito.UserPoolDomain {
  constructor(stack: ServiceStack, props: MicroserviceCognitoProps) {
    super(stack, `CognitoUserPoolDomain`, {
      userPool: props.sharedServiceComponents.cognitoUserPool,
      cognitoDomain: {
        domainPrefix: 'cloud-devops-assignment',
      },
    });
  }
}

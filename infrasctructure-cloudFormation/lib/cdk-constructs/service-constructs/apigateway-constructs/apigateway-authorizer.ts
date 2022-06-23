import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { ServiceStack } from '../../../service-stack';
import { APP_NAME } from '../../../stack-base';
import { MicroserviceLambdaProps } from '../lambda-function-constructs/lambda-function-base';

export class ApigatewayAuthorizer extends apigateway.CfnAuthorizer {
  constructor(stack: ServiceStack, props: MicroserviceLambdaProps) {
    super(stack, `${APP_NAME}-TodosCrudAuthorizer`, {
      name: `${APP_NAME}-TodosCrudAuthorizer`,
      type: apigateway.AuthorizationType.COGNITO,
      authorizerResultTtlInSeconds: 300,
      identitySource: 'method.request.header.Authorization',
      restApiId: props.sharedServiceComponents.apigateway.restApiId,
      providerArns: [props.sharedServiceComponents.cognitoUserPool.userPoolArn],
    });
  }
}

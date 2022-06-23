import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { ServiceStack } from '../../../service-stack';
import { APP_NAME } from '../../../stack-base';

export class Apigateway extends apigateway.RestApi {
  constructor(stack: ServiceStack) {
    super(stack, `${APP_NAME}-EmployeesAPI`, {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });
  }
}

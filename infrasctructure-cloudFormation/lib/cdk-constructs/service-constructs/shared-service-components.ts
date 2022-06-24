import {
  aws_apigateway as apigateway,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
import * as path from 'path';
import { ServiceStack } from '../../service-stack';
import { Apigateway } from './apigateway-constructs/apigateway';
import { ApigatewayAuthorizer } from './apigateway-constructs/apigateway-authorizer';
import { CognitoUserPool } from './cognito-constructs/cognito-user-pool';
import { CognitoUserPoolClient } from './cognito-constructs/cognito-user-pool-client';
import { CognitoUserPoolDomain } from './cognito-constructs/cognito-user-pool-domain';
import { EmployeesDynamoDbTable } from './dynamodb-constructs/employees-dynamodb-table';
import { LambdaFunctions } from './lambda-functions';

export class SharedServiceComponents {
  readonly stack: ServiceStack;
  readonly lambdaCode: lambda.AssetCode;
  readonly lambdaFunctions: LambdaFunctions;
  readonly employeesDynamoDbTable: EmployeesDynamoDbTable;
  readonly apigateway: Apigateway;
  readonly cognitoUserPool: CognitoUserPool;
  readonly cognitoUserPoolClient: CognitoUserPoolClient;
  readonly cognitoUserPoolDomain: CognitoUserPoolDomain;
  readonly apigatewayAuthorizer: ApigatewayAuthorizer;

  constructor(stack: ServiceStack) {
    this.stack = stack;
    this.lambdaCode = lambda.Code.fromAsset(
      path.resolve(__dirname, '../../../../lambdas')
    );
    this.employeesDynamoDbTable = this.createEmployeesDynamoDbTable();

    this.cognitoUserPool = new CognitoUserPool(stack);
    this.cognitoUserPoolClient = new CognitoUserPoolClient(stack, {
      sharedServiceComponents: this,
    });
    this.cognitoUserPoolDomain = new CognitoUserPoolDomain(stack, {
      sharedServiceComponents: this,
    });

    this.apigateway = this.createApigateway();
    this.apigatewayAuthorizer = this.createApigatewayAuthorizer();
    this.lambdaFunctions = new LambdaFunctions(this);

    const v1 = this.apigateway.root.addResource('employees');
    this.createRessource(
      v1,
      new apigateway.LambdaIntegration(this.lambdaFunctions.getEmployeesLambda),
      'GET'
    );
    this.createRessource(
      v1,
      new apigateway.LambdaIntegration(
        this.lambdaFunctions.addUpdateEmployeeLambda
      ),
      'PUT'
    );
    const todo = v1.addResource('{id}');
    this.createRessource(
      todo,
      new apigateway.LambdaIntegration(
        this.lambdaFunctions.deleteEmployeeLambda
      ),
      'DELETE'
    );
  }

  private createEmployeesDynamoDbTable(): EmployeesDynamoDbTable {
    return new EmployeesDynamoDbTable(this.stack);
  }

  private createApigateway() {
    const apiGateway = new Apigateway(this.stack);
    return apiGateway;
  }

  private createApigatewayAuthorizer() {
    const apigatewayAuthorizer = new ApigatewayAuthorizer(this.stack, {
      sharedServiceComponents: this,
    });
    return apigatewayAuthorizer;
  }

  createRessource(
    resource: apigateway.Resource,
    lambdaIntegration: apigateway.LambdaIntegration,
    httpMethod: string
  ) {
    resource.addMethod(httpMethod, lambdaIntegration, {
      authorizer: {
        authorizerId: this.apigatewayAuthorizer.ref,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      },
    });
  }
}

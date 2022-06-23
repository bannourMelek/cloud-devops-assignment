import {
  aws_codedeploy as codedeploy,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_logs as logs,
  Duration,
} from 'aws-cdk-lib';

import { ServiceStack } from '../../../service-stack';
import { APP_NAME } from '../../../stack-base';
import { SharedServiceComponents } from '../shared-service-components';

export interface MicroserviceLambdaProps {
  sharedServiceComponents: SharedServiceComponents;
}
export interface LambdaProps extends lambda.FunctionProps {
  functionName: string;
  sharedServiceComponents: SharedServiceComponents;
}

const managedBasicLambdaExecutionPolicy =
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    'service-role/AWSLambdaBasicExecutionRole'
  );

function getTimeoutDuration(props: LambdaProps): Duration {
  if (props.timeout === undefined) {
    return Duration.seconds(10);
  } else {
    return props.timeout;
  }
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractSimpleNameOfLambdaFunction(props: LambdaProps) {
  return props.functionName.split(`${APP_NAME}-`)[1];
}

function createRoleWithDefaultPermissionsForLambda(
  stack: ServiceStack,
  props: LambdaProps
): iam.Role {
  const simpleLambdaName = extractSimpleNameOfLambdaFunction(props);

  const roleName = capitalizeFirstLetter(simpleLambdaName) + 'Role';
  const lambdaPrincipal = new iam.ServicePrincipal('lambda.amazonaws.com');

  const managedBasicLambdaPolicy = managedBasicLambdaExecutionPolicy;
  const iamRole = new iam.Role(stack, `${APP_NAME}-${roleName}`, {
    assumedBy: lambdaPrincipal,
    roleName: `${APP_NAME}-${roleName}`,
    managedPolicies: [managedBasicLambdaPolicy],
  });

  return iamRole;
}

export function getFunctionName(clz: any): string {
  let functionSuffixName = clz.name.replace('Lambda', '');
  functionSuffixName =
    functionSuffixName.charAt(0).toLowerCase() + functionSuffixName.slice(1);
  const functionName = `${APP_NAME}-${functionSuffixName}`;
  return functionName;
}

export function getPythonFunctionHandlerName(clz: any) {
  let pythonFunctionName = getFunctionName(clz).replace(`${APP_NAME}-`, '');
  // needed for python as it is snake case
  pythonFunctionName = pythonFunctionName
    .replace(/[\w]([A-Z])/g, function (m) {
      return m[0] + '_' + m[1];
    })
    .toLowerCase();

  const handlerPath = `src.${pythonFunctionName}.lambda_function.handler`;

  return handlerPath;
}

const LAMBDA_ALIAS_NAME = 'Active';
export const DEFAULT_PYTHON_RUNTIME = lambda.Runtime.PYTHON_3_8;

export class LambdaFunctionBase extends lambda.Function {
  readonly prodAlias: lambda.Alias;
  readonly simpleLambdaName: string;

  constructor(stack: ServiceStack, id: string, props: LambdaProps) {
    super(stack, id, {
      code: props.code,
      runtime: props.runtime,
      handler: props.handler,
      role: createRoleWithDefaultPermissionsForLambda(stack, props),
      functionName: props.functionName,
      environment: {
        ...props.environment,
        LOG_LEVEL: 'INFO',
      },
      memorySize: props.memorySize,
      timeout: getTimeoutDuration(props),
      logRetention: logs.RetentionDays.THREE_MONTHS,
    });

    if (props.runtime.name.startsWith('python')) {
      this.assertPythonHandlerFileExists(props.handler);
    }

    this.prodAlias = this.createProdAlias();
    this.createDeployment();
    this.simpleLambdaName = extractSimpleNameOfLambdaFunction(props);
  }

  private assertPythonHandlerFileExists(handlerName: string) {
    const fs = require('fs');
    let filePath = './../lambdas/';
    if (handlerName.includes('.')) {
      filePath += handlerName.replace(/\./g, '/');
    } else {
      filePath += handlerName;
    }

    const lastIndex = filePath.lastIndexOf('/');
    filePath = filePath.substring(0, lastIndex) + '.py';

    if (!fs.existsSync(filePath)) {
      throw new Error(`filePath: ${filePath} doesn't exist`);
    }
  }

  private createProdAlias(): lambda.Alias {
    const version = this.currentVersion;
    const alias = new lambda.Alias(
      this.stack,
      'LambdaAlias' + this.constructor.name,
      {
        aliasName: LAMBDA_ALIAS_NAME,
        version,
      }
    );
    return alias;
  }

  private createDeployment() {
    const lambdaApp = new codedeploy.LambdaApplication(
      this.stack,
      `LambdaApplication-${this.constructor.name}`,
      {
        applicationName: `${APP_NAME}-${this.constructor.name}`,
      }
    );

    new codedeploy.LambdaDeploymentGroup(
      this.stack,
      'DeploymentGroup' + this.constructor.name,
      {
        alias: this.prodAlias,
        application: lambdaApp,
        deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
      }
    );
  }
}

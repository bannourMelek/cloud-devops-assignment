import { ServiceStack } from '../../../service-stack';
import { APP_NAME } from '../../../stack-base';

import {
  DEFAULT_PYTHON_RUNTIME,
  getFunctionName,
  getPythonFunctionHandlerName,
  LambdaFunctionBase,
  MicroserviceLambdaProps,
} from './lambda-function-base';

export class GetEmployeesLambda extends LambdaFunctionBase {
  constructor(stack: ServiceStack, props: MicroserviceLambdaProps) {
    super(stack, `${APP_NAME}${GetEmployeesLambda.name}`, {
      code: props.sharedServiceComponents.lambdaCode,
      runtime: DEFAULT_PYTHON_RUNTIME,
      sharedServiceComponents: props.sharedServiceComponents,
      handler: getPythonFunctionHandlerName(GetEmployeesLambda),
      functionName: getFunctionName(GetEmployeesLambda),
      memorySize: 128,
      environment: {
        DYNAMODB_TABLE:
          props.sharedServiceComponents.employeesDynamoDbTable.tableName,
      },
    });
    props.sharedServiceComponents.employeesDynamoDbTable.grantReadWriteData(
      this
    );
  }
}

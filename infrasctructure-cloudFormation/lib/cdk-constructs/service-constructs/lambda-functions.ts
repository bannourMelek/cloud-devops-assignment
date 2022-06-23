import { AddUpdateEmployeeLambda } from './lambda-function-constructs/add-update-employee-lambda';
import { DeleteEmployeeLambda } from './lambda-function-constructs/delete-employee-lambda';
import { GetEmployeesLambda } from './lambda-function-constructs/get-employees-lambda';
import { SharedServiceComponents } from './shared-service-components';

export class LambdaFunctions {
  readonly getEmployeesLambda: GetEmployeesLambda;
  readonly addUpdateEmployeeLambda: AddUpdateEmployeeLambda;
  readonly deleteEmployeeLambda: DeleteEmployeeLambda;

  constructor(sharedServiceComponents: SharedServiceComponents) {
    const stack = sharedServiceComponents.stack;
    this.getEmployeesLambda = new GetEmployeesLambda(stack, {
      sharedServiceComponents,
    });

    this.addUpdateEmployeeLambda = new AddUpdateEmployeeLambda(stack, {
      sharedServiceComponents,
    });

    this.deleteEmployeeLambda = new DeleteEmployeeLambda(stack, {
      sharedServiceComponents,
    });
  }
}

import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StackType } from './type-definitions';
export const APP_NAME = 'CloudDevopsAssignment';

export const SERVICE_STACK_NAME = `${APP_NAME}-Service`;
export const INITIAL_STACK_NAME = `${APP_NAME}-Initial`;

export function getCdkId(stackType: StackType) {
  return `${APP_NAME}-${stackType}`;
}

function getStackName(props: StackBaseProps) {
  if (props.stackType == 'Initial') {
    return INITIAL_STACK_NAME;
  } else {
    return SERVICE_STACK_NAME;
  }
}

function createStackProps(scope: Construct, props: StackBaseProps): StackProps {
  const properties = scope.node.tryGetContext('env');
  const stackName = getStackName(props);
  return {
    stackName: stackName,
    env: {
      account: properties.account,
      region: properties.region,
    },
  };
}

export interface StackBaseProps {
  stackType: StackType;
}

export class StackBase extends Stack {
  constructor(scope: Construct, props: StackBaseProps) {
    super(scope, getCdkId(props.stackType), createStackProps(scope, props));
  }
}

import { Construct } from 'constructs';
import { StackBase } from './stack-base';
import { SharedServiceComponents } from './cdk-constructs/service-constructs/shared-service-components';

export class ServiceStack extends StackBase {
  public readonly sharedServiceComponents: SharedServiceComponents;

  constructor(scope: Construct) {
    super(scope, { stackType: 'Service' });
    this.sharedServiceComponents = new SharedServiceComponents(this);
  }
}

import { Stage, StageProps } from 'aws-cdk-lib';
import { InitialStack } from '../../initial-stack';
import { ServiceStack } from '../../service-stack';

export class ServiceStackDemoStage extends Stage {
  readonly serviceStack: ServiceStack;

  constructor(stack: InitialStack, id: string, props?: StageProps) {
    super(stack, id, props);
    this.serviceStack = new ServiceStack(this);
  }
}

import { Construct } from 'constructs';
import { CodePipeline } from './cdk-constructs/initial-constructs/pipeline';
import { StackBase } from './stack-base';

export class InitialStack extends StackBase {
  constructor(scope: Construct) {
    super(scope, { stackType: 'Initial' });

    new CodePipeline(this);
  }
}

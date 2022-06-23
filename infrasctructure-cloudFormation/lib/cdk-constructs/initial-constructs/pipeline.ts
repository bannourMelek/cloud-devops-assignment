import { pipelines as cdkpipeline, Stack } from 'aws-cdk-lib';
import { InitialStack } from '../../initial-stack';
import { APP_NAME } from '../../stack-base';
import { ServiceStackDemoStage } from './service-stack-stage';

function getSourceInput(stack: Stack) {
  const branch = stack.node.tryGetContext('env').branch;
  const repoName = stack.node.tryGetContext('env').repoName;
  return cdkpipeline.CodePipelineSource.gitHub(repoName, branch);
}
export class CodePipeline extends cdkpipeline.CodePipeline {
  readonly serviceStackDemoStage: ServiceStackDemoStage;

  constructor(stack: InitialStack) {
    super(stack, `${APP_NAME}-Pipeline`, {
      pipelineName: `${APP_NAME}-Pipeline`,
      synth: new cdkpipeline.ShellStep('Synth', {
        input: getSourceInput(stack),
        installCommands: ['cd cdk', 'npm ci'],
        commands: [
          'cd ../lambdas',
          'pip install -r requirements.txt -t .',
          'pip install -r dev_requirements.txt -t .',
          'cd ../cdk',
          'npm run build',
          'npx cdk synth',
        ],
        primaryOutputDirectory: 'cdk/cdk.out',
      }),
    });
    this.addStage(
      new ServiceStackDemoStage(stack, `Service`, {
        env: {
          account: this.node.tryGetContext('env').account,
          region: this.node.tryGetContext('env').region,
        },
      })
    );
  }
}

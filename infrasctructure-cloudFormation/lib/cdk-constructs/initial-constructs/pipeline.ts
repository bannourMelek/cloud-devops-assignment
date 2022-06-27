import { pipelines as cdkpipeline, Stack } from 'aws-cdk-lib';
import { ShellStep } from 'aws-cdk-lib/pipelines';
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
        installCommands: ['cd infrasctructure-cloudFormation', 'npm ci'],
        commands: [
          'cd ../lambdas',
          'pip install -r requirements.txt -t .',
          'cd ../infrasctructure-cloudFormation',
          'npm run build',
          'npx cdk synth',
        ],
        primaryOutputDirectory: 'infrasctructure-cloudFormation/cdk.out',
      }),
    });
    const serviceStage = this.addStage(
      new ServiceStackDemoStage(stack, `Service`, {
        env: {
          account: this.node.tryGetContext('env').account,
          region: this.node.tryGetContext('env').region,
        },
      })
    );

    serviceStage.addPost(
      new ShellStep('deleteServiceStack', {
        input: getSourceInput(stack),
        commands: [
          'aws cloudformation delete-stack CloudDevopsAssignment-Initial/Service/CloudDevopsAssignment-Service',
        ],
      })
    );
  }
}

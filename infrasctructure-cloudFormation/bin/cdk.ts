#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { InitialStack } from '../lib/initial-stack';

const app = new App();

export function getEnv() {
  return {
    account: app.node.tryGetContext('env').account,
    region: app.node.tryGetContext('env').region,
  };
}

new InitialStack(app);
app.synth();

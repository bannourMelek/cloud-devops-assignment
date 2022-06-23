import { aws_s3 as s3 } from 'aws-cdk-lib';
import { ServiceStack } from '../../../service-stack';

export class FrontendWebsiteBucket extends s3.Bucket {
  constructor(stack: ServiceStack) {
    super(stack, `FrontendWebsiteBucket`, {
      bucketName: `Frontend-website-Bucket`.toLowerCase(),
      publicReadAccess: true,
      versioned: true,
    });
  }
}

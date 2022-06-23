import {
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontorigins,
} from 'aws-cdk-lib';
import { ServiceStack } from '../../../service-stack';
import { SharedServiceComponents } from '../shared-service-components';

export interface MicroserviceCloudFrontProps {
  sharedServiceComponents: SharedServiceComponents;
}

export class CloudFrontDistribution extends cloudfront.Distribution {
  constructor(stack: ServiceStack, props: MicroserviceCloudFrontProps) {
    super(stack, `CognitoUserPool`, {
      defaultBehavior: {
        origin: new cloudfrontorigins.S3Origin(
          props.sharedServiceComponents.frontendWebsiteBucket
        ),
      },
    });
  }
}

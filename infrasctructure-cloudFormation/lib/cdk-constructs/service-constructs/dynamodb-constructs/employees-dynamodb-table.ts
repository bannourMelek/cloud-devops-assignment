import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { ServiceStack } from '../../../service-stack';
import { APP_NAME } from '../../../stack-base';

const PARTITION_KEY_NAME = 'id';
const SORT_KEY_NAME = 'manager';

export class EmployeesDynamoDbTable extends dynamodb.Table {
  constructor(stack: ServiceStack) {
    super(stack, `${APP_NAME}-Employees-DynamoDb`, {
      tableName: `${APP_NAME}-Employees`,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: PARTITION_KEY_NAME,
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: SORT_KEY_NAME,
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.addGlobalSecondaryIndex({
      indexName: 'GSI-EmployeesByManager',
      partitionKey: {
        name: SORT_KEY_NAME,
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}

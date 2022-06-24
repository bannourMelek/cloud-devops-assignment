import boto3
import json
import os

def lambda_handler(event, context):
    bucket_name = os.environ["TABLE_NAME"]
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(bucket_name) 
    response = table.scan()
    return {
      'statusCode': 200,
      'body': json.dumps(response['Items']),
      'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods'
            
       }
}       
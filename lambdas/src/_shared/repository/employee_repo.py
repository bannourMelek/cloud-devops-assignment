import os
from typing import List

import boto3
from boto3.dynamodb.conditions import Key
from src._shared.entity.employee import Employee


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])


class EmployeeRepository:

    def get_all_employees(self) -> List[Employee]:
        response = table.scan()
        items = response['Items']
        employees = [
            Employee(item['id'], item['manager'], item['first_name'],
                     item['last_name'], item['description'])
            for item in items
        ]
        return employees

    def insert_employee(self, employee: Employee):
        table.put_item(
            Item={
                'id':
                    employee.id,
                'manager':
                    employee.manager,
                'first_name':
                    employee.first_name,
                'last_name':
                    employee.last_name,
                'description':
                    employee.description,
            }
        )

    def delete_employee(self, employee: Employee):
        table.delete_item(
            Key={
                'id':
                    employee.id,
                'manager':
                    employee.manager,
            }
        )

    def get_employees_by_manager(self, manager_name: str) -> List[Employee]:
        response = table.query(
            IndexName='EmployeesByManager',
            KeyConditionExpression=Key('manager').eq(manager_name)
        )
        items = response['Items']
        employees = [
            Employee(item['id'], item['manager'], item['first_name'],
                     item['last_name'], item['description'])
            for item in items
        ]
        return employees

import json
from typing import Any
import boto3
import os
from src._shared.entity.employee import Employee

from src._shared.repository.employee_repo import EmployeeRepository


class EventHandler:
    employee_repo = EmployeeRepository()

    def handle_call(self, employee: Employee):
        self.employee_repo.delete_employee(employee)
        employees = self.employee_repo.get_all_employees()

        return employees


event_handler = EventHandler()


def handler(event: Any, context: Any) -> Any:
    body = json.loads(event['body'])
    employee = Employee(body['id'], body['manager'],
                        body['first_name'], body['last_name'], body['description'])
    employees = event_handler.handle_call(event)
    response = [employee.to_json() for employee in employees]

    return {
        'statusCode': 200,
        'body': response,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods'
        }
    }


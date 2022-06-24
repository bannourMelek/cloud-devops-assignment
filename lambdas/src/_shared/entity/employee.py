from dataclasses import dataclass


@dataclass(frozen=True)
class Employee:
    id: str
    manager: str
    first_name: str
    last_name: str
    description: str

    def to_json(self):
        result = {
            'id': self.id,
            'manager': self.manager,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'description': self.description,
        }
        return result

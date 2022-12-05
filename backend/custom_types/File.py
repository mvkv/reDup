from dataclasses import dataclass


@dataclass
class File:
    id: str
    name: str
    parents: list[str]

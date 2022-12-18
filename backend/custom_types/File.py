from dataclasses import dataclass
from typing import List


@dataclass
class File:
    id: str
    name: str
    parents: List[str]
    thumbnailLink: str = None

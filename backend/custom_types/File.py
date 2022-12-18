from dataclasses import dataclass
from typing import List, Union


@dataclass
class File:
    id: str
    name: str
    parents: List[str]
    thumbnailLink: Union[str, None] = None

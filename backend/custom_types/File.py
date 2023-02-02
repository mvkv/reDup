from dataclasses import dataclass
from typing import List, Union


@dataclass
class File:
    id: str
    name: str
    thumbnailLink: Union[str, None] = None

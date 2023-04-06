from dataclasses import dataclass
from typing import Union


@dataclass
class File:
    id: str
    name: str
    thumbnailLink: Union[str, None] = None

from dataclasses import dataclass


@dataclass
class Image:
    id: str
    name: str
    image_bytes: str

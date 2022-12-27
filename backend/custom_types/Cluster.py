from dataclasses import dataclass, field
from custom_types.Image import Image
from typing import List
from uuid import uuid4


@dataclass
class Cluster:
    id: str = uuid4()
    images: List[Image] = field(default_factory=lambda: [])

    def get_web_content(self):
        return {
            "id": self.id,
            "images": [image.get_web_content() for image in self.images]
        }

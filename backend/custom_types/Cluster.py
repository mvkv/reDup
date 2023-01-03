from dataclasses import dataclass, field
from custom_types.Image import Image
from typing import List


@dataclass
class Cluster:
    id: str
    images: List[Image] = field(default_factory=lambda: [])

    def to_web_json(self):
        return {
            "id": self.id,
            "images": [image.to_web_json() for image in self.images]
        }

    def add_image(self, image: Image):
        self.images.append(image)

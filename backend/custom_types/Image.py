from dataclasses import dataclass


@dataclass
class Image:
    id: str
    name: str
    image_bytes: str
    image_url: str

    def to_web_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_url": self.image_url
        }

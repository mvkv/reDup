import imagehash
from custom_types.Image import Image
from PIL import Image as p_image
import io

TRESHOLD = 5


def compute_image_hash_from_bytes(image_bytes):
    image = p_image.open(io.BytesIO(image_bytes))
    return imagehash.dhash(image)


def compare_images_from_bytes(image1_bytes, image2_bytes):
    image1_hash = compute_image_hash_from_bytes(image1_bytes)
    image2_hash = compute_image_hash_from_bytes(image2_bytes)
    return image1_hash - image2_hash


def cluster_images_from_bytes(images: list[Image]):
    clusters = []
    seen = set()
    for image in images:
        if image.id in seen:
            continue
        seen.add(image.id)
        cluster = [image]
        for other_image in images:
            if other_image.id in seen or image.id == other_image.id:
                continue
            if compare_images_from_bytes(image.image_bytes, other_image.image_bytes) < TRESHOLD:
                cluster.append(other_image)
                seen.add(other_image.id)
        clusters.append(cluster)

    return clusters

import imagehash
from custom_types.Image import Image
from custom_types.Cluster import Cluster
from PIL import Image as p_image
import io
from typing import List
from uuid import uuid4

TRESHOLD = 5


def compute_image_hash_from_bytes(image_bytes):
    image = p_image.open(io.BytesIO(image_bytes))
    return imagehash.dhash(image)


def compare_images_from_bytes(image1_bytes, image2_bytes):
    image1_hash = compute_image_hash_from_bytes(image1_bytes)
    image2_hash = compute_image_hash_from_bytes(image2_bytes)
    return image1_hash - image2_hash


def cluster_images(images: List[Image]) -> List[Cluster]:
    clusters = []
    seen = set()
    for idx, image in enumerate(images):
        if image.id in seen:
            continue

        cluster = Cluster(uuid4().urn)
        cluster.add_image(image)
        seen.add(image.id)

        for other_image_idx in range(idx + 1, len(images)):
            if images[other_image_idx].id in seen:
                continue

            if compare_images_from_bytes(image.image_bytes, images[other_image_idx].image_bytes) < TRESHOLD:
                cluster.add_image(images[other_image_idx])
                seen.add(images[other_image_idx].id)
        clusters.append(cluster)

    # TODO Filter out clusters with only 1 image.
    return clusters


def get_web_content_from_clusters(clusters: List[Cluster]) -> List[dict]:
    return [cluster.to_web_json() for cluster in clusters if len(cluster.images) > 1]

import imagehash
from custom_types.Image import Image
from PIL import Image as p_image
import io
from typing import List

TRESHOLD = 5


def compute_image_hash_from_bytes(image_bytes):
    image = p_image.open(io.BytesIO(image_bytes))
    return imagehash.dhash(image)


def compare_images_from_bytes(image1_bytes, image2_bytes):
    image1_hash = compute_image_hash_from_bytes(image1_bytes)
    image2_hash = compute_image_hash_from_bytes(image2_bytes)
    return image1_hash - image2_hash


def cluster_images(images: List[Image]) -> List[List[Image]]:
    clusters = []
    seen = set()
    for idx, image in enumerate(images):
        if image.id in seen:
            continue

        cluster = [image]
        seen.add(image.id)

        for other_image_idx in range(idx + 1, len(images)):
            if images[other_image_idx].id not in seen:
                if compare_images_from_bytes(image.image_bytes, images[other_image_idx].image_bytes) < TRESHOLD:
                    cluster.append(images[other_image_idx])
                    seen.add(images[other_image_idx].id)
        clusters.append(cluster)

    return clusters


def get_web_content_from_clusters(clusters: List[List[Image]]) -> List[List[Image]]:
    web_content_clusters = []
    for cluster in clusters:
        new_cluster = []
        for img in cluster:
            new_cluster.append(img.get_web_content())
        web_content_clusters.append(new_cluster)
    return web_content_clusters

from custom_types.Image import Image
from custom_types.Cluster import Cluster
from typing import List
from uuid import uuid4
from sentence_transformers import SentenceTransformer, util
import numpy as np
from scipy.sparse.csgraph import connected_components
from PIL import Image as p_image
import imagehash
import io
from time import ctime
import logging

CLIP_TRESHOLD = 0.905
HASH_TRESHOLD = 10
CLIP_CACHE_FOLDER = "models/clip"

logger = logging.getLogger("uvicorn")

logger.debug("Loading CLIP Model...")
model = SentenceTransformer("clip-ViT-B-32", cache_folder=CLIP_CACHE_FOLDER)


def compute_image_hash_from_bytes(image_bytes):
    image = p_image.open(io.BytesIO(image_bytes))
    return imagehash.dhash(image)


def compare_images_from_bytes(image1_bytes, image2_bytes):
    image1_hash = compute_image_hash_from_bytes(image1_bytes)
    image2_hash = compute_image_hash_from_bytes(image2_bytes)
    return image1_hash - image2_hash


def cluster_images_with_clip(images: List[Image]) -> List[Cluster]:
    adj_matrix = np.identity(len(images))

    logger.debug(f"{ctime()} - Parsing images with CLIP")
    # Encodes images with CLIP, creating an embedding vector containing a semantic representation of the image
    encoded_images = model.encode([p_image.open(io.BytesIO(image.image_bytes)) for image in images], batch_size=128, convert_to_tensor=True)
    # Calculates the cosine similarity scores between every embedded image
    processed_images = util.paraphrase_mining_embeddings(encoded_images)

    logger.debug(f"{ctime()} - Images parsed")
    logger.debug(f"{ctime()} - Populating graph matrix")

    # compared_images structure : [similarity_score, img_1_index, img_2_index]
    for score, img_1_idx, img_2_idx in processed_images:
        if score > CLIP_TRESHOLD:
            # TODO: investigate if it's possible to use a triangle matrix instead of a total matrix
            adj_matrix[img_1_idx][img_2_idx] = 1
            adj_matrix[img_2_idx][img_1_idx] = 1
    logger.debug(f"{ctime()} - Graph matrix populated")

    logger.debug(f"{ctime()} - Creating clusters")
    # labels is an array where every index corresponds to an image index and the value is the correspective cluster
    number_of_clusters, labels = connected_components(adj_matrix, directed=False)

    # Creating clusters based on number of clusters
    clusters = [Cluster(uuid4().urn) for x in range(number_of_clusters)]
    
    for image_index, cluster_index in enumerate(labels):
        clusters[cluster_index].add_image(images[image_index])

    logger.debug(f"{ctime()} - Clusters created")
    return [cluster for cluster in clusters if len(cluster.images) > 1]


def cluster_images_with_hash(images: List[Image]) -> List[Cluster]:
    logger.debug(f"{ctime()} - Parsing images with hashes")
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

            if compare_images_from_bytes(image.image_bytes, images[other_image_idx].image_bytes) < HASH_TRESHOLD:
                cluster.add_image(images[other_image_idx])
                seen.add(images[other_image_idx].id)
        clusters.append(cluster)
    logger.debug(f"{ctime()} - Clusters created")
    return [cluster for cluster in clusters if len(cluster.images) > 1]


def cluster_images(images: List[Image], use_clip: bool()) -> List[Cluster]:
    if use_clip: 
        return cluster_images_with_clip(images)
    return cluster_images_with_hash(images)


def get_web_content_from_clusters(clusters: List[Cluster]) -> List[dict]:
    return [cluster.to_web_json() for cluster in clusters]

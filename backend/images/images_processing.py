from custom_types.Image import Image
from custom_types.Cluster import Cluster
from typing import List
from uuid import uuid4
from sentence_transformers import SentenceTransformer, util
import numpy as np
from scipy.sparse.csgraph import connected_components
from PIL import Image as p_image
import io
from time import ctime


print("Loading CLIP Model...")
model = SentenceTransformer("clip-ViT-B-32", cache_folder="models/clip")

TRESHOLD = 0.905


def cluster_images(images: List[Image]) -> List[Cluster]:
    adj_matrix = np.identity(len(images))
    print(f"{ctime()} - Parsing images with CLIP")
    # TODO: Investigate on downscaling images before parsing with CLIP (to improve perfomance)
    encoded_images = model.encode([p_image.open(io.BytesIO(image.image_bytes)) for image in images], batch_size=128, convert_to_tensor=True)
    processed_images = util.paraphrase_mining_embeddings(encoded_images)
    print(f"{ctime()} - Images parsed")
    print(f"{ctime()} - Populating graph matrix")
    near_duplicates = [image for image in processed_images if image[0] > TRESHOLD]

    for score, image_id1, image_id2 in near_duplicates:
        adj_matrix[image_id1][image_id2] = 1
        adj_matrix[image_id2][image_id1] = 1

    cc, labels = connected_components(adj_matrix, directed=False)
    
    print(f"{ctime()} - Graph matrix populated")
    
    clusters = []
    temp_clusters = {}
    
    print(f"{ctime()} - Creating clusters")
    # TODO: Reorganize code in order to create clusters in smarter way
    for index, el in enumerate(labels):
        if f"{el}" in temp_clusters:
            temp_clusters[f"{el}"].append(images[index])
        else:
            temp_clusters[f"{el}"] = [images[index]]

    for t_cluster_idx in temp_clusters:
        new_cluster = Cluster(uuid4().urn)
        [new_cluster.add_image(image) for image in temp_clusters[t_cluster_idx]]
        clusters.append(new_cluster)

    print(f"{ctime()} - Clusters created")
    return [cluster for cluster in clusters if len(cluster.images) > 1]


def get_web_content_from_clusters(clusters: List[Cluster]) -> List[dict]:
    return [cluster.to_web_json() for cluster in clusters]

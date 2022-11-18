from PIL import Image
import imagehash
import io


def get_image_hash_from_bytes(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    return imagehash.dhash(image)


def compare_images_from_bytes(image1_bytes, image2_bytes):
    image1_hash = get_image_hash_from_bytes(image1_bytes)
    image2_hash = get_image_hash_from_bytes(image2_bytes)
    return image1_hash - image2_hash


def cluster_images_from_bytes(images):
    clusters = []
    seen = []
    for image in images:
        if image["id"] in seen:
            continue
        seen.append(image)
        cluster = [image]
        for other_image in images:
            if other_image["id"] in seen or image["id"] == other_image["id"]:
                continue
            if compare_images_from_bytes(image["media_bytes"], other_image["media_bytes"]) < 5:
                cluster.append(other_image)
                seen.append(other_image["id"])
        clusters.append(cluster)

    return clusters

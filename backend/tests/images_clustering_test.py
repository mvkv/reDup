import unittest
import os
from custom_types.Image import Image
from images.images_processing import cluster_images_from_bytes
import random

SOURCE_DIR = "backend/tests/res/images"
EXPECTED_CLUSTERS = [["img1.jpg"], ["img3.jpg", "img4.jpg"], ["img2.jpg", "img5.jpg"]]


class TestClustering(unittest.TestCase):

    def import_images(self):
        images_names = os.listdir(SOURCE_DIR)
        random.shuffle(images_names)
        images = []
        for image_name in images_names:
            img_path = os.path.join(SOURCE_DIR, image_name)
            with open(img_path, "rb") as img:
                images.append(
                    Image(image_name, image_name, img.read())
                )
        return images

    def test_clustering_images_from_bytes(self):
        images = self.import_images()
        image_to_image_id = lambda image : image.id
        id_clusters = list(map(lambda cluster : sorted(map(image_to_image_id, cluster)) , cluster_images_from_bytes(images)))
        self.assertCountEqual(id_clusters, EXPECTED_CLUSTERS)


if __name__ == "__main__":
    unittest.main()

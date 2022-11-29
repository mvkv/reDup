import unittest
import os
from custom_types.Image import Image
from images.images_processing import cluster_images_from_bytes

SOURCE_DIR = "backend/tests/res/images"
CLUSTERS = [["img1.jpg"], ["img4.jpg", "img3.jpg"], ["img5.jpg", "img2.jpg"]]


class TestClustering(unittest.TestCase):

    def import_images(self):
        images_names = os.listdir(SOURCE_DIR)
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
        clusters = cluster_images_from_bytes(images)
        id_clusters = []

        for cluster in clusters:
            id_cluster = []
            for img in cluster:
                id_cluster.append(img.id)
            id_clusters.append(id_cluster)

        id_clusters.sort()
        self.assertCountEqual(id_clusters, CLUSTERS)


if __name__ == "__main__":
    unittest.main()

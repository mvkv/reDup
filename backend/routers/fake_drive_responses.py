from typing import Dict, List
from custom_types.File import File
import random
import string

alphabet = string.ascii_lowercase + string.digits
def fake_uuid(): return ''.join(random.choices(alphabet, k=8))


def fake_get_folders_from_parent_id(parent_id: str = "root") -> List[File]:
    depth = parent_id.count("/")
    if depth > 4:
        return []
    else:
        return [
            File(id=f'id_{fake_uuid()}', name=f'n_{fake_uuid()}')
            for _ in range(random.randint(4, 25))]


def fake_get_clusters_from_folders_ids(folders_ids: List[str]) -> List[dict]:
    def rand_size(): return [250, 300, 350, 400][random.randint(0, 3)]
    def fake_img(): return {'id': f'id_{fake_uuid()}', 'name': f'n_{fake_uuid()}',
                            'image_url': f'https://picsum.photos/{rand_size()}/{rand_size()}.jpg'}
    return [
        {'id': fake_uuid(), 'images': [fake_img()
                                       for _ in range(random.randint(2, 6))]}
        for _ in range(random.randint(4, 15) * len(folders_ids))
    ]


def fake_delete_files_from_ids(files_ids: List[str]) -> Dict[str, bool]:
    return {id: random.random() > 0.1 for id in files_ids}

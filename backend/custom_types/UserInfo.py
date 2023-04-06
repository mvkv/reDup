from typing import Union
from typing import NamedTuple


class UserInfo(NamedTuple):
    email: Union[str, None] = None
    profile_pic_url: Union[str, None] = None

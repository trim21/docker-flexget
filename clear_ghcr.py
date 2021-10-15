"""
https://github.com/airtower-luna/hello-ghcr/blob/e17ebc574711f4bcf85f8bd6b2380e226901778d/ghcr-prune.py

Copyright (C) 2021 Fiona Klute

MIT License
"""
import os
from typing import Set
from datetime import datetime, timedelta

import httpx

if __name__ == "__main__":
    old = datetime.now().astimezone() - timedelta(days=10)
    container_name = 'flexget'

    if 'GH_TOKEN' in os.environ:
        token = os.environ['GH_TOKEN']
    else:
        raise ValueError('missing authentication token')

    s = httpx.Client(
        headers={
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json'
        }
    )

    versions = s.get(f'https://api.github.com/user/packages/container/{container_name}/versions').json()

    versions_to_delete: Set[int] = set()
    for v in versions:
        package_version_id = v["id"]
        created = datetime.strptime(v['created_at'], "%Y-%m-%dT%H:%M:%S%z")
        metadata = v["metadata"]["container"]
        print(f'{v["id"]}\t{v["name"]}\t{metadata["tags"]}')

        if 'latest' in metadata['tags']:
            continue

        if not metadata['tags']:
            versions_to_delete.add(package_version_id)
        elif created < old:
            versions_to_delete.add(package_version_id)

    for package_version_id in versions_to_delete:
        print('try delete', package_version_id)
        r = s.delete(f'https://api.github.com/user/packages/container/{container_name}/versions/{package_version_id}')
        r.raise_for_status()
        print(f'deleted {package_version_id}')

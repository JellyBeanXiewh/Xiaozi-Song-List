#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from csv import DictReader
from pathlib import Path


def main():
    workdir = Path(__file__).parent
    song_list = []
    # Excel 保存为 UTF-8 编码的 CSV 文件时会自带 BOM
    with open(workdir / 'song_list.csv', 'r', encoding='utf-8-sig') as f:
        reader = DictReader(f)
        for row in reader:
            song_list.append({
                'song': row['歌名'],
                'artist': row['歌手'],
                'lang': row['语言'],
                'remark': row['备注']
            })

    rootdir = workdir.parent
    with open(rootdir / 'src' / 'assets' / 'json' / 'song_list.json', 'w', encoding='utf-8') as f:
        json.dump(song_list, f, ensure_ascii=False)


if __name__ == '__main__':
    main()

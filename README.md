# 小紫的歌单 / Xiaozi-Song-List

> Fork from [Itsuki-Song-List](https://github.com/CupOfBread/Itsuki-Song-List)

## 简介

在线检索歌曲名，记录主播歌曲库的一站式平台。

小紫才没有摸鱼的哔哩哔哩主页：https://space.bilibili.com/237140787

## 基于

Vue3 + Typescript + Vite

## 快速开始

### 生成歌单 JSON 文件

按格式填写 [song_list.example.json](./src/assets/json/song_list.example.json)，并重命名为 `song_list.json`

或者填写 [song_list.example.csv](./scripts/song_list.example.csv)，以 `UTF-8 BOM` 编码保存并重命名为 `song_list.csv`，运行 ```python3 scripts/convert_csv_to_json.py```

### 开发

```shell
yarn install
yarn dev
```

## 在线浏览

https://zisong.plustech.plus

## 协议

项目使用GPL-3.0为基础的开源协议

## 相关仓库

[Itsuki-Song-List](https://github.com/CupOfBread/Itsuki-Song-List)

[song-list-of-nanakaie](https://github.com/alan314m/song-list-of-nanakaie)

## 授权信息

本项目所用小紫形象素材版权均属于[小紫才没有摸鱼](https://space.bilibili.com/237140787)，已获使用授权，不可二次授权。

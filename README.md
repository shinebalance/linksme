## linksme

リンク集の静的サイト（Vue 3 + Vite）。

### content/feature.md（注目コンテンツ）

トップに表示する埋め込み枠を定義するファイル。1エントリにつき以下のキーを記述する。

- `summary`（必須）: カード上部に出すラベル
- `title`（必須）: 曲・記事のタイトル
- `embed`（必須）: 埋め込み用 iframe の https URL
- `source`（任意）: 元サイトへのリンク（右上の ↗ に反映）

複数エントリを掲載したい場合は、`---` のみの行で区切って追記する。区切りが無ければ従来どおり1件のみとして扱われる。

```
summary: Featured Song
title: shineloops - 26時 花響琴SV2
embed: https://www.youtube.com/embed/tEpsNEAwPNA?si=RAuPTnK5xRsk4Fo1
source: https://youtu.be/tEpsNEAwPNA?si=RAuPTnK5xRsk4Fo1
---
summary: Featured Song
title: shineloops - 新曲タイトル
embed: https://embed.nicovideo.jp/watch/sm12345678
source: https://www.nicovideo.jp/watch/sm12345678
```

niconico を埋め込む場合は `embed.nicovideo.jp/watch/smXXXXX` 形式の https URL を指定する。

### アイコン（src/assets/icons/light, dark）

各サービスのブランドロゴは [Simple Icons](https://simpleicons.org/)（CC0）由来のSVGパスを使用。各ロゴの商標は各社に帰属する。`hatenablog` と `sizume` は Simple Icons に該当エントリが無いため、文字ベースのフォールバックアイコンとした。`amazonmusic` も同様に該当エントリが無いため、ブランドカラー（#25D1DA）のタイルに文字とスマイルを描いた独自アイコンとしている。

### public/ogp.png（OGP画像）

OGP/Twitter Card 用の画像は `assets/ogp-source.svg`（1200×630）を元に生成した PNG。SVG を編集したら、Chromium で 1200×630 のスクリーンショットを撮って `public/ogp.png` を再生成する（`npx playwright install` 不要、既存の Chromium をスクリプトから起動すればよい）。

# Selector Rules (Stable)

- 可能なら data-testid を優先
- 無い場合は role/name ベース（getByRole）を優先
- CSSセレクタ直書きは最終手段

UI側で data-testid を追加する場合は:

- 既存コンポーネントに閉じ込める
- テストのためだけに大規模改修しない

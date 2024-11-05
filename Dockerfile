# ベースイメージとしてNode.jsを使用
FROM node:18 AS builder

# 作業ディレクトリの設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションファイルをコピー
COPY . .

# アプリケーションのビルド
RUN npm run build

# 本番用の軽量イメージを使用して、アプリケーションを実行
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]

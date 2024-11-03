# Node.jsの公式イメージをベースにする
FROM node:18

# 作業ディレクトリを指定
WORKDIR /usr/src/app

# 依存関係をインストールするためのファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションのビルド
RUN npm run build

# 必要なポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]

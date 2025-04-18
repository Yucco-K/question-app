# API 仕様書

## 共通仕様

### ベース URL

```
https://api.question-app.com/api/v1
```

### リクエストヘッダー

```
Content-Type: application/json
Authorization: Bearer {access_token}
```

### レスポンス形式

```json
{
  "status": "success",
  "data": {
    "example": "value"
  },
  "message": "説明メッセージ（エラー時は必須）"
}
```

### エラーレスポンス

```json
{
  "status": "error",
  "message": "エラーメッセージ",
  "errors": [
    {
      "field": "エラーが発生したフィールド",
      "message": "詳細なエラーメッセージ"
    }
  ]
}
```

## 認証・ユーザー管理 API

### ユーザー登録

```
POST /auth/signup
```

**リクエスト**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**レスポンス**

```json
{
  "status": "success",
  "data": {
    "userId": "uuid",
    "username": "string",
    "email": "string",
    "createdAt": "timestamp"
  }
}
```

### ログイン

```
POST /auth/login
```

**リクエスト**

```json
{
  "email": "string",
  "password": "string"
}
```

**レスポンス**

```json
{
  "status": "success",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string"
    }
  }
}
```

### パスワードリセット要求

```
POST /auth/password-reset
```

**リクエスト**

```json
{
  "email": "string"
}
```

## 質問管理 API

### 質問投稿

```
POST /questions
```

**リクエスト**

```json
{
  "title": "string",
  "description": "string",
  "categoryId": "uuid",
  "tags": ["uuid"],
  "isDraft": true
}
```

**レスポンス**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "userId": "uuid",
    "categoryId": "uuid",
    "tags": [
      {
        "id": "uuid",
        "name": "string"
      }
    ],
    "createdAt": "timestamp"
  }
}
```

### 質問一覧取得

```
GET /questions
```

**クエリパラメータ**

```
page=1&limit=10&category=uuid&tag=uuid&status=resolved&sort=newest
```

**レスポンス**

```json
{
  "status": "success",
  "data": {
    "questions": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "user": {
          "id": "uuid",
          "username": "string"
        },
        "category": {
          "id": "uuid",
          "name": "string"
        },
        "tags": [
          {
            "id": "uuid",
            "name": "string"
          }
        ],
        "answersCount": 0,
        "createdAt": "timestamp"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100
    }
  }
}
```

## 回答管理 API

### 回答投稿

```
POST /questions/{questionId}/answers
```

**リクエスト**

```json
{
  "content": "string"
}
```

**レスポンス**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "content": "string",
    "questionId": "uuid",
    "userId": "uuid",
    "createdAt": "timestamp"
  }
}
```

### ベストアンサー選択

```
PUT /questions/{questionId}/best-answer/{answerId}
```

**レスポンス**

```json
{
  "status": "success",
  "data": {
    "questionId": "uuid",
    "bestAnswerId": "uuid",
    "updatedAt": "timestamp"
  }
}
```

## インタラクション API

### 投票

```
POST /answers/{answerId}/votes
```

**リクエスト**

```json
{
  "type": "upvote"
}
```

または

```json
{
  "type": "downvote"
}
```

### ブックマーク

```
POST /questions/{questionId}/bookmarks
```

**レスポンス**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "questionId": "uuid",
    "userId": "uuid",
    "createdAt": "timestamp"
  }
}
```

## 検索 API

### 質問検索

```
GET /search/questions
```

**クエリパラメータ**

```
q=keyword&category=uuid&tags=uuid&status=unresolved&page=1&limit=10&sort=relevance
```

**レスポンス**

```json
{
  "status": "success",
  "data": {
    "questions": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "user": {
          "id": "uuid",
          "username": "string"
        },
        "category": {
          "id": "uuid",
          "name": "string"
        },
        "tags": [
          {
            "id": "uuid",
            "name": "string"
          }
        ],
        "relevanceScore": 0.95,
        "createdAt": "timestamp"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50
    }
  }
}
```

## レート制限

- 認証済みユーザー: 100 リクエスト/分
- 未認証ユーザー: 20 リクエスト/分

## ステータスコード

- 200: リクエスト成功
- 201: リソース作成成功
- 400: 不正なリクエスト
- 401: 認証エラー
- 403: 権限エラー
- 404: リソースが見つからない
- 429: レート制限超過
- 500: サーバーエラー

## バージョニング

API のバージョンは、URL のパスに含まれます（例：`/api/v1/`）。


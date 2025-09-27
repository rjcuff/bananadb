# 🍌 BananaDB

A lightweight, zero-config **mock database & REST API server**.  
Think **json-server**, but with a fresh peel 🍌  

Spin up a fake API in seconds for **prototyping, testing, demos, or hackathons** — no setup, no hassle.  

---

## 🚀 Quick Start

Install and run directly with `npx` (no install needed):

```bash
npx bananadb --db db.json --port 4000
```

👉 Alias:  
```bash
npx bananadb --watch db.json
```
(for json-server muscle memory)

---

## 📂 Example `db.json`

```json
{
  "posts": [
    { "id": 1, "title": "Hello Banana", "author": "Ryan" },
    { "id": 2, "title": "BananaDB Rocks", "author": "Luke" }
  ],
  "comments": [
    { "id": 1, "postId": 1, "body": "Great post!" }
  ]
}
```

---

## 🔌 Endpoints

BananaDB automatically generates **full CRUD endpoints** for every collection (top-level array in your JSON).

For the `posts` collection:

```
GET     /posts
GET     /posts/:id
POST    /posts
PATCH   /posts/:id
DELETE  /posts/:id
```

For the `comments` collection:

```
GET     /comments
GET     /comments/:id
POST    /comments
PATCH   /comments/:id
DELETE  /comments/:id
```

---

## 🛠 Examples

### Get all posts
```bash
curl http://localhost:4000/posts
```

### Get one post
```bash
curl http://localhost:4000/posts/1
```

### Create a new post
```bash
curl -X POST http://localhost:4000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Banana Peel Tricks","author":"Ryan"}'
```

### Update a post
```bash
curl -X PATCH http://localhost:4000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"author":"Ryan C."}'
```

### Delete a post
```bash
curl -X DELETE http://localhost:4000/posts/2
```

---

## ✨ Features

- 🍌 **Zero config** → just point at a JSON file  
- 🔌 **Full REST API** from your data  
- 🛠 **CRUD ready** (Create, Read, Update, Delete)  
- 🔄 **Live reload** → updates when `db.json` changes  
- 🎨 **Smart IDs** → auto-increment numbers or random strings with `nanoid`  
- 🌍 **CORS enabled** → works instantly with front-end apps  
- ⚡ **Lightweight** → tiny footprint, instant startup  

---

## 💡 Why BananaDB?

Perfect for:
- Prototyping front-end apps without a backend  
- Mocking APIs for design systems & UI libraries  
- Testing integrations before wiring up real data  
- Running quick demos or hackathon projects  

---

## 📜 License

MIT © 2025 Ryan Cuff

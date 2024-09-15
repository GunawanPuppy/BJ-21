# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

**Note**:
# ketika mau buat feature baru
1. bikin branche dengan nama feature dengan perintah:
    ```txt
    git checkout -b <nama feature>
    ```
2. setelah selesai feature-nya jalankan:
    ```txt
    git add .
    git commit -m ""
    git push origin <nama feature>
    ```
3. masuk ke dev dengan perintah:
    ```txt
    git checkout dev
    ```
4. run perintah berikut:
    ```txt
    git pull
    ```
5. run perintah berikut:
    ```txt
    git merge --no-ff <nama feature>
    ```
6. check github barangkali belum ke-merge
7. git pull

**kalau ada konflik code hubungi admin**

```json
{
  "createdBy": "alexveros46@gmail.com",
  "currentPlayerIndex": 0,
  "playerCount": 2,
  "playerOrder": ["alexveros46@gmail.com", "formeandall8@gmail.com"],
  "players": {
    "alexveros46@gmail.com": {
      "displayName": "Alex Veros",
      "email": "alexveros46@gmail.com",
      "joinedAt": "2024-06-20T23:39:58Z",
      "status": "",
      "points": 10,
      "takenCards": ["2vvauNRbNqzXys0B9irL"]
    },
    "formeandall8@gmail.com": {
      "displayName": "forme andall",
      "email": "formeandall8@gmail.com",
      "joinedAt": "2024-06-20T23:40:06Z",
      "status": "",
      "points": 10,
      "takenCards": ["2Q8xXjsntuycNYhBGsNF", "2vvauNRbNqzXys0B9irL"]
    }
  },
  "totalPoints": 20,
  "takenCards": ["2vvauNRbNqzXys0B9irL", "2Q8xXjsntuycNYhBGsNF"]
}


```
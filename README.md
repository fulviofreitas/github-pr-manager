# ✅ PR Manager

> 🚀 **Approve, label, and merge GitHub Pull Requests** with a sleek, modern web interface. No installation required!

![GitHub](https://img.shields.io/badge/GitHub-PRs-blue?logo=github)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Bulk Approval** | Approve multiple PRs at once across multiple repositories |
| 🏷️ **Label Management** | Add, edit, recolor, rename, or delete labels — per PR or repo-wide |
| 🔎 **Label Filtering** | Filter the PR list by one or more labels (any-of) |
| ⤴️ **Merge PRs** | Merge with `merge`, `squash`, or `rebase` — with mergeability gating |
| 🚦 **Blocker Insights** | Surfaces conflicts, failing checks, branch protection, draft state |
| 🔐 **Flexible Auth** | Support for Personal Access Tokens & GitHub Apps |
| 📱 **Responsive UI** | Modern dark theme with mobile-friendly design |
| ⚡ **No Install** | Single HTML file - just open in your browser |

---

## 🚀 Quick Start

### Option 1: Direct Use

```bash
# Clone the repository
git clone git@github.com:fulviofreitas/github-pr-manager.git

# Open in browser
open github-pr-manager/index.html
```

That's it! 🎉

<details>
<summary>🖥️ Option 2: Local Server</summary>

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

</details>

---

## 📖 How to Use

### 1️⃣ Enter Repository
Paste your GitHub repository URL or use the `owner/repo` format:
```
owner/repo
https://github.com/owner/repo
```

💡 **Pro Tip:** Add multiple repositories (one per line or comma-separated) to manage PRs across projects!

### 2️⃣ Browse Pull Requests
- PRs are fetched automatically (no login needed for viewing)
- See approval status, labels, and metadata at a glance
- Use filters to focus on PRs that need attention:
  - ⏳ **Missing Approval** - PRs awaiting review
  - 🏷️ **needs-review** - PRs with the needs-review label
  - 🏷️ **Labels** - Filter by any label across the loaded PRs (any-of)

### 3️⃣ Approve, Label, or Merge
- **Approve in bulk:** check PRs, click **"Approve Selected"**, optionally remove `needs-review`
- **Edit labels (per PR):** click 🏷️ on a row to toggle existing repo labels or create a new one
- **Manage labels (repo-wide):** click ⚙️ **Manage Labels** to rename, recolor, or delete labels
- **Merge a PR:** click ⤴️ on a row — pick a strategy (`merge` / `squash` / `rebase`), see mergeability state, conflicts, or branch-protection blockers before confirming
- All write actions need authentication:
   - 🔑 **Personal Access Token** (PAT) with `repo` scope
   - 🤖 **GitHub App** with required permissions

### 4️⃣ Done! ✅
PRs reflect their new state immediately — merged PRs leave the open list, label changes update inline.

---

## 🔐 Authentication

### Personal Access Token (Recommended for personal use)

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new?scopes=repo)
2. Generate a token with `repo` scope (covers approve, label, and merge)
3. Paste it in the auth config or approval modal

### GitHub App (Recommended for teams/organizations)

Required permissions:
- `Pull requests: Write` — to approve and merge PRs
- `Issues: Write` — to add, remove, and manage labels
- `Contents: Read` — to read repository merge-strategy settings

[📚 Learn more about creating GitHub Apps](https://docs.github.com/en/apps/creating-github-apps)

---

## 🎨 Screenshots

| Welcome Screen | PR List View | Approval Modal |
|:--------------:|:------------:|:--------------:|
| <img width="300" alt="Welcome Screen" src="https://github.com/user-attachments/assets/e8e46b9d-165e-4ba2-93f3-c5afe71c2f18" /> | <img width="300" alt="PR List View" src="https://github.com/user-attachments/assets/6760edfb-83fe-4b78-aa86-84eabbf646f0" /> | <img width="300" alt="Approval Modal" src="https://github.com/user-attachments/assets/50d404ea-a8a9-40de-bf20-82bbd06a225b" /> |
| The clean welcome screen guides you through the process | Browse all open PRs with compact or expanded views | Approve multiple PRs with custom comments and label management |

---

## 🛠️ Tech Stack

- ⚛️ **React 18** - UI library
- 🎨 **CSS Variables** - Dark theme with customizable colors
- 🔒 **jsrsasign** - JWT generation for GitHub App auth
- 📡 **GitHub REST API** - PR review, labels, and merge endpoints

---

## 🧪 Tests

Tests run with the Node built-in test runner — no browser required.

```bash
npm ci
npm test
```

The CI workflow (`.github/workflows/ci.yml`) runs on every push and pull request.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

---

## 📄 License

MIT License - feel free to use this tool in your projects!

---

<p align="center">
  Made with ❤️ for developers who review lots of PRs
</p>

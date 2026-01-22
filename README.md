# ✅ PR Approver

> 🚀 **Bulk approve GitHub Pull Requests** with a sleek, modern web interface. No installation required!

![GitHub](https://img.shields.io/badge/GitHub-PRs-blue?logo=github)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Bulk Approval** | Approve multiple PRs at once across multiple repositories |
| 🏷️ **Label Management** | Automatically remove `needs-review` labels after approval |
| 🔍 **Smart Filtering** | Filter PRs by approval status or labels |
| 🔐 **Flexible Auth** | Support for Personal Access Tokens & GitHub Apps |
| 📱 **Responsive UI** | Modern dark theme with mobile-friendly design |
| ⚡ **No Install** | Single HTML file - just open in your browser |

---

## 🚀 Quick Start

### Option 1: Direct Use

```bash
# Clone the repository
git clone git@github.com:fulviofreitas/github-pr-approver.git

# Open in browser
open github-pr-approver/index.html
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

### 3️⃣ Select & Approve
1. Check the PRs you want to approve
2. Click **"Approve Selected"**
3. Enter your authentication:
   - 🔑 **Personal Access Token** (PAT) with `repo` scope
   - 🤖 **GitHub App** with required permissions

### 4️⃣ Done! ✅
Your PRs are approved and labels are optionally removed.

---

## 🔐 Authentication

### Personal Access Token (Recommended for personal use)

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new?scopes=repo)
2. Generate a token with `repo` scope
3. Paste it in the approval modal

### GitHub App (Recommended for teams/organizations)

Required permissions:
- `Pull requests: Write` — to approve PRs
- `Issues: Write` — to remove labels

[📚 Learn more about creating GitHub Apps](https://docs.github.com/en/apps/creating-github-apps)

---

## 🎨 Screenshots

<details>
<summary>📸 Click to view</summary>

### Welcome Screen
The clean welcome screen guides you through the process.
<img width="936" height="686" alt="image" src="https://github.com/user-attachments/assets/e8e46b9d-165e-4ba2-93f3-c5afe71c2f18" />


### PR List View
Browse all open PRs with compact or expanded views.
<img width="937" height="747" alt="image" src="https://github.com/user-attachments/assets/6760edfb-83fe-4b78-aa86-84eabbf646f0" />


### Approval Modal
Approve multiple PRs with custom comments and label management.
<img width="923" height="941" alt="image" src="https://github.com/user-attachments/assets/50d404ea-a8a9-40de-bf20-82bbd06a225b" />


</details>

---

## 🛠️ Tech Stack

- ⚛️ **React 18** - UI library
- 🎨 **CSS Variables** - Dark theme with customizable colors
- 🔒 **jsrsasign** - JWT generation for GitHub App auth
- 📡 **GitHub REST API** - PR and label management

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

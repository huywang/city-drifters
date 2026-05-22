# 都市浮生记 - 发布到 GitHub Pages

## 步骤 1: 认证 GitHub CLI

打开终端，运行：
```bash
"/c/Program Files/GitHub CLI/gh.exe" auth login
```

按提示选择：
- GitHub.com
- HTTPS
- 用浏览器登录

## 步骤 2: 创建仓库并发布

认证完成后，运行：
```bash
cd /c/workspace/my/myworld/shenzhougame
git init
git add .
git commit -m "Initial commit: 都市浮生记游戏"
"/c/Program Files/GitHub CLI/gh.exe" repo create city-drifters --public --source=. --push
"/c/Program Files/GitHub CLI/gh.exe" repo edit --enable-pages
git push origin main
```

## 步骤 3: 配置 GitHub Pages

1. 访问你的仓库：`https://github.com/你的用户名/city-drifters/settings/pages`
2. Source 选择：`Deploy from a branch`
3. Branch 选择：`main`，文件夹选择 `/ (root)`
4. 点击 Save

等待 1-2 分钟，访问：
```
https://你的用户名.github.io/city-drifters/
```

## 游戏访问链接

发布完成后，你的游戏将通过以下链接访问：
- **https://[你的GitHub用户名].github.io/city-drifters/**

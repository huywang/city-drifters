#!/bin/bash
# 都市浮生记 - GitHub Pages 部署脚本

echo "🏙️ 都市浮生记 - GitHub Pages 部署"
echo "======================================"
echo ""

# 检查 gh 是否已认证
echo "检查 GitHub 认证状态..."
"/c/Program Files/GitHub CLI/gh.exe" auth status > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ 未认证 GitHub CLI"
    echo ""
    echo "请先运行以下命令登录："
    echo '  "/c/Program Files/GitHub CLI/gh.exe" auth login'
    echo ""
    echo "登录选项："
    echo "  - 选择 GitHub.com"
    echo "  - 选择 HTTPS"
    echo "  - 用浏览器完成认证"
    echo ""
    exit 1
fi

echo "✅ GitHub 已认证"
echo ""

# 获取 GitHub 用户名
USERNAME=$("/c/Program Files/GitHub CLI/gh.exe" api user -q .login)
echo "👤 GitHub 用户: $USERNAME"
echo ""

# 检查仓库是否已创建
echo "检查仓库状态..."
"/c/Program Files/GitHub CLI/gh.exe" repo view "$USERNAME/city-drifters" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "📦 创建 GitHub 仓库..."
    git add README.md DEPLOY.md deploy.sh
    git commit -m "docs: add README and deployment files" > /dev/null 2>&1
    "/c/Program Files/GitHub CLI/gh.exe" repo create city-drifters --public --source=. --push
    if [ $? -ne 0 ]; then
        echo "❌ 创建仓库失败"
        exit 1
    fi
    echo "✅ 仓库已创建并推送"
else
    echo "✅ 仓库已存在"
    echo "📤 推送代码..."
    git add .
    git diff --staged --quiet || git commit -m "update game files"
    git push origin master
fi

echo ""
echo "⚙️ 配置 GitHub Pages..."
"/c/Program Files/GitHub CLI/gh.exe" api repos/$USERNAME/city-drifters/pages \
    -X POST \
    -f build_type=legacy \
    -f source='{"branch":"master","path":"/"}' > /dev/null 2>&1

if [ $? -ne 0 ]; then
    # Pages 可能已经配置
    "/c/Program Files/GitHub CLI/gh.exe" api repos/$USERNAME/city-drifters/pages \
        -X PUT \
        -f build_type=legacy \
        -f source='{"branch":"master","path":"/"}' > /dev/null 2>&1
fi

echo ""
echo "======================================"
echo "🎉 部署完成！"
echo ""
echo "🌐 游戏地址（等待1-2分钟后访问）："
echo "   https://$USERNAME.github.io/city-drifters/"
echo ""
echo "📊 查看部署状态："
echo "   https://github.com/$USERNAME/city-drifters/settings/pages"
echo "======================================"

if ! yarn -h > /dev/null 2>&1; then
    echo "===="
    echo "==== Installing Yarn globally ===="
    echo "===="
    npm install -g yarn
fi

touch yarn.lock
corepack enable
yarn install
yarn dlx @yarnpkg/sdks vscode
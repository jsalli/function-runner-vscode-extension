if ! pnpm help > /dev/null 2>&1; then
    echo "===="
    echo "==== Installing PNPM globally ===="
    echo "===="
    npm install -g pnpm
fi

pnpm i
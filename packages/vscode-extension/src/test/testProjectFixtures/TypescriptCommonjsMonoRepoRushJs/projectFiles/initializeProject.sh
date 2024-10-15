if ! rush -h > /dev/null 2>&1; then
    echo "===="
    echo "==== Installing RUSH JS globally ===="
    echo "===="
    npm install -g @microsoft/rush
fi

rush update
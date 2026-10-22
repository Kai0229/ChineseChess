#!/bin/zsh
cd "${0:A:h}"
if command -v node >/dev/null 2>&1; then
  node serve.cjs
elif [[ -x '/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node' ]]; then
  '/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node' serve.cjs
else
  open dist/index.html
fi

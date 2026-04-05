#!/bin/sh
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export NODE="/usr/local/bin/node"
cd /Users/leleco/Projetos/banco-de-ideias
exec /usr/local/bin/node node_modules/next/dist/bin/next dev --webpack

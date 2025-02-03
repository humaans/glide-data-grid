#!/bin/bash
set -em
source ../../config/build-util.sh

ensure_bash_4

shopt -s globstar

compile_esm() {
    tsc -p tsconfig.esm.json
    linaria -r dist/esm/ -m esnext -o dist/esm/ dist/esm/**/*.js -t -i dist/esm -c ../../config/linaria.json
    remove_all_css_imports dist/esm
}

run_in_parallel compile_esm

generate_index_css

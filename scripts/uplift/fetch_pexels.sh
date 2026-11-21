#!/usr/bin/env bash
# Download a Pexels photo cropped to 1200x800 into img/stock/<name>.jpg
# Usage: scripts/uplift/fetch_pexels.sh <pexels-photo-id> <name>
set -e
curl -s -L -A "Mozilla/5.0" -o "img/stock/$2.jpg" "https://images.pexels.com/photos/$1/pexels-photo-$1.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=800"

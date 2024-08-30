#!/bin/bash

npm stop

# Get latest
git pull

export NODE_OPTIONS=--max-old-space-size=1024

nohup npm start
echo "React app started with nohup."

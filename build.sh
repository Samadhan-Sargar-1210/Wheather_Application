#!/bin/bash

# Clean install dependencies
npm ci --legacy-peer-deps

# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
    exit 0
else
    echo "Build failed!"
    exit 1
fi 
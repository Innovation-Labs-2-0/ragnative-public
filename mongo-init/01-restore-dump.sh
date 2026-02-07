#!/bin/bash
# mongo-init/01-restore-dump.sh

# This script runs only when MongoDB is initialized for the first time
# It will restore from dump if dump files are available

echo "Checking for database dump files..."
your_database_name="rag_platform_dev"

# Check if dump directory exists and has files
if [ -d "/dumps" ] && [ "$(ls -A /dumps)" ]; then
    echo "Found dump files. Restoring database..."
    
    # Wait for MongoDB to be ready
    until mongosh --eval "print('MongoDB is ready')" >/dev/null 2>&1; do
        echo "Waiting for MongoDB to start..."
        sleep 2
    done
    
    # Restore from dump files
    # If you have a specific dump file (e.g., dump.gz)
    if [ -f "/dumps/dump.gz" ]; then
        echo "Restoring from compressed dump..."
        mongorestore --gzip --archive=/dumps/dump.gz --drop
    # If you have a directory dump
    elif [ -d "/dumps/$your_database_name" ]; then
        echo "Restoring from directory dump..."
        mongorestore --db $your_database_name --drop /dumps/$your_database_name/
    # If you have individual BSON files
    elif [ -f "/dumps/collection.bson" ]; then
        echo "Restoring individual collections..."
        for bson_file in /dumps/*.bson; do
            collection_name=$(basename "$bson_file" .bson)
            mongorestore --db your_database_name --collection "$collection_name" "$bson_file"
        done
    else
        echo "No recognizable dump format found"
    fi
    
    echo "Database restoration completed"
else
    echo "No dump files found. Starting with empty database..."
fi

echo "MongoDB initialization script completed"

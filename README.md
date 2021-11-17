Running the project

```sh
# Compile the client
cd client && npm run build && cd ..

# Start the server
npm run prod
```

Using docker in production:
```sh
docker build -t youtube-downloader .
docker run -d \
    -e PORT=3000 \
    -e DOWNLOAD_PATH=/downloads \
    -p 3000:3000 \
    -v /Users/pablo/Music:/downloads \
    youtube-downloader
```
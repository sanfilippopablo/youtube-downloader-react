FROM node:16

WORKDIR /app

RUN apt update && apt install -y \
    python3 \
    python3-pip \
    ffmpeg

RUN pip3 install -U youtube-dl

COPY client client

RUN cd client && npm i && npm run build

COPY server server

RUN cd server && npm i

CMD cd server && npm run prod
FROM node:20-slim AS client-build

WORKDIR /app

COPY client .
RUN npm ci
RUN npm run build


FROM rust:slim AS server-build

WORKDIR /app

COPY Cargo.toml .
COPY Cargo.lock .
COPY src src
COPY --from=client-build /app/dist client/dist
RUN apt update && apt install -y pkg-config openssl libssl-dev
RUN cargo build --release

FROM debian:12

WORKDIR /app
RUN apt update && apt install -y openssl libssl-dev ca-certificates
COPY --from=server-build /app/target/release/youtube-downloader /app/youtube-downloader

CMD ["/app/youtube-downloader"]
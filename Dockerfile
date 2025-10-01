FROM node:22.19.0-slim AS base
RUN (type -p wget > /dev/null || (apt update && apt install wget -y)) \
  && mkdir -p -m 755 /etc/apt/keyrings \
  && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  && cat $out | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && mkdir -p -m 755 /etc/apt/sources.list.d \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && apt update \
  && apt install -y ca-certificates openssl procps git gh nano

USER node
WORKDIR /redisqs

COPY package.json .
COPY package-lock.json .
RUN mkdir -p node_modules && chown node:node node_modules && npm ci --include=dev

COPY .gitignore .
COPY .prettierignore .
COPY .prettierrc.json .
COPY .swcrc .
COPY eslint.config.mjs .
COPY jest.config.json .
COPY tsconfig.json .
COPY src .
COPY testing .

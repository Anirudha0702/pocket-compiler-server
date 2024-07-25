FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN npm i

FROM builder as production-build
RUN npm run build
RUN npm prune --production


FROM node:20-alpine as production
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    gcc \
    g++ \
    openjdk17-jdk
RUN java -version && javac -version && gcc --version && g++ --version && python3 --version
RUN java -version && javac -version && gcc --version && g++ --version && python3 --version
COPY --chown=node:node --from=production-build /app/dist /app/dist
COPY --chown=node:node --from=production-build /app/node_modules /app/node_modules 
ENV NODE_ENV=production
WORKDIR /app/dist

ENTRYPOINT [ "node", "main.js"]
RUN mkdir -p /app/dist/temp && chown -R node:node /app/dist/temp

CMD [ "node","main.js" ]
USER node




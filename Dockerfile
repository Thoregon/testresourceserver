# podman build -t thoregon/thoregon:0.1  https://github.com/Thoregon/Puls.Container.git
# docker run -i -t localhost/thoregon/thoregon:0.1
FROM node:18-alpine
RUN apk add dumb-init
ENV NODE_ENV production
# RUN addgroup --g 1000 thoregon
# RUN adduser -u 1000 --ingroup thoregon --no-create-home thoregon
WORKDIR /resources
#COPY --chown=thoregon:thoregon . .
COPY . .
# RUN npm ci --only=production
# USER thoregon
CMD ["dumb-init", "node", "index.mjs" ]

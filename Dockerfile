FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build

FROM build as production
WORKDIR /app

COPY package*.json .

ENV NODE_ENV=production
RUN npm ci

COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

CMD ["npm", "run", "start"]

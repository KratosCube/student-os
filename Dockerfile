FROM node:20-alpine

WORKDIR /app

# Instalace závislostí pro systém (OpenSSL pro Prismu)
RUN apk add --no-cache openssl libc6-compat

# Instalace balíčků
COPY package*.json ./
RUN npm install

# Kopírování kódu
COPY . .

# Generování Prisma klienta
RUN npx prisma generate

# 👇 PŘIDEJ TENTO ŘÁDEK (Falešná URL, aby build nespadl na validaci)
ENV DATABASE_URL="file:./dev.db"

# Build aplikace
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
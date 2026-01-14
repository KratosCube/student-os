FROM node:20-alpine

WORKDIR /app

# TOTO JE TA OPRAVA: Nainstalujeme OpenSSL a kompatibilní knihovny
RUN apk add --no-cache openssl libc6-compat

# 1. Zkopírujeme definice závislostí
COPY package*.json ./

# 2. Nainstalujeme balíčky
RUN npm install

# 3. Teď zkopírujeme ZBYTEK projektu
COPY . .

# 4. Vygenerujeme Prisma klienta
RUN npx prisma generate

# 5. Sestavíme aplikaci
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
FROM node:22.14.0-alpine

WORKDIR /app

# Copy dependency manifest dan install dependency
COPY package*.json ./
RUN npm install

# Copy seluruh source code
COPY . .

# Generate Prisma Client (supaya bisa dipakai saat build)
RUN npx prisma generate
COPY ./generated ./dist/generated

# Build TypeScript ke JavaScript (dist/)
RUN npm run build

EXPOSE 3000

# Jalankan migration otomatis dan start server
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]

// src/app.ts
import express2 from "express";
import cors from "cors";

// src/modules/product/product.router.ts
import express from "express";

// src/utils/app-error.ts
var AppError = class _AppError extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, _AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/modules/product/product.service.ts
import slugify from "slugify";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// Product model\n\nmodel Product {\n  id              String         @id @default(cuid())\n  sku             String?        @unique\n  name            String         @default("")\n  description     String?\n  price           Decimal        @default(0) @db.Decimal(10, 2)\n  isPublished     Boolean        @default(true)\n  buyingPrice     Decimal?       @db.Decimal(10, 2)\n  discount        Decimal?       @db.Decimal(5, 2)\n  discountPrice   Decimal?       @db.Decimal(10, 2)\n  inStock         Boolean        @default(true)\n  stockQuantity   Int            @default(0)\n  categoryId      String?\n  category        Category?      @relation(fields: [categoryId], references: [id], onDelete: SetNull)\n  images          ProductImage[]\n  seo             ProductSEO?\n  reviews         Review[]\n  orderItems      OrderItem[]\n  cartItems       CartItem[]\n  wishlistItems   WishlistItem[]\n  pageViews       PageView[] // Added this relation\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @updatedAt\n  metaTitle       String?\n  metaDescription String?\n  metaKeywords    String?\n\n  @@map("products")\n}\n\n// Product Images\n\nmodel ProductImage {\n  id        String   @id @default(cuid())\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  imageUrl  String\n  altText   String?\n  isPrimary Boolean  @default(false)\n  order     Int      @default(0)\n  createdAt DateTime @default(now())\n\n  @@map("product_images")\n}\n\n// Product SEO\n\nmodel ProductSEO {\n  id              String   @id @default(cuid())\n  productId       String   @unique\n  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  metaTitle       String?\n  metaDescription String?\n  metaKeywords    String?\n  slug            String?  @unique\n  updatedAt       DateTime @updatedAt\n\n  @@map("product_seo")\n}\n\n// Category model\n\nmodel Category {\n  id              String     @id @default(cuid())\n  name            String\n  description     String?\n  slug            String?    @unique\n  image           String?\n  parentId        String?\n  parent          Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])\n  children        Category[] @relation("CategoryHierarchy")\n  products        Product[]\n  pageViews       PageView[] // Added this relation\n  createdAt       DateTime   @default(now())\n  updatedAt       DateTime   @updatedAt\n  metaTitle       String?\n  metaDescription String?\n  metaKeywords    String?\n\n  @@map("categories")\n}\n\n// Order model\n\nmodel Order {\n  id              String        @id @default(cuid())\n  userId          String\n  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  orderNumber     String        @unique\n  status          OrderStatus   @default(PENDING)\n  totalAmount     Decimal       @db.Decimal(10, 2)\n  subtotal        Decimal       @db.Decimal(10, 2)\n  tax             Decimal?      @db.Decimal(10, 2)\n  shippingCost    Decimal?      @db.Decimal(10, 2)\n  discountTotal   Decimal?      @db.Decimal(10, 2)\n  isDelivered     Boolean       @default(false)\n  deliveredAt     DateTime?\n  shippingAddress Json\n  billingAddress  Json?\n  paymentMethod   String?\n  paymentStatus   PaymentStatus @default(PENDING)\n  notes           String?\n  invoiceNumber   String?       @unique\n  items           OrderItem[]\n  invoice         Invoice? // Added this relation\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n\n  @@map("orders")\n}\n\nenum OrderStatus {\n  PENDING\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n}\n\n// Order Items\n\nmodel OrderItem {\n  id        String   @id @default(cuid())\n  orderId   String\n  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)\n  quantity  Int\n  price     Decimal  @db.Decimal(10, 2)\n  discount  Decimal? @db.Decimal(5, 2)\n  total     Decimal  @db.Decimal(10, 2)\n  createdAt DateTime @default(now())\n\n  @@map("order_items")\n}\n\n// Cart\n\nmodel CartItem {\n  id        String   @id @default(cuid())\n  userId    String\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  quantity  Int      @default(1)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, productId])\n  @@map("cart_items")\n}\n\n// Wishlist\n\nmodel WishlistItem {\n  id        String   @id @default(cuid())\n  userId    String\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n\n  @@unique([userId, productId])\n  @@map("wishlist_items")\n}\n\n// Review and Rating\n\nmodel Review {\n  id        String        @id @default(cuid())\n  userId    String\n  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  productId String\n  product   Product       @relation(fields: [productId], references: [id], onDelete: Cascade)\n  rating    Int\n  title     String?\n  comment   String?\n  status    ReviewStatus  @default(PENDING)\n  reply     String?\n  images    ReviewImage[]\n  likes     ReviewLike[]\n  helpful   Int           @default(0)\n  createdAt DateTime      @default(now())\n  updatedAt DateTime      @updatedAt\n\n  @@unique([userId, productId])\n  @@map("reviews")\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  HIDDEN\n  REJECTED\n}\n\n// Review Images\n\nmodel ReviewImage {\n  id        String   @id @default(cuid())\n  reviewId  String\n  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n  imageUrl  String\n  createdAt DateTime @default(now())\n\n  @@map("review_images")\n}\n\n// Review Likes\n\nmodel ReviewLike {\n  id        String   @id @default(cuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  reviewId  String\n  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n\n  @@unique([userId, reviewId])\n  @@map("review_likes")\n}\n\n// Help and Support\n\nmodel HelpRequest {\n  id          String     @id @default(cuid())\n  userId      String?\n  subject     String\n  message     String\n  phoneNumber String?\n  status      HelpStatus @default(OPEN)\n  assignedTo  String?\n  resolvedAt  DateTime?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  @@map("help_requests")\n}\n\nenum HelpStatus {\n  OPEN\n  IN_PROGRESS\n  RESOLVED\n  CLOSED\n}\n\n// Visitor Tracking\n\nmodel Visitor {\n  id         String     @id @default(cuid())\n  sessionId  String\n  ipAddress  String?\n  userAgent  String?\n  referrer   String?\n  visitedAt  DateTime   @default(now())\n  userId     String?\n  deviceType String?\n  browser    String?\n  os         String?\n  pageViews  PageView[]\n\n  @@index([sessionId])\n  @@map("visitors")\n}\n\n// Page Views\n\nmodel PageView {\n  id         String    @id @default(cuid())\n  visitorId  String\n  visitor    Visitor   @relation(fields: [visitorId], references: [id], onDelete: Cascade)\n  pageUrl    String\n  pageTitle  String?\n  productId  String?\n  product    Product?  @relation(fields: [productId], references: [id], onDelete: SetNull)\n  categoryId String?\n  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)\n  referrer   String?\n  timeSpent  Int?\n  createdAt  DateTime  @default(now())\n\n  @@index([visitorId, createdAt])\n  @@map("page_views")\n}\n\n// Settings\n\nmodel Setting {\n  id          String   @id @default(cuid())\n  key         String   @unique\n  value       Json\n  description String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  @@map("settings")\n}\n\n// Invoice\n\nmodel Invoice {\n  id            String    @id @default(cuid())\n  orderId       String    @unique\n  order         Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  invoiceNumber String    @unique\n  pdfUrl        String?\n  sentAt        DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  @@map("invoices")\n}\n\nmodel NotificationOutbox {\n  id            String    @id @default(cuid())\n  orderId       String\n  orderNumber   String\n  channel       String\n  payload       Json\n  status        String    @default("PENDING")\n  attempts      Int       @default(0)\n  nextAttemptAt DateTime  @default(now())\n  lockedUntil   DateTime?\n  lastError     String?   @db.Text\n  sentAt        DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @default(now()) @updatedAt\n\n  @@index([status, nextAttemptAt])\n  @@index([status, lockedUntil])\n  @@index([sentAt])\n  @@map("notification_outbox")\n}\n\nenum UserRole {\n  USER\n  ADMIN\n}\n\nmodel User {\n  id            String       @id\n  name          String\n  email         String\n  emailVerified Boolean      @default(false)\n  image         String?\n  createdAt     DateTime     @default(now())\n  updatedAt     DateTime     @updatedAt\n  role          String?      @default("USER")\n  phone         String?\n  status        String?      @default("ACTIVE")\n  sessions      Session[]\n  accounts      Account[]\n  reviews       Review[]\n  reviewLikes   ReviewLike[]\n  orders        Order[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  issuer                String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sku","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"buyingPrice","kind":"scalar","type":"Decimal"},{"name":"discount","kind":"scalar","type":"Decimal"},{"name":"discountPrice","kind":"scalar","type":"Decimal"},{"name":"inStock","kind":"scalar","type":"Boolean"},{"name":"stockQuantity","kind":"scalar","type":"Int"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductToProductImage"},{"name":"seo","kind":"object","type":"ProductSEO","relationName":"ProductToProductSEO"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProductToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToProduct"},{"name":"wishlistItems","kind":"object","type":"WishlistItem","relationName":"ProductToWishlistItem"},{"name":"pageViews","kind":"object","type":"PageView","relationName":"PageViewToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"}],"dbName":"products"},"ProductImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductImage"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"altText","kind":"scalar","type":"String"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"product_images"},"ProductSEO":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductSEO"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_seo"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"children","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"pageViews","kind":"object","type":"PageView","relationName":"CategoryToPageView"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"}],"dbName":"categories"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"tax","kind":"scalar","type":"Decimal"},{"name":"shippingCost","kind":"scalar","type":"Decimal"},{"name":"discountTotal","kind":"scalar","type":"Decimal"},{"name":"isDelivered","kind":"scalar","type":"Boolean"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"shippingAddress","kind":"scalar","type":"Json"},{"name":"billingAddress","kind":"scalar","type":"Json"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"invoiceNumber","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"invoice","kind":"object","type":"Invoice","relationName":"InvoiceToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"discount","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_items"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"CartItemToProduct"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"cart_items"},"WishlistItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlist_items"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"reply","kind":"scalar","type":"String"},{"name":"images","kind":"object","type":"ReviewImage","relationName":"ReviewToReviewImage"},{"name":"likes","kind":"object","type":"ReviewLike","relationName":"ReviewToReviewLike"},{"name":"helpful","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"ReviewImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToReviewImage"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"review_images"},"ReviewLike":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewLikeToUser"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToReviewLike"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"review_likes"},"HelpRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"HelpStatus"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"resolvedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"help_requests"},"Visitor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"visitedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"deviceType","kind":"scalar","type":"String"},{"name":"browser","kind":"scalar","type":"String"},{"name":"os","kind":"scalar","type":"String"},{"name":"pageViews","kind":"object","type":"PageView","relationName":"PageViewToVisitor"}],"dbName":"visitors"},"PageView":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"visitorId","kind":"scalar","type":"String"},{"name":"visitor","kind":"object","type":"Visitor","relationName":"PageViewToVisitor"},{"name":"pageUrl","kind":"scalar","type":"String"},{"name":"pageTitle","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"PageViewToProduct"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToPageView"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"timeSpent","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"page_views"},"Setting":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"Json"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"settings"},"Invoice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"InvoiceToOrder"},{"name":"invoiceNumber","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"sentAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"invoices"},"NotificationOutbox":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"channel","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"status","kind":"scalar","type":"String"},{"name":"attempts","kind":"scalar","type":"Int"},{"name":"nextAttemptAt","kind":"scalar","type":"DateTime"},{"name":"lockedUntil","kind":"scalar","type":"DateTime"},{"name":"lastError","kind":"scalar","type":"String"},{"name":"sentAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notification_outbox"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"reviewLikes","kind":"object","type":"ReviewLike","relationName":"ReviewLikeToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"issuer","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","parent","orderBy","cursor","children","products","pageViews","_count","visitor","product","category","images","seo","user","sessions","accounts","reviews","review","reviewLikes","order","items","invoice","orders","likes","orderItems","cartItems","wishlistItems","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","data","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","create","update","Product.upsertOne","Product.deleteOne","Product.deleteMany","having","_avg","_sum","_min","_max","Product.groupBy","Product.aggregate","ProductImage.findUnique","ProductImage.findUniqueOrThrow","ProductImage.findFirst","ProductImage.findFirstOrThrow","ProductImage.findMany","ProductImage.createOne","ProductImage.createMany","ProductImage.createManyAndReturn","ProductImage.updateOne","ProductImage.updateMany","ProductImage.updateManyAndReturn","ProductImage.upsertOne","ProductImage.deleteOne","ProductImage.deleteMany","ProductImage.groupBy","ProductImage.aggregate","ProductSEO.findUnique","ProductSEO.findUniqueOrThrow","ProductSEO.findFirst","ProductSEO.findFirstOrThrow","ProductSEO.findMany","ProductSEO.createOne","ProductSEO.createMany","ProductSEO.createManyAndReturn","ProductSEO.updateOne","ProductSEO.updateMany","ProductSEO.updateManyAndReturn","ProductSEO.upsertOne","ProductSEO.deleteOne","ProductSEO.deleteMany","ProductSEO.groupBy","ProductSEO.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","WishlistItem.findUnique","WishlistItem.findUniqueOrThrow","WishlistItem.findFirst","WishlistItem.findFirstOrThrow","WishlistItem.findMany","WishlistItem.createOne","WishlistItem.createMany","WishlistItem.createManyAndReturn","WishlistItem.updateOne","WishlistItem.updateMany","WishlistItem.updateManyAndReturn","WishlistItem.upsertOne","WishlistItem.deleteOne","WishlistItem.deleteMany","WishlistItem.groupBy","WishlistItem.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","ReviewImage.findUnique","ReviewImage.findUniqueOrThrow","ReviewImage.findFirst","ReviewImage.findFirstOrThrow","ReviewImage.findMany","ReviewImage.createOne","ReviewImage.createMany","ReviewImage.createManyAndReturn","ReviewImage.updateOne","ReviewImage.updateMany","ReviewImage.updateManyAndReturn","ReviewImage.upsertOne","ReviewImage.deleteOne","ReviewImage.deleteMany","ReviewImage.groupBy","ReviewImage.aggregate","ReviewLike.findUnique","ReviewLike.findUniqueOrThrow","ReviewLike.findFirst","ReviewLike.findFirstOrThrow","ReviewLike.findMany","ReviewLike.createOne","ReviewLike.createMany","ReviewLike.createManyAndReturn","ReviewLike.updateOne","ReviewLike.updateMany","ReviewLike.updateManyAndReturn","ReviewLike.upsertOne","ReviewLike.deleteOne","ReviewLike.deleteMany","ReviewLike.groupBy","ReviewLike.aggregate","HelpRequest.findUnique","HelpRequest.findUniqueOrThrow","HelpRequest.findFirst","HelpRequest.findFirstOrThrow","HelpRequest.findMany","HelpRequest.createOne","HelpRequest.createMany","HelpRequest.createManyAndReturn","HelpRequest.updateOne","HelpRequest.updateMany","HelpRequest.updateManyAndReturn","HelpRequest.upsertOne","HelpRequest.deleteOne","HelpRequest.deleteMany","HelpRequest.groupBy","HelpRequest.aggregate","Visitor.findUnique","Visitor.findUniqueOrThrow","Visitor.findFirst","Visitor.findFirstOrThrow","Visitor.findMany","Visitor.createOne","Visitor.createMany","Visitor.createManyAndReturn","Visitor.updateOne","Visitor.updateMany","Visitor.updateManyAndReturn","Visitor.upsertOne","Visitor.deleteOne","Visitor.deleteMany","Visitor.groupBy","Visitor.aggregate","PageView.findUnique","PageView.findUniqueOrThrow","PageView.findFirst","PageView.findFirstOrThrow","PageView.findMany","PageView.createOne","PageView.createMany","PageView.createManyAndReturn","PageView.updateOne","PageView.updateMany","PageView.updateManyAndReturn","PageView.upsertOne","PageView.deleteOne","PageView.deleteMany","PageView.groupBy","PageView.aggregate","Setting.findUnique","Setting.findUniqueOrThrow","Setting.findFirst","Setting.findFirstOrThrow","Setting.findMany","Setting.createOne","Setting.createMany","Setting.createManyAndReturn","Setting.updateOne","Setting.updateMany","Setting.updateManyAndReturn","Setting.upsertOne","Setting.deleteOne","Setting.deleteMany","Setting.groupBy","Setting.aggregate","Invoice.findUnique","Invoice.findUniqueOrThrow","Invoice.findFirst","Invoice.findFirstOrThrow","Invoice.findMany","Invoice.createOne","Invoice.createMany","Invoice.createManyAndReturn","Invoice.updateOne","Invoice.updateMany","Invoice.updateManyAndReturn","Invoice.upsertOne","Invoice.deleteOne","Invoice.deleteMany","Invoice.groupBy","Invoice.aggregate","NotificationOutbox.findUnique","NotificationOutbox.findUniqueOrThrow","NotificationOutbox.findFirst","NotificationOutbox.findFirstOrThrow","NotificationOutbox.findMany","NotificationOutbox.createOne","NotificationOutbox.createMany","NotificationOutbox.createManyAndReturn","NotificationOutbox.updateOne","NotificationOutbox.updateMany","NotificationOutbox.updateManyAndReturn","NotificationOutbox.upsertOne","NotificationOutbox.deleteOne","NotificationOutbox.deleteMany","NotificationOutbox.groupBy","NotificationOutbox.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","AND","OR","NOT","id","identifier","value","expiresAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","issuer","token","ipAddress","userAgent","name","email","emailVerified","image","role","phone","status","every","some","none","orderId","orderNumber","channel","payload","attempts","nextAttemptAt","lockedUntil","lastError","sentAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","invoiceNumber","pdfUrl","key","description","visitorId","pageUrl","pageTitle","productId","categoryId","referrer","timeSpent","sessionId","visitedAt","deviceType","browser","os","subject","message","phoneNumber","HelpStatus","assignedTo","resolvedAt","reviewId","imageUrl","rating","title","comment","ReviewStatus","reply","helpful","quantity","price","discount","total","OrderStatus","totalAmount","subtotal","tax","shippingCost","discountTotal","isDelivered","deliveredAt","shippingAddress","billingAddress","paymentMethod","PaymentStatus","paymentStatus","notes","slug","parentId","metaTitle","metaDescription","metaKeywords","altText","isPrimary","sku","isPublished","buyingPrice","discountPrice","inStock","stockQuantity","userId_productId","userId_reviewId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "ygm_AdACHAYAAPUEACAKAAC3BQAgCwAAuQUAIAwAALoFACAQAADdBAAgGAAAqAUAIBkAALsFACAaAAC8BQAg8wIAALgFADD0AgAACQAQ9QIAALgFADD2AgEAAAAB-gJAAMoEACH7AkAAygQAIZUDAQDJBAAhsQMBANoEACG2AwEA2gQAIc0DEAChBQAhzgMQAKIFACHgAwEA2gQAIeEDAQDaBAAh4gMBANoEACHlAwEAAAAB5gMgANkEACHnAxAAogUAIegDEACiBQAh6QMgANkEACHqAwIA6AQAIQEAAAABACASAQAAtwUAIAQAAL4FACAFAAC_BQAgBgAA9QQAIPMCAAC9BQAw9AIAAAMAEPUCAAC9BQAw9gIBAMkEACH6AkAAygQAIfsCQADKBAAhlQMBAMkEACGYAwEA2gQAIbEDAQDaBAAh3gMBANoEACHfAwEA2gQAIeADAQDaBAAh4QMBANoEACHiAwEA2gQAIQEAAAADACABAAAAAwAgCwEAAM4IACAEAADTCAAgBQAA1AgAIAYAAIgHACCYAwAAxQUAILEDAADFBQAg3gMAAMUFACDfAwAAxQUAIOADAADFBQAg4QMAAMUFACDiAwAAxQUAIBIBAAC3BQAgBAAAvgUAIAUAAL8FACAGAAD1BAAg8wIAAL0FADD0AgAAAwAQ9QIAAL0FADD2AgEAAAAB-gJAAMoEACH7AkAAygQAIZUDAQDJBAAhmAMBANoEACGxAwEA2gQAId4DAQAAAAHfAwEA2gQAIeADAQDaBAAh4QMBANoEACHiAwEA2gQAIQMAAAADACACAAAGADADAAAHACAcBgAA9QQAIAoAALcFACALAAC5BQAgDAAAugUAIBAAAN0EACAYAACoBQAgGQAAuwUAIBoAALwFACDzAgAAuAUAMPQCAAAJABD1AgAAuAUAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIZUDAQDJBAAhsQMBANoEACG2AwEA2gQAIc0DEAChBQAhzgMQAKIFACHgAwEA2gQAIeEDAQDaBAAh4gMBANoEACHlAwEA2gQAIeYDIADZBAAh5wMQAKIFACHoAxAAogUAIekDIADZBAAh6gMCAOgEACERBgAAiAcAIAoAAM4IACALAADPCAAgDAAA0AgAIBAAANoGACAYAADKCAAgGQAA0QgAIBoAANIIACCxAwAAxQUAILYDAADFBQAgzgMAAMUFACDgAwAAxQUAIOEDAADFBQAg4gMAAMUFACDlAwAAxQUAIOcDAADFBQAg6AMAAMUFACADAAAACQAgAgAACgAwAwAAAQAgDwgAALUFACAJAAC2BQAgCgAAtwUAIPMCAACzBQAw9AIAAAwAEPUCAACzBQAw9gIBAMkEACH6AkAAygQAIbIDAQDJBAAhswMBAMkEACG0AwEA2gQAIbUDAQDaBAAhtgMBANoEACG3AwEA2gQAIbgDAgC0BQAhCAgAAM0IACAJAAC5CAAgCgAAzggAILQDAADFBQAgtQMAAMUFACC2AwAAxQUAILcDAADFBQAguAMAAMUFACAPCAAAtQUAIAkAALYFACAKAAC3BQAg8wIAALMFADD0AgAADAAQ9QIAALMFADD2AgEAAAAB-gJAAMoEACGyAwEAyQQAIbMDAQDJBAAhtAMBANoEACG1AwEA2gQAIbYDAQDaBAAhtwMBANoEACG4AwIAtAUAIQMAAAAMACACAAANADADAAAOACADAAAADAAgAgAADQAwAwAADgAgAQAAAAwAIAEAAAAJACABAAAAAwAgAQAAAAMAIAEAAAAJACABAAAADAAgCwkAAJcFACATAgDoBAAh8wIAALIFADD0AgAAFwAQ9QIAALIFADD2AgEAyQQAIfoCQADKBAAhtQMBAMkEACHFAwEAyQQAIeMDAQDaBAAh5AMgANkEACECCQAAuQgAIOMDAADFBQAgCwkAAJcFACATAgDoBAAh8wIAALIFADD0AgAAFwAQ9QIAALIFADD2AgEAAAAB-gJAAMoEACG1AwEAyQQAIcUDAQDJBAAh4wMBANoEACHkAyAA2QQAIQMAAAAXACACAAAYADADAAAZACALCQAAlwUAIPMCAACWBQAw9AIAABsAEPUCAACWBQAw9gIBAMkEACH7AkAAygQAIbUDAQDJBAAh3gMBANoEACHgAwEA2gQAIeEDAQDaBAAh4gMBANoEACEBAAAAGwAgEgkAAJcFACALAACxBQAgDQAApwUAIBcAAN4EACDzAgAArwUAMPQCAAAdABD1AgAArwUAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIYkDAQDJBAAhmwMAALAFygMitQMBAMkEACHGAwIA6AQAIccDAQDaBAAhyAMBANoEACHKAwEA2gQAIcsDAgDoBAAhBwkAALkIACALAADMCAAgDQAAyQgAIBcAANsGACDHAwAAxQUAIMgDAADFBQAgygMAAMUFACATCQAAlwUAIAsAALEFACANAACnBQAgFwAA3gQAIPMCAACvBQAw9AIAAB0AEPUCAACvBQAw9gIBAAAAAfoCQADKBAAh-wJAAMoEACGJAwEAyQQAIZsDAACwBcoDIrUDAQDJBAAhxgMCAOgEACHHAwEA2gQAIcgDAQDaBAAhygMBANoEACHLAwIA6AQAIesDAACuBQAgAwAAAB0AIAIAAB4AMAMAAB8AIAwNAACnBQAg8wIAAK0FADD0AgAAIQAQ9QIAAK0FADD2AgEAyQQAIfkCQADKBAAh-gJAAMoEACH7AkAAygQAIYkDAQDJBAAhkgMBAMkEACGTAwEA2gQAIZQDAQDaBAAhAw0AAMkIACCTAwAAxQUAIJQDAADFBQAgDA0AAKcFACDzAgAArQUAMPQCAAAhABD1AgAArQUAMPYCAQAAAAH5AkAAygQAIfoCQADKBAAh-wJAAMoEACGJAwEAyQQAIZIDAQAAAAGTAwEA2gQAIZQDAQDaBAAhAwAAACEAIAIAACIAMAMAACMAIBINAACnBQAg8wIAAKwFADD0AgAAJQAQ9QIAAKwFADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGHAwEAyQQAIYgDAQDJBAAhiQMBAMkEACGKAwEA2gQAIYsDAQDaBAAhjAMBANoEACGNA0AA6QQAIY4DQADpBAAhjwMBANoEACGQAwEA2gQAIZEDAQDaBAAhCQ0AAMkIACCKAwAAxQUAIIsDAADFBQAgjAMAAMUFACCNAwAAxQUAII4DAADFBQAgjwMAAMUFACCQAwAAxQUAIJEDAADFBQAgEg0AAKcFACDzAgAArAUAMPQCAAAlABD1AgAArAUAMPYCAQAAAAH6AkAAygQAIfsCQADKBAAhhwMBAMkEACGIAwEAyQQAIYkDAQDJBAAhigMBANoEACGLAwEA2gQAIYwDAQDaBAAhjQNAAOkEACGOA0AA6QQAIY8DAQDaBAAhkAMBANoEACGRAwEA2gQAIQMAAAAlACACAAAmADADAAAnACADAAAAHQAgAgAAHgAwAwAAHwAgCQ0AAKcFACARAACfBQAg8wIAAKsFADD0AgAAKgAQ9QIAAKsFADD2AgEAyQQAIfoCQADKBAAhiQMBAMkEACHEAwEAyQQAIQINAADJCAAgEQAAyAgAIAoNAACnBQAgEQAAnwUAIPMCAACrBQAw9AIAACoAEPUCAACrBQAw9gIBAAAAAfoCQADKBAAhiQMBAMkEACHEAwEAyQQAIewDAACqBQAgAwAAACoAIAIAACsAMAMAACwAIBkNAACnBQAgFAAAqAUAIBUAAKkFACDzAgAAowUAMPQCAAAuABD1AgAAowUAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIYkDAQDJBAAhmwMAAKQF0QMioAMBAMkEACGuAwEA2gQAIdEDEAChBQAh0gMQAKEFACHTAxAAogUAIdQDEACiBQAh1QMQAKIFACHWAyAA2QQAIdcDQADpBAAh2AMAAOcEACDZAwAApQUAINoDAQDaBAAh3AMAAKYF3AMi3QMBANoEACELDQAAyQgAIBQAAMoIACAVAADLCAAgrgMAAMUFACDTAwAAxQUAINQDAADFBQAg1QMAAMUFACDXAwAAxQUAINkDAADFBQAg2gMAAMUFACDdAwAAxQUAIBkNAACnBQAgFAAAqAUAIBUAAKkFACDzAgAAowUAMPQCAAAuABD1AgAAowUAMPYCAQAAAAH6AkAAygQAIfsCQADKBAAhiQMBAMkEACGbAwAApAXRAyKgAwEAAAABrgMBAAAAAdEDEAChBQAh0gMQAKEFACHTAxAAogUAIdQDEACiBQAh1QMQAKIFACHWAyAA2QQAIdcDQADpBAAh2AMAAOcEACDZAwAApQUAINoDAQDaBAAh3AMAAKYF3AMi3QMBANoEACEDAAAALgAgAgAALwAwAwAAMAAgDQkAAJcFACATAADsBAAg8wIAAKAFADD0AgAAMgAQ9QIAAKAFADD2AgEAyQQAIfoCQADKBAAhnwMBAMkEACG1AwEAyQQAIcwDAgDoBAAhzQMQAKEFACHOAxAAogUAIc8DEAChBQAhAwkAALkIACATAADnBgAgzgMAAMUFACANCQAAlwUAIBMAAOwEACDzAgAAoAUAMPQCAAAyABD1AgAAoAUAMPYCAQAAAAH6AkAAygQAIZ8DAQDJBAAhtQMBAMkEACHMAwIA6AQAIc0DEAChBQAhzgMQAKIFACHPAxAAoQUAIQMAAAAyACACAAAzADADAAA0ACALEwAA7AQAIPMCAADrBAAw9AIAADYAEPUCAADrBAAw9gIBAMkEACH6AkAAygQAIfsCQADKBAAhnwMBAMkEACGnA0AA6QQAIa4DAQDJBAAhrwMBANoEACEBAAAANgAgAQAAADIAIAEAAAAhACABAAAAJQAgAQAAAB0AIAEAAAAqACABAAAALgAgCBEAAJ8FACDzAgAAngUAMPQCAAA-ABD1AgAAngUAMPYCAQDJBAAh-gJAAMoEACHEAwEAyQQAIcUDAQDJBAAhAREAAMgIACAIEQAAnwUAIPMCAACeBQAw9AIAAD4AEPUCAACeBQAw9gIBAAAAAfoCQADKBAAhxAMBAMkEACHFAwEAyQQAIQMAAAA-ACACAAA_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_YCAQDDBQAh-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_wUAIBMAAK4HACD2AgEAAAAB-gJAAAAAAZ8DAQAAAAG1AwEAAAABzAMCAAAAAc0DEAAAAAHOAxAAAAABzwMQAAAAAQEgAADNAQAgCPYCAQAAAAH6AkAAAAABnwMBAAAAAbUDAQAAAAHMAwIAAAABzQMQAAAAAc4DEAAAAAHPAxAAAAABASAAAM8BADABIAAAzwEAMAoJAAD9BQAgEwAArQcAIPYCAQDDBQAh-gJAAMQFACGfAwEAwwUAIbUDAQDDBQAhzAMCAPsFACHNAxAA5gUAIc4DEADnBQAhzwMQAOYFACECAAAANAAgIAAA0gEAIAj2AgEAwwUAIfoCQADEBQAhnwMBAMMFACG1AwEAwwUAIcwDAgD7BQAhzQMQAOYFACHOAxAA5wUAIc8DEADmBQAhAgAAADIAICAAANQBACACAAAAMgAgIAAA1AEAIAMAAAA0ACAnAADNAQAgKAAA0gEAIAEAAAA0ACABAAAAMgAgBgcAAKgHACAtAACpBwAgLgAArAcAIC8AAKsHACAwAACqBwAgzgMAAMUFACAL8wIAAIQFADD0AgAA2wEAEPUCAACEBQAw9gIBAMEEACH6AkAAwgQAIZ8DAQDBBAAhtQMBAMEEACHMAwIA4gQAIc0DEACFBQAhzgMQAIYFACHPAxAAhQUAIQMAAAAyACACAADaAQAwLAAA2wEAIAMAAAAyACACAAAzADADAAA0ACABAAAASAAgAQAAAEgAIAMAAABGACACAABHADADAABIACADAAAARgAgAgAARwAwAwAASAAgAwAAAEYAIAIAAEcAMAMAAEgAIAcJAACnBwAg9gIBAAAAAfoCQAAAAAH7AkAAAAABiQMBAAAAAbUDAQAAAAHMAwIAAAABASAAAOMBACAG9gIBAAAAAfoCQAAAAAH7AkAAAAABiQMBAAAAAbUDAQAAAAHMAwIAAAABASAAAOUBADABIAAA5QEAMAcJAACmBwAg9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhiQMBAMMFACG1AwEAwwUAIcwDAgD7BQAhAgAAAEgAICAAAOgBACAG9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhiQMBAMMFACG1AwEAwwUAIcwDAgD7BQAhAgAAAEYAICAAAOoBACACAAAARgAgIAAA6gEAIAMAAABIACAnAADjAQAgKAAA6AEAIAEAAABIACABAAAARgAgBQcAAKEHACAtAACiBwAgLgAApQcAIC8AAKQHACAwAACjBwAgCfMCAACDBQAw9AIAAPEBABD1AgAAgwUAMPYCAQDBBAAh-gJAAMIEACH7AkAAwgQAIYkDAQDBBAAhtQMBAMEEACHMAwIA4gQAIQMAAABGACACAADwAQAwLAAA8QEAIAMAAABGACACAABHADADAABIACABAAAATAAgAQAAAEwAIAMAAABKACACAABLADADAABMACADAAAASgAgAgAASwAwAwAATAAgAwAAAEoAIAIAAEsAMAMAAEwAIAUJAACgBwAg9gIBAAAAAfoCQAAAAAGJAwEAAAABtQMBAAAAAQEgAAD5AQAgBPYCAQAAAAH6AkAAAAABiQMBAAAAAbUDAQAAAAEBIAAA-wEAMAEgAAD7AQAwBQkAAJ8HACD2AgEAwwUAIfoCQADEBQAhiQMBAMMFACG1AwEAwwUAIQIAAABMACAgAAD-AQAgBPYCAQDDBQAh-gJAAMQFACGJAwEAwwUAIbUDAQDDBQAhAgAAAEoAICAAAIACACACAAAASgAgIAAAgAIAIAMAAABMACAnAAD5AQAgKAAA_gEAIAEAAABMACABAAAASgAgAwcAAJwHACAvAACeBwAgMAAAnQcAIAfzAgAAggUAMPQCAACHAgAQ9QIAAIIFADD2AgEAwQQAIfoCQADCBAAhiQMBAMEEACG1AwEAwQQAIQMAAABKACACAACGAgAwLAAAhwIAIAMAAABKACACAABLADADAABMACABAAAAHwAgAQAAAB8AIAMAAAAdACACAAAeADADAAAfACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAB0AIAIAAB4AMAMAAB8AIA8JAAC4BgAgCwAAuQYAIA0AAJsHACAXAAC6BgAg9gIBAAAAAfoCQAAAAAH7AkAAAAABiQMBAAAAAZsDAAAAygMCtQMBAAAAAcYDAgAAAAHHAwEAAAAByAMBAAAAAcoDAQAAAAHLAwIAAAABASAAAI8CACAL9gIBAAAAAfoCQAAAAAH7AkAAAAABiQMBAAAAAZsDAAAAygMCtQMBAAAAAcYDAgAAAAHHAwEAAAAByAMBAAAAAcoDAQAAAAHLAwIAAAABASAAAJECADABIAAAkQIAMA8JAACdBgAgCwAAngYAIA0AAJoHACAXAACfBgAg9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhiQMBAMMFACGbAwAAmwbKAyK1AwEAwwUAIcYDAgD7BQAhxwMBAMkFACHIAwEAyQUAIcoDAQDJBQAhywMCAPsFACECAAAAHwAgIAAAlAIAIAv2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGJAwEAwwUAIZsDAACbBsoDIrUDAQDDBQAhxgMCAPsFACHHAwEAyQUAIcgDAQDJBQAhygMBAMkFACHLAwIA-wUAIQIAAAAdACAgAACWAgAgAgAAAB0AICAAAJYCACADAAAAHwAgJwAAjwIAICgAAJQCACABAAAAHwAgAQAAAB0AIAgHAACVBwAgLQAAlgcAIC4AAJkHACAvAACYBwAgMAAAlwcAIMcDAADFBQAgyAMAAMUFACDKAwAAxQUAIA7zAgAA_gQAMPQCAACdAgAQ9QIAAP4EADD2AgEAwQQAIfoCQADCBAAh-wJAAMIEACGJAwEAwQQAIZsDAAD_BMoDIrUDAQDBBAAhxgMCAOIEACHHAwEAzAQAIcgDAQDMBAAhygMBAMwEACHLAwIA4gQAIQMAAAAdACACAACcAgAwLAAAnQIAIAMAAAAdACACAAAeADADAAAfACABAAAAQAAgAQAAAEAAIAMAAAA-ACACAAA_ADADAABAACADAAAAPgAgAgAAPwAwAwAAQAAgAwAAAD4AIAIAAD8AMAMAAEAAIAURAACUBwAg9gIBAAAAAfoCQAAAAAHEAwEAAAABxQMBAAAAAQEgAAClAgAgBPYCAQAAAAH6AkAAAAABxAMBAAAAAcUDAQAAAAEBIAAApwIAMAEgAACnAgAwBREAAJMHACD2AgEAwwUAIfoCQADEBQAhxAMBAMMFACHFAwEAwwUAIQIAAABAACAgAACqAgAgBPYCAQDDBQAh-gJAAMQFACHEAwEAwwUAIcUDAQDDBQAhAgAAAD4AICAAAKwCACACAAAAPgAgIAAArAIAIAMAAABAACAnAAClAgAgKAAAqgIAIAEAAABAACABAAAAPgAgAwcAAJAHACAvAACSBwAgMAAAkQcAIAfzAgAA_QQAMPQCAACzAgAQ9QIAAP0EADD2AgEAwQQAIfoCQADCBAAhxAMBAMEEACHFAwEAwQQAIQMAAAA-ACACAACyAgAwLAAAswIAIAMAAAA-ACACAAA_ADADAABAACABAAAALAAgAQAAACwAIAMAAAAqACACAAArADADAAAsACADAAAAKgAgAgAAKwAwAwAALAAgAwAAACoAIAIAACsAMAMAACwAIAYNAACqBgAgEQAAkAYAIPYCAQAAAAH6AkAAAAABiQMBAAAAAcQDAQAAAAEBIAAAuwIAIAT2AgEAAAAB-gJAAAAAAYkDAQAAAAHEAwEAAAABASAAAL0CADABIAAAvQIAMAYNAACoBgAgEQAAjgYAIPYCAQDDBQAh-gJAAMQFACGJAwEAwwUAIcQDAQDDBQAhAgAAACwAICAAAMACACAE9gIBAMMFACH6AkAAxAUAIYkDAQDDBQAhxAMBAMMFACECAAAAKgAgIAAAwgIAIAIAAAAqACAgAADCAgAgAwAAACwAICcAALsCACAoAADAAgAgAQAAACwAIAEAAAAqACADBwAAjQcAIC8AAI8HACAwAACOBwAgB_MCAAD8BAAw9AIAAMkCABD1AgAA_AQAMPYCAQDBBAAh-gJAAMIEACGJAwEAwQQAIcQDAQDBBAAhAwAAACoAIAIAAMgCADAsAADJAgAgAwAAACoAIAIAACsAMAMAACwAIA3zAgAA-gQAMPQCAADPAgAQ9QIAAPoEADD2AgEAAAAB-gJAAMoEACH7AkAAygQAIYkDAQDaBAAhmwMAAPsEwgMivgMBAMkEACG_AwEAyQQAIcADAQDaBAAhwgMBANoEACHDA0AA6QQAIQEAAADMAgAgAQAAAMwCACAN8wIAAPoEADD0AgAAzwIAEPUCAAD6BAAw9gIBAMkEACH6AkAAygQAIfsCQADKBAAhiQMBANoEACGbAwAA-wTCAyK-AwEAyQQAIb8DAQDJBAAhwAMBANoEACHCAwEA2gQAIcMDQADpBAAhBIkDAADFBQAgwAMAAMUFACDCAwAAxQUAIMMDAADFBQAgAwAAAM8CACACAADQAgAwAwAAzAIAIAMAAADPAgAgAgAA0AIAMAMAAMwCACADAAAAzwIAIAIAANACADADAADMAgAgCvYCAQAAAAH6AkAAAAAB-wJAAAAAAYkDAQAAAAGbAwAAAMIDAr4DAQAAAAG_AwEAAAABwAMBAAAAAcIDAQAAAAHDA0AAAAABASAAANQCACAK9gIBAAAAAfoCQAAAAAH7AkAAAAABiQMBAAAAAZsDAAAAwgMCvgMBAAAAAb8DAQAAAAHAAwEAAAABwgMBAAAAAcMDQAAAAAEBIAAA1gIAMAEgAADWAgAwCvYCAQDDBQAh-gJAAMQFACH7AkAAxAUAIYkDAQDJBQAhmwMAAIwHwgMivgMBAMMFACG_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_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_MCAADTBAAw9AIAAI4EABD1AgAA0wQAMPYCAQDBBAAh-QJAAMIEACH6AkAAwgQAIfsCQADCBAAhiQMBAMEEACGSAwEAwQQAIZMDAQDMBAAhlAMBAMwEACEDAAAAIQAgAgAAjQQAMCwAAI4EACADAAAAIQAgAgAAIgAwAwAAIwAgAQAAACcAIAEAAAAnACADAAAAJQAgAgAAJgAwAwAAJwAgAwAAACUAIAIAACYAMAMAACcAIAMAAAAlACACAAAmADADAAAnACAPDQAAzAUAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAYcDAQAAAAGIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABjAMBAAAAAY0DQAAAAAGOA0AAAAABjwMBAAAAAZADAQAAAAGRAwEAAAABASAAAJYEACAO9gIBAAAAAfoCQAAAAAH7AkAAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAwEAAAABjQNAAAAAAY4DQAAAAAGPAwEAAAABkAMBAAAAAZEDAQAAAAEBIAAAmAQAMAEgAACYBAAwDw0AAMsFACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGHAwEAwwUAIYgDAQDDBQAhiQMBAMMFACGKAwEAyQUAIYsDAQDJBQAhjAMBAMkFACGNA0AAygUAIY4DQADKBQAhjwMBAMkFACGQAwEAyQUAIZEDAQDJBQAhAgAAACcAICAAAJsEACAO9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhhwMBAMMFACGIAwEAwwUAIYkDAQDDBQAhigMBAMkFACGLAwEAyQUAIYwDAQDJBQAhjQNAAMoFACGOA0AAygUAIY8DAQDJBQAhkAMBAMkFACGRAwEAyQUAIQIAAAAlACAgAACdBAAgAgAAACUAICAAAJ0EACADAAAAJwAgJwAAlgQAICgAAJsEACABAAAAJwAgAQAAACUAIAsHAADGBQAgLwAAyAUAIDAAAMcFACCKAwAAxQUAIIsDAADFBQAgjAMAAMUFACCNAwAAxQUAII4DAADFBQAgjwMAAMUFACCQAwAAxQUAIJEDAADFBQAgEfMCAADLBAAw9AIAAKQEABD1AgAAywQAMPYCAQDBBAAh-gJAAMIEACH7AkAAwgQAIYcDAQDBBAAhiAMBAMEEACGJAwEAwQQAIYoDAQDMBAAhiwMBAMwEACGMAwEAzAQAIY0DQADNBAAhjgNAAM0EACGPAwEAzAQAIZADAQDMBAAhkQMBAMwEACEDAAAAJQAgAgAAowQAMCwAAKQEACADAAAAJQAgAgAAJgAwAwAAJwAgCfMCAADIBAAw9AIAAKoEABD1AgAAyAQAMPYCAQAAAAH3AgEAyQQAIfgCAQDJBAAh-QJAAMoEACH6AkAAygQAIfsCQADKBAAhAQAAAKcEACABAAAApwQAIAnzAgAAyAQAMPQCAACqBAAQ9QIAAMgEADD2AgEAyQQAIfcCAQDJBAAh-AIBAMkEACH5AkAAygQAIfoCQADKBAAh-wJAAMoEACEAAwAAAKoEACACAACrBAAwAwAApwQAIAMAAACqBAAgAgAAqwQAMAMAAKcEACADAAAAqgQAIAIAAKsEADADAACnBAAgBvYCAQAAAAH3AgEAAAAB-AIBAAAAAfkCQAAAAAH6AkAAAAAB-wJAAAAAAQEgAACvBAAgBvYCAQAAAAH3AgEAAAAB-AIBAAAAAfkCQAAAAAH6AkAAAAAB-wJAAAAAAQEgAACxBAAwASAAALEEADAG9gIBAMMFACH3AgEAwwUAIfgCAQDDBQAh-QJAAMQFACH6AkAAxAUAIfsCQADEBQAhAgAAAKcEACAgAAC0BAAgBvYCAQDDBQAh9wIBAMMFACH4AgEAwwUAIfkCQADEBQAh-gJAAMQFACH7AkAAxAUAIQIAAACqBAAgIAAAtgQAIAIAAACqBAAgIAAAtgQAIAMAAACnBAAgJwAArwQAICgAALQEACABAAAApwQAIAEAAACqBAAgAwcAAMAFACAvAADCBQAgMAAAwQUAIAnzAgAAwAQAMPQCAAC9BAAQ9QIAAMAEADD2AgEAwQQAIfcCAQDBBAAh-AIBAMEEACH5AkAAwgQAIfoCQADCBAAh-wJAAMIEACEDAAAAqgQAIAIAALwEADAsAAC9BAAgAwAAAKoEACACAACrBAAwAwAApwQAIAnzAgAAwAQAMPQCAAC9BAAQ9QIAAMAEADD2AgEAwQQAIfcCAQDBBAAh-AIBAMEEACH5AkAAwgQAIfoCQADCBAAh-wJAAMIEACEOBwAAxAQAIC8AAMcEACAwAADHBAAg_AIBAAAAAf0CAQAAAAT-AgEAAAAE_wIBAAAAAYADAQAAAAGBAwEAAAABggMBAAAAAYMDAQDGBAAhhAMBAAAAAYUDAQAAAAGGAwEAAAABCwcAAMQEACAvAADFBAAgMAAAxQQAIPwCQAAAAAH9AkAAAAAE_gJAAAAABP8CQAAAAAGAA0AAAAABgQNAAAAAAYIDQAAAAAGDA0AAwwQAIQsHAADEBAAgLwAAxQQAIDAAAMUEACD8AkAAAAAB_QJAAAAABP4CQAAAAAT_AkAAAAABgANAAAAAAYEDQAAAAAGCA0AAAAABgwNAAMMEACEI_AICAAAAAf0CAgAAAAT-AgIAAAAE_wICAAAAAYADAgAAAAGBAwIAAAABggMCAAAAAYMDAgDEBAAhCPwCQAAAAAH9AkAAAAAE_gJAAAAABP8CQAAAAAGAA0AAAAABgQNAAAAAAYIDQAAAAAGDA0AAxQQAIQ4HAADEBAAgLwAAxwQAIDAAAMcEACD8AgEAAAAB_QIBAAAABP4CAQAAAAT_AgEAAAABgAMBAAAAAYEDAQAAAAGCAwEAAAABgwMBAMYEACGEAwEAAAABhQMBAAAAAYYDAQAAAAEL_AIBAAAAAf0CAQAAAAT-AgEAAAAE_wIBAAAAAYADAQAAAAGBAwEAAAABggMBAAAAAYMDAQDHBAAhhAMBAAAAAYUDAQAAAAGGAwEAAAABCfMCAADIBAAw9AIAAKoEABD1AgAAyAQAMPYCAQDJBAAh9wIBAMkEACH4AgEAyQQAIfkCQADKBAAh-gJAAMoEACH7AkAAygQAIQv8AgEAAAAB_QIBAAAABP4CAQAAAAT_AgEAAAABgAMBAAAAAYEDAQAAAAGCAwEAAAABgwMBAMcEACGEAwEAAAABhQMBAAAAAYYDAQAAAAEI_AJAAAAAAf0CQAAAAAT-AkAAAAAE_wJAAAAAAYADQAAAAAGBA0AAAAABggNAAAAAAYMDQADFBAAhEfMCAADLBAAw9AIAAKQEABD1AgAAywQAMPYCAQDBBAAh-gJAAMIEACH7AkAAwgQAIYcDAQDBBAAhiAMBAMEEACGJAwEAwQQAIYoDAQDMBAAhiwMBAMwEACGMAwEAzAQAIY0DQADNBAAhjgNAAM0EACGPAwEAzAQAIZADAQDMBAAhkQMBAMwEACEOBwAAzwQAIC8AANIEACAwAADSBAAg_AIBAAAAAf0CAQAAAAX-AgEAAAAF_wIBAAAAAYADAQAAAAGBAwEAAAABggMBAAAAAYMDAQDRBAAhhAMBAAAAAYUDAQAAAAGGAwEAAAABCwcAAM8EACAvAADQBAAgMAAA0AQAIPwCQAAAAAH9AkAAAAAF_gJAAAAABf8CQAAAAAGAA0AAAAABgQNAAAAAAYIDQAAAAAGDA0AAzgQAIQsHAADPBAAgLwAA0AQAIDAAANAEACD8AkAAAAAB_QJAAAAABf4CQAAAAAX_AkAAAAABgANAAAAAAYEDQAAAAAGCA0AAAAABgwNAAM4EACEI_AICAAAAAf0CAgAAAAX-AgIAAAAF_wICAAAAAYADAgAAAAGBAwIAAAABggMCAAAAAYMDAgDPBAAhCPwCQAAAAAH9AkAAAAAF_gJAAAAABf8CQAAAAAGAA0AAAAABgQNAAAAAAYIDQAAAAAGDA0AA0AQAIQ4HAADPBAAgLwAA0gQAIDAAANIEACD8AgEAAAAB_QIBAAAABf4CAQAAAAX_AgEAAAABgAMBAAAAAYEDAQAAAAGCAwEAAAABgwMBANEEACGEAwEAAAABhQMBAAAAAYYDAQAAAAEL_AIBAAAAAf0CAQAAAAX-AgEAAAAF_wIBAAAAAYADAQAAAAGBAwEAAAABggMBAAAAAYMDAQDSBAAhhAMBAAAAAYUDAQAAAAGGAwEAAAABC_MCAADTBAAw9AIAAI4EABD1AgAA0wQAMPYCAQDBBAAh-QJAAMIEACH6AkAAwgQAIfsCQADCBAAhiQMBAMEEACGSAwEAwQQAIZMDAQDMBAAhlAMBAMwEACEN8wIAANQEADD0AgAA-AMAEPUCAADUBAAw9gIBAMEEACH6AkAAwgQAIfsCQADCBAAhlQMBAMEEACGWAwEAwQQAIZcDIADVBAAhmAMBAMwEACGZAwEAzAQAIZoDAQDMBAAhmwMBAMwEACEFBwAAxAQAIC8AANcEACAwAADXBAAg_AIgAAAAAYMDIADWBAAhBQcAAMQEACAvAADXBAAgMAAA1wQAIPwCIAAAAAGDAyAA1gQAIQL8AiAAAAABgwMgANcEACESDgAA2wQAIA8AANwEACAQAADdBAAgEgAA3gQAIBYAAN8EACDzAgAA2AQAMPQCAADlAwAQ9QIAANgEADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGVAwEAyQQAIZYDAQDJBAAhlwMgANkEACGYAwEA2gQAIZkDAQDaBAAhmgMBANoEACGbAwEA2gQAIQL8AiAAAAABgwMgANcEACEL_AIBAAAAAf0CAQAAAAX-AgEAAAAF_wIBAAAAAYADAQAAAAGBAwEAAAABggMBAAAAAYMDAQDSBAAhhAMBAAAAAYUDAQAAAAGGAwEAAAABA5wDAAAhACCdAwAAIQAgngMAACEAIAOcAwAAJQAgnQMAACUAIJ4DAAAlACADnAMAAB0AIJ0DAAAdACCeAwAAHQAgA5wDAAAqACCdAwAAKgAgngMAACoAIAOcAwAALgAgnQMAAC4AIJ4DAAAuACAQ8wIAAOAEADD0AgAA3wMAEPUCAADgBAAw9gIBAMEEACH6AkAAwgQAIfsCQADCBAAhmwMBAMEEACGfAwEAwQQAIaADAQDBBAAhoQMBAMEEACGiAwAA4QQAIKMDAgDiBAAhpANAAMIEACGlA0AAzQQAIaYDAQDMBAAhpwNAAM0EACEPBwAAxAQAIC8AAOUEACAwAADlBAAg_AKAAAAAAf8CgAAAAAGAA4AAAAABgQOAAAAAAYIDgAAAAAGDA4AAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABqwOAAAAAAawDgAAAAAGtA4AAAAABDQcAAMQEACAtAADkBAAgLgAAxAQAIC8AAMQEACAwAADEBAAg_AICAAAAAf0CAgAAAAT-AgIAAAAE_wICAAAAAYADAgAAAAGBAwIAAAABggMCAAAAAYMDAgDjBAAhDQcAAMQEACAtAADkBAAgLgAAxAQAIC8AAMQEACAwAADEBAAg_AICAAAAAf0CAgAAAAT-AgIAAAAE_wICAAAAAYADAgAAAAGBAwIAAAABggMCAAAAAYMDAgDjBAAhCPwCCAAAAAH9AggAAAAE_gIIAAAABP8CCAAAAAGAAwgAAAABgQMIAAAAAYIDCAAAAAGDAwgA5AQAIQz8AoAAAAAB_wKAAAAAAYADgAAAAAGBA4AAAAABggOAAAAAAYMDgAAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrA4AAAAABrAOAAAAAAa0DgAAAAAEQ8wIAAOYEADD0AgAAzAMAEPUCAADmBAAw9gIBAMkEACH6AkAAygQAIfsCQADKBAAhmwMBAMkEACGfAwEAyQQAIaADAQDJBAAhoQMBAMkEACGiAwAA5wQAIKMDAgDoBAAhpANAAMoEACGlA0AA6QQAIaYDAQDaBAAhpwNAAOkEACEM_AKAAAAAAf8CgAAAAAGAA4AAAAABgQOAAAAAAYIDgAAAAAGDA4AAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABqwOAAAAAAawDgAAAAAGtA4AAAAABCPwCAgAAAAH9AgIAAAAE_gICAAAABP8CAgAAAAGAAwIAAAABgQMCAAAAAYIDAgAAAAGDAwIAxAQAIQj8AkAAAAAB_QJAAAAABf4CQAAAAAX_AkAAAAABgANAAAAAAYEDQAAAAAGCA0AAAAABgwNAANAEACEK8wIAAOoEADD0AgAAxgMAEPUCAADqBAAw9gIBAMEEACH6AkAAwgQAIfsCQADCBAAhnwMBAMEEACGnA0AAzQQAIa4DAQDBBAAhrwMBAMwEACELEwAA7AQAIPMCAADrBAAw9AIAADYAEPUCAADrBAAw9gIBAMkEACH6AkAAygQAIfsCQADKBAAhnwMBAMkEACGnA0AA6QQAIa4DAQDJBAAhrwMBANoEACEbDQAApwUAIBQAAKgFACAVAACpBQAg8wIAAKMFADD0AgAALgAQ9QIAAKMFADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGJAwEAyQQAIZsDAACkBdEDIqADAQDJBAAhrgMBANoEACHRAxAAoQUAIdIDEAChBQAh0wMQAKIFACHUAxAAogUAIdUDEACiBQAh1gMgANkEACHXA0AA6QQAIdgDAADnBAAg2QMAAKUFACDaAwEA2gQAIdwDAACmBdwDIt0DAQDaBAAh7QMAAC4AIO4DAAAuACAJ8wIAAO0EADD0AgAArgMAEPUCAADtBAAw9gIBAMEEACH4AgAA4QQAIPoCQADCBAAh-wJAAMIEACGwAwEAwQQAIbEDAQDMBAAhCfMCAADuBAAw9AIAAJsDABD1AgAA7gQAMPYCAQDJBAAh-AIAAOcEACD6AkAAygQAIfsCQADKBAAhsAMBAMkEACGxAwEA2gQAIQzzAgAA7wQAMPQCAACVAwAQ9QIAAO8EADD2AgEAwQQAIfoCQADCBAAhsgMBAMEEACGzAwEAwQQAIbQDAQDMBAAhtQMBAMwEACG2AwEAzAQAIbcDAQDMBAAhuAMCAPAEACENBwAAzwQAIC0AAPIEACAuAADPBAAgLwAAzwQAIDAAAM8EACD8AgIAAAAB_QICAAAABf4CAgAAAAX_AgIAAAABgAMCAAAAAYEDAgAAAAGCAwIAAAABgwMCAPEEACENBwAAzwQAIC0AAPIEACAuAADPBAAgLwAAzwQAIDAAAM8EACD8AgIAAAAB_QICAAAABf4CAgAAAAX_AgIAAAABgAMCAAAAAYEDAgAAAAGCAwIAAAABgwMCAPEEACEI_AIIAAAAAf0CCAAAAAX-AggAAAAF_wIIAAAAAYADCAAAAAGBAwgAAAABggMIAAAAAYMDCADyBAAhDfMCAADzBAAw9AIAAPsCABD1AgAA8wQAMPYCAQDBBAAhiQMBAMwEACGTAwEAzAQAIZQDAQDMBAAhtwMBAMwEACG5AwEAwQQAIboDQADCBAAhuwMBAMwEACG8AwEAzAQAIb0DAQDMBAAhDgYAAPUEACDzAgAA9AQAMPQCAADoAgAQ9QIAAPQEADD2AgEAyQQAIYkDAQDaBAAhkwMBANoEACGUAwEA2gQAIbcDAQDaBAAhuQMBAMkEACG6A0AAygQAIbsDAQDaBAAhvAMBANoEACG9AwEA2gQAIQOcAwAADAAgnQMAAAwAIJ4DAAAMACAN8wIAAPYEADD0AgAA4gIAEPUCAAD2BAAw9gIBAMEEACH6AkAAwgQAIfsCQADCBAAhiQMBAMwEACGbAwAA9wTCAyK-AwEAwQQAIb8DAQDBBAAhwAMBAMwEACHCAwEAzAQAIcMDQADNBAAhBwcAAMQEACAvAAD5BAAgMAAA-QQAIPwCAAAAwgMC_QIAAADCAwj-AgAAAMIDCIMDAAD4BMIDIgcHAADEBAAgLwAA-QQAIDAAAPkEACD8AgAAAMIDAv0CAAAAwgMI_gIAAADCAwiDAwAA-ATCAyIE_AIAAADCAwL9AgAAAMIDCP4CAAAAwgMIgwMAAPkEwgMiDfMCAAD6BAAw9AIAAM8CABD1AgAA-gQAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIYkDAQDaBAAhmwMAAPsEwgMivgMBAMkEACG_AwEAyQQAIcADAQDaBAAhwgMBANoEACHDA0AA6QQAIQT8AgAAAMIDAv0CAAAAwgMI_gIAAADCAwiDAwAA-QTCAyIH8wIAAPwEADD0AgAAyQIAEPUCAAD8BAAw9gIBAMEEACH6AkAAwgQAIYkDAQDBBAAhxAMBAMEEACEH8wIAAP0EADD0AgAAswIAEPUCAAD9BAAw9gIBAMEEACH6AkAAwgQAIcQDAQDBBAAhxQMBAMEEACEO8wIAAP4EADD0AgAAnQIAEPUCAAD-BAAw9gIBAMEEACH6AkAAwgQAIfsCQADCBAAhiQMBAMEEACGbAwAA_wTKAyK1AwEAwQQAIcYDAgDiBAAhxwMBAMwEACHIAwEAzAQAIcoDAQDMBAAhywMCAOIEACEHBwAAxAQAIC8AAIEFACAwAACBBQAg_AIAAADKAwL9AgAAAMoDCP4CAAAAygMIgwMAAIAFygMiBwcAAMQEACAvAACBBQAgMAAAgQUAIPwCAAAAygMC_QIAAADKAwj-AgAAAMoDCIMDAACABcoDIgT8AgAAAMoDAv0CAAAAygMI_gIAAADKAwiDAwAAgQXKAyIH8wIAAIIFADD0AgAAhwIAEPUCAACCBQAw9gIBAMEEACH6AkAAwgQAIYkDAQDBBAAhtQMBAMEEACEJ8wIAAIMFADD0AgAA8QEAEPUCAACDBQAw9gIBAMEEACH6AkAAwgQAIfsCQADCBAAhiQMBAMEEACG1AwEAwQQAIcwDAgDiBAAhC_MCAACEBQAw9AIAANsBABD1AgAAhAUAMPYCAQDBBAAh-gJAAMIEACGfAwEAwQQAIbUDAQDBBAAhzAMCAOIEACHNAxAAhQUAIc4DEACGBQAhzwMQAIUFACENBwAAxAQAIC0AAIoFACAuAACKBQAgLwAAigUAIDAAAIoFACD8AhAAAAAB_QIQAAAABP4CEAAAAAT_AhAAAAABgAMQAAAAAYEDEAAAAAGCAxAAAAABgwMQAIkFACENBwAAzwQAIC0AAIgFACAuAACIBQAgLwAAiAUAIDAAAIgFACD8AhAAAAAB_QIQAAAABf4CEAAAAAX_AhAAAAABgAMQAAAAAYEDEAAAAAGCAxAAAAABgwMQAIcFACENBwAAzwQAIC0AAIgFACAuAACIBQAgLwAAiAUAIDAAAIgFACD8AhAAAAAB_QIQAAAABf4CEAAAAAX_AhAAAAABgAMQAAAAAYEDEAAAAAGCAxAAAAABgwMQAIcFACEI_AIQAAAAAf0CEAAAAAX-AhAAAAAF_wIQAAAAAYADEAAAAAGBAxAAAAABggMQAAAAAYMDEACIBQAhDQcAAMQEACAtAACKBQAgLgAAigUAIC8AAIoFACAwAACKBQAg_AIQAAAAAf0CEAAAAAT-AhAAAAAE_wIQAAAAAYADEAAAAAGBAxAAAAABggMQAAAAAYMDEACJBQAhCPwCEAAAAAH9AhAAAAAE_gIQAAAABP8CEAAAAAGAAxAAAAABgQMQAAAAAYIDEAAAAAGDAxAAigUAIRbzAgAAiwUAMPQCAADFAQAQ9QIAAIsFADD2AgEAwQQAIfoCQADCBAAh-wJAAMIEACGJAwEAwQQAIZsDAACMBdEDIqADAQDBBAAhrgMBAMwEACHRAxAAhQUAIdIDEACFBQAh0wMQAIYFACHUAxAAhgUAIdUDEACGBQAh1gMgANUEACHXA0AAzQQAIdgDAADhBAAg2QMAAI0FACDaAwEAzAQAIdwDAACOBdwDIt0DAQDMBAAhBwcAAMQEACAvAACTBQAgMAAAkwUAIPwCAAAA0QMC_QIAAADRAwj-AgAAANEDCIMDAACSBdEDIg8HAADPBAAgLwAAkQUAIDAAAJEFACD8AoAAAAAB_wKAAAAAAYADgAAAAAGBA4AAAAABggOAAAAAAYMDgAAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrA4AAAAABrAOAAAAAAa0DgAAAAAEHBwAAxAQAIC8AAJAFACAwAACQBQAg_AIAAADcAwL9AgAAANwDCP4CAAAA3AMIgwMAAI8F3AMiBwcAAMQEACAvAACQBQAgMAAAkAUAIPwCAAAA3AMC_QIAAADcAwj-AgAAANwDCIMDAACPBdwDIgT8AgAAANwDAv0CAAAA3AMI_gIAAADcAwiDAwAAkAXcAyIM_AKAAAAAAf8CgAAAAAGAA4AAAAABgQOAAAAAAYIDgAAAAAGDA4AAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABqwOAAAAAAawDgAAAAAGtA4AAAAABBwcAAMQEACAvAACTBQAgMAAAkwUAIPwCAAAA0QMC_QIAAADRAwj-AgAAANEDCIMDAACSBdEDIgT8AgAAANEDAv0CAAAA0QMI_gIAAADRAwiDAwAAkwXRAyIO8wIAAJQFADD0AgAArwEAEPUCAACUBQAw9gIBAMEEACH6AkAAwgQAIfsCQADCBAAhlQMBAMEEACGYAwEAzAQAIbEDAQDMBAAh3gMBAMwEACHfAwEAzAQAIeADAQDMBAAh4QMBAMwEACHiAwEAzAQAIQrzAgAAlQUAMPQCAACXAQAQ9QIAAJUFADD2AgEAwQQAIfsCQADCBAAhtQMBAMEEACHeAwEAzAQAIeADAQDMBAAh4QMBAMwEACHiAwEAzAQAIQsJAACXBQAg8wIAAJYFADD0AgAAGwAQ9QIAAJYFADD2AgEAyQQAIfsCQADKBAAhtQMBAMkEACHeAwEA2gQAIeADAQDaBAAh4QMBANoEACHiAwEA2gQAIR4GAAD1BAAgCgAAtwUAIAsAALkFACAMAAC6BQAgEAAA3QQAIBgAAKgFACAZAAC7BQAgGgAAvAUAIPMCAAC4BQAw9AIAAAkAEPUCAAC4BQAw9gIBAMkEACH6AkAAygQAIfsCQADKBAAhlQMBAMkEACGxAwEA2gQAIbYDAQDaBAAhzQMQAKEFACHOAxAAogUAIeADAQDaBAAh4QMBANoEACHiAwEA2gQAIeUDAQDaBAAh5gMgANkEACHnAxAAogUAIegDEACiBQAh6QMgANkEACHqAwIA6AQAIe0DAAAJACDuAwAACQAgChMCAOIEACHzAgAAmAUAMPQCAAB_ABD1AgAAmAUAMPYCAQDBBAAh-gJAAMIEACG1AwEAwQQAIcUDAQDBBAAh4wMBAMwEACHkAyAA1QQAIRTzAgAAmQUAMPQCAABpABD1AgAAmQUAMPYCAQDBBAAh-gJAAMIEACH7AkAAwgQAIZUDAQDBBAAhsQMBAMwEACG2AwEAzAQAIc0DEACFBQAhzgMQAIYFACHgAwEAzAQAIeEDAQDMBAAh4gMBAMwEACHlAwEAzAQAIeYDIADVBAAh5wMQAIYFACHoAxAAhgUAIekDIADVBAAh6gMCAOIEACECiQMBAAAAAbUDAQAAAAEICQAAlwUAIPMCAACbBQAw9AIAAEoAEPUCAACbBQAw9gIBAMkEACH6AkAAygQAIYkDAQDJBAAhtQMBAMkEACECiQMBAAAAAbUDAQAAAAEKCQAAlwUAIPMCAACdBQAw9AIAAEYAEPUCAACdBQAw9gIBAMkEACH6AkAAygQAIfsCQADKBAAhiQMBAMkEACG1AwEAyQQAIcwDAgDoBAAhCBEAAJ8FACDzAgAAngUAMPQCAAA-ABD1AgAAngUAMPYCAQDJBAAh-gJAAMoEACHEAwEAyQQAIcUDAQDJBAAhFAkAAJcFACALAACxBQAgDQAApwUAIBcAAN4EACDzAgAArwUAMPQCAAAdABD1AgAArwUAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIYkDAQDJBAAhmwMAALAFygMitQMBAMkEACHGAwIA6AQAIccDAQDaBAAhyAMBANoEACHKAwEA2gQAIcsDAgDoBAAh7QMAAB0AIO4DAAAdACANCQAAlwUAIBMAAOwEACDzAgAAoAUAMPQCAAAyABD1AgAAoAUAMPYCAQDJBAAh-gJAAMoEACGfAwEAyQQAIbUDAQDJBAAhzAMCAOgEACHNAxAAoQUAIc4DEACiBQAhzwMQAKEFACEI_AIQAAAAAf0CEAAAAAT-AhAAAAAE_wIQAAAAAYADEAAAAAGBAxAAAAABggMQAAAAAYMDEACKBQAhCPwCEAAAAAH9AhAAAAAF_gIQAAAABf8CEAAAAAGAAxAAAAABgQMQAAAAAYIDEAAAAAGDAxAAiAUAIRkNAACnBQAgFAAAqAUAIBUAAKkFACDzAgAAowUAMPQCAAAuABD1AgAAowUAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIYkDAQDJBAAhmwMAAKQF0QMioAMBAMkEACGuAwEA2gQAIdEDEAChBQAh0gMQAKEFACHTAxAAogUAIdQDEACiBQAh1QMQAKIFACHWAyAA2QQAIdcDQADpBAAh2AMAAOcEACDZAwAApQUAINoDAQDaBAAh3AMAAKYF3AMi3QMBANoEACEE_AIAAADRAwL9AgAAANEDCP4CAAAA0QMIgwMAAJMF0QMiDPwCgAAAAAH_AoAAAAABgAOAAAAAAYEDgAAAAAGCA4AAAAABgwOAAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAasDgAAAAAGsA4AAAAABrQOAAAAAAQT8AgAAANwDAv0CAAAA3AMI_gIAAADcAwiDAwAAkAXcAyIUDgAA2wQAIA8AANwEACAQAADdBAAgEgAA3gQAIBYAAN8EACDzAgAA2AQAMPQCAADlAwAQ9QIAANgEADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGVAwEAyQQAIZYDAQDJBAAhlwMgANkEACGYAwEA2gQAIZkDAQDaBAAhmgMBANoEACGbAwEA2gQAIe0DAADlAwAg7gMAAOUDACADnAMAADIAIJ0DAAAyACCeAwAAMgAgDRMAAOwEACDzAgAA6wQAMPQCAAA2ABD1AgAA6wQAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIZ8DAQDJBAAhpwNAAOkEACGuAwEAyQQAIa8DAQDaBAAh7QMAADYAIO4DAAA2ACACiQMBAAAAAcQDAQAAAAEJDQAApwUAIBEAAJ8FACDzAgAAqwUAMPQCAAAqABD1AgAAqwUAMPYCAQDJBAAh-gJAAMoEACGJAwEAyQQAIcQDAQDJBAAhEg0AAKcFACDzAgAArAUAMPQCAAAlABD1AgAArAUAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIYcDAQDJBAAhiAMBAMkEACGJAwEAyQQAIYoDAQDaBAAhiwMBANoEACGMAwEA2gQAIY0DQADpBAAhjgNAAOkEACGPAwEA2gQAIZADAQDaBAAhkQMBANoEACEMDQAApwUAIPMCAACtBQAw9AIAACEAEPUCAACtBQAw9gIBAMkEACH5AkAAygQAIfoCQADKBAAh-wJAAMoEACGJAwEAyQQAIZIDAQDJBAAhkwMBANoEACGUAwEA2gQAIQKJAwEAAAABtQMBAAAAARIJAACXBQAgCwAAsQUAIA0AAKcFACAXAADeBAAg8wIAAK8FADD0AgAAHQAQ9QIAAK8FADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGJAwEAyQQAIZsDAACwBcoDIrUDAQDJBAAhxgMCAOgEACHHAwEA2gQAIcgDAQDaBAAhygMBANoEACHLAwIA6AQAIQT8AgAAAMoDAv0CAAAAygMI_gIAAADKAwiDAwAAgQXKAyIDnAMAAD4AIJ0DAAA-ACCeAwAAPgAgCwkAAJcFACATAgDoBAAh8wIAALIFADD0AgAAFwAQ9QIAALIFADD2AgEAyQQAIfoCQADKBAAhtQMBAMkEACHFAwEAyQQAIeMDAQDaBAAh5AMgANkEACEPCAAAtQUAIAkAALYFACAKAAC3BQAg8wIAALMFADD0AgAADAAQ9QIAALMFADD2AgEAyQQAIfoCQADKBAAhsgMBAMkEACGzAwEAyQQAIbQDAQDaBAAhtQMBANoEACG2AwEA2gQAIbcDAQDaBAAhuAMCALQFACEI_AICAAAAAf0CAgAAAAX-AgIAAAAF_wICAAAAAYADAgAAAAGBAwIAAAABggMCAAAAAYMDAgDPBAAhEAYAAPUEACDzAgAA9AQAMPQCAADoAgAQ9QIAAPQEADD2AgEAyQQAIYkDAQDaBAAhkwMBANoEACGUAwEA2gQAIbcDAQDaBAAhuQMBAMkEACG6A0AAygQAIbsDAQDaBAAhvAMBANoEACG9AwEA2gQAIe0DAADoAgAg7gMAAOgCACAeBgAA9QQAIAoAALcFACALAAC5BQAgDAAAugUAIBAAAN0EACAYAACoBQAgGQAAuwUAIBoAALwFACDzAgAAuAUAMPQCAAAJABD1AgAAuAUAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIZUDAQDJBAAhsQMBANoEACG2AwEA2gQAIc0DEAChBQAhzgMQAKIFACHgAwEA2gQAIeEDAQDaBAAh4gMBANoEACHlAwEA2gQAIeYDIADZBAAh5wMQAKIFACHoAxAAogUAIekDIADZBAAh6gMCAOgEACHtAwAACQAg7gMAAAkAIBQBAAC3BQAgBAAAvgUAIAUAAL8FACAGAAD1BAAg8wIAAL0FADD0AgAAAwAQ9QIAAL0FADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGVAwEAyQQAIZgDAQDaBAAhsQMBANoEACHeAwEA2gQAId8DAQDaBAAh4AMBANoEACHhAwEA2gQAIeIDAQDaBAAh7QMAAAMAIO4DAAADACAcBgAA9QQAIAoAALcFACALAAC5BQAgDAAAugUAIBAAAN0EACAYAACoBQAgGQAAuwUAIBoAALwFACDzAgAAuAUAMPQCAAAJABD1AgAAuAUAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIZUDAQDJBAAhsQMBANoEACG2AwEA2gQAIc0DEAChBQAhzgMQAKIFACHgAwEA2gQAIeEDAQDaBAAh4gMBANoEACHlAwEA2gQAIeYDIADZBAAh5wMQAKIFACHoAxAAogUAIekDIADZBAAh6gMCAOgEACEDnAMAABcAIJ0DAAAXACCeAwAAFwAgDQkAAJcFACDzAgAAlgUAMPQCAAAbABD1AgAAlgUAMPYCAQDJBAAh-wJAAMoEACG1AwEAyQQAId4DAQDaBAAh4AMBANoEACHhAwEA2gQAIeIDAQDaBAAh7QMAABsAIO4DAAAbACADnAMAAEYAIJ0DAABGACCeAwAARgAgA5wDAABKACCdAwAASgAgngMAAEoAIBIBAAC3BQAgBAAAvgUAIAUAAL8FACAGAAD1BAAg8wIAAL0FADD0AgAAAwAQ9QIAAL0FADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGVAwEAyQQAIZgDAQDaBAAhsQMBANoEACHeAwEA2gQAId8DAQDaBAAh4AMBANoEACHhAwEA2gQAIeIDAQDaBAAhA5wDAAADACCdAwAAAwAgngMAAAMAIAOcAwAACQAgnQMAAAkAIJ4DAAAJACAAAAAB8gMBAAAAAQHyA0AAAAABAAAAAAHyAwEAAAABAfIDQAAAAAEFJwAAxgkAICgAAMkJACDvAwAAxwkAIPADAADICQAg9QMAAOIDACADJwAAxgkAIO8DAADHCQAg9QMAAOIDACAAAAAFJwAAwQkAICgAAMQJACDvAwAAwgkAIPADAADDCQAg9QMAAOIDACADJwAAwQkAIO8DAADCCQAg9QMAAOIDACAAAAAB8gMgAAAAAQsnAADHBgAwKAAAzAYAMO8DAADIBgAw8AMAAMkGADDxAwAAygYAIPIDAADLBgAw8wMAAMsGADD0AwAAywYAMPUDAADLBgAw9gMAAM0GADD3AwAAzgYAMAsnAAC7BgAwKAAAwAYAMO8DAAC8BgAw8AMAAL0GADDxAwAAvgYAIPIDAAC_BgAw8wMAAL8GADD0AwAAvwYAMPUDAAC_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_gUAICgAAPwFACABIAAAvwkAMA0JAACXBQAgEwAA7AQAIPMCAACgBQAw9AIAADIAEPUCAACgBQAw9gIBAAAAAfoCQADKBAAhnwMBAMkEACG1AwEAyQQAIcwDAgDoBAAhzQMQAKEFACHOAxAAogUAIc8DEAChBQAhAgAAADQAICAAAPwFACACAAAA-QUAICAAAPoFACAL8wIAAPgFADD0AgAA-QUAEPUCAAD4BQAw9gIBAMkEACH6AkAAygQAIZ8DAQDJBAAhtQMBAMkEACHMAwIA6AQAIc0DEAChBQAhzgMQAKIFACHPAxAAoQUAIQvzAgAA-AUAMPQCAAD5BQAQ9QIAAPgFADD2AgEAyQQAIfoCQADKBAAhnwMBAMkEACG1AwEAyQQAIcwDAgDoBAAhzQMQAKEFACHOAxAAogUAIc8DEAChBQAhB_YCAQDDBQAh-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_YCAQAAAAH6AkAAAAABxQMBAAAAAQ0JAAC4BgAgCwAAuQYAIBcAALoGACD2AgEAAAAB-gJAAAAAAfsCQAAAAAGbAwAAAMoDArUDAQAAAAHGAwIAAAABxwMBAAAAAcgDAQAAAAHKAwEAAAABywMCAAAAAQMnAACnCQAg7wMAAKgJACD1AwAAAQAgBCcAAKsGADDvAwAArAYAMPEDAACuBgAg9QMAAK8GADAEJwAAoAYAMO8DAAChBgAw8QMAAKMGACD1AwAAhwYAMA32AgEAAAAB-gJAAAAAAfsCQAAAAAGHAwEAAAABiAMBAAAAAYoDAQAAAAGLAwEAAAABjAMBAAAAAY0DQAAAAAGOA0AAAAABjwMBAAAAAZADAQAAAAGRAwEAAAABAgAAACcAICcAAMYGACADAAAAJwAgJwAAxgYAICgAAMUGACABIAAApgkAMBINAACnBQAg8wIAAKwFADD0AgAAJQAQ9QIAAKwFADD2AgEAAAAB-gJAAMoEACH7AkAAygQAIYcDAQDJBAAhiAMBAMkEACGJAwEAyQQAIYoDAQDaBAAhiwMBANoEACGMAwEA2gQAIY0DQADpBAAhjgNAAOkEACGPAwEA2gQAIZADAQDaBAAhkQMBANoEACECAAAAJwAgIAAAxQYAIAIAAADDBgAgIAAAxAYAIBHzAgAAwgYAMPQCAADDBgAQ9QIAAMIGADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGHAwEAyQQAIYgDAQDJBAAhiQMBAMkEACGKAwEA2gQAIYsDAQDaBAAhjAMBANoEACGNA0AA6QQAIY4DQADpBAAhjwMBANoEACGQAwEA2gQAIZEDAQDaBAAhEfMCAADCBgAw9AIAAMMGABD1AgAAwgYAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIYcDAQDJBAAhiAMBAMkEACGJAwEAyQQAIYoDAQDaBAAhiwMBANoEACGMAwEA2gQAIY0DQADpBAAhjgNAAOkEACGPAwEA2gQAIZADAQDaBAAhkQMBANoEACEN9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhhwMBAMMFACGIAwEAwwUAIYoDAQDJBQAhiwMBAMkFACGMAwEAyQUAIY0DQADKBQAhjgNAAMoFACGPAwEAyQUAIZADAQDJBQAhkQMBAMkFACEN9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhhwMBAMMFACGIAwEAwwUAIYoDAQDJBQAhiwMBAMkFACGMAwEAyQUAIY0DQADKBQAhjgNAAMoFACGPAwEAyQUAIZADAQDJBQAhkQMBAMkFACEN9gIBAAAAAfoCQAAAAAH7AkAAAAABhwMBAAAAAYgDAQAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNA0AAAAABjgNAAAAAAY8DAQAAAAGQAwEAAAABkQMBAAAAAQf2AgEAAAAB-QJAAAAAAfoCQAAAAAH7AkAAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABAgAAACMAICcAANIGACADAAAAIwAgJwAA0gYAICgAANEGACABIAAApQkAMAwNAACnBQAg8wIAAK0FADD0AgAAIQAQ9QIAAK0FADD2AgEAAAAB-QJAAMoEACH6AkAAygQAIfsCQADKBAAhiQMBAMkEACGSAwEAAAABkwMBANoEACGUAwEA2gQAIQIAAAAjACAgAADRBgAgAgAAAM8GACAgAADQBgAgC_MCAADOBgAw9AIAAM8GABD1AgAAzgYAMPYCAQDJBAAh-QJAAMoEACH6AkAAygQAIfsCQADKBAAhiQMBAMkEACGSAwEAyQQAIZMDAQDaBAAhlAMBANoEACEL8wIAAM4GADD0AgAAzwYAEPUCAADOBgAw9gIBAMkEACH5AkAAygQAIfoCQADKBAAh-wJAAMoEACGJAwEAyQQAIZIDAQDJBAAhkwMBANoEACGUAwEA2gQAIQf2AgEAwwUAIfkCQADEBQAh-gJAAMQFACH7AkAAxAUAIZIDAQDDBQAhkwMBAMkFACGUAwEAyQUAIQf2AgEAwwUAIfkCQADEBQAh-gJAAMQFACH7AkAAxAUAIZIDAQDDBQAhkwMBAMkFACGUAwEAyQUAIQf2AgEAAAAB-QJAAAAAAfoCQAAAAAH7AkAAAAABkgMBAAAAAZMDAQAAAAGUAwEAAAABBCcAAMcGADDvAwAAyAYAMPEDAADKBgAg9QMAAMsGADAEJwAAuwYAMO8DAAC8BgAw8QMAAL4GACD1AwAAvwYAMAQnAACRBgAw7wMAAJIGADDxAwAAlAYAIPUDAACVBgAwBCcAAIMGADDvAwAAhAYAMPEDAACGBgAg9QMAAIcGADAEJwAA2wUAMO8DAADcBQAw8QMAAN4FACD1AwAA3wUAMAAAAAAAAAAAAAAAAAAFJwAAoAkAICgAAKMJACDvAwAAoQkAIPADAACiCQAg9QMAADAAIAMnAACgCQAg7wMAAKEJACD1AwAAMAAgCw0AAMkIACAUAADKCAAgFQAAywgAIK4DAADFBQAg0wMAAMUFACDUAwAAxQUAINUDAADFBQAg1wMAAMUFACDZAwAAxQUAINoDAADFBQAg3QMAAMUFACAAAAAAAAAAAAXyAwIAAAAB-AMCAAAAAfkDAgAAAAH6AwIAAAAB-wMCAAAAAQUnAACVCQAgKAAAngkAIO8DAACWCQAg8AMAAJ0JACD1AwAA5QIAIAcnAACTCQAgKAAAmwkAIO8DAACUCQAg8AMAAJoJACDzAwAACQAg9AMAAAkAIPUDAAABACAHJwAAkQkAICgAAJgJACDvAwAAkgkAIPADAACXCQAg8wMAAAMAIPQDAAADACD1AwAABwAgAycAAJUJACDvAwAAlgkAIPUDAADlAgAgAycAAJMJACDvAwAAlAkAIPUDAAABACADJwAAkQkAIO8DAACSCQAg9QMAAAcAIAAAAAsnAAD7BgAwKAAAgAcAMO8DAAD8BgAw8AMAAP0GADDxAwAA_gYAIPIDAAD_BgAw8wMAAP8GADD0AwAA_wYAMPUDAAD_BgAw9gMAAIEHADD3AwAAggcAMAoJAAD1BgAgCgAA9gYAIPYCAQAAAAH6AkAAAAABswMBAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4AwIAAAABAgAAAA4AICcAAIYHACADAAAADgAgJwAAhgcAICgAAIUHACABIAAAkAkAMA8IAAC1BQAgCQAAtgUAIAoAALcFACDzAgAAswUAMPQCAAAMABD1AgAAswUAMPYCAQAAAAH6AkAAygQAIbIDAQDJBAAhswMBAMkEACG0AwEA2gQAIbUDAQDaBAAhtgMBANoEACG3AwEA2gQAIbgDAgC0BQAhAgAAAA4AICAAAIUHACACAAAAgwcAICAAAIQHACAM8wIAAIIHADD0AgAAgwcAEPUCAACCBwAw9gIBAMkEACH6AkAAygQAIbIDAQDJBAAhswMBAMkEACG0AwEA2gQAIbUDAQDaBAAhtgMBANoEACG3AwEA2gQAIbgDAgC0BQAhDPMCAACCBwAw9AIAAIMHABD1AgAAggcAMPYCAQDJBAAh-gJAAMoEACGyAwEAyQQAIbMDAQDJBAAhtAMBANoEACG1AwEA2gQAIbYDAQDaBAAhtwMBANoEACG4AwIAtAUAIQj2AgEAwwUAIfoCQADEBQAhswMBAMMFACG0AwEAyQUAIbUDAQDJBQAhtgMBAMkFACG3AwEAyQUAIbgDAgDwBgAhCgkAAPIGACAKAADzBgAg9gIBAMMFACH6AkAAxAUAIbMDAQDDBQAhtAMBAMkFACG1AwEAyQUAIbYDAQDJBQAhtwMBAMkFACG4AwIA8AYAIQoJAAD1BgAgCgAA9gYAIPYCAQAAAAH6AkAAAAABswMBAAAAAbQDAQAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4AwIAAAABBCcAAPsGADDvAwAA_AYAMPEDAAD-BgAg9QMAAP8GADAAAAAAAfIDAAAAwgMCAAAAAAAABScAAIsJACAoAACOCQAg7wMAAIwJACDwAwAAjQkAIPUDAAAfACADJwAAiwkAIO8DAACMCQAg9QMAAB8AIAAAAAAABScAAIYJACAoAACJCQAg7wMAAIcJACDwAwAAiAkAIPUDAADiAwAgAycAAIYJACDvAwAAhwkAIPUDAADiAwAgAAAABScAAIEJACAoAACECQAg7wMAAIIJACDwAwAAgwkAIPUDAAABACADJwAAgQkAIO8DAACCCQAg9QMAAAEAIAAAAAAABScAAPwIACAoAAD_CAAg7wMAAP0IACDwAwAA_ggAIPUDAAABACADJwAA_AgAIO8DAAD9CAAg9QMAAAEAIAAAAAAABScAAPcIACAoAAD6CAAg7wMAAPgIACDwAwAA-QgAIPUDAAAwACADJwAA9wgAIO8DAAD4CAAg9QMAADAAIAAAAAAABScAAPIIACAoAAD1CAAg7wMAAPMIACDwAwAA9AgAIPUDAADiAwAgAycAAPIIACDvAwAA8wgAIPUDAADiAwAgAAAABycAAOQIACAoAADwCAAg7wMAAOUIACDwAwAA7wgAIPMDAAADACD0AwAAAwAg9QMAAAcAIAsnAACkCAAwKAAAqQgAMO8DAAClCAAw8AMAAKYIADDxAwAApwgAIPIDAACoCAAw8wMAAKgIADD0AwAAqAgAMPUDAACoCAAw9gMAAKoIADD3AwAAqwgAMAsnAADGBwAwKAAAywcAMO8DAADHBwAw8AMAAMgHADDxAwAAyQcAIPIDAADKBwAw8wMAAMoHADD0AwAAygcAMPUDAADKBwAw9gMAAMwHADD3AwAAzQcAMAsnAAC9BwAwKAAAwQcAMO8DAAC-BwAw8AMAAL8HADDxAwAAwAcAIPIDAAD_BgAw8wMAAP8GADD0AwAA_wYAMPUDAAD_BgAw9gMAAMIHADD3AwAAggcAMAoIAAD0BgAgCQAA9QYAIPYCAQAAAAH6AkAAAAABsgMBAAAAAbMDAQAAAAG0AwEAAAABtQMBAAAAAbcDAQAAAAG4AwIAAAABAgAAAA4AICcAAMUHACADAAAADgAgJwAAxQcAICgAAMQHACABIAAA7ggAMAIAAAAOACAgAADEBwAgAgAAAIMHACAgAADDBwAgCPYCAQDDBQAh-gJAAMQFACGyAwEAwwUAIbMDAQDDBQAhtAMBAMkFACG1AwEAyQUAIbcDAQDJBQAhuAMCAPAGACEKCAAA8QYAIAkAAPIGACD2AgEAwwUAIfoCQADEBQAhsgMBAMMFACGzAwEAwwUAIbQDAQDJBQAhtQMBAMkFACG3AwEAyQUAIbgDAgDwBgAhCggAAPQGACAJAAD1BgAg9gIBAAAAAfoCQAAAAAGyAwEAAAABswMBAAAAAbQDAQAAAAG1AwEAAAABtwMBAAAAAbgDAgAAAAEXBgAAowgAIAsAAJ0IACAMAACeCAAgEAAAnwgAIBgAAKAIACAZAAChCAAgGgAAoggAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAZUDAQAAAAGxAwEAAAABzQMQAAAAAc4DEAAAAAHgAwEAAAAB4QMBAAAAAeIDAQAAAAHlAwEAAAAB5gMgAAAAAecDEAAAAAHoAxAAAAAB6QMgAAAAAeoDAgAAAAECAAAAAQAgJwAAnAgAIAMAAAABACAnAACcCAAgKAAA0AcAIAEgAADtCAAwHAYAAPUEACAKAAC3BQAgCwAAuQUAIAwAALoFACAQAADdBAAgGAAAqAUAIBkAALsFACAaAAC8BQAg8wIAALgFADD0AgAACQAQ9QIAALgFADD2AgEAAAAB-gJAAMoEACH7AkAAygQAIZUDAQDJBAAhsQMBANoEACG2AwEA2gQAIc0DEAChBQAhzgMQAKIFACHgAwEA2gQAIeEDAQDaBAAh4gMBANoEACHlAwEAAAAB5gMgANkEACHnAxAAogUAIegDEACiBQAh6QMgANkEACHqAwIA6AQAIQIAAAABACAgAADQBwAgAgAAAM4HACAgAADPBwAgFPMCAADNBwAw9AIAAM4HABD1AgAAzQcAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIZUDAQDJBAAhsQMBANoEACG2AwEA2gQAIc0DEAChBQAhzgMQAKIFACHgAwEA2gQAIeEDAQDaBAAh4gMBANoEACHlAwEA2gQAIeYDIADZBAAh5wMQAKIFACHoAxAAogUAIekDIADZBAAh6gMCAOgEACEU8wIAAM0HADD0AgAAzgcAEPUCAADNBwAw9gIBAMkEACH6AkAAygQAIfsCQADKBAAhlQMBAMkEACGxAwEA2gQAIbYDAQDaBAAhzQMQAKEFACHOAxAAogUAIeADAQDaBAAh4QMBANoEACHiAwEA2gQAIeUDAQDaBAAh5gMgANkEACHnAxAAogUAIegDEACiBQAh6QMgANkEACHqAwIA6AQAIRD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIbEDAQDJBQAhzQMQAOYFACHOAxAA5wUAIeADAQDJBQAh4QMBAMkFACHiAwEAyQUAIeUDAQDJBQAh5gMgANUFACHnAxAA5wUAIegDEADnBQAh6QMgANUFACHqAwIA-wUAIRcGAADXBwAgCwAA0QcAIAwAANIHACAQAADTBwAgGAAA1AcAIBkAANUHACAaAADWBwAg9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhlQMBAMMFACGxAwEAyQUAIc0DEADmBQAhzgMQAOcFACHgAwEAyQUAIeEDAQDJBQAh4gMBAMkFACHlAwEAyQUAIeYDIADVBQAh5wMQAOcFACHoAxAA5wUAIekDIADVBQAh6gMCAPsFACELJwAAkAgAMCgAAJUIADDvAwAAkQgAMPADAACSCAAw8QMAAJMIACDyAwAAlAgAMPMDAACUCAAw9AMAAJQIADD1AwAAlAgAMPYDAACWCAAw9wMAAJcIADAHJwAAiwgAICgAAI4IACDvAwAAjAgAIPADAACNCAAg8wMAABsAIPQDAAAbACD1AwAAggEAIAsnAACCCAAwKAAAhggAMO8DAACDCAAw8AMAAIQIADDxAwAAhQgAIPIDAACVBgAw8wMAAJUGADD0AwAAlQYAMPUDAACVBgAw9gMAAIcIADD3AwAAmAYAMAsnAAD5BwAwKAAA_QcAMO8DAAD6BwAw8AMAAPsHADDxAwAA_AcAIPIDAAD1BQAw8wMAAPUFADD0AwAA9QUAMPUDAAD1BQAw9gMAAP4HADD3AwAA-AUAMAsnAADtBwAwKAAA8gcAMO8DAADuBwAw8AMAAO8HADDxAwAA8AcAIPIDAADxBwAw8wMAAPEHADD0AwAA8QcAMPUDAADxBwAw9gMAAPMHADD3AwAA9AcAMAsnAADhBwAwKAAA5gcAMO8DAADiBwAw8AMAAOMHADDxAwAA5AcAIPIDAADlBwAw8wMAAOUHADD0AwAA5QcAMPUDAADlBwAw9gMAAOcHADD3AwAA6AcAMAsnAADYBwAwKAAA3AcAMO8DAADZBwAw8AMAANoHADDxAwAA2wcAIPIDAAD_BgAw8wMAAP8GADD0AwAA_wYAMPUDAAD_BgAw9gMAAN0HADD3AwAAggcAMAoIAAD0BgAgCgAA9gYAIPYCAQAAAAH6AkAAAAABsgMBAAAAAbMDAQAAAAG0AwEAAAABtgMBAAAAAbcDAQAAAAG4AwIAAAABAgAAAA4AICcAAOAHACADAAAADgAgJwAA4AcAICgAAN8HACABIAAA7AgAMAIAAAAOACAgAADfBwAgAgAAAIMHACAgAADeBwAgCPYCAQDDBQAh-gJAAMQFACGyAwEAwwUAIbMDAQDDBQAhtAMBAMkFACG2AwEAyQUAIbcDAQDJBQAhuAMCAPAGACEKCAAA8QYAIAoAAPMGACD2AgEAwwUAIfoCQADEBQAhsgMBAMMFACGzAwEAwwUAIbQDAQDJBQAhtgMBAMkFACG3AwEAyQUAIbgDAgDwBgAhCggAAPQGACAKAAD2BgAg9gIBAAAAAfoCQAAAAAGyAwEAAAABswMBAAAAAbQDAQAAAAG2AwEAAAABtwMBAAAAAbgDAgAAAAED9gIBAAAAAfoCQAAAAAGJAwEAAAABAgAAAEwAICcAAOwHACADAAAATAAgJwAA7AcAICgAAOsHACABIAAA6wgAMAkJAACXBQAg8wIAAJsFADD0AgAASgAQ9QIAAJsFADD2AgEAAAAB-gJAAMoEACGJAwEAyQQAIbUDAQDJBAAh6wMAAJoFACACAAAATAAgIAAA6wcAIAIAAADpBwAgIAAA6gcAIAfzAgAA6AcAMPQCAADpBwAQ9QIAAOgHADD2AgEAyQQAIfoCQADKBAAhiQMBAMkEACG1AwEAyQQAIQfzAgAA6AcAMPQCAADpBwAQ9QIAAOgHADD2AgEAyQQAIfoCQADKBAAhiQMBAMkEACG1AwEAyQQAIQP2AgEAwwUAIfoCQADEBQAhiQMBAMMFACED9gIBAMMFACH6AkAAxAUAIYkDAQDDBQAhA_YCAQAAAAH6AkAAAAABiQMBAAAAAQX2AgEAAAAB-gJAAAAAAfsCQAAAAAGJAwEAAAABzAMCAAAAAQIAAABIACAnAAD4BwAgAwAAAEgAICcAAPgHACAoAAD3BwAgASAAAOoIADALCQAAlwUAIPMCAACdBQAw9AIAAEYAEPUCAACdBQAw9gIBAAAAAfoCQADKBAAh-wJAAMoEACGJAwEAyQQAIbUDAQDJBAAhzAMCAOgEACHrAwAAnAUAIAIAAABIACAgAAD3BwAgAgAAAPUHACAgAAD2BwAgCfMCAAD0BwAw9AIAAPUHABD1AgAA9AcAMPYCAQDJBAAh-gJAAMoEACH7AkAAygQAIYkDAQDJBAAhtQMBAMkEACHMAwIA6AQAIQnzAgAA9AcAMPQCAAD1BwAQ9QIAAPQHADD2AgEAyQQAIfoCQADKBAAh-wJAAMoEACGJAwEAyQQAIbUDAQDJBAAhzAMCAOgEACEF9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhiQMBAMMFACHMAwIA-wUAIQX2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGJAwEAwwUAIcwDAgD7BQAhBfYCAQAAAAH6AkAAAAAB-wJAAAAAAYkDAQAAAAHMAwIAAAABCBMAAK4HACD2AgEAAAAB-gJAAAAAAZ8DAQAAAAHMAwIAAAABzQMQAAAAAc4DEAAAAAHPAxAAAAABAgAAADQAICcAAIEIACADAAAANAAgJwAAgQgAICgAAIAIACABIAAA6QgAMAIAAAA0ACAgAACACAAgAgAAAPkFACAgAAD_BwAgB_YCAQDDBQAh-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_AcAIPUDAAD1BQAwBCcAAO0HADDvAwAA7gcAMPEDAADwBwAg9QMAAPEHADAEJwAA4QcAMO8DAADiBwAw8QMAAOQHACD1AwAA5QcAMAQnAADYBwAw7wMAANkHADDxAwAA2wcAIPUDAAD_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-wJAAAAAAYkDAQAAAAHMAwIAAAABA_YCAQAAAAH6AkAAAAABiQMBAAAAAQj2AgEAAAAB-gJAAAAAAbIDAQAAAAGzAwEAAAABtAMBAAAAAbYDAQAAAAG3AwEAAAABuAMCAAAAARD2AgEAAAAB-gJAAAAAAfsCQAAAAAGVAwEAAAABsQMBAAAAAc0DEAAAAAHOAxAAAAAB4AMBAAAAAeEDAQAAAAHiAwEAAAAB5QMBAAAAAeYDIAAAAAHnAxAAAAAB6AMQAAAAAekDIAAAAAHqAwIAAAABCPYCAQAAAAH6AkAAAAABsgMBAAAAAbMDAQAAAAG0AwEAAAABtQMBAAAAAbcDAQAAAAG4AwIAAAABAwAAAAMAICcAAOQIACAoAADxCAAgEAAAAAMAIAEAALkHACAFAAC7BwAgBgAAvAcAICAAAPEIACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIZgDAQDJBQAhsQMBAMkFACHeAwEAyQUAId8DAQDJBQAh4AMBAMkFACHhAwEAyQUAIeIDAQDJBQAhDgEAALkHACAFAAC7BwAgBgAAvAcAIPYCAQDDBQAh-gJAAMQFACH7AkAAxAUAIZUDAQDDBQAhmAMBAMkFACGxAwEAyQUAId4DAQDJBQAh3wMBAMkFACHgAwEAyQUAIeEDAQDJBQAh4gMBAMkFACEODgAA0wYAIA8AANQGACAQAADVBgAgEgAA1gYAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAZUDAQAAAAGWAwEAAAABlwMgAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAECAAAA4gMAICcAAPIIACADAAAA5QMAICcAAPIIACAoAAD2CAAgEAAAAOUDACAOAADWBQAgDwAA1wUAIBAAANgFACASAADZBQAgIAAA9ggAIPYCAQDDBQAh-gJAAMQFACH7AkAAxAUAIZUDAQDDBQAhlgMBAMMFACGXAyAA1QUAIZgDAQDJBQAhmQMBAMkFACGaAwEAyQUAIZsDAQDJBQAhDg4AANYFACAPAADXBQAgEAAA2AUAIBIAANkFACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIZYDAQDDBQAhlwMgANUFACGYAwEAyQUAIZkDAQDJBQAhmgMBAMkFACGbAwEAyQUAIRUNAAC1BwAgFQAAggYAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAYkDAQAAAAGbAwAAANEDAqADAQAAAAGuAwEAAAAB0QMQAAAAAdIDEAAAAAHTAxAAAAAB1AMQAAAAAdUDEAAAAAHWAyAAAAAB1wNAAAAAAdgDgAAAAAHZA4AAAAAB2gMBAAAAAdwDAAAA3AMC3QMBAAAAAQIAAAAwACAnAAD3CAAgAwAAAC4AICcAAPcIACAoAAD7CAAgFwAAAC4AIA0AALQHACAVAADrBQAgIAAA-wgAIPYCAQDDBQAh-gJAAMQFACH7AkAAxAUAIYkDAQDDBQAhmwMAAOUF0QMioAMBAMMFACGuAwEAyQUAIdEDEADmBQAh0gMQAOYFACHTAxAA5wUAIdQDEADnBQAh1QMQAOcFACHWAyAA1QUAIdcDQADKBQAh2AOAAAAAAdkDgAAAAAHaAwEAyQUAIdwDAADoBdwDIt0DAQDJBQAhFQ0AALQHACAVAADrBQAg9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhiQMBAMMFACGbAwAA5QXRAyKgAwEAwwUAIa4DAQDJBQAh0QMQAOYFACHSAxAA5gUAIdMDEADnBQAh1AMQAOcFACHVAxAA5wUAIdYDIADVBQAh1wNAAMoFACHYA4AAAAAB2QOAAAAAAdoDAQDJBQAh3AMAAOgF3AMi3QMBAMkFACEYBgAAowgAIAoAAMcIACALAACdCAAgDAAAnggAIBAAAJ8IACAYAACgCAAgGgAAoggAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAZUDAQAAAAGxAwEAAAABtgMBAAAAAc0DEAAAAAHOAxAAAAAB4AMBAAAAAeEDAQAAAAHiAwEAAAAB5QMBAAAAAeYDIAAAAAHnAxAAAAAB6AMQAAAAAekDIAAAAAHqAwIAAAABAgAAAAEAICcAAPwIACADAAAACQAgJwAA_AgAICgAAIAJACAaAAAACQAgBgAA1wcAIAoAAMYIACALAADRBwAgDAAA0gcAIBAAANMHACAYAADUBwAgGgAA1gcAICAAAIAJACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIbEDAQDJBQAhtgMBAMkFACHNAxAA5gUAIc4DEADnBQAh4AMBAMkFACHhAwEAyQUAIeIDAQDJBQAh5QMBAMkFACHmAyAA1QUAIecDEADnBQAh6AMQAOcFACHpAyAA1QUAIeoDAgD7BQAhGAYAANcHACAKAADGCAAgCwAA0QcAIAwAANIHACAQAADTBwAgGAAA1AcAIBoAANYHACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIbEDAQDJBQAhtgMBAMkFACHNAxAA5gUAIc4DEADnBQAh4AMBAMkFACHhAwEAyQUAIeIDAQDJBQAh5QMBAMkFACHmAyAA1QUAIecDEADnBQAh6AMQAOcFACHpAyAA1QUAIeoDAgD7BQAhGAYAAKMIACAKAADHCAAgCwAAnQgAIAwAAJ4IACAQAACfCAAgGAAAoAgAIBkAAKEIACD2AgEAAAAB-gJAAAAAAfsCQAAAAAGVAwEAAAABsQMBAAAAAbYDAQAAAAHNAxAAAAABzgMQAAAAAeADAQAAAAHhAwEAAAAB4gMBAAAAAeUDAQAAAAHmAyAAAAAB5wMQAAAAAegDEAAAAAHpAyAAAAAB6gMCAAAAAQIAAAABACAnAACBCQAgAwAAAAkAICcAAIEJACAoAACFCQAgGgAAAAkAIAYAANcHACAKAADGCAAgCwAA0QcAIAwAANIHACAQAADTBwAgGAAA1AcAIBkAANUHACAgAACFCQAg9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhlQMBAMMFACGxAwEAyQUAIbYDAQDJBQAhzQMQAOYFACHOAxAA5wUAIeADAQDJBQAh4QMBAMkFACHiAwEAyQUAIeUDAQDJBQAh5gMgANUFACHnAxAA5wUAIegDEADnBQAh6QMgANUFACHqAwIA-wUAIRgGAADXBwAgCgAAxggAIAsAANEHACAMAADSBwAgEAAA0wcAIBgAANQHACAZAADVBwAg9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhlQMBAMMFACGxAwEAyQUAIbYDAQDJBQAhzQMQAOYFACHOAxAA5wUAIeADAQDJBQAh4QMBAMkFACHiAwEAyQUAIeUDAQDJBQAh5gMgANUFACHnAxAA5wUAIegDEADnBQAh6QMgANUFACHqAwIA-wUAIQ4OAADTBgAgDwAA1AYAIBIAANYGACAWAADXBgAg9gIBAAAAAfoCQAAAAAH7AkAAAAABlQMBAAAAAZYDAQAAAAGXAyAAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAQIAAADiAwAgJwAAhgkAIAMAAADlAwAgJwAAhgkAICgAAIoJACAQAAAA5QMAIA4AANYFACAPAADXBQAgEgAA2QUAIBYAANoFACAgAACKCQAg9gIBAMMFACH6AkAAxAUAIfsCQADEBQAhlQMBAMMFACGWAwEAwwUAIZcDIADVBQAhmAMBAMkFACGZAwEAyQUAIZoDAQDJBQAhmwMBAMkFACEODgAA1gUAIA8AANcFACASAADZBQAgFgAA2gUAIPYCAQDDBQAh-gJAAMQFACH7AkAAxAUAIZUDAQDDBQAhlgMBAMMFACGXAyAA1QUAIZgDAQDJBQAhmQMBAMkFACGaAwEAyQUAIZsDAQDJBQAhDgkAALgGACANAACbBwAgFwAAugYAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAYkDAQAAAAGbAwAAAMoDArUDAQAAAAHGAwIAAAABxwMBAAAAAcgDAQAAAAHKAwEAAAABywMCAAAAAQIAAAAfACAnAACLCQAgAwAAAB0AICcAAIsJACAoAACPCQAgEAAAAB0AIAkAAJ0GACANAACaBwAgFwAAnwYAICAAAI8JACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGJAwEAwwUAIZsDAACbBsoDIrUDAQDDBQAhxgMCAPsFACHHAwEAyQUAIcgDAQDJBQAhygMBAMkFACHLAwIA-wUAIQ4JAACdBgAgDQAAmgcAIBcAAJ8GACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGJAwEAwwUAIZsDAACbBsoDIrUDAQDDBQAhxgMCAPsFACHHAwEAyQUAIcgDAQDJBQAhygMBAMkFACHLAwIA-wUAIQj2AgEAAAAB-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_YCAQAAAAH5AkAAAAAB-gJAAAAAAfsCQAAAAAGSAwEAAAABkwMBAAAAAZQDAQAAAAEN9gIBAAAAAfoCQAAAAAH7AkAAAAABhwMBAAAAAYgDAQAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNA0AAAAABjgNAAAAAAY8DAQAAAAGQAwEAAAABkQMBAAAAARgGAACjCAAgCgAAxwgAIAsAAJ0IACAMAACeCAAgGAAAoAgAIBkAAKEIACAaAACiCAAg9gIBAAAAAfoCQAAAAAH7AkAAAAABlQMBAAAAAbEDAQAAAAG2AwEAAAABzQMQAAAAAc4DEAAAAAHgAwEAAAAB4QMBAAAAAeIDAQAAAAHlAwEAAAAB5gMgAAAAAecDEAAAAAHoAxAAAAAB6QMgAAAAAeoDAgAAAAECAAAAAQAgJwAApwkAIAP2AgEAAAAB-gJAAAAAAcUDAQAAAAEODgAA0wYAIA8AANQGACAQAADVBgAgFgAA1wYAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAZUDAQAAAAGWAwEAAAABlwMgAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAECAAAA4gMAICcAAKoJACADAAAA5QMAICcAAKoJACAoAACuCQAgEAAAAOUDACAOAADWBQAgDwAA1wUAIBAAANgFACAWAADaBQAgIAAArgkAIPYCAQDDBQAh-gJAAMQFACH7AkAAxAUAIZUDAQDDBQAhlgMBAMMFACGXAyAA1QUAIZgDAQDJBQAhmQMBAMkFACGaAwEAyQUAIZsDAQDJBQAhDg4AANYFACAPAADXBQAgEAAA2AUAIBYAANoFACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIZYDAQDDBQAhlwMgANUFACGYAwEAyQUAIZkDAQDJBQAhmgMBAMkFACGbAwEAyQUAIQP2AgEAAAAB-gJAAAAAAYkDAQAAAAEDAAAACQAgJwAApwkAICgAALIJACAaAAAACQAgBgAA1wcAIAoAAMYIACALAADRBwAgDAAA0gcAIBgAANQHACAZAADVBwAgGgAA1gcAICAAALIJACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIbEDAQDJBQAhtgMBAMkFACHNAxAA5gUAIc4DEADnBQAh4AMBAMkFACHhAwEAyQUAIeIDAQDJBQAh5QMBAMkFACHmAyAA1QUAIecDEADnBQAh6AMQAOcFACHpAyAA1QUAIeoDAgD7BQAhGAYAANcHACAKAADGCAAgCwAA0QcAIAwAANIHACAYAADUBwAgGQAA1QcAIBoAANYHACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIbEDAQDJBQAhtgMBAMkFACHNAxAA5gUAIc4DEADnBQAh4AMBAMkFACHhAwEAyQUAIeIDAQDJBQAh5QMBAMkFACHmAyAA1QUAIecDEADnBQAh6AMQAOcFACHpAyAA1QUAIeoDAgD7BQAhCvYCAQAAAAH6AkAAAAAB-wJAAAAAAZsDAAAAygMCtQMBAAAAAcYDAgAAAAHHAwEAAAAByAMBAAAAAcoDAQAAAAHLAwIAAAABDgkAALgGACALAAC5BgAgDQAAmwcAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAYkDAQAAAAGbAwAAAMoDArUDAQAAAAHGAwIAAAABxwMBAAAAAcgDAQAAAAHKAwEAAAABywMCAAAAAQIAAAAfACAnAAC0CQAgAwAAAB0AICcAALQJACAoAAC4CQAgEAAAAB0AIAkAAJ0GACALAACeBgAgDQAAmgcAICAAALgJACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGJAwEAwwUAIZsDAACbBsoDIrUDAQDDBQAhxgMCAPsFACHHAwEAyQUAIcgDAQDJBQAhygMBAMkFACHLAwIA-wUAIQ4JAACdBgAgCwAAngYAIA0AAJoHACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGJAwEAwwUAIZsDAACbBsoDIrUDAQDDBQAhxgMCAPsFACHHAwEAyQUAIcgDAQDJBQAhygMBAMkFACHLAwIA-wUAIQP2AgEAAAAB-gJAAAAAAcQDAQAAAAEYBgAAowgAIAoAAMcIACALAACdCAAgDAAAnggAIBAAAJ8IACAZAAChCAAgGgAAoggAIPYCAQAAAAH6AkAAAAAB-wJAAAAAAZUDAQAAAAGxAwEAAAABtgMBAAAAAc0DEAAAAAHOAxAAAAAB4AMBAAAAAeEDAQAAAAHiAwEAAAAB5QMBAAAAAeYDIAAAAAHnAxAAAAAB6AMQAAAAAekDIAAAAAHqAwIAAAABAgAAAAEAICcAALoJACADAAAACQAgJwAAugkAICgAAL4JACAaAAAACQAgBgAA1wcAIAoAAMYIACALAADRBwAgDAAA0gcAIBAAANMHACAZAADVBwAgGgAA1gcAICAAAL4JACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIbEDAQDJBQAhtgMBAMkFACHNAxAA5gUAIc4DEADnBQAh4AMBAMkFACHhAwEAyQUAIeIDAQDJBQAh5QMBAMkFACHmAyAA1QUAIecDEADnBQAh6AMQAOcFACHpAyAA1QUAIeoDAgD7BQAhGAYAANcHACAKAADGCAAgCwAA0QcAIAwAANIHACAQAADTBwAgGQAA1QcAIBoAANYHACD2AgEAwwUAIfoCQADEBQAh-wJAAMQFACGVAwEAwwUAIbEDAQDJBQAhtgMBAMkFACHNAxAA5gUAIc4DEADnBQAh4AMBAMkFACHhAwEAyQUAIeIDAQDJBQAh5QMBAMkFACHmAyAA1QUAIecDEADnBQAh6AMQAOcFACHpAyAA1QUAIeoDAgD7BQAhB_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-MAB_AAAAAwcAfS8AfjAAfwMIAAQJiAMBCokDAgMIAAQJjwMBCpADAgUHAIQBLQCFAS4AhgEvAIcBMACIAQAAAAAABQcAhAEtAIUBLgCGAS8AhwEwAIgBAAAAAwcAjgEvAI8BMACQAQAAAAMHAI4BLwCPATAAkAEBEwAOARMADgMHAJUBLwCWATAAlwEAAAADBwCVAS8AlgEwAJcBAAAABQcAnQEtAJ4BLgCfAS8AoAEwAKEBAAAAAAAFBwCdAS0AngEuAJ8BLwCgATAAoQEAAAMHAKYBLwCnATAAqAEAAAADBwCmAS8ApwEwAKgBAQ0ACgENAAoDBwCtAS8ArgEwAK8BAAAAAwcArQEvAK4BMACvAQENAAoBDQAKAwcAtAEvALUBMAC2AQAAAAMHALQBLwC1ATAAtgEAAAADBwC8AS8AvQEwAL4BAAAAAwcAvAEvAL0BMAC-ARsCARxVAR1WAR5XAR9YASFaASJcGCNdGSRgASViGCZjGillASpmAStnGDFqGzJrITNsBzRtBzVuBzZvBzdwBzhyBzl0GDp1Ijt3Bzx5GD16Iz57Bz98B0B9GEGAASRCgQEqQ4MBCESEAQhFhgEIRocBCEeIAQhIigEISYwBGEqNAStLjwEITJEBGE2SASxOkwEIT5QBCFCVARhRmAEtUpkBMVOaAQJUmwECVZwBAladAQJXngECWKABAlmiARhaowEyW6YBAlyoARhdqQEzXqsBAl-sAQJgrQEYYbABNGKxAThjsgEOZLMBDmW0AQ5mtQEOZ7YBDmi4AQ5pugEYarsBOWu9AQ5svwEYbcABOm7BAQ5vwgEOcMMBGHHGATtyxwFBc8gBD3TJAQ91ygEPdssBD3fMAQ94zgEPedABGHrRAUJ70wEPfNUBGH3WAUN-1wEPf9gBD4AB2QEYgQHcAUSCAd0BSoMB3gEVhAHfARWFAeABFYYB4QEVhwHiARWIAeQBFYkB5gEYigHnAUuLAekBFYwB6wEYjQHsAUyOAe0BFY8B7gEVkAHvARiRAfIBTZIB8wFTkwH0ARaUAfUBFpUB9gEWlgH3ARaXAfgBFpgB-gEWmQH8ARiaAf0BVJsB_wEWnAGBAhidAYICVZ4BgwIWnwGEAhagAYUCGKEBiAJWogGJAlqjAYoCCaQBiwIJpQGMAgmmAY0CCacBjgIJqAGQAgmpAZICGKoBkwJbqwGVAgmsAZcCGK0BmAJcrgGZAgmvAZoCCbABmwIYsQGeAl2yAZ8CY7MBoAITtAGhAhO1AaICE7YBowITtwGkAhO4AaYCE7kBqAIYugGpAmS7AasCE7wBrQIYvQGuAmW-Aa8CE78BsAITwAGxAhjBAbQCZsIBtQJqwwG2Ag3EAbcCDcUBuAINxgG5Ag3HAboCDcgBvAINyQG-AhjKAb8Ca8sBwQINzAHDAhjNAcQCbM4BxQINzwHGAg3QAccCGNEBygJt0gHLAnHTAc0CctQBzgJy1QHRAnLWAdICctcB0wJy2AHVAnLZAdcCGNoB2AJz2wHaAnLcAdwCGN0B3QJ03gHeAnLfAd8CcuAB4AIY4QHjAnXiAeQCeeMB5gIE5AHnAgTlAeoCBOYB6wIE5wHsAgToAe4CBOkB8AIY6gHxAnrrAfMCBOwB9QIY7QH2AnvuAfcCBO8B-AIE8AH5AhjxAfwCfPIB_QKAAfMB_gID9AH_AgP1AYADA_YBgQMD9wGCAwP4AYQDA_kBhgMY-gGHA4EB-wGLAwP8AY0DGP0BjgOCAf4BkQMD_wGSAwOAApMDGIEClgODAYIClwOJAYMCmQOKAYQCmgOKAYUCnQOKAYYCngOKAYcCnwOKAYgCoQOKAYkCowMYigKkA4sBiwKmA4oBjAKoAxiNAqkDjAGOAqoDigGPAqsDigGQAqwDGJECrwONAZICsAORAZMCsgMQlAKzAxCVArUDEJYCtgMQlwK3AxCYArkDEJkCuwMYmgK8A5IBmwK-AxCcAsADGJ0CwQOTAZ4CwgMQnwLDAxCgAsQDGKECxwOUAaICyAOYAaMCygOZAaQCywOZAaUCzgOZAaYCzwOZAacC0AOZAagC0gOZAakC1AMYqgLVA5oBqwLXA5kBrALZAxitAtoDmwGuAtsDmQGvAtwDmQGwAt0DGLEC4AOcAbIC4QOiAbMC4wMKtALkAwq1AucDCrYC6AMKtwLpAwq4AusDCrkC7QMYugLuA6MBuwLwAwq8AvIDGL0C8wOkAb4C9AMKvwL1AwrAAvYDGMEC-QOlAcIC-gOpAcMC-wMLxAL8AwvFAv0DC8YC_gMLxwL_AwvIAoEEC8kCgwQYygKEBKoBywKGBAvMAogEGM0CiQSrAc4CigQLzwKLBAvQAowEGNECjwSsAdICkASwAdMCkQQM1AKSBAzVApMEDNYClAQM1wKVBAzYApcEDNkCmQQY2gKaBLEB2wKcBAzcAp4EGN0CnwSyAd4CoAQM3wKhBAzgAqIEGOECpQSzAeICpgS3AeMCqAS4AeQCqQS4AeUCrAS4AeYCrQS4AecCrgS4AegCsAS4AekCsgQY6gKzBLkB6wK1BLgB7AK3BBjtArgEugHuArkEuAHvAroEuAHwArsEGPECvgS7AfICvwS_AQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({
  adapter,
  omit: {
    product: {
      buyingPrice: true
    }
  }
});

// src/modules/product/product.service.ts
var VALID_SORT_FIELDS = [
  "name",
  "price",
  "discountPrice",
  "stockQuantity",
  "inStock",
  "createdAt",
  "updatedAt"
];
var getAllProducts = async (query, includeBuyingPrice = false) => {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    sortBy = "createdAt",
    sortOrder = "desc",
    minRating
  } = query;
  const safeSortBy = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const skip = (page - 1) * limit;
  const where = {};
  if (!includeBuyingPrice) {
    where.isPublished = true;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { id: { contains: search, mode: "insensitive" } }
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    where.price = {};
    if (minPrice !== void 0) where.price.gte = minPrice;
    if (maxPrice !== void 0) where.price.lte = maxPrice;
  }
  if (inStock !== void 0) {
    where.inStock = inStock;
  }
  if (minRating !== void 0) {
    where.reviews = {
      some: {
        rating: {
          gte: minRating
        }
      }
    };
  }
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      ...includeBuyingPrice ? { omit: { buyingPrice: false } } : {},
      include: {
        category: { include: { parent: true } },
        images: {
          orderBy: {
            order: "asc"
          }
        },
        seo: true,
        reviews: {
          where: {
            status: "APPROVED"
          },
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: {
              where: {
                status: "APPROVED"
              }
            }
          }
        }
      },
      orderBy: {
        [safeSortBy]: sortOrder
      },
      skip,
      take: limit
    }),
    prisma.product.count({ where })
  ]);
  const productsWithRating = products.map((product) => {
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;
    const { reviews: _, ...productWithoutReviews } = product;
    return {
      ...productWithoutReviews,
      averageRating: avgRating,
      totalReviews: product._count.reviews
    };
  });
  const inventoryStats = includeBuyingPrice && page === 1 ? await Promise.all([
    prisma.product.aggregate({ where, _sum: { stockQuantity: true } }),
    prisma.product.count({ where: { ...where, stockQuantity: { gt: 0 } } }),
    prisma.product.count({ where: { ...where, stockQuantity: 0 } })
  ]) : void 0;
  return {
    data: productsWithRating,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    ...inventoryStats ? {
      stats: {
        total,
        totalStock: inventoryStats[0]._sum.stockQuantity || 0,
        inStock: inventoryStats[1],
        outOfStock: inventoryStats[2]
      }
    } : {}
  };
};
var getAdminProducts = (query) => getAllProducts(query, true);
var getProductById = async (id, includeDrafts = false) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { seo: { slug: id } }
        ],
        ...includeDrafts ? {} : { isPublished: true }
      },
      include: {
        category: { include: { parent: true } },
        images: {
          orderBy: {
            order: "asc"
          }
        },
        seo: true,
        reviews: {
          where: {
            status: "APPROVED"
          },
          include: {
            images: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });
    if (!product) {
      return null;
    }
    const reviews = product.reviews || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews : 0;
    const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1;
      const count = reviews.filter((r) => r.rating === rating).length;
      return {
        rating,
        count,
        percentage: totalReviews > 0 ? count / totalReviews * 100 : 0
      };
    });
    return {
      ...product,
      averageRating,
      totalReviews,
      ratingDistribution
    };
  } catch (error) {
    console.error("getProductById error:", error);
    throw error;
  }
};
var getAdminProductById = (id) => getProductById(id, true);
var getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const subcategories = await prisma.category.findMany({
    where: {
      parentId: categoryId
    },
    select: {
      id: true
    }
  });
  const categoryIds = [categoryId, ...subcategories.map((c) => c.id)];
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryIds
        },
        isPublished: true
      },
      include: {
        images: {
          orderBy: {
            order: "asc"
          }
        },
        reviews: {
          where: {
            status: "APPROVED"
          },
          select: {
            rating: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.product.count({
      where: {
        categoryId: {
          in: categoryIds
        },
        isPublished: true
      }
    })
  ]);
  const productsWithRating = products.map((product) => {
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;
    const { reviews: _, ...productWithoutReviews } = product;
    return {
      ...productWithoutReviews,
      averageRating: avgRating
    };
  });
  return {
    data: productsWithRating,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var searchProducts = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const searchWhere = {
    isPublished: true,
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { metaTitle: { contains: query, mode: "insensitive" } },
      { metaKeywords: { contains: query, mode: "insensitive" } }
    ]
  };
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: searchWhere,
      include: {
        images: {
          where: {
            isPrimary: true
          },
          take: 1
        },
        reviews: {
          where: {
            status: "APPROVED"
          },
          select: {
            rating: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.product.count({
      where: searchWhere
    })
  ]);
  const productsWithRating = products.map((product) => {
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;
    const { reviews: _, ...productWithoutReviews } = product;
    return {
      ...productWithoutReviews,
      averageRating: avgRating
    };
  });
  return {
    data: productsWithRating,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      searchQuery: query
    }
  };
};
var createProduct = async (data) => {
  const { seo, images, categoryId, sku, ...productData } = data;
  const productName = productData.name ?? "";
  const productPrice = productData.price ?? 0;
  if (sku) {
    const existingProduct = await prisma.product.findUnique({
      where: { sku }
    });
    if (existingProduct) {
      throw new AppError(400, "SKU already exists");
    }
    if (sku.length < 3 || sku.length > 20) {
      throw new AppError(400, "SKU must be between 3 and 20 characters");
    }
  }
  const slug = seo?.slug || slugify(productName, { lower: true, strict: true });
  if (seo?.slug) {
    const existing = await prisma.productSEO.findUnique({
      where: { slug: seo.slug }
    });
    if (existing) {
      throw new AppError(400, "Slug already exists");
    }
  }
  let discountPrice = null;
  if (productData.discount && productData.discount > 0) {
    discountPrice = Number(productPrice) * (1 - productData.discount / 100);
  }
  return prisma.$transaction(async (tx) => {
    const createData = {
      name: productName,
      price: productPrice,
      isPublished: data.isPublished ?? true
    };
    if (sku) {
      createData.sku = sku;
    }
    if (productData.description !== void 0) {
      createData.description = productData.description;
    }
    if (productData.buyingPrice !== void 0) {
      createData.buyingPrice = productData.buyingPrice;
    }
    if (productData.discount !== void 0) {
      createData.discount = productData.discount;
    }
    if (productData.inStock !== void 0) {
      createData.inStock = productData.inStock;
    } else {
      createData.inStock = true;
    }
    if (productData.stockQuantity !== void 0) {
      createData.stockQuantity = productData.stockQuantity;
    } else {
      createData.stockQuantity = 0;
    }
    if (productData.metaTitle !== void 0) {
      createData.metaTitle = productData.metaTitle;
    }
    if (productData.metaDescription !== void 0) {
      createData.metaDescription = productData.metaDescription;
    }
    if (productData.metaKeywords !== void 0) {
      createData.metaKeywords = productData.metaKeywords;
    }
    if (discountPrice !== null) {
      createData.discountPrice = discountPrice;
    }
    if (categoryId) {
      createData.category = {
        connect: { id: categoryId }
      };
    }
    if (seo && slug) {
      const seoCreateData = {
        slug
      };
      if (seo.metaTitle !== void 0) {
        seoCreateData.metaTitle = seo.metaTitle;
      }
      if (seo.metaDescription !== void 0) {
        seoCreateData.metaDescription = seo.metaDescription;
      }
      if (seo.metaKeywords !== void 0) {
        seoCreateData.metaKeywords = seo.metaKeywords;
      }
      createData.seo = {
        create: seoCreateData
      };
    }
    const product = await tx.product.create({
      data: createData,
      include: {
        category: { include: { parent: true } },
        images: true,
        seo: true
      }
    });
    if (images && images.length > 0) {
      const imageData = images.map((img, index) => {
        const data2 = {
          productId: product.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary || index === 0,
          order: index
        };
        if (img.altText && img.altText.trim() !== "") {
          data2.altText = img.altText;
        }
        return data2;
      });
      await tx.productImage.createMany({
        data: imageData
      });
    }
    return tx.product.findUnique({
      where: { id: product.id },
      include: {
        category: { include: { parent: true } },
        images: {
          orderBy: {
            order: "asc"
          }
        },
        seo: true
      }
    });
  });
};
var updateProduct = async (id, data) => {
  const { seo, categoryId, sku, images, ...productData } = data;
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      seo: true
    }
  });
  if (!existingProduct) {
    throw new AppError(404, "Product not found");
  }
  if (sku && sku !== existingProduct.sku) {
    const productWithSameSku = await prisma.product.findUnique({
      where: { sku }
    });
    if (productWithSameSku) {
      throw new AppError(400, "SKU already exists");
    }
  }
  let discountPrice = existingProduct.discountPrice ? existingProduct.discountPrice.toNumber() : null;
  if (productData.discount !== void 0) {
    const price = productData.price ?? existingProduct.price;
    if (productData.discount > 0) {
      discountPrice = Number(price) * (1 - productData.discount / 100);
    } else {
      discountPrice = null;
    }
  }
  return prisma.$transaction(async (tx) => {
    const updateData = {};
    if (productData.name !== void 0) updateData.name = productData.name;
    if (productData.price !== void 0) updateData.price = productData.price;
    if (productData.isPublished !== void 0) updateData.isPublished = productData.isPublished;
    if (productData.buyingPrice !== void 0) updateData.buyingPrice = productData.buyingPrice;
    if (productData.description !== void 0) updateData.description = productData.description;
    if (productData.discount !== void 0) updateData.discount = productData.discount;
    if (discountPrice !== existingProduct.discountPrice) updateData.discountPrice = discountPrice;
    if (productData.stockQuantity !== void 0) updateData.stockQuantity = productData.stockQuantity;
    if (productData.inStock !== void 0) updateData.inStock = productData.inStock;
    if (productData.metaTitle !== void 0) updateData.metaTitle = productData.metaTitle;
    if (productData.metaDescription !== void 0) updateData.metaDescription = productData.metaDescription;
    if (productData.metaKeywords !== void 0) updateData.metaKeywords = productData.metaKeywords;
    if (sku !== void 0) updateData.sku = sku;
    if (categoryId !== void 0) {
      if (categoryId) {
        updateData.category = { connect: { id: categoryId } };
      } else {
        updateData.category = { disconnect: true };
      }
    }
    const updatedProduct = await tx.product.update({
      where: { id },
      data: updateData,
      include: {
        category: { include: { parent: true } },
        images: true,
        seo: true
      }
    });
    if (images !== void 0) {
      await tx.productImage.deleteMany({
        where: { productId: id }
      });
      if (images.length > 0) {
        const imageData = images.map((img, index) => {
          const data2 = {
            productId: id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary || index === 0,
            order: index
          };
          if (img.altText && img.altText.trim() !== "") {
            data2.altText = img.altText;
          }
          return data2;
        });
        await tx.productImage.createMany({
          data: imageData
        });
      }
    }
    if (seo) {
      const slug = seo.slug || existingProduct.seo?.slug || existingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (slug && existingProduct.seo) {
        const seoUpdateData = { slug };
        if (seo.metaTitle !== void 0) seoUpdateData.metaTitle = seo.metaTitle;
        if (seo.metaDescription !== void 0) seoUpdateData.metaDescription = seo.metaDescription;
        if (seo.metaKeywords !== void 0) seoUpdateData.metaKeywords = seo.metaKeywords;
        await tx.productSEO.update({
          where: { id: existingProduct.seo.id },
          data: seoUpdateData
        });
      } else if (slug) {
        const seoCreateData = {
          productId: id,
          slug
        };
        if (seo.metaTitle !== void 0) seoCreateData.metaTitle = seo.metaTitle;
        if (seo.metaDescription !== void 0) seoCreateData.metaDescription = seo.metaDescription;
        if (seo.metaKeywords !== void 0) seoCreateData.metaKeywords = seo.metaKeywords;
        await tx.productSEO.create({
          data: seoCreateData
        });
      }
    }
    return tx.product.findUnique({
      where: { id },
      include: {
        category: { include: { parent: true } },
        images: {
          orderBy: {
            order: "asc"
          }
        },
        seo: true
      }
    });
  });
};
var deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id }
  });
  if (!product) {
    return false;
  }
  await prisma.product.delete({
    where: { id }
  });
  return true;
};
var updateStock = async (id, quantity, operation) => {
  const product = await prisma.product.findUnique({
    where: { id }
  });
  if (!product) {
    return null;
  }
  const newQuantity = operation === "add" ? Number(product.stockQuantity) + quantity : Number(product.stockQuantity) - quantity;
  if (newQuantity < 0) {
    throw new AppError(400, "Insufficient stock");
  }
  return prisma.product.update({
    where: { id },
    data: {
      stockQuantity: newQuantity,
      inStock: newQuantity > 0
    },
    include: {
      images: true,
      category: { include: { parent: true } }
    }
  });
};
var addProductImage = async (productId, imageData) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  if (!product) {
    return null;
  }
  const maxOrder = await prisma.productImage.aggregate({
    where: { productId },
    _max: {
      order: true
    }
  });
  const order = (maxOrder._max.order ?? -1) + 1;
  if (imageData.isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false }
    });
  }
  const createImageData = {
    product: {
      connect: { id: productId }
    },
    imageUrl: imageData.imageUrl,
    isPrimary: imageData.isPrimary ?? false,
    order
  };
  if (imageData.altText !== void 0) {
    createImageData.altText = imageData.altText;
  }
  await prisma.productImage.create({
    data: createImageData
  });
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: {
          order: "asc"
        }
      },
      category: { include: { parent: true } },
      seo: true
    }
  });
};
var deleteProductImage = async (productId, imageId) => {
  const image = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId
    }
  });
  if (!image) {
    return false;
  }
  await prisma.productImage.delete({
    where: { id: imageId }
  });
  return true;
};
var updateProductSEO = async (id, seoData) => {
  const product = await prisma.product.findUnique({
    where: { id }
  });
  if (!product) {
    return null;
  }
  if (seoData.slug) {
    const existing = await prisma.productSEO.findFirst({
      where: {
        slug: seoData.slug,
        NOT: {
          productId: id
        }
      }
    });
    if (existing) {
      throw new AppError(400, "Slug already exists");
    }
  }
  const updateData = {};
  if (seoData.metaTitle !== void 0) {
    updateData.metaTitle = seoData.metaTitle;
  }
  if (seoData.metaDescription !== void 0) {
    updateData.metaDescription = seoData.metaDescription;
  }
  if (seoData.metaKeywords !== void 0) {
    updateData.metaKeywords = seoData.metaKeywords;
  }
  if (seoData.slug !== void 0) {
    updateData.slug = seoData.slug;
  }
  function buildSEOData(data) {
    const result = {};
    if (data.metaTitle !== void 0) result.metaTitle = data.metaTitle;
    if (data.metaDescription !== void 0) result.metaDescription = data.metaDescription;
    if (data.metaKeywords !== void 0) result.metaKeywords = data.metaKeywords;
    if (data.slug !== void 0) result.slug = data.slug;
    return result;
  }
  if (Object.keys(updateData).length > 0) {
    const cleanData = buildSEOData(updateData);
    await prisma.productSEO.upsert({
      where: { productId: id },
      update: updateData,
      create: {
        productId: id,
        ...cleanData
      }
    });
  }
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: { include: { parent: true } },
      images: true,
      seo: true
    }
  });
};
var productService = {
  getAllProducts,
  getAdminProducts,
  getProductById,
  getAdminProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  addProductImage,
  deleteProductImage,
  updateProductSEO
};

// src/modules/product/product.controller.ts
var validateBuyingPrice = (value) => {
  if (value !== void 0 && value !== null && (!Number.isFinite(value) || value < 0)) {
    throw new AppError(400, "Buying price must be a non-negative number");
  }
};
var getAllProducts2 = async (req, res) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page) : void 0,
      limit: req.query.limit ? parseInt(req.query.limit) : void 0,
      search: req.query.search,
      categoryId: req.query.categoryId,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : void 0,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : void 0,
      inStock: req.query.inStock !== void 0 ? req.query.inStock === "true" : void 0,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || "desc",
      minRating: req.query.minRating ? parseFloat(req.query.minRating) : void 0
    };
    const result = await productService.getAllProducts(query);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    handleError(error, res);
  }
};
var getAdminProducts2 = async (req, res) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page) : void 0,
      limit: req.query.limit ? parseInt(req.query.limit) : void 0,
      search: req.query.search,
      categoryId: req.query.categoryId,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : void 0,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : void 0,
      inStock: req.query.inStock !== void 0 ? req.query.inStock === "true" : void 0,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || "desc",
      minRating: req.query.minRating ? parseFloat(req.query.minRating) : void 0
    };
    const result = await productService.getAdminProducts(query);
    res.status(200).json({ success: true, data: result.data, meta: result.meta, stats: result.stats });
  } catch (error) {
    handleError(error, res);
  }
};
var getProductById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("PRODUCT_CONTROLLER_ERROR:", error);
    handleError(error, res);
  }
};
var getProductsByCategory2 = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const result = await productService.getProductsByCategory(categoryId, page, limit);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    handleError(error, res);
  }
};
var searchProducts2 = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      throw new AppError(400, "Search query is required");
    }
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const result = await productService.searchProducts(q, page, limit);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    handleError(error, res);
  }
};
var createProduct2 = async (req, res) => {
  try {
    const data = req.body;
    validateBuyingPrice(data?.buyingPrice);
    if (data?.isPublished !== false) {
      if (!data?.name?.trim() || data.price === void 0 || data.price === null || data.price <= 0) {
        throw new AppError(400, "Add a product name and price greater than zero before publishing");
      }
    }
    const product = await productService.createProduct(data);
    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully"
    });
  } catch (error) {
    handleError(error, res);
  }
};
var updateProduct2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    validateBuyingPrice(data?.buyingPrice);
    const existingProduct = await productService.getAdminProductById(id);
    if (!existingProduct) {
      throw new AppError(404, "Product not found");
    }
    if (data.isPublished === true) {
      const name = data.name ?? existingProduct.name;
      const price = data.price ?? Number(existingProduct.price);
      if (!name.trim() || Number(price) <= 0) {
        throw new AppError(400, "Add a product name and price greater than zero before publishing");
      }
    }
    const product = await productService.updateProduct(id, data);
    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully"
    });
  } catch (error) {
    handleError(error, res);
  }
};
var deleteProduct2 = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      throw new AppError(404, "Product not found");
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    handleError(error, res);
  }
};
var updateStock2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;
    if (quantity === void 0 || !operation) {
      throw new AppError(400, "Quantity and operation are required");
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      throw new AppError(400, "Quantity must be a positive number");
    }
    if (!["add", "subtract"].includes(operation)) {
      throw new AppError(400, 'Operation must be either "add" or "subtract"');
    }
    const product = await productService.updateStock(id, quantity, operation);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    res.status(200).json({
      success: true,
      data: product,
      message: `Stock ${operation}ed successfully`
    });
  } catch (error) {
    handleError(error, res);
  }
};
var addProductImage2 = async (req, res) => {
  try {
    const { id } = req.params;
    const imageData = req.body;
    if (!imageData.imageUrl) {
      throw new AppError(400, "Image URL is required");
    }
    const product = await productService.addProductImage(id, imageData);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    res.status(201).json({
      success: true,
      data: product,
      message: "Image added successfully"
    });
  } catch (error) {
    handleError(error, res);
  }
};
var deleteProductImage2 = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const deleted = await productService.deleteProductImage(id, imageId);
    if (!deleted) {
      throw new AppError(404, "Image not found");
    }
    res.status(200).json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    handleError(error, res);
  }
};
var updateProductSEO2 = async (req, res) => {
  try {
    const { id } = req.params;
    const seoData = req.body;
    const product = await productService.updateProductSEO(id, seoData);
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    res.status(200).json({
      success: true,
      data: product,
      message: "SEO updated successfully"
    });
  } catch (error) {
    handleError(error, res);
  }
};
var handleError = (error, res) => {
  console.error("Product Controller Error:", error);
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  }
  return res.status(500).json({
    success: false,
    error: error?.message || "Internal server error"
  });
};
var productController = {
  getAllProducts: getAllProducts2,
  getAdminProducts: getAdminProducts2,
  getProductById: getProductById2,
  getProductsByCategory: getProductsByCategory2,
  searchProducts: searchProducts2,
  createProduct: createProduct2,
  updateProduct: updateProduct2,
  deleteProduct: deleteProduct2,
  updateStock: updateStock2,
  addProductImage: addProductImage2,
  deleteProductImage: deleteProductImage2,
  updateProductSEO: updateProductSEO2
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
var authBaseURL = process.env.BETTER_AUTH_URL || "http://localhost:5000";
var isLocalAuthServer = /(^|\/\/)(localhost|127\.0\.0\.1)(:\d+)?(?=\/|$)/i.test(authBaseURL);
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  baseURL: authBaseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [
    process.env.FRONTEND_URL,
    "https://amrbasket.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "https://amrbasket.vercel.app"
  ].filter((origin) => origin !== void 0 && origin !== ""),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              emailVerified: true
            }
          };
        }
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@gmail.email>',
          to: user.email,
          subject: "Reset your password",
          text: "",
          html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Reset your password</title></head><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:24px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;"><tr><td style="background:#111827;padding:20px;text-align:center;"><h1 style="margin:0;color:#ffffff;font-size:22px;">Prisma Blog</h1></td></tr><tr><td style="padding:32px;color:#374151;"><h2 style="margin-top:0;color:#111827;">Reset your password</h2><p style="font-size:15px;line-height:1.6;">We received a request to reset your password for your Prisma Blog account. Click the button below to reset it. This password reset link will expire in 1 hour.</p><div style="text-align:center;margin:32px 0;"><a href="${resetUrl}" style="background:#2563eb;color:#ffffff;padding:14px 28px;text-decoration:none;font-size:15px;border-radius:6px;display:inline-block;">Reset Password</a></div><p style="font-size:14px;line-height:1.6;color:#6b7280;">If you didn\u2019t request a password reset, please ignore this email or contact support if you have questions.</p></td></tr><tr><td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Prisma Blog. All rights reserved.</td></tr></table></table></body></html>`
        });
        console.log("Reset email sent:", info.messageId);
      } catch (err) {
        console.log(err);
        throw new Error("Failed to send reset email");
      }
    }
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@gmail.email>',
          to: user.email,
          subject: "Please verify your email address",
          text: "",
          html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Verify your email</title></head><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:24px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;"><tr><td style="background:#111827;padding:20px;text-align:center;"><h1 style="margin:0;color:#ffffff;font-size:22px;">Prisma Blog</h1></td></tr><tr><td style="padding:32px;color:#374151;"><h2 style="margin-top:0;color:#111827;">Verify your email address</h2><p style="font-size:15px;line-height:1.6;">Thanks for signing up for <strong>Prisma Blog</strong>. Please confirm your email address by clicking the button below.</p><div style="text-align:center;margin:32px 0;"><a href="${verificationUrl}" style="background:#2563eb;color:#ffffff;padding:14px 28px;text-decoration:none;font-size:15px;border-radius:6px;display:inline-block;">Verify Email</a></div><p style="font-size:14px;line-height:1.6;color:#6b7280;">If the button doesn\u2019t work, copy and paste this link into your browser:</p><p style="word-break:break-all;font-size:13px;color:#2563eb;">${verificationUrl}</p><p style="font-size:14px;color:#6b7280;margin-top:24px;">If you didn\u2019t create an account, you can safely ignore this email.</p></td></tr><tr><td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Prisma Blog. All rights reserved.</td></tr></table></table></body></html>`
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.log(err);
        throw new Error("Failed to send verification email");
      }
    }
  },
  account: {
    // Store the OAuth state in the database so the Vercel -> Render flow does
    // not depend on a third-party state cookie surviving the initial request.
    // The state and PKCE values are still validated server-side on callback.
    storeStateStrategy: "database",
    skipStateCookieCheck: true
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: isLocalAuthServer ? "lax" : "none",
      secure: !isLocalAuthServer
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${authBaseURL.replace(/\/$/, "")}/api/auth/callback/google`
    }
  }
});

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || "USER",
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resource"
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized!"
      });
    }
  };
};
var optionalAuth = () => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (session) {
        req.user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role || "USER",
          emailVerified: session.user.emailVerified
        };
      }
      next();
    } catch (error) {
      next();
    }
  };
};
var auth_default = auth2;

// src/modules/product/product.router.ts
var router = express.Router();
router.get("/admin", auth_default("ADMIN" /* ADMIN */), productController.getAdminProducts.bind(productController));
router.get("/", productController.getAllProducts.bind(productController));
router.get("/search", productController.searchProducts.bind(productController));
router.get("/category/:categoryId", productController.getProductsByCategory.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));
router.post("/", auth_default("ADMIN" /* ADMIN */), productController.createProduct.bind(productController));
router.put("/:id", auth_default("ADMIN" /* ADMIN */), productController.updateProduct.bind(productController));
router.delete("/:id", auth_default("ADMIN" /* ADMIN */), productController.deleteProduct.bind(productController));
router.patch("/stock/:id", auth_default("ADMIN" /* ADMIN */), productController.updateStock.bind(productController));
router.post("/images/:id", auth_default("ADMIN" /* ADMIN */), productController.addProductImage.bind(productController));
router.delete("/images/:id/:imageId", auth_default("ADMIN" /* ADMIN */), productController.deleteProductImage.bind(productController));
router.patch("/seo/:id", auth_default("ADMIN" /* ADMIN */), productController.updateProductSEO.bind(productController));
var productRouter = router;

// src/modules/category/category.router.ts
import { Router as Router2 } from "express";

// src/modules/category/category.service.ts
import slugify2 from "slugify";
var VALID_SORT_FIELDS2 = [
  "name",
  "createdAt",
  "updatedAt"
];
var getAllCategories = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    parentId,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const safeSortBy = VALID_SORT_FIELDS2.includes(sortBy) ? sortBy : "createdAt";
  const skip = (page - 1) * limit;
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  if (parentId !== void 0) {
    where.parentId = parentId || null;
  }
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            products: true,
            children: true
          }
        },
        children: {
          include: {
            _count: {
              select: {
                products: true
              }
            }
          }
        }
      },
      orderBy: {
        [safeSortBy]: sortOrder
      },
      skip,
      take: limit
    }),
    prisma.category.count({ where })
  ]);
  return {
    data: categories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      },
      products: {
        take: 10,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      },
      _count: {
        select: {
          products: true,
          children: true
        }
      }
    }
  });
  if (!category) {
    return null;
  }
  return category;
};
var getCategoryBySlug = async (slug) => {
  const include = {
    parent: true,
    children: {
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    },
    products: {
      take: 10,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        }
      }
    },
    _count: {
      select: {
        products: true,
        children: true
      }
    }
  };
  const category = await prisma.category.findUnique({ where: { slug }, include });
  if (category) return category;
  const legacyCategories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true }
  });
  const legacyMatch = legacyCategories.find(
    (candidate) => {
      const savedSlug = candidate.slug || candidate.name;
      const normalizedSlug = slugify2(savedSlug, { lower: true, strict: true }) || candidate.id;
      return normalizedSlug === slug;
    }
  );
  return legacyMatch ? prisma.category.findUnique({ where: { id: legacyMatch.id }, include }) : null;
};
var getCategoryTree = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    }
  });
  const categoryMap = /* @__PURE__ */ new Map();
  const roots = [];
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: []
    });
  });
  categories.forEach((category) => {
    const node = categoryMap.get(category.id);
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });
  return roots;
};
var createCategory = async (data) => {
  const { name, description, slug, image, parentId, metaTitle, metaDescription, metaKeywords } = data;
  const categorySlug = slugify2(slug || name, { lower: true, strict: true });
  if (categorySlug) {
    const existing = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });
    if (existing) {
      throw new AppError(400, "Slug already exists");
    }
  }
  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: parentId }
    });
    if (!parent) {
      throw new AppError(400, "Parent category not found");
    }
  }
  const createData = {
    name,
    slug: categorySlug
  };
  if (description !== void 0) {
    createData.description = description;
  }
  if (image !== void 0) {
    createData.image = image;
  }
  if (parentId !== void 0) {
    createData.parentId = parentId;
  }
  if (metaTitle !== void 0) {
    createData.metaTitle = metaTitle;
  }
  if (metaDescription !== void 0) {
    createData.metaDescription = metaDescription;
  }
  if (metaKeywords !== void 0) {
    createData.metaKeywords = metaKeywords;
  }
  return prisma.category.create({
    data: createData,
    include: {
      parent: true,
      children: true
    }
  });
};
var updateCategory = async (id, data) => {
  const { name, description, slug, image, parentId, metaTitle, metaDescription, metaKeywords } = data;
  const existingCategory = await prisma.category.findUnique({
    where: { id }
  });
  if (!existingCategory) {
    throw new AppError(404, "Category not found");
  }
  if (parentId === id) {
    throw new AppError(400, "Category cannot be its own parent");
  }
  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: parentId }
    });
    if (!parent) {
      throw new AppError(400, "Parent category not found");
    }
  }
  const categorySlug = slug === void 0 ? void 0 : slugify2(slug || name || existingCategory.name, { lower: true, strict: true });
  if (categorySlug) {
    const existing = await prisma.category.findFirst({
      where: {
        slug: categorySlug,
        NOT: {
          id
        }
      }
    });
    if (existing) {
      throw new AppError(400, "Slug already exists");
    }
  }
  const updateData = {};
  if (name !== void 0) {
    updateData.name = name;
  }
  if (description !== void 0) {
    updateData.description = description;
  }
  if (slug !== void 0) {
    updateData.slug = categorySlug;
  }
  if (image !== void 0) {
    updateData.image = image;
  }
  if (parentId !== void 0) {
    updateData.parentId = parentId;
  }
  if (metaTitle !== void 0) {
    updateData.metaTitle = metaTitle;
  }
  if (metaDescription !== void 0) {
    updateData.metaDescription = metaDescription;
  }
  if (metaKeywords !== void 0) {
    updateData.metaKeywords = metaKeywords;
  }
  return prisma.category.update({
    where: { id },
    data: updateData,
    include: {
      parent: true,
      children: true
    }
  });
};
var deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      products: {
        take: 1
      }
    }
  });
  if (!category) {
    return false;
  }
  if (category.children.length > 0) {
    throw new AppError(400, "Cannot delete category with child categories. Delete children first.");
  }
  if (category.products.length > 0) {
    throw new AppError(400, "Cannot delete category with products. Move or delete products first.");
  }
  await prisma.category.delete({
    where: { id }
  });
  return true;
};
var getCategoryProducts = async (categoryId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId,
        isPublished: true
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        },
        reviews: {
          where: { status: "APPROVED" },
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: {
              where: { status: "APPROVED" }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.product.count({
      where: { categoryId, isPublished: true }
    })
  ]);
  const productsWithRating = products.map((product) => {
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;
    const { reviews: _, ...productWithoutReviews } = product;
    return {
      ...productWithoutReviews,
      averageRating: avgRating,
      totalReviews: product._count.reviews
    };
  });
  return {
    data: productsWithRating,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var categoryService = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
};

// src/modules/category/category.controller.ts
var handleError2 = (error, res) => {
  console.error("Category Controller Error:", error);
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  }
  return res.status(500).json({
    success: false,
    error: "Internal server error"
  });
};
var getAllCategories2 = async (req, res) => {
  try {
    const query = {};
    if (req.query.page) {
      query.page = parseInt(req.query.page);
    }
    if (req.query.limit) {
      query.limit = parseInt(req.query.limit);
    }
    if (req.query.search) {
      query.search = req.query.search;
    }
    if (req.query.parentId) {
      query.parentId = req.query.parentId;
    }
    if (req.query.sortBy) {
      query.sortBy = req.query.sortBy;
    }
    if (req.query.sortOrder) {
      query.sortOrder = req.query.sortOrder;
    }
    const result = await categoryService.getAllCategories(query);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    handleError2(error, res);
  }
};
var getCategoryById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    handleError2(error, res);
  }
};
var getCategoryBySlug2 = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    handleError2(error, res);
  }
};
var getCategoryTree2 = async (req, res) => {
  try {
    const tree = await categoryService.getCategoryTree();
    res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    handleError2(error, res);
  }
};
var getCategoryProducts2 = async (req, res) => {
  try {
    const { id } = req.params;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const result = await categoryService.getCategoryProducts(id, page, limit);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    handleError2(error, res);
  }
};
var createCategory2 = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name) {
      throw new AppError(400, "Category name is required");
    }
    const category = await categoryService.createCategory(data);
    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully"
    });
  } catch (error) {
    handleError2(error, res);
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await categoryService.updateCategory(id, data);
    res.status(200).json({
      success: true,
      data: category,
      message: "Category updated successfully"
    });
  } catch (error) {
    handleError2(error, res);
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await categoryService.deleteCategory(id);
    if (!deleted) {
      throw new AppError(404, "Category not found");
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    handleError2(error, res);
  }
};
var categoryController = {
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  getCategoryBySlug: getCategoryBySlug2,
  getCategoryTree: getCategoryTree2,
  getCategoryProducts: getCategoryProducts2,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.router.ts
var router2 = Router2();
router2.get("/", categoryController.getAllCategories);
router2.get("/tree", categoryController.getCategoryTree);
router2.get("/slug/:slug", categoryController.getCategoryBySlug);
router2.get("/products/:id", categoryController.getCategoryProducts);
router2.get("/:id", categoryController.getCategoryById);
router2.post("/", categoryController.createCategory);
router2.put("/:id", categoryController.updateCategory);
router2.delete("/:id", categoryController.deleteCategory);
var categoryRouter = router2;

// src/modules/review/review.router.ts
import { Router as Router3 } from "express";

// src/modules/review/review.types.ts
var ReviewStatus = /* @__PURE__ */ ((ReviewStatus2) => {
  ReviewStatus2["PENDING"] = "PENDING";
  ReviewStatus2["APPROVED"] = "APPROVED";
  ReviewStatus2["HIDDEN"] = "HIDDEN";
  ReviewStatus2["REJECTED"] = "REJECTED";
  return ReviewStatus2;
})(ReviewStatus || {});

// src/socket/socketManager.ts
import { Server } from "socket.io";
var io = null;
var initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (process.env.CLIENT_URL || "https://amrbasket.vercel.app,http://localhost:3000").split(",").map((o) => o.trim()),
      credentials: true
    }
  });
  io.on("connection", (socket) => {
    socket.join("admin-room");
    socket.on("disconnect", () => {
    });
  });
  return io;
};
var getIO = () => {
  if (!io) throw new Error("Socket.io has not been initialized");
  return io;
};
var emitAdminNotification = (payload) => {
  if (!io) return;
  const data = {
    ...payload,
    createdAt: payload.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
  };
  io.to("admin-room").emit("admin:notification", data);
};
var emitOrderStatusUpdated = (payload) => {
  if (!io) return;
  io.to("admin-room").emit("orderStatusUpdated", payload);
};

// src/modules/review/review.service.ts
var VALID_SORT_FIELDS3 = [
  "rating",
  "helpful",
  "createdAt",
  "updatedAt"
];
var getAllReviews = async (query) => {
  const {
    page = 1,
    limit = 10,
    productId,
    userId,
    status,
    minRating,
    maxRating,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const safeSortBy = VALID_SORT_FIELDS3.includes(sortBy) ? sortBy : "createdAt";
  const skip = (page - 1) * limit;
  const where = {};
  if (productId) {
    where.productId = productId;
  }
  if (userId) {
    where.userId = userId;
  }
  if (status) {
    where.status = status;
  }
  if (minRating !== void 0 || maxRating !== void 0) {
    where.rating = {};
    if (minRating !== void 0) where.rating.gte = minRating;
    if (maxRating !== void 0) where.rating.lte = maxRating;
  }
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      },
      orderBy: {
        [safeSortBy]: sortOrder
      },
      skip,
      take: limit
    }),
    prisma.review.count({ where })
  ]);
  return {
    data: reviews,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getReviewById = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      product: {
        select: {
          id: true,
          name: true,
          description: true,
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      }
    }
  });
  if (!review) {
    return null;
  }
  return review;
};
var getReviewsByProduct = async (productId, page = 1, limit = 10, status = "APPROVED" /* APPROVED */) => {
  const skip = (page - 1) * limit;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true }
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        productId,
        status
      },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.review.count({
      where: {
        productId,
        status
      }
    })
  ]);
  return {
    data: reviews,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getReviewStats = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true }
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      status: "APPROVED" /* APPROVED */
    },
    select: {
      rating: true
    }
  });
  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return {
      productId,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: Array.from({ length: 5 }, (_, i) => ({
        rating: i + 1,
        count: 0,
        percentage: 0
      }))
    };
  }
  const sumRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = sumRatings / totalReviews;
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const count = reviews.filter((r) => r.rating === rating).length;
    return {
      rating,
      count,
      percentage: count / totalReviews * 100
    };
  });
  return {
    productId,
    averageRating,
    totalReviews,
    ratingDistribution
  };
};
var createReview = async (data) => {
  const { productId, rating, title, comment, images, userId } = data;
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  if (rating < 1 || rating > 5) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }
  if (!userId) {
    throw new AppError(400, "User ID is required to submit a review");
  }
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {
        rating,
        ...title !== void 0 ? { title } : {},
        ...comment !== void 0 ? { comment } : {},
        status: "PENDING" /* PENDING */
      },
      create: {
        userId,
        productId,
        rating,
        ...title !== void 0 ? { title } : {},
        ...comment !== void 0 ? { comment } : {},
        status: "PENDING" /* PENDING */
      },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    if (images && images.length > 0) {
      const imageData = images.map((img) => ({
        reviewId: review.id,
        imageUrl: img.imageUrl
      }));
      await tx.reviewImage.createMany({
        data: imageData
      });
    }
    const createdReview = await tx.review.findUnique({
      where: { id: review.id },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    if (createdReview) {
      emitAdminNotification({
        id: createdReview.id,
        title: "New Product Review",
        message: `New ${createdReview.rating}-star review for ${createdReview.product?.name || "a product"}`,
        type: "info"
      });
    }
    return createdReview;
  });
};
var updateReview = async (id, data) => {
  const { rating, title, comment, status, reply, images } = data;
  const existingReview = await prisma.review.findUnique({
    where: { id },
    include: {
      images: true
    }
  });
  if (!existingReview) {
    throw new AppError(404, "Review not found");
  }
  if (rating !== void 0 && (rating < 1 || rating > 5)) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }
  return prisma.$transaction(async (tx) => {
    const updateData = {};
    if (rating !== void 0) {
      updateData.rating = rating;
    }
    if (title !== void 0) {
      updateData.title = title;
    }
    if (comment !== void 0) {
      updateData.comment = comment;
    }
    if (status !== void 0) {
      updateData.status = status;
    }
    if (reply !== void 0) {
      updateData.reply = reply;
    }
    if (Object.keys(updateData).length > 0) {
      await tx.review.update({
        where: { id },
        data: updateData
      });
    }
    if (images !== void 0) {
      await tx.reviewImage.deleteMany({
        where: { reviewId: id }
      });
      if (images.length > 0) {
        const imageData = images.map((img) => ({
          reviewId: id,
          imageUrl: img.imageUrl
        }));
        await tx.reviewImage.createMany({
          data: imageData
        });
      }
    }
    return tx.review.findUnique({
      where: { id },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  });
};
var replyReview = async (id, reply) => {
  const review = await prisma.review.findUnique({
    where: { id }
  });
  if (!review) {
    throw new AppError(404, "Review not found");
  }
  const updated = await prisma.review.update({
    where: { id },
    data: { reply: reply || null },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      product: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  emitAdminNotification({
    id: updated.id,
    title: "Review Replied",
    message: `Reply saved for review on ${updated.product?.name || "a product"}`,
    type: "success"
  });
  return updated;
};
var deleteReview = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id }
  });
  if (!review) {
    return false;
  }
  await prisma.review.delete({
    where: { id }
  });
  return true;
};
var updateReviewStatus = async (id, status) => {
  const review = await prisma.review.findUnique({
    where: { id }
  });
  if (!review) {
    throw new AppError(404, "Review not found");
  }
  const updatedReview = await prisma.review.update({
    where: { id },
    data: { status },
    include: {
      images: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      product: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  emitAdminNotification({
    id: updatedReview.id,
    title: "Review Status Updated",
    message: `Review for ${updatedReview.product?.name || "product"} marked as ${status}`,
    type: "success"
  });
  return updatedReview;
};
var markReviewHelpful = async (reviewId, userId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new AppError(404, "Review not found");
  }
  const existingLike = await prisma.reviewLike.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId
      }
    }
  });
  if (existingLike) {
    await prisma.reviewLike.delete({
      where: { id: existingLike.id }
    });
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpful: {
          decrement: 1
        }
      }
    });
    const updated2 = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        images: true
      }
    });
    return updated2;
  }
  await prisma.reviewLike.create({
    data: {
      userId,
      reviewId
    }
  });
  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      helpful: {
        increment: 1
      }
    },
    include: {
      images: true
    }
  });
  return updated;
};
var reviewService = {
  getAllReviews,
  getReviewById,
  getReviewsByProduct,
  getReviewStats,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  replyReview,
  markReviewHelpful
};

// src/modules/review/review.controller.ts
var handleError3 = (error, res) => {
  console.error("Review Controller Error:", error);
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  }
  return res.status(500).json({
    success: false,
    error: "Internal server error"
  });
};
var parseReviewQuery = (req) => {
  const query = {};
  if (req.query.page) {
    const page = parseInt(req.query.page);
    if (!isNaN(page) && page > 0) query.page = page;
  }
  if (req.query.limit) {
    const limit = parseInt(req.query.limit);
    if (!isNaN(limit) && limit > 0) query.limit = limit;
  }
  if (req.query.productId) {
    query.productId = req.query.productId;
  }
  if (req.query.userId) {
    query.userId = req.query.userId;
  }
  if (req.query.status) {
    const status = req.query.status;
    if (Object.values(ReviewStatus).includes(status)) {
      query.status = status;
    }
  }
  if (req.query.minRating) {
    const minRating = parseInt(req.query.minRating);
    if (!isNaN(minRating) && minRating >= 1 && minRating <= 5) {
      query.minRating = minRating;
    }
  }
  if (req.query.maxRating) {
    const maxRating = parseInt(req.query.maxRating);
    if (!isNaN(maxRating) && maxRating >= 1 && maxRating <= 5) {
      query.maxRating = maxRating;
    }
  }
  if (req.query.sortBy) {
    query.sortBy = req.query.sortBy;
  }
  if (req.query.sortOrder) {
    const sortOrder = req.query.sortOrder;
    if (sortOrder === "asc" || sortOrder === "desc") {
      query.sortOrder = sortOrder;
    }
  }
  return query;
};
var getAllReviews2 = async (req, res) => {
  try {
    const query = parseReviewQuery(req);
    const result = await reviewService.getAllReviews(query);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var getReviewById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError(400, "Review ID is required");
    }
    const review = await reviewService.getReviewById(id);
    if (!review) {
      throw new AppError(404, "Review not found");
    }
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var getReviewsByProduct2 = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const status = req.query.status || "APPROVED" /* APPROVED */;
    if (!productId) {
      throw new AppError(400, "Product ID is required");
    }
    const result = await reviewService.getReviewsByProduct(productId, page, limit, status);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var getReviewStats2 = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new AppError(400, "Product ID is required");
    }
    const stats = await reviewService.getReviewStats(productId);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var createReview2 = async (req, res) => {
  try {
    const data = req.body;
    if (!req.user?.id) {
      throw new AppError(401, "Please log in to submit a review");
    }
    if (!data.productId) {
      throw new AppError(400, "Product ID is required");
    }
    if (data.rating === void 0 || data.rating === null) {
      throw new AppError(400, "Rating is required");
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new AppError(400, "Rating must be between 1 and 5");
    }
    const review = await reviewService.createReview({
      ...data,
      userId: req.user.id
    });
    res.status(201).json({
      success: true,
      data: review,
      message: "Review created successfully"
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var updateReview2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!id) {
      throw new AppError(400, "Review ID is required");
    }
    if (!req.user?.id) {
      throw new AppError(401, "Please log in to update a review");
    }
    const existingReview = await reviewService.getReviewById(id);
    if (!existingReview) {
      throw new AppError(404, "Review not found");
    }
    if (req.user.role !== "ADMIN" && existingReview.userId !== req.user.id) {
      throw new AppError(403, "You can only update your own reviews");
    }
    const review = await reviewService.updateReview(id, data);
    res.status(200).json({
      success: true,
      data: review,
      message: "Review updated successfully"
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var deleteReview2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError(400, "Review ID is required");
    }
    if (!req.user?.id) {
      throw new AppError(401, "Please log in to delete a review");
    }
    const existingReview = await reviewService.getReviewById(id);
    if (!existingReview) {
      throw new AppError(404, "Review not found");
    }
    if (req.user.role !== "ADMIN" && existingReview.userId !== req.user.id) {
      throw new AppError(403, "You can only delete your own reviews");
    }
    const deleted = await reviewService.deleteReview(id);
    if (!deleted) {
      throw new AppError(404, "Review not found");
    }
    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var updateReviewStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
      throw new AppError(400, "Review ID is required");
    }
    if (!status) {
      throw new AppError(400, "Status is required");
    }
    if (!Object.values(ReviewStatus).includes(status)) {
      throw new AppError(400, "Invalid status");
    }
    const review = await reviewService.updateReviewStatus(id, status);
    res.status(200).json({
      success: true,
      data: review,
      message: "Review status updated successfully"
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var markReviewHelpful2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError(400, "Review ID is required");
    }
    if (!req.user?.id) {
      throw new AppError(401, "Please log in to mark review as helpful");
    }
    const review = await reviewService.markReviewHelpful(id, req.user.id);
    if (!review) {
      throw new AppError(404, "Review not found");
    }
    res.status(200).json({
      success: true,
      data: review,
      message: "Review helpful toggled"
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var replyReview2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    if (!id) {
      throw new AppError(400, "Review ID is required");
    }
    if (typeof reply !== "string") {
      throw new AppError(400, "Reply is required");
    }
    const review = await reviewService.replyReview(id, reply);
    res.status(200).json({
      success: true,
      data: review,
      message: "Reply saved successfully"
    });
  } catch (error) {
    handleError3(error, res);
  }
};
var reviewController = {
  getAllReviews: getAllReviews2,
  getReviewById: getReviewById2,
  getReviewsByProduct: getReviewsByProduct2,
  getReviewStats: getReviewStats2,
  createReview: createReview2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  updateReviewStatus: updateReviewStatus2,
  replyReview: replyReview2,
  markReviewHelpful: markReviewHelpful2
};

// src/modules/review/review.router.ts
var router3 = Router3();
router3.get("/", reviewController.getAllReviews);
router3.get("/product/stats/:productId", reviewController.getReviewStats);
router3.get("/product/:productId", reviewController.getReviewsByProduct);
router3.get("/:id", reviewController.getReviewById);
router3.post("/", auth_default(), reviewController.createReview);
router3.put("/:id", auth_default(), reviewController.updateReview);
router3.delete("/:id", auth_default(), reviewController.deleteReview);
router3.patch("/status/:id", auth_default("ADMIN" /* ADMIN */), reviewController.updateReviewStatus);
router3.patch("/reply/:id", auth_default("ADMIN" /* ADMIN */), reviewController.replyReview);
router3.patch("/helpful/:id", auth_default(), reviewController.markReviewHelpful);
var reviewRouter = router3;

// src/modules/cart/cart.router.ts
import { Router as Router4 } from "express";

// src/lib/order-mailer.ts
import nodemailer2 from "nodemailer";
var escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
var money = (value) => `\u09F3${Number(value).toFixed(2)}`;
var getMailConfig = () => {
  const user = process.env.SMTP_USER || process.env.APP_USER;
  const pass = process.env.SMTP_PASS || process.env.APP_PASS;
  if (!user || !pass || user === "your_email@gmail.com" || pass === "your_app_password") {
    return null;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
    from: process.env.MAIL_FROM || `CommerceHub <${user}>`
  };
};
var sendOrderConfirmationEmail = async (order) => {
  const config2 = getMailConfig();
  if (!config2) {
    console.warn("Order confirmation email not sent: SMTP credentials are not configured.");
    return { sent: false, reason: "not-configured" };
  }
  const itemRows = order.items.map((item) => `
        <tr>
            <td style="padding:8px 0">${escapeHtml(item.name)} \xD7 ${item.quantity}</td>
            <td style="padding:8px 0;text-align:right">${money(Number(item.price) * item.quantity)}</td>
        </tr>`).join("");
  const transporter2 = nodemailer2.createTransport({
    host: config2.host,
    port: config2.port,
    secure: config2.secure,
    auth: config2.auth,
    connectionTimeout: 5e3,
    greetingTimeout: 5e3,
    socketTimeout: 1e4
  });
  await transporter2.sendMail({
    from: config2.from,
    to: order.customerEmail,
    cc: process.env.ORDER_NOTIFICATION_EMAIL || void 0,
    subject: `Order received: ${order.orderNumber}`,
    text: `Hi ${order.customerName}, we received your order ${order.orderNumber}. Total: ${money(order.totalAmount)}.`,
    html: `
            <div style="font-family:Arial,sans-serif;color:#1f2937;max-width:600px;margin:auto">
                <h2>Thanks for your order, ${escapeHtml(order.customerName)}!</h2>
                <p>We've received order <strong>${escapeHtml(order.orderNumber)}</strong> and will notify you as it progresses.</p>
                <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb">
                    <tbody>${itemRows}</tbody>
                </table>
                <p style="text-align:right"><strong>Total: ${money(order.totalAmount)}</strong></p>
                <p>Payment method: ${escapeHtml(order.paymentMethod || "COD")}</p>
            </div>`
  });
  return { sent: true };
};

// src/lib/telegram.ts
var TELEGRAM_API = "https://api.telegram.org";
var sendNewOrderTelegramNotification = async (order) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_STAFF_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram order notification not sent: bot token or staff chat ID is not configured.");
    return { sent: false, reason: "not-configured" };
  }
  const itemLines = order.items.slice(0, 20).map(
    (item) => `\u2022 ${item.name} \xD7 ${item.quantity} \u2014 \u09F3${(Number(item.price) * item.quantity).toFixed(2)}`
  );
  if (order.items.length > itemLines.length) {
    itemLines.push(`\u2022 And ${order.items.length - itemLines.length} more item(s)`);
  }
  const message = [
    "\u{1F6CD} New order received",
    `Order: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Payment: ${order.paymentMethod}`,
    "",
    ...itemLines,
    "",
    `Total: \u09F3${Number(order.totalAmount).toFixed(2)}`
  ].join("\n").slice(0, 4096);
  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
    signal: AbortSignal.timeout(1e4)
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(`Telegram Bot API rejected the order notification: ${result.description || response.statusText}`);
  }
  return { sent: true };
};

// src/lib/notification-outbox.ts
var POLL_INTERVAL_MS = 5e3;
var BATCH_SIZE = 10;
var LOCK_DURATION_MS = 5 * 6e4;
var RETRY_BASE_MS = 3e4;
var RETRY_MAX_MS = 6 * 60 * 6e4;
var SENT_RETENTION_DAYS = 30;
var workerStarted = false;
var workerRunning = false;
var rerunRequested = false;
var lastCleanupAt = 0;
var deliver = async (channel, payload) => {
  if (channel === "EMAIL") {
    const result = await sendOrderConfirmationEmail(payload);
    if (!result.sent) throw new Error(`Email was not sent: ${result.reason}`);
    return;
  }
  if (channel === "TELEGRAM") {
    const result = await sendNewOrderTelegramNotification(payload);
    if (!result.sent) throw new Error(`Telegram message was not sent: ${result.reason}`);
    return;
  }
  throw new Error(`Unsupported notification channel: ${channel}`);
};
var processBatch = async () => {
  const now = /* @__PURE__ */ new Date();
  const expiredLock = { status: "PROCESSING", OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }] };
  const entries = await prisma.notificationOutbox.findMany({
    where: {
      OR: [
        { status: "PENDING", nextAttemptAt: { lte: now } },
        expiredLock
      ]
    },
    orderBy: { createdAt: "asc" },
    take: BATCH_SIZE
  });
  for (const entry of entries) {
    const claimed = await prisma.notificationOutbox.updateMany({
      where: {
        id: entry.id,
        OR: [
          { status: "PENDING", nextAttemptAt: { lte: /* @__PURE__ */ new Date() } },
          { status: "PROCESSING", OR: [{ lockedUntil: null }, { lockedUntil: { lt: /* @__PURE__ */ new Date() } }] }
        ]
      },
      data: {
        status: "PROCESSING",
        attempts: { increment: 1 },
        lockedUntil: new Date(Date.now() + LOCK_DURATION_MS)
      }
    });
    if (!claimed.count) continue;
    const attempt = entry.attempts + 1;
    try {
      await deliver(entry.channel, entry.payload);
      await prisma.notificationOutbox.updateMany({
        where: { id: entry.id, status: "PROCESSING" },
        data: { status: "SENT", sentAt: /* @__PURE__ */ new Date(), lockedUntil: null, lastError: null }
      });
      console.info(`Order ${entry.orderNumber}: ${entry.channel} notification delivered`);
    } catch (error) {
      const delay = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** Math.min(attempt - 1, 10));
      const reason = error instanceof Error ? error.message : String(error);
      await prisma.notificationOutbox.updateMany({
        where: { id: entry.id, status: "PROCESSING" },
        data: {
          status: "PENDING",
          nextAttemptAt: new Date(Date.now() + delay),
          lockedUntil: null,
          lastError: reason.slice(0, 2e3)
        }
      });
      console.error(`Order ${entry.orderNumber}: ${entry.channel} notification attempt ${attempt} failed; retry scheduled.`, reason);
    }
  }
  if (Date.now() - lastCleanupAt > 60 * 6e4) {
    lastCleanupAt = Date.now();
    const retentionCutoff = new Date(Date.now() - SENT_RETENTION_DAYS * 24 * 60 * 6e4);
    await prisma.notificationOutbox.deleteMany({
      where: { status: "SENT", sentAt: { lt: retentionCutoff } }
    });
  }
};
var processNotificationOutbox = async () => {
  if (workerRunning) {
    rerunRequested = true;
    return;
  }
  workerRunning = true;
  try {
    do {
      rerunRequested = false;
      await processBatch();
    } while (rerunRequested);
  } catch (error) {
    console.error("Notification outbox poll failed:", error);
  } finally {
    workerRunning = false;
  }
};
var wakeNotificationOutbox = () => {
  void processNotificationOutbox();
};
var startNotificationOutboxWorker = () => {
  if (workerStarted) return;
  workerStarted = true;
  const timer = setInterval(wakeNotificationOutbox, POLL_INTERVAL_MS);
  timer.unref();
  wakeNotificationOutbox();
};

// src/modules/cart/cart.server.ts
var getCartIdentifier = (req) => {
  if (req.user?.id) {
    return req.user.id;
  }
  const headerGuestId = req.headers["x-guest-id"];
  if (typeof headerGuestId === "string" && headerGuestId.trim()) {
    return headerGuestId.trim();
  }
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  const agent = req.get("user-agent") || "unknown";
  return `guest:${ip}:${agent.slice(0, 40)}`;
};
var normalizeQuantity = (value) => {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new AppError(400, "Quantity must be a positive integer");
  }
  return parsed;
};
var getEffectiveProductPrice = (product) => {
  const regularPrice = Number(product.price);
  const discountPrice = product.discountPrice == null ? null : Number(product.discountPrice);
  return discountPrice !== null && Number.isFinite(discountPrice) && discountPrice > 0 && discountPrice < regularPrice ? discountPrice : regularPrice;
};
var normalizeAddress = (address) => {
  if (!address || typeof address !== "object") {
    throw new AppError(400, "Shipping address is required");
  }
  const normalized = address;
  const line1 = normalized.addressLine1 || normalized.address || normalized.street || normalized.line1;
  if (!line1 || typeof line1 !== "string" || !String(line1).trim()) {
    throw new AppError(400, "Shipping address line is required");
  }
  if (!normalized.city || typeof normalized.city !== "string" || !String(normalized.city).trim()) {
    throw new AppError(400, "City is required in the shipping address");
  }
  if (!normalized.country || typeof normalized.country !== "string" || !String(normalized.country).trim()) {
    throw new AppError(400, "Country is required in the shipping address");
  }
  return {
    addressLine1: String(line1).trim(),
    addressLine2: normalized.addressLine2 ? String(normalized.addressLine2) : void 0,
    city: String(normalized.city).trim(),
    state: normalized.state ? String(normalized.state).trim() : void 0,
    country: String(normalized.country).trim(),
    postalCode: normalized.postalCode ? String(normalized.postalCode).trim() : void 0,
    phone: normalized.phone ? String(normalized.phone).trim() : void 0,
    fullName: normalized.fullName ? String(normalized.fullName).trim() : void 0
  };
};
var addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const normalizedProductId = typeof productId === "string" ? productId : void 0;
  if (!normalizedProductId) {
    throw new AppError(400, "Product ID is required");
  }
  const parsedQuantity = normalizeQuantity(quantity);
  const cartUserId = getCartIdentifier(req);
  const product = await prisma.product.findUnique({
    where: { id: normalizedProductId },
    select: {
      id: true,
      name: true,
      isPublished: true,
      price: true,
      inStock: true,
      stockQuantity: true
    }
  });
  if (!product || !product.isPublished) {
    throw new AppError(404, "Product not found");
  }
  if (!product.inStock || product.stockQuantity < parsedQuantity) {
    throw new AppError(400, "Selected quantity exceeds available stock");
  }
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: cartUserId,
        productId: normalizedProductId
      }
    }
  });
  const cartItem = existingItem ? await prisma.cartItem.update({
    where: { id: existingItem.id },
    data: { quantity: existingItem.quantity + parsedQuantity }
  }) : await prisma.cartItem.create({
    data: {
      userId: cartUserId,
      productId: normalizedProductId,
      quantity: parsedQuantity
    }
  });
  res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: cartItem
  });
};
var getCart = async (req, res) => {
  const cartUserId = getCartIdentifier(req);
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: cartUserId },
    include: {
      product: {
        include: {
          images: true,
          seo: true,
          category: {
            include: {
              parent: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  res.status(200).json({
    success: true,
    data: cartItems
  });
};
var updateCartItem = async (req, res) => {
  const productId = typeof req.params.productId === "string" ? req.params.productId : void 0;
  const { quantity } = req.body;
  if (!productId) {
    throw new AppError(400, "Product ID is required");
  }
  const parsedQuantity = normalizeQuantity(quantity);
  const cartUserId = getCartIdentifier(req);
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: cartUserId,
        productId
      }
    }
  });
  if (!existingItem) {
    throw new AppError(404, "Cart item not found");
  }
  const updatedItem = await prisma.cartItem.update({
    where: { id: existingItem.id },
    data: { quantity: parsedQuantity }
  });
  res.status(200).json({
    success: true,
    message: "Cart item updated",
    data: updatedItem
  });
};
var removeCartItem = async (req, res) => {
  const productId = typeof req.params.productId === "string" ? req.params.productId : void 0;
  const cartUserId = getCartIdentifier(req);
  if (!productId) {
    throw new AppError(400, "Product ID is required");
  }
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: cartUserId,
        productId
      }
    }
  });
  if (!existingItem) {
    throw new AppError(404, "Cart item not found");
  }
  await prisma.cartItem.delete({ where: { id: existingItem.id } });
  res.status(200).json({
    success: true,
    message: "Cart item removed"
  });
};
var checkout = async (req, res) => {
  if (!req.user?.id) {
    throw new AppError(401, "Please log in to place an order");
  }
  const { shippingAddress, billingAddress, paymentMethod = "COD", notes } = req.body;
  const normalizedAddress = normalizeAddress(shippingAddress);
  if (!req.user?.id) {
    throw new AppError(401, "Authentication required");
  }
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true }
  });
  if (!cartItems.length) {
    throw new AppError(400, "Your cart is empty");
  }
  if (cartItems.some((item) => !item.product.isPublished)) {
    throw new AppError(400, "Your cart contains a product that is no longer published. Remove it before checkout.");
  }
  const subtotal = cartItems.reduce((total, item) => {
    const price = getEffectiveProductPrice(item.product);
    return total + price * item.quantity;
  }, 0);
  const shippingCost = 50;
  const totalAmount = subtotal + shippingCost;
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: req.user.id,
        orderNumber: `ORD-${Date.now()}`,
        subtotal: subtotal.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        tax: "0.00",
        totalAmount: totalAmount.toFixed(2),
        shippingAddress: normalizedAddress,
        billingAddress: billingAddress ? normalizeAddress(billingAddress) : normalizedAddress,
        paymentMethod: paymentMethod ?? "COD",
        notes: notes ?? null
      }
    });
    await tx.orderItem.createMany({
      data: cartItems.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: getEffectiveProductPrice(item.product).toFixed(2),
        total: (getEffectiveProductPrice(item.product) * item.quantity).toFixed(2)
      }))
    });
    const invoiceNumber = `INV-${Date.now()}-${createdOrder.id.slice(0, 6).toUpperCase()}`;
    await tx.invoice.create({
      data: {
        orderId: createdOrder.id,
        invoiceNumber,
        pdfUrl: `/invoices/${invoiceNumber}.pdf`,
        sentAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.cartItem.deleteMany({
      where: { userId: req.user.id }
    });
    const notificationItems = cartItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: getEffectiveProductPrice(item.product).toFixed(2)
    }));
    await tx.notificationOutbox.createMany({
      data: [
        {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          channel: "TELEGRAM",
          payload: {
            orderNumber: createdOrder.orderNumber,
            customerName: req.user.name || "Customer",
            totalAmount: createdOrder.totalAmount.toString(),
            paymentMethod: createdOrder.paymentMethod || "COD",
            items: notificationItems
          }
        },
        {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          channel: "EMAIL",
          payload: {
            customerEmail: req.user.email,
            customerName: req.user.name || "Customer",
            orderNumber: createdOrder.orderNumber,
            totalAmount: createdOrder.totalAmount.toString(),
            paymentMethod: createdOrder.paymentMethod || "COD",
            items: notificationItems
          }
        }
      ]
    });
    return createdOrder;
  });
  try {
    const io2 = getIO();
    io2.to("admin-room").emit("order:created", {
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      customerName: req.user?.name || "Customer",
      userId: req.user?.id,
      id: order.id,
      createdAt: order.createdAt
    });
  } catch (err) {
    console.error("Failed to emit order created socket event:", err);
  }
  wakeNotificationOutbox();
  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order
  });
};
var mergeCart = async (req, res) => {
  if (!req.user?.id) {
    throw new AppError(401, "Authentication required");
  }
  const guestId = req.body?.guestId || req.headers["x-guest-id"];
  const normalizedGuestId = typeof guestId === "string" ? guestId.trim() : "";
  if (!normalizedGuestId) {
    throw new AppError(400, "Guest ID is required");
  }
  if (normalizedGuestId === req.user.id) {
    return res.status(200).json({
      success: true,
      message: "No guest cart items to merge",
      data: { merged: 0 }
    });
  }
  const guestItems = await prisma.cartItem.findMany({
    where: { userId: normalizedGuestId }
  });
  if (!guestItems.length) {
    return res.status(200).json({
      success: true,
      message: "No guest cart items to merge",
      data: { merged: 0 }
    });
  }
  for (const item of guestItems) {
    await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: item.productId
        }
      },
      update: {
        quantity: { increment: item.quantity }
      },
      create: {
        userId: req.user.id,
        productId: item.productId,
        quantity: item.quantity
      }
    });
  }
  await prisma.cartItem.deleteMany({
    where: { userId: normalizedGuestId }
  });
  res.status(200).json({
    success: true,
    message: "Cart merged successfully",
    data: { merged: guestItems.length }
  });
};
var cartServer = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  checkout,
  mergeCart
};

// src/modules/cart/cart.controller.ts
var addToCart2 = async (req, res) => {
  try {
    await cartServer.addToCart(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var getCart2 = async (req, res) => {
  try {
    await cartServer.getCart(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var updateCartItem2 = async (req, res) => {
  try {
    await cartServer.updateCartItem(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var removeCartItem2 = async (req, res) => {
  try {
    await cartServer.removeCartItem(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var checkout2 = async (req, res) => {
  try {
    await cartServer.checkout(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var mergeCart2 = async (req, res) => {
  try {
    await cartServer.mergeCart(req, res);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var cartController = {
  addToCart: addToCart2,
  getCart: getCart2,
  updateCartItem: updateCartItem2,
  removeCartItem: removeCartItem2,
  checkout: checkout2,
  mergeCart: mergeCart2
};

// src/modules/cart/cart.router.ts
var router4 = Router4();
router4.get("/", optionalAuth(), cartController.getCart);
router4.post("/items", optionalAuth(), cartController.addToCart);
router4.put("/items/:productId", optionalAuth(), cartController.updateCartItem);
router4.delete("/items/:productId", optionalAuth(), cartController.removeCartItem);
router4.post("/merge", auth_default(), cartController.mergeCart);
router4.post("/checkout", auth_default(), cartController.checkout);
var cartRouter = router4;

// src/modules/help-request/help.router.ts
import { Router as Router5 } from "express";

// src/modules/help-request/help.service.ts
var createPublicHelpRequest = async (input) => {
  if (!input.subject?.trim()) {
    throw new AppError(400, "Subject is required");
  }
  if (!input.message?.trim()) {
    throw new AppError(400, "Message is required");
  }
  const created = await prisma.helpRequest.create({
    data: {
      subject: input.subject.trim(),
      message: input.message.trim(),
      phoneNumber: input.phoneNumber?.trim() || null,
      status: "OPEN"
    }
  });
  emitAdminNotification({
    id: created.id,
    title: "New Help Request",
    message: `New help request: ${created.subject}`,
    type: "info"
  });
  return created;
};
var createHelpRequest = async (input) => {
  if (!input.subject?.trim()) {
    throw new AppError(400, "Subject is required");
  }
  if (!input.message?.trim()) {
    throw new AppError(400, "Message is required");
  }
  if (!input.userId) {
    throw new AppError(400, "User is required");
  }
  const created = await prisma.helpRequest.create({
    data: {
      userId: input.userId,
      subject: input.subject.trim(),
      message: input.message.trim(),
      phoneNumber: input.phoneNumber?.trim() || null,
      status: "OPEN"
    }
  });
  emitAdminNotification({
    id: created.id,
    title: "New Help Request",
    message: `New help request from user: ${created.subject}`,
    type: "info"
  });
  return created;
};
var getAllHelpRequests = async () => {
  return prisma.helpRequest.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var getHelpRequestById = async (id) => {
  return prisma.helpRequest.findUnique({ where: { id } });
};
var updateHelpRequestStatus = async (id, status) => {
  const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
  if (!validStatuses.includes(status)) {
    throw new AppError(400, "Invalid help request status");
  }
  const existing = await prisma.helpRequest.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Help request not found");
  }
  const updated = await prisma.helpRequest.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "RESOLVED" || status === "CLOSED" ? /* @__PURE__ */ new Date() : null
    }
  });
  emitAdminNotification({
    id: updated.id,
    title: "Help Request Updated",
    message: `Help request status changed to ${status}`,
    type: "success"
  });
  return updated;
};
var helpService = {
  createPublicHelpRequest,
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus
};

// src/modules/help-request/help.controller.ts
var createPublicHelpRequest2 = async (req, res) => {
  try {
    const { name, phoneNumber, orderId, subject, message } = req.body;
    if (!name?.trim()) {
      throw new AppError(400, "Name is required");
    }
    if (!phoneNumber?.trim()) {
      throw new AppError(400, "Phone number is required");
    }
    if (!subject?.trim() && !message?.trim()) {
      throw new AppError(400, "Subject or message is required");
    }
    const finalSubject = subject?.trim() || "Customer Support Request";
    const finalMessage = message?.trim() || `Order ID: ${orderId || "N/A"}

Customer: ${name}
Phone: ${phoneNumber}`;
    const request = await helpService.createPublicHelpRequest({
      subject: finalSubject,
      message: finalMessage,
      phoneNumber: phoneNumber?.trim(),
      userName: name?.trim(),
      orderId: orderId?.trim()
    });
    res.status(201).json({
      success: true,
      message: "Help request submitted successfully",
      data: request
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var createHelpRequest2 = async (req, res) => {
  try {
    const { subject, message, phoneNumber, productName, productId, userName, address } = req.body;
    if (!req.user?.id) {
      throw new AppError(401, "Please log in to submit a help request");
    }
    const normalizedPhone = typeof phoneNumber === "string" ? phoneNumber : void 0;
    const request = await helpService.createHelpRequest({
      userId: req.user.id,
      subject: subject || `${productName || "Product"} issue`,
      message: message || `Product: ${productName || "Unknown"}
Product ID: ${productId || "N/A"}
User: ${userName || req.user.name}
Phone: ${phoneNumber || "N/A"}
Address: ${address || "N/A"}`,
      phoneNumber: normalizedPhone
    });
    res.status(201).json({
      success: true,
      message: "Help request submitted successfully",
      data: request
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var getAllHelpRequests2 = async (req, res) => {
  try {
    const requests = await helpService.getAllHelpRequests();
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var getHelpRequestById2 = async (req, res) => {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : void 0;
    if (!id) {
      throw new AppError(400, "Help request ID is required");
    }
    const request = await helpService.getHelpRequestById(id);
    if (!request) {
      throw new AppError(404, "Help request not found");
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var updateHelpRequestStatus2 = async (req, res) => {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : void 0;
    const { status } = req.body;
    if (!id) {
      throw new AppError(400, "Help request ID is required");
    }
    const normalizedStatus = typeof status === "string" ? status : "RESOLVED";
    const request = await helpService.updateHelpRequestStatus(id, normalizedStatus);
    res.status(200).json({
      success: true,
      message: "Help request status updated",
      data: request
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var helpController = {
  createPublicHelpRequest: createPublicHelpRequest2,
  createHelpRequest: createHelpRequest2,
  getAllHelpRequests: getAllHelpRequests2,
  getHelpRequestById: getHelpRequestById2,
  updateHelpRequestStatus: updateHelpRequestStatus2
};

// src/modules/help-request/help.router.ts
var router5 = Router5();
router5.post("/public", helpController.createPublicHelpRequest);
router5.post("/", auth_default(), helpController.createHelpRequest);
router5.get("/", auth_default("ADMIN" /* ADMIN */), helpController.getAllHelpRequests);
router5.get("/:id", auth_default("ADMIN" /* ADMIN */), helpController.getHelpRequestById);
router5.patch("/:id/status", auth_default("ADMIN" /* ADMIN */), helpController.updateHelpRequestStatus);
var helpRouter = router5;

// src/modules/order/order.router.ts
import { Router as Router6 } from "express";

// src/modules/invoice/invoice.service.ts
var createInvoiceForOrder = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  const existingInvoice = await prisma.invoice.findUnique({
    where: { orderId }
  });
  if (existingInvoice) {
    return existingInvoice;
  }
  const invoiceNumber = `INV-${Date.now()}-${order.id.slice(0, 6).toUpperCase()}`;
  return prisma.invoice.create({
    data: {
      orderId,
      invoiceNumber,
      pdfUrl: `/invoices/${invoiceNumber}.pdf`,
      sentAt: /* @__PURE__ */ new Date()
    }
  });
};
var getInvoiceByOrderId = async (orderId) => {
  return prisma.invoice.findUnique({
    where: { orderId },
    include: {
      order: {
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  });
};
var getInvoiceByInvoiceNumber = async (invoiceNumber) => {
  return prisma.invoice.findUnique({
    where: { invoiceNumber },
    include: {
      order: {
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  });
};
var getInvoiceById = async (id) => {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  });
};
var invoiceService = {
  createInvoiceForOrder,
  getInvoiceByOrderId,
  getInvoiceById,
  getInvoiceByInvoiceNumber
};

// src/modules/order/order.service.ts
var getOrdersForUser = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      invoice: true,
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: "asc" }
              }
            }
          }
        },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getAllOrders = async ({
  page = 1,
  limit = 30,
  search,
  status
} = {}) => {
  try {
    const skip = (page - 1) * limit;
    const where = {};
    const normalizedSearch = search?.trim();
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (normalizedSearch) {
      where.OR = [
        { id: { contains: normalizedSearch, mode: "insensitive" } },
        { orderNumber: { contains: normalizedSearch, mode: "insensitive" } },
        { shippingAddress: { path: ["fullName"], string_contains: normalizedSearch } },
        { shippingAddress: { path: ["name"], string_contains: normalizedSearch } },
        {
          user: {
            is: {
              OR: [
                { name: { contains: normalizedSearch, mode: "insensitive" } },
                { email: { contains: normalizedSearch, mode: "insensitive" } }
              ]
            }
          }
        },
        {
          items: {
            some: {
              OR: [
                { productId: { contains: normalizedSearch, mode: "insensitive" } },
                {
                  product: {
                    is: {
                      OR: [
                        { name: { contains: normalizedSearch, mode: "insensitive" } },
                        { sku: { contains: normalizedSearch, mode: "insensitive" } }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ];
    }
    const statsPromise = page === 1 ? Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: { in: ["PROCESSING", "SHIPPED"] } } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: { notIn: ["DELIVERED", "CANCELLED", "REFUNDED"] } } }),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { subtotal: true, shippingCost: true }
      })
    ]) : Promise.resolve(null);
    const [orders, total, stats] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          invoice: true,
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { order: "asc" }
                  }
                }
              }
            },
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.order.count({ where }),
      statsPromise
    ]);
    return {
      orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      ...stats ? {
        stats: {
          total: stats[0],
          pending: stats[1],
          processing: stats[2],
          delivered: stats[3],
          active: stats[4],
          revenue: Number(stats[5]._sum.subtotal || 0) + Number(stats[5]._sum.shippingCost || 0)
        }
      } : {}
    };
  } catch (error) {
    console.error("getAllOrders error:", error);
    throw error;
  }
};
var getOrderById = async (id) => {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        invoice: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { order: "asc" }
                }
              }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });
  } catch (error) {
    console.error("getOrderById error:", error);
    return prisma.order.findUnique({
      where: { id },
      include: {
        invoice: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { order: "asc" }
                }
              }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });
  }
};
var normalizeStatus = (status) => {
  const input = status.toUpperCase();
  if (input === "PACKING") return "PROCESSING";
  if (input === "DELIVERING") return "SHIPPED";
  if (input === "PROCESS") return "PROCESSING";
  if (input === "SHIPPED") return "SHIPPED";
  if (input === "PENDING") return "PENDING";
  if (input === "DELIVERED") return "DELIVERED";
  if (input === "CANCELLED") return "CANCELLED";
  if (input === "REFUNDED") return "REFUNDED";
  return input;
};
var updateOrderStatus = async (id, status) => {
  const normalizedStatus = normalizeStatus(status);
  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  if (!validStatuses.includes(normalizedStatus)) {
    throw new AppError(400, "Invalid order status");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError(404, "Order not found");
  }
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: normalizedStatus,
      isDelivered: normalizedStatus === "DELIVERED",
      deliveredAt: normalizedStatus === "DELIVERED" ? /* @__PURE__ */ new Date() : null
    }
  });
  if (normalizedStatus === "DELIVERED") {
    await invoiceService.createInvoiceForOrder(updatedOrder.id);
  }
  return updatedOrder;
};
var updatePaymentStatus = async (id, paymentStatus) => {
  const normalized = paymentStatus.toUpperCase();
  const valid = ["PENDING", "PAID", "FAILED", "REFUNDED"];
  if (!valid.includes(normalized)) {
    throw new AppError(400, "Invalid payment status");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError(404, "Order not found");
  }
  return prisma.order.update({
    where: { id },
    data: { paymentStatus: normalized }
  });
};
var getTotalSales = async () => {
  const result = await prisma.order.aggregate({
    where: {
      status: {
        not: "CANCELLED"
      },
      paymentStatus: {
        not: "FAILED"
      }
    },
    _sum: {
      totalAmount: true
    }
  });
  return {
    totalSales: Number(result._sum.totalAmount || 0),
    orderCount: await prisma.order.count({
      where: {
        status: { not: "CANCELLED" },
        paymentStatus: { not: "FAILED" }
      }
    })
  };
};
var getGrossProfit = async () => {
  const paidItems = await prisma.orderItem.findMany({
    where: { order: { paymentStatus: "PAID" } },
    select: {
      quantity: true,
      price: true,
      product: { select: { buyingPrice: true } }
    }
  });
  const pricedItems = paidItems.filter((item) => item.product.buyingPrice !== null);
  const grossProfitInCents = pricedItems.reduce(
    (sum, item) => sum + Math.round((Number(item.price) - Number(item.product.buyingPrice)) * 100) * item.quantity,
    0
  );
  return {
    grossProfit: grossProfitInCents / 100,
    pricedLineCount: pricedItems.length,
    missingBuyingPriceLineCount: paidItems.length - pricedItems.length
  };
};
var orderService = {
  getOrdersForUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getTotalSales,
  getGrossProfit
};

// src/modules/order/order.controller.ts
var serializeOrder = (order) => {
  const shippingAddress = typeof order.shippingAddress === "object" && order.shippingAddress ? order.shippingAddress : {};
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    activeStatus: order.status,
    totalAmount: Number(order.totalAmount).toFixed(2),
    subtotal: Number(order.subtotal).toFixed(2),
    shippingCost: Number(order.shippingCost || 0).toFixed(2),
    tax: Number(order.tax || 0).toFixed(2),
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    customerName: shippingAddress.fullName || shippingAddress.name || "Unknown",
    userId: order.userId,
    user: order.user ? {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone
    } : null,
    deliveryLocation: shippingAddress,
    orderTime: order.createdAt,
    isDelivered: order.isDelivered,
    deliveredAt: order.deliveredAt,
    items: (order.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.name || "Unknown",
      sku: item.product?.sku || null,
      quantity: item.quantity,
      price: Number(item.price).toFixed(2),
      total: Number(item.total).toFixed(2),
      productImage: item.product?.images?.[0]?.imageUrl || null
    })),
    invoice: order.invoice ? {
      id: order.invoice.id,
      invoiceNumber: order.invoice.invoiceNumber,
      pdfUrl: order.invoice.pdfUrl,
      sentAt: order.invoice.sentAt
    } : null
  };
};
var getOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new AppError(401, "Please log in to view orders");
    }
    const orders = req.user.role === "ADMIN" ? (await orderService.getAllOrders({ limit: 100 })).orders : await orderService.getOrdersForUser(req.user.id);
    res.status(200).json({
      success: true,
      data: orders.map(serializeOrder)
    });
  } catch (error) {
    console.error("GET_ORDERS_ERROR:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 30;
    const result = await orderService.getAllOrders({
      page,
      limit,
      ...typeof req.query.search === "string" ? { search: req.query.search } : {},
      ...typeof req.query.status === "string" ? { status: req.query.status } : {}
    });
    res.status(200).json({
      success: true,
      data: result.orders.map(serializeOrder),
      meta: result.meta,
      stats: result.stats
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : void 0;
    if (!id) {
      throw new AppError(400, "Order ID is required");
    }
    const order = await orderService.getOrderById(id);
    if (!order) {
      throw new AppError(404, "Order not found");
    }
    if (req.user?.role !== "ADMIN" && order.userId !== req.user?.id) {
      throw new AppError(403, "You can only view your own orders");
    }
    res.status(200).json({
      success: true,
      data: serializeOrder(order)
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : void 0;
    const { status } = req.body;
    if (!id) {
      throw new AppError(400, "Order ID is required");
    }
    if (typeof status !== "string" || !status.trim()) {
      throw new AppError(400, "Order status is required");
    }
    const updatedOrder = await orderService.updateOrderStatus(id, status);
    emitOrderStatusUpdated({ orderId: updatedOrder.id, status: updatedOrder.status });
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: serializeOrder(updatedOrder)
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var updatePaymentStatus2 = async (req, res) => {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : void 0;
    const { paymentStatus } = req.body;
    if (!id) {
      throw new AppError(400, "Order ID is required");
    }
    if (typeof paymentStatus !== "string" || !paymentStatus.trim()) {
      throw new AppError(400, "Payment status is required");
    }
    const updatedOrder = await orderService.updatePaymentStatus(id, paymentStatus);
    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: serializeOrder(updatedOrder)
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var getTotalSales2 = async (req, res) => {
  try {
    const result = await orderService.getTotalSales();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var getGrossProfit2 = async (_req, res) => {
  try {
    const result = await orderService.getGrossProfit();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var orderController = {
  getOrders,
  getAllOrders: getAllOrders2,
  getOrderById: getOrderById2,
  updateOrderStatus: updateOrderStatus2,
  updatePaymentStatus: updatePaymentStatus2,
  getTotalSales: getTotalSales2,
  getGrossProfit: getGrossProfit2
};

// src/modules/order/order.router.ts
var router6 = Router6();
router6.get("/", auth_default(), orderController.getOrders);
router6.get("/admin", auth_default("ADMIN" /* ADMIN */), orderController.getAllOrders);
router6.get("/total-sales", auth_default("ADMIN" /* ADMIN */), orderController.getTotalSales);
router6.get("/gross-profit", auth_default("ADMIN" /* ADMIN */), orderController.getGrossProfit);
router6.get("/:id", auth_default(), orderController.getOrderById);
router6.patch("/:id/status", auth_default("ADMIN" /* ADMIN */), orderController.updateOrderStatus);
router6.patch("/:id/payment", auth_default("ADMIN" /* ADMIN */), orderController.updatePaymentStatus);
var orderRouter = router6;

// src/modules/invoice/invoice.router.ts
import { Router as Router7 } from "express";

// src/lib/pdf.ts
import { Buffer } from "buffer";
import { readFileSync } from "fs";
import { resolve } from "path";
import { deflateSync, inflateSync } from "zlib";
function escapeText(text) {
  return String(text ?? "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\r\n/g, "\n").replace(/\n/g, "\\n");
}
function pad10(num) {
  const s = String(num);
  return "0".repeat(Math.max(0, 10 - s.length)) + s;
}
function paethPredictor(left, above, upperLeft) {
  const estimate = left + above - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const aboveDistance = Math.abs(estimate - above);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  return aboveDistance <= upperLeftDistance ? above : upperLeft;
}
function decodeLogoPng(png) {
  if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new Error("Invoice logo is not a PNG image");
  }
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const imageData = [];
  for (let offset = 8; offset < png.length; ) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const chunk = png.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8];
      colorType = chunk[9];
      interlace = chunk[12];
    } else if (type === "IDAT") {
      imageData.push(chunk);
    } else if (type === "IEND") {
      break;
    }
    offset += length + 12;
  }
  if (!width || !height || bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
    throw new Error("Invoice logo must be a non-interlaced 8-bit RGBA PNG");
  }
  const rowLength = width * 4;
  const filtered = inflateSync(Buffer.concat(imageData));
  const pixels = Buffer.alloc(rowLength * height);
  for (let row = 0; row < height; row += 1) {
    const sourceOffset = row * (rowLength + 1);
    const targetOffset = row * rowLength;
    const filter = filtered[sourceOffset];
    for (let column = 0; column < rowLength; column += 1) {
      const left2 = column >= 4 ? pixels[targetOffset + column - 4] : 0;
      const above = row > 0 ? pixels[targetOffset - rowLength + column] : 0;
      const upperLeft = row > 0 && column >= 4 ? pixels[targetOffset - rowLength + column - 4] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left2;
      else if (filter === 2) predictor = above;
      else if (filter === 3) predictor = Math.floor((left2 + above) / 2);
      else if (filter === 4) predictor = paethPredictor(left2, above, upperLeft);
      else if (filter !== 0) throw new Error("Invoice logo contains an unsupported PNG filter");
      pixels[targetOffset + column] = filtered[sourceOffset + column + 1] + predictor & 255;
    }
  }
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      if (pixels[(row * width + column) * 4 + 3] > 8) {
        left = Math.min(left, column);
        top = Math.min(top, row);
        right = Math.max(right, column);
        bottom = Math.max(bottom, row);
      }
    }
  }
  if (right < left || bottom < top) throw new Error("Invoice logo is empty");
  const croppedWidth = right - left + 1;
  const croppedHeight = bottom - top + 1;
  const rgb = Buffer.alloc(croppedWidth * croppedHeight * 3);
  const alpha = Buffer.alloc(croppedWidth * croppedHeight);
  for (let row = 0; row < croppedHeight; row += 1) {
    for (let column = 0; column < croppedWidth; column += 1) {
      const source = ((top + row) * width + left + column) * 4;
      const target = row * croppedWidth + column;
      pixels.copy(rgb, target * 3, source, source + 3);
      alpha[target] = pixels[source + 3];
    }
  }
  return {
    width: croppedWidth,
    height: croppedHeight,
    rgb: deflateSync(rgb),
    alpha: deflateSync(alpha)
  };
}
function generateInvoicePdf(data) {
  const pageW = 595;
  const pageH = 842;
  const margin = 48;
  const right = pageW - margin;
  const colors = {
    ink: "0.10 0.13 0.18",
    muted: "0.40 0.44 0.50",
    red: "0.84 0.10 0.13",
    pale: "0.96 0.97 0.98",
    rule: "0.87 0.89 0.91",
    white: "1 1 1"
  };
  const pages = [];
  let commands = [];
  let y = 0;
  const logo = decodeLogoPng(readFileSync(resolve(process.cwd(), "assets", "main-logo.png")));
  const rectangle = (x, top, width, height, color) => {
    commands.push(`${color} rg ${x} ${pageH - top - height} ${width} ${height} re f`);
  };
  const rule = (x1, top, x2, color = colors.rule) => {
    commands.push(`${color} RG 0.7 w ${x1} ${pageH - top} m ${x2} ${pageH - top} l S`);
  };
  const image = (x, top, width, height) => {
    commands.push(`q ${width.toFixed(2)} 0 0 ${height.toFixed(2)} ${x.toFixed(2)} ${(pageH - top - height).toFixed(2)} cm /Im1 Do Q`);
  };
  const text = (value, x, baseline, size2 = 10, color = colors.ink, bold = false, align = "left") => {
    const safeValue = escapeText(value);
    const textX = align === "right" ? x - value.length * size2 * 0.5 : x;
    commands.push(`BT /${bold ? "F2" : "F1"} ${size2} Tf ${color} rg 1 0 0 1 ${textX.toFixed(2)} ${(pageH - baseline).toFixed(2)} Tm (${safeValue}) Tj ET`);
  };
  const wrap = (value, maxChars) => {
    const words = String(value || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (next.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  const startPage = (continuation = false) => {
    commands = [];
    pages.push(commands);
    rectangle(0, 0, pageW, 7, colors.red);
    const logoScale = Math.min(150 / logo.width, 76 / logo.height);
    image(margin, 8, logo.width * logoScale, logo.height * logoScale);
    text(continuation ? "INVOICE / CONTINUED" : "INVOICE", right, 53, 22, colors.ink, true, "right");
    text(`Invoice ${data.invoiceNumber || "N/A"}`, right, 72, 9, colors.muted, false, "right");
    y = continuation ? 112 : 0;
  };
  const drawTableHeader = () => {
    rectangle(margin, y, right - margin, 30, colors.ink);
    text("PRODUCT", margin + 12, y + 19, 8, colors.white, true);
    text("QTY", 366, y + 19, 8, colors.white, true, "right");
    text("UNIT PRICE", 455, y + 19, 8, colors.white, true, "right");
    text("AMOUNT", right - 12, y + 19, 8, colors.white, true, "right");
    y += 30;
  };
  startPage();
  rectangle(margin, 94, right - margin, 94, colors.pale);
  const metadata = [
    ["INVOICE NUMBER", data.invoiceNumber || "N/A"],
    ["ORDER NUMBER", data.orderNumber || "N/A"],
    ["DATE ISSUED", data.orderDate || (/* @__PURE__ */ new Date()).toLocaleDateString()],
    ["ORDER STATUS", data.status || "PENDING"]
  ];
  metadata.forEach(([label, value], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = margin + 12 + column * 246;
    const labelBaseline = row === 0 ? 112 : 154;
    text(label, x, labelBaseline, 7, colors.muted, true);
    text(value, x, labelBaseline + 16, 8.5, colors.ink, true);
  });
  rectangle(margin, 200, 241, 104, colors.pale);
  rectangle(306, 200, right - 306, 104, colors.pale);
  text("BILL TO", margin + 12, 221, 8, colors.red, true);
  let customerY = 241;
  const customerLines = [
    ...wrap(data.customerName || "Unknown", 39),
    ...wrap(data.customerAddress || "", 39),
    ...data.customerPhone ? wrap(`Phone: ${data.customerPhone}`, 39) : []
  ];
  customerLines.slice(0, 4).forEach((line, index) => {
    text(line, margin + 12, customerY + index * 15, 9, index === 0 ? colors.ink : colors.muted, index === 0);
  });
  text("ORDER", 318, 221, 8, colors.red, true);
  text("Payment due", 318, 243, 8, colors.muted);
  text("As agreed at checkout", 318, 259, 9, colors.ink, true);
  text("Status", 318, 280, 8, colors.muted);
  text(data.status || "PENDING", 375, 280, 9, colors.ink, true);
  y = 330;
  drawTableHeader();
  let rowIndex = 0;
  for (const item of data.items || []) {
    const productLines = wrap(item.productName || "Product", 44);
    const rowHeight = Math.max(36, productLines.length * 13 + 15);
    if (y + rowHeight > 710) {
      startPage(true);
      drawTableHeader();
    }
    if (rowIndex % 2 === 0) rectangle(margin, y, right - margin, rowHeight, colors.pale);
    productLines.forEach((line, index) => text(line, margin + 12, y + 18 + index * 13, 9, colors.ink, index === 0));
    const baseline = y + Math.min(rowHeight - 12, 22);
    text(String(item.quantity), 366, baseline, 9, colors.ink, false, "right");
    text(`BDT ${item.price}`, 455, baseline, 9, colors.ink, false, "right");
    text(`BDT ${item.total}`, right - 12, baseline, 9, colors.ink, true, "right");
    y += rowHeight;
    rule(margin, y, right);
    rowIndex += 1;
  }
  if (rowIndex === 0) {
    text("No item details available", margin + 12, y + 20, 9, colors.muted);
    y += 36;
  }
  if (y + 132 > pageH - 76) {
    startPage(true);
  }
  const totalsX = 340;
  const totalsRight = right - 12;
  rule(totalsX, y + 7, right);
  y += 29;
  text("Subtotal", totalsX, y, 9, colors.muted);
  text(`BDT ${data.subtotal ?? "0.00"}`, totalsRight, y, 9, colors.ink, false, "right");
  y += 20;
  text("Shipping", totalsX, y, 9, colors.muted);
  text(`BDT ${data.shippingCost ?? "0.00"}`, totalsRight, y, 9, colors.ink, false, "right");
  if (data.tax !== void 0) {
    y += 20;
    text("Tax", totalsX, y, 9, colors.muted);
    text(`BDT ${data.tax}`, totalsRight, y, 9, colors.ink, false, "right");
  }
  y += 17;
  rectangle(totalsX - 8, y, right - totalsX + 8, 38, colors.red);
  text("TOTAL DUE", totalsX + 4, y + 24, 9, colors.white, true);
  text(`BDT ${data.total ?? data.subtotal ?? "0.00"}`, totalsRight - 4, y + 24, 12, colors.white, true, "right");
  pages.forEach((page, index) => {
    page.push(`${colors.rule} RG 0.7 w ${margin} 54 m ${right} 54 l S`);
    page.push(`BT /F1 8 Tf ${colors.muted} rg 1 0 0 1 ${margin} 35 Tm (Thank you for shopping with AmrBasket.) Tj ET`);
    page.push(`BT /F1 8 Tf ${colors.muted} rg 1 0 0 1 ${right - 65} 35 Tm (Page ${index + 1} of ${pages.length}) Tj ET`);
  });
  const body = (num, content) => `${num} 0 obj
${content}
endobj
`;
  const objects = [
    body(1, "<< /Type /Catalog /Pages 2 0 R >>"),
    body(2, `<< /Type /Pages /Kids [${pages.map((_, index) => `${7 + index * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`),
    body(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
    body(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
  ];
  const imageObject = (num, dictionary, stream) => `${num} 0 obj
<< ${dictionary} /Length ${stream.length} >>
stream
${stream.toString("latin1")}
endstream
endobj
`;
  objects.push(
    imageObject(5, ` /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode`, logo.alpha),
    imageObject(6, ` /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /SMask 5 0 R`, logo.rgb)
  );
  pages.forEach((page, index) => {
    const pageObject = 7 + index * 2;
    const contentObject = pageObject + 1;
    const content = page.join("\n");
    objects.push(body(pageObject, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents ${contentObject} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << /Im1 6 0 R >> >> >>`));
    objects.push(body(contentObject, `<< /Length ${Buffer.byteLength(content, "latin1")} >>
stream
${content}
endstream`));
  });
  const header = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [];
  let size = Buffer.byteLength(header, "latin1");
  for (const object of objects) {
    offsets.push(size);
    size += Buffer.byteLength(object, "latin1");
  }
  const xrefOffset = size;
  let xref = `xref
0 ${objects.length + 1}
0000000000 65535 f\r
`;
  for (const offset of offsets) xref += `${pad10(offset)} 00000 n\r
`;
  const trailer = `trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF
`;
  return Buffer.from(header + objects.join("") + xref + trailer, "latin1");
}

// src/modules/invoice/invoice.controller.ts
var getInvoiceByOrderId2 = async (req, res) => {
  try {
    const orderId = typeof req.params.orderId === "string" ? req.params.orderId : void 0;
    if (!orderId) {
      throw new AppError(400, "Order ID is required");
    }
    const invoice = await invoiceService.getInvoiceByOrderId(orderId);
    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }
    if (req.user?.role !== "ADMIN" && invoice.order.userId !== req.user?.id) {
      throw new AppError(403, "You can only view your own invoices");
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var getInvoiceById2 = async (req, res) => {
  try {
    const invoiceId = typeof req.params.invoiceId === "string" ? req.params.invoiceId : void 0;
    if (!invoiceId) {
      throw new AppError(400, "Invoice ID is required");
    }
    const invoice = await invoiceService.getInvoiceById(invoiceId);
    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }
    if (req.user?.role !== "ADMIN" && invoice.order.userId !== req.user?.id) {
      throw new AppError(403, "You can only view your own invoices");
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var streamInvoicePdf = async (req, res) => {
  try {
    const path2 = (req.path || "").replace(/^\/+/, "");
    const match = path2.match(/^(.+)\.pdf$/i);
    const invoiceNumber = match ? match[1] : typeof req.params.invoiceNumber === "string" ? req.params.invoiceNumber : void 0;
    if (!invoiceNumber) {
      throw new AppError(400, "Invoice number is required");
    }
    const invoice = await invoiceService.getInvoiceByInvoiceNumber(invoiceNumber);
    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }
    if (req.user?.role !== "ADMIN" && invoice.order.userId !== req.user?.id) {
      throw new AppError(403, "You can only view your own invoices");
    }
    const order = invoice.order;
    const shippingAddress = typeof order.shippingAddress === "object" && order.shippingAddress ? order.shippingAddress : {};
    const data = {
      invoiceNumber: invoice.invoiceNumber,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      status: order.status,
      customerName: typeof shippingAddress.fullName === "string" ? shippingAddress.fullName : typeof shippingAddress.name === "string" ? shippingAddress.name : "Unknown",
      customerAddress: [
        shippingAddress.address,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.zip,
        shippingAddress.postalCode,
        shippingAddress.country
      ].filter((value) => typeof value === "string").join(", "),
      customerPhone: typeof shippingAddress.phone === "string" ? shippingAddress.phone : "",
      items: (order.items || []).map((item) => ({
        productName: item.product?.name || "Unknown",
        quantity: Number(item.quantity) || 0,
        price: Number(item.price).toFixed(2),
        total: Number(item.total).toFixed(2)
      })),
      subtotal: Number(order.subtotal).toFixed(2),
      shippingCost: Number(order.shippingCost || 0).toFixed(2),
      tax: Number(order.tax || 0).toFixed(2),
      total: Number(order.totalAmount).toFixed(2)
    };
    const buffer = generateInvoicePdf(data);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      "Content-Length": buffer.length.toString()
    });
    res.send(buffer);
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var invoiceController = {
  getInvoiceByOrderId: getInvoiceByOrderId2,
  getInvoiceById: getInvoiceById2,
  streamInvoicePdf
};

// src/modules/invoice/invoice.router.ts
var router7 = Router7();
router7.get("/order/:orderId", auth_default(), invoiceController.getInvoiceByOrderId);
router7.get(/^\/(.+)\.pdf$/, auth_default(), invoiceController.streamInvoicePdf);
router7.get("/:invoiceId", auth_default(), invoiceController.getInvoiceById);
var invoiceRouter = router7;

// src/modules/visitor/visitor.router.ts
import { Router as Router8 } from "express";

// src/modules/visitor/visitor.service.ts
var ensureVisitor = async (input) => {
  const sessionId = input.sessionId || `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const existingVisitor = await prisma.visitor.findFirst({
    where: { sessionId }
  });
  if (existingVisitor) {
    return existingVisitor;
  }
  return prisma.visitor.create({
    data: {
      sessionId,
      ipAddress: input.ipAddress || null,
      userAgent: input.userAgent || null,
      userId: input.userId || null
    }
  });
};
var trackPageView = async (input) => {
  const visitor = await ensureVisitor(input);
  return prisma.pageView.create({
    data: {
      visitorId: visitor.id,
      pageUrl: input.pageUrl,
      pageTitle: input.pageTitle || null,
      productId: input.productId || null,
      categoryId: input.categoryId || null,
      referrer: input.referrer || null,
      timeSpent: input.timeSpent || null
    }
  });
};
var trackProductView = async (input) => {
  if (!input.productId) {
    throw new AppError(400, "Product ID is required");
  }
  await trackPageView({
    ...input,
    pageUrl: input.pageUrl || `/product/${input.productId}`,
    pageTitle: input.pageTitle || "Product View",
    productId: input.productId
  });
  return { success: true, message: "Product view tracked" };
};
var trackCartActivity = async (input) => {
  if (!input.productId) {
    throw new AppError(400, "Product ID is required");
  }
  const visitor = await ensureVisitor(input);
  await prisma.pageView.create({
    data: {
      visitorId: visitor.id,
      pageUrl: "/cart",
      pageTitle: input.action,
      productId: input.productId,
      referrer: input.action,
      timeSpent: input.quantity || null
    }
  });
  return { success: true, message: `Cart activity tracked: ${input.action}` };
};
var getVisitorAnalytics = async () => {
  const [totalVisitors, totalPageViews, totalProductViews, cartAdds, orders] = await Promise.all([
    prisma.visitor.count(),
    prisma.pageView.count(),
    prisma.pageView.count({ where: { productId: { not: null } } }),
    prisma.pageView.count({ where: { pageTitle: "ADD_TO_CART" } }),
    prisma.order.count()
  ]);
  const topProducts = await prisma.pageView.groupBy({
    by: ["productId"],
    where: { productId: { not: null } },
    _count: { productId: true },
    orderBy: { _count: { productId: "desc" } },
    take: 10
  });
  const productDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true }
      });
      return {
        productId: item.productId,
        productName: product?.name || "Unknown",
        views: item._count.productId
      };
    })
  );
  const abandonedCarts = await prisma.pageView.findMany({
    where: { pageTitle: "ADD_TO_CART" },
    select: { id: true, productId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 20
  });
  return {
    summary: {
      totalVisitors,
      totalPageViews,
      totalProductViews,
      cartAdditions: cartAdds,
      completedOrders: orders,
      abandonedCartEvents: abandonedCarts.length
    },
    topProducts: productDetails,
    abandonedCarts
  };
};
var getProductAnalytics = async () => {
  const viewCounts = await prisma.pageView.groupBy({
    by: ["productId"],
    where: { productId: { not: null } },
    _count: { productId: true }
  });
  const cartCounts = await prisma.pageView.groupBy({
    by: ["productId"],
    where: { productId: { not: null }, pageTitle: "ADD_TO_CART" },
    _count: { productId: true }
  });
  const orderAgg = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, total: true }
  });
  const productIds = viewCounts.map((v) => v.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price: true,
      images: { orderBy: { order: "asc" } }
    }
  });
  const viewMap = new Map(viewCounts.map((v) => [v.productId, v._count.productId]));
  const cartMap = new Map(cartCounts.map((v) => [v.productId, v._count.productId]));
  const orderMap = new Map(
    orderAgg.map((v) => [
      v.productId,
      {
        quantity: Number(v._sum.quantity ?? 0),
        total: Number(v._sum.total ?? 0)
      }
    ])
  );
  return products.map((product) => ({
    productId: product.id,
    name: product.name,
    price: Number(product.price),
    image: product.images?.[0]?.imageUrl || null,
    views: viewMap.get(product.id) ?? 0,
    cartAdditions: cartMap.get(product.id) ?? 0,
    orderedQuantity: orderMap.get(product.id)?.quantity ?? 0,
    revenue: orderMap.get(product.id)?.total ?? 0
  })).sort((a, b) => b.views - a.views);
};
var visitorService = {
  trackPageView,
  trackProductView,
  trackCartActivity,
  getVisitorAnalytics,
  getProductAnalytics
};

// src/modules/visitor/visitor.controller.ts
var trackPageView2 = async (req, res) => {
  try {
    const body = req.body;
    const result = await visitorService.trackPageView({
      ...body,
      pageUrl: body.pageUrl || req.originalUrl || "/",
      pageTitle: body.pageTitle || "Page View"
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var trackProductView2 = async (req, res) => {
  try {
    const body = req.body;
    const result = await visitorService.trackProductView({
      ...body,
      productId: body.productId || ""
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var trackCartActivity2 = async (req, res) => {
  try {
    const body = req.body;
    if (!body.productId) {
      throw new AppError(400, "Product ID is required");
    }
    const result = await visitorService.trackCartActivity({
      ...body,
      productId: body.productId,
      action: body.action || "ADD_TO_CART"
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var getVisitorAnalytics2 = async (req, res) => {
  try {
    const analytics = await visitorService.getVisitorAnalytics();
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var getProductAnalytics2 = async (req, res) => {
  try {
    const analytics = await visitorService.getProductAnalytics();
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var visitorController = {
  trackPageView: trackPageView2,
  trackProductView: trackProductView2,
  trackCartActivity: trackCartActivity2,
  getVisitorAnalytics: getVisitorAnalytics2,
  getProductAnalytics: getProductAnalytics2
};

// src/modules/visitor/visitor.router.ts
var router8 = Router8();
router8.post("/track-page", visitorController.trackPageView);
router8.post("/track-product", visitorController.trackProductView);
router8.post("/track-cart", visitorController.trackCartActivity);
router8.get("/analytics", visitorController.getVisitorAnalytics);
router8.get("/product-analytics", visitorController.getProductAnalytics);
var visitorRouter = router8;

// src/modules/settings/settings.router.ts
import { Router as Router9 } from "express";

// src/modules/settings/settings.service.ts
var getAllSettings = async () => {
  return prisma.setting.findMany({
    orderBy: { key: "asc" }
  });
};
var getSettingByKey = async (key) => {
  return prisma.setting.findUnique({ where: { key } });
};
var setSetting = async (key, value, description) => {
  if (!key || !key.trim()) {
    throw new AppError(400, "Setting key is required");
  }
  const normalizedKey = key.trim();
  const existing = await prisma.setting.findUnique({ where: { key: normalizedKey } });
  if (existing) {
    return prisma.setting.update({
      where: { key: normalizedKey },
      data: {
        value,
        description: description ?? existing.description ?? null
      }
    });
  }
  return prisma.setting.create({
    data: {
      key: normalizedKey,
      value,
      description: description ?? null
    }
  });
};
var deleteSetting = async (key) => {
  const existing = await prisma.setting.findUnique({ where: { key } });
  if (!existing) {
    return false;
  }
  await prisma.setting.delete({ where: { key } });
  return true;
};
var settingsService = {
  getAllSettings,
  getSettingByKey,
  setSetting,
  deleteSetting
};

// src/modules/settings/settings.controller.ts
var getAllSettings2 = async (req, res) => {
  try {
    const settings = await settingsService.getAllSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var getSettingByKey2 = async (req, res) => {
  try {
    const key = typeof req.params.key === "string" ? req.params.key : void 0;
    if (!key) {
      throw new AppError(400, "Setting key is required");
    }
    const setting = await settingsService.getSettingByKey(key);
    if (!setting) {
      throw new AppError(404, "Setting not found");
    }
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var setSetting2 = async (req, res) => {
  try {
    const key = typeof req.params.key === "string" ? req.params.key : void 0;
    const { value, description } = req.body;
    if (!key) {
      throw new AppError(400, "Setting key is required");
    }
    const setting = await settingsService.setSetting(key, value, description);
    res.status(200).json({ success: true, data: setting, message: "Setting updated successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var deleteSetting2 = async (req, res) => {
  try {
    const key = typeof req.params.key === "string" ? req.params.key : void 0;
    if (!key) {
      throw new AppError(400, "Setting key is required");
    }
    const deleted = await settingsService.deleteSetting(key);
    if (!deleted) {
      throw new AppError(404, "Setting not found");
    }
    res.status(200).json({ success: true, message: "Setting deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var settingsController = {
  getAllSettings: getAllSettings2,
  getSettingByKey: getSettingByKey2,
  setSetting: setSetting2,
  deleteSetting: deleteSetting2
};

// src/modules/settings/settings.router.ts
var router9 = Router9();
router9.get("/", settingsController.getAllSettings);
router9.get("/:key", settingsController.getSettingByKey);
router9.post("/:key", auth_default("ADMIN" /* ADMIN */), settingsController.setSetting);
router9.delete("/:key", auth_default("ADMIN" /* ADMIN */), settingsController.deleteSetting);
var settingsRouter = router9;

// src/modules/user/user.router.ts
import { Router as Router10 } from "express";

// src/modules/user/user.service.ts
var updateProfile = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true
    }
  });
};
var updateUser = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      status: true
    }
  });
};
var listUsers = async (params) => {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
  const skip = (page - 1) * limit;
  const search = (params.search || "").trim();
  const where = search ? {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } }
    ]
  } : {};
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        createdAt: true
      }
    })
  ]);
  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};
var userService = {
  updateProfile,
  updateUser,
  listUsers
};

// src/modules/user/user.controller.ts
var listUsers2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError(401, "You are not authorized!");
    }
    const search = typeof req.query.search === "string" ? req.query.search : void 0;
    const page = typeof req.query.page === "string" ? Number(req.query.page) : void 0;
    const limit = typeof req.query.limit === "string" ? Number(req.query.limit) : void 0;
    const result = await userService.listUsers({ search, page, limit });
    res.status(200).json({
      success: true,
      data: result.users,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Something went wrong" });
  }
};
var updateProfile2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError(401, "You are not authorized!");
    }
    const userId = req.user.id;
    const { name, email, phone, image } = req.body;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError(400, "Invalid email address");
    }
    const data = {};
    if (name !== void 0) data.name = name;
    if (email !== void 0) data.email = email;
    if (phone !== void 0) data.phone = phone ? phone : null;
    if (image !== void 0) data.image = image ? image : null;
    const updated = await userService.updateProfile(userId, data);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Profile updated successfully"
    });
  } catch (error) {
    const isConflict = error.code === "P2002";
    res.status(error.statusCode || (isConflict ? 409 : 500)).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var updateUser2 = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError(401, "You are not authorized!");
    }
    const userId = String(req.params.id);
    const { name, email, phone } = req.body;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError(400, "Invalid email address");
    }
    const data = {};
    if (name !== void 0) data.name = name;
    if (email !== void 0) data.email = email;
    if (phone !== void 0) data.phone = phone ? phone : null;
    const updated = await userService.updateUser(userId, data);
    res.status(200).json({
      success: true,
      data: updated,
      message: "User updated successfully"
    });
  } catch (error) {
    const isConflict = error.code === "P2002";
    res.status(error.statusCode || (isConflict ? 409 : 500)).json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
};
var userController = {
  updateProfile: updateProfile2,
  updateUser: updateUser2,
  listUsers: listUsers2
};

// src/modules/user/user.router.ts
var router10 = Router10();
router10.get("/", auth_default("ADMIN" /* ADMIN */), userController.listUsers);
router10.patch("/profile", auth_default(), userController.updateProfile);
router10.patch("/:id", auth_default("ADMIN" /* ADMIN */), userController.updateUser);
var userRouter = router10;

// src/modules/auth/auth.router.ts
import { Router as Router11 } from "express";

// src/modules/auth/auth.service.ts
var GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
var GOOGLE_USER_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
var getGoogleTokens = async (code, redirectUri) => {
  const params = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirect_uri: redirectUri || `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    grant_type: "authorization_code"
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google token exchange failed: ${response.status} ${errorText}`);
  }
  return response.json();
};
var getGoogleUser = async (accessToken) => {
  const response = await fetch(GOOGLE_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Google user: ${response.status} ${errorText}`);
  }
  return response.json();
};
var findOrCreateUser = async (googleUser) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: googleUser.email }
  });
  if (existingUser) {
    return prisma.user.update({
      where: { email: googleUser.email },
      data: {
        name: googleUser.name,
        image: googleUser.picture || existingUser.image
      }
    });
  }
  return prisma.user.create({
    data: {
      email: googleUser.email,
      name: googleUser.name,
      image: googleUser.picture,
      role: "USER",
      status: "ACTIVE"
    }
  });
};
var authService = {
  async googleAuth(data) {
    try {
      const tokens = await getGoogleTokens(data.code, data.redirectUri);
      const googleUser = await getGoogleUser(tokens.access_token);
      const user = await findOrCreateUser({
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        sub: googleUser.id
      });
      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image ?? void 0,
            role: user.role || "USER"
          }
        }
      };
    } catch (error) {
      console.error("Google auth error:", error);
      return {
        success: false,
        error: error?.message || "Google authentication failed"
      };
    }
  },
  async getCurrentUser(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          phone: true,
          status: true
        }
      });
      if (!user) {
        return {
          success: false,
          error: "User not found"
        };
      }
      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image ?? void 0,
            role: user.role || "USER"
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "Failed to get user"
      };
    }
  }
};

// src/modules/auth/auth.controller.ts
var googleAuth = async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code) {
      throw new AppError(400, "Authorization code is required");
    }
    const result = await authService.googleAuth({ code, redirectUri });
    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error || "Google authentication failed"
      });
    }
    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error("Google auth controller error:", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      error: error?.message || "Google authentication failed"
    });
  }
};
var me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, "You are not authorized");
    }
    const result = await authService.getCurrentUser(userId);
    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error || "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      error: error?.message || "Failed to get current user"
    });
  }
};
var authController = {
  googleAuth,
  me
};

// src/modules/auth/auth.router.ts
var router11 = Router11();
router11.post("/google", authController.googleAuth);
router11.get("/me", auth_default(), authController.me);
var authRouter = router11;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
var app = express2();
var allowedOrigins = [
  ...(process.env.CLIENT_URL || "https://amrbasket.vercel.app,http://localhost:3000,http://localhost:5000").split(",").map((value) => value.trim()),
  "https://amrbasket.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000"
].filter((value) => typeof value === "string" && value !== "");
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "X-Guest-Id"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/reviews", reviewRouter);
app.use("/cart", cartRouter);
app.use("/help-request", helpRouter);
app.use("/orders", orderRouter);
app.use("/invoices", invoiceRouter);
app.use("/visitors", visitorRouter);
app.use("/settings", settingsRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
    routes: {
      auth: "/api/auth",
      products: "/product",
      categories: "/category",
      reviews: "/reviews",
      cart: "/cart",
      helpRequest: "/help-request",
      orders: "/orders",
      invoices: "/invoices",
      visitors: "/visitors",
      settings: "/settings",
      user: "/user",
      customAuth: "/auth"
    }
  });
});
app.post("/notify-test", (req, res) => {
  const body = req.body || {};
  emitAdminNotification({
    id: String(Date.now()),
    title: body.title || "Test Notification",
    message: body.message || "This is a real-time admin toast!",
    type: body.type || "success"
  });
  res.json({ ok: true });
});
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error"
  });
});
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 3e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected");
    const server = app_default.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    initSocket(server);
    console.log("Socket.io attached");
    startNotificationOutboxWorker();
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.js.map
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
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// Product model\n\nmodel Product {\n  id              String         @id @default(cuid())\n  sku             String?        @unique\n  name            String\n  description     String?\n  price           Decimal        @db.Decimal(10, 2)\n  buyingPrice     Decimal?       @db.Decimal(10, 2)\n  discount        Decimal?       @db.Decimal(5, 2)\n  discountPrice   Decimal?       @db.Decimal(10, 2)\n  inStock         Boolean        @default(true)\n  stockQuantity   Int            @default(0)\n  categoryId      String?\n  category        Category?      @relation(fields: [categoryId], references: [id], onDelete: SetNull)\n  images          ProductImage[]\n  seo             ProductSEO?\n  reviews         Review[]\n  orderItems      OrderItem[]\n  cartItems       CartItem[]\n  wishlistItems   WishlistItem[]\n  pageViews       PageView[] // Added this relation\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @updatedAt\n  metaTitle       String?\n  metaDescription String?\n  metaKeywords    String?\n\n  @@map("products")\n}\n\n// Product Images\n\nmodel ProductImage {\n  id        String   @id @default(cuid())\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  imageUrl  String\n  altText   String?\n  isPrimary Boolean  @default(false)\n  order     Int      @default(0)\n  createdAt DateTime @default(now())\n\n  @@map("product_images")\n}\n\n// Product SEO\n\nmodel ProductSEO {\n  id              String   @id @default(cuid())\n  productId       String   @unique\n  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  metaTitle       String?\n  metaDescription String?\n  metaKeywords    String?\n  slug            String?  @unique\n  updatedAt       DateTime @updatedAt\n\n  @@map("product_seo")\n}\n\n// Category model\n\nmodel Category {\n  id              String     @id @default(cuid())\n  name            String\n  description     String?\n  slug            String?    @unique\n  image           String?\n  parentId        String?\n  parent          Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])\n  children        Category[] @relation("CategoryHierarchy")\n  products        Product[]\n  pageViews       PageView[] // Added this relation\n  createdAt       DateTime   @default(now())\n  updatedAt       DateTime   @updatedAt\n  metaTitle       String?\n  metaDescription String?\n  metaKeywords    String?\n\n  @@map("categories")\n}\n\n// Order model\n\nmodel Order {\n  id              String        @id @default(cuid())\n  userId          String\n  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  orderNumber     String        @unique\n  status          OrderStatus   @default(PENDING)\n  totalAmount     Decimal       @db.Decimal(10, 2)\n  subtotal        Decimal       @db.Decimal(10, 2)\n  tax             Decimal?      @db.Decimal(10, 2)\n  shippingCost    Decimal?      @db.Decimal(10, 2)\n  discountTotal   Decimal?      @db.Decimal(10, 2)\n  isDelivered     Boolean       @default(false)\n  deliveredAt     DateTime?\n  shippingAddress Json\n  billingAddress  Json?\n  paymentMethod   String?\n  paymentStatus   PaymentStatus @default(PENDING)\n  notes           String?\n  invoiceNumber   String?       @unique\n  items           OrderItem[]\n  invoice         Invoice? // Added this relation\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n\n  @@map("orders")\n}\n\nenum OrderStatus {\n  PENDING\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n}\n\n// Order Items\n\nmodel OrderItem {\n  id        String   @id @default(cuid())\n  orderId   String\n  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)\n  quantity  Int\n  price     Decimal  @db.Decimal(10, 2)\n  discount  Decimal? @db.Decimal(5, 2)\n  total     Decimal  @db.Decimal(10, 2)\n  createdAt DateTime @default(now())\n\n  @@map("order_items")\n}\n\n// Cart\n\nmodel CartItem {\n  id        String   @id @default(cuid())\n  userId    String\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  quantity  Int      @default(1)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, productId])\n  @@map("cart_items")\n}\n\n// Wishlist\n\nmodel WishlistItem {\n  id        String   @id @default(cuid())\n  userId    String\n  productId String\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n\n  @@unique([userId, productId])\n  @@map("wishlist_items")\n}\n\n// Review and Rating\n\nmodel Review {\n  id        String        @id @default(cuid())\n  userId    String\n  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  productId String\n  product   Product       @relation(fields: [productId], references: [id], onDelete: Cascade)\n  rating    Int\n  title     String?\n  comment   String?\n  status    ReviewStatus  @default(PENDING)\n  reply     String?\n  images    ReviewImage[]\n  likes     ReviewLike[]\n  helpful   Int           @default(0)\n  createdAt DateTime      @default(now())\n  updatedAt DateTime      @updatedAt\n\n  @@unique([userId, productId])\n  @@map("reviews")\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  HIDDEN\n  REJECTED\n}\n\n// Review Images\n\nmodel ReviewImage {\n  id        String   @id @default(cuid())\n  reviewId  String\n  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n  imageUrl  String\n  createdAt DateTime @default(now())\n\n  @@map("review_images")\n}\n\n// Review Likes\n\nmodel ReviewLike {\n  id        String   @id @default(cuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  reviewId  String\n  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n\n  @@unique([userId, reviewId])\n  @@map("review_likes")\n}\n\n// Help and Support\n\nmodel HelpRequest {\n  id          String     @id @default(cuid())\n  userId      String?\n  subject     String\n  message     String\n  phoneNumber String?\n  status      HelpStatus @default(OPEN)\n  assignedTo  String?\n  resolvedAt  DateTime?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  @@map("help_requests")\n}\n\nenum HelpStatus {\n  OPEN\n  IN_PROGRESS\n  RESOLVED\n  CLOSED\n}\n\n// Visitor Tracking\n\nmodel Visitor {\n  id         String     @id @default(cuid())\n  sessionId  String\n  ipAddress  String?\n  userAgent  String?\n  referrer   String?\n  visitedAt  DateTime   @default(now())\n  userId     String?\n  deviceType String?\n  browser    String?\n  os         String?\n  pageViews  PageView[]\n\n  @@index([sessionId])\n  @@map("visitors")\n}\n\n// Page Views\n\nmodel PageView {\n  id         String    @id @default(cuid())\n  visitorId  String\n  visitor    Visitor   @relation(fields: [visitorId], references: [id], onDelete: Cascade)\n  pageUrl    String\n  pageTitle  String?\n  productId  String?\n  product    Product?  @relation(fields: [productId], references: [id], onDelete: SetNull)\n  categoryId String?\n  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)\n  referrer   String?\n  timeSpent  Int?\n  createdAt  DateTime  @default(now())\n\n  @@index([visitorId, createdAt])\n  @@map("page_views")\n}\n\n// Settings\n\nmodel Setting {\n  id          String   @id @default(cuid())\n  key         String   @unique\n  value       Json\n  description String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  @@map("settings")\n}\n\n// Invoice\n\nmodel Invoice {\n  id            String    @id @default(cuid())\n  orderId       String    @unique\n  order         Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  invoiceNumber String    @unique\n  pdfUrl        String?\n  sentAt        DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  @@map("invoices")\n}\n\nenum UserRole {\n  USER\n  ADMIN\n}\n\nmodel User {\n  id            String       @id\n  name          String\n  email         String\n  emailVerified Boolean      @default(false)\n  image         String?\n  createdAt     DateTime     @default(now())\n  updatedAt     DateTime     @updatedAt\n  role          String?      @default("USER")\n  phone         String?\n  status        String?      @default("ACTIVE")\n  sessions      Session[]\n  accounts      Account[]\n  reviews       Review[]\n  reviewLikes   ReviewLike[]\n  orders        Order[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  issuer                String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sku","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"buyingPrice","kind":"scalar","type":"Decimal"},{"name":"discount","kind":"scalar","type":"Decimal"},{"name":"discountPrice","kind":"scalar","type":"Decimal"},{"name":"inStock","kind":"scalar","type":"Boolean"},{"name":"stockQuantity","kind":"scalar","type":"Int"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"images","kind":"object","type":"ProductImage","relationName":"ProductToProductImage"},{"name":"seo","kind":"object","type":"ProductSEO","relationName":"ProductToProductSEO"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProductToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToProduct"},{"name":"wishlistItems","kind":"object","type":"WishlistItem","relationName":"ProductToWishlistItem"},{"name":"pageViews","kind":"object","type":"PageView","relationName":"PageViewToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"}],"dbName":"products"},"ProductImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductImage"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"altText","kind":"scalar","type":"String"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"product_images"},"ProductSEO":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToProductSEO"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"product_seo"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"children","kind":"object","type":"Category","relationName":"CategoryHierarchy"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"pageViews","kind":"object","type":"PageView","relationName":"CategoryToPageView"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"metaTitle","kind":"scalar","type":"String"},{"name":"metaDescription","kind":"scalar","type":"String"},{"name":"metaKeywords","kind":"scalar","type":"String"}],"dbName":"categories"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"tax","kind":"scalar","type":"Decimal"},{"name":"shippingCost","kind":"scalar","type":"Decimal"},{"name":"discountTotal","kind":"scalar","type":"Decimal"},{"name":"isDelivered","kind":"scalar","type":"Boolean"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"shippingAddress","kind":"scalar","type":"Json"},{"name":"billingAddress","kind":"scalar","type":"Json"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"invoiceNumber","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"invoice","kind":"object","type":"Invoice","relationName":"InvoiceToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"discount","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"order_items"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"CartItemToProduct"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"cart_items"},"WishlistItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToWishlistItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"wishlist_items"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"reply","kind":"scalar","type":"String"},{"name":"images","kind":"object","type":"ReviewImage","relationName":"ReviewToReviewImage"},{"name":"likes","kind":"object","type":"ReviewLike","relationName":"ReviewToReviewLike"},{"name":"helpful","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"ReviewImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToReviewImage"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"review_images"},"ReviewLike":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewLikeToUser"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToReviewLike"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"review_likes"},"HelpRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"HelpStatus"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"resolvedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"help_requests"},"Visitor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"visitedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"deviceType","kind":"scalar","type":"String"},{"name":"browser","kind":"scalar","type":"String"},{"name":"os","kind":"scalar","type":"String"},{"name":"pageViews","kind":"object","type":"PageView","relationName":"PageViewToVisitor"}],"dbName":"visitors"},"PageView":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"visitorId","kind":"scalar","type":"String"},{"name":"visitor","kind":"object","type":"Visitor","relationName":"PageViewToVisitor"},{"name":"pageUrl","kind":"scalar","type":"String"},{"name":"pageTitle","kind":"scalar","type":"String"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"PageViewToProduct"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToPageView"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"timeSpent","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"page_views"},"Setting":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"Json"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"settings"},"Invoice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"InvoiceToOrder"},{"name":"invoiceNumber","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"sentAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"invoices"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"reviewLikes","kind":"object","type":"ReviewLike","relationName":"ReviewLikeToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"issuer","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","parent","orderBy","cursor","children","products","pageViews","_count","visitor","product","category","images","seo","user","sessions","accounts","reviews","review","reviewLikes","order","items","invoice","orders","likes","orderItems","cartItems","wishlistItems","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","data","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","create","update","Product.upsertOne","Product.deleteOne","Product.deleteMany","having","_avg","_sum","_min","_max","Product.groupBy","Product.aggregate","ProductImage.findUnique","ProductImage.findUniqueOrThrow","ProductImage.findFirst","ProductImage.findFirstOrThrow","ProductImage.findMany","ProductImage.createOne","ProductImage.createMany","ProductImage.createManyAndReturn","ProductImage.updateOne","ProductImage.updateMany","ProductImage.updateManyAndReturn","ProductImage.upsertOne","ProductImage.deleteOne","ProductImage.deleteMany","ProductImage.groupBy","ProductImage.aggregate","ProductSEO.findUnique","ProductSEO.findUniqueOrThrow","ProductSEO.findFirst","ProductSEO.findFirstOrThrow","ProductSEO.findMany","ProductSEO.createOne","ProductSEO.createMany","ProductSEO.createManyAndReturn","ProductSEO.updateOne","ProductSEO.updateMany","ProductSEO.updateManyAndReturn","ProductSEO.upsertOne","ProductSEO.deleteOne","ProductSEO.deleteMany","ProductSEO.groupBy","ProductSEO.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","WishlistItem.findUnique","WishlistItem.findUniqueOrThrow","WishlistItem.findFirst","WishlistItem.findFirstOrThrow","WishlistItem.findMany","WishlistItem.createOne","WishlistItem.createMany","WishlistItem.createManyAndReturn","WishlistItem.updateOne","WishlistItem.updateMany","WishlistItem.updateManyAndReturn","WishlistItem.upsertOne","WishlistItem.deleteOne","WishlistItem.deleteMany","WishlistItem.groupBy","WishlistItem.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","ReviewImage.findUnique","ReviewImage.findUniqueOrThrow","ReviewImage.findFirst","ReviewImage.findFirstOrThrow","ReviewImage.findMany","ReviewImage.createOne","ReviewImage.createMany","ReviewImage.createManyAndReturn","ReviewImage.updateOne","ReviewImage.updateMany","ReviewImage.updateManyAndReturn","ReviewImage.upsertOne","ReviewImage.deleteOne","ReviewImage.deleteMany","ReviewImage.groupBy","ReviewImage.aggregate","ReviewLike.findUnique","ReviewLike.findUniqueOrThrow","ReviewLike.findFirst","ReviewLike.findFirstOrThrow","ReviewLike.findMany","ReviewLike.createOne","ReviewLike.createMany","ReviewLike.createManyAndReturn","ReviewLike.updateOne","ReviewLike.updateMany","ReviewLike.updateManyAndReturn","ReviewLike.upsertOne","ReviewLike.deleteOne","ReviewLike.deleteMany","ReviewLike.groupBy","ReviewLike.aggregate","HelpRequest.findUnique","HelpRequest.findUniqueOrThrow","HelpRequest.findFirst","HelpRequest.findFirstOrThrow","HelpRequest.findMany","HelpRequest.createOne","HelpRequest.createMany","HelpRequest.createManyAndReturn","HelpRequest.updateOne","HelpRequest.updateMany","HelpRequest.updateManyAndReturn","HelpRequest.upsertOne","HelpRequest.deleteOne","HelpRequest.deleteMany","HelpRequest.groupBy","HelpRequest.aggregate","Visitor.findUnique","Visitor.findUniqueOrThrow","Visitor.findFirst","Visitor.findFirstOrThrow","Visitor.findMany","Visitor.createOne","Visitor.createMany","Visitor.createManyAndReturn","Visitor.updateOne","Visitor.updateMany","Visitor.updateManyAndReturn","Visitor.upsertOne","Visitor.deleteOne","Visitor.deleteMany","Visitor.groupBy","Visitor.aggregate","PageView.findUnique","PageView.findUniqueOrThrow","PageView.findFirst","PageView.findFirstOrThrow","PageView.findMany","PageView.createOne","PageView.createMany","PageView.createManyAndReturn","PageView.updateOne","PageView.updateMany","PageView.updateManyAndReturn","PageView.upsertOne","PageView.deleteOne","PageView.deleteMany","PageView.groupBy","PageView.aggregate","Setting.findUnique","Setting.findUniqueOrThrow","Setting.findFirst","Setting.findFirstOrThrow","Setting.findMany","Setting.createOne","Setting.createMany","Setting.createManyAndReturn","Setting.updateOne","Setting.updateMany","Setting.updateManyAndReturn","Setting.upsertOne","Setting.deleteOne","Setting.deleteMany","Setting.groupBy","Setting.aggregate","Invoice.findUnique","Invoice.findUniqueOrThrow","Invoice.findFirst","Invoice.findFirstOrThrow","Invoice.findMany","Invoice.createOne","Invoice.createMany","Invoice.createManyAndReturn","Invoice.updateOne","Invoice.updateMany","Invoice.updateManyAndReturn","Invoice.upsertOne","Invoice.deleteOne","Invoice.deleteMany","Invoice.groupBy","Invoice.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","AND","OR","NOT","id","identifier","value","expiresAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","issuer","token","ipAddress","userAgent","name","email","emailVerified","image","role","phone","status","every","some","none","orderId","invoiceNumber","pdfUrl","sentAt","key","description","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","visitorId","pageUrl","pageTitle","productId","categoryId","referrer","timeSpent","sessionId","visitedAt","deviceType","browser","os","subject","message","phoneNumber","HelpStatus","assignedTo","resolvedAt","reviewId","imageUrl","rating","title","comment","ReviewStatus","reply","helpful","quantity","price","discount","total","orderNumber","OrderStatus","totalAmount","subtotal","tax","shippingCost","discountTotal","isDelivered","deliveredAt","shippingAddress","billingAddress","paymentMethod","PaymentStatus","paymentStatus","notes","slug","parentId","metaTitle","metaDescription","metaKeywords","altText","isPrimary","sku","buyingPrice","discountPrice","inStock","stockQuantity","userId_productId","userId_reviewId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "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-AIBALAEACH5AgEAsAQAIfoCAQDBBAAh-wIBAMEEACH8AgEAwQQAIf0CQADJBAAh_gJAAMkEACH_AgEAwQQAIYADAQDBBAAhgQMBAMEEACEJDQAAqQgAIPoCAACqBQAg-wIAAKoFACD8AgAAqgUAIP0CAACqBQAg_gIAAKoFACD_AgAAqgUAIIADAACqBQAggQMAAKoFACASDQAAjAUAIOMCAACRBQAw5AIAACUAEOUCAACRBQAw5gIBAAAAAeoCQACxBAAh6wJAALEEACH3AgEAsAQAIfgCAQCwBAAh-QIBALAEACH6AgEAwQQAIfsCAQDBBAAh_AIBAMEEACH9AkAAyQQAIf4CQADJBAAh_wIBAMEEACGAAwEAwQQAIYEDAQDBBAAhAwAAACUAIAIAACYAMAMAACcAIAMAAAAdACACAAAeADADAAAfACAJDQAAjAUAIBEAAIQFACDjAgAAkAUAMOQCAAAqABDlAgAAkAUAMOYCAQCwBAAh6gJAALEEACH5AgEAsAQAIa0DAQCwBAAhAg0AAKkIACARAACoCAAgCg0AAIwFACARAACEBQAg4wIAAJAFADDkAgAAKgAQ5QIAAJAFADDmAgEAAAAB6gJAALEEACH5AgEAsAQAIa0DAQCwBAAh1QMAAI8FACADAAAAKgAgAgAAKwAwAwAALAAgGQ0AAIwFACAUAACNBQAgFQAAjgUAIOMCAACIBQAw5AIAAC4AEOUCAACIBQAw5gIBALAEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGLAwAAiQW7AyKQAwEAwQQAIbkDAQCwBAAhuwMQAIYFACG8AxAAhgUAIb0DEACHBQAhvgMQAIcFACG_AxAAhwUAIcADIADABAAhwQNAAMkEACHCAwAAzwQAIMMDAACKBQAgxAMBAMEEACHGAwAAiwXGAyLHAwEAwQQAIQsNAACpCAAgFAAAqggAIBUAAKsIACCQAwAAqgUAIL0DAACqBQAgvgMAAKoFACC_AwAAqgUAIMEDAACqBQAgwwMAAKoFACDEAwAAqgUAIMcDAACqBQAgGQ0AAIwFACAUAACNBQAgFQAAjgUAIOMCAACIBQAw5AIAAC4AEOUCAACIBQAw5gIBAAAAAeoCQACxBAAh6wJAALEEACH5AgEAsAQAIYsDAACJBbsDIpADAQAAAAG5AwEAAAABuwMQAIYFACG8AxAAhgUAIb0DEACHBQAhvgMQAIcFACG_AxAAhwUAIcADIADABAAhwQNAAMkEACHCAwAAzwQAIMMDAACKBQAgxAMBAMEEACHGAwAAiwXGAyLHAwEAwQQAIQMAAAAuACACAAAvADADAAAwACANCQAA-wQAIBMAAMoEACDjAgAAhQUAMOQCAAAyABDlAgAAhQUAMOYCAQCwBAAh6gJAALEEACGPAwEAsAQAIZ4DAQCwBAAhtQMCAIIFACG2AxAAhgUAIbcDEACHBQAhuAMQAIYFACEDCQAAmQgAIBMAAMcGACC3AwAAqgUAIA0JAAD7BAAgEwAAygQAIOMCAACFBQAw5AIAADIAEOUCAACFBQAw5gIBAAAAAeoCQACxBAAhjwMBALAEACGeAwEAsAQAIbUDAgCCBQAhtgMQAIYFACG3AxAAhwUAIbgDEACGBQAhAwAAADIAIAIAADMAMAMAADQAIAsTAADKBAAg4wIAAMgEADDkAgAANgAQ5QIAAMgEADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACGPAwEAsAQAIZADAQCwBAAhkQMBAMEEACGSA0AAyQQAIQEAAAA2ACABAAAAMgAgAQAAACEAIAEAAAAlACABAAAAHQAgAQAAACoAIAEAAAAuACAIEQAAhAUAIOMCAACDBQAw5AIAAD4AEOUCAACDBQAw5gIBALAEACHqAkAAsQQAIa0DAQCwBAAhrgMBALAEACEBEQAAqAgAIAgRAACEBQAg4wIAAIMFADDkAgAAPgAQ5QIAAIMFADDmAgEAAAAB6gJAALEEACGtAwEAsAQAIa4DAQCwBAAhAwAAAD4AIAIAAD8AMAMAAEAAIAMAAAAqACACAAArADADAAAsACABAAAAPgAgAQAAACoAIAMAAAAyACACAAAzADADAAA0ACAKCQAA-wQAIOMCAACBBQAw5AIAAEYAEOUCAACBBQAw5gIBALAEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGeAwEAsAQAIbUDAgCCBQAhAQkAAJkIACALCQAA-wQAIOMCAACBBQAw5AIAAEYAEOUCAACBBQAw5gIBAAAAAeoCQACxBAAh6wJAALEEACH5AgEAsAQAIZ4DAQCwBAAhtQMCAIIFACHUAwAAgAUAIAMAAABGACACAABHADADAABIACAICQAA-wQAIOMCAAD_BAAw5AIAAEoAEOUCAAD_BAAw5gIBALAEACHqAkAAsQQAIfkCAQCwBAAhngMBALAEACEBCQAAmQgAIAkJAAD7BAAg4wIAAP8EADDkAgAASgAQ5QIAAP8EADDmAgEAAAAB6gJAALEEACH5AgEAsAQAIZ4DAQCwBAAh1AMAAP4EACADAAAASgAgAgAASwAwAwAATAAgAwAAAAwAIAIAAA0AMAMAAA4AIAEAAAAXACABAAAAHQAgAQAAADIAIAEAAABGACABAAAASgAgAQAAAAwAIAEAAAABACADAAAACQAgAgAACgAwAwAAAQAgAwAAAAkAIAIAAAoAMAMAAAEAIAMAAAAJACACAAAKADADAAABACAYBgAAgwgAIAoAAKcIACALAAD9BwAgDAAA_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_AxAAAAABwAMgAAAAAcEDQAAAAAHCA4AAAAABwwOAAAAAAcQDAQAAAAHGAwAAAMYDAscDAQAAAAEBIAAAtwEAIBPmAgEAAAAB6gJAAAAAAesCQAAAAAH5AgEAAAABiwMAAAC7AwKQAwEAAAABuQMBAAAAAbsDEAAAAAG8AxAAAAABvQMQAAAAAb4DEAAAAAG_AxAAAAABwAMgAAAAAcEDQAAAAAHCA4AAAAABwwOAAAAAAcQDAQAAAAHGAwAAAMYDAscDAQAAAAEBIAAAuQEAMAEgAAC5AQAwFg0AAJQHACAUAADPBQAgFQAA0AUAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIfkCAQCoBQAhiwMAAMoFuwMikAMBAK4FACG5AwEAqAUAIbsDEADLBQAhvAMQAMsFACG9AxAAzAUAIb4DEADMBQAhvwMQAMwFACHAAyAAugUAIcEDQACvBQAhwgOAAAAAAcMDgAAAAAHEAwEArgUAIcYDAADNBcYDIscDAQCuBQAhAgAAADAAICAAALwBACAT5gIBAKgFACHqAkAAqQUAIesCQACpBQAh-QIBAKgFACGLAwAAygW7AyKQAwEArgUAIbkDAQCoBQAhuwMQAMsFACG8AxAAywUAIb0DEADMBQAhvgMQAMwFACG_AxAAzAUAIcADIAC6BQAhwQNAAK8FACHCA4AAAAABwwOAAAAAAcQDAQCuBQAhxgMAAM0FxgMixwMBAK4FACECAAAALgAgIAAAvgEAIAIAAAAuACAgAAC-AQAgAwAAADAAICcAALcBACAoAAC8AQAgAQAAADAAIAEAAAAuACANBwAAjwcAIC0AAJAHACAuAACTBwAgLwAAkgcAIDAAAJEHACCQAwAAqgUAIL0DAACqBQAgvgMAAKoFACC_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-QIBAAAAAZ4DAQAAAAEBIAAA-wEAMAEgAAD7AQAwBQkAAP8GACDmAgEAqAUAIeoCQACpBQAh-QIBAKgFACGeAwEAqAUAIQIAAABMACAgAAD-AQAgBOYCAQCoBQAh6gJAAKkFACH5AgEAqAUAIZ4DAQCoBQAhAgAAAEoAICAAAIACACACAAAASgAgIAAAgAIAIAMAAABMACAnAAD5AQAgKAAA_gEAIAEAAABMACABAAAASgAgAwcAAPwGACAvAAD-BgAgMAAA_QYAIAfjAgAA5gQAMOQCAACHAgAQ5QIAAOYEADDmAgEAqAQAIeoCQACpBAAh-QIBAKgEACGeAwEAqAQAIQMAAABKACACAACGAgAwLAAAhwIAIAMAAABKACACAABLADADAABMACABAAAAHwAgAQAAAB8AIAMAAAAdACACAAAeADADAAAfACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAB0AIAIAAB4AMAMAAB8AIA8JAACdBgAgCwAAngYAIA0AAPsGACAXAACfBgAg5gIBAAAAAeoCQAAAAAHrAkAAAAAB-QIBAAAAAYsDAAAAswMCngMBAAAAAa8DAgAAAAGwAwEAAAABsQMBAAAAAbMDAQAAAAG0AwIAAAABASAAAI8CACAL5gIBAAAAAeoCQAAAAAHrAkAAAAAB-QIBAAAAAYsDAAAAswMCngMBAAAAAa8DAgAAAAGwAwEAAAABsQMBAAAAAbMDAQAAAAG0AwIAAAABASAAAJECADABIAAAkQIAMA8JAACCBgAgCwAAgwYAIA0AAPoGACAXAACEBgAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAh-QIBAKgFACGLAwAAgAazAyKeAwEAqAUAIa8DAgDgBQAhsAMBAK4FACGxAwEArgUAIbMDAQCuBQAhtAMCAOAFACECAAAAHwAgIAAAlAIAIAvmAgEAqAUAIeoCQACpBQAh6wJAAKkFACH5AgEAqAUAIYsDAACABrMDIp4DAQCoBQAhrwMCAOAFACGwAwEArgUAIbEDAQCuBQAhswMBAK4FACG0AwIA4AUAIQIAAAAdACAgAACWAgAgAgAAAB0AICAAAJYCACADAAAAHwAgJwAAjwIAICgAAJQCACABAAAAHwAgAQAAAB0AIAgHAAD1BgAgLQAA9gYAIC4AAPkGACAvAAD4BgAgMAAA9wYAILADAACqBQAgsQMAAKoFACCzAwAAqgUAIA7jAgAA3wQAMOQCAACdAgAQ5QIAAN8EADDmAgEAqAQAIeoCQACpBAAh6wJAAKkEACH5AgEAqAQAIYsDAADhBLMDIp4DAQCoBAAhrwMCAOAEACGwAwEAswQAIbEDAQCzBAAhswMBALMEACG0AwIA4AQAIQMAAAAdACACAACcAgAwLAAAnQIAIAMAAAAdACACAAAeADADAAAfACABAAAAQAAgAQAAAEAAIAMAAAA-ACACAAA_ADADAABAACADAAAAPgAgAgAAPwAwAwAAQAAgAwAAAD4AIAIAAD8AMAMAAEAAIAURAAD0BgAg5gIBAAAAAeoCQAAAAAGtAwEAAAABrgMBAAAAAQEgAAClAgAgBOYCAQAAAAHqAkAAAAABrQMBAAAAAa4DAQAAAAEBIAAApwIAMAEgAACnAgAwBREAAPMGACDmAgEAqAUAIeoCQACpBQAhrQMBAKgFACGuAwEAqAUAIQIAAABAACAgAACqAgAgBOYCAQCoBQAh6gJAAKkFACGtAwEAqAUAIa4DAQCoBQAhAgAAAD4AICAAAKwCACACAAAAPgAgIAAArAIAIAMAAABAACAnAAClAgAgKAAAqgIAIAEAAABAACABAAAAPgAgAwcAAPAGACAvAADyBgAgMAAA8QYAIAfjAgAA3gQAMOQCAACzAgAQ5QIAAN4EADDmAgEAqAQAIeoCQACpBAAhrQMBAKgEACGuAwEAqAQAIQMAAAA-ACACAACyAgAwLAAAswIAIAMAAAA-ACACAAA_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_AwAgAwAAALEDACAnAAC4AwAgKAAAvQMAIAEAAACxAwAgAQAAADYAIAUHAADCBgAgLwAAxAYAIDAAAMMGACCRAwAAqgUAIJIDAACqBQAgCuMCAADHBAAw5AIAAMYDABDlAgAAxwQAMOYCAQCoBAAh6gJAAKkEACHrAkAAqQQAIY8DAQCoBAAhkAMBAKgEACGRAwEAswQAIZIDQAC0BAAhAwAAADYAIAIAAMUDADAsAADGAwAgAwAAADYAIAIAALQDADADAACxAwAgEg4AAMIEACAPAADDBAAgEAAAxAQAIBIAAMUEACAWAADGBAAg4wIAAL8EADDkAgAAzAMAEOUCAAC_BAAw5gIBAAAAAeoCQACxBAAh6wJAALEEACGFAwEAsAQAIYYDAQAAAAGHAyAAwAQAIYgDAQDBBAAhiQMBAMEEACGKAwEAwQQAIYsDAQDBBAAhAQAAAMkDACABAAAAyQMAIBIOAADCBAAgDwAAwwQAIBAAAMQEACASAADFBAAgFgAAxgQAIOMCAAC_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-gIBAAAAAfsCAQAAAAH8AgEAAAAB_QJAAAAAAf4CQAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAEBIAAA_QMAIA7mAgEAAAAB6gJAAAAAAesCQAAAAAH3AgEAAAAB-AIBAAAAAfkCAQAAAAH6AgEAAAAB-wIBAAAAAfwCAQAAAAH9AkAAAAAB_gJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAQEgAAD_AwAwASAAAP8DADAPDQAAsAUAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIfcCAQCoBQAh-AIBAKgFACH5AgEAqAUAIfoCAQCuBQAh-wIBAK4FACH8AgEArgUAIf0CQACvBQAh_gJAAK8FACH_AgEArgUAIYADAQCuBQAhgQMBAK4FACECAAAAJwAgIAAAggQAIA7mAgEAqAUAIeoCQACpBQAh6wJAAKkFACH3AgEAqAUAIfgCAQCoBQAh-QIBAKgFACH6AgEArgUAIfsCAQCuBQAh_AIBAK4FACH9AkAArwUAIf4CQACvBQAh_wIBAK4FACGAAwEArgUAIYEDAQCuBQAhAgAAACUAICAAAIQEACACAAAAJQAgIAAAhAQAIAMAAAAnACAnAAD9AwAgKAAAggQAIAEAAAAnACABAAAAJQAgCwcAAKsFACAvAACtBQAgMAAArAUAIPoCAACqBQAg-wIAAKoFACD8AgAAqgUAIP0CAACqBQAg_gIAAKoFACD_AgAAqgUAIIADAACqBQAggQMAAKoFACAR4wIAALIEADDkAgAAiwQAEOUCAACyBAAw5gIBAKgEACHqAkAAqQQAIesCQACpBAAh9wIBAKgEACH4AgEAqAQAIfkCAQCoBAAh-gIBALMEACH7AgEAswQAIfwCAQCzBAAh_QJAALQEACH-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-gIBALMEACH7AgEAswQAIfwCAQCzBAAh_QJAALQEACH-AkAAtAQAIf8CAQCzBAAhgAMBALMEACGBAwEAswQAIQ4HAAC2BAAgLwAAuQQAIDAAALkEACDsAgEAAAAB7QIBAAAABe4CAQAAAAXvAgEAAAAB8AIBAAAAAfECAQAAAAHyAgEAAAAB8wIBALgEACH0AgEAAAAB9QIBAAAAAfYCAQAAAAELBwAAtgQAIC8AALcEACAwAAC3BAAg7AJAAAAAAe0CQAAAAAXuAkAAAAAF7wJAAAAAAfACQAAAAAHxAkAAAAAB8gJAAAAAAfMCQAC1BAAhCwcAALYEACAvAAC3BAAgMAAAtwQAIOwCQAAAAAHtAkAAAAAF7gJAAAAABe8CQAAAAAHwAkAAAAAB8QJAAAAAAfICQAAAAAHzAkAAtQQAIQjsAgIAAAAB7QICAAAABe4CAgAAAAXvAgIAAAAB8AICAAAAAfECAgAAAAHyAgIAAAAB8wICALYEACEI7AJAAAAAAe0CQAAAAAXuAkAAAAAF7wJAAAAAAfACQAAAAAHxAkAAAAAB8gJAAAAAAfMCQAC3BAAhDgcAALYEACAvAAC5BAAgMAAAuQQAIOwCAQAAAAHtAgEAAAAF7gIBAAAABe8CAQAAAAHwAgEAAAAB8QIBAAAAAfICAQAAAAHzAgEAuAQAIfQCAQAAAAH1AgEAAAAB9gIBAAAAAQvsAgEAAAAB7QIBAAAABe4CAQAAAAXvAgEAAAAB8AIBAAAAAfECAQAAAAHyAgEAAAAB8wIBALkEACH0AgEAAAAB9QIBAAAAAfYCAQAAAAEL4wIAALoEADDkAgAA9QMAEOUCAAC6BAAw5gIBAKgEACHpAkAAqQQAIeoCQACpBAAh6wJAAKkEACH5AgEAqAQAIYIDAQCoBAAhgwMBALMEACGEAwEAswQAIQ3jAgAAuwQAMOQCAADfAwAQ5QIAALsEADDmAgEAqAQAIeoCQACpBAAh6wJAAKkEACGFAwEAqAQAIYYDAQCoBAAhhwMgALwEACGIAwEAswQAIYkDAQCzBAAhigMBALMEACGLAwEAswQAIQUHAACrBAAgLwAAvgQAIDAAAL4EACDsAiAAAAAB8wIgAL0EACEFBwAAqwQAIC8AAL4EACAwAAC-BAAg7AIgAAAAAfMCIAC9BAAhAuwCIAAAAAHzAiAAvgQAIRIOAADCBAAgDwAAwwQAIBAAAMQEACASAADFBAAgFgAAxgQAIOMCAAC_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_AxAA6gQAIcADIAC8BAAhwQNAALQEACHCAwAAzAQAIMMDAADxBAAgxAMBALMEACHGAwAA8gTGAyLHAwEAswQAIQcHAACrBAAgLwAA9wQAIDAAAPcEACDsAgAAALsDAu0CAAAAuwMI7gIAAAC7AwjzAgAA9gS7AyIPBwAAtgQAIC8AAPUEACAwAAD1BAAg7AKAAAAAAe8CgAAAAAHwAoAAAAAB8QKAAAAAAfICgAAAAAHzAoAAAAABlQMBAAAAAZYDAQAAAAGXAwEAAAABmAOAAAAAAZkDgAAAAAGaA4AAAAABBwcAAKsEACAvAAD0BAAgMAAA9AQAIOwCAAAAxgMC7QIAAADGAwjuAgAAAMYDCPMCAADzBMYDIgcHAACrBAAgLwAA9AQAIDAAAPQEACDsAgAAAMYDAu0CAAAAxgMI7gIAAADGAwjzAgAA8wTGAyIE7AIAAADGAwLtAgAAAMYDCO4CAAAAxgMI8wIAAPQExgMiDOwCgAAAAAHvAoAAAAAB8AKAAAAAAfECgAAAAAHyAoAAAAAB8wKAAAAAAZUDAQAAAAGWAwEAAAABlwMBAAAAAZgDgAAAAAGZA4AAAAABmgOAAAAAAQcHAACrBAAgLwAA9wQAIDAAAPcEACDsAgAAALsDAu0CAAAAuwMI7gIAAAC7AwjzAgAA9gS7AyIE7AIAAAC7AwLtAgAAALsDCO4CAAAAuwMI8wIAAPcEuwMiDuMCAAD4BAAw5AIAAK8BABDlAgAA-AQAMOYCAQCoBAAh6gJAAKkEACHrAkAAqQQAIYUDAQCoBAAhiAMBALMEACGUAwEAswQAIcgDAQCzBAAhyQMBALMEACHKAwEAswQAIcsDAQCzBAAhzAMBALMEACEK4wIAAPkEADDkAgAAlwEAEOUCAAD5BAAw5gIBAKgEACHrAkAAqQQAIZ4DAQCoBAAhyAMBALMEACHKAwEAswQAIcsDAQCzBAAhzAMBALMEACELCQAA-wQAIOMCAAD6BAAw5AIAABsAEOUCAAD6BAAw5gIBALAEACHrAkAAsQQAIZ4DAQCwBAAhyAMBAMEEACHKAwEAwQQAIcsDAQDBBAAhzAMBAMEEACEdBgAA1gQAIAoAAJwFACALAACeBQAgDAAAnwUAIBAAAMQEACAYAACNBQAgGQAAoAUAIBoAAKEFACDjAgAAnQUAMOQCAAAJABDlAgAAnQUAMOYCAQCwBAAh6gJAALEEACHrAkAAsQQAIYUDAQCwBAAhlAMBAMEEACGfAwEAwQQAIbYDEACGBQAhtwMQAIcFACHKAwEAwQQAIcsDAQDBBAAhzAMBAMEEACHPAwEAwQQAIdADEACHBQAh0QMQAIcFACHSAyAAwAQAIdMDAgCCBQAh1gMAAAkAINcDAAAJACAKEwIA4AQAIeMCAAD8BAAw5AIAAH8AEOUCAAD8BAAw5gIBAKgEACHqAkAAqQQAIZ4DAQCoBAAhrgMBAKgEACHNAwEAswQAIc4DIAC8BAAhE-MCAAD9BAAw5AIAAGkAEOUCAAD9BAAw5gIBAKgEACHqAkAAqQQAIesCQACpBAAhhQMBAKgEACGUAwEAswQAIZ8DAQCzBAAhtgMQAOkEACG3AxAA6gQAIcoDAQCzBAAhywMBALMEACHMAwEAswQAIc8DAQCzBAAh0AMQAOoEACHRAxAA6gQAIdIDIAC8BAAh0wMCAOAEACEC-QIBAAAAAZ4DAQAAAAEICQAA-wQAIOMCAAD_BAAw5AIAAEoAEOUCAAD_BAAw5gIBALAEACHqAkAAsQQAIfkCAQCwBAAhngMBALAEACEC-QIBAAAAAZ4DAQAAAAEKCQAA-wQAIOMCAACBBQAw5AIAAEYAEOUCAACBBQAw5gIBALAEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGeAwEAsAQAIbUDAgCCBQAhCOwCAgAAAAHtAgIAAAAE7gICAAAABO8CAgAAAAHwAgIAAAAB8QICAAAAAfICAgAAAAHzAgIAqwQAIQgRAACEBQAg4wIAAIMFADDkAgAAPgAQ5QIAAIMFADDmAgEAsAQAIeoCQACxBAAhrQMBALAEACGuAwEAsAQAIRQJAAD7BAAgCwAAlgUAIA0AAIwFACAXAADFBAAg4wIAAJQFADDkAgAAHQAQ5QIAAJQFADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACH5AgEAsAQAIYsDAACVBbMDIp4DAQCwBAAhrwMCAIIFACGwAwEAwQQAIbEDAQDBBAAhswMBAMEEACG0AwIAggUAIdYDAAAdACDXAwAAHQAgDQkAAPsEACATAADKBAAg4wIAAIUFADDkAgAAMgAQ5QIAAIUFADDmAgEAsAQAIeoCQACxBAAhjwMBALAEACGeAwEAsAQAIbUDAgCCBQAhtgMQAIYFACG3AxAAhwUAIbgDEACGBQAhCOwCEAAAAAHtAhAAAAAE7gIQAAAABO8CEAAAAAHwAhAAAAAB8QIQAAAAAfICEAAAAAHzAhAA7gQAIQjsAhAAAAAB7QIQAAAABe4CEAAAAAXvAhAAAAAB8AIQAAAAAfECEAAAAAHyAhAAAAAB8wIQAOwEACEZDQAAjAUAIBQAAI0FACAVAACOBQAg4wIAAIgFADDkAgAALgAQ5QIAAIgFADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACH5AgEAsAQAIYsDAACJBbsDIpADAQDBBAAhuQMBALAEACG7AxAAhgUAIbwDEACGBQAhvQMQAIcFACG-AxAAhwUAIb8DEACHBQAhwAMgAMAEACHBA0AAyQQAIcIDAADPBAAgwwMAAIoFACDEAwEAwQQAIcYDAACLBcYDIscDAQDBBAAhBOwCAAAAuwMC7QIAAAC7AwjuAgAAALsDCPMCAAD3BLsDIgzsAoAAAAAB7wKAAAAAAfACgAAAAAHxAoAAAAAB8gKAAAAAAfMCgAAAAAGVAwEAAAABlgMBAAAAAZcDAQAAAAGYA4AAAAABmQOAAAAAAZoDgAAAAAEE7AIAAADGAwLtAgAAAMYDCO4CAAAAxgMI8wIAAPQExgMiFA4AAMIEACAPAADDBAAgEAAAxAQAIBIAAMUEACAWAADGBAAg4wIAAL8EADDkAgAAzAMAEOUCAAC_BAAw5gIBALAEACHqAkAAsQQAIesCQACxBAAhhQMBALAEACGGAwEAsAQAIYcDIADABAAhiAMBAMEEACGJAwEAwQQAIYoDAQDBBAAhiwMBAMEEACHWAwAAzAMAINcDAADMAwAgA4wDAAAyACCNAwAAMgAgjgMAADIAIA0TAADKBAAg4wIAAMgEADDkAgAANgAQ5QIAAMgEADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACGPAwEAsAQAIZADAQCwBAAhkQMBAMEEACGSA0AAyQQAIdYDAAA2ACDXAwAANgAgAvkCAQAAAAGtAwEAAAABCQ0AAIwFACARAACEBQAg4wIAAJAFADDkAgAAKgAQ5QIAAJAFADDmAgEAsAQAIeoCQACxBAAh-QIBALAEACGtAwEAsAQAIRINAACMBQAg4wIAAJEFADDkAgAAJQAQ5QIAAJEFADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACH3AgEAsAQAIfgCAQCwBAAh-QIBALAEACH6AgEAwQQAIfsCAQDBBAAh_AIBAMEEACH9AkAAyQQAIf4CQADJBAAh_wIBAMEEACGAAwEAwQQAIYEDAQDBBAAhDA0AAIwFACDjAgAAkgUAMOQCAAAhABDlAgAAkgUAMOYCAQCwBAAh6QJAALEEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGCAwEAsAQAIYMDAQDBBAAhhAMBAMEEACEC-QIBAAAAAZ4DAQAAAAESCQAA-wQAIAsAAJYFACANAACMBQAgFwAAxQQAIOMCAACUBQAw5AIAAB0AEOUCAACUBQAw5gIBALAEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGLAwAAlQWzAyKeAwEAsAQAIa8DAgCCBQAhsAMBAMEEACGxAwEAwQQAIbMDAQDBBAAhtAMCAIIFACEE7AIAAACzAwLtAgAAALMDCO4CAAAAswMI8wIAAOMEswMiA4wDAAA-ACCNAwAAPgAgjgMAAD4AIAsJAAD7BAAgEwIAggUAIeMCAACXBQAw5AIAABcAEOUCAACXBQAw5gIBALAEACHqAkAAsQQAIZ4DAQCwBAAhrgMBALAEACHNAwEAwQQAIc4DIADABAAhDwgAAJoFACAJAACbBQAgCgAAnAUAIOMCAACYBQAw5AIAAAwAEOUCAACYBQAw5gIBALAEACHqAkAAsQQAIZsDAQCwBAAhnAMBALAEACGdAwEAwQQAIZ4DAQDBBAAhnwMBAMEEACGgAwEAwQQAIaEDAgCZBQAhCOwCAgAAAAHtAgIAAAAF7gICAAAABe8CAgAAAAHwAgIAAAAB8QICAAAAAfICAgAAAAHzAgIAtgQAIRAGAADWBAAg4wIAANUEADDkAgAA6AIAEOUCAADVBAAw5gIBALAEACH5AgEAwQQAIYMDAQDBBAAhhAMBAMEEACGgAwEAwQQAIaIDAQCwBAAhowNAALEEACGkAwEAwQQAIaUDAQDBBAAhpgMBAMEEACHWAwAA6AIAINcDAADoAgAgHQYAANYEACAKAACcBQAgCwAAngUAIAwAAJ8FACAQAADEBAAgGAAAjQUAIBkAAKAFACAaAAChBQAg4wIAAJ0FADDkAgAACQAQ5QIAAJ0FADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACGFAwEAsAQAIZQDAQDBBAAhnwMBAMEEACG2AxAAhgUAIbcDEACHBQAhygMBAMEEACHLAwEAwQQAIcwDAQDBBAAhzwMBAMEEACHQAxAAhwUAIdEDEACHBQAh0gMgAMAEACHTAwIAggUAIdYDAAAJACDXAwAACQAgFAEAAJwFACAEAACjBQAgBQAApAUAIAYAANYEACDjAgAAogUAMOQCAAADABDlAgAAogUAMOYCAQCwBAAh6gJAALEEACHrAkAAsQQAIYUDAQCwBAAhiAMBAMEEACGUAwEAwQQAIcgDAQDBBAAhyQMBAMEEACHKAwEAwQQAIcsDAQDBBAAhzAMBAMEEACHWAwAAAwAg1wMAAAMAIBsGAADWBAAgCgAAnAUAIAsAAJ4FACAMAACfBQAgEAAAxAQAIBgAAI0FACAZAACgBQAgGgAAoQUAIOMCAACdBQAw5AIAAAkAEOUCAACdBQAw5gIBALAEACHqAkAAsQQAIesCQACxBAAhhQMBALAEACGUAwEAwQQAIZ8DAQDBBAAhtgMQAIYFACG3AxAAhwUAIcoDAQDBBAAhywMBAMEEACHMAwEAwQQAIc8DAQDBBAAh0AMQAIcFACHRAxAAhwUAIdIDIADABAAh0wMCAIIFACEDjAMAABcAII0DAAAXACCOAwAAFwAgDQkAAPsEACDjAgAA-gQAMOQCAAAbABDlAgAA-gQAMOYCAQCwBAAh6wJAALEEACGeAwEAsAQAIcgDAQDBBAAhygMBAMEEACHLAwEAwQQAIcwDAQDBBAAh1gMAABsAINcDAAAbACADjAMAAEYAII0DAABGACCOAwAARgAgA4wDAABKACCNAwAASgAgjgMAAEoAIBIBAACcBQAgBAAAowUAIAUAAKQFACAGAADWBAAg4wIAAKIFADDkAgAAAwAQ5QIAAKIFADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACGFAwEAsAQAIYgDAQDBBAAhlAMBAMEEACHIAwEAwQQAIckDAQDBBAAhygMBAMEEACHLAwEAwQQAIcwDAQDBBAAhA4wDAAADACCNAwAAAwAgjgMAAAMAIAOMAwAACQAgjQMAAAkAII4DAAAJACAAAAAB2wMBAAAAAQHbA0AAAAABAAAAAAHbAwEAAAABAdsDQAAAAAEFJwAApgkAICgAAKkJACDYAwAApwkAINkDAACoCQAg3gMAAMkDACADJwAApgkAINgDAACnCQAg3gMAAMkDACAAAAAFJwAAoQkAICgAAKQJACDYAwAAogkAINkDAACjCQAg3gMAAMkDACADJwAAoQkAINgDAACiCQAg3gMAAMkDACAAAAAB2wMgAAAAAQsnAACsBgAwKAAAsQYAMNgDAACtBgAw2QMAAK4GADDaAwAArwYAINsDAACwBgAw3AMAALAGADDdAwAAsAYAMN4DAACwBgAw3wMAALIGADDgAwAAswYAMAsnAACgBgAwKAAApQYAMNgDAAChBgAw2QMAAKIGADDaAwAAowYAINsDAACkBgAw3AMAAKQGADDdAwAApAYAMN4DAACkBgAw3wMAAKYGADDgAwAApwYAMAsnAAD2BQAwKAAA-wUAMNgDAAD3BQAw2QMAAPgFADDaAwAA-QUAINsDAAD6BQAw3AMAAPoFADDdAwAA-gUAMN4DAAD6BQAw3wMAAPwFADDgAwAA_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_gUAICAAAP8FACAO4wIAAP0FADDkAgAA_gUAEOUCAAD9BQAw5gIBALAEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGLAwAAlQWzAyKeAwEAsAQAIa8DAgCCBQAhsAMBAMEEACGxAwEAwQQAIbMDAQDBBAAhtAMCAIIFACEO4wIAAP0FADDkAgAA_gUAEOUCAAD9BQAw5gIBALAEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGLAwAAlQWzAyKeAwEAsAQAIa8DAgCCBQAhsAMBAMEEACGxAwEAwQQAIbMDAQDBBAAhtAMCAIIFACEK5gIBAKgFACHqAkAAqQUAIesCQACpBQAhiwMAAIAGswMingMBAKgFACGvAwIA4AUAIbADAQCuBQAhsQMBAK4FACGzAwEArgUAIbQDAgDgBQAhAdsDAAAAswMCDQkAAIIGACALAACDBgAgFwAAhAYAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYsDAACABrMDIp4DAQCoBQAhrwMCAOAFACGwAwEArgUAIbEDAQCuBQAhswMBAK4FACG0AwIA4AUAIQUnAACHCQAgKAAAkQkAINgDAACICQAg2QMAAJAJACDeAwAAAQAgCycAAJAGADAoAACVBgAw2AMAAJEGADDZAwAAkgYAMNoDAACTBgAg2wMAAJQGADDcAwAAlAYAMN0DAACUBgAw3gMAAJQGADDfAwAAlgYAMOADAACXBgAwCycAAIUGADAoAACJBgAw2AMAAIYGADDZAwAAhwYAMNoDAACIBgAg2wMAAOwFADDcAwAA7AUAMN0DAADsBQAw3gMAAOwFADDfAwAAigYAMOADAADvBQAwBA0AAI8GACDmAgEAAAAB6gJAAAAAAfkCAQAAAAECAAAALAAgJwAAjgYAIAMAAAAsACAnAACOBgAgKAAAjAYAIAEgAACPCQAwAgAAACwAICAAAIwGACACAAAA8AUAICAAAIsGACAD5gIBAKgFACHqAkAAqQUAIfkCAQCoBQAhBA0AAI0GACDmAgEAqAUAIeoCQACpBQAh-QIBAKgFACEFJwAAigkAICgAAI0JACDYAwAAiwkAINkDAACMCQAg3gMAAMkDACAEDQAAjwYAIOYCAQAAAAHqAkAAAAAB-QIBAAAAAQMnAACKCQAg2AMAAIsJACDeAwAAyQMAIAPmAgEAAAAB6gJAAAAAAa4DAQAAAAECAAAAQAAgJwAAmwYAIAMAAABAACAnAACbBgAgKAAAmgYAIAEgAACJCQAwCBEAAIQFACDjAgAAgwUAMOQCAAA-ABDlAgAAgwUAMOYCAQAAAAHqAkAAsQQAIa0DAQCwBAAhrgMBALAEACECAAAAQAAgIAAAmgYAIAIAAACYBgAgIAAAmQYAIAfjAgAAlwYAMOQCAACYBgAQ5QIAAJcGADDmAgEAsAQAIeoCQACxBAAhrQMBALAEACGuAwEAsAQAIQfjAgAAlwYAMOQCAACYBgAQ5QIAAJcGADDmAgEAsAQAIeoCQACxBAAhrQMBALAEACGuAwEAsAQAIQPmAgEAqAUAIeoCQACpBQAhrgMBAKgFACED5gIBAKgFACHqAkAAqQUAIa4DAQCoBQAhA-YCAQAAAAHqAkAAAAABrgMBAAAAAQ0JAACdBgAgCwAAngYAIBcAAJ8GACDmAgEAAAAB6gJAAAAAAesCQAAAAAGLAwAAALMDAp4DAQAAAAGvAwIAAAABsAMBAAAAAbEDAQAAAAGzAwEAAAABtAMCAAAAAQMnAACHCQAg2AMAAIgJACDeAwAAAQAgBCcAAJAGADDYAwAAkQYAMNoDAACTBgAg3gMAAJQGADAEJwAAhQYAMNgDAACGBgAw2gMAAIgGACDeAwAA7AUAMA3mAgEAAAAB6gJAAAAAAesCQAAAAAH3AgEAAAAB-AIBAAAAAfoCAQAAAAH7AgEAAAAB_AIBAAAAAf0CQAAAAAH-AkAAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABAgAAACcAICcAAKsGACADAAAAJwAgJwAAqwYAICgAAKoGACABIAAAhgkAMBINAACMBQAg4wIAAJEFADDkAgAAJQAQ5QIAAJEFADDmAgEAAAAB6gJAALEEACHrAkAAsQQAIfcCAQCwBAAh-AIBALAEACH5AgEAsAQAIfoCAQDBBAAh-wIBAMEEACH8AgEAwQQAIf0CQADJBAAh_gJAAMkEACH_AgEAwQQAIYADAQDBBAAhgQMBAMEEACECAAAAJwAgIAAAqgYAIAIAAACoBgAgIAAAqQYAIBHjAgAApwYAMOQCAACoBgAQ5QIAAKcGADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACH3AgEAsAQAIfgCAQCwBAAh-QIBALAEACH6AgEAwQQAIfsCAQDBBAAh_AIBAMEEACH9AkAAyQQAIf4CQADJBAAh_wIBAMEEACGAAwEAwQQAIYEDAQDBBAAhEeMCAACnBgAw5AIAAKgGABDlAgAApwYAMOYCAQCwBAAh6gJAALEEACHrAkAAsQQAIfcCAQCwBAAh-AIBALAEACH5AgEAsAQAIfoCAQDBBAAh-wIBAMEEACH8AgEAwQQAIf0CQADJBAAh_gJAAMkEACH_AgEAwQQAIYADAQDBBAAhgQMBAMEEACEN5gIBAKgFACHqAkAAqQUAIesCQACpBQAh9wIBAKgFACH4AgEAqAUAIfoCAQCuBQAh-wIBAK4FACH8AgEArgUAIf0CQACvBQAh_gJAAK8FACH_AgEArgUAIYADAQCuBQAhgQMBAK4FACEN5gIBAKgFACHqAkAAqQUAIesCQACpBQAh9wIBAKgFACH4AgEAqAUAIfoCAQCuBQAh-wIBAK4FACH8AgEArgUAIf0CQACvBQAh_gJAAK8FACH_AgEArgUAIYADAQCuBQAhgQMBAK4FACEN5gIBAAAAAeoCQAAAAAHrAkAAAAAB9wIBAAAAAfgCAQAAAAH6AgEAAAAB-wIBAAAAAfwCAQAAAAH9AkAAAAAB_gJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAQfmAgEAAAAB6QJAAAAAAeoCQAAAAAHrAkAAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABAgAAACMAICcAALcGACADAAAAIwAgJwAAtwYAICgAALYGACABIAAAhQkAMAwNAACMBQAg4wIAAJIFADDkAgAAIQAQ5QIAAJIFADDmAgEAAAAB6QJAALEEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGCAwEAAAABgwMBAMEEACGEAwEAwQQAIQIAAAAjACAgAAC2BgAgAgAAALQGACAgAAC1BgAgC-MCAACzBgAw5AIAALQGABDlAgAAswYAMOYCAQCwBAAh6QJAALEEACHqAkAAsQQAIesCQACxBAAh-QIBALAEACGCAwEAsAQAIYMDAQDBBAAhhAMBAMEEACEL4wIAALMGADDkAgAAtAYAEOUCAACzBgAw5gIBALAEACHpAkAAsQQAIeoCQACxBAAh6wJAALEEACH5AgEAsAQAIYIDAQCwBAAhgwMBAMEEACGEAwEAwQQAIQfmAgEAqAUAIekCQACpBQAh6gJAAKkFACHrAkAAqQUAIYIDAQCoBQAhgwMBAK4FACGEAwEArgUAIQfmAgEAqAUAIekCQACpBQAh6gJAAKkFACHrAkAAqQUAIYIDAQCoBQAhgwMBAK4FACGEAwEArgUAIQfmAgEAAAAB6QJAAAAAAeoCQAAAAAHrAkAAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABBCcAAKwGADDYAwAArQYAMNoDAACvBgAg3gMAALAGADAEJwAAoAYAMNgDAAChBgAw2gMAAKMGACDeAwAApAYAMAQnAAD2BQAw2AMAAPcFADDaAwAA-QUAIN4DAAD6BQAwBCcAAOgFADDYAwAA6QUAMNoDAADrBQAg3gMAAOwFADAEJwAAwAUAMNgDAADBBQAw2gMAAMMFACDeAwAAxAUAMAAAAAAAAAAABScAAIAJACAoAACDCQAg2AMAAIEJACDZAwAAggkAIN4DAAAwACADJwAAgAkAINgDAACBCQAg3gMAADAAIAsNAACpCAAgFAAAqggAIBUAAKsIACCQAwAAqgUAIL0DAACqBQAgvgMAAKoFACC_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_gcAIBAAAP8HACAYAACACAAgGQAAgQgAIBoAAIIIACDmAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABlAMBAAAAAbYDEAAAAAG3AxAAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzwMBAAAAAdADEAAAAAHRAxAAAAAB0gMgAAAAAdMDAgAAAAECAAAAAQAgJwAA_AcAIAMAAAABACAnAAD8BwAgKAAAsAcAIAEgAADNCAAwGwYAANYEACAKAACcBQAgCwAAngUAIAwAAJ8FACAQAADEBAAgGAAAjQUAIBkAAKAFACAaAAChBQAg4wIAAJ0FADDkAgAACQAQ5QIAAJ0FADDmAgEAAAAB6gJAALEEACHrAkAAsQQAIYUDAQCwBAAhlAMBAMEEACGfAwEAwQQAIbYDEACGBQAhtwMQAIcFACHKAwEAwQQAIcsDAQDBBAAhzAMBAMEEACHPAwEAAAAB0AMQAIcFACHRAxAAhwUAIdIDIADABAAh0wMCAIIFACECAAAAAQAgIAAAsAcAIAIAAACuBwAgIAAArwcAIBPjAgAArQcAMOQCAACuBwAQ5QIAAK0HADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACGFAwEAsAQAIZQDAQDBBAAhnwMBAMEEACG2AxAAhgUAIbcDEACHBQAhygMBAMEEACHLAwEAwQQAIcwDAQDBBAAhzwMBAMEEACHQAxAAhwUAIdEDEACHBQAh0gMgAMAEACHTAwIAggUAIRPjAgAArQcAMOQCAACuBwAQ5QIAAK0HADDmAgEAsAQAIeoCQACxBAAh6wJAALEEACGFAwEAsAQAIZQDAQDBBAAhnwMBAMEEACG2AxAAhgUAIbcDEACHBQAhygMBAMEEACHLAwEAwQQAIcwDAQDBBAAhzwMBAMEEACHQAxAAhwUAIdEDEACHBQAh0gMgAMAEACHTAwIAggUAIQ_mAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIZQDAQCuBQAhtgMQAMsFACG3AxAAzAUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIc8DAQCuBQAh0AMQAMwFACHRAxAAzAUAIdIDIAC6BQAh0wMCAOAFACEWBgAAtwcAIAsAALEHACAMAACyBwAgEAAAswcAIBgAALQHACAZAAC1BwAgGgAAtgcAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhlAMBAK4FACG2AxAAywUAIbcDEADMBQAhygMBAK4FACHLAwEArgUAIcwDAQCuBQAhzwMBAK4FACHQAxAAzAUAIdEDEADMBQAh0gMgALoFACHTAwIA4AUAIQsnAADwBwAwKAAA9QcAMNgDAADxBwAw2QMAAPIHADDaAwAA8wcAINsDAAD0BwAw3AMAAPQHADDdAwAA9AcAMN4DAAD0BwAw3wMAAPYHADDgAwAA9wcAMAcnAADrBwAgKAAA7gcAINgDAADsBwAg2QMAAO0HACDcAwAAGwAg3QMAABsAIN4DAACCAQAgCycAAOIHADAoAADmBwAw2AMAAOMHADDZAwAA5AcAMNoDAADlBwAg2wMAAPoFADDcAwAA-gUAMN0DAAD6BQAw3gMAAPoFADDfAwAA5wcAMOADAAD9BQAwCycAANkHADAoAADdBwAw2AMAANoHADDZAwAA2wcAMNoDAADcBwAg2wMAANoFADDcAwAA2gUAMN0DAADaBQAw3gMAANoFADDfAwAA3gcAMOADAADdBQAwCycAAM0HADAoAADSBwAw2AMAAM4HADDZAwAAzwcAMNoDAADQBwAg2wMAANEHADDcAwAA0QcAMN0DAADRBwAw3gMAANEHADDfAwAA0wcAMOADAADUBwAwCycAAMEHADAoAADGBwAw2AMAAMIHADDZAwAAwwcAMNoDAADEBwAg2wMAAMUHADDcAwAAxQcAMN0DAADFBwAw3gMAAMUHADDfAwAAxwcAMOADAADIBwAwCycAALgHADAoAAC8BwAw2AMAALkHADDZAwAAugcAMNoDAAC7BwAg2wMAAN8GADDcAwAA3wYAMN0DAADfBgAw3gMAAN8GADDfAwAAvQcAMOADAADiBgAwCggAANQGACAKAADWBgAg5gIBAAAAAeoCQAAAAAGbAwEAAAABnAMBAAAAAZ0DAQAAAAGfAwEAAAABoAMBAAAAAaEDAgAAAAECAAAADgAgJwAAwAcAIAMAAAAOACAnAADABwAgKAAAvwcAIAEgAADMCAAwAgAAAA4AICAAAL8HACACAAAA4wYAICAAAL4HACAI5gIBAKgFACHqAkAAqQUAIZsDAQCoBQAhnAMBAKgFACGdAwEArgUAIZ8DAQCuBQAhoAMBAK4FACGhAwIA0AYAIQoIAADRBgAgCgAA0wYAIOYCAQCoBQAh6gJAAKkFACGbAwEAqAUAIZwDAQCoBQAhnQMBAK4FACGfAwEArgUAIaADAQCuBQAhoQMCANAGACEKCAAA1AYAIAoAANYGACDmAgEAAAAB6gJAAAAAAZsDAQAAAAGcAwEAAAABnQMBAAAAAZ8DAQAAAAGgAwEAAAABoQMCAAAAAQPmAgEAAAAB6gJAAAAAAfkCAQAAAAECAAAATAAgJwAAzAcAIAMAAABMACAnAADMBwAgKAAAywcAIAEgAADLCAAwCQkAAPsEACDjAgAA_wQAMOQCAABKABDlAgAA_wQAMOYCAQAAAAHqAkAAsQQAIfkCAQCwBAAhngMBALAEACHUAwAA_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-gcAIAIAAAD4BwAgIAAA-QcAIAoTAgCCBQAh4wIAAPcHADDkAgAA-AcAEOUCAAD3BwAw5gIBALAEACHqAkAAsQQAIZ4DAQCwBAAhrgMBALAEACHNAwEAwQQAIc4DIADABAAhChMCAIIFACHjAgAA9wcAMOQCAAD4BwAQ5QIAAPcHADDmAgEAsAQAIeoCQACxBAAhngMBALAEACGuAwEAsAQAIc0DAQDBBAAhzgMgAMAEACEGEwIA4AUAIeYCAQCoBQAh6gJAAKkFACGuAwEAqAUAIc0DAQCuBQAhzgMgALoFACEGEwIA4AUAIeYCAQCoBQAh6gJAAKkFACGuAwEAqAUAIc0DAQCuBQAhzgMgALoFACEGEwIAAAAB5gIBAAAAAeoCQAAAAAGuAwEAAAABzQMBAAAAAc4DIAAAAAEWBgAAgwgAIAsAAP0HACAMAAD-BwAgEAAA_wcAIBgAAIAIACAZAACBCAAgGgAAgggAIOYCAQAAAAHqAkAAAAAB6wJAAAAAAYUDAQAAAAGUAwEAAAABtgMQAAAAAbcDEAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHPAwEAAAAB0AMQAAAAAdEDEAAAAAHSAyAAAAAB0wMCAAAAAQQnAADwBwAw2AMAAPEHADDaAwAA8wcAIN4DAAD0BwAwAycAAOsHACDYAwAA7AcAIN4DAACCAQAgBCcAAOIHADDYAwAA4wcAMNoDAADlBwAg3gMAAPoFADAEJwAA2QcAMNgDAADaBwAw2gMAANwHACDeAwAA2gUAMAQnAADNBwAw2AMAAM4HADDaAwAA0AcAIN4DAADRBwAwBCcAAMEHADDYAwAAwgcAMNoDAADEBwAg3gMAAMUHADAEJwAAuAcAMNgDAAC5BwAw2gMAALsHACDeAwAA3wYAMA0EAACQCAAgBQAAkQgAIAYAAJIIACDmAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABiAMBAAAAAZQDAQAAAAHIAwEAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABAgAAAAcAICcAAI8IACADAAAABwAgJwAAjwgAICgAAI4IACABIAAAxggAMBIBAACcBQAgBAAAowUAIAUAAKQFACAGAADWBAAg4wIAAKIFADDkAgAAAwAQ5QIAAKIFADDmAgEAAAAB6gJAALEEACHrAkAAsQQAIYUDAQCwBAAhiAMBAMEEACGUAwEAwQQAIcgDAQAAAAHJAwEAwQQAIcoDAQDBBAAhywMBAMEEACHMAwEAwQQAIQIAAAAHACAgAACOCAAgAgAAAIwIACAgAACNCAAgDuMCAACLCAAw5AIAAIwIABDlAgAAiwgAMOYCAQCwBAAh6gJAALEEACHrAkAAsQQAIYUDAQCwBAAhiAMBAMEEACGUAwEAwQQAIcgDAQDBBAAhyQMBAMEEACHKAwEAwQQAIcsDAQDBBAAhzAMBAMEEACEO4wIAAIsIADDkAgAAjAgAEOUCAACLCAAw5gIBALAEACHqAkAAsQQAIesCQACxBAAhhQMBALAEACGIAwEAwQQAIZQDAQDBBAAhyAMBAMEEACHJAwEAwQQAIcoDAQDBBAAhywMBAMEEACHMAwEAwQQAIQrmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIYgDAQCuBQAhlAMBAK4FACHIAwEArgUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIQ0EAACaBwAgBQAAmwcAIAYAAJwHACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIYgDAQCuBQAhlAMBAK4FACHIAwEArgUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIQ0EAACQCAAgBQAAkQgAIAYAAJIIACDmAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABiAMBAAAAAZQDAQAAAAHIAwEAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABBCcAAIQIADDYAwAAhQgAMNoDAACHCAAg3gMAAIgIADAEJwAApgcAMNgDAACnBwAw2gMAAKkHACDeAwAAqgcAMAQnAACdBwAw2AMAAJ4HADDaAwAAoAcAIN4DAADfBgAwAycAAMQIACDYAwAAxQgAIN4DAAAHACAAAAAFJwAAvwgAICgAAMIIACDYAwAAwAgAINkDAADBCAAg3gMAAAEAIAMnAAC_CAAg2AMAAMAIACDeAwAAAQAgEQYAAOgGACAKAACuCAAgCwAArwgAIAwAALAIACAQAAC_BgAgGAAAqggAIBkAALEIACAaAACyCAAglAMAAKoFACCfAwAAqgUAILcDAACqBQAgygMAAKoFACDLAwAAqgUAIMwDAACqBQAgzwMAAKoFACDQAwAAqgUAINEDAACqBQAgAAAAAAAFJwAAuggAICgAAL0IACDYAwAAuwgAINkDAAC8CAAg3gMAAAEAIAMnAAC6CAAg2AMAALsIACDeAwAAAQAgAAAAAAAHJwAAtQgAICgAALgIACDYAwAAtggAINkDAAC3CAAg3AMAAAMAIN0DAAADACDeAwAABwAgAycAALUIACDYAwAAtggAIN4DAAAHACAHCQAAmQgAIAsAAKwIACANAACpCAAgFwAAwAYAILADAACqBQAgsQMAAKoFACCzAwAAqgUAIAkOAAC9BgAgDwAAvgYAIBAAAL8GACASAADABgAgFgAAwQYAIIgDAACqBQAgiQMAAKoFACCKAwAAqgUAIIsDAACqBQAgAAMTAADHBgAgkQMAAKoFACCSAwAAqgUAIAAIBgAA6AYAIPkCAACqBQAggwMAAKoFACCEAwAAqgUAIKADAACqBQAgpAMAAKoFACClAwAAqgUAIKYDAACqBQAgCwEAAK4IACAEAACzCAAgBQAAtAgAIAYAAOgGACCIAwAAqgUAIJQDAACqBQAgyAMAAKoFACDJAwAAqgUAIMoDAACqBQAgywMAAKoFACDMAwAAqgUAIAAFCQAAmQgAIMgDAACqBQAgygMAAKoFACDLAwAAqgUAIMwDAACqBQAgAAAAAA4BAACTCAAgBAAAkAgAIAYAAJIIACDmAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABiAMBAAAAAZQDAQAAAAHIAwEAAAAByQMBAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAQIAAAAHACAnAAC1CAAgAwAAAAMAICcAALUIACAoAAC5CAAgEAAAAAMAIAEAAJkHACAEAACaBwAgBgAAnAcAICAAALkIACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIYgDAQCuBQAhlAMBAK4FACHIAwEArgUAIckDAQCuBQAhygMBAK4FACHLAwEArgUAIcwDAQCuBQAhDgEAAJkHACAEAACaBwAgBgAAnAcAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhiAMBAK4FACGUAwEArgUAIcgDAQCuBQAhyQMBAK4FACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACEXBgAAgwgAIAoAAKcIACAMAAD-BwAgEAAA_wcAIBgAAIAIACAZAACBCAAgGgAAgggAIOYCAQAAAAHqAkAAAAAB6wJAAAAAAYUDAQAAAAGUAwEAAAABnwMBAAAAAbYDEAAAAAG3AxAAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzwMBAAAAAdADEAAAAAHRAxAAAAAB0gMgAAAAAdMDAgAAAAECAAAAAQAgJwAAuggAIAMAAAAJACAnAAC6CAAgKAAAvggAIBkAAAAJACAGAAC3BwAgCgAApggAIAwAALIHACAQAACzBwAgGAAAtAcAIBkAALUHACAaAAC2BwAgIAAAvggAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhlAMBAK4FACGfAwEArgUAIbYDEADLBQAhtwMQAMwFACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACHPAwEArgUAIdADEADMBQAh0QMQAMwFACHSAyAAugUAIdMDAgDgBQAhFwYAALcHACAKAACmCAAgDAAAsgcAIBAAALMHACAYAAC0BwAgGQAAtQcAIBoAALYHACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIZQDAQCuBQAhnwMBAK4FACG2AxAAywUAIbcDEADMBQAhygMBAK4FACHLAwEArgUAIcwDAQCuBQAhzwMBAK4FACHQAxAAzAUAIdEDEADMBQAh0gMgALoFACHTAwIA4AUAIRcGAACDCAAgCgAApwgAIAsAAP0HACAQAAD_BwAgGAAAgAgAIBkAAIEIACAaAACCCAAg5gIBAAAAAeoCQAAAAAHrAkAAAAABhQMBAAAAAZQDAQAAAAGfAwEAAAABtgMQAAAAAbcDEAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHPAwEAAAAB0AMQAAAAAdEDEAAAAAHSAyAAAAAB0wMCAAAAAQIAAAABACAnAAC_CAAgAwAAAAkAICcAAL8IACAoAADDCAAgGQAAAAkAIAYAALcHACAKAACmCAAgCwAAsQcAIBAAALMHACAYAAC0BwAgGQAAtQcAIBoAALYHACAgAADDCAAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGUAwEArgUAIZ8DAQCuBQAhtgMQAMsFACG3AxAAzAUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIc8DAQCuBQAh0AMQAMwFACHRAxAAzAUAIdIDIAC6BQAh0wMCAOAFACEXBgAAtwcAIAoAAKYIACALAACxBwAgEAAAswcAIBgAALQHACAZAAC1BwAgGgAAtgcAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhlAMBAK4FACGfAwEArgUAIbYDEADLBQAhtwMQAMwFACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACHPAwEArgUAIdADEADMBQAh0QMQAMwFACHSAyAAugUAIdMDAgDgBQAhDgEAAJMIACAFAACRCAAgBgAAkggAIOYCAQAAAAHqAkAAAAAB6wJAAAAAAYUDAQAAAAGIAwEAAAABlAMBAAAAAcgDAQAAAAHJAwEAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABAgAAAAcAICcAAMQIACAK5gIBAAAAAeoCQAAAAAHrAkAAAAABhQMBAAAAAYgDAQAAAAGUAwEAAAAByAMBAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAQYTAgAAAAHmAgEAAAAB6gJAAAAAAa4DAQAAAAHNAwEAAAABzgMgAAAAAQrmAgEAAAAB6gJAAAAAAesCQAAAAAH5AgEAAAABiwMAAACzAwKvAwIAAAABsAMBAAAAAbEDAQAAAAGzAwEAAAABtAMCAAAAAQfmAgEAAAAB6gJAAAAAAY8DAQAAAAG1AwIAAAABtgMQAAAAAbcDEAAAAAG4AxAAAAABBeYCAQAAAAHqAkAAAAAB6wJAAAAAAfkCAQAAAAG1AwIAAAABA-YCAQAAAAHqAkAAAAAB-QIBAAAAAQjmAgEAAAAB6gJAAAAAAZsDAQAAAAGcAwEAAAABnQMBAAAAAZ8DAQAAAAGgAwEAAAABoQMCAAAAAQ_mAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABlAMBAAAAAbYDEAAAAAG3AxAAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzwMBAAAAAdADEAAAAAHRAxAAAAAB0gMgAAAAAdMDAgAAAAEI5gIBAAAAAeoCQAAAAAGbAwEAAAABnAMBAAAAAZ0DAQAAAAGeAwEAAAABoAMBAAAAAaEDAgAAAAEDAAAAAwAgJwAAxAgAICgAANEIACAQAAAAAwAgAQAAmQcAIAUAAJsHACAGAACcBwAgIAAA0QgAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhiAMBAK4FACGUAwEArgUAIcgDAQCuBQAhyQMBAK4FACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACEOAQAAmQcAIAUAAJsHACAGAACcBwAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGIAwEArgUAIZQDAQCuBQAhyAMBAK4FACHJAwEArgUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIQ4OAAC4BgAgDwAAuQYAIBAAALoGACASAAC7BgAg5gIBAAAAAeoCQAAAAAHrAkAAAAABhQMBAAAAAYYDAQAAAAGHAyAAAAABiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAQIAAADJAwAgJwAA0ggAIAMAAADMAwAgJwAA0ggAICgAANYIACAQAAAAzAMAIA4AALsFACAPAAC8BQAgEAAAvQUAIBIAAL4FACAgAADWCAAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGGAwEAqAUAIYcDIAC6BQAhiAMBAK4FACGJAwEArgUAIYoDAQCuBQAhiwMBAK4FACEODgAAuwUAIA8AALwFACAQAAC9BQAgEgAAvgUAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhhgMBAKgFACGHAyAAugUAIYgDAQCuBQAhiQMBAK4FACGKAwEArgUAIYsDAQCuBQAhFQ0AAJUHACAVAADnBQAg5gIBAAAAAeoCQAAAAAHrAkAAAAAB-QIBAAAAAYsDAAAAuwMCkAMBAAAAAbkDAQAAAAG7AxAAAAABvAMQAAAAAb0DEAAAAAG-AxAAAAABvwMQAAAAAcADIAAAAAHBA0AAAAABwgOAAAAAAcMDgAAAAAHEAwEAAAABxgMAAADGAwLHAwEAAAABAgAAADAAICcAANcIACADAAAALgAgJwAA1wgAICgAANsIACAXAAAALgAgDQAAlAcAIBUAANAFACAgAADbCAAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAh-QIBAKgFACGLAwAAygW7AyKQAwEArgUAIbkDAQCoBQAhuwMQAMsFACG8AxAAywUAIb0DEADMBQAhvgMQAMwFACG_AxAAzAUAIcADIAC6BQAhwQNAAK8FACHCA4AAAAABwwOAAAAAAcQDAQCuBQAhxgMAAM0FxgMixwMBAK4FACEVDQAAlAcAIBUAANAFACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACH5AgEAqAUAIYsDAADKBbsDIpADAQCuBQAhuQMBAKgFACG7AxAAywUAIbwDEADLBQAhvQMQAMwFACG-AxAAzAUAIb8DEADMBQAhwAMgALoFACHBA0AArwUAIcIDgAAAAAHDA4AAAAABxAMBAK4FACHGAwAAzQXGAyLHAwEArgUAIRcGAACDCAAgCgAApwgAIAsAAP0HACAMAAD-BwAgEAAA_wcAIBgAAIAIACAaAACCCAAg5gIBAAAAAeoCQAAAAAHrAkAAAAABhQMBAAAAAZQDAQAAAAGfAwEAAAABtgMQAAAAAbcDEAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHPAwEAAAAB0AMQAAAAAdEDEAAAAAHSAyAAAAAB0wMCAAAAAQIAAAABACAnAADcCAAgAwAAAAkAICcAANwIACAoAADgCAAgGQAAAAkAIAYAALcHACAKAACmCAAgCwAAsQcAIAwAALIHACAQAACzBwAgGAAAtAcAIBoAALYHACAgAADgCAAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGUAwEArgUAIZ8DAQCuBQAhtgMQAMsFACG3AxAAzAUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIc8DAQCuBQAh0AMQAMwFACHRAxAAzAUAIdIDIAC6BQAh0wMCAOAFACEXBgAAtwcAIAoAAKYIACALAACxBwAgDAAAsgcAIBAAALMHACAYAAC0BwAgGgAAtgcAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhlAMBAK4FACGfAwEArgUAIbYDEADLBQAhtwMQAMwFACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACHPAwEArgUAIdADEADMBQAh0QMQAMwFACHSAyAAugUAIdMDAgDgBQAhFwYAAIMIACAKAACnCAAgCwAA_QcAIAwAAP4HACAQAAD_BwAgGAAAgAgAIBkAAIEIACDmAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABlAMBAAAAAZ8DAQAAAAG2AxAAAAABtwMQAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAc8DAQAAAAHQAxAAAAAB0QMQAAAAAdIDIAAAAAHTAwIAAAABAgAAAAEAICcAAOEIACADAAAACQAgJwAA4QgAICgAAOUIACAZAAAACQAgBgAAtwcAIAoAAKYIACALAACxBwAgDAAAsgcAIBAAALMHACAYAAC0BwAgGQAAtQcAICAAAOUIACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIZQDAQCuBQAhnwMBAK4FACG2AxAAywUAIbcDEADMBQAhygMBAK4FACHLAwEArgUAIcwDAQCuBQAhzwMBAK4FACHQAxAAzAUAIdEDEADMBQAh0gMgALoFACHTAwIA4AUAIRcGAAC3BwAgCgAApggAIAsAALEHACAMAACyBwAgEAAAswcAIBgAALQHACAZAAC1BwAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGUAwEArgUAIZ8DAQCuBQAhtgMQAMsFACG3AxAAzAUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIc8DAQCuBQAh0AMQAMwFACHRAxAAzAUAIdIDIAC6BQAh0wMCAOAFACEODgAAuAYAIA8AALkGACASAAC7BgAgFgAAvAYAIOYCAQAAAAHqAkAAAAAB6wJAAAAAAYUDAQAAAAGGAwEAAAABhwMgAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAECAAAAyQMAICcAAOYIACADAAAAzAMAICcAAOYIACAoAADqCAAgEAAAAMwDACAOAAC7BQAgDwAAvAUAIBIAAL4FACAWAAC_BQAgIAAA6ggAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhhgMBAKgFACGHAyAAugUAIYgDAQCuBQAhiQMBAK4FACGKAwEArgUAIYsDAQCuBQAhDg4AALsFACAPAAC8BQAgEgAAvgUAIBYAAL8FACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIYYDAQCoBQAhhwMgALoFACGIAwEArgUAIYkDAQCuBQAhigMBAK4FACGLAwEArgUAIQ4JAACdBgAgDQAA-wYAIBcAAJ8GACDmAgEAAAAB6gJAAAAAAesCQAAAAAH5AgEAAAABiwMAAACzAwKeAwEAAAABrwMCAAAAAbADAQAAAAGxAwEAAAABswMBAAAAAbQDAgAAAAECAAAAHwAgJwAA6wgAIAMAAAAdACAnAADrCAAgKAAA7wgAIBAAAAAdACAJAACCBgAgDQAA-gYAIBcAAIQGACAgAADvCAAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAh-QIBAKgFACGLAwAAgAazAyKeAwEAqAUAIa8DAgDgBQAhsAMBAK4FACGxAwEArgUAIbMDAQCuBQAhtAMCAOAFACEOCQAAggYAIA0AAPoGACAXAACEBgAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAh-QIBAKgFACGLAwAAgAazAyKeAwEAqAUAIa8DAgDgBQAhsAMBAK4FACGxAwEArgUAIbMDAQCuBQAhtAMCAOAFACEI5gIBAAAAAeoCQAAAAAGcAwEAAAABnQMBAAAAAZ4DAQAAAAGfAwEAAAABoAMBAAAAAaEDAgAAAAEOAQAAkwgAIAQAAJAIACAFAACRCAAg5gIBAAAAAeoCQAAAAAHrAkAAAAABhQMBAAAAAYgDAQAAAAGUAwEAAAAByAMBAAAAAckDAQAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAECAAAABwAgJwAA8QgAIBcKAACnCAAgCwAA_QcAIAwAAP4HACAQAAD_BwAgGAAAgAgAIBkAAIEIACAaAACCCAAg5gIBAAAAAeoCQAAAAAHrAkAAAAABhQMBAAAAAZQDAQAAAAGfAwEAAAABtgMQAAAAAbcDEAAAAAHKAwEAAAABywMBAAAAAcwDAQAAAAHPAwEAAAAB0AMQAAAAAdEDEAAAAAHSAyAAAAAB0wMCAAAAAQIAAAABACAnAADzCAAgCuYCAQAAAAH5AgEAAAABgwMBAAAAAYQDAQAAAAGgAwEAAAABogMBAAAAAaMDQAAAAAGkAwEAAAABpQMBAAAAAaYDAQAAAAECAAAA5QIAICcAAPUIACADAAAAAwAgJwAA8QgAICgAAPkIACAQAAAAAwAgAQAAmQcAIAQAAJoHACAFAACbBwAgIAAA-QgAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhiAMBAK4FACGUAwEArgUAIcgDAQCuBQAhyQMBAK4FACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACEOAQAAmQcAIAQAAJoHACAFAACbBwAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGIAwEArgUAIZQDAQCuBQAhyAMBAK4FACHJAwEArgUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIQMAAAAJACAnAADzCAAgKAAA_AgAIBkAAAAJACAKAACmCAAgCwAAsQcAIAwAALIHACAQAACzBwAgGAAAtAcAIBkAALUHACAaAAC2BwAgIAAA_AgAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhlAMBAK4FACGfAwEArgUAIbYDEADLBQAhtwMQAMwFACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACHPAwEArgUAIdADEADMBQAh0QMQAMwFACHSAyAAugUAIdMDAgDgBQAhFwoAAKYIACALAACxBwAgDAAAsgcAIBAAALMHACAYAAC0BwAgGQAAtQcAIBoAALYHACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIZQDAQCuBQAhnwMBAK4FACG2AxAAywUAIbcDEADMBQAhygMBAK4FACHLAwEArgUAIcwDAQCuBQAhzwMBAK4FACHQAxAAzAUAIdEDEADMBQAh0gMgALoFACHTAwIA4AUAIQMAAADoAgAgJwAA9QgAICgAAP8IACAMAAAA6AIAICAAAP8IACDmAgEAqAUAIfkCAQCuBQAhgwMBAK4FACGEAwEArgUAIaADAQCuBQAhogMBAKgFACGjA0AAqQUAIaQDAQCuBQAhpQMBAK4FACGmAwEArgUAIQrmAgEAqAUAIfkCAQCuBQAhgwMBAK4FACGEAwEArgUAIaADAQCuBQAhogMBAKgFACGjA0AAqQUAIaQDAQCuBQAhpQMBAK4FACGmAwEArgUAIRUNAACVBwAgFAAA5gUAIOYCAQAAAAHqAkAAAAAB6wJAAAAAAfkCAQAAAAGLAwAAALsDApADAQAAAAG5AwEAAAABuwMQAAAAAbwDEAAAAAG9AxAAAAABvgMQAAAAAb8DEAAAAAHAAyAAAAABwQNAAAAAAcIDgAAAAAHDA4AAAAABxAMBAAAAAcYDAAAAxgMCxwMBAAAAAQIAAAAwACAnAACACQAgAwAAAC4AICcAAIAJACAoAACECQAgFwAAAC4AIA0AAJQHACAUAADPBQAgIAAAhAkAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIfkCAQCoBQAhiwMAAMoFuwMikAMBAK4FACG5AwEAqAUAIbsDEADLBQAhvAMQAMsFACG9AxAAzAUAIb4DEADMBQAhvwMQAMwFACHAAyAAugUAIcEDQACvBQAhwgOAAAAAAcMDgAAAAAHEAwEArgUAIcYDAADNBcYDIscDAQCuBQAhFQ0AAJQHACAUAADPBQAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAh-QIBAKgFACGLAwAAygW7AyKQAwEArgUAIbkDAQCoBQAhuwMQAMsFACG8AxAAywUAIb0DEADMBQAhvgMQAMwFACG_AxAAzAUAIcADIAC6BQAhwQNAAK8FACHCA4AAAAABwwOAAAAAAcQDAQCuBQAhxgMAAM0FxgMixwMBAK4FACEH5gIBAAAAAekCQAAAAAHqAkAAAAAB6wJAAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAQ3mAgEAAAAB6gJAAAAAAesCQAAAAAH3AgEAAAAB-AIBAAAAAfoCAQAAAAH7AgEAAAAB_AIBAAAAAf0CQAAAAAH-AkAAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABFwYAAIMIACAKAACnCAAgCwAA_QcAIAwAAP4HACAYAACACAAgGQAAgQgAIBoAAIIIACDmAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABlAMBAAAAAZ8DAQAAAAG2AxAAAAABtwMQAAAAAcoDAQAAAAHLAwEAAAABzAMBAAAAAc8DAQAAAAHQAxAAAAAB0QMQAAAAAdIDIAAAAAHTAwIAAAABAgAAAAEAICcAAIcJACAD5gIBAAAAAeoCQAAAAAGuAwEAAAABDg4AALgGACAPAAC5BgAgEAAAugYAIBYAALwGACDmAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABhgMBAAAAAYcDIAAAAAGIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABAgAAAMkDACAnAACKCQAgAwAAAMwDACAnAACKCQAgKAAAjgkAIBAAAADMAwAgDgAAuwUAIA8AALwFACAQAAC9BQAgFgAAvwUAICAAAI4JACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIYYDAQCoBQAhhwMgALoFACGIAwEArgUAIYkDAQCuBQAhigMBAK4FACGLAwEArgUAIQ4OAAC7BQAgDwAAvAUAIBAAAL0FACAWAAC_BQAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGGAwEAqAUAIYcDIAC6BQAhiAMBAK4FACGJAwEArgUAIYoDAQCuBQAhiwMBAK4FACED5gIBAAAAAeoCQAAAAAH5AgEAAAABAwAAAAkAICcAAIcJACAoAACSCQAgGQAAAAkAIAYAALcHACAKAACmCAAgCwAAsQcAIAwAALIHACAYAAC0BwAgGQAAtQcAIBoAALYHACAgAACSCQAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGUAwEArgUAIZ8DAQCuBQAhtgMQAMsFACG3AxAAzAUAIcoDAQCuBQAhywMBAK4FACHMAwEArgUAIc8DAQCuBQAh0AMQAMwFACHRAxAAzAUAIdIDIAC6BQAh0wMCAOAFACEXBgAAtwcAIAoAAKYIACALAACxBwAgDAAAsgcAIBgAALQHACAZAAC1BwAgGgAAtgcAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhlAMBAK4FACGfAwEArgUAIbYDEADLBQAhtwMQAMwFACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACHPAwEArgUAIdADEADMBQAh0QMQAMwFACHSAyAAugUAIdMDAgDgBQAhCuYCAQAAAAHqAkAAAAAB6wJAAAAAAYsDAAAAswMCngMBAAAAAa8DAgAAAAGwAwEAAAABsQMBAAAAAbMDAQAAAAG0AwIAAAABDgkAAJ0GACALAACeBgAgDQAA-wYAIOYCAQAAAAHqAkAAAAAB6wJAAAAAAfkCAQAAAAGLAwAAALMDAp4DAQAAAAGvAwIAAAABsAMBAAAAAbEDAQAAAAGzAwEAAAABtAMCAAAAAQIAAAAfACAnAACUCQAgAwAAAB0AICcAAJQJACAoAACYCQAgEAAAAB0AIAkAAIIGACALAACDBgAgDQAA-gYAICAAAJgJACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACH5AgEAqAUAIYsDAACABrMDIp4DAQCoBQAhrwMCAOAFACGwAwEArgUAIbEDAQCuBQAhswMBAK4FACG0AwIA4AUAIQ4JAACCBgAgCwAAgwYAIA0AAPoGACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACH5AgEAqAUAIYsDAACABrMDIp4DAQCoBQAhrwMCAOAFACGwAwEArgUAIbEDAQCuBQAhswMBAK4FACG0AwIA4AUAIQPmAgEAAAAB6gJAAAAAAa0DAQAAAAEXBgAAgwgAIAoAAKcIACALAAD9BwAgDAAA_gcAIBAAAP8HACAZAACBCAAgGgAAgggAIOYCAQAAAAHqAkAAAAAB6wJAAAAAAYUDAQAAAAGUAwEAAAABnwMBAAAAAbYDEAAAAAG3AxAAAAABygMBAAAAAcsDAQAAAAHMAwEAAAABzwMBAAAAAdADEAAAAAHRAxAAAAAB0gMgAAAAAdMDAgAAAAECAAAAAQAgJwAAmgkAIAMAAAAJACAnAACaCQAgKAAAngkAIBkAAAAJACAGAAC3BwAgCgAApggAIAsAALEHACAMAACyBwAgEAAAswcAIBkAALUHACAaAAC2BwAgIAAAngkAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhlAMBAK4FACGfAwEArgUAIbYDEADLBQAhtwMQAMwFACHKAwEArgUAIcsDAQCuBQAhzAMBAK4FACHPAwEArgUAIdADEADMBQAh0QMQAMwFACHSAyAAugUAIdMDAgDgBQAhFwYAALcHACAKAACmCAAgCwAAsQcAIAwAALIHACAQAACzBwAgGQAAtQcAIBoAALYHACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIZQDAQCuBQAhnwMBAK4FACG2AxAAywUAIbcDEADMBQAhygMBAK4FACHLAwEArgUAIcwDAQCuBQAhzwMBAK4FACHQAxAAzAUAIdEDEADMBQAh0gMgALoFACHTAwIA4AUAIQfmAgEAAAAB6gJAAAAAAZ4DAQAAAAG1AwIAAAABtgMQAAAAAbcDEAAAAAG4AxAAAAABEuYCAQAAAAHqAkAAAAAB6wJAAAAAAYsDAAAAuwMCkAMBAAAAAbkDAQAAAAG7AxAAAAABvAMQAAAAAb0DEAAAAAG-AxAAAAABvwMQAAAAAcADIAAAAAHBA0AAAAABwgOAAAAAAcMDgAAAAAHEAwEAAAABxgMAAADGAwLHAwEAAAABDg8AALkGACAQAAC6BgAgEgAAuwYAIBYAALwGACDmAgEAAAAB6gJAAAAAAesCQAAAAAGFAwEAAAABhgMBAAAAAYcDIAAAAAGIAwEAAAABiQMBAAAAAYoDAQAAAAGLAwEAAAABAgAAAMkDACAnAAChCQAgAwAAAMwDACAnAAChCQAgKAAApQkAIBAAAADMAwAgDwAAvAUAIBAAAL0FACASAAC-BQAgFgAAvwUAICAAAKUJACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIYYDAQCoBQAhhwMgALoFACGIAwEArgUAIYkDAQCuBQAhigMBAK4FACGLAwEArgUAIQ4PAAC8BQAgEAAAvQUAIBIAAL4FACAWAAC_BQAg5gIBAKgFACHqAkAAqQUAIesCQACpBQAhhQMBAKgFACGGAwEAqAUAIYcDIAC6BQAhiAMBAK4FACGJAwEArgUAIYoDAQCuBQAhiwMBAK4FACEODgAAuAYAIBAAALoGACASAAC7BgAgFgAAvAYAIOYCAQAAAAHqAkAAAAAB6wJAAAAAAYUDAQAAAAGGAwEAAAABhwMgAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAECAAAAyQMAICcAAKYJACADAAAAzAMAICcAAKYJACAoAACqCQAgEAAAAMwDACAOAAC7BQAgEAAAvQUAIBIAAL4FACAWAAC_BQAgIAAAqgkAIOYCAQCoBQAh6gJAAKkFACHrAkAAqQUAIYUDAQCoBQAhhgMBAKgFACGHAyAAugUAIYgDAQCuBQAhiQMBAK4FACGKAwEArgUAIYsDAQCuBQAhDg4AALsFACAQAAC9BQAgEgAAvgUAIBYAAL8FACDmAgEAqAUAIeoCQACpBQAh6wJAAKkFACGFAwEAqAUAIYYDAQCoBQAhhwMgALoFACGIAwEArgUAIYkDAQCuBQAhigMBAK4FACGLAwEArgUAIQkGTgMHABcKBAILGgcMHAgQIAkYRQ8ZSRUaTRYFAQUCBAgCBQsBBg8DBwAGAwgABAkSAQoTAgIGEAMHAAUBBhEAAwQUAAUVAAYWAAEJAAEBCQABBQcAFAkAAQtBEw0AChdCDQYHABIOJAsPKAwQKQkSLQ0WMQ4BDQAKAQ0ACgINAAoRAAkEBwARDQAKFDUPFTcQAgkAARMADgETAA4BFDgABQ45AA86ABA7ABI8ABY9AAERAAkCC0MAF0QAAQkAAQEJAAEGBlQAC08AEFAAGFEAGVIAGlMAAAEKXgIBCmQCBQcAHC0AHS4AHi8AHzAAIAAAAAAABQcAHC0AHS4AHi8AHzAAIAEJAAEBCQABBQcAJS0AJi4AJy8AKDAAKQAAAAAABQcAJS0AJi4AJy8AKDAAKQEJAAEBCQABAwcALi8ALzAAMAAAAAMHAC4vAC8wADABAaQBAgEBqgECAwcANS8ANjAANwAAAAMHADUvADYwADcBDQAKAQ0ACgUHADwtAD0uAD4vAD8wAEAAAAAAAAUHADwtAD0uAD4vAD8wAEACCQABEwAOAgkAARMADgUHAEUtAEYuAEcvAEgwAEkAAAAAAAUHAEUtAEYuAEcvAEgwAEkBCQABAQkAAQUHAE4tAE8uAFAvAFEwAFIAAAAAAAUHAE4tAE8uAFAvAFEwAFIBCQABAQkAAQMHAFcvAFgwAFkAAAADBwBXLwBYMABZAgkAAQ0ACgIJAAENAAoFBwBeLQBfLgBgLwBhMABiAAAAAAAFBwBeLQBfLgBgLwBhMABiAREACQERAAkDBwBnLwBoMABpAAAAAwcAZy8AaDAAaQINAAoRAAkCDQAKEQAJAwcAbi8AbzAAcAAAAAMHAG4vAG8wAHAAAAADBwB2LwB3MAB4AAAAAwcAdi8AdzAAeAAAAwcAfS8AfjAAfwAAAAMHAH0vAH4wAH8DCAAECYgDAQqJAwIDCAAECY8DAQqQAwIFBwCEAS0AhQEuAIYBLwCHATAAiAEAAAAAAAUHAIQBLQCFAS4AhgEvAIcBMACIAQAAAAMHAI4BLwCPATAAkAEAAAADBwCOAS8AjwEwAJABARMADgETAA4DBwCVAS8AlgEwAJcBAAAAAwcAlQEvAJYBMACXAQAAAwcAnAEvAJ0BMACeAQAAAAMHAJwBLwCdATAAngEBDQAKAQ0ACgMHAKMBLwCkATAApQEAAAADBwCjAS8ApAEwAKUBAQ0ACgENAAoDBwCqAS8AqwEwAKwBAAAAAwcAqgEvAKsBMACsAQAAAAMHALIBLwCzATAAtAEAAAADBwCyAS8AswEwALQBGwIBHFUBHVYBHlcBH1gBIVoBIlwYI10ZJGABJWIYJmMaKWUBKmYBK2cYMWobMmshM2wHNG0HNW4HNm8HN3AHOHIHOXQYOnUiO3cHPHkYPXojPnsHP3wHQH0YQYABJEKBASpDgwEIRIQBCEWGAQhGhwEIR4gBCEiKAQhJjAEYSo0BK0uPAQhMkQEYTZIBLE6TAQhPlAEIUJUBGFGYAS1SmQExU5oBAlSbAQJVnAECVp0BAleeAQJYoAECWaIBGFqjATJbpgECXKgBGF2pATNeqwECX6wBAmCtARhhsAE0YrEBOGOyAQ5kswEOZbQBDma1AQ5ntgEOaLgBDmm6ARhquwE5a70BDmy_ARhtwAE6bsEBDm_CAQ5wwwEYccYBO3LHAUFzyAEPdMkBD3XKAQ92ywEPd8wBD3jOAQ950AEYetEBQnvTAQ981QEYfdYBQ37XAQ9_2AEPgAHZARiBAdwBRIIB3QFKgwHeARWEAd8BFYUB4AEVhgHhARWHAeIBFYgB5AEViQHmARiKAecBS4sB6QEVjAHrARiNAewBTI4B7QEVjwHuARWQAe8BGJEB8gFNkgHzAVOTAfQBFpQB9QEWlQH2ARaWAfcBFpcB-AEWmAH6ARaZAfwBGJoB_QFUmwH_ARacAYECGJ0BggJVngGDAhafAYQCFqABhQIYoQGIAlaiAYkCWqMBigIJpAGLAgmlAYwCCaYBjQIJpwGOAgmoAZACCakBkgIYqgGTAlurAZUCCawBlwIYrQGYAlyuAZkCCa8BmgIJsAGbAhixAZ4CXbIBnwJjswGgAhO0AaECE7UBogITtgGjAhO3AaQCE7gBpgITuQGoAhi6AakCZLsBqwITvAGtAhi9Aa4CZb4BrwITvwGwAhPAAbECGMEBtAJmwgG1AmrDAbYCDcQBtwINxQG4Ag3GAbkCDccBugINyAG8Ag3JAb4CGMoBvwJrywHBAg3MAcMCGM0BxAJszgHFAg3PAcYCDdABxwIY0QHKAm3SAcsCcdMBzQJy1AHOAnLVAdECctYB0gJy1wHTAnLYAdUCctkB1wIY2gHYAnPbAdoCctwB3AIY3QHdAnTeAd4Cct8B3wJy4AHgAhjhAeMCdeIB5AJ54wHmAgTkAecCBOUB6gIE5gHrAgTnAewCBOgB7gIE6QHwAhjqAfECeusB8wIE7AH1AhjtAfYCe-4B9wIE7wH4AgTwAfkCGPEB_AJ88gH9AoAB8wH-AgP0Af8CA_UBgAMD9gGBAwP3AYIDA_gBhAMD-QGGAxj6AYcDgQH7AYsDA_wBjQMY_QGOA4IB_gGRAwP_AZIDA4ACkwMYgQKWA4MBggKXA4kBgwKZA4oBhAKaA4oBhQKdA4oBhgKeA4oBhwKfA4oBiAKhA4oBiQKjAxiKAqQDiwGLAqYDigGMAqgDGI0CqQOMAY4CqgOKAY8CqwOKAZACrAMYkQKvA40BkgKwA5EBkwKyAxCUArMDEJUCtQMQlgK2AxCXArcDEJgCuQMQmQK7AxiaArwDkgGbAr4DEJwCwAMYnQLBA5MBngLCAxCfAsMDEKACxAMYoQLHA5QBogLIA5gBowLKAwqkAssDCqUCzgMKpgLPAwqnAtADCqgC0gMKqQLUAxiqAtUDmQGrAtcDCqwC2QMYrQLaA5oBrgLbAwqvAtwDCrAC3QMYsQLgA5sBsgLhA58BswLiAwu0AuMDC7UC5AMLtgLlAwu3AuYDC7gC6AMLuQLqAxi6AusDoAG7Au0DC7wC7wMYvQLwA6EBvgLxAwu_AvIDC8AC8wMYwQL2A6IBwgL3A6YBwwL4AwzEAvkDDMUC-gMMxgL7AwzHAvwDDMgC_gMMyQKABBjKAoEEpwHLAoMEDMwChQQYzQKGBKgBzgKHBAzPAogEDNACiQQY0QKMBKkB0gKNBK0B0wKPBK4B1AKQBK4B1QKTBK4B1gKUBK4B1wKVBK4B2AKXBK4B2QKZBBjaApoErwHbApwErgHcAp4EGN0CnwSwAd4CoASuAd8CoQSuAeACogQY4QKlBLEB4gKmBLUB"
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
var getProductById = async (id) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { seo: { slug: id } }
        ]
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
        }
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
        }
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
  const slug = seo?.slug || slugify(productData.name, { lower: true, strict: true });
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
    discountPrice = Number(productData.price) * (1 - productData.discount / 100);
  }
  return prisma.$transaction(async (tx) => {
    const createData = {
      name: productData.name,
      price: productData.price
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
    if (seo) {
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
      if (existingProduct.seo) {
        const seoUpdateData = { slug };
        if (seo.metaTitle !== void 0) seoUpdateData.metaTitle = seo.metaTitle;
        if (seo.metaDescription !== void 0) seoUpdateData.metaDescription = seo.metaDescription;
        if (seo.metaKeywords !== void 0) seoUpdateData.metaKeywords = seo.metaKeywords;
        await tx.productSEO.update({
          where: { id: existingProduct.seo.id },
          data: seoUpdateData
        });
      } else {
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
    if (!data || !data.name) {
      console.log("Validation failed: name is missing");
      throw new AppError(400, "Name and price are required");
    }
    if (data.price === void 0 || data.price === null) {
      console.log("Validation failed: price is missing");
      throw new AppError(400, "Name and price are required");
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
    const existingProduct = await productService.getProductById(id);
    if (!existingProduct) {
      throw new AppError(404, "Product not found");
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
        categoryId
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
      where: { categoryId }
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
      price: true,
      inStock: true,
      stockQuantity: true
    }
  });
  if (!product) {
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
  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(item.product.price);
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
        price: item.product.price.toString(),
        total: (Number(item.product.price) * item.quantity).toFixed(2)
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
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.js.map
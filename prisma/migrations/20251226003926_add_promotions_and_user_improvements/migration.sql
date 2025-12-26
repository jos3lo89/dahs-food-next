-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('DISCOUNT', 'PACK', 'DAY_SPECIAL', 'WEEK_DEAL');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "promotionCode" TEXT;

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "type" "PromotionType" NOT NULL DEFAULT 'DISCOUNT';

-- CreateTable
CREATE TABLE "PromotionProduct" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "discountPrice" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionPack" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "items" JSONB NOT NULL,
    "originalPrice" DECIMAL(10,2) NOT NULL,
    "packPrice" DECIMAL(10,2) NOT NULL,
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionPack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromotionProduct_promotionId_idx" ON "PromotionProduct"("promotionId");

-- CreateIndex
CREATE INDEX "PromotionProduct_productId_idx" ON "PromotionProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionProduct_promotionId_productId_key" ON "PromotionProduct"("promotionId", "productId");

-- CreateIndex
CREATE INDEX "PromotionPack_promotionId_idx" ON "PromotionPack"("promotionId");

-- CreateIndex
CREATE INDEX "PromotionPack_active_idx" ON "PromotionPack"("active");

-- CreateIndex
CREATE INDEX "Category_active_idx" ON "Category"("active");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Product_featured_idx" ON "Product"("featured");

-- CreateIndex
CREATE INDEX "Promotion_active_idx" ON "Promotion"("active");

-- CreateIndex
CREATE INDEX "Promotion_featured_idx" ON "Promotion"("featured");

-- CreateIndex
CREATE INDEX "Promotion_startDate_endDate_idx" ON "Promotion"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionPack" ADD CONSTRAINT "PromotionPack_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

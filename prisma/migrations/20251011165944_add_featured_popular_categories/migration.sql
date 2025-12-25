-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Category_isPopular_idx" ON "public"."Category"("isPopular");

-- CreateIndex
CREATE INDEX "Category_isFeatured_idx" ON "public"."Category"("isFeatured");

-- CreateIndex
CREATE INDEX "Product_isFeatured_idx" ON "public"."Product"("isFeatured");

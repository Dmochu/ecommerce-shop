-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRecommended" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Product_isPopular_idx" ON "public"."Product"("isPopular");

-- CreateIndex
CREATE INDEX "Product_isRecommended_idx" ON "public"."Product"("isRecommended");

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "guestAddress" TEXT,
ADD COLUMN     "guestCity" TEXT,
ADD COLUMN     "guestCountry" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ADD COLUMN     "guestPostalCode" TEXT,
ADD COLUMN     "invoiceData" TEXT,
ADD COLUMN     "wantsInvoice" BOOLEAN NOT NULL DEFAULT false;

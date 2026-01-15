-- CreateEnum
CREATE TYPE "PaymentVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "outForDeliveryAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentVerificationStatus" DEFAULT 'PENDING',
ADD COLUMN     "paymentVerificationNotes" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBy" TEXT;

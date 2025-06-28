-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_interest_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "interest_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "Interest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

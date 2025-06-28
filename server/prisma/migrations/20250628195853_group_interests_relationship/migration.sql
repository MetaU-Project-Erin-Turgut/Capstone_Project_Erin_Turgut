/*
  Warnings:

  - Added the required column `central_location` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interest_id` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "central_location" TEXT NOT NULL,
ADD COLUMN     "interest_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

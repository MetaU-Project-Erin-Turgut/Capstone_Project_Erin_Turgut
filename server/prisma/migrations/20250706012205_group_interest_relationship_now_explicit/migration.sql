/*
  Warnings:

  - You are about to drop the `_GroupToInterest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupToInterest" DROP CONSTRAINT "_GroupToInterest_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToInterest" DROP CONSTRAINT "_GroupToInterest_B_fkey";

-- DropTable
DROP TABLE "_GroupToInterest";

-- CreateTable
CREATE TABLE "Group_Interest" (
    "group_id" INTEGER NOT NULL,
    "interest_id" INTEGER NOT NULL,

    CONSTRAINT "Group_Interest_pkey" PRIMARY KEY ("group_id","interest_id")
);

-- AddForeignKey
ALTER TABLE "Group_Interest" ADD CONSTRAINT "Group_Interest_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_Interest" ADD CONSTRAINT "Group_Interest_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

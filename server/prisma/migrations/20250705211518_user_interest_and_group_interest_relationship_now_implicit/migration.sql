/*
  Warnings:

  - You are about to drop the `Group_Interest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Interest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group_Interest" DROP CONSTRAINT "Group_Interest_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_Interest" DROP CONSTRAINT "Group_Interest_interest_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Interest" DROP CONSTRAINT "User_Interest_interest_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Interest" DROP CONSTRAINT "User_Interest_user_id_fkey";

-- DropTable
DROP TABLE "Group_Interest";

-- DropTable
DROP TABLE "User_Interest";

-- CreateTable
CREATE TABLE "_GroupToInterest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupToInterest_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_InterestToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_InterestToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GroupToInterest_B_index" ON "_GroupToInterest"("B");

-- CreateIndex
CREATE INDEX "_InterestToUser_B_index" ON "_InterestToUser"("B");

-- AddForeignKey
ALTER TABLE "_GroupToInterest" ADD CONSTRAINT "_GroupToInterest_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToInterest" ADD CONSTRAINT "_GroupToInterest_B_fkey" FOREIGN KEY ("B") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestToUser" ADD CONSTRAINT "_InterestToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestToUser" ADD CONSTRAINT "_InterestToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

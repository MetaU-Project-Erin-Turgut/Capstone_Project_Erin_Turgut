/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `User_Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `User_Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_Profile" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_Profile_user_id_key" ON "User_Profile"("user_id");

-- AddForeignKey
ALTER TABLE "User_Profile" ADD CONSTRAINT "User_Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `central_location` on the `Group` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "latitude" DECIMAL(8,5) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(8,5) NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "central_location",
ADD COLUMN     "latitude" DECIMAL(8,5) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(8,5) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "latitude" DECIMAL(8,5) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(8,5) NOT NULL;

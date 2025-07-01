/*
  Warnings:

  - Added the required column `latitude` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "latitude" DECIMAL(8,5) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(8,5) NOT NULL;

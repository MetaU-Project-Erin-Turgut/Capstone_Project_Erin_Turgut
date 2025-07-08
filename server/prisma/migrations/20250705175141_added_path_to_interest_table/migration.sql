/*
  Warnings:

  - Added the required column `path` to the `Interest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interest" ADD COLUMN     "path" TEXT NOT NULL;

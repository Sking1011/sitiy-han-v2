/*
  Warnings:

  - Added the required column `targetInfo` to the `BatchMerge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BatchMerge" ADD COLUMN     "targetInfo" TEXT NOT NULL;

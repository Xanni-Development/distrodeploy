/*
  Warnings:

  - Added the required column `operatingSystem` to the `VirtualMachine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VirtualMachine` ADD COLUMN `operatingSystem` VARCHAR(255) NOT NULL;

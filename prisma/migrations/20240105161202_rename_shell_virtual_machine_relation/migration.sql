/*
  Warnings:

  - You are about to drop the column `vmID` on the `VMShell` table. All the data in the column will be lost.
  - Added the required column `virtualMachineID` to the `VMShell` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `VMShell` DROP FOREIGN KEY `VMShell_vmID_fkey`;

-- AlterTable
ALTER TABLE `VMShell` DROP COLUMN `vmID`,
    ADD COLUMN `virtualMachineID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `VMShell` ADD CONSTRAINT `VMShell_virtualMachineID_fkey` FOREIGN KEY (`virtualMachineID`) REFERENCES `VirtualMachine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

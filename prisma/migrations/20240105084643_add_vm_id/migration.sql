/*
  Warnings:

  - You are about to drop the column `shell_id` on the `VMShell` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shellID]` on the table `VMShell` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vmID]` on the table `VirtualMachine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shellID` to the `VMShell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vmID` to the `VirtualMachine` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `shell_id` ON `VMShell`;

-- AlterTable
ALTER TABLE `VMShell` DROP COLUMN `shell_id`,
    ADD COLUMN `shellID` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `VirtualMachine` ADD COLUMN `vmID` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `VMShell_shellID_key` ON `VMShell`(`shellID`);

-- CreateIndex
CREATE UNIQUE INDEX `VirtualMachine_vmID_key` ON `VirtualMachine`(`vmID`);

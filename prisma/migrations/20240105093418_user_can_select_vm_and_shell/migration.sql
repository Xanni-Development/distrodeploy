-- AlterTable
ALTER TABLE `User` ADD COLUMN `selectedShellID` INTEGER NULL,
    ADD COLUMN `selectedVMID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_selectedVMID_fkey` FOREIGN KEY (`selectedVMID`) REFERENCES `VirtualMachine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_selectedShellID_fkey` FOREIGN KEY (`selectedShellID`) REFERENCES `VMShell`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

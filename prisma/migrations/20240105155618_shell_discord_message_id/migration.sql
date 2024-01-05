/*
  Warnings:

  - Added the required column `discordMessageChannelID` to the `VMShell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordMessageID` to the `VMShell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VMShell` ADD COLUMN `discordMessageChannelID` VARCHAR(255) NOT NULL,
    ADD COLUMN `discordMessageID` VARCHAR(255) NOT NULL;

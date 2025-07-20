/*
  Warnings:

  - You are about to drop the column `area` on the `projetos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `projetos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipo` to the `projetos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `projetos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `projetos` DROP COLUMN `area`,
    ADD COLUMN `tipo` ENUM('PESQUISA', 'ENSINO', 'EXTENSAO') NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `projetos_url_key` ON `projetos`(`url`);

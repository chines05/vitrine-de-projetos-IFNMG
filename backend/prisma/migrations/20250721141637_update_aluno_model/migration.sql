/*
  Warnings:

  - You are about to drop the column `campus` on the `alunos` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `alunos` table. All the data in the column will be lost.
  - You are about to drop the column `matricula` on the `alunos` table. All the data in the column will be lost.
  - Added the required column `turma` to the `alunos` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `alunos_email_key` ON `alunos`;

-- DropIndex
DROP INDEX `alunos_matricula_key` ON `alunos`;

-- AlterTable
ALTER TABLE `alunos` DROP COLUMN `campus`,
    DROP COLUMN `email`,
    DROP COLUMN `matricula`,
    ADD COLUMN `turma` VARCHAR(191) NOT NULL;

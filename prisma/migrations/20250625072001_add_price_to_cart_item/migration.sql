/*
  Warnings:

  - You are about to drop the column `price` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

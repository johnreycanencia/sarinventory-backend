/*
  Warnings:

  - You are about to drop the column `total` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `total_cost` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_profit` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_revenue` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_cost` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_profit` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_revenue` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_items" ADD COLUMN     "total_cost" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "total_profit" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "total_revenue" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "total",
ADD COLUMN     "total_cost" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "total_profit" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "total_revenue" DECIMAL(10,2) NOT NULL;

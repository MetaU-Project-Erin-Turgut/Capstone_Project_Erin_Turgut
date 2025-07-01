-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Interest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_full" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group_User" (
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Group_User_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "Group_Event" (
    "group_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "Group_Event_pkey" PRIMARY KEY ("group_id","event_id")
);

-- AddForeignKey
ALTER TABLE "Group_User" ADD CONSTRAINT "Group_User_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_User" ADD CONSTRAINT "Group_User_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_Event" ADD CONSTRAINT "Group_Event_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_Event" ADD CONSTRAINT "Group_Event_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

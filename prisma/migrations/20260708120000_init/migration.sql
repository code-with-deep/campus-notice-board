-- CreateTable
CREATE TABLE `Notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `category` ENUM('Exam', 'Event', 'General') NOT NULL,
    `priority` ENUM('Normal', 'Urgent') NOT NULL DEFAULT 'Normal',
    `publishDate` DATETIME(3) NOT NULL,
    `image` VARCHAR(2048) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notice_priority_publishDate_idx`(`priority`, `publishDate`),
    INDEX `Notice_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

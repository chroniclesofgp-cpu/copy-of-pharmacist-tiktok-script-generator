CREATE TABLE `productVault` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productUrl` text,
	`category` varchar(100),
	`verdict` varchar(20) NOT NULL,
	`ingredientsAnalysis` text,
	`doseFlags` text,
	`redFlags` text,
	`betterAlternatives` text,
	`talkingPoints` text,
	`hookRecommendation` varchar(100),
	`affiliateLink` text,
	`userNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productVault_id` PRIMARY KEY(`id`)
);

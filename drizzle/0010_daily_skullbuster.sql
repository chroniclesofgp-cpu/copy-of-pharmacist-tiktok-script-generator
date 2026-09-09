CREATE TABLE `radarCandidates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`importId` int,
	`provider` varchar(40) NOT NULL,
	`externalProductId` varchar(180),
	`productName` varchar(255) NOT NULL,
	`category` varchar(120),
	`productUrl` text,
	`productAgeDays` int,
	`rawDataJson` text NOT NULL,
	`metricsJson` text NOT NULL,
	`confidenceNotes` text,
	`creatorFitJson` text,
	`aiBriefJson` text,
	`reviewStatus` varchar(40) NOT NULL DEFAULT 'candidate',
	`handoffStatus` varchar(40) NOT NULL DEFAULT 'not_ready',
	`evidenceGateStatus` varchar(40) NOT NULL DEFAULT 'not_reviewed',
	`reviewNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `radarCandidates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `radarDailySales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`candidateId` int NOT NULL,
	`salesDate` varchar(20) NOT NULL,
	`units` int NOT NULL DEFAULT 0,
	`rawDataJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `radarDailySales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `radarImports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` varchar(40) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`rowCount` int NOT NULL DEFAULT 0,
	`validRowCount` int NOT NULL DEFAULT 0,
	`errorJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `radarImports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `radarProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`configJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `radarProfiles_id` PRIMARY KEY(`id`)
);

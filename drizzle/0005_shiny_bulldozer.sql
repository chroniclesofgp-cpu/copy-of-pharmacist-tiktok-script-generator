CREATE TABLE `metricsAnalyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`hookId` varchar(100),
	`hookName` varchar(255),
	`metricsJson` text NOT NULL,
	`interpretationJson` text NOT NULL,
	`videoAnalysisId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metricsAnalyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videoAnalyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`hookId` varchar(100) NOT NULL,
	`hookName` varchar(255),
	`videoUrl` text NOT NULL,
	`referenceVideoUrl` text,
	`referenceCreator` varchar(100),
	`referenceViews` varchar(50),
	`transcription` text,
	`analysisJson` text NOT NULL,
	`savedScriptId` int,
	`productName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `videoAnalyses_id` PRIMARY KEY(`id`)
);

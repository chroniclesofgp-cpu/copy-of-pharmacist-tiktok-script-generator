CREATE TABLE `scheduledVideoReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runDate` varchar(20) NOT NULL,
	`videosFound` int DEFAULT 0,
	`videosAnalyzed` int DEFAULT 0,
	`reportJson` text NOT NULL,
	`status` varchar(20) DEFAULT 'complete',
	`errorMessage` text,
	`scheduleCronTaskUid` varchar(65),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scheduledVideoReports_id` PRIMARY KEY(`id`)
);

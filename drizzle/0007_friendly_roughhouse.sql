CREATE TABLE `scriptFilmed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scriptKey` varchar(100) NOT NULL,
	`filmedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scriptFilmed_id` PRIMARY KEY(`id`),
	CONSTRAINT `scriptFilmed_scriptKey_unique` UNIQUE(`scriptKey`)
);

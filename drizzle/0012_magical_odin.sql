ALTER TABLE `radarCandidates` ADD `queueState` varchar(20) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `radarCandidates` ADD `queueReason` text;--> statement-breakpoint
ALTER TABLE `radarCandidates` ADD `archivedAt` timestamp;

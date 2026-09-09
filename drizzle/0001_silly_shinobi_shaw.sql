CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`keyBenefit` varchar(500),
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedScripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int,
	`productName` varchar(255) NOT NULL,
	`hookId` varchar(100) NOT NULL,
	`hookName` varchar(255) NOT NULL,
	`fullScript` text NOT NULL,
	`textHook` text,
	`verbalHook` text,
	`dealReveal` text,
	`howTo` text,
	`urgencyClose` text,
	`creatorVoice` varchar(50) DEFAULT 'hybrid',
	`format` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedScripts_id` PRIMARY KEY(`id`)
);

CREATE TABLE `hourly_continuation_cycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cycle_key` varchar(128) NOT NULL,
	`cycle_number` int NOT NULL,
	`max_cycles` int NOT NULL DEFAULT 2400,
	`status` varchar(32) NOT NULL,
	`action` varchar(160) NOT NULL,
	`signals_recorded` int NOT NULL DEFAULT 0,
	`recovery_queue` text,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hourly_continuation_cycles_id` PRIMARY KEY(`id`),
	CONSTRAINT `hourly_continuation_cycle_key_unique` UNIQUE(`cycle_key`)
);
--> statement-breakpoint
CREATE INDEX `hourly_continuation_cycle_number_idx` ON `hourly_continuation_cycles` (`cycle_number`);--> statement-breakpoint
CREATE INDEX `hourly_continuation_completed_at_idx` ON `hourly_continuation_cycles` (`completed_at`);
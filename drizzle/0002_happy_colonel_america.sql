CREATE TABLE `workflow_signal_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`signal_key` varchar(160) NOT NULL,
	`repository` varchar(128) NOT NULL,
	`workflow_name` varchar(160) NOT NULL,
	`run_id` varchar(32) NOT NULL,
	`event` varchar(48) NOT NULL,
	`status` varchar(32) NOT NULL,
	`conclusion` varchar(32),
	`classification` varchar(32) NOT NULL,
	`run_url` varchar(512) NOT NULL,
	`observed_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflow_signal_snapshots_id` PRIMARY KEY(`id`),
	CONSTRAINT `workflow_signal_key_unique` UNIQUE(`signal_key`)
);
--> statement-breakpoint
CREATE INDEX `workflow_signal_observed_idx` ON `workflow_signal_snapshots` (`observed_at`);--> statement-breakpoint
CREATE INDEX `workflow_signal_classification_idx` ON `workflow_signal_snapshots` (`classification`);
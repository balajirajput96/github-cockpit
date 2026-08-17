CREATE TABLE `cockpit_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evidence_key` varchar(96) NOT NULL,
	`schedule_cron_task_uid` varchar(65),
	`status` varchar(32) NOT NULL DEFAULT 'pending',
	`source` varchar(96) NOT NULL,
	`last_recorded_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cockpit_evidence_id` PRIMARY KEY(`id`),
	CONSTRAINT `cockpit_evidence_key_unique` UNIQUE(`evidence_key`)
);
--> statement-breakpoint
CREATE TABLE `cockpit_review_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`review_key` varchar(96) NOT NULL,
	`decision` varchar(48) NOT NULL,
	`note` text NOT NULL,
	`owner_open_id` varchar(64) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cockpit_review_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `cockpit_evidence_task_idx` ON `cockpit_evidence` (`schedule_cron_task_uid`);--> statement-breakpoint
CREATE INDEX `cockpit_review_key_idx` ON `cockpit_review_records` (`review_key`);
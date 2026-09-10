CREATE TABLE `sync_operations` (
	`id` text NOT NULL,
	`user_id` text NOT NULL,
	`payload` text NOT NULL,
	`applied_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sync_operations_user_id` ON `sync_operations` (`user_id`,`id`);
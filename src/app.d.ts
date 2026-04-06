declare global {
	namespace App {
		interface Locals {
			user: { id: number; email: string; name: string } | null;
			adminAuthed: boolean;
			partner: import('$lib/server/db').Partner | null;
		}
	}
}

export {};

import { SUPER_ADMIN } from "@/lib/invitation/constants";
import type { AdminUser } from "@/types/invitation";

/** Guarantees the built-in super admin always exists in the account list. */
export function ensureSuperAdmin(users: AdminUser[]): AdminUser[] {
  if (!Array.isArray(users) || users.length === 0) return [SUPER_ADMIN];
  const hasSuper = users.some((u) => u.email.toLowerCase() === SUPER_ADMIN.email.toLowerCase());
  return hasSuper ? users : [SUPER_ADMIN, ...users];
}

/** Matches an account by email or username alias. */
export function findAdmin(users: AdminUser[], identifier: string) {
  const input = identifier.trim().toLowerCase();
  return users.find(
    (u) =>
      u.email.toLowerCase() === input ||
      (u.alias && u.alias.toLowerCase() === input) ||
      (input === "grandpanca" && u.email.toLowerCase() === SUPER_ADMIN.email.toLowerCase()),
  );
}

/** Personal invitation link that prefills the guest name. */
export function buildVipLink(name: string, phone?: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const params = new URLSearchParams();
  params.set("to", name);
  if (phone && phone !== "-") {
    params.set("phone", phone);
  }
  return `${origin}/?${params.toString()}`;
}

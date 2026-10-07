import { AdminApp } from "@/components/admin/admin-app"

// The admin control panel has its own email + password sign-in and is
// intentionally NOT wrapped in the Pi sign-in gate — it is a separate
// system for the two people running the game, not a Pi player screen.
export default function AdminPage() {
  return <AdminApp />
}

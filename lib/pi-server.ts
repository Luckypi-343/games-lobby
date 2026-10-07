// Server-side verification of a Pi Network user's identity. Any server
// route that trusts a client-supplied uid (per-user storage, exchange
// crediting, admin login) MUST call this first and check the returned uid
// matches — never trust a uid sent by the client on its own, since that
// would let one player read or overwrite another player's data.
export type VerifiedPiUser = { uid: string; username: string }

export async function verifyPiToken(accessToken: string): Promise<VerifiedPiUser | null> {
  if (!accessToken) return null
  try {
    const res = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data?.uid) return null
    return { uid: String(data.uid), username: String(data.username ?? "") }
  } catch (err) {
    console.log("[v0] verifyPiToken error:", err)
    return null
  }
}

export function isAdminUsername(username: string): boolean {
  const list = (process.env.ADMIN_PI_USERNAMES ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return list.includes(username.trim().toLowerCase())
}

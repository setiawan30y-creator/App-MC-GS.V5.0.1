/** MC-App-Almara V5.0.1 — Security foundation
 * Authentication/session/permission implementation is introduced incrementally.
 * No hard-coded production credentials belong in this file.
 */

function securityReady() {
  return { authentication: false, session: false, permissions: false, phase: 2 };
}

function requireAuthenticated_() {
  throw new Error('Authentication belum diaktifkan. Selesaikan PHASE 2 Security.');
}

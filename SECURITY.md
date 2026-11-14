# Security

Report vulnerabilities privately in the Discord server (https://discord.gg/Zk5CrhHYe) by opening a ticket.

Design notes:
- The server is the only authority: permission (ACE or job), type enabled, parameter sanitising, duration/intensity clamps, opt-out, concurrency limit and rate limits are all checked server-side. The panel (NUI) and the commands share the same checks.
- A client can only report on ITS OWN sessions: ended, reply, choice, resist, appearance data. Resist results are checked for minimum play time and cooldown. Camera packets are accepted only from the session's controller.
- Hallucinations are damage-safe by design (see CONTRIBUTING.md). The resource has no telemetry, no remote code loading and no hidden commands.
- Honest limit: a hallucination is client-side drawing. A modified client can ignore effects on itself; that only affects that player's own screen.

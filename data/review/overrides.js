// Manual provenance review overrides.
//
// Keep this file separate from normalized parser output so later attribution
// decisions never rewrite the original corpus or erase the parser's evidence.
// Keys are durable normalized record IDs. Values must include a
// `provenance_type` and may include a human-readable `note` and `updated_at`.
//
// Example (do not uncomment without evidence):
// window.RELIGION_KNOWLEDGE_OVERRIDES = {
//   "rk_example": {
//     provenance_type: "MY_WORDS",
//     note: "Confirmed from the original conversation role export.",
//     updated_at: "2026-08-07T00:00:00.000Z"
//   }
// };

window.RELIGION_KNOWLEDGE_OVERRIDES = {};

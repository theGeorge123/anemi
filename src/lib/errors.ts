export const ERR = {
  INVALID_INPUT: "INVALID_INPUT",
  RATE_LIMIT: "RATE_LIMIT",
  INVITE_EXISTS: "INVITE_EXISTS",
  INTERNAL: "INTERNAL"
} as const;

export type ErrorCode = typeof ERR[keyof typeof ERR];

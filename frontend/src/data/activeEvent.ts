// Change this single string to instantly update the featured upcoming event across the entire website!
// Valid options: "COFFEEHOUSE", "UTHSDC", "DESIGNAPALOOZA", "PREFROSH", or "NONE"
// Set to "NONE" during off-season (e.g. summer) when there are no upcoming events scheduled.
export type ActiveEventId =
  | "COFFEEHOUSE"
  | "UTHSDC"
  | "DESIGNAPALOOZA"
  | "PREFROSH"
  | "NONE";

export const ACTIVE_EVENT_ID: ActiveEventId | string = "DESIGNAPALOOZA";

/**
 * Helper to determine whether a given event is currently the active/upcoming event.
 * Returns false if ACTIVE_EVENT_ID is "NONE" or does not match.
 */
export const isEventActive = (eventId: string): boolean => {
  const current = (ACTIVE_EVENT_ID || "").trim().toUpperCase();
  if (!current || current === "NONE") return false;
  return current === eventId.trim().toUpperCase();
};


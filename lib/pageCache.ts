// Shared ISR window for Airtable-backed pages. 5 minutes so admin approvals and the daily scrape
// shows up without a deploy, without putting Airtable on the hot path.
export const PAGE_REVALIDATE = 300;

/**
 * utils/filterFeedback.js
 *
 * Encapsulates the logic for searching and filtering feedback entries.
 * Kept separate from UI components for testability and reusability.
 */

/**
 * Filters an array of feedback entries based on a search query and date range.
 *
 * @param {Array}  feedbacks   - The raw list of feedback objects
 * @param {string} searchQuery - Case-insensitive text to match against name, email, or message
 * @param {string} dateFilter  - 'all' | 'today' | 'week' | 'month'
 * @returns {Array} A new filtered array
 */
export function filterFeedbacks(feedbacks = [], searchQuery = '', dateFilter = 'all') {
  const query = searchQuery.trim().toLowerCase();
  const now = new Date();

  return feedbacks.filter((item) => {
    // 1. Search text filter
    let matchesSearch = true;
    if (query) {
      matchesSearch =
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.email && item.email.toLowerCase().includes(query)) ||
        (item.message && item.message.toLowerCase().includes(query));
    }

    if (!matchesSearch) return false;

    // 2. Date range filter
    if (dateFilter === 'all') return true;

    const itemDate = new Date(item.createdAt);

    if (dateFilter === 'today') {
      return itemDate.toDateString() === now.toDateString();
    }

    if (dateFilter === 'week') {
      // Last 7 days
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return itemDate >= weekAgo;
    }

    if (dateFilter === 'month') {
      // Last 30 days
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      return itemDate >= monthAgo;
    }

    return true;
  });
}

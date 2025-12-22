/**
 * Separates the list page item from regular navigation items
 * @param {Array} items - Array of navigation items
 * @returns {Object} Object with mainItems (regular items) and listPageItem (the list page, if any)
 */
function separateListPage(items) {
  if (!Array.isArray(items)) return { mainItems: items || [], listPageItem: null };

  const listPageItems = items.filter(item => item?.data?.list === true);
  const listPageItem = listPageItems.length > 0 ? listPageItems[0] : null;
  const mainItems = items.filter(item => item?.data?.list !== true);

  return { mainItems, listPageItem };
}

/**
 * Truncates items list to the specified limit
 * @param {Array} items - Array of navigation items
 * @param {number} limit - Maximum number of items to show
 * @returns {Array} Truncated array of items
 */
function truncateItems(items, limit) {
  if (!Array.isArray(items) || !limit || limit >= items.length) {
    return items || [];
  }

  return items.slice(0, limit);
}

/**
 * Ensures the active item is visible in the truncated list
 * @param {Array} items - Full array of navigation items
 * @param {number} limit - Maximum number of items to show
 * @param {string} currentUrl - URL of the current page
 * @returns {Array} Truncated array with active item guaranteed to be visible
 */
function ensureActiveItemVisible(items, limit, currentUrl) {
  if (!Array.isArray(items) || !limit || limit >= items.length) {
    return items || [];
  }

  const activeItem = items.find(item => item?.url === currentUrl);

  if (!activeItem) {e
    return truncateItems(items, limit);
  }

  const activeIndex = items.indexOf(activeItem);
  const isActiveInLimited = activeIndex < limit;

  if (isActiveInLimited) {
    return truncateItems(items, limit);
  }

  const limited = truncateItems(items, Math.max(limit - 1, 0));
  limited.push(activeItem);

  return limited;
}

/**
 * Processes navigation items based on options
 * @param {Array} items - Array of navigation items
 * @param {Object} options - Processing options
 * @param {string} currentUrl - URL of the current page
 * @returns {Object} Object with mainItems (items to display) and listPageItem (list page item if enabled)
 */
function processNavItems(items, options = {}, currentUrl = '') {
  if (!Array.isArray(items)) {
    return { mainItems: [], listPageItem: null };
  }

  let mainItems = items;
  let listPageItem = null;

  if (options.showListLink) {
    const separated = separateListPage(items);
    mainItems = separated.mainItems;
    listPageItem = separated.listPageItem;
  }

  if (options.truncate && options.limit) {
    if (options.ensureActiveVisible) {
      mainItems = ensureActiveItemVisible(mainItems, options.limit, currentUrl);
    } else {
      mainItems = truncateItems(mainItems, options.limit);
    }
  }

  return { mainItems, listPageItem };
}

/**
 * Adds computed navigation sort options filter
 * Reads sortBy, reverse, limit, truncate, and showListLink from frontmatter
 * and makes them available as navSortOptions for all collections
 */
export default (config) => {
  /**
   * Computes navigation sort options from an item's data
   * @param {Object} itemData - The data object from a nav collection item
   * @returns {Object} navSortOptions object with sortBy, reverse, limit, truncate, showListLink, ensureActiveVisible
   */
  config.addFilter('navSortOptions', (itemData) => {
    if (!itemData) return {};

    const navSortOptions = {};

    if (itemData.sortBy) {
      navSortOptions.sortBy = Array.isArray(itemData.sortBy)
        ? itemData.sortBy
        : [itemData.sortBy];
    }

    if (itemData.reverse !== undefined) {
      navSortOptions.reverse = itemData.reverse;
    }

    if (itemData.limit !== undefined) {
      navSortOptions.limit = itemData.limit;
    }

    if (itemData.truncate !== undefined) {
      navSortOptions.truncate = itemData.truncate;
    }

    if (itemData.showListLink !== undefined) {
      navSortOptions.showListLink = itemData.showListLink;
    }

    if (itemData.ensureActiveVisible !== undefined) {
      navSortOptions.ensureActiveVisible = itemData.ensureActiveVisible;
    }

    return navSortOptions;
  });

  /**
   * Processes navigation items: separates list page and applies truncation
   * @param {Array} items - Array of sorted navigation items
   * @param {Object} options - Options object with truncate, limit, showListLink, ensureActiveVisible
   * @param {string} currentUrl - Current page URL for active item handling
   * @returns {Object} Object with mainItems and listPageItem
   */
  config.addFilter('processNavItems', (items, options = {}, currentUrl = '') => {
    return processNavItems(items, options, currentUrl);
  });
};


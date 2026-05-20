export const loadLocalSearches = () => {
    const saved = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    return saved;
};

export const saveToLocalSearches = (query) => {
    const saved = loadLocalSearches().filter((item) => item !== query);
    const updated = [query, ...saved].slice(0, 10);
    localStorage.setItem("recentKeywords", JSON.stringify(updated));
};

export const deleteLocalSearchItem = (query) => {
    const saved = loadLocalSearches().filter((item) => item !== query);
    localStorage.setItem("recentKeywords", JSON.stringify(saved));
};

export const clearLocalSearches = () => {
    localStorage.removeItem("recentKeywords");
}; 
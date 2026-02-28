// Flavor Discovery Quiz — maps user preferences to recommended Japanese ice cream flavors

const QUIZ_MAP = {
    // Question 1: "What's your ideal flavor mood?"
    //   → creamy, refreshing, bold, delicate
    // Question 2: "How adventurous are you?"
    //   → classic, adventurous
    // Question 3: "Sweet or Subtle?"
    //   → sweet, subtle

    'creamy-classic-sweet': ['Hokkaido Milk', 'Sakura Blossom'],
    'creamy-classic-subtle': ['Hokkaido Milk', 'Houjicha Amber'],
    'creamy-adventurous-sweet': ['Hokkaido Milk', 'Black Sesame'],
    'creamy-adventurous-subtle': ['Hokkaido Milk', 'Wasabi Mint'],

    'refreshing-classic-sweet': ['Yuzu Citrus', 'Sakura Blossom'],
    'refreshing-classic-subtle': ['Yuzu Citrus', 'Kyoto Matcha'],
    'refreshing-adventurous-sweet': ['Yuzu Citrus', 'Wasabi Mint'],
    'refreshing-adventurous-subtle': ['Yuzu Citrus', 'Houjicha Amber'],

    'bold-classic-sweet': ['Black Sesame', 'Kyoto Matcha'],
    'bold-classic-subtle': ['Black Sesame', 'Houjicha Amber'],
    'bold-adventurous-sweet': ['Black Sesame', 'Wasabi Mint'],
    'bold-adventurous-subtle': ['Kyoto Matcha', 'Wasabi Mint'],

    'delicate-classic-sweet': ['Sakura Blossom', 'Hokkaido Milk'],
    'delicate-classic-subtle': ['Sakura Blossom', 'Houjicha Amber'],
    'delicate-adventurous-sweet': ['Sakura Blossom', 'Yuzu Citrus'],
    'delicate-adventurous-subtle': ['Sakura Blossom', 'Kyoto Matcha']
};

export function getQuizRecommendations(answers) {
    const { mood, adventure, sweetness } = answers;
    if (!mood || !adventure || !sweetness) {
        throw new Error('All three quiz answers are required: mood, adventure, sweetness');
    }

    const key = `${mood}-${adventure}-${sweetness}`;
    return QUIZ_MAP[key] || ['Kyoto Matcha', 'Hokkaido Milk']; // sensible defaults
}

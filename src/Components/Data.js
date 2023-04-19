export const languageToFileExtension = {
    'C': '.c',
    'C++': '.cpp',
    'C#': '.cs',
    'Clojure': '.clj',
    'CSS': '.css',
    'Dockerfile': '.dockerfile',
    'Elixir': '.ex',
    'Go': '.go',
    'HTML': '.html',
    'Java': '.java',
    'Javascript': '.js',
    'Julia': '.jl',
    'Kotlin': '.kt',
    'Lua': '.lua',
    'Markdown': '.md',
    'Pascal': '.pas',
    'PHP': '.php',
    'Python': '.py',
    'Ruby': '.rb',
    'Rust': '.rs',
    'SQL': '.sql',
    'YAML': '.yaml'
};

export function getFileExtension(language) {
    return languageToFileExtension[language];
}

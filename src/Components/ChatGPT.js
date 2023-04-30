class ChatGPT {
    constructor() {
        this.apiKey = import.meta.env.VITE_API_KEY;
        this.baseUrl = "https://api.openai.com/v1/chat/completions";
        this.headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
        };
    }
  
    async ask(question, abortController) {
        const controller = abortController || new AbortController();
        try {
            const response = await fetch(this.baseUrl, {
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                    {
                        role: "system",
                        content: question,
                    },
                    ],
                }),
                method: "POST",
                headers: this.headers,
                signal: controller.signal,
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            if (error.name === "AbortError") {
                return "Your altered code will appear here";
            } else {
                return "Error";
            }
        }
    }
}
  
export default ChatGPT;
  
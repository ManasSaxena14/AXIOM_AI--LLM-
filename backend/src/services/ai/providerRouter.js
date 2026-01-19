const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";

export const getAiResponse = async (mode, userMessage) => {
    let url;
    let apiKey;
    let model;
    let systemPrompt;


    if (mode === 'cerebras' || mode === 'reasoning' || mode === 'code') {

        url = CEREBRAS_URL;
        apiKey = process.env.CEREBRAS_API_KEY;
        model = "llama-3.3-70b";
        systemPrompt = mode === 'code'
            ? "You are an expert software engineer. Provide clean, well-documented code."
            : "You are AxiomAI's Advanced Reasoning Engine. Your goal is to provide exceptionally deep, multi-step analysis. For every query, break down the problem into fundamental components, evaluate multiple perspectives, identify potential edge cases, and present a rigorous, logical conclusion. Do not simplify; provide the most detailed and comprehensive analysis possible.";
    } else {

        url = GROQ_URL;
        apiKey = process.env.GROQ_API_KEY;
        model = "llama-3.3-70b-versatile";
        systemPrompt = "You are a helpful, professional AI assistant.";
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.error?.message || errorData.message || JSON.stringify(errorData);
            throw new Error(errorMsg);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error(`AI Service Exception (${mode}):`, error);
        throw error;
    }
};

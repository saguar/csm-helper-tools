export const contentConfig = {
    id: "ai-security-in-enterprise",
    title: "AI Security in Enterprise",
    contentData: [
        "AI Security in enterprise", // 1
        "AI is no longer\njust chat and answers.\nNow it uses tools\nand touches real systems.", // 2
        "When a model acts,\na mistake is not\njust wrong text.\nIt can become an action.", // 3
        "Many risks are not\nclassic software bugs.\nThey are natural effects\nof how LLMs work.", // 4
        "Four families dominate\nenterprise AI security.\nJailbreaks, prompt injection,\nhallucinations, reasoning failures.", // 5
        "A jailbreak tries\nto make the model say\nwhat it should refuse.\nNo need to ask directly.", // 6
        "The trick is often gradual.\nStart with harmless questions,\nthen build step by step\nuntil the output crosses the line.", // 7
        "Prompt injection is different.\nThe malicious instruction\nlives inside “normal” data.\nEmail, web, tickets, documents.", // 8
        "If an agent reads that data,\nit may treat text as commands.\nIt executes the attacker’s intent\nwhile thinking it helps you.", // 9
        "That’s why it’s huge risk.\nNo need to “convince” the AI.\nJust plant instructions\nin the right place.", // 10
        "Hallucinations are another poison.\nPlausible but false answers,\nsaid with confidence\nand invented details.", // 11
        "In critical professions it hurts.\nFake legal cases,\nphantom tools or links,\ncitations that don’t exist.", // 12
        "Then come reasoning failures.\nEven with good context,\nthe model can connect facts wrong\nand break simple logic.", // 13
        "Long context makes it worse.\nInfo “in the middle”\ncan become invisible,\nand the answer drifts.", // 14
        "Here’s the uncomfortable part.\nThere is no total cure,\nbecause LLMs predict tokens.\nYou mitigate instead.", // 15
        "Against jailbreaks,\nuse input and output filters.\nKeep system instructions\nrepeated and consistent.", // 16
        "Against prompt injection,\ndefense must be deterministic.\nDon’t rely on “be careful”.\nBlock sensitive data flows.", // 17
        "Shrink the blast radius.\nHigh-impact actions\nrequire human approval.\nAgents don’t sign checks.", // 18
        "Against hallucinations,\nground the AI in trusted sources.\nUse RAG, automated verification,\nand citation checks.", // 19
        "Treat the agent like\na brilliant naive intern.\nSecurity isn’t trust.\nIt’s verification around it.", // 20
    ],
    getThemeAndIcon(text, index) {
        if (index >= 19) {
            return {
                theme: "theme-reflection",
                icon: "<i class=\"fa-solid fa-user-shield\"></i>",
                label: "Principle"
            };
        }

        if (index >= 15) {
            return {
                theme: "theme-start",
                icon: "<i class=\"fa-solid fa-shield-heart\"></i>",
                label: "Defense"
            };
        }

        if (index >= 6) {
            return {
                theme: "theme-stop",
                icon: "<i class=\"fa-solid fa-triangle-exclamation\"></i>",
                label: "Risk"
            };
        }

        return {
            theme: "theme-default",
            icon: "<i class=\"fa-solid fa-shield-halved\"></i>",
            label: "Overview"
        };
    }
};

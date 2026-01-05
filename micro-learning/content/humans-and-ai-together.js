export const contentConfig = {
    id: "humans-and-ai-together",
    title: "Humans and AI together",
    contentData: [
        "Human-AI collaboration for Customer Success. A new way to deliver value at scale.", // 1
        "Customer Success is changing. Customers expect speed, but also judgment and trust.", // 2
        "AI handles the volume. Signals, data, patterns and repetitive analysis without fatigue.", // 3
        "The CSM brings meaning. Context, priorities, business impact and human nuance.", // 4
        "Together they work better. AI suggests, the CSM decides and explains.", // 5
        "AI helps you see earlier. Risks, trends and weak signals before customers feel them.", // 6
        "Early insight changes conversations. From reactive support to proactive guidance.", // 7
        "AI accelerates preparation. Account reviews, health analysis and data synthesis.", // 8
        "Time saved becomes quality. More space for listening, strategy and relationships.", // 9
        "Prompting is a CSM skill. Clear questions and context create better answers.", // 10
        "Critical thinking stays human. AI outputs are inputs, not conclusions.", // 11
        "Trust is still personal. Customers trust people who explain decisions.", // 12
        "AI supports consistency. Same standards and depth across many accounts.", // 13
        "Success is not speed alone. It is adoption, outcomes and long-term value.", // 14
        "Human-AI collaboration does not replace the CSM. It sharpens their impact.", // 15
        "The best CSMs ahead will not fight AI. They will lead with it.", // 16
        "<a href=\"https://www.salesforce.com/blog/human-ai-collaboration/\" target=\"_blank\" rel=\"noopener noreferrer\">Source Article</a>" // 53
    ],
    getThemeAndIcon(text, index) {
    if (index >= 14) {
        return { 
            theme: "theme-reflection", 
            icon: "<i class=\"fa-solid fa-rocket\"></i>", 
            label: "Outcomes" 
        };
    }
    if (index >= 11) {
        return { 
            theme: "theme-start", 
            icon: "<i class=\"fa-solid fa-magnifying-glass\"></i>", 
            label: "Critical" 
        };
    }
    if (index >= 7) {
        return { 
            theme: "theme-keep", 
            icon: "<i class=\"fa-solid fa-flask\"></i>", 
            label: "Practice" 
        };
    }
    if (index >= 3) {
        return { 
            theme: "theme-stop", 
            icon: "<i class=\"fa-solid fa-compass\"></i>", 
            label: "Foundations" 
        };
    }
    return { 
        theme: "theme-default", 
        icon: "<i class=\"fa-solid fa-people-group\"></i>", 
        label: "Intro" 
    };
}
};

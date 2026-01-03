export const contentConfig = {
    id: "humans-and-ai-together",
    title: "Humans and AI together",
    contentData: [
        "Humans and AI together", // 1
        "Two minds work better than one.", // 2
        "Even when one is artificial.", // 3
        "AI does not replace people.", // 4
        "It supports them.", // 5
        "It spots patterns fast.", // 6
        "It handles data and repetition.", // 7
        "Humans bring judgment.", // 8
        "Creativity and empathy.", // 9
        "Collaboration comes from different roles.", // 10
        "It is not magic.", // 11
        "It is a skill.", // 12
        "And it is in high demand today.", // 13
        "People who use AI perform better.", // 14
        "And stay relevant.", // 15
        "But AI needs input.", // 16
        "Clear instructions.", // 17
        "Context.", // 18
        "Ongoing feedback.", // 19
        "Like a real teammate.", // 20
        "The first step is to experiment.", // 21
        "Use the tools without fear.", // 22
        "Expect an early slowdown.", // 23
        "Then speed follows.", // 24
        "Trust grows with use.", // 25
        "The second step is understanding how it works.", // 26
        "Knowing what to ask.", // 27
        "And what to correct.", // 28
        "AI needs coaching.", // 29
        "Not neglect.", // 30
        "The third step is asking better questions.", // 31
        "The right questions.", // 32
        "Vague prompts give vague answers.", // 33
        "Clear prompts change everything.", // 34
        "Asking for clarification helps both sides.", // 35
        "The fourth step is thinking.", // 36
        "Always.", // 37
        "Check the output.", // 38
        "Question the results.", // 39
        "Know when to stop.", // 40
        "AI can help.", // 41
        "But it can also narrow ideas.", // 42
        "Diversity stays human.", // 43
        "Value is not just speed.", // 44
        "It is quality.", // 45
        "It is growth.", // 46
        "It is satisfaction.", // 47
        "Human-AI collaboration reshapes work.", // 48
        "And decision-making.", // 49
        "Outcomes matter more than tools.", // 50
        "Humans and AI work best together.", // 51
        "Not because they are perfect.", // 52
        "<a href=\"https://www.salesforce.com/blog/human-ai-collaboration/\" target=\"_blank\" rel=\"noopener noreferrer\">Source Article</a>" // 53
    ],
    getThemeAndIcon(text, index) {
        if (index >= 40) {
            return { theme: "theme-reflection", icon: "<i class=\"fa-solid fa-rocket\"></i>", label: "Outcomes" };
        }
        if (index >= 30) {
            return { theme: "theme-start", icon: "<i class=\"fa-solid fa-magnifying-glass\"></i>", label: "Critical" };
        }
        if (index >= 20) {
            return { theme: "theme-keep", icon: "<i class=\"fa-solid fa-flask\"></i>", label: "Practice" };
        }
        if (index >= 10) {
            return { theme: "theme-stop", icon: "<i class=\"fa-solid fa-compass\"></i>", label: "Foundations" };
        }
        return { theme: "theme-default", icon: "<i class=\"fa-solid fa-people-group\"></i>", label: "Intro" };
    }
};

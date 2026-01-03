export const contentConfig = {
    id: "smarter-skip-connections",
    title: "Smarter Models, Same Size",
    contentData: [
            { text: "Scaling Isn’t Enough", image: "./assets/ai-scaling.png", alt: "Exponential growth of AI model sizes from millions to trillions of parameters" }, // 1
            "For years, AI improved by making models bigger", // 2
            "More parameters meant better results", // 3
            "But this path has limits", // 4
            "Deep networks are chains of transformations", // 5
            "Each layer passes a signal forward", // 6
            "The deeper the chain, the more information degrades", // 7
            "Like a message whispered many times", // 8
            "After enough steps, meaning is lost", // 9
            { text: "Information Gets Lost", image: "./assets/telephone-game.png", alt: "People whispering a message in sequence, like the telephone game" },
            "Skip connections were the fix", // 10
            "They act as shortcuts for the signal", // 11
            "The original input can bypass a layer", // 12
            "If a layer adds no value, it can be ignored", // 13
            "This made very deep networks trainable", // 14
            "For years, this became standard practice", // 15
            "Then a new question appeared", // 16
            "Why keep shortcuts so simple?", // 17
            { text: "Shortcuts Save Signals", image: "./assets/skip-connection.png", alt: "Neural network diagram showing skip connections bypassing layers" }, // 3
            "Why not make them learn too?", // 18
            "More flexibility sounds powerful", // 19
            "In theory, it should help", // 20
            "In practice, it causes instability", // 21
            "The shortcut stops being a shortcut", // 22
            "It turns into another complex block", // 23
            "Training becomes fragile", // 24
            "An emergency exit becomes a maze", // 25
            "This is where DeepSeek steps in", // 26
            "Their insight is subtle but critical", // 27
            "Skip connections can be smarter", // 28
            "But they must behave like identity mappings", // 29
            "The signal must be preserved", // 30
            "No uncontrolled amplification", // 31
            "No unpredictable distortion", // 32
            "Especially when stacked many times", // 33
            "The solution is strong constraints", // 34
            "Shortcuts are learnable", // 35
            "But only inside a controlled space", // 36
            "Only safe transformations are allowed", // 37
            "A key rule keeps things stable", // 38
            "What goes in equals what comes out", // 39
            "Nothing is created or destroyed", // 40
            "Only redistributed", // 41
            "Like water poured between glasses", // 42
            "A strict normalizer enforces this rule", // 43
            "Every transformation is kept in bounds", // 44
            "Always and automatically", // 45
            "The practical outcome matters", // 46
            "More expressive skip connections", // 47
            "Stable training", // 48
            "No extra parameters needed", // 49
            "Only a small training overhead", // 50
            "Far cheaper than scaling the model", // 51
            "Huge models train without collapsing", // 52
            "With measurable gains in reasoning", // 53
            "The final message is clear", // 54
            { text: "Nothing Is Lost", image: "./assets/signal-conservation.png", alt: "Two glasses with equal water levels connected by arrows, symbolizing conservation" }, // 4
            "Bigger is not always better", // 55
            "Sometimes fundamentals matter more", // 56
            "Even those we took for granted", // 57
            "This is engineering, not brute force", // 58
            "Stability before raw power", // 59
            "Geometry before scale", // 60
            "Not higher towers", // 61
            "Better stairs", // 62
                "<a href=\"https://huggingface.co/papers/2512.24880\" target=\"_blank\" rel=\"noopener noreferrer\">Scietific Paper</a>" // 61
    ],
    getThemeAndIcon(text, index) {
        if (index >= 54) {
        return {
            theme: "theme-reflection",
            icon: "<i class=\"fa-solid fa-stairs\"></i>",
            label: "Principle"
        };
    }
    if (index >= 46) {
        return {
            theme: "theme-outcome",
            icon: "<i class=\"fa-solid fa-chart-line\"></i>",
            label: "Results"
        };
    }
    if (index >= 34) {
        return {
            theme: "theme-solution",
            icon: "<i class=\"fa-solid fa-shapes\"></i>",
            label: "Design"
        };
    }
    if (index >= 26) {
        return {
            theme: "theme-insight",
            icon: "<i class=\"fa-solid fa-lightbulb\"></i>",
            label: "Insight"
        };
    }
    if (index >= 16) {
        return {
            theme: "theme-problem",
            icon: "<i class=\"fa-solid fa-triangle-exclamation\"></i>",
            label: "Problem"
        };
    }
    if (index >= 10) {
        return {
            theme: "theme-foundation",
            icon: "<i class=\"fa-solid fa-diagram-project\"></i>",
            label: "Foundations"
        };
    }
    return {
        theme: "theme-default",
        icon: "<i class=\"fa-solid fa-brain\"></i>",
        label: "Context"
    };
    }
};

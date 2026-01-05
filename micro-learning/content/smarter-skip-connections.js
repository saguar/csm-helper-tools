export const contentConfig = {
    id: "smarter-skip-connections",
    title: "Smarter Models, Same Size",
    contentData: [
        "Skip connections, but better", // 1
        "DeepSeek shows a trick to make skip connections learn, without losing training stability.", // 2
        "Skip connections are shortcuts: the input skips a layer and gets added to the output.", // 3
        "That addition keeps signals and gradients alive, even when the network gets very deep.", // 4
        "If a layer isn’t useful, the model can almost copy through, avoiding vanishing and exploding gradients.", // 5
        "The classic limit is this: the shortcut is a fixed identity, so it doesn’t learn by itself.", // 6
        "A tempting idea is to make the shortcut learnable: a transform that can change and adapt.", // 7
        "Hyper-Connections add capacity, but often pay for it with instability during training.", // 8
        "DeepSeek’s point is specific: the problem isn’t learning, it’s respecting the geometry of identity.", // 9
        "So DeepSeek introduces mHC: matrices that can learn, but only inside stability rules.", // 10
        "The key rule is elegant: doubly stochastic matrices, with rows summing to 1 and columns too.", // 11
        "That preserves the signal and keeps compositions stable, like identities that still behave nicely.", // 12
        "To enforce the constraint, they use Sinkhorn–Knopp projection, bringing matrices back onto a valid manifold.", // 13
        "Practical outcome: the shortcut stays safe, but gains parameters when learning actually helps.", // 14
        "The cost stays modest: about 6.7% extra overall training overhead.", // 15
        "With mHC, training holds up to 27B parameters without exploding or vanishing gradients.", // 16
        "On reasoning benchmarks, it delivers a real gain: +2.1% on BBH at the same depth.", // 17
        "Maybe the future isn’t only scaling bigger models, but redesigning “settled” ideas to work smarter.", // 18
        "<a href=\"https://huggingface.co/papers/2512.24880\" target=\"_blank\" rel=\"noopener noreferrer\">Scientific Paper</a>" // 19
    ],
    getThemeAndIcon(text, index) {
    // Principle / Reflection (final takeaway + link)
    if (index >= 17) {
        return {
            theme: "theme-reflection",
            icon: "<i class=\"fa-solid fa-stairs\"></i>",
            label: "Principle"
        };
    }

    // Results (overhead, scale, benchmark gain)
    if (index >= 13) {
        return {
            theme: "theme-outcome",
            icon: "<i class=\"fa-solid fa-chart-line\"></i>",
            label: "Results"
        };
    }

    // Design (mHC + constraints + Sinkhorn–Knopp)
    if (index >= 9) {
        return {
            theme: "theme-solution",
            icon: "<i class=\"fa-solid fa-shapes\"></i>",
            label: "Design"
        };
    }

    // Insight (the “geometry of identity” point)
    if (index >= 8) {
        return {
            theme: "theme-insight",
            icon: "<i class=\"fa-solid fa-lightbulb\"></i>",
            label: "Insight"
        };
    }

    // Problem (learnable shortcuts → instability)
    if (index >= 6) {
        return {
            theme: "theme-problem",
            icon: "<i class=\"fa-solid fa-triangle-exclamation\"></i>",
            label: "Problem"
        };
    }

    // Foundations (what skip connections are + why they work)
    if (index >= 2) {
        return {
            theme: "theme-foundation",
            icon: "<i class=\"fa-solid fa-diagram-project\"></i>",
            label: "Foundations"
        };
    }

    // Context (intro)
    return {
        theme: "theme-default",
        icon: "<i class=\"fa-solid fa-brain\"></i>",
        label: "Context"
    };
}
};

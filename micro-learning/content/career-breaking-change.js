export const contentConfig = {
    id: "career-breaking-change",
    title: "Career Breaking Change",
    contentData: [
        "Breaking change for your career.", // 1
        "Every year we set goals.\nThen reality shifts.\nAnd we keep using old maps.\nThat mismatch drains energy.", // 2
        "Goals have a hidden flaw.\nThey assume perfect clarity.\nAnd a stable world.\nThat assumption rarely holds.", // 3
        "If you don’t know where you’re going,\na goal is just a guess.\nPlanning powered by hope.\nClean, but fragile.", // 4
        "When the future is noisy,\nrigid targets feel comforting.\nBut they sit on unstable ground.\nOne shock is enough.", // 5
        "What you actually control\nis not the final outcome.\nIt’s how you act each day.\nYour behavior.", // 6
        "You can’t control being hired.\nYou control how many applications you send.\nHow you build relationships.\nHow you refine your process.", // 7
        "You can’t control a promotion.\nYou control what you deliver.\nHow you communicate.\nAnd the standards you hold.", // 8
        "Fix behaviors first.\nGoals often realign afterward.\nNot by magic.\nBy accumulated momentum.", // 9
        "This is where a break is needed.\nNot a small adjustment.\nNot a patch on the old routine.\nAn incompatible change.", // 10
        "In software, a breaking change\ncreates a new version.\nThe old way no longer works.\nYou are the system.", // 11
        "This isn’t about winning or losing.\nIt’s not binary.\nIt’s changing how you show up.\nAnd how you decide.", // 12
        "Here’s the exercise.\nFifteen minutes total.\nThree simple questions.\nClean focus.", // 13
        "First question: STOP.\nWhat stays in the past.\nHabits that burn energy.\nWithout real return.", // 14
        "Think of legacy code.\nBackground behaviors.\nOnce useful, now expensive.\nStill running.", // 15
        "Second question: KEEP.\nWhat you protect going forward.\nYour core features.\nThe stabilizing base.", // 16
        "Many people change for novelty.\nThey abandon what works.\nChasing shiny upgrades.\nAnd lose the essentials.", // 17
        "Third question: START.\nOne new behavior.\nSomething your old self\nwould never do.", // 18
        "A real breaking change should sting.\nA controlled amount of risk.\nNo discomfort means\nno real change.", // 19
        "Pick three items\nfor each list.\nWrite them down.\nKeep them visible.", // 20
        "You’ll slip back to defaults.\nThat’s not failure.\nIt’s a signal.\nReset and continue.", // 21
        "Better years often start here.\nNot with big promises.\nWith small defaults.\nRepeated until inevitable.", // 22
        "<a href=\"https://open.substack.com/pub/alifeengineered/p/your-career-needs-a-breaking-change/\" target=\"_blank\" rel=\"noopener noreferrer\">Source Article</a>" // 61
    ],
   getThemeAndIcon(text, index) {
    if (index >= 21) {
        return {
            theme: "theme-reflection",
            icon: "<i class=\"fa-solid fa-lightbulb\"></i>",
            label: "Reflection"
        };
    }
    if (index >= 18) {
        return {
            theme: "theme-start",
            icon: "<i class=\"fa-solid fa-play\"></i>",
            label: "Start"
        };
    }
    if (index >= 16) {
        return {
            theme: "theme-keep",
            icon: "<i class=\"fa-solid fa-repeat\"></i>",
            label: "Keep"
        };
    }
    if (index >= 14) {
        return {
            theme: "theme-stop",
            icon: "<i class=\"fa-solid fa-hand\"></i>",
            label: "Stop"
        };
    }
    if (index >= 9) {
        return {
            theme: "theme-default",
            icon: "<i class=\"fa-solid fa-chart-line\"></i>",
            label: "Behavior"
        };
    }
    if (index >= 4) {
        return {
            theme: "theme-default",
            icon: "<i class=\"fa-solid fa-bullseye\"></i>",
            label: "The Problem"
        };
    }
    return {
        theme: "theme-default",
        icon: "<i class=\"fa-solid fa-route\"></i>",
        label: "Intro"
    };
}
};

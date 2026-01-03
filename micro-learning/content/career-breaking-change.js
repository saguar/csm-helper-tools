export const contentConfig = {
    id: "career-breaking-change",
    title: "Career Breaking Change",
    contentData: [
        "Your Career Needs a Breaking Change", // 1
        "Not your whole life.<br>Your professional path.", // 2
        "Your role, your impact, your trajectory over time.", // 3
        "Most careers don’t suddenly fail.<br>They slowly drift.", // 4
        "Drift feels safe.<br>But it compounds in the wrong direction.", // 5
        "Annual goals feel proactive.", // 6
        "But careers are not annual projects.", // 7
        "They evolve inside changing organizations, markets, and priorities.", // 8
        "Goals assume clarity about the destination.", // 9
        "In real careers, clarity is rare.", // 10
        "Goals also assume stability.", // 11
        "But roles change.<br>Expectations change.<br>Context changes.", // 12
        "A rigid goal breaks when one assumption fails.", // 13
        "That’s not strategy.", // 14
        "That’s hope-based planning.", // 15
        "Careers don’t move on goals.", // 16
        "They move on behavior.", // 17
        "You don’t control promotions.", // 18
        "You control how you work, communicate, and deliver.", // 19
        "Behavior sends signals.<br>Signals shape opportunities.", // 20
        "That’s why behavior is more robust than goals.", // 21
        "Less fragile.<br>More adaptable.", // 22
        "So instead of setting goals, change the system.", // 23
        "Change the defaults your career runs on.", // 24
        "STOP – Career Behaviors to Remove", // 25
        "Every career has legacy code.", // 26
        "Behaviors that once helped, but now create friction.", // 27
        "Busyness can look like impact.", // 28
        "But visibility without value is noise.", // 29
        "Overwork often hides weak prioritization.", // 30
        "Always saying yes erodes focus and leverage.", // 31
        "Stop what drains energy without increasing impact.", // 32
        "KEEP – Career Behaviors to Protect", // 33
        "Not everything needs to change.", // 34
        "Some behaviors already compound positively.", // 35
        "These are your core features.", // 36
        "Deep focus.<br>Quality standards.<br>Trusted relationships.", // 37
        "They stabilize performance over time.", // 38
        "Protect them aggressively.", // 39
        "START – The Breaking Change", // 40
        "This is the real upgrade.", // 41
        "A behavior the old you avoided.", // 42
        "Because it felt uncomfortable or risky.", // 43
        "Visibility.<br>Delegation.<br>Clear boundaries.", // 44
        "Careers don’t change in comfort zones.", // 45
        "They change when behavior upgrades first.", // 46
        "This is not a goal-setting exercise.", // 47
        "It’s a system redesign.", // 48
        "Systems tolerate mistakes.", // 49
        "Goals punish them.", // 50
        "You will slip back sometimes.", // 51
        "That’s expected.", // 52
        "Notice the behavior.", // 53
        "Correct gently.", // 54
        "Repeat until it becomes default.", // 55
        "Careers follow defaults.", // 56
        "Not intentions.", // 57
        "Not resolutions.", // 58
        "Change the defaults.", // 59
        "That is the breaking change.", // 60
        "<a href=\"https://open.substack.com/pub/alifeengineered/p/your-career-needs-a-breaking-change/\" target=\"_blank\" rel=\"noopener noreferrer\">Source Article</a>" // 61
    ],
    getThemeAndIcon(text, index) {
        if (index >= 46) {
            return { theme: "theme-reflection", icon: "<i class=\"fa-solid fa-lightbulb\"></i>", label: "Reflection" };
        }
        if (index >= 39) {
            return { theme: "theme-start", icon: "<i class=\"fa-solid fa-play\"></i>", label: "Start" };
        }
        if (index >= 32) {
            return { theme: "theme-keep", icon: "<i class=\"fa-solid fa-repeat\"></i>", label: "Keep" };
        }
        if (index >= 24) {
            return { theme: "theme-stop", icon: "<i class=\"fa-solid fa-hand\"></i>", label: "Stop" };
        }
        if (index >= 16) {
            return { theme: "theme-default", icon: "<i class=\"fa-solid fa-chart-line\"></i>", label: "Behavior" };
        }
        if (index >= 5) {
            return { theme: "theme-default", icon: "<i class=\"fa-solid fa-bullseye\"></i>", label: "The Problem" };
        }
        return { theme: "theme-default", icon: "<i class=\"fa-solid fa-route\"></i>", label: "Intro" };
    }
};

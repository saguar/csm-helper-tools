export const contentConfig = {
    id: "aela-contract-model",
    title: "AELA Contract Model",
    contentData: [
        "AELA is a contract model designed to remove friction and hesitation from enterprise agentic innovation.", // 1
        "Traditional AI adoption slows down when every experiment raises questions about consumption and cost.", // 2
        "AELA changes the model by fixing the price and removing consumption anxiety during the contract term.", // 3
        "Agentforce and Data Cloud can be used freely without fear of overages or constant re-estimation.", // 4
        "Teams stop optimizing for credit savings and start optimizing for real business value.", // 5
        "Salesforce offers two AELA structures to match different ambitions and deal velocities.", // 6
        "Strategic AELA is built for large enterprise transformations spanning multiple years.", // 7
        "It bundles licenses, AI and data consumption, and services into a single commercial perimeter.", // 8
        "This model fits bespoke, high-value deals with long-term transformation goals.", // 9
        "Velocity AELA is designed to accelerate deals and drive rapid Agentforce adoption.", // 10
        "Its scope focuses on unlimited Agentforce and Data Cloud usage for a fixed two-year term.", // 11
        "By simplifying pricing, Salesforce becomes the default agentic platform faster.", // 12
        "Access to AELA requires meeting minimum deal size thresholds.", // 13
        "The bigger the ambition, the more sense an all-inclusive model makes.", // 14
        "Even with unlimited usage, consumption is still observed and measured.", // 15
        "The Digital Wallet tracks how AI and data usage evolve over time.", // 16
        "There are no caps, no replenishments, and no surprise overage charges.", // 17
        "Unlimited does not mean every capability is included without limits.", // 18
        "High-cost Data Cloud real-time and streaming features are excluded.", // 19
        "Agentforce Voice actions are included, while telephony remains usage-based.", // 20
        "Each Salesforce org requires its own unlimited entitlement.", // 21
        "The most critical moment of AELA is not the signature, but the renewal.", // 22
        "Certification renewal locks in the highest usage level reached.", // 23
        "This rewards growth by lowering the average unit cost over time.", // 24
        "Pricing Agreement renewal converts unlimited usage into chosen quantities.", // 25
        "At that point, learning and adoption are monetized deliberately.", // 26
        "Without adoption, AELA risks becoming an expensive unused promise.", // 27
        "Architects and FDEs turn unlimited potential into real solutions.", // 28
        "If everything is available, strategy becomes more important than access.", // 29
        "Not every customer is ready for a full AELA commitment.", // 30
        "Bonus credits offer a safer way to experiment with uncertainty.", // 31
        "Flex agreements convert unused licenses into AI and data investment.", // 32
        "Pre-commit models align payment with delivered value over time.", // 33
        "AELA works like an all-inclusive resort for agentic innovation.", // 34
        "When cost disappears, the real question becomes what you choose to build." // 35
    ],
    getThemeAndIcon(text, index) {
        if (index >= 28) {
            return {
                theme: "theme-reflection",
                icon: "<i class=\"fa-solid fa-compass\"></i>",
                label: "Strategy"
            };
        }

        if (index >= 21) {
            return {
                theme: "theme-start",
                icon: "<i class=\"fa-solid fa-rotate\"></i>",
                label: "Renewal"
            };
        }

        if (index >= 12) {
            return {
                theme: "theme-keep",
                icon: "<i class=\"fa-solid fa-sliders\"></i>",
                label: "Terms"
            };
        }

        if (index >= 5) {
            return {
                theme: "theme-stop",
                icon: "<i class=\"fa-solid fa-layer-group\"></i>",
                label: "Structures"
            };
        }

        return {
            theme: "theme-default",
            icon: "<i class=\"fa-solid fa-circle-info\"></i>",
            label: "Overview"
        };
    }
};

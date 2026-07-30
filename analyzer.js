function analyzeJobText(text) {

    const content = text.toLowerCase();

    let score = 0;
    const findings = [];

    Object.entries(RISK_RULES).forEach(([ruleName, rule]) => {

        let matched = false;

        rule.keywords.forEach(keyword => {

            if (content.includes(keyword.toLowerCase())) {
                matched = true;
            }

        });

        if (matched) {

            score += rule.weight;

            findings.push({
                category: ruleName,
                points: rule.weight
            });

        }

    });

    if (score > 100) {
        score = 100;
    }

    let level = "Lower Risk";

    if (score >= 75) {
        level = "Very High Risk";
    } else if (score >= 50) {
        level = "High Risk";
    } else if (score >= 25) {
        level = "Some Concerns";
    }

    return {
        score,
        level,
        findings
    };

}

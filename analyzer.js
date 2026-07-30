function analyzeJobText(text) {

    const content = text.toLowerCase();

    let score = 0;
    const findings = [];

    Object.values(RISK_RULES).forEach(rule => {

        const matched = rule.keywords.some(keyword =>
            content.includes(keyword.toLowerCase())
        );

        if (matched) {

            score += rule.weight;

            findings.push({
                title: rule.title,
                severity: rule.severity,
                points: rule.weight,
                explanation: rule.explanation
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
        findings,
        warningCount: findings.length
    };

}

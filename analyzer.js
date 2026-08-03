function analyzeJobText(text) {
    if (typeof text !== "string" || !text.trim()) {
        return {
            score: 0,
            level: "Lower Risk",
            findings: [],
            warningCount: 0
        };
    }

    const content = normalizeJobText(text);

    const findings = [];
    const matchedRuleKeys = new Set();

    const severityOrder = {
        Critical: 4,
        High: 3,
        Medium: 2,
        Low: 1
    };

    /*
     * Some rules intentionally overlap.
     *
     * Example:
     * "interview fee" may match both:
     * - paymentRequests
     * - interviewFee
     *
     * We still show useful findings, but scoring should not blindly
     * add every overlapping weight and inflate the final risk score.
     *
     * Rules within the same group contribute only the highest
     * matched weight from that group.
     */
    const scoringGroups = [
        [
            "paymentRequests",
            "interviewFee",
            "refundableDeposit",
            "backgroundCheckPayment",
            "medicalExamPayment"
        ],

        [
            "cryptoPayment",
            "giftCardPayment",
            "suspiciousBankTransfer",
            "suspiciousUPIPayment"
        ],

        [
            "suspiciousMessaging",
            "signalCommunication",
            "discordCommunication",
            "textOnlyInterview"
        ],

        [
            "freeEmailRecruiter",
            "unofficialRecruiterContact",
            "recruiterAvoidsOfficialChannel",
            "recruiterImpersonationLanguage"
        ],

        [
            "unrealisticPay",
            "guaranteedIncome",
            "easyMoney",
            "minimalWorkHighIncome",
            "noExperienceHighPay",
            "passiveIncomeJobClaim"
        ],

        [
            "guaranteedSelection",
            "noInterviewOffer",
            "instantHiring"
        ],

        [
            "sensitiveInformation",
            "aadhaarRequest",
            "panRequest",
            "passportRequest",
            "identityDocumentRequest",
            "selfieWithIdRequest"
        ],

        [
            "otpRequest",
            "passwordRequest",
            "upiPinRequest",
            "cardSecurityCodeRequest",
            "cardPinRequest",
            "onlineBankingCredentials"
        ],

        [
            "bankAccountRequest",
            "moneyTransferJob",
            "chequeProcessingScheme"
        ],

        [
            "urgency",
            "expiringOfferPressure",
            "limitedVacancyPressure"
        ],

        [
            "recruiterSecrecy",
            "discourageVerification"
        ],

        [
            "visaFeeRequest",
            "workPermitFee",
            "immigrationFee",
            "embassyFeeRequest",
            "travelDeposit"
        ],

        [
            "taskBasedRecruitment",
            "rechargeRequirement",
            "withdrawalFee",
            "taxPaymentToRecruiter"
        ]
    ];

    /*
     * Match every rule once.
     *
     * Multiple occurrences of the same keyword do not create
     * duplicate findings.
     */
    Object.entries(RISK_RULES).forEach(([ruleKey, rule]) => {
        if (
            !rule ||
            !Array.isArray(rule.keywords) ||
            rule.keywords.length === 0
        ) {
            return;
        }

        const matchedKeywords = rule.keywords.filter((keyword) => {
            if (typeof keyword !== "string" || !keyword.trim()) {
                return false;
            }

            const normalizedKeyword = normalizeJobText(keyword);

            return normalizedKeyword && content.includes(normalizedKeyword);
        });

        if (matchedKeywords.length === 0) {
            return;
        }

        matchedRuleKeys.add(ruleKey);

        findings.push({
            ruleKey,
            title: rule.title,
            severity: rule.severity,
            points: Number(rule.weight) || 0,
            explanation: rule.explanation,
            matchedKeywords
        });
    });

    /*
     * Calculate score while preventing related rules from
     * stacking their full weights.
     */
    let score = 0;
    const groupedRules = new Set();

    scoringGroups.forEach((group) => {
        let highestWeight = 0;

        group.forEach((ruleKey) => {
            groupedRules.add(ruleKey);

            if (!matchedRuleKeys.has(ruleKey)) {
                return;
            }

            const rule = RISK_RULES[ruleKey];

            if (!rule) {
                return;
            }

            const weight = Number(rule.weight) || 0;

            if (weight > highestWeight) {
                highestWeight = weight;
            }
        });

        score += highestWeight;
    });

    /*
     * Any future rules that are added to rules.js but not yet
     * assigned to a scoring group still contribute normally.
     *
     * This keeps the analyzer compatible with future rule additions.
     */
    matchedRuleKeys.forEach((ruleKey) => {
        if (groupedRules.has(ruleKey)) {
            return;
        }

        const rule = RISK_RULES[ruleKey];

        if (!rule) {
            return;
        }

        score += Number(rule.weight) || 0;
    });

    score = Math.max(
        0,
        Math.min(100, Math.round(score))
    );

    /*
     * Highest-severity findings appear first.
     *
     * For findings with equal severity, the stronger weighted
     * finding appears first.
     */
    findings.sort((a, b) => {
        const severityDifference =
            (severityOrder[b.severity] || 0) -
            (severityOrder[a.severity] || 0);

        if (severityDifference !== 0) {
            return severityDifference;
        }

        return b.points - a.points;
    });

    let level = "Lower Risk";

    if (score >= 75) {
        level = "Very High Risk";
    } else if (score >= 50) {
        level = "High Risk";
    } else if (score >= 25) {
        level = "Some Concerns";
    }

    /*
     * Keep the public result structure expected by popup.js.
     *
     * Internal fields such as ruleKey and matchedKeywords are
     * removed before returning results to the UI.
     */
    const publicFindings = findings.map((finding) => ({
        title: finding.title,
        severity: finding.severity,
        points: finding.points,
        explanation: finding.explanation
    }));

    return {
        score,
        level,
        findings: publicFindings,
        warningCount: publicFindings.length
    };
}


function normalizeJobText(text) {
    return String(text)
        .toLowerCase()
        .replace(/\u00a0/g, " ")
        .replace(/[\r\n\t]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/*
 * Compatibility wrapper.
 *
 * The project's intended analyzer API is:
 *
 * analyzeJobText(text)
 *
 * The current popup.js calls analyzeJob(text), so this wrapper keeps
 * the existing popup working without requiring another popup rewrite.
 */
function analyzeJob(text) {
    return analyzeJobText(text);
}

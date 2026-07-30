const RISK_RULES = {

    paymentRequests: {
        title: "Upfront Payment Requested",
        severity: "Critical",
        weight: 35,
        explanation: "The listing appears to request money before employment. Legitimate employers generally do not require applicants to pay to secure a job.",
        keywords: [
            "registration fee",
            "application fee",
            "processing fee",
            "training fee",
            "security deposit",
            "refundable deposit",
            "pay before interview",
            "pay to confirm",
            "placement fee"
        ]
    },

    suspiciousMessaging: {
        title: "Suspicious Communication Method",
        severity: "High",
        weight: 20,
        explanation: "The recruiter appears to move communication to unofficial messaging platforms. Verify the recruiter's identity independently.",
        keywords: [
            "telegram",
            "whatsapp only",
            "contact on telegram",
            "move to telegram"
        ]
    },

    unrealisticPay: {
        title: "Unusually High Compensation",
        severity: "Medium",
        weight: 18,
        explanation: "The advertised compensation appears unusually high compared with the described work. This should be verified carefully.",
        keywords: [
            "earn ₹50000 daily",
            "earn 50000 daily",
            "guaranteed income",
            "easy money"
        ]
    },

    urgency: {
        title: "Pressure or Urgency",
        severity: "Low",
        weight: 10,
        explanation: "The listing encourages immediate action. Urgency alone is not proof of fraud but can increase overall risk.",
        keywords: [
            "urgent hiring",
            "join immediately",
            "offer expires today",
            "limited positions",
            "respond immediately"
        ]
    },

    sensitiveInformation: {
        title: "Sensitive Information Requested",
        severity: "Critical",
        weight: 30,
        explanation: "Sensitive personal or financial information appears to be requested earlier than expected in a normal hiring process.",
        keywords: [
            "otp",
            "bank account",
            "credit card",
            "debit card",
            "password",
            "aadhaar",
            "pan",
            "passport"
        ]
    }

};

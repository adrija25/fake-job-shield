const RISK_RULES = {

    paymentRequests: {
        weight: 35,
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
        weight: 20,
        keywords: [
            "telegram",
            "whatsapp only",
            "contact on telegram",
            "move to telegram"
        ]
    },

    unrealisticPay: {
        weight: 18,
        keywords: [
            "earn ₹50000 daily",
            "earn 50000 daily",
            "guaranteed income",
            "no experience required",
            "easy money"
        ]
    },

    urgency: {
        weight: 10,
        keywords: [
            "urgent hiring",
            "join immediately",
            "offer expires today",
            "limited positions",
            "respond immediately"
        ]
    },

    sensitiveInformation: {
        weight: 30,
        keywords: [
            "otp",
            "bank account",
            "credit card",
            "debit card",
            "password",
            "aadhaar",
            "pan card"
        ]
    }

};

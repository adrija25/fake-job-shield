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
            "placement fee",
            "joining fee",
            "verification fee",
            "employment fee",
            "candidate fee",
            "recruitment fee"
        ]
    },

    interviewFee: {
        title: "Interview Fee Requested",
        severity: "Critical",
        weight: 32,
        explanation: "Charging applicants money simply to attend or schedule an interview is a significant warning sign.",
        keywords: [
            "interview fee",
            "pay for interview",
            "interview charges",
            "booking fee for interview",
            "interview registration"
        ]
    },

    equipmentPurchase: {
        title: "Equipment Purchase Required",
        severity: "High",
        weight: 22,
        explanation: "Applicants are being asked to purchase equipment before employment. Verify this request carefully.",
        keywords: [
            "buy laptop",
            "purchase laptop",
            "buy equipment",
            "purchase equipment",
            "purchase software",
            "buy software",
            "office setup fee",
            "home office fee"
        ]
    },

    refundableDeposit: {
        title: "Refundable Deposit Requested",
        severity: "High",
        weight: 24,
        explanation: "Requests for refundable deposits should always be independently verified before making any payment.",
        keywords: [
            "refundable security deposit",
            "refundable amount",
            "refundable joining fee",
            "deposit will be refunded",
            "fully refundable"
        ]
    },

    cryptoPayment: {
        title: "Cryptocurrency Payment Requested",
        severity: "Critical",
        weight: 35,
        explanation: "The recruiter requests payment using cryptocurrency. Legitimate employers rarely require crypto payments during hiring.",
        keywords: [
            "bitcoin",
            "btc",
            "ethereum",
            "eth",
            "usdt",
            "crypto payment",
            "pay in crypto",
            "wallet address"
        ]
    },

    giftCardPayment: {
        title: "Gift Card Payment Requested",
        severity: "Critical",
        weight: 35,
        explanation: "Gift card payments are commonly associated with scams and should be treated with extreme caution.",
        keywords: [
            "amazon gift card",
            "google play gift card",
            "apple gift card",
            "steam gift card",
            "redeem code",
            "gift voucher"
        ]
    },

    advanceSalary: {
        title: "Advance Salary Promise",
        severity: "Medium",
        weight: 14,
        explanation: "Promises of advance salary before joining should be independently verified.",
        keywords: [
            "salary in advance",
            "advance payment",
            "advance salary",
            "instant salary",
            "salary before joining"
        ]
    },

    suspiciousBankTransfer: {
        title: "Suspicious Bank Transfer Request",
        severity: "Critical",
        weight: 30,
        explanation: "Applicants are instructed to transfer money directly to a personal account before employment.",
        keywords: [
            "bank transfer",
            "wire transfer",
            "neft",
            "rtgs",
            "imps",
            "transfer money",
            "send payment"
        ]
    },

    suspiciousUPIPayment: {
        title: "UPI Payment Requested",
        severity: "High",
        weight: 25,
        explanation: "The listing requests payment through a personal UPI account before hiring.",
        keywords: [
            "upi payment",
            "paytm",
            "phonepe",
            "google pay",
            "gpay",
            "bhim",
            "scan qr"
        ]
    },
        suspiciousMessaging: {
        title: "Suspicious Communication Method",
        severity: "High",
        weight: 20,
        explanation: "The recruiter appears to move communication to unofficial messaging platforms. Verify the recruiter's identity independently.",
        keywords: [
            "whatsapp only",
            "contact on whatsapp",
            "contact via whatsapp",
            "message on whatsapp",
            "whatsapp interview",
            "whatsapp recruiter",
            "telegram",
            "telegram only",
            "contact on telegram",
            "contact via telegram",
            "message on telegram",
            "move to telegram",
            "telegram interview"
        ]
    },

    signalCommunication: {
        title: "Recruitment Through Signal",
        severity: "Medium",
        weight: 14,
        explanation: "The hiring process appears to rely on Signal for recruiter communication. Messaging apps can be legitimate, but the employer and recruiter should be independently verified.",
        keywords: [
            "contact on signal",
            "contact via signal",
            "message on signal",
            "signal app",
            "signal interview",
            "signal recruiter"
        ]
    },

    discordCommunication: {
        title: "Recruitment Through Discord",
        severity: "Medium",
        weight: 12,
        explanation: "The hiring process appears to rely on Discord. This is unusual for many formal recruitment processes and warrants independent verification.",
        keywords: [
            "contact on discord",
            "contact via discord",
            "message on discord",
            "discord interview",
            "discord recruiter",
            "join our discord"
        ]
    },

    textOnlyInterview: {
        title: "Text-Only Interview Process",
        severity: "High",
        weight: 20,
        explanation: "The interview appears to be conducted entirely through text or chat. Legitimate employers may use messaging during recruitment, but text-only interviews can be a warning sign when combined with other suspicious behavior.",
        keywords: [
            "text interview",
            "text only interview",
            "chat interview",
            "chat only interview",
            "interview through chat",
            "interview via chat",
            "interview by text",
            "no video interview",
            "no phone interview"
        ]
    },

    freeEmailRecruiter: {
        title: "Recruiter Uses a Free Email Service",
        severity: "Medium",
        weight: 12,
        explanation: "The recruitment message appears to reference a free consumer email service rather than an employer-controlled domain. This is not proof of fraud, but the recruiter's identity should be verified through the company's official website.",
        keywords: [
            "@gmail.com",
            "@yahoo.com",
            "@yahoo.co.in",
            "@outlook.com",
            "@hotmail.com",
            "@proton.me",
            "@protonmail.com",
            "@aol.com"
        ]
    },

    unofficialRecruiterContact: {
        title: "Unofficial Recruiter Contact",
        severity: "Medium",
        weight: 14,
        explanation: "The recruiter appears to encourage contact through a personal or unofficial channel rather than a clearly identifiable company recruitment channel.",
        keywords: [
            "personal email",
            "personal number",
            "my personal number",
            "contact my personal number",
            "message my personal number",
            "contact my private number",
            "private number",
            "personal whatsapp"
        ]
    },

    recruiterAvoidsOfficialChannel: {
        title: "Official Recruitment Channel Avoided",
        severity: "High",
        weight: 20,
        explanation: "The message appears to discourage use of the employer's normal recruitment channels. Verify the opportunity directly through the company's official careers page or contact information.",
        keywords: [
            "do not apply on website",
            "don't apply on website",
            "do not contact company",
            "don't contact company",
            "do not call company",
            "don't call company",
            "contact me directly instead",
            "message me directly instead",
            "apply only through whatsapp",
            "apply only through telegram"
        ]
    },

    recruiterSecrecy: {
        title: "Unusual Secrecy Requested",
        severity: "High",
        weight: 18,
        explanation: "The recruiter appears to request secrecy about the opportunity or hiring process. Attempts to prevent independent verification can increase risk.",
        keywords: [
            "do not tell anyone",
            "don't tell anyone",
            "keep this confidential",
            "keep this secret",
            "do not discuss this",
            "don't discuss this",
            "do not share this offer",
            "don't share this offer"
        ]
    },

    recruiterImpersonationLanguage: {
        title: "Potential Recruiter Impersonation Pattern",
        severity: "Medium",
        weight: 15,
        explanation: "The message contains language sometimes associated with unsolicited recruiter impersonation. Independently confirm that the sender actually represents the named employer.",
        keywords: [
            "i am the hiring manager",
            "i am hiring manager",
            "i am the hr manager",
            "i am hr manager",
            "i am the recruitment manager",
            "i am recruitment manager",
            "official hiring agent",
            "authorized hiring agent"
        ]
    },
        unrealisticPay: {
        title: "Unusually High Compensation",
        severity: "Medium",
        weight: 18,
        explanation: "The advertised compensation appears unusually high compared with the described work. Compensation claims should be verified against the role, employer, location, and expected responsibilities.",
        keywords: [
            "earn ₹50000 daily",
            "earn 50000 daily",
            "earn ₹50,000 daily",
            "earn 50,000 daily",
            "earn ₹1 lakh daily",
            "earn 1 lakh daily",
            "earn lakhs per month",
            "huge salary",
            "massive salary",
            "unlimited earning",
            "unlimited earnings"
        ]
    },

    guaranteedIncome: {
        title: "Guaranteed Income Claim",
        severity: "High",
        weight: 20,
        explanation: "The opportunity appears to guarantee earnings or income. Legitimate compensation normally depends on employment terms, hours, performance, commissions, or other defined conditions.",
        keywords: [
            "guaranteed income",
            "guaranteed earnings",
            "income guaranteed",
            "earnings guaranteed",
            "guaranteed salary",
            "guaranteed daily income",
            "guaranteed weekly income",
            "guaranteed monthly income"
        ]
    },

    guaranteedSelection: {
        title: "Guaranteed Job Selection",
        severity: "High",
        weight: 22,
        explanation: "The message appears to guarantee selection or employment before a normal assessment process. Genuine employers generally evaluate candidates before confirming employment.",
        keywords: [
            "guaranteed selection",
            "selection guaranteed",
            "100% selection",
            "100 percent selection",
            "guaranteed job",
            "job guaranteed",
            "guaranteed placement",
            "placement guaranteed",
            "confirmed selection",
            "selection confirmed without interview"
        ]
    },

    noInterviewOffer: {
        title: "Job Offered Without an Interview",
        severity: "High",
        weight: 22,
        explanation: "The opportunity appears to offer employment without a meaningful interview or assessment. Some legitimate roles use simplified hiring processes, but immediate offers without verification warrant caution.",
        keywords: [
            "no interview required",
            "no interview needed",
            "without interview",
            "job without interview",
            "direct joining without interview",
            "direct selection without interview",
            "selected without interview",
            "hired without interview",
            "no assessment required",
            "no assessment needed"
        ]
    },

    instantHiring: {
        title: "Immediate Hiring Claim",
        severity: "Medium",
        weight: 14,
        explanation: "The listing suggests unusually immediate hiring or selection. Fast hiring can be legitimate, but it should be verified when combined with other warning signs.",
        keywords: [
            "instant hiring",
            "instant joining",
            "immediate selection",
            "immediate joining",
            "join immediately",
            "start immediately",
            "start today",
            "join today",
            "hired immediately",
            "selected immediately"
        ]
    },

    easyMoney: {
        title: "Easy Money Claim",
        severity: "Medium",
        weight: 16,
        explanation: "The opportunity emphasizes effortless or unusually easy earnings. Legitimate jobs generally describe responsibilities, qualifications, working conditions, and compensation rather than promising easy money.",
        keywords: [
            "easy money",
            "quick money",
            "fast money",
            "earn money easily",
            "easy earning",
            "easy earnings",
            "effortless income",
            "effortless earnings",
            "money without effort",
            "earn without effort"
        ]
    },

    minimalWorkHighIncome: {
        title: "High Income for Minimal Work",
        severity: "High",
        weight: 20,
        explanation: "The listing appears to promise substantial earnings for very little work. Verify the compensation structure and actual responsibilities carefully.",
        keywords: [
            "work 1 hour daily",
            "work one hour daily",
            "work 1 hour a day",
            "work one hour a day",
            "work 2 hours daily",
            "work two hours daily",
            "few minutes per day",
            "few minutes daily",
            "earn from simple tasks",
            "high income for simple tasks"
        ]
    },

    noExperienceHighPay: {
        title: "High-Pay Opportunity With No Experience",
        severity: "Medium",
        weight: 16,
        explanation: "The listing strongly emphasizes high earnings while requiring little or no experience. Entry-level opportunities can be legitimate, but unusually high compensation with minimal requirements should be verified.",
        keywords: [
            "no experience high salary",
            "no experience high income",
            "no experience high pay",
            "zero experience high salary",
            "no skills required high salary",
            "no skills needed high salary",
            "no qualification high salary",
            "no qualifications high salary"
        ]
    },

    vagueWorkDescription: {
        title: "Vague Work Description",
        severity: "Low",
        weight: 8,
        explanation: "The opportunity uses vague descriptions of the work without clearly explaining the role or responsibilities. This is not proof of fraud, but applicants should understand exactly what work is expected before proceeding.",
        keywords: [
            "simple online work",
            "simple online tasks",
            "easy online tasks",
            "basic online work",
            "simple task job",
            "simple tasks from home",
            "just complete tasks",
            "complete simple tasks",
            "work using mobile only",
            "work from your phone"
        ]
    },

    passiveIncomeJobClaim: {
        title: "Passive Income Presented as Employment",
        severity: "Medium",
        weight: 14,
        explanation: "The opportunity appears to market passive or automatic income as a conventional job. Verify the actual business model, duties, and compensation structure before participating.",
        keywords: [
            "passive income job",
            "automatic income",
            "automated income",
            "earn while sleeping",
            "income while sleeping",
            "earn without working",
            "make money while sleeping"
        ]
    },

    commissionOnlyUnclear: {
        title: "Unclear Commission-Based Compensation",
        severity: "Low",
        weight: 8,
        explanation: "The listing appears to emphasize commission earnings without clearly describing a base salary or compensation structure. Confirm exactly how and when compensation is earned.",
        keywords: [
            "unlimited commission",
            "uncapped earning opportunity",
            "earn only commission",
            "commission based only",
            "commission only job",
            "no salary only commission"
        ]
    },
        sensitiveInformation: {
        title: "Sensitive Information Requested",
        severity: "Critical",
        weight: 30,
        explanation: "Sensitive personal or financial information appears to be requested earlier than expected in a normal hiring process. Verify why the information is needed and who is requesting it before providing anything.",
        keywords: [
            "send your aadhaar",
            "send aadhaar",
            "share your aadhaar",
            "aadhaar number",
            "aadhar number",
            "send your pan",
            "send pan card",
            "share your pan",
            "pan card number",
            "passport number",
            "send your passport",
            "share your passport",
            "bank account details",
            "bank details",
            "credit card details",
            "debit card details",
            "send your card details",
            "share your card details"
        ]
    },

    otpRequest: {
        title: "OTP Requested",
        severity: "Critical",
        weight: 40,
        explanation: "The message appears to request a one-time password or verification code. Recruiters should not need authentication codes sent to your phone, email, bank account, or other personal accounts.",
        keywords: [
            "send otp",
            "send the otp",
            "share otp",
            "share the otp",
            "provide otp",
            "provide the otp",
            "tell me the otp",
            "forward otp",
            "verification otp",
            "send verification code",
            "share verification code",
            "provide verification code",
            "send the code you received",
            "share the code you received"
        ]
    },

    passwordRequest: {
        title: "Password Requested",
        severity: "Critical",
        weight: 40,
        explanation: "The recruiter appears to request an account password or login credential. Legitimate recruiters should never need passwords for your email, banking, social media, job portal, or other personal accounts.",
        keywords: [
            "send your password",
            "share your password",
            "provide your password",
            "email password",
            "gmail password",
            "banking password",
            "internet banking password",
            "account password",
            "login password",
            "share login credentials",
            "send login credentials",
            "provide login credentials"
        ]
    },

    upiPinRequest: {
        title: "UPI PIN Requested",
        severity: "Critical",
        weight: 40,
        explanation: "The message appears to request a UPI PIN. A UPI PIN authorizes financial transactions and should never be shared with a recruiter or employer.",
        keywords: [
            "send upi pin",
            "share upi pin",
            "provide upi pin",
            "enter your upi pin",
            "tell me your upi pin",
            "upi password",
            "share your upi password"
        ]
    },

    cardSecurityCodeRequest: {
        title: "Card Security Code Requested",
        severity: "Critical",
        weight: 40,
        explanation: "The recruiter appears to request a card security code such as a CVV or CVC. Employers and recruiters should not need this information during recruitment.",
        keywords: [
            "send cvv",
            "share cvv",
            "provide cvv",
            "your cvv",
            "cvv number",
            "cvv code",
            "send cvc",
            "share cvc",
            "provide cvc",
            "cvc number",
            "card security code"
        ]
    },

    cardPinRequest: {
        title: "Card PIN Requested",
        severity: "Critical",
        weight: 40,
        explanation: "The message appears to request a debit or credit card PIN. This information should never be shared as part of a recruitment process.",
        keywords: [
            "send card pin",
            "share card pin",
            "provide card pin",
            "debit card pin",
            "credit card pin",
            "atm pin",
            "send atm pin",
            "share atm pin",
            "provide atm pin"
        ]
    },

    onlineBankingCredentials: {
        title: "Online Banking Credentials Requested",
        severity: "Critical",
        weight: 40,
        explanation: "The message appears to request online banking credentials. Recruiters do not need access to an applicant's banking account or authentication credentials.",
        keywords: [
            "internet banking login",
            "internet banking credentials",
            "net banking login",
            "netbanking login",
            "bank login details",
            "bank login credentials",
            "bank username and password",
            "online banking password",
            "mobile banking password"
        ]
    },

    bankAccountRequest: {
        title: "Bank Account Information Requested",
        severity: "High",
        weight: 22,
        explanation: "Bank account information appears to be requested during the recruitment process. Employers may legitimately request payroll information after formal hiring, but early or unexplained requests should be verified carefully.",
        keywords: [
            "send bank details",
            "share bank details",
            "provide bank details",
            "bank account number",
            "send account number",
            "share account number",
            "provide account number",
            "send cancelled cheque",
            "share cancelled cheque",
            "bank statement",
            "send bank statement",
            "share bank statement"
        ]
    },

    aadhaarRequest: {
        title: "Aadhaar Information Requested",
        severity: "High",
        weight: 22,
        explanation: "The message appears to request Aadhaar information. Identity verification may occur during legitimate onboarding, but applicants should verify the employer and purpose before sharing identity documents.",
        keywords: [
            "aadhaar number",
            "aadhar number",
            "aadhaar card number",
            "aadhar card number",
            "send aadhaar card",
            "send aadhar card",
            "share aadhaar card",
            "share aadhar card",
            "upload aadhaar",
            "upload aadhar",
            "aadhaar copy",
            "aadhar copy"
        ]
    },

    panRequest: {
        title: "PAN Information Requested",
        severity: "High",
        weight: 20,
        explanation: "The message appears to request PAN information. PAN may be required during legitimate employment onboarding in India, but requests made before the employer or job has been verified warrant caution.",
        keywords: [
            "pan card number",
            "send pan card",
            "share pan card",
            "upload pan card",
            "pan card copy",
            "send your pan",
            "share your pan",
            "provide pan number",
            "provide your pan"
        ]
    },

    passportRequest: {
        title: "Passport Information Requested",
        severity: "High",
        weight: 20,
        explanation: "The recruiter appears to request passport information. This can be legitimate for some international employment processes, but the employer and reason for the request should be independently verified first.",
        keywords: [
            "passport number",
            "send passport",
            "send your passport",
            "share passport",
            "share your passport",
            "upload passport",
            "passport copy",
            "passport scan",
            "scanned passport"
        ]
    },

    identityDocumentRequest: {
        title: "Identity Document Requested",
        severity: "Medium",
        weight: 16,
        explanation: "The recruitment process appears to request identity documents. Legitimate employers may require identification during formal onboarding, but unusually early requests should be verified before documents are shared.",
        keywords: [
            "send id proof",
            "share id proof",
            "upload id proof",
            "identity proof",
            "send identity document",
            "share identity document",
            "government id",
            "government issued id",
            "send driving licence",
            "send driving license",
            "share driving licence",
            "share driving license",
            "voter id copy"
        ]
    },

    selfieWithIdRequest: {
        title: "Selfie With Identity Document Requested",
        severity: "High",
        weight: 24,
        explanation: "The message appears to request a selfie or photograph together with an identity document. This combination can expose applicants to identity misuse and should only be provided through a verified employer's legitimate onboarding process.",
        keywords: [
            "selfie with aadhaar",
            "selfie with aadhar",
            "selfie with pan",
            "selfie with passport",
            "selfie with id",
            "photo holding aadhaar",
            "photo holding aadhar",
            "photo holding pan card",
            "photo holding passport",
            "photo holding id"
        ]
    },
        urgency: {
        title: "Pressure or Urgency",
        severity: "Low",
        weight: 10,
        explanation: "The listing encourages unusually fast action. Urgency alone does not indicate fraud, but pressure tactics can increase concern when combined with stronger warning signs.",
        keywords: [
            "urgent hiring",
            "join immediately",
            "respond immediately",
            "reply immediately",
            "apply immediately",
            "apply now immediately",
            "immediate response required",
            "immediate action required"
        ]
    },

    expiringOfferPressure: {
        title: "Offer Expiration Pressure",
        severity: "Medium",
        weight: 12,
        explanation: "The applicant appears to be pressured to accept or act on an offer within an unusually short period. Verify the employer and offer independently before making a rushed decision.",
        keywords: [
            "offer expires today",
            "offer expires tonight",
            "offer valid today only",
            "offer valid for today",
            "accept today",
            "accept immediately",
            "confirm today",
            "confirm immediately",
            "last chance to accept"
        ]
    },

    limitedVacancyPressure: {
        title: "Limited Vacancy Pressure",
        severity: "Low",
        weight: 8,
        explanation: "The listing emphasizes limited availability to encourage quick action. Limited vacancies can be legitimate, but pressure should not replace normal employer verification.",
        keywords: [
            "limited positions",
            "limited vacancies",
            "few positions left",
            "few vacancies left",
            "only few seats left",
            "limited seats",
            "last few vacancies",
            "slots filling fast"
        ]
    },

    discourageVerification: {
        title: "Independent Verification Discouraged",
        severity: "Critical",
        weight: 30,
        explanation: "The message appears to discourage independent verification of the recruiter or employer. Legitimate hiring processes should generally withstand reasonable verification through official company channels.",
        keywords: [
            "do not verify",
            "don't verify",
            "no need to verify",
            "do not contact hr",
            "don't contact hr",
            "do not contact the employer",
            "don't contact the employer",
            "do not contact head office",
            "don't contact head office",
            "do not call the company",
            "don't call the company"
        ]
    },

    visaFeeRequest: {
        title: "Visa Fee Requested",
        severity: "Critical",
        weight: 32,
        explanation: "The opportunity appears to request payment for a visa as part of recruitment. International hiring can involve legitimate immigration costs, but applicants should independently verify the employer, immigration process, and authorized payment recipient before paying.",
        keywords: [
            "visa fee",
            "visa processing fee",
            "pay visa fee",
            "visa payment",
            "visa charges",
            "visa processing charges",
            "employment visa fee",
            "work visa fee",
            "visa deposit"
        ]
    },

    workPermitFee: {
        title: "Work Permit Payment Requested",
        severity: "Critical",
        weight: 30,
        explanation: "The recruiter appears to request money for a work permit. Verify the employer and immigration process through official government or authorized channels before making any payment.",
        keywords: [
            "work permit fee",
            "work permit payment",
            "pay for work permit",
            "work permit charges",
            "permit processing fee",
            "employment permit fee",
            "work authorization fee"
        ]
    },

    immigrationFee: {
        title: "Immigration Payment Requested",
        severity: "High",
        weight: 25,
        explanation: "The opportunity appears to request immigration-related payment through the recruitment process. Verify all immigration costs and recipients independently before paying.",
        keywords: [
            "immigration fee",
            "immigration charges",
            "immigration processing fee",
            "immigration payment",
            "migration fee",
            "migration charges",
            "immigration deposit"
        ]
    },

    embassyFeeRequest: {
        title: "Embassy or Consular Payment Requested",
        severity: "Critical",
        weight: 30,
        explanation: "The recruiter appears to request an embassy or consular payment. Verify any such fee directly through the relevant official government or diplomatic channel rather than relying solely on recruiter instructions.",
        keywords: [
            "embassy fee",
            "embassy charges",
            "embassy payment",
            "consulate fee",
            "consular fee",
            "consulate payment",
            "embassy processing fee"
        ]
    },

    travelDeposit: {
        title: "Travel Deposit Requested",
        severity: "High",
        weight: 22,
        explanation: "The applicant appears to be asked for a travel-related deposit before employment. Verify who receives the money, why it is required, and whether the employer is legitimate before making a payment.",
        keywords: [
            "travel deposit",
            "flight deposit",
            "ticket deposit",
            "airfare deposit",
            "travel security deposit",
            "flight booking deposit",
            "ticket booking fee"
        ]
    },

    courierFee: {
        title: "Courier or Document Delivery Fee Requested",
        severity: "High",
        weight: 20,
        explanation: "The recruiter appears to request payment for delivering employment documents, equipment, or an offer package. Unexpected courier charges during recruitment should be independently verified.",
        keywords: [
            "courier fee",
            "courier charges",
            "delivery fee for documents",
            "document delivery fee",
            "offer letter delivery fee",
            "equipment delivery fee",
            "shipping fee for equipment",
            "parcel fee"
        ]
    },

    backgroundCheckPayment: {
        title: "Applicant Asked to Pay for Verification",
        severity: "High",
        weight: 22,
        explanation: "The applicant appears to be required to pay directly for a background check or employment verification. Some legitimate processes may involve third-party services, but the employer and payment request should be verified independently.",
        keywords: [
            "background check fee",
            "background verification fee",
            "verification charges",
            "employment verification fee",
            "police verification fee",
            "criminal check fee",
            "screening fee"
        ]
    },

    medicalExamPayment: {
        title: "Medical Examination Payment Requested",
        severity: "Medium",
        weight: 15,
        explanation: "The recruitment process appears to require payment for a medical examination. Medical checks can be legitimate for some roles, but applicants should verify the employer, clinic, and payment arrangement independently.",
        keywords: [
            "medical examination fee",
            "medical test fee",
            "medical checkup fee",
            "medical check-up fee",
            "fitness certificate fee",
            "health check fee",
            "pre employment medical fee"
        ]
    },

    taskBasedRecruitment: {
        title: "Task-Based Earning Pattern",
        severity: "High",
        weight: 20,
        explanation: "The opportunity appears to involve earning money by completing simple online tasks. Some recruitment scams use task-based earning schemes that later require deposits or additional payments.",
        keywords: [
            "complete tasks and earn",
            "complete task and earn",
            "earn by completing tasks",
            "earn per task",
            "daily task earning",
            "task commission",
            "task based earning",
            "recharge task",
            "prepaid task",
            "merchant task"
        ]
    },

    rechargeRequirement: {
        title: "Recharge or Account Funding Required",
        severity: "Critical",
        weight: 32,
        explanation: "The opportunity appears to require the applicant to add money, recharge an account, or fund a balance before earning or withdrawing money. This is a strong financial warning sign.",
        keywords: [
            "recharge your account",
            "recharge account",
            "recharge to continue",
            "recharge to unlock",
            "add funds to continue",
            "deposit to continue",
            "top up your account",
            "top-up your account",
            "fund your account",
            "increase account balance"
        ]
    },

    withdrawalFee: {
        title: "Payment Required to Withdraw Earnings",
        severity: "Critical",
        weight: 35,
        explanation: "The opportunity appears to require additional payment before supposed earnings can be withdrawn. Requests to pay money in order to release earnings are a major warning sign.",
        keywords: [
            "pay to withdraw",
            "withdrawal fee",
            "withdrawal charges",
            "pay before withdrawal",
            "deposit before withdrawal",
            "recharge before withdrawal",
            "unlock withdrawal",
            "withdrawal activation fee",
            "release your earnings"
        ]
    },

    taxPaymentToRecruiter: {
        title: "Tax Payment Requested Through Recruiter",
        severity: "Critical",
        weight: 30,
        explanation: "The recruiter appears to request direct payment of tax or similar charges before releasing employment-related money. Tax obligations should be independently verified through legitimate payroll or government channels.",
        keywords: [
            "pay tax before receiving salary",
            "pay tax to receive salary",
            "tax clearance fee",
            "income tax clearance fee",
            "tax processing fee",
            "pay tax to withdraw",
            "tax fee before withdrawal",
            "tax payment to release funds"
        ]
    },

    moneyTransferJob: {
        title: "Money Transfer or Account Routing Work",
        severity: "Critical",
        weight: 35,
        explanation: "The role appears to involve receiving, forwarding, or transferring money through a personal account. Applicants should not allow personal financial accounts to be used to route employer or customer funds.",
        keywords: [
            "receive money in your account",
            "receive funds in your account",
            "transfer money for company",
            "forward money to another account",
            "process payments through your account",
            "use your bank account for payments",
            "receive client payments in your account",
            "transfer funds on our behalf"
        ]
    },

    chequeProcessingScheme: {
        title: "Cheque or Payment Processing Scheme",
        severity: "Critical",
        weight: 32,
        explanation: "The opportunity appears to involve receiving a cheque or payment and then forwarding part of the money elsewhere. This pattern can expose applicants to financial loss if the original payment is fraudulent or reversed.",
        keywords: [
            "deposit the cheque",
            "deposit the check",
            "cash the cheque",
            "cash the check",
            "send remaining money",
            "forward the remaining funds",
            "keep your commission and send",
            "deduct your salary and send",
            "deposit payment and transfer"
        ]
    }

};

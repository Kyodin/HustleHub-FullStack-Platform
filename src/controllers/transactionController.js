const Transaction =
    require("../models/Transaction");

const logger =
    require("../utils/logger");

// SARS 2027 TAX ESTIMATE
//
// This is an application estimate based only on
// HustleHub income.

const calculateEstimatedTax = (
    taxableIncome
) => {

    const income =
        Number(
            taxableIncome || 0
        );


    if (income <= 0) {
        return 0;
    }


    let taxBeforeRebate =
        0;


    if (
        income <=
        245100
    ) {

        taxBeforeRebate =
            income *
            0.18;

    } else if (
        income <=
        383100
    ) {

        taxBeforeRebate =
            44118 +
            (
                income -
                245100
            ) *
            0.26;

    } else if (
        income <=
        530200
    ) {

        taxBeforeRebate =
            79998 +
            (
                income -
                383100
            ) *
            0.31;

    } else if (
        income <=
        695800
    ) {

        taxBeforeRebate =
            125599 +
            (
                income -
                530200
            ) *
            0.36;

    } else if (
        income <=
        887000
    ) {

        taxBeforeRebate =
            185215 +
            (
                income -
                695800
            ) *
            0.39;

    } else if (
        income <=
        1878600
    ) {

        taxBeforeRebate =
            259783 +
            (
                income -
                887000
            ) *
            0.41;

    } else {

        taxBeforeRebate =
            666339 +
            (
                income -
                1878600
            ) *
            0.45;
    }


    // SARS 2027 primary rebate
    // for an individual under 65
    const primaryRebate =
        17820;


    const estimatedTax =
        Math.max(
            taxBeforeRebate -
                primaryRebate,
            0
        );


    return Number(
        estimatedTax.toFixed(2)
    );
};


// Get the marginal tax rate
// for information displayed
// on the dashboard.
const getMarginalTaxRate = (
    taxableIncome
) => {

    const income =
        Number(
            taxableIncome || 0
        );


    if (
        income <=
        245100
    ) {
        return 0.18;
    }


    if (
        income <=
        383100
    ) {
        return 0.26;
    }


    if (
        income <=
        530200
    ) {
        return 0.31;
    }


    if (
        income <=
        695800
    ) {
        return 0.36;
    }


    if (
        income <=
        887000
    ) {
        return 0.39;
    }


    if (
        income <=
        1878600
    ) {
        return 0.41;
    }


    return 0.45;
};


// Freelancer income dashboard
const getFreelancerIncome = async (
    req,
    res,
    next
) => {

    try {

        const freelancerId =
            req.user.userId;


        const transactions =
            await Transaction.find({
                freelancer:
                    freelancerId
            })
                .populate(
                    "gig",
                    "title category"
                )
                .populate(
                    "client",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


        // =================================================
        // COMPLETED AND REFUNDED TRANSACTIONS
        // =================================================

        const completedTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.status ===
                    "completed"
            );


        const refundedTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.status ===
                    "refunded"
            );


        // =================================================
        // TOTAL INCOME
        // =================================================

        const totalIncome =
            completedTransactions.reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount ||
                        0
                    ),
                0
            );


        const refundedAmount =
            refundedTransactions.reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount ||
                        0
                    ),
                0
            );


        // =================================================
        // CURRENT MONTH
        // =================================================

        const now =
            new Date();


        const currentMonth =
            now.getMonth();


        const currentYear =
            now.getFullYear();


        const currentMonthIncome =
            completedTransactions
                .filter(
                    (transaction) => {

                        const date =
                            new Date(
                                transaction.createdAt
                            );


                        return (
                            date.getMonth() ===
                                currentMonth &&
                            date.getFullYear() ===
                                currentYear
                        );
                    }
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        Number(
                            transaction.amount ||
                            0
                        ),
                    0
                );


        // =================================================
        // SARS TAX ESTIMATE
        // =================================================

        /*
         * HustleHub only knows the freelancer's income
         * earned through this application.
         *
         * The estimate therefore treats HustleHub income
         * as taxable income and applies the SARS 2027
         * individual tax brackets and primary rebate.
         *
         * The result is an estimate only and is not an
         * official SARS assessment.
         */

        const estimatedTax =
            calculateEstimatedTax(
                totalIncome
            );


        const estimatedTaxRate =
            getMarginalTaxRate(
                totalIncome
            );


        const estimatedAfterTaxIncome =
            Math.max(
                Number(
                    (
                        totalIncome -
                        estimatedTax
                    ).toFixed(2)
                ),
                0
            );


        // Effective percentage of HustleHub income
        // that is estimated as tax.
        const effectiveTaxRate =
            totalIncome > 0
                ? Number(
                    (
                        estimatedTax /
                        totalIncome
                    ).toFixed(4)
                )
                : 0;


        // =================================================
        // MONTHLY INCOME
        // =================================================

        const monthlyMap = {};


        completedTransactions.forEach(
            (transaction) => {

                const date =
                    new Date(
                        transaction.createdAt
                    );


                const key =
                    `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                    ).padStart(
                        2,
                        "0"
                    )}`;


                if (!monthlyMap[key]) {

                    monthlyMap[key] = {

                        month:
                            date.toLocaleString(
                                "en-ZA",
                                {
                                    month:
                                        "short"
                                }
                            ),

                        year:
                            date.getFullYear(),

                        income: 0,

                        transactionCount: 0
                    };
                }


                monthlyMap[key].income +=
                    Number(
                        transaction.amount ||
                        0
                    );


                monthlyMap[key]
                    .transactionCount +=
                    1;
            }
        );


        const monthlyIncome =
            Object.values(
                monthlyMap
            );


        // =================================================
        // RESPONSE
        // =================================================

        return res
            .status(200)
            .json({

                success: true,

                totalIncome,

                currentMonthIncome,

                completedTransactionCount:
                    completedTransactions.length,

                refundedTransactionCount:
                    refundedTransactions.length,

                refundedAmount,


                // Tax information
                taxYear:
                    "2027",

                taxYearStart:
                    "2026-03-01",

                taxYearEnd:
                    "2027-02-28",

                taxCalculationMethod:
                    "SARS 2027 progressive individual income tax brackets",

                primaryRebate:
                    17820,

                taxThreshold:
                    99000,

                estimatedTaxRate,

                effectiveTaxRate,

                estimatedTax,

                estimatedAfterTaxIncome,

                taxDisclaimer:
                    "Estimate based only on HustleHub income. Actual SARS tax may differ because other income, deductions, rebates and tax credits are not included.",


                monthlyIncome,

                transactions
            });


    } catch (error) {

        logger.error(
            "Freelancer income dashboard error",
            {
                event:
                    "INCOME_DASHBOARD_ERROR",

                freelancerId:
                    req.user?.userId ||
                    null,

                message:
                    error.message,

                ip:
                    req.ip
            }
        );


        next(error);
    }
};


module.exports = {
    getFreelancerIncome
};
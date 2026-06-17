import AppError from "../../shared/error/AppError.js";
import creditRepository from "./credits.repository.js"
import { PaymentInput } from "./credits.schema.js";
import prisma from "../../lib/prisma.js";

const creditService = {
    customers: async (userId: string) => {
        const customers = await creditRepository.customers(userId);
        const overview = customers.map(customer => ({
            id: customer.id,
            name: customer.name,
            totalBalance: customer.transactions.reduce(
                (sum, transaction) => sum + Number(transaction.remainingBalance ?? 0), 0
            ),
            creditTransactionCount: customer.transactions.length,
        }));
        return overview;
    },
    customerCredits: async (customerId: string) => {
        const customerCredits = await creditRepository.customerCredits(customerId);
        const unpaid = customerCredits.filter(credit => credit.creditStatus !== "PAID");
        const paid = customerCredits.filter(credit => credit.creditStatus === "PAID");

        const paymentHistory = await creditRepository.paymentHistory(customerId);

        return { paid, unpaid, paymentHistory };
    },
    payment: async (data: PaymentInput, userId: string) => {
        // notes, method, amount, customerId, userId
        const { amount, customerId, method, notes } = data;
        if (amount <= 0) {
            throw new AppError("Payment amount must be greater than 0", 400, "INVALID_PAYMENT_AMOUNT");
        }
        // get the unpaid credits (oldest first)
        const unpaidCredits = await creditRepository.unpaidCredits(customerId);
        if (unpaidCredits.length === 0) {
            throw new AppError("Customer has no unpaid credits", 400, "NO_UNPAID_CREDITS");
        }
            // optional - calculate total outstanding and decide whether or not to allow overpayment
        const outstandingBalance = unpaidCredits.reduce((total, credit) => Number(credit.remainingBalance ?? 0) + total , 0);
            // version 1: do not allow overpayment at first
        if (amount > outstandingBalance) {
            throw new AppError(`Payment exceeds outstanding balance by ₱${amount - outstandingBalance}`, 409, "OVERPAYMENT")
        }
        // start transaction
        const result = await prisma.$transaction(async (tx) => {
            // create a payment record CustomerPayment
            const paymentData = {
                customerId: customerId,
                userId: userId,
                amount: amount,
                method: method,
                notes: notes,
            }
            const payment = await creditRepository.payment(tx, paymentData);
            // allocate payment
            let remainingPaymentAmount = amount;
            // loop through credits
            for (const credit of unpaidCredits) {
                if (remainingPaymentAmount <= 0) break;
                // determine allocation amount
                const applicablePaymentAmount = Math.min(remainingPaymentAmount, Number(credit.remainingBalance ?? 0));
                // create allocation record
                await creditRepository.allocate(tx, { paymentId: payment.id, transactionId: credit.id, amountApplied: applicablePaymentAmount })
                // update transaction balance
                const newBalance = Number(credit.remainingBalance ?? 0) - applicablePaymentAmount;
                // decrease remaining balance on transaction
                await creditRepository.updateBalance(tx, credit.id, newBalance);
                // decrease remaining payment amount
                remainingPaymentAmount -= applicablePaymentAmount;
                // update customer last activity
                await creditRepository.updateCustomerLastActivity(tx, customerId);
            }
            return payment;
        });
        return result;
    }
}

export default creditService;
import * as yup from "yup";

export const createExpenseSchema = yup.object().shape({
    type: yup.string().required("Expense Type Required"),
    odometerReading: yup.number().required("Meter Reading is required"),
    amount: yup.number().required("Expense amount is required")
})

export type CreateExpenseLog = yup.InferType<typeof createExpenseSchema>;
import * as yup from "yup";

export const createExpenseSchema = yup.object().shape({
    category: yup
        .string()
        .oneOf(['PETROL', 'MAINTENANCE'])
        .required(),
    amount: yup
        .number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than zero")
        .required("Amount is required"),
    odometerReading: yup
        .number()
        .typeError("Odometer must be a number")
        .positive("Odometer must be greater than zero")
        .required("Odometer reading is required"),
})

export type CreateExpenseLog = yup.InferType<typeof createExpenseSchema>;
import * as yup from "yup";

export const customerSchema = yup.object().shape({
    name: yup.string().required("Customer name is required"),
    phone: yup
        .string()
        .matches(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number")
        .required("Phone number is required"),
    address: yup.string().required("Address is required"),
});

export type CustomerFormData = yup.InferType<typeof customerSchema>;
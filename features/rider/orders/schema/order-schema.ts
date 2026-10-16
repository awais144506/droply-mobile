import * as yup from "yup";

// 1. Schema for individual products in the cart
const orderItemSchema = yup.object().shape({
    productId: yup.string().required(),
    name: yup.string().required(),
    price: yup.number().min(0).required(),
    quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be greater than zero")
        .required("Quantity is required"),
});

export const newOrderSchema = yup.object().shape({
    zoneId: yup.string().required("Please select a delivery zone"),
    customerId: yup.string().required("Please select a customer"),
    items: yup
        .array()
        .of(orderItemSchema)
        .min(1, "Please add at least one product to the order")
        .required(),
    discountAmount: yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .min(0, "Discount cannot be negative")
        .default(0),

    deliveryCharges: yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .min(0, "Delivery charges cannot be negative")
        .default(0),

    scheduleMode: yup.string().oneOf(["TODAY", "TOMORROW", "LATER"]).required(),
    scheduleDate: yup.date().required(),
});

export type NewOrderFormData = yup.InferType<typeof newOrderSchema>;
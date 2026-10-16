export const logKeys = {
    all: ["rider-logs"] as const,
    list: (branchId: string) => [...logKeys.all, branchId] as const,
};
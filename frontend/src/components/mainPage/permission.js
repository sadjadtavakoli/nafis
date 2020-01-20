export const isPermit = (section, job) => {
  switch (section) {
    case "sale":
      return job === "admin" || job === "salesperson" || job === "storekeeper";

    case "cashregister":
      return job === "admin" || job === "cashier" || job === "accountant";

    case "depository":
      return job === "admin" || job === "storekeeper" || job === "accountant";

    case "customers":
      return job === "admin" || job === "cashier";

    case "reports":
      return job === "admin";

    case "suppliers":
      return job === "admin" || job === "accountant";

    case "adminOnly":
      return job === "admin";

    default:
      return false;
  }
};

// import { schema } from "normalizr";

// export const buyerSchema = new schema.Entity(
//   "buyer",
//   {},
//   { idAttribute: "phone_number" }
// );
// export const sellerSchema = new schema.Entity(
//   "seller",
//   {},
//   {
//     idAttribute: "username"
//   }
// );
// export const branchSchema = new schema.Entity(
//   "branch",
//   {},
//   { idAttribute: "name" }
// );
// export const productSchema = new schema.Entity(
//   "product",
//   {},
//   {
//     idAttribute: "code"
//   }
// );
// export const productItemSchema = new schema.Entity("productItem", {
//   product: productSchema
// });
// export const productItemListSchema = new schema.Array(productItemSchema);

// export const billSchema = new schema.Entity(
//   "bill",
//   {
//     buyer: buyerSchema,
//     seller: sellerSchema,
//     branch: branchSchema,
//     items: productItemListSchema
//   },
//   { idAttribute: "pk" }
// );

// export const billListSchema = new schema.Array(billSchema);

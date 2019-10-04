import { ProductFilter } from "../../types";

interface BuildProductCountPlanInput {
  filter: ProductFilter;
  search?: string;
}

interface BuildProductSearchPlanInput {
  filter: ProductFilter;
  search?: string;
  sortField: "name";
  sortOrder: "ASC" | "DESC";
}

const PRODUCT_FIELDS = ["name"];

const SORT_ORDERS = ["ASC", "DESC"];

export const buildProductCountPlan = ({
  filter,
  search
}: BuildProductCountPlanInput) => {
  return `
    ${
      search
        ? `CALL db.index.fulltext.queryNodes("products", $search) YIELD node as p`
        : "MATCH (p:Product)"
    }
    ${buildProductFilterPlan(filter)}
    WITH count(p) as count
    RETURN count
  `;
};

export const buildProductSearchPlan = ({
  filter,
  search,
  sortField,
  sortOrder
}: BuildProductSearchPlanInput) => {
  validateProductField(sortField);
  validateSortOrder(sortOrder);
  return `
    ${
      search
        ? `CALL db.index.fulltext.queryNodes("products", $search) YIELD node as p`
        : "MATCH (p:Product)"
    }
    ${buildProductFilterPlan(filter)}
    RETURN p AS products
    ORDER BY p.${sortField} ${sortOrder}
    SKIP $skip
    LIMIT $limit
  `;
};

const buildProductFilterPlan = (filter: ProductFilter) => {
  validateProductFilter(filter);
  return Object.keys(filter)
    .map(field => `WHERE p.${field} = $filter.${field}`)
    .join(" ");
};

const validateProductField = (field: any): void => {
  if (!PRODUCT_FIELDS.includes(field)) {
    throw new Error("Invalid product field: " + field);
  }
};

const validateProductFilter = (filter: any): void => {
  Object.keys(filter).forEach(validateProductField);
};

const validateSortOrder = (order: any): void => {
  if (!SORT_ORDERS.includes(order)) {
    throw new Error("Invalid sort order: " + order);
  }
};

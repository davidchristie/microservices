interface BuildProductCountPlanInput {
  filter: {
    name?: string;
  };
  search?: string;
}

interface BuildProductSearchPlanInput {
  filter: {
    name?: string;
  };
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
    RETURN p AS products
    ORDER BY p.${sortField} ${sortOrder}
    SKIP $skip
    LIMIT $limit
  `;
};

const validateProductField = (field: string): void => {
  if (!PRODUCT_FIELDS.includes(field)) {
    throw new Error("Invalid product field: " + field);
  }
};

const validateSortOrder = (order: string): void => {
  if (!SORT_ORDERS.includes(order)) {
    throw new Error("Invalid sort order: " + order);
  }
};

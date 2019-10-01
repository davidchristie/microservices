import React from "react";
import { translate } from "react-admin";

const ProductName = translate(({ record }) => <span>{record.name}</span>);

export default ProductName;

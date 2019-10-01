import buildGraphQLProvider from "ra-data-graphql-simple";
import { reducer as tree } from "ra-tree-ui-materialui";
import React, { Component } from "react";
import { Admin, Resource } from "react-admin";
import authProvider from "./authProvider";
import client from "./clients/apollo";
import i18nProvider from "./i18nProvider";
import products from "./products";

class Application extends Component {
  state = { dataProvider: null };

  async componentDidMount() {
    const dataProvider = await buildGraphQLProvider({ client });
    this.setState({ dataProvider });
  }

  render() {
    const { dataProvider } = this.state;

    if (!dataProvider) {
      return <div>Loading</div>;
    }

    return (
      <Admin
        authProvider={authProvider}
        customReducers={{ tree }}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        locale="en"
        title="Microservices"
      >
        {permissions => [<Resource name="Product" {...products} />]}
      </Admin>
    );
  }
}

export default Application;

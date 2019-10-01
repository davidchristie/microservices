import React, { Component } from "react";
import buildGraphQLProvider from "ra-data-graphql-simple";
import { Admin, Resource, Delete } from "react-admin";

import { Route } from "react-router";
import { reducer as tree } from "ra-tree-ui-materialui";

import authProvider from "./authProvider";
import client from "./clients/apollo";
import comments from "./comments";
import CustomRouteLayout from "./customRouteLayout";
import CustomRouteNoLayout from "./customRouteNoLayout";
// import dataProvider from "./dataProvider";
import i18nProvider from "./i18nProvider";
import products from "./products";
import users from "./users";
import tags from "./tags";

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
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        title="Example Admin"
        locale="en"
        customReducers={{ tree }}
        customRoutes={[
          <Route
            exact
            path="/custom"
            component={CustomRouteNoLayout}
            noLayout
          />,
          <Route exact path="/custom2" component={CustomRouteLayout} />
        ]}
      >
        {permissions => [
          <Resource name="Product" {...products} />
          // <Resource name="comments" {...comments} />,
          // permissions ? <Resource name="users" {...users} /> : null,
          // <Resource name="tags" {...tags} />
        ]}
      </Admin>
    );
  }
}

export default Application;

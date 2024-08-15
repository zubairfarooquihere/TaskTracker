//git push -u origin2 main
//https://react-icons.github.io/react-icons/
import React, { useState, useEffect } from "react";
import "./App.css";
import TodoLists from "./components/TodoLists";
import Nav from "./components/Nav";
import SignupLogin from "./components/SignupLogin";
import { useSelector } from "react-redux";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import Cookies from "js-cookie";
import { setContext } from "@apollo/client/link/context";
import { LoginStateActions } from "./store/LoginState-slice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  const apiAddress = useSelector((state) => state.ApiSlice.address);


  const authLink = setContext((_, { headers }) => {
    //sendMessage();
    if (Cookies.get("token")) {
      let token = JSON.parse(logIN).token;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    } else {
      dispatch(LoginStateActions.logOut());
    }
  });

  const httpLink = createHttpLink({
    uri: `${apiAddress}graphql`, // Your GraphQL endpoint
  });

  // Concatenate the token middleware link with the HTTP link
  const link = authLink.concat(httpLink);

  // Create the Apollo Client instance
  const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });

  return (
    <>
      <ApolloProvider client={apolloClient}>
        <Nav logIN={logIN} />
        {logIN ? <TodoLists /> : <SignupLogin />}
      </ApolloProvider>
    </>
  );
}

export default App;

/* eslint-disable import/first */
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";

import "antd/dist/antd.css"; 
import "./style.css";

import AttraHeader from 'attra-navigation/AttraHeader';
import AttraContent from 'attra-navigation/AttraContent';
import AttraFooter from 'attra-navigation/AttraFooter';

const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <AttraHeader></AttraHeader>
        <AttraContent></AttraContent>
      </Router>
      <AttraFooter></AttraFooter>
    </Layout>
  );
};

export default App;

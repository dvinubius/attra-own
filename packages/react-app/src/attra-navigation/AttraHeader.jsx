
import { Logo } from "./Logo";
import { Menu, Layout } from "antd";
import NativeBalance from "components/NativeBalance";
import Account from "components/Account";
import Chains from "components/Chains";
import { NavLink } from "react-router-dom";

import "../style.css";
import "./AttraHeader.css";

const { Header } = Layout;

const AttraHeader = () => {
  return (
    <Header className="header">
        <Logo />
        <Menu
          theme="light"
          mode="horizontal"
          className="navMenu"
          defaultSelectedKeys={["home"]}
        > 
          <Menu.Item key="home">
            <NavLink to="/home">Home</NavLink>
          </Menu.Item>

          <Menu.Item key="campaigns">
            <NavLink to="/campaigns">Campaigns</NavLink>
          </Menu.Item>

          <Menu.Item key="roadmap">
            <NavLink to="/roadmap">Roadmap</NavLink>
          </Menu.Item>          
        </Menu>
        <div className="header-right">
          <Chains />
          <NativeBalance />
          <Account />
        </div>
      </Header>
  );
}

export default AttraHeader;

import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd';

import logo from '../../assets/images/logo.png'
import './index.less'

//左侧导航组件

class LeftNav extends Component {
  render() { 
    return ( 
      <div className="left-nav">
      <Link to='/' className="left-nav-header">
        <img src={logo} alt="logo"/>
        <h1>DP后台</h1>
      </Link>

      {/* <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[path]}
        defaultOpenKeys={[openKey]}
      >

        {
          this.menuNodes
        }

      </Menu> */}
    </div>
     );
  }
}
 
export default LeftNav;

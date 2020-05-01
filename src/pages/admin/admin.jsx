import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils'
/*
首页的路由组件
*/
export default class Adimn extends Component {
  render() {
    const user = memoryUtils.user
    //没有user没有登陆
    if (!user || !user._id) {
      //跳转到登陆
      return <Redirect to='/login'/>
    }
    return (
      <div>
        Hello {user.username}
      </div>
    )
  }
}
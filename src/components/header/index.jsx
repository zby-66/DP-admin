import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'
// import BMap from 'BMap'

import LinkButton from '../link-button'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'

/*
左侧导航的组件
 */
class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/duoyun.png', // 天气图片url
    weather: '多云转晴', // 天气的文本
    city: '北京' ,//所在城市
    temperature: ''
  }

  getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }

  

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        // 如果有值才说明有匹配的
        if(cItem) {
          // 取出它的title
          title = cItem.title
        }
      }
    })
    return title
  }

  /*
  退出登陆
   */
  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        console.log('OK', this)
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}

        // 跳转到login
        this.props.history.replace('/login')
      }
    })
  }

  getCityWether = () =>{
    const _this = this;
        
        var BMap = window.BMap;
        var geoc = new BMap.Geocoder();
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            geoc.getLocation(r.point, function (rs) {
                // console.log(rs)   //具体信息可以打印出来看一下，根据需求取值     经纬度，城市，街道等等
                var addComp = rs.addressComponents;
                let city = addComp.city;
                _this.setState({
                    city:city,  //城市名
                }, async () => {//获取天气  一定要用回调函数setState是异步的
                    // 调用接口请求异步获取数据
                    const { dayPictureUrl, weather,temperature } = await reqWeather(_this.state.city)
                    // console.log(this.state.city,'-------------------------')
                    // console.log({ dayPictureUrl, weather },'=====================')
                
                    // 更新状态
                    _this.setState({dayPictureUrl, weather,temperature})
                  }
                )
            })
            
        })
        
      }
  /*
  第一次render()之后执行一次
  一般在此执行异步操作: 发ajax请求/启动定时器
   */
  componentDidMount () {
    // 获取当前的时间
    this.getTime()
    this.getCityWether()
    // 获取当前天气
    // this.getWeather()

  }

  
  // 不能这么做: 不会更新显示
  componentWillMount () {
    // this.title = this.getTitle()
    // this.getCity()
    // console.log(this.getCity())
  }

  /*
  当前组件卸载之前调用
   */
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }


  render() {

    const {currentTime, dayPictureUrl, weather,city,temperature} = this.state

    const username = memoryUtils.user.username

    // 得到当前需要显示的title
    const title = this.getTitle()
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎 , {username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span className='header-bottom-time'>{currentTime}</span>
            <span>{city}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
            <span style={{marginLeft: 5}}>{temperature}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
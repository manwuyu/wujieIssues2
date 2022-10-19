import { useEffect, useRef } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect, useHistory, useLocation } from "react-router-dom";
import Dialog from "./Dialog";
import Location from "./Location";
import Communication from "./Communication";
import State from "./State";
import Tag from "antd/es/tag";
import Button from "antd/es/button";
import "antd/es/tag/style/css";
import "antd/es/button/style/css";
import "antd/es/modal/style/css";
import "antd/es/select/style/css";
import "antd/es/popover/style/css";
import { useMount } from "ahooks";
import $ from "jquery";

const basename = process.env.NODE_ENV === "production" ? "/demo-react17/" : "";

const Home = () => (
  <div className="ztree">
    <h2>react17示例</h2>
    <div
      id="bmapv3"
      style={{ width: 300, height: 300, margin: "0 auto" }}
    ></div>
    <p>
      当前react版本{" "}
      <Tag style={{ verticalAlign: "text-top" }} color="blue">
        17.0.2
      </Tag>
    </p>
    <p>
      当前antd版本{" "}
      <Tag style={{ verticalAlign: "text-top" }} color="geekblue">
        4.18.3
      </Tag>
    </p>
    <p>
      <Button onClick={() => window.open("https://github.com/Tencent/wujie/tree/master/examples/react17")}>
        仓库地址
      </Button>
    </p>
  </div>
);

function Nav() {
  const history = useHistory();
  const routerJump = path => history.push(path);

  // 主应用告诉子应用跳转路由
  window.$wujie?.bus.$on("react17-router-change", routerJump);

  // 在 react17-sub 路由下主动告知主应用路由跳转，主应用也跳到相应路由高亮菜单栏
  const location = useLocation()
  useEffect(() => {
    window.$wujie?.bus.$emit('sub-route-change', "react17", location.pathname)
  }, [location])

  return (
    <nav>
    <NavLink to="/home">首页</NavLink> | <NavLink to="/dialog">弹窗</NavLink> |{" "}
    <NavLink to="/location">路由</NavLink> | <NavLink to="/communication">通信</NavLink> |{" "}
    <NavLink to="/state">状态</NavLink>
  </nav>

  )
}

function App() {
  const loadMapComplete = useRef();
  useMount(() => {
    // 异步加载js
    loadMapComplete.current = Promise.all([
      new Promise((resolve, reject) => {
        if (window.BGLMap) {
          resolve();
        } else {
          var link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('type', 'text/css');
          link.setAttribute('href', 'https://vortexplugin.cloudhw.cn/ztree/css/zTreeStyle/zTreeStyle.css');
          document.getElementsByTagName('head')[0].appendChild(link)
          
          $.getScript(
            `//api.map.baidu.com/api?v=2.0&ak=zmVwTKkuEXmcbmEtznL6Ip4EMspC2DWH&callback=initBmapv3`,
            (res) => {
              resolve();
            }
          );
          
          // document.write(
          //   `<link  type="text/css" rel="stylesheet"  href="https://vortexplugin.cloudhw.cn/ztree/css/zTreeStyle/zTreeStyle.css" />`
          // );

          // document.write(
          //   '<script type="text/javascript" src="https://api.map.baidu.com/getscript?v=2.0&ak=zmVwTKkuEXmcbmEtznL6Ip4EMspC2DWH&services=&t=20220901155637"></script>'
          // );
        }
      }),
    ]);
    loadMapComplete.current.then(() => {
      window.initBmapGl = ()=>{
          const bmapgl = new window.BMapGL.Map("bmapgl");
          bmapgl.centerAndZoom(new window.BMapGL.Point(116.28019, 40.049191), 19); // 初始化地图,设置中心点坐标和地图级别
          bmapgl.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
          bmapgl.setHeading(64.5);
          bmapgl.setTilt(73);
      }
      window.initBmapv3 = () => {
        var bmapv3 = new window.BMap.Map("bmapv3"); // 创建Map实例
        bmapv3.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
        //添加地图类型控件
        bmapv3.addControl(
          new window.BMap.MapTypeControl({
            mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP],
          })
        );
        bmapv3.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
        bmapv3.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      };
    });
  });
  return (
    <div className="App">
      <header className="App-header">
        <Router basename={basename}>
          <div>
            <Nav />
            <img src={logo} className="App-logo" alt="logo" />
            <Switch>
              <Route exact path="/home">
                <Home />
              </Route>
              <Route path="/dialog">
                <Dialog />
              </Route>
              <Route path="/location">
                <Location />
              </Route>
              <Route path="/communication">
                <Communication />
              </Route>
              <Route path="/state">
                <State />
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </Switch>
          </div>
        </Router>
      </header>
    </div>
  );
}

export default App;

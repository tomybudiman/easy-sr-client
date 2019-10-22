import React, {useState} from "react";
import {Link} from "react-router-dom";

import Translator from "../Translator";
import history from "../../utils/history";
import sidebarJson from "../../data/sidebar";
import {sidebarChildItemHeight} from "../../views/Home/index.scss";

const rootRoute = history.location.pathname.match(/^\/[^/]+/)[0];

const SidebarItem = ({data, onClick, toggleSidebarItemCb}) => {
  const itemHeight = parseFloat(sidebarChildItemHeight);
  return(
    <div className="navbar-item">
      <div className="first-row" onClick={e => {
        if(typeof onClick === "function"){
          onClick({e, data});
        }
      }}>
        <p>
          {data.iconClassname ? <i className={data.iconClassname}/> : null}
          <Translator id={data.label}/>
        </p>
        {data.child && data.isExpanded !== undefined ? (
          <button onClick={e => toggleSidebarItemCb(data.id)} className={data.isExpanded ? "expanded" : null}>
            <i className={data.isExpanded ? "fas fa-angle-left fas-rotated" : "fas fa-angle-left"}/>
          </button>
        ) : null}
      </div>
      {data.child && data.isExpanded !== undefined ? (
        <div className="child-item" style={data.isExpanded ? {height: itemHeight * data.child.length} : {height: 0}}>
          {data.child.map((each, i) => {
            if(each.path){
              return(
                <Link to={rootRoute.replace(/\/$/, "")+each.path} key={i} onClick={e => onClick({e, data: each})}>
                  <SidebarItem data={each}/>
                </Link>
              )
            }else{
              return <SidebarItem data={each} key={i} onClick={e => onClick({e: e.e, data: each})}/>
            }
          })}
        </div>
      ) : null}
    </div>
  )
};

const SidebarContent = ({visible, onClickSidebar}) => {
  const [sidebar, setSidebar] = useState(sidebarJson);
  const updateSidebar = (objKey) => {
    const newSidebar = sidebar.map(each => {
      if(each.id === objKey){
        return {...each, isExpanded: !each.isExpanded}
      }
      return each
    });
    setSidebar(newSidebar);
  };
  return(
    <div className={visible ? "navbar-content navbar-content-visible" : "navbar-content"}>
      {sidebar.map((each, i) => {
        if(each.path){
          return(
            <Link to={rootRoute.replace(/\/$/, "")+each.path} key={i}>
              <SidebarItem data={each}  onClick={e => onClickSidebar(e)} toggleSidebarItemCb={objKey => updateSidebar(objKey)}/>
            </Link>
          )
        }else{
          return(
            <SidebarItem
              key={i}
              data={each}
              onClick={e => onClickSidebar(e)}
              toggleSidebarItemCb={objKey => updateSidebar(objKey)}/>
          )
        }
      })}
    </div>
  )
};

const DashboardSidebar = ({sidebarOpen, setSidebarOpen, sidebarOnClickHandler}) => {
  const [screenMobile, setScreenMobile] = useState(window.innerWidth <= 768);
  // Resize Event
  window.addEventListener("resize", () => {
    setScreenMobile(window.innerWidth <= 768);
    if(sidebarOpen){
      setSidebarOpen(window.innerWidth > 768);
    }
  });
  return(
    <React.Fragment>
      <div
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={screenMobile && sidebarOpen ? "overlay-dark" : "overlay-dark overlay-dark-inactive"}/>
      <div className={sidebarOpen ? "sidebar" : "sidebar sidebar-inactive"}>
        <button
          title={sidebarOpen ? "Minimize" : "Open"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={sidebarOpen ? "sidebar-toggle toggle-close" : "sidebar-toggle"}>
          <hr/><hr/><hr/>
        </button>
        <hr className="divider" style={sidebarOpen ? {opacity: 1} : {opacity: 0}}/>
        <SidebarContent visible={sidebarOpen} onClickSidebar={data => sidebarOnClickHandler(data)}/>
      </div>
    </React.Fragment>
  )
};

export default DashboardSidebar
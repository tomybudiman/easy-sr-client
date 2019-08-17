import React, {useState} from "react";
import Translator from "../../components/Translator";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import {sidebarChildItemHeight} from "./index.scss";
import sidebarJson from "../../data/sidebar";

const SidebarItem = ({data, toggleSidebarItemCb}) => {
  const itemHeight = parseFloat(sidebarChildItemHeight);
  const RenderBase = () => (
    <div className="navbar-item">
      <div className="first-row">
        <p><Translator id={data.label}/></p>
        {data.child && data.isExpanded !== undefined ? (
          <button onClick={e => toggleSidebarItemCb(data.id)}>
            <i className="fas fa-angle-left"/>
          </button>
        ) : null}
      </div>
      {data.child && data.isExpanded !== undefined ? (
        <div className="child-item" style={data.isExpanded ? {height: itemHeight * data.child.length} : {height: 0}}>
          {data.child.map(each => <SidebarItem key={each.id} data={each}/>)}
        </div>
      ) : null}
    </div>
  );
  if(data.path){
    return <Link to={data.path}><RenderBase/></Link>
  }else{
    return <RenderBase/>
  }
};

const SidebarContent = () => {
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
    <div className="navbar-content">
      {sidebar.map(each => {
        return <SidebarItem key={each.id} data={each} toggleSidebarItemCb={objKey => updateSidebar(objKey)}/>
      })}
    </div>
  )
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return(
    <React.Fragment>
      <div className="appbar"></div>
      <div className="body">
        <div className={sidebarOpen ? "sidebar" : "sidebar sidebar-inactive"}>
          <button
            title={sidebarOpen ? "Minimize" : "Open"}
            onClick={e => setSidebarOpen(!sidebarOpen)}
            className={sidebarOpen ? "sidebar-toggle toggle-close" : "sidebar-toggle"}>
            <hr/><hr/><hr/>
          </button>
          <hr className="divider" style={sidebarOpen ? {opacity: 1} : {opacity: 0}}/>
          <SidebarContent/>
        </div>
        <div className="content">
        </div>
      </div>
    </React.Fragment>
  )
};

export default Home
import React, {useState} from "react";
import {Router, Route, Link} from "react-router-dom";
import Loadable from "react-loadable";
import {Modal} from "shards-react";

import history from "../../utils/history";
import sidebarJson from "../../data/sidebar";
import {sidebarChildItemHeight} from "./index.scss";
import Translator from "../../components/Translator";

const User = Loadable({
  loader: () => import("./User"),
  loading: () => <React.Fragment/>,
});

const Department = Loadable({
  loader: () => import("./Department"),
  loading: () => <React.Fragment/>,
});

const SidebarItem = ({data, onClick, toggleSidebarItemCb}) => {
  const itemHeight = parseFloat(sidebarChildItemHeight);
  return(
    <div className="navbar-item">
      <div className="first-row" onClick={e => {
        if(typeof onClick === "function"){
          onClick({e, data});
        }
      }}>
        <p><Translator id={data.label}/></p>
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
              return <Link to={each.path} key={i}><SidebarItem data={each}/></Link>
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
            <Link to={each.path}>
              <SidebarItem key={i} data={each} toggleSidebarItemCb={objKey => updateSidebar(objKey)}/>
            </Link>
          )
        }else{
          return(
            <SidebarItem
              key={i}
              data={each}
              onClick={e => onClickSidebar(e.data.id)}
              toggleSidebarItemCb={objKey => updateSidebar(objKey)}/>
          )
        }
      })}
    </div>
  )
};

const HomeModal = ({homeModal, toggleModal}) => {
  return(
    <Modal open={homeModal.state} toggle={toggleModal}>
      {homeModal.id}
    </Modal>
  )
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [homeModal, setHomeModal] = useState({state: false, id: null});
  const openHomeModal = (id) => {
    const allowedModalId = ["createUser", "createDepartment"];
    if(allowedModalId.includes(id)){
      setHomeModal({state: true, id});
    }
  };
  return(
    <React.Fragment>
      <HomeModal homeModal={homeModal} toggleModal={() => setHomeModal({...homeModal, state: !homeModal.state})}/>
      <div className="root">
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
            <SidebarContent visible={sidebarOpen} onClickSidebar={id => openHomeModal(id)}/>
          </div>
          <div className="content">
            <Router history={history}>
              <Route path="/user" component={User}/>
              <Route path="/department" component={Department}/>
            </Router>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
};

export default Home
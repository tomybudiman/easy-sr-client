import React, {useState} from "react";
import {Router, Route, Link, Switch, Redirect} from "react-router-dom";
import useStateWithCallback from "use-state-with-callback";
import Loadable from "react-loadable";
import {Modal} from "shards-react";

import history from "../../utils/history";
import sidebarJson from "../../data/sidebar";
import Translator from "../../components/Translator";
import DashboardAppbar from "../../components/DashboardAppbar";
import DashboardFooter from "../../components/DashboardFooter";
import PageRouteHeader from "../../components/PageRouteHeader";
import {sidebarChildItemHeight} from "./index.scss";

// Import Components
const User = Loadable({
  loader: () => import("./User"),
  loading: () => <React.Fragment/>,
});

const Department = Loadable({
  loader: () => import("./Department"),
  loading: () => <React.Fragment/>,
});

const SurveyMateriality = Loadable({
  loader: () => import("./SurveyMateriality"),
  loading: () => <React.Fragment/>,
});

const SurveyDisclosure = Loadable({
  loader: () => import("./SurveyDisclosure"),
  loading: () => <React.Fragment/>,
});

const Settings = Loadable({
  loader: () => import("./Settings"),
  loading: () => <React.Fragment/>,
});

const rootRoute = history.location.pathname.match(/^\/[^/]+/)[0];

// Core Components
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

const HomeModal = ({homeModal, toggleModal}) => {
  const [modalSize, setModalSize] = useState("md");
  const RenderComponent = () => {
    switch(homeModal.id){
      case "createUser":
        setModalSize("md");
        const {CreateUserModal} = require("./User");
        return <CreateUserModal onClickClose={toggleModal}/>;
      case "editUser":
        setModalSize("md");
        const {EditUserModal} = require("./User");
        return <EditUserModal onClickClose={toggleModal}/>;
      case "createDepartment":
        setModalSize("md");
        const {CreateDepartmentModal} = require("./Department");
        return <CreateDepartmentModal onClickClose={toggleModal}/>;
      default:
        return null
    }
  };
  return(
    <Modal open={homeModal.state} toggle={() => null} className="home-modal" size={modalSize}>
      <RenderComponent/>
    </Modal>
  )
};

const HomeBody = ({openHomeModal, prevEvent}) => {
  const [screenMobile, setScreenMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useStateWithCallback(!screenMobile, () => {
    document.querySelector(".sidebar").scrollTo(0, 0);
  });
  // Methods
  const sidebarOnClickHandler = data => {
    const closeModalScopeId = ["dashboard", "listUser", "createUser", "department", "materiality", "disclosure"];
    openHomeModal(data);
    if(closeModalScopeId.includes(data.data.id) && screenMobile){
      setSidebarOpen(!sidebarOpen);
    }
  };
  // Window Resize Event
  window.addEventListener("resize", () => {
    setScreenMobile(window.innerWidth <= 768);
    if(sidebarOpen){
      setSidebarOpen(window.innerWidth > 768);
    }
  });
  return(
    <div className="body">
      <div
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={screenMobile && sidebarOpen ? "overlay-dark" : "overlay-dark overlay-dark-inactive"}/>
      <div className={sidebarOpen ? "sidebar" : "sidebar sidebar-inactive"}>
        <button
          title={sidebarOpen ? "Minimize" : "Open"}
          onClick={e => setSidebarOpen(!sidebarOpen)}
          className={sidebarOpen ? "sidebar-toggle toggle-close" : "sidebar-toggle"}>
          <hr/><hr/><hr/>
        </button>
        <hr className="divider" style={sidebarOpen ? {opacity: 1} : {opacity: 0}}/>
        <SidebarContent visible={sidebarOpen} onClickSidebar={data => sidebarOnClickHandler(data)}/>
      </div>
      <div className={screenMobile && sidebarOpen ? "content content-blur" : "content"}>
        <div className="content-body">
          <Router history={history}>
            <Switch>
              <Route exact path={`${rootRoute}/user`} render={() => <User onClickEvent={openHomeModal} prevEvent={prevEvent}/>}/>
              <Route exact path={`${rootRoute}/department`} render={() => <Department onClickEvent={openHomeModal} prevEvent={prevEvent}/>}/>
              <Route exact path={`${rootRoute}/survey/materiality`} component={SurveyMateriality}/>
              <Route exact path={`${rootRoute}/survey/disclosure`} component={SurveyDisclosure}/>
              <Route render={() => <Redirect to={rootRoute}/>}/>
            </Switch>
          </Router>
        </div>
        <DashboardFooter/>
      </div>
    </div>
  )
};

const HomeColumnWrapper = ({children}) => (
  <div className="body-column">
    <div className="body-column-content">
      <PageRouteHeader>
        <Translator id="settingsGroup.settings"/>
      </PageRouteHeader>
      {children}
    </div>
    <DashboardFooter/>
  </div>
);

const Home = () => {
  const [homeModal, setHomeModal] = useState({state: false, id: null});
  const [prevEvent, setNewEvent] = useState(null);
  // Methods
  const openHomeModal = ({data}) => {
    const allowedModalId = ["createUser", "editUser", "createDepartment"];
    if(allowedModalId.includes(data.id)){
      setHomeModal({state: true, id: data.id});
    }
  };
  const toggleModal = event => {
    setHomeModal({...homeModal, state: !homeModal.state});
    setNewEvent(event);
  };
  return(
    <React.Fragment>
      <HomeModal homeModal={homeModal} toggleModal={toggleModal}/>
      <div className="root">
        <DashboardAppbar/>
        <Router history={history}>
          <Switch>
            <Route exact path={`${rootRoute}/settings`} render={() => (
              <HomeColumnWrapper><Settings/></HomeColumnWrapper>
            )}/>
            <Route path={rootRoute} render={() => <HomeBody prevEvent={prevEvent} openHomeModal={openHomeModal}/>}/>
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  )
};

export default Home
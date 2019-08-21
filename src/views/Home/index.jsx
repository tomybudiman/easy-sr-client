import React, {useState} from "react";
import {Router, Route, Link, Switch, Redirect} from "react-router-dom";
import Loadable from "react-loadable";
import {Modal} from "shards-react";
import useStateWithCallback from "use-state-with-callback";

import store from "../../state";
import history from "../../utils/history";
import sidebarJson from "../../data/sidebar";
import {changeLocale} from "../../state/actions";
import {sidebarChildItemHeight} from "./index.scss";
import Translator from "../../components/Translator";

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

const rootRoute = history.location.pathname.match(/^\/[^\/]+/)[0];

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
              return (
                <Link to={rootRoute+each.path} key={i} onClick={e => onClick({e, data: each})}>
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
            <Link to={rootRoute+each.path}>
              <SidebarItem key={i} data={each}  onClick={e => onClickSidebar(e)} toggleSidebarItemCb={objKey => updateSidebar(objKey)}/>
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
        return <CreateUserModal/>
      case "createDepartment":
        setModalSize("sm");
        const {CreateDepartmentModal} = require("./Department");
        return <CreateDepartmentModal/>
      default:
        return null
    }
  }
  return(
    <Modal open={homeModal.state} toggle={toggleModal} className="home-modal" size={modalSize}>
      <RenderComponent/>
    </Modal>
  )
};

const Home = () => {
  const [activeLocale, setActiveLocale] = useState(store.getState().reducerLocale.locale);
  const [screenMobile, setScreenMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useStateWithCallback(!screenMobile, () => {
    document.querySelector(".sidebar").scrollTo(0, 0);
  });
  const [homeModal, setHomeModal] = useState({state: false, id: null});
  const openHomeModal = ({data}) => {
    const allowedModalId = ["createUser", "createDepartment"];
    if(allowedModalId.includes(data.id)){
      setHomeModal({state: true, id: data.id});
    }
  };
  const sidebarOnClickHandler = (data) => {
    const closeModalScopeId = ["listUser", "createUser", "listDepartment", "createDepartment", "materiality", "disclosure"];
    openHomeModal(data);
    if(closeModalScopeId.includes(data.data.id) && screenMobile){
      setSidebarOpen(!sidebarOpen);
    }
  };
  store.subscribe(() => {
    setActiveLocale(store.getState().reducerLocale.locale);
  });
  // Window Resize Event
  window.addEventListener("resize", e => {
    setScreenMobile(window.innerWidth <= 768);
    if(sidebarOpen){
      setSidebarOpen(window.innerWidth > 768);
    }
  });
  return(
    <React.Fragment>
      <HomeModal homeModal={homeModal} toggleModal={() => setHomeModal({...homeModal, state: !homeModal.state})}/>
      <div className="root">
        <div className="appbar">
          <div className="user-loggedin" tabIndex="-1">
            <div className="selector-container">
              <div className="user-logo-text">
                <p>TB</p>
              </div>
              <div className="user-identity" onClick={() => console.log('ok')}>
                <p>Tomy Budiman</p>
                <button>
                  <i className="fas fa-angle-down"/>
                </button>
              </div>
            </div>
            <div className="user-loggedin-dialog"></div>
          </div>
        </div>
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
                  <Route exact path={`${rootRoute}/user`} component={User}/>
                  <Route exact path={`${rootRoute}/department`} component={Department}/>
                  <Route exact path={`${rootRoute}/survey/materiality`} component={SurveyMateriality}/>
                  <Route exact path={`${rootRoute}/survey/disclosure`} component={SurveyDisclosure}/>
                  <Route render={() => <Redirect to={rootRoute}/>}/>
                </Switch>
              </Router>
            </div>
            <div className="body-footer-card">
              <div className="lang-switcher">
                <p
                  className={activeLocale === "id" ? "current-locale" : null}
                  onClick={() => store.dispatch(changeLocale("id"))}>ID</p>
                <span className="separator">&bull;</span>
                <p
                  className={activeLocale === "en" ? "current-locale" : null}
                  onClick={() => store.dispatch(changeLocale("en"))}>EN</p>
              </div>
              <p className="copyright-text">
                Brand &copy; {new Date().getFullYear()} <Translator id="commonGroup.allRightsReserved"/>
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
};

export default Home
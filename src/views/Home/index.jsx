import React, {useState} from "react";
import {Router, Route, Switch, Redirect} from "react-router-dom";
import useStateWithCallback from "use-state-with-callback";
import Loadable from "react-loadable";
import {Modal} from "shards-react";

import history from "../../utils/history";
import Translator from "../../components/Translator";
import DashboardAppbar from "../../components/DashboardAppbar";
import DashboardFooter from "../../components/DashboardFooter";
import PageRouteHeader from "../../components/PageRouteHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import SafeAccessRoute from "../../components/Helpers/SafeAccessRoute";

// Import Components
const Organization = Loadable({
  loader: () => import("./Organization"),
  loading: () => <React.Fragment/>,
});

const Industry = Loadable({
  loader: () => import("./Industry"),
  loading: () => <React.Fragment/>,
});

const User = Loadable({
  loader: () => import("./User"),
  loading: () => <React.Fragment/>,
});

const Department = Loadable({
  loader: () => import("./Department"),
  loading: () => <React.Fragment/>,
});

const SurveyForm = Loadable({
  loader: () => import("./SurveyForm"),
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
const HomeModal = ({homeModal, toggleModal}) => {
  const [modalSize, setModalSize] = useState("md");
  const RenderComponent = () => {
    switch(homeModal.id){
      case "createIndustry":
        setModalSize("md");
        const {CreateIndustryModal} = require("./Industry");
        return <CreateIndustryModal onClickClose={toggleModal}/>;
      case "editIndustry":
        setModalSize("md");
        const {EditIndustryModal} = require("./Industry");
        return <EditIndustryModal onClickClose={toggleModal}/>;
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
      case "editDepartment":
        setModalSize("md");
        const {EditDepartmentModal} = require("./Department");
        return <EditDepartmentModal onClickClose={toggleModal}/>;
      case "createMateriality":
        setModalSize("md");
        const {CreateMaterialityModal} = require("./SurveyMateriality");
        return <CreateMaterialityModal onClickClose={toggleModal}/>;
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
  // Resize Event
  window.addEventListener("resize", () => {
    setScreenMobile(window.innerWidth <= 768);
    if(sidebarOpen){
      setSidebarOpen(window.innerWidth > 768);
    }
  });
  return(
    <div className="body">
      <DashboardSidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} sidebarOnClickHandler={sidebarOnClickHandler}/>
      <div className={screenMobile && sidebarOpen ? "content content-blur" : "content"}>
        <div className="content-body">
          <Router history={history}>
            <Switch>
              <Route exact path={`${rootRoute}/organization`} render={() => (
                <Organization onClickEvent={openHomeModal}/>
              )}/>
              <Route exact path={`${rootRoute}/industry`} render={() => (
                <Industry onClickEvent={openHomeModal} prevEvent={prevEvent}/>
              )}/>
              <Route exact path={`${rootRoute}/admin`} render={() => (
                <User onClickEvent={openHomeModal} prevEvent={prevEvent}/>
              )}/>
              <Route exact path={`${rootRoute}/user`} render={() => (
                <User onClickEvent={openHomeModal} prevEvent={prevEvent}/>
              )}/>
              <Route exact path={`${rootRoute}/department`} render={() => (
                <Department onClickEvent={openHomeModal} prevEvent={prevEvent}/>
              )}/>
              <Route exact path={`${rootRoute}/survey/materiality`} component={() => (
                <SurveyMateriality onClickEvent={openHomeModal}/>
              )}/>
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

const HomeColumnWrapper = ({children, title}) => (
  <div className="body-column">
    <div className="body-column-content">
      {title && typeof title === "string" ? <PageRouteHeader><Translator id={title}/></PageRouteHeader> : null}
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
    const allowedModalId = ["createIndustry", "editIndustry", "createUser", "editUser", "createDepartment", "createDepartment", "editDepartment", "createMateriality"];
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
            <SafeAccessRoute exact path={`${rootRoute}/settings`} render={() => (
              <HomeColumnWrapper title="settingsGroup.settings"><Settings/></HomeColumnWrapper>
            )}/>
            <SafeAccessRoute exact path={`${rootRoute}/survey/form`} render={() => (
              <HomeColumnWrapper><SurveyForm/></HomeColumnWrapper>
            )}/>
            <Route exact path={`${rootRoute}/unauthorized`} render={() => (
              <HomeColumnWrapper><h1>404</h1></HomeColumnWrapper>
            )}/>
            <SafeAccessRoute path={rootRoute} render={() => (
              <HomeBody prevEvent={prevEvent} openHomeModal={openHomeModal}/>
            )}/>
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  )
};

export default Home
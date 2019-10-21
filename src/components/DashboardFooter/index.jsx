import React, {useState} from "react";

import "./index.scss";
import store from "../../state";
import {changeLocale} from "../../state/actions";
import Translator from "../Translator";

const DashboardFooter = () => {
  const [activeLocale, setActiveLocale] = useState(store.getState().reducerLocale.locale);
  const updateLocale = id => {
    setActiveLocale(id);
    store.dispatch(changeLocale(id));
  };
  return(
    <div className="dashboard-footer-container">
      <div className="lang-switcher">
        <p
          className={activeLocale === "id" ? "current-locale" : null}
          onClick={() => updateLocale("id")}>ID</p>
        <span className="separator">&bull;</span>
        <p
          className={activeLocale === "en" ? "current-locale" : null}
          onClick={() => updateLocale("en")}>EN</p>
      </div>
      <p className="copyright-text">
        Brand &copy; {new Date().getFullYear()} <Translator id="commonGroup.allRightsReserved"/>
      </p>
    </div>
  )
};

export default DashboardFooter
import React from "react";
import {ModalBody, ModalHeader} from "shards-react";

import Translator from "../../../components/Translator";

const User = () => {
  return "User page"
};

export const CreateUserModal = () => {
  return(
    <React.Fragment>
      <ModalHeader>
        <Translator id="userGroup.createNewUser"/>
      </ModalHeader>
      <ModalBody className="create-user-modal-body">
      </ModalBody>
    </React.Fragment>
  )
};

export default User
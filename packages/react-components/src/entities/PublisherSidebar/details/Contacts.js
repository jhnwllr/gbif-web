/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import {FormattedMessage} from "react-intl"

import { Accordion } from "../../../components";
import { Contact } from "../../DatasetSidebar/details/Contacts"

export function Contacts({ data = {}, loading, error, ...props }) {

  const { organization } = data;

  return organization?.contacts?.length > 0 ? (
    <Accordion summary={<FormattedMessage id="dataset.contacts" defaultMessage="Contacts"/>} defaultOpen={true}>
      {organization.contacts.map(Contact)}
    </Accordion>
  ) : null;
}
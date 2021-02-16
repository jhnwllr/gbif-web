/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";


import { Accordion } from "../../../components";
import { Contact } from "../../DatasetSidebar/details/Contacts"

export function Contacts({ data = {}, loading, error, ...props }) {

  const { organization } = data;

  return organization?.contacts?.length > 0 ? (
    <Accordion summary="Contacts" defaultOpen={true}>
      {organization.contacts.map(Contact)}
    </Accordion>
  ) : null;
}
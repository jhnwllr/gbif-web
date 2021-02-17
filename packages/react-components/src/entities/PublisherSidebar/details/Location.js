/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { FormattedMessage, FormattedDate } from "react-intl";
import { Properties, Accordion } from "../../../components";
import { Map } from "./Map";
const { Term: T, Value: V } = Properties;

export function Location({ data = {}, loading, error, ...props }) {

  const { organization } = data;

  return (
    <Accordion summary={<FormattedMessage id="publisher.location" defaultMessage="Location"/>} defaultOpen={true}>
      <Properties horizontal={true}>
        {organization?.address && organization?.address?.length > 0 && (
          <>
            <T>
              <FormattedMessage id={`publisher.address`} defaultMessage={"Address"} />
            </T>
            <V>{organization.address.map(line => <div>{line}</div>)}</V>
          </>
        )}
        {organization?.city && (
          <>
            <T>
              <FormattedMessage id={`publisher.city`} defaultMessage={"City"} />
            </T>
            <V>{organization?.postalCode ? `${organization?.postalCode} - ` : ''}{organization?.city}</V>
          </>
        )}
         {organization?.province && (
          <>
            <T>
              <FormattedMessage id={`publisher.province`} defaultMessage={"Province"} />
            </T>
            <V>{organization?.province}</V>
          </>
        )}
         {organization?.country && (
          <>
            <T>
              <FormattedMessage id={`publisher.country`} defaultMessage={"Country"} />
            </T>
            <V><FormattedMessage id={`enums.countryCode.${organization?.country}`} defaultMessage={organization?.country} />
            </V>
          </>
        )}
        <T></T>
        <V>
          {organization?.latitude && organization?.longitude && (
            <Map
              latitude={organization?.latitude}
              longitude={organization?.longitude}
            />
          )}
        </V>
      </Properties>
    </Accordion>
  );
}



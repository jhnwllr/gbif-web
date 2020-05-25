/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import {
  Properties,
  Term,
  Value,
} from "../../../../components/Properties/Properties";
import { Accordion } from "../../../../components/Accordion/Accordion";
import get from "lodash/get";
import styles from "./styles";

export const ItemDetailsContainer = ({ padding = 8, ...props }) => {
  return <div css={styles.itemDetails({ padding })} {...props} />;
};

const ItemDetals = ({ item }) => {
  return (
    <ItemDetailsContainer>
      <h2 css={styles.speciesName({ fontSize: 14 })}>
        {get(item, "_source.gbifClassification.usage.name")}
      </h2>
      <Accordion summary="Classification">
        <Properties>
          {get(item, "_source.gbifClassification.classification").map((t) => (
            <React.Fragment key={t.name}>
              <Term>{t.rank}</Term>
              <Value>{t.name}</Value>
            </React.Fragment>
          ))}
        </Properties>
      </Accordion>
      <Properties>
        <Term>eventDate</Term>
        <Value>
          {get(item, `_source.eventDateSingle`)
            ? new Date(get(item, `_source.eventDateSingle`)).toDateString()
            : ""}
        </Value>
        <Term>location</Term>
        <Value>
          {get(item, `_source.stateProvince`)
            ? get(item, `_source.stateProvince`) + ", "
            : ""}
          {get(item, `_source.country`)}
        </Value>
        {["recordedBy", "datasetTitle", "publisherTitle"].map((i) => (
          <React.Fragment key={i}>
            <Term>{i}</Term>
            <Value>{get(item, `_source.${i}`)}</Value>
          </React.Fragment>
        ))}
      </Properties>
    </ItemDetailsContainer>
  );
};

export default ItemDetals;

/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Properties, Accordion, HyperText } from "../../../components";
const { Term: T, Value: V } = Properties;

export function Description({ data = {}, loading, error, ...props }) {
  const { organization } = data;

  return organization?.description || organization?.endorsingNode ? (
    <Accordion summary="Description" defaultOpen={true}>
      <Properties horizontal={true}>
        {organization?.description && (
          <>
            <T></T>
            <V>
              <HyperText text={organization?.description} />
            </V>
          </>
        )}
        {organization?.endorsingNode && (
          <>
            <T>Endorsing node</T>
            <V>
              <a
                href={`https://www.gbif.org/node/${organization?.endorsingNode?.key}`}
              >
                {organization?.endorsingNode?.title}
              </a>
            </V>
          </>
        )}
      </Properties>
    </Accordion>
  ) : null;
}

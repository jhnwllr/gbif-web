/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useContext } from "react";
import { FormattedDate, FormattedMessage } from "react-intl";
import ThemeContext from "../../../style/themes/ThemeContext";
import * as css from "../../DatasetSidebar/styles";
import { Row, Col } from "../../../components";

import { Logo } from "../../DatasetSidebar/details/Logo";
export function Header({ data, loading, error, ...props }) {
  const theme = useContext(ThemeContext);
  const item = data?.organization;
  return (
    <>
      <Row>
        <div css={css.breadcrumb({ theme })}>
          Publisher
          <span css={css.breadcrumbSeperator({ theme })}>
            {" "}
            Since{" "}
            <FormattedDate
              value={item?.created}
              year="numeric"
              month="long"
              day="2-digit"
            />
          </span>
        </div>
      </Row>
      <Row wrap="no-wrap" css={css.header({ theme })}>
        <Col grow>
          <div css={css.headline({ theme })}>
            <h3>{item?.title}</h3>
          </div>
        </Col>
        {<Col>{item?.logoUrl && <Logo url={item.logoUrl} />}</Col>}
      </Row>
      <Row></Row>
    </>
  );
}

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
          <FormattedMessage id="publisher.publisher" defaultMessage="Publisher" />
          <span css={css.breadcrumbSeperator({ theme })}>
              <FormattedMessage 
              id="publisher.publisherSince" 
              values={{formattedDate: <FormattedDate
                value={item?.created}
                year="numeric"
                month="long"
                day="2-digit"
              />}}
              defaultMessage={<span>Since <FormattedDate
                value={item?.created}
                year="numeric"
                month="long"
                day="2-digit"
              /></span>} />
          </span>
        </div>
      </Row>
      <Row wrap="no-wrap" css={css.header({ theme })}>
        <Col grow>
          <div css={css.headline({ theme })}>
            <h3>{item?.title}</h3>
          </div>
        </Col>
        {<Col style={{textAlign: 'right'}}>{item?.logoUrl && <Logo url={item.logoUrl} />}</Col>}
      </Row>
      <Row></Row>
    </>
  );
}

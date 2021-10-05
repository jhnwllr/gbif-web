
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, IconFeatures, Eyebrow } from "../../../components";
import { Globe } from './Globe';
import useBelow from '../../../utils/useBelow';
import { Header as HeaderWrapper } from '../../shared/Header';

export function Header({
  data,
  loading,
  error,
  className,
  children,
  ...props
}) {
  const isBelow = useBelow(500);
  const theme = useContext(ThemeContext);
  const item = data?.occurrence;
  return <HeaderWrapper>
    <Row wrap="no-wrap" css={css.header({ theme })} {...props}>
      {!isBelow && data?.occurrence?.volatile?.globe &&
        <Col grow={false} style={{ marginRight: 18 }}>
          <Globe {...data?.occurrence?.volatile?.globe} style={{ width: 120, height: 120 }} />
        </Col>
      }
      <Col grow>
        <div>
          <Eyebrow
            prefix={<FormattedMessage id="occurrenceDetails.occurrence" />}
            suffix={<FormattedDate value={data?.occurrence?.eventDate}
              year="numeric"
              month="long"
              day="2-digit" />} />
          <h1 dangerouslySetInnerHTML={{ __html: data?.occurrence?.gbifClassification?.usage?.formattedName }}></h1>
          {/* <div style={{color: 'orange', marginTop: 4}}>Published as: Polycauliona polycarpa hoffman</div> */}
          {/* <div style={{fontSize: 13}}><MajorRanks taxon={data?.occurrence?.gbifClassification} rank={data?.occurrence?.gbifClassification?.usage?.rank}/></div> */}
        </div>
        {/* <div>Engkabelej</div> */}
        {/* <div style={{fontSize: 12, marginTop: 18}}><MdLocationOn /> <FormattedMessage id={`enums.countryCode.${data?.occurrence?.countryCode}`} /></div> */}
        <div css={css.entitySummary({ theme })}>
          <IconFeatures css={css.features({ theme })}
            countryCode={item.countryCode}
            locality={item.locality}
          />
          <IconFeatures css={css.features({ theme })}
            stillImageCount={item.stillImageCount}
            movingImageCount={item.movingImageCount}
            soundCount={item.soundCount}
            typeStatus={item.typeStatus}
            basisOfRecord={item.basisOfRecord}
            isSequenced={item.volatile.features.isSequenced}
            isTreament={item.volatile.features.isTreament}
            isClustered={item.volatile.features.isClustered}
            isSamplingEvent={item.volatile.features.isSamplingEvent}
            issueCount={item?.issues?.length}
          />
        </div>
      </Col>
    </Row>
    {children}
  </HeaderWrapper>
};

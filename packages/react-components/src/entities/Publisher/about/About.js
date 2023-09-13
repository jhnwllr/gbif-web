
import { jsx, css as css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import * as styles from './styles';
import * as sharedStyles from '../../shared/styles';
import { Prose, HyperText, Toc, ContactList, ResourceSearchLink, Alert, Tooltip, Image, OptImage } from "../../../components";
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useRouteMatch } from 'react-router-dom';
import useBelow from '../../../utils/useBelow';
import env from '../../../../.env.json';

import { MdDownload, MdLink } from 'react-icons/md';
import { Card, CardHeader2, SideBarCard } from '../../shared';
import SiteContext from '../../../dataManagement/SiteContext';

const A = Prose.A;
const { NavItem } = Toc;
export function About({
  data = {},
  insights,
  loading,
  error,
  tocState,
  className,
  ...props
}) {
  const { formatMessage } = useIntl();
  const isBelowSidebar = useBelow(1000);
  const isBelowHorisontal = useBelow(700);
  let { url } = useRouteMatch();
  const siteContext = useContext(SiteContext);
  const [tocRefs] = useState({})
  const { publisher, occurrenceSearch, siteOccurrences } = data;
  // collect all refs to headlines for the TOC, e.g. ref={node => { tocRefs["description"] = {node, index: 0}; }}

  const scopeSmallerThanPublisherMessage = formatMessage({ id: "publisher.siteScopeSmallerThanPublisher", defaultMessage: "Visit [GBIF.org]({publisherUrl}) to explore the full publisher." }, { publisherUrl: `https://www.gbif.org/publisher/${publisher.key}` });
  const total = occurrenceSearch?.documents?.total;

  const technicalContact = publisher.contacts?.find(x => x.type === 'TECHNICAL_POINT_OF_CONTACT');

  const sideBarMetrics = <div>

    <SideBarCard>
      <div css={styles.sidebarCard}>
        <div css={styles.sidebarIcon}>
          <div><MdDownload /></div>
        </div>
        <div css={styles.sidebarCardContent}>
          <h5>
            <a href={`${env.API_V1}/occurrence/download/statistics/export?publishingOrgKey=${publisher.key}`} >
              <FormattedMessage id="publisher.getDownloadReport" />
            </a>
          </h5>
        </div>
      </div>
    </SideBarCard>

    {publisher.logoUrl && <SideBarCard>
      <div css={styles.sidebarCardWrapper}>
        <div css={styles.sidebarCard}>
          <div css={styles.sidebarLogo}>
            <OptImage src={publisher.logoUrl} alt="" />
          </div>
        </div>
      </div>
    </SideBarCard>}
    <SideBarCard>
      <div css={styles.sidebarCardWrapper}>
        {publisher.longitude && <div>
          <img style={{ width: '100%', display: 'block' }} src={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/static/pin-s-circle+285A98(${publisher.longitude},${publisher.latitude})/${publisher.longitude},${publisher.latitude},15,0/300x150@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />
        </div>}
        <div css={styles.sidebarCard}>
          {/* <div css={styles.sidebarIcon}>
            <div><MdPlaylistAddCheck /></div>
          </div> */}
          <div css={styles.sidebarCardContent}>
            <h5>
              {publisher.address}
            </h5>
            <address style={{ fontStyle: 'normal' }}>
              {publisher.city && <div>{publisher.city}</div>}
              {publisher.province && <div>{publisher.province}</div>}
              {publisher.postalCode && <div>{publisher.postalCode}</div>}
              {publisher.country && <div><FormattedMessage id={`enums.countryCode.${publisher.country}`} /></div>}
              {publisher.email && <div><A href={`mailto:${publisher.email}`}>{publisher.email}</A></div>}
              {publisher.phone && <div><A href={`tel:${publisher.phone}`}>{publisher.phone}</A></div>}
            </address>
          </div>
        </div>
      </div>
    </SideBarCard>
    <SideBarCard>
      <div css={styles.sidebarCardWrapper}>
        <div css={styles.sidebarCard}>
          <div css={styles.sidebarCardContent}>
            {publisher.endorsementApproved && <div style={{ marginBottom: 18 }}>
              <h5>Endorsed by: <A href="/country/FR">{publisher.endorsingNode.title}</A></h5>
              <p>
                Publishers need to be endorsed by a GBIF Participant Node. This endorsement confirms that the publisher is a legitimate organization and that it is committed to sharing biodiversity data through GBIF.
              </p>
            </div>}
            {publisher?.installation?.count === 1 && <div style={{ marginBottom: 18 }}>
              <h5>Installations: {publisher?.installation.results.map(x => <A href="/installation/1234-1234-1234-1234">{x.title} </A>)}</h5>
              <p>
                Some publishers run their own technical installations through which data is published to GBIF. Some installations are collaborations and may be shared by multiple publishers.
              </p>
            </div>}
            {publisher?.installation?.count > 1 && <div style={{ marginBottom: 18 }}>
              <h5>Installations: <ul>{publisher?.installation.results.map(x => <li><A href="/installation/1234-1234-1234-1234">{x.title} </A></li>)}</ul></h5>
              <p>
                Some publishers run their own technical installations through which data is published to GBIF. Some installations are collaborations and may be shared by multiple publishers.
              </p>
            </div>}
            {technicalContact?.email && <div style={{ marginBottom: 18 }}>
              <h5>Techincal contact: <A href={`mailto:${technicalContact.email}`}>{technicalContact.firstName} {technicalContact.lastName}</A></h5>
              <p>
                Who to get in contact with in case of IT related questions. Not for biodiversity specific questions.
              </p>
            </div>}
            {publisher.country && <div style={{ marginBottom: 18 }}>
              <h5>Country or area: <A href="/installation/1234-1234-1234-1234"><FormattedMessage id={`enums.countryCode.${publisher.country}`} /></A></h5>
              <p>
                The country or area where the publisher is located. For international organizations, this is the country where the main office is located.
              </p>
            </div>}
          </div>
        </div>
      </div>
    </SideBarCard >
  </div >;

  return <>
    <div css={sharedStyles.withSideBar({ hasSidebar: !isBelowSidebar })}>
      <div style={{ width: '100%', overflow: 'auto' }}>

        {siteOccurrences.documents.total - total < 0 && <Alert css={css`width: 100%; margin-top: 12px; a { color: inherit!important; text-decoration: underline!important;}`} tagText="Info" tagType="info">
          <HyperText inline text={scopeSmallerThanPublisherMessage} sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }} />
        </Alert>}

        {isBelowSidebar && <div>
          {sideBarMetrics}
        </div>}

        {publisher.description && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["description"] = { node, index: 0, title: <FormattedMessage id="publisher.description" /> } }}>
            <FormattedMessage id="publisher.description" />
          </CardHeader2>
          <Prose css={sharedStyles.cardProse}>
            <HyperText text={publisher.description} />
          </Prose>
        </Card>}

        {publisher?.contacts?.length > 0 && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["contacts"] = { node, index: 8, title: <FormattedMessage id="publisher.contacts" /> }; }}>
            <FormattedMessage id="publisher.contacts" />
          </CardHeader2>
          <ContactList contacts={publisher.contacts} style={{ paddingInlineStart: 0 }} />
        </Card>}

      </div>
      {!isBelowSidebar && <div css={sharedStyles.sideBar}>
        {sideBarMetrics}
        <nav css={sharedStyles.sideBarNav}>
          <SideBarCard>
            {!siteContext?.publisher?.disableGbifTocLink && <ul>
              <li>
                <NavItem href={`${env.GBIF_ORG}/publisher/${publisher.key}`}>View on GBIF.org <MdLink /></NavItem>
              </li>
            </ul>}
          </SideBarCard>
        </nav>
      </div>}
    </div>
  </>
};
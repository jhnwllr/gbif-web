import { jsx, css } from '@emotion/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { FormattedMessage } from 'react-intl';
import {
  Properties,
  Property,
  ListItem,
  Image,
  HyperText,
  Prose,
} from '../../../components';
import { Card, CardHeader2 } from '../../shared';
import sortBy from 'lodash/sortBy';
import {
  MdMailOutline as MailIcon,
  MdPhone as PhoneIcon,
} from 'react-icons/md';

const { Term: T, Value: V, EmptyValue } = Properties;
const Name2Avatar = ListItem.Name2Avatar;

export default function About({
  data = {},
  loading,
  error,
  taxon,
  institution,
  className,
}) {
  return (
    <div>
      <div
        css={css`
          padding-bottom: 100px;
          display: flex;
          margin: 0 -12px;
        `}
      >
        <div
          css={css`
            flex: 1 1 auto;
            margin: 0 12px;
          `}
        >
          <Card style={{ marginTop: 12, marginBottom: 24 }}>
            <CardHeader2>
              <FormattedMessage
                id='occurrenceFieldNames.taxonomicClassification'
                deafultMessage='Classification'
              />
            </CardHeader2>
            <Prose
              style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}
            >
              {institution?.description && (
                <HyperText text={institution.description} />
              )}
              {!institution?.description && <EmptyValue />}
            </Prose>
            <Properties
              style={{ fontSize: 16, marginBottom: 12 }}
              breakpoint={800}
            >
              <Property
                value={taxon?.kingdom}
                labelId='occurrenceFieldNames.kingdom'
                showEmpty
              />
              <Property
                value={taxon?.phylum}
                labelId='occurrenceFieldNames.phylum'
                showEmpty
              />
              <Property
                value={taxon?.class}
                labelId='occurrenceFieldNames.class'
                showEmpty
              />
              <Property
                value={taxon?.order}
                labelId='occurrenceFieldNames.order'
                showEmpty
              />
              <Property
                value={taxon?.family}
                labelId='occurrenceFieldNames.family'
                showEmpty
              />
              <Property
                value={taxon?.genus}
                labelId='occurrenceFieldNames.genus'
                showEmpty
              />
              <Property
                value={taxon?.species}
                labelId='occurrenceFieldNames.species'
                showEmpty
              />
            </Properties>
          </Card>
          <Card style={{ marginTop: 24, marginBottom: 24 }}>
            <CardHeader2>Contact</CardHeader2>
            <Properties
              style={{ fontSize: 16, marginBottom: 12 }}
              breakpoint={800}
            >
              <Property value={institution?.email} labelId='grscicoll.email' />
              <Property
                value={institution?.homepage}
                labelId='grscicoll.homepage'
              />
              <Property
                value={institution?.address?.country}
                labelId='grscicoll.country'
                showEmpty
                formatter={(countryCode) => (
                  <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                )}
              />
              <Property
                value={institution?.address?.province}
                labelId='grscicoll.province'
              />
              <Property
                value={institution?.address?.city}
                labelId='grscicoll.city'
              />
              <Property
                value={institution?.address?.postalCode}
                labelId='grscicoll.postalCode'
              />
              <Property
                value={institution?.address?.address}
                labelId='grscicoll.address'
              />
              <Property
                value={institution?.logoUrl}
                labelId='grscicoll.logo'
                formatter={(logoUrl) => <Image src={logoUrl} h={120} />}
              />
            </Properties>
            {institution?.contactPersons?.length > 0 && (
              <div
                css={css`
                  display: flex;
                  flex-wrap: wrap;
                  padding-top: 24px;
                  border-top: 1px solid #eee;
                  margin-top: 24px;
                  > div {
                    flex: 1 1 auto;
                    width: 40%;
                    max-width: 400px;
                    min-width: 300px;
                    margin: 12px;
                  }
                `}
              >
                {sortBy(institution.contactPersons, 'position').map(
                  (contact) => {
                    let actions = [];
                    if (contact.email?.[0])
                      actions.push(
                        <a href={`mailto:${contact.email?.[0]}`}>
                          <MailIcon />
                          {contact.email?.[0]}
                        </a>
                      );
                    if (contact.phone?.[0])
                      actions.push(
                        <a href={`tel:${contact.phone?.[0]}`}>
                          <PhoneIcon />
                          {contact.phone?.[0]}
                        </a>
                      );
                    return (
                      <ListItem
                        key={contact.key}
                        isCard
                        title={`${contact.firstName} ${contact.lastName}`}
                        avatar={
                          <Name2Avatar
                            first={contact.firstName}
                            last={contact.lastName}
                          />
                        }
                        description={contact.position?.[0]}
                        footerActions={actions}
                      >
                        {contact.researchPursuits}
                      </ListItem>
                    );
                  }
                )}
              </div>
            )}
          </Card>

          <Card style={{ marginTop: 24, marginBottom: 24 }}>
            <CardHeader2>Identifiers</CardHeader2>
            <Properties
              style={{ fontSize: 16, marginBottom: 12 }}
              breakpoint={800}
            >
              <Property
                value={institution?.code}
                labelId='grscicoll.code'
                showEmpty
              />
              {institution?.alternativeCodes?.length > 0 && (
                <Property
                  value={institution.alternativeCodes}
                  labelId='grscicoll.alternativeCodes'
                >
                  <ul
                    css={css`
                      padding: 0;
                      margin: 0;
                      list-style: none;
                    `}
                  >
                    {institution.alternativeCodes.map((x, i) => {
                      return (
                        <li
                          key={`${i}_${x.code}`}
                          css={css`
                            margin-bottom: 8px;
                          `}
                        >
                          <div>{x.code}</div>
                          <div
                            css={css`
                              color: var(--color400);
                            `}
                          >
                            {x.description}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Property>
              )}
              <Property
                value={institution?.additionalNames}
                labelId='grscicoll.additionalNames'
              />
              {institution?.identifiers?.length > 0 && (
                <Property
                  value={institution.identifiers}
                  labelId='grscicoll.identifiers'
                >
                  <ul
                    css={css`
                      padding: 0;
                      margin: 0;
                      list-style: none;
                    `}
                  >
                    {institution.identifiers.map((x, i) => {
                      let identifier = x.identifier;
                      if (x.type === 'ROR') {
                        identifier = 'https://ror.org/' + x.identifier;
                      } else if (x.type === 'GRID') {
                        identifier =
                          'https://grid.ac/institutes/' + x.identifier; // GRID doesn't exists anymore. They left the space and refer to ROR as checked today September 2022
                      } else if (x.type === 'IH_IRN') {
                        identifier =
                          'http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=' +
                          x.identifier.substr(12);
                      }

                      return (
                        <li
                          key={`${i}_${x.identifier}`}
                          css={css`
                            margin-bottom: 8px;
                          `}
                        >
                          <div
                            css={css`
                              color: var(--color400);
                              font-size: 0.9em;
                            `}
                          >
                            <FormattedMessage
                              id={`enums.identifierType.${x.type}`}
                              defaultMessage={x.type}
                            />
                          </div>
                          <div>
                            <HyperText text={identifier} inline />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Property>
              )}
            </Properties>
          </Card>
        </div>
      </div>
    </div>
  );
}

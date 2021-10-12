
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import { RiExternalLinkLine } from 'react-icons/ri';
import { MdFileDownload } from 'react-icons/md';
import * as css from './styles';
import * as sharedCss from '../../../shared/styles';
import { Row, Col, Switch, Tag, Properties, HyperText } from "../../../../components";
import { Groups } from '../Groups';

const { Term, Value } = Properties;

const supportedFormats = ['audio/ogg', 'audio/x-wav', 'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/mp4'];

export function Media({
  data = {},
  termMap,
  isSpecimen,
  loading,
  fieldGroups,
  setActiveImage,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { occurrence } = data;
  if (loading || !occurrence) return <h2>Loading</h2>;//TODO replace with proper skeleton loader

  return <div>
    <ul css={css.mediaList}>
      <Sounds       {...{ occurrence, termMap }} />
      <MovingImages {...{ occurrence, termMap }} />
      <Images occurrence={occurrence} />
    </ul>
  </div>
};

function Images({ occurrence, ...props }) {
  return <>
    {occurrence.stillImages?.map(media => <li>
      <div css={css.mediaCard}>
        <figure css={css.mediaArea}>
          <a target="_blank" href={`https://www.gbif.org/tools/zoom/simple.html?src=${encodeURIComponent(media.identifier)}`}>
            <img src={media.identifier} />
          </a>
        </figure>
        <Caption media={media} />
      </div>
    </li>)}
  </>
}

function Sounds({ occurrence, termMap, ...props }) {
  return <>
    {occurrence.sounds?.map((media, i) => {
      const knownFormat = supportedFormats.includes(media.format);
      return <li key={i}>
        <div css={css.mediaCard}>
          <div css={css.mediaArea}>
            {knownFormat && <>
              <audio controls>
                <source src={media.identifier} type={media.format} />
                Unable to play
              </audio>
              {<div>
                <a href={termMap?.references?.value || media.identifier}>
                  If it isn't working try the publishers site instead <RiExternalLinkLine />
                </a>
              </div>}
            </>}
          </div>
          <Caption media={media} />
        </div>
      </li>
    })}
  </>
}

function MovingImages({ occurrence, termMap, ...props }) {
  return <>
    {occurrence.movingImages?.map((media, i) => {
      const knownFormat = ['video/mp4', 'video/ogg'].includes(media.format);
      return <li key={i}>
        <div css={css.mediaCard}>
          <div css={css.mediaArea}>
            {knownFormat && <>
              <video controls>
                <source src={media.identifier} type={media.format} />
                Unable to play
              </video>
              {<div>
                <a href={termMap?.references?.value || media.identifier}>
                  If it isn't working try the publishers site instead <RiExternalLinkLine />
                </a>
              </div>}
            </>}
            {!knownFormat && <a href={media.identifier} css={css.downloadMedia}>
              <div className="gb-download-icon"><MdFileDownload /></div>
              <div>Download media file</div>
            </a>}
          </div>
          <Caption media={media} />
        </div>
      </li>
    })}
  </>
}

function Caption({ media, ...props }) {
  return <figcaption>
    <Properties style={{fontSize: '85%'}}>
      {['description', 'format', 'identifier', 'created', 'creator', 'license', 'publisher', 'references', 'rightsholder']
        .filter(x => media[x]).map(x => <React.Fragment key={x}>
          <Term>
            <FormattedMessage id={`occurrenceFieldNames.${x}`} />
          </Term>
          <Value>
            <HyperText text={media[x]} />
          </Value>
        </React.Fragment>)}
    </Properties>
  </figcaption>
}
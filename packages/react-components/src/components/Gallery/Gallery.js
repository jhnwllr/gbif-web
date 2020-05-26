/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useState, useCallback, useEffect } from 'react';
import { useDialogState, Dialog } from "reakit/Dialog";
// import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { Button } from '../Button/Button';
import styles from './styles';
import { GalleryDetails, getThumbnail } from './GalleryDetails';

export const GalleryTileSkeleton = ({ height=150, ...props }) => {
  return <div css={styles.skeletonTile({height})} {...props}></div>
};

  export const GalleryTile = ({ src, onSelect, height=150, children, ...props }) => {
  const theme = useContext(ThemeContext);
  const [ratio, setRatio] = useState(1);
  const [isValid, setValid] = useState(false);
  const onLoad = useCallback((event) => {
    setValid(true);
    const ratio = (event.target.naturalWidth) / event.target.naturalHeight;
    setRatio(ratio);
  }, []);

  const backgroundImage = getThumbnail(src);
  const style = {
    width: ratio * height,
    backgroundImage: `url('${backgroundImage}')`
  };
  if (ratio < 0.5 || ratio > 2) {
    style.backgroundSize = 'contain';
    style.width = height;
    if (ratio > 2) style.width = height*1.8;
  }
  return <Button appearance="text" 
    css={styles.galleryTile({ theme })} 
    style={style} 
    onClick={onSelect} {...props}
    title="View details"
    >
    <img src={backgroundImage}
      width={height}
      onLoad={onLoad}
      alt="Occurrence evidence"
    />
    {children}
  </Button>
}

export const GalleryCaption = props => {
  const test = styles.caption({ theme })
  const theme = useContext(ThemeContext);
  return <div css={styles.caption({ theme })} {...props} />
};

export const Gallery = ({
  onSelect,
  caption,
  title,
  subtitle,
  details,
  items=[],
  loading,
  loadMore,
  imageSrc,
  size = 20,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const dialog = useDialogState();
  const [activeItem, setActiveItem] = useState();

  const next = useCallback(() => {
    const idx = items.indexOf(activeItem) +1;
    const nextItem = idx < items.length - 1 ? items[idx] : items[items.length - 1];
    setActiveItem(nextItem);
  }, [items, activeItem]);

  const prev = useCallback(() => {
    const idx = items.indexOf(activeItem) -1;
    const prevItem = idx > 0 ? items[idx] : items[0];
    setActiveItem(prevItem);
  }, [items, activeItem]);

  return <>
    {!onSelect && <Dialog {...dialog} tabIndex={0} aria-label="Welcome">
      {activeItem && <GalleryDetails 
        closeRequest={() => dialog.hide()} 
        item={activeItem} 
        title={title ? title(activeItem) : 'Unknown'}
        subtitle={title ? subtitle(activeItem) : null}
        details={details}
        imageSrc={imageSrc}
        next={next}
        previous={prev}
        />}
    </Dialog>}
    <div css={styles.gallery({ theme })} {...props}>
      {items.map((e, i) => {
        return <GalleryTile key={i} 
          src={imageSrc(e)} 
          onSelect={onSelect ? () => onSelect({item: e}) : () => {setActiveItem(e); dialog.show()}}>
          {caption && caption({item: e, index: i})}
        </GalleryTile>
      })}
      {loading ? Array(size).fill().map((e,i) => <GalleryTileSkeleton key={i}/>) : null}
      <div css={styles.more({ theme, height: 150 })}>
        {loadMore && !loading && <Button appearance="outline" onClick={loadMore}>Load more</Button>}
      </div>
    </div>
  </>
};

Gallery.displayName = 'Gallery';

// Gallery.propTypes = {

// };

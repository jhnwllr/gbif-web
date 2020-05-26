/* global Image:readonly, document:readonly */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { Button } from '../Button/Button';
import styles from './styles';
import get from "lodash/get";

export const ZoomableImage = React.forwardRef(({
  src,
  thumbnail,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  const [isFullscreen, setFullscreen] = useState();
  const [imageSrc, setImageSrc] = useState(thumbnail);
  const imgEl = useRef(null)

  const wrapperRef = useRef(null);
  
  let mouseTimer;
  const onMouseMove = e => {
    const offsetX = get(e, 'nativeEvent.offsetX');
    const offsetY = get(e, 'nativeEvent.offsetY');
    if(mouseTimer){
      clearTimeout(mouseTimer)
    }
    mouseTimer = setTimeout(() => {
      if(get(imgEl, 'current.style')) {
        imgEl.current.style.backgroundPositionX = (imgEl.current.clientWidth / 2) - offsetX + "px";
        imgEl.current.style.backgroundPositionY = (imgEl.current.clientHeight / 2) - offsetY + "px";
      }
    }, 150)   
  }
  const resetZoom = () => {
    if(mouseTimer){
      clearTimeout(mouseTimer)
    }
    if(get(imgEl, 'current.style')) {
      imgEl.current.style.backgroundPositionX = undefined;
      imgEl.current.style.backgroundPositionY = undefined;
      imgEl.current.style.backgroundPosition = "center";
    }
  }
  useEffect(() => {
    setImageSrc(thumbnail);
    if (Image) {
      var downloadingImage = new Image();
      downloadingImage.onload = function(){
        setImageSrc(this.src);
      };
      downloadingImage.src = src;
    }
  },[src, thumbnail]);

  return <div ref={wrapperRef} css={styles.zoomableImage({ theme })} {...props}>
    <div ref={imgEl} onMouseMove={onMouseMove} onMouseLeave={resetZoom} css={styles.image({theme, src: imageSrc, blur: imageSrc === thumbnail})}></div>
    <div css={styles.toolBar({ theme, src })}>
      <Button appearance="text" ref={ref} onClick={() => {
        if (isFullscreen) document.exitFullscreen();
        else wrapperRef.current.requestFullscreen();
        setFullscreen(!isFullscreen);
        }}>
        {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
      </Button>
    </div>
  </div>
});

ZoomableImage.displayName = 'ZoomableImage';

ZoomableImage.propTypes = {
  as: PropTypes.element
};

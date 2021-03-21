import propTypes from 'prop-types';
import cn from 'classnames';

const BgVideo = ({ srcMP4, srcWEBM, srcIMG, responsive }) => {
  return (
    <div className={cn('bgvideo', responsive ? 'disable' : null)}>
      {(srcMP4 || srcWEBM) ?
        <video className="bgvideo__content" autoPlay muted loop playsInline>
          {srcMP4 && <source src={srcMP4} type="video/mp4"/>}
          {srcWEBM && <source src={srcWEBM} type="video/webm"/>}
        </video>
      :
        srcIMG && <img src={srcIMG} className="bgvideo__image"/>
      }
    </div>
  );
};

export default BgVideo;

BgVideo.propTypes = {
  srcMP4: propTypes.string,
  srcWEBM: propTypes.string,
  srcIMG: propTypes.string,
  responsive: propTypes.bool,
};
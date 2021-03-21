import Image from 'next/image';
import propTypes from 'prop-types';

/**
 * Displays my profile image
 * 
 * @param {object} param Coponent props
 * @param {string} param.imageURL path to profile image
 */
const MyImage = ({ imageURL }) => {
  return (
    <Image
      className="my__image"
      src={imageURL}
      alt="My Photo"
      layout="fill"
    />
  );
};

MyImage.propTypes = {
  imageURL: propTypes.string.isRequired,
};

export default MyImage;
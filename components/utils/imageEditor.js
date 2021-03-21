import { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import propTypes from 'prop-types';

const ImageEditor = ({ height, width, scale = 1, value, setImage }) => {
  const [ avatar, setAvatar ] = useState( value );

  const _handleFileSelect = (event) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const url = e.target.result;
      setAvatar(url);
      setImage(url);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <div className="image-editor">
      <div className="image-editor__images">
        <AvatarEditor
          image={avatar}
          width={height}
          height={width}
          scale={scale}
          rotate={0}
        />
      </div>
      <input type="file" className="image-editor__file" onChange={_handleFileSelect}/>
    </div>
  );
};

export default ImageEditor;

ImageEditor.propTypes = {
  height: propTypes.number.isRequired,
  width: propTypes.number.isRequired,
  setImage: propTypes.func.isRequired,
  value: propTypes.string,
  scale: propTypes.number,
};
import React, { useState } from 'react';
import ColorPicker from '../index';

export default {
  title: 'ColorPicker',
}


export const Size = () => {

  return (
      <div>
            <ColorPicker alpha={true}/>
      </div>
  );
};

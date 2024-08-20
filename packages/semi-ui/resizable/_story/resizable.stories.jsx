import React, { useState } from 'react';
import { Resizable } from '../../index';

export default {
  title: 'Resizable'
}

export const Single = () => {
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <Resizable style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
        maxWidth={500}
        maxHeight={600}
        minWidth={50}
        minHeight={50}
        defaultSize={{
          width: 200,
          height: 300,
        }}>
        <div style={{ marginLeft: '20%'}}>
          man what can i say
        </div>
      </Resizable>
    </div>
  );
}


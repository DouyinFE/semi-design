import React, { useState } from 'react';
import { Button } from '@douyinfe/semi-ui'
import { Resizable } from '../../index';

export default {
  title: 'Resizable'
}

export const Single = () => {
  
  return (
    <div style={{ width: '500px', height: '60%'}}>
      <Resizable style={{ marginLeft: '20%', backgroundColor: 'red'}}>
        man what can i say
      </Resizable>
    </div>
  );
}


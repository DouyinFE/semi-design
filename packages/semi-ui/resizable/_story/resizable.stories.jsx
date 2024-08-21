import React, { useState } from 'react';
import { Resizable } from '../../index';
import { Button } from '@douyinfe/semi-ui'
export default {
  title: 'Resizable'
}

export const Single = () => {
  const [size, setSize] = useState({width: 200, height: 300});
  return (
    <div style={{ width: '500px', height: '60%' }}>
      <div>
        <Button onClick={() => {setSize({width: 400, height: 700})}}>set size</Button>
      </div>
      <Resizable style={{ marginLeft: '20%', backgroundColor: 'red', border: 'black 5px solid' }}
      ratio={1.5}
      >
        <div style={{ marginLeft: '20%'}}>
          man what can i say
        </div>
      </Resizable>
    </div>
  );
}


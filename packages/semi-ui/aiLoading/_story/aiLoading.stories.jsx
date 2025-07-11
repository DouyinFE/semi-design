import React, { useState } from 'react';
import { AILoading } from '../../index';

export default {
  title: 'AI Loading',
}


export const Demo = () => (
  <div>
    <div>小号尺寸</div>
    <AILoading />
    <br />
    <div>大号尺寸</div>
    <AILoading type="large" status="processing" />
    <br />
    <div>彩色尺寸</div>
    <AILoading type="colored" status="thinking" />
  </div>
);


import React, { useState } from 'react';
import { AICard } from '../../index';

export default {
  title: 'AI Card',
}


export const Demo = () => (
  <div>
   <AICard type="default" label="AI Summary" icon="https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvbg24f-iwm58xz.svg" children={"hhh"}/>
   <AICard type="stroked" label="AI Summary" icon="https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvbg24f-iwm58xz.svg" children={"hhh"}/>
   <AICard type="filled" label="AI Summary" icon="https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvbg24f-iwm58xz.svg" children={"hhh"}/>
   <AICard type="filledTop" label="AI Summary" icon="https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvbg24f-iwm58xz.svg" children={"hhh"}/>
  </div>
);


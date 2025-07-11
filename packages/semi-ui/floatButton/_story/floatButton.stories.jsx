import React, { useState } from 'react';
import { FloatButton } from '../../index';
import { FloatButtonGroup } from '../../floatButton';

export default {
  title: 'Float Button',
}


export const SizeDemo = () => (
  <div>
    <div>sm尺寸</div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <FloatButton status="normal" type="default" group={false} size="small" showBadge={true} badgeContent={'new'} />
      <FloatButton status="normal" type="default" group={false} size="small" showRectangle={true}/>
      <FloatButton status="normal" type="default" group={false} size="small" />
    </div>
    <br />
    <div>md尺寸</div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <FloatButton status="normal" type="default" group={false} size="medium" showBadge={true} badgeContent={'new'} />
      <FloatButton status="normal" type="default" group={false} size="medium" showRectangle={true}/>
      <FloatButton status="normal" type="default" group={false} size="medium" />
    </div>

    <br />
    <div>lg尺寸</div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <FloatButton status="normal" type="default" group={false} size="large" showBadge={true} badgeContent={'new'} />
      <FloatButton status="normal" type="default" group={false} size="large" showRectangle={true}/>
      <FloatButton status="normal" type="default" group={false} size="large" />
    </div>

    <br />
    <div>disabled尺寸</div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <FloatButton type="disabled"  group={false} size="small" showBadge={true} badgeContent={'new'} />
      <FloatButton type="disabled"  group={false} size="medium" showRectangle={true}/>
      <FloatButton type="disabled" group={false} size="large" />
    </div>
  </div>
);

export const GroupDemo = () => (
  <div>
   <div></div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <FloatButton status="normal" type="default" group={true} groupItems={[{
        icon: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvbquee-l6c0mki.svg',
        label: 'new',
        badgeContent: 'new',
        status: 'normal',
        size: 'small',
      }, {
        icon: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvbquee-l6c0mki.svg',
        label: 'new',
        badgeContent: 'new',
        status: 'normal',
        size: 'small',
      },
      {
        icon: 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvbquee-l6c0mki.svg',
        label: 'new',
        badgeContent: 'new',
        status: 'normal',
        size: 'small',
      }]}/>
    </div>
  </div>
);


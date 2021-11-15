import React from 'react';
import Avatar from '../index';
import Popover from '../../popover/index';
import AvatarGroup from '../avatarGroup';

export default {
  title: 'Avatar',
}

export const Basic = () => (
  <div>
    <div>
      <Avatar>U</Avatar>
      <Avatar size="large">U</Avatar>
      <Avatar size="extra-small">U</Avatar>
      <Avatar size="small">U</Avatar>
      <Avatar size="default">U</Avatar>
      <Avatar size="extra-large">U</Avatar>
    </div>
    <div>
      <Avatar shape="square">U</Avatar>
      <Avatar shape="square" size="large">
        U
      </Avatar>
      <Avatar shape="square" size="extra-small">
        U
      </Avatar>
      <Avatar shape="square" size="small">
        U
      </Avatar>
      <Avatar shape="square" size="default">
        U
      </Avatar>
      <Avatar shape="square" size="extra-large">
        U
      </Avatar>
    </div>
  </div>
);

export const CustomAvatar = () => (
  <div>
    <Avatar>U</Avatar>
    <Avatar color="red">U</Avatar>
    <Avatar color="red" size="default">
      DF
    </Avatar>
    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <Avatar size="default" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <Avatar size="small" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
    <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
  </div>
);

export const GroupSize = () => (
  <div>
    <p>medium</p>
    <AvatarGroup>
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar size="default">CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
    <p>default</p>
    <AvatarGroup size="default">
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar size="default">CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
    <p>small</p>
    <AvatarGroup size="small">
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar size="default">CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
  </div>
);

export const OverlapFromDemo = () => (
  <div>
    <div>overlapFrom=start</div>
    <AvatarGroup overlapFrom={'start'}>
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
    <br />
    <br />
    <div>overlapFrom=end</div>
    <AvatarGroup overlapFrom={'end'}>
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
    <br />
    <br />
  </div>
);

export const MaxCountDemo = () => (
  <div>
    <div>maxCount=3</div>
    <AvatarGroup maxCount={3}>
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
    <br />
    <br />
  </div>
);

const renderMore = (restNumber, restAvatars) => {
  const content = restAvatars.map((avatar, index) => {
    return (
      <div style={{ paddingBottom: '12px' }}>
        {React.cloneElement(avatar, { size: 'extra-small' })}
        <span style={{ marginLeft: 8, fontSize: 14 }}>这是段文字描述</span>
      </div>
    );
  });
  return (
    <Popover
      content={content}
      autoAdjustOverflow={false}
      position={'bottomRight'}
      style={{ padding: '12px 8px', paddingBottom: 0 }}
    >
      <Avatar>{`+${restNumber}`}</Avatar>
    </Popover>
  );
};

export const RenderMoreDemo = () => (
  <div>
    <AvatarGroup maxCount={3} renderMore={renderMore}>
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
    <br />
    <br />
  </div>
);

export const ExtraExtraSmallOverlap = () => (
  <div>
    <AvatarGroup size="extra-extra-small" overlapFrom={'start'}>
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
    <br />
    <br />
    <AvatarGroup size="extra-extra-small" overlapFrom={'end'}>
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
    <br />
    <br />
    <AvatarGroup size="extra-extra-small" maxCount={3}>
      <Avatar color="red">LL</Avatar>
      <Avatar>CX</Avatar>
      <Avatar color="amber">RM</Avatar>
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>ZL</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }}>YZ</Avatar>
    </AvatarGroup>
  </div>
);
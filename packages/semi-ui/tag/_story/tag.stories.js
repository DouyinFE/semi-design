/* argus-disable unPkgSensitiveInfo */
import React from 'react';
import withPropsCombinations from 'react-storybook-addon-props-combinations';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

import { Tag, TagGroup } from '../../index';

export default {
  title: 'Tag'
}

export const Tag1 = () => (
  <div>
    <Tag>hello Tag</Tag>
    <Tag>
      <div>
        leftBottom
        <br />
        leftBottom line 2
      </div>
    </Tag>
  </div>
);

Tag1.story = {
  name: 'tag 1',
};

export const Tag2 = () => (
  <div>
    <div className={`${BASE_CLASS_PREFIX}-tag-group`}>
      <Tag color="red" closable>
        hello Tag
      </Tag>
      <Tag color="red">hello Tag</Tag>
      <Tag color="red">hello Tag</Tag>
      <Tag color="red">hello Tag</Tag>
      <Tag color="red">hello Tag</Tag>
    </div>
    <div className={`${BASE_CLASS_PREFIX}-tag-group`}>
      <Tag color="green">hello Tag</Tag>
      <Tag color="green">hello Tag</Tag>
      <Tag color="green">hello Tag</Tag>
      <Tag color="green">hello Tag</Tag>
      <Tag color="green">hello Tag</Tag>
    </div>
    <div className={`${BASE_CLASS_PREFIX}-tag-group`}>
      <Tag color="blue">hello Tag</Tag>
      <Tag color="blue">hello Tag</Tag>
      <Tag color="blue">hello Tag</Tag>
      <Tag color="blue">hello Tag</Tag>
      <Tag color="blue">hello Tag</Tag>
    </div>
    <div className={`${BASE_CLASS_PREFIX}-tag-group`}>
      <Tag color="grey">hello Tag</Tag>
      <Tag color="grey">hello Tag</Tag>
      <Tag color="grey">hello Tag</Tag>
      <Tag color="grey">hello Tag</Tag>
      <Tag color="grey">hello Tag</Tag>
    </div>
    <div className={`${BASE_CLASS_PREFIX}-tag-group`}>
      <Tag color="orange">hello Tag</Tag>
      <Tag color="orange">hello Tag</Tag>
      <Tag color="orange">hello Tag</Tag>
      <Tag color="orange">hello Tag</Tag>
      <Tag color="orange">hello Tag</Tag>
    </div>
    <div className={`${BASE_CLASS_PREFIX}-tag-group`}>
      <Tag color="white">hello Tag</Tag>
      <Tag color="white">hello Tag</Tag>
      <Tag color="white">hello Tag</Tag>
      <Tag color="white">hello Tag</Tag>
      <Tag color="white">hello Tag</Tag>
    </div>
  </div>
);

Tag2.story = {
  name: 'tag 2',
};

export const CombinationShow = withPropsCombinations(
  Tag,
  {
    children: ['hello Tag'],
    size: ['large', 'small'],
    closable: [true, false],
    color: ['green', 'orange', 'blue', 'grey', 'red', 'white'],
  },
  {
    showSource: false,
  }
);

CombinationShow.story = {
  name: 'combination show',
};

const TagGroupDemo = () => {
  let tagList = [
    { color: 'white', children: '抖音' },
    { color: 'white', children: '火山小视频' },
    { color: 'white', children: 'Abc' },
    { color: 'white', children: 'vigo' },
    { color: 'white', children: '皮皮虾' },
  ];
  let divStyle = {
    backgroundColor: 'var(--semi-color-fill-0)',
    height: 35,
    width: 300,
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
  };
  return (
    <>
      <div style={divStyle}>
        <TagGroup
          maxTagCount={3}
          style={{ width: 300 }}
          tagList={tagList}
          size="large"
          showPopover
        ></TagGroup>
      </div>
      <br />
      <div style={divStyle}>
        <TagGroup
          maxTagCount={3}
          style={{ width: 300 }}
          tagList={tagList}
          size="small"
          showPopover
        ></TagGroup>
      </div>
      <br />
      <div>
        <TagGroup style={{ width: 300 }} tagList={tagList} size="large"></TagGroup>
      </div>
      <div>
        <TagGroup style={{ width: 300 }} tagList={tagList} size="small"></TagGroup>
      </div>
    </>
  );
};

export const _TagGroup = () => <TagGroupDemo />;

_TagGroup.story = {
  name: 'tagGroup',
};

export const TagAvatar = () => {
  const avatarSrc =
    'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg';
  return (
    <div style={{ margin: 10 }}>
      <Tag avatarSrc={avatarSrc} avatarShape={'square'} onClick={()=>{console.log('如果能重来，我要做李白')}}>
        李白
      </Tag>
      <br />
      <Tag avatarSrc={avatarSrc} avatarShape={'square'} size="large">
        李白
      </Tag>
      <br />
      <Tag avatarSrc={avatarSrc} avatarShape={'circle'}>
        白居易
      </Tag>
      <br />
      <Tag avatarSrc={avatarSrc} avatarShape={'circle'} size="large">
        白居易
      </Tag>
      <br />
      <Tag closable={true} avatarSrc={avatarSrc} avatarShape={'square'}>
        李白
      </Tag>
      <br />
      <Tag closable={true} avatarSrc={avatarSrc} avatarShape={'square'} size="large">
        李白
      </Tag>
      <br />
      <Tag closable={true} avatarSrc={avatarSrc} avatarShape={'circle'}>
        白居易
      </Tag>
      <br />
      <Tag closable={true} avatarSrc={avatarSrc} avatarShape={'circle'} size="large">
        白居易
      </Tag>
      <br />
    </div>
  );
};

TagAvatar.story = {
  name: 'tag avatar',
};

const AvatarTagGroupDemo = () => {
  const src =
    'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg';
  let tagList = [
    { color: 'white', children: '抖音', avatarSrc: src },
    { color: 'white', children: '火山小视频', avatarSrc: src },
    { color: 'white', children: 'Abc', avatarSrc: src },
    { color: 'white', children: 'vigo', avatarSrc: src },
    { color: 'white', children: '皮皮虾', avatarSrc: src },
  ];
  let divStyle = {
    backgroundColor: 'var(--semi-color-fill-0)',
    height: 35,
    width: 350,
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
  };
  return (
    <div style={divStyle}>
      <TagGroup
        maxTagCount={3}
        style={{ width: 350 }}
        tagList={tagList}
        size="large"
        avatarShape="circle"
        showPopover
      ></TagGroup>
    </div>
  );
};

export const AvatarTagGroup = () => <AvatarTagGroupDemo />;

AvatarTagGroup.story = {
  name: 'avatar tagGroup',
};

const TagGroupCloseableDemo = () => {
  const src = 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg';
  const tagList2 = [
      { tagKey: '1', color: 'white', children:'Douyin', avatarSrc:src,closable:true},
      { tagKey: '2', color: 'white', children:'Hotsoon', avatarSrc:src,closable:true},
      { tagKey: '3', color: 'white', children:'Capcut', avatarSrc:src,closable:true},
      { tagKey: '4', color: 'black', children:'bytedance', avatarSrc:src,closable:true},
      { tagKey: '5', color: 'white', children:'vvvvv', avatarSrc:src,closable:true},
      { tagKey: '6', color: 'white', children:'Pipixia', avatarSrc:src,closable:true},
  ];
  const divStyle = {
      backgroundColor: 'var(--semi-color-fill-0)',
      height: 35,
      width: 300,
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      marginBottom: 30,
  };
  const tagGroupStyle = {
      display: 'flex',
      alignItems: 'center',
      width: 350,
  };
  return (
      <>
          <div style={divStyle}>
              <TagGroup
                  maxTagCount={3}
                  style={tagGroupStyle}
                  tagList={tagList2}
                  size='large'
                  avatarShape='circle'
                  showPopover
              />
          </div>
      </>
  );
};

export const TagGroupCloseable = () => <TagGroupCloseableDemo />;

TagGroupCloseable.story = {
  name: 'tagGroup closable',
}
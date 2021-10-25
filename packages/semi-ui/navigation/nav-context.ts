import React from 'react';

const NavContext = React.createContext({
    isCollapsed: false,
    selectedKeys: [],
    openKeys: [],
});

export default NavContext;

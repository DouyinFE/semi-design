import React,  { useEffect, useCallback } from 'react';
import { IconTransparentStroked } from '@douyinfe/semi-icons';
import DragMove from '../index';

export default {
  title: 'DragMove',
  parameters: {
    chromatic: { disableSnapshot: true },
  }
}

export const Default = () => {
  const handlerRef = React.useRef();

  useEffect(() => {
    let dragMove = new DragMove({ element: handlerRef.current });
    dragMove.init();
    return () => {
      dragMove.destroy();
      dragMove = null;
    }
  } , []);

  return (
    <>
      <div 
        style={{ backgroundColor: 'rgba(var(--semi-grey-2), 1)', 
          width: 300, height: 300, 
          position: 'relative', marginTop: 50, marginLeft: 50,
          color: 'rgba(var(--semi-white), 1)', fontWeight: 500,
        }}
      >
        <div 
          style={{ backgroundColor: 'var(--semi-color-primary)',width: 100, height: 100, 
            display: 'flex', alignItems: 'center',justifyContent: 'center', 
            position: 'absolute', top: 50, left: 50, borderRadius: 10
          }} 
          ref={handlerRef}
        >Drag me</div>
      </div>
    </>
  )
}

export const Callback = () => {
  const handlerRef = React.useRef();

  const onMouseMove = useCallback((e) => {
    console.log('onMouseMove', e);
  }, []);

  const onMouseDown = useCallback((e) => {
    console.log('onMouseDown', e);
  }, []);

  const onMouseUp = useCallback((e) => {
    console.log('onMouseUp', e);
  })

  useEffect(() => {
    let  dragMove = new DragMove({ 
      element: handlerRef.current,
      onMouseMove,
      onMouseDown,
      onMouseUp,
    });
    dragMove.init();
    return () => {
      dragMove.destroy();
      dragMove = null;
    }
  } , []);
  
  return (
    <div 
      style={{ backgroundColor: 'rgba(var(--semi-grey-2), 1)', width: 300, height: 300, 
        position: 'relative', marginTop: 50, marginLeft: 50, color: 'rgba(var(--semi-white), 1)',
      }}
    >
        <div 
          style={{ backgroundColor: 'var(--semi-color-primary)',width: 100, height: 100, 
            display: 'flex', alignItems: 'center',justifyContent: 'center', 
            position: 'absolute', top: 50, left: 50, borderRadius: 10
          }} 
          ref={handlerRef}
        >Drag me</div>
    </div>
  )
}

export const Constrain = () => {
  const handlerRef = React.useRef();
  const containerRef = React.useRef();

  useEffect(() => {
    let  dragMove = new DragMove({ 
      element: handlerRef.current,
      constrainer: containerRef.current,
    });
    dragMove.init();
    return () => {
      dragMove.destroy();
      dragMove = null;
    }
  } , []);

  return (
    <div 
      style={{ 
        backgroundColor: 'rgba(var(--semi-grey-2), 1)', width: 300, height: 300, 
        position: 'relative', marginTop: 50, marginLeft: 50, 
        color: 'rgba(var(--semi-white), 1)', fontWeight: 500,
      }} 
      ref={containerRef}
    >
      <span>constrainer</span>
      <div style={{ backgroundColor: 'var(--semi-color-primary)', 
        width: 100, height: 100, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'absolute', top: 50, left: 50,  borderRadius: 10
        }} ref={handlerRef}>Drag me</div>
    </div>
  )
}


export const Handler = () => {
  const handlerRef = React.useRef();
  const elementRef = React.useRef();
  const containerRef = React.useRef();

  useEffect(() => {
    let  dragMove = new DragMove({
      element: elementRef.current,
      handler: handlerRef.current,
      constrainer: containerRef.current,
    });
    dragMove.init();
    return () => {
      dragMove.destroy();
      dragMove = null;
    }
  } , []);

  return (
    <div 
      style={{ backgroundColor: 'rgba(var(--semi-grey-2), 1)', 
        width: 300, height: 300, padding: 5, position: 'relative', 
        color: 'rgba(var(--semi-white), 1)', fontWeight: 500,
      }} 
      ref={containerRef}
    >
      <span>constrainer</span>
      <div style={{ 
        backgroundColor: 'var(--semi-color-primary)', 
        width: 80, height: 80, borderRadius: 10,
        position: 'absolute', top: 50, left: 50,  borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} ref={elementRef}>
        <div 
            style={{ width: 'fit-content', height: 'fit-content'}} 
            ref={handlerRef}
        ><IconTransparentStroked /></div>
      </div>
    </div>
  )
}

export const MultipleLayer = () => {
  const handlerRef = React.useRef();
  const constrainRef = React.useRef();

  useEffect(() => {
    let dragMove = new DragMove({ 
      element: handlerRef.current,
      constrainer: constrainRef.current,
    });
    dragMove.init();
    return () => {
      dragMove.destroy();
      dragMove = null;
    }
  } , []);

  return (
    <>
     <div 
        style={{ backgroundColor: 'rgba(var(--semi-grey-2), 1)', width: 300, height: 300, 
          position: 'relative', marginTop: 50, marginLeft: 50, 
          color: 'rgba(var(--semi-white), 1)', fontWeight: 500,
        }}
        ref={constrainRef}
      >
        <span>Constrain node, relative position</span>
        <div 
          style={{ backgroundColor: 'rgba(var(--semi-light-blue-2), 1)', width: 200, height: 200, 
            position: 'relative', 
            top: 80, left: 80,
          }}
        >
          <span>Relative position</span>
          <div 
            style={{ backgroundColor: 'var(--semi-color-primary)',width: 80, height: 80, 
              display: 'flex', alignItems: 'center',justifyContent: 'center', 
              position: 'absolute', top: 50, left: 50,  borderRadius: 10
            }} 
            ref={handlerRef}
          >Drag me</div>
        </div>
      </div>
    </>
  );
}

export const MultipleLayer2 = () => {
  const handlerRef = React.useRef();
  const constrainRef = React.useRef();

  useEffect(() => {
    let dragMove = new DragMove({ 
      element: handlerRef.current,
      constrainer: constrainRef.current,
    });
    dragMove.init();
    return () => {
      dragMove.destroy();
      dragMove = null;
    }
  } , []);

  return (
    <>
     <div 
        style={{ backgroundColor: 'rgba(var(--semi-grey-2), 1)', width: 300, height: 300, 
          position: 'relative', marginTop: 50, marginLeft: 50, 
          color: 'rgba(var(--semi-white), 1)', fontWeight: 500,
        }}
        ref={constrainRef}
      >
        <span>Constrain node, relative position</span>
        <div 
          style={{ backgroundColor: 'rgba(var(--semi-light-blue-2), 1)', width: 200, height: 200, 
            position: 'absolute', 
            top: 80, left: 80,
          }}
        >
          <span>Absolute position</span>
          <div 
            style={{ backgroundColor: 'var(--semi-color-primary)',width: 80, height: 80, 
              display: 'flex', alignItems: 'center',justifyContent: 'center', 
              position: 'absolute', top: 50, left: 50,  borderRadius: 10
            }} 
            ref={handlerRef}
          >Drag me</div>
        </div>
      </div>
    </>
  );
}
import React,  { useEffect, useCallback } from 'react';
import { IconHandle } from '@douyinfe/semi-icons';
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
        style={{ backgroundColor: 'rgba(var(--semi-lime-1), 1)', width: 300, height: 300, 
          position: 'relative', marginTop: 50, marginLeft: 50
        }}
      >
        <div 
          style={{ backgroundColor: 'var(--semi-color-primary)',width: 100, height: 100, 
            display: 'flex', alignItems: 'center',justifyContent: 'center', 
            position: 'absolute', top: 50, left: 50
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
      style={{ backgroundColor: 'rgba(var(--semi-lime-1), 1)', width: 300, height: 300, 
        position: 'relative', marginTop: 50, marginLeft: 50
      }}
    >
        <div 
          style={{ backgroundColor: 'var(--semi-color-primary)',width: 100, height: 100, 
            display: 'flex', alignItems: 'center',justifyContent: 'center', 
            position: 'absolute', top: 50, left: 50
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
        backgroundColor: 'rgba(var(--semi-lime-1), 1)', width: 300, height: 300, 
        position: 'relative', marginTop: 50, marginLeft: 50
      }} 
      ref={containerRef}
    >
      <span>constrainer</span>
      <div style={{ backgroundColor: 'var(--semi-color-primary)', 
        width: 100, height: 100, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'absolute', top: 50, left: 50
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
      style={{ backgroundColor: 'rgba(var(--semi-lime-1), 1)', width: 400, height: 400, 
        position: 'relative', marginTop: 50, marginLeft: 50
      }} 
      ref={containerRef}
    >
      <span>constrainer</span>
      <div style={{ 
        backgroundColor: 'rgba(var(--semi-lime-2), 1)', 
        width: 150, height: 150,
        position: 'absolute', top: 50, left: 50,
      }} ref={elementRef}>
        <div style={{ backgroundColor: 'var(--semi-color-primary)', 
          width: 'fit-content', height: 'fit-content',
          display: 'flex', alignItems: 'center',justifyContent: 'center',
        }} ref={handlerRef}><IconHandle /></div>
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
        style={{ backgroundColor: 'rgba(var(--semi-lime-1), 1)', width: 300, height: 300, 
          position: 'relative', marginTop: 50, marginLeft: 50,
        }}
        ref={constrainRef}
      >
        <span>Constrain node, relative position</span>
        <div 
          style={{ backgroundColor: 'rgba(var(--semi-lime-2), 1)', width: 200, height: 200, 
            position: 'relative', marginTop: 50, marginLeft: 50,
            top: 80, left: 80,
          }}
        >
          <span>Relative position</span>
          <div 
            style={{ backgroundColor: 'var(--semi-color-primary)',width: 80, height: 80, 
              display: 'flex', alignItems: 'center',justifyContent: 'center', 
              position: 'absolute', top: 50, left: 50
            }} 
            ref={handlerRef}
          >Drag me</div>
        </div>
      </div>
    </>
  );
}

import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { CSSTransition } from 'react-transition-group';

function TransitionWrapper({children, triggered, reset}) {
  const location = useLocation();
  
  useEffect(() => {
    return () => { reset(); }
  }, [location, reset])
  
  return <CSSTransition
    in={triggered}
    timeout={3000}
    classNames="transition"
    unmountOnExit
  >
    {children}
  </CSSTransition>
}

export default TransitionWrapper;

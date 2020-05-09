import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

export function PageContainer({canReplaceHistory, children}) {
  const history = useHistory();
  const timeoutId = useRef(null);

  useEffect(() => {

    // todo: remove this listener when the component is unmounted

    window.addEventListener('scroll', () => {

      /*
       *  We only want this to run after the user has stopped scrolling
       */

      clearTimeout(timeoutId.current);

      const tid = setTimeout(() => {
        if (canReplaceHistory.current) {
          
          const path = history.location.pathname;
          history.replace(path, { scroll: window.pageYOffset});
        }
      }, 500);

      timeoutId.current = tid;
    });
  }, []);

  return (
    <div>
      {children}
    </div>
  );
}

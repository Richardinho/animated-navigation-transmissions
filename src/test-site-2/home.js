import React from 'react';
import { Link } from 'react-router-dom'

export function Home() {

  return (

    <div className="home-page">
      <Link to="/foo">Foo</Link>
      <Link to="/bar">Bar</Link>
    </div>

  );
}

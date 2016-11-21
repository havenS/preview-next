import React from 'react';
import Link from 'next/link';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Link href="/mobile">
          <a>Mobile</a>
        </Link>
      </div>
    );
  }
}
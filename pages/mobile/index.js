import React from 'react';
import Link from 'next/link';

export default class Mobile extends React.Component {
  render() {
    return (
      <div>
        <h1>Mobile</h1>
        <Link href="/">
          <a>Back</a>
        </Link>
      </div>
    );
  }
}
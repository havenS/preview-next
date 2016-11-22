import React from 'react';
import Link from 'next/link';
import request from 'superagent';

export default class Mobile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: props.loading,
      news: props.results
    };
  }
  
  static async getInitialProps(){
    let results = [];
    const res = await request
      .get('http://content.guardianapis.com/search?q=mobile&api-key=test')
      .accept('application/json');

    if (res.ok && res.body.response.status === 'ok') {
      results = res.body.response.results;
    }
  
    return {
      results,
      loading: false
    }
  }

  render() {
    return (
      <div>
        <h1>Mobile</h1>
        <Link href="/">
          <a>Retour</a>
        </Link>
        
        {this.state.loading ? (
          <p>Chargement ...</p>
        ) : 
          this.state.news.length == 0 ? (
            <p>Aucun article à afficher</p>
          ):(
            <ul>
              {this.state.news.map((news) => <li key={news.id}>{news.webTitle}</li>)}
            </ul>
          )
        }
      </div>
    );
  }
}
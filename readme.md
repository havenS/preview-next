# Actualité - Next

## Présentation de Next
- jeune
- Isomorphic
- Aucune configuration (babel, webpack)
- live reload

## CONFIGURATION
```console
mkdir next
```
```console
npm init
```
```console
npm install —save next
```
- Ajouter la commande de lancement aux scripts du packages.json:

```
{
  "scripts": {
	…
    "dev": "next"
  }
}
```

## Ajouter une première page
- créer le dossier ./pages

Ce dossier est l'équivalent de la racine du site /.

- créer le fichier index.js

./pages/index.js

```javascript
import React from 'react';

export default class Home extends React.Component {
  render() {
    return (
      <h1>Hey !</h1>
    );
  }
}
```

Vous pouvez maintenant lancer le serveur

```console
npm run dev
```

et accéder à la [page](http://localhost:3000)

```
http://localhost:3000/
```

## Utilisation du routing
Comme évoqué précédemment, le dossier ./pages correspond à la base du site (/).

Nous allons ajouter une page /mobile qui recevra les actualité taggées "mobile".

Pour ajouter une nouvelle page, NextJS propose 2 solutions pour permettre l'accès à la page /mobile.

- Soit nous créons un dossier mobile contenant un fichier index.js

```
- pages
-- index.js
-- mobile.js
```

- Soit nous créons un fichier à la racine du dossier ./pages nommé mobile.js

```
- pages
-- index.js
-- mobile
--- index.js
```
Ajoutons simplement des liens pour naviguer entre nos 2 pages.
./pages/index.js

```javascript
render() {
    return (
      <div>
        <h1>Home</h1>
        <a href="/mobile">
          Mobile
        </a>
      </div>
    );
  }
```
Vous pouvez maintenant accèder à votre page:
```
http://localhost:3000/mobile
```
Toutefois, votre liens se comporte comme un liens html traditionnel. Pour avoir un comportement plus proche de ce à quoi nous sommes habitués dans nos Single Page Applications (SPA), navigation instantané, pas de rafraichissement, il suffit d'utiliser l'élement ```<Link/>``` de Next.

Dans vos imports, ajoutez:

```javascript
import Link from 'next/link';
```

Et simplement englober votre lien dans cet élément en déplacement l'attribut ```href```.

```javascript
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
```

Pour être complet, ajouter le lien de retour à l'accueil sur la page de /mobile:

```javascript
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
```
A ce point, vous disposez de 2 pages, avec un rendu serveur et une navigation. Voyons maintenant comment récupérer les données en conservant ce rendu côté serveur.

## Récupération des données et rendu serveur

Comme tous projets React, les données peuvent être récupérées dans la fonction ```componentWillMount()``` du composant.
J'utiliserai ici Superagent de manière à rester constant à travers les différentes phase du projet:

```console
npm install superagent --save
```
Et dans ./pages/mobile/index.js

```javascript
import React from 'react';
import Link from 'next/link';
import request from 'superagent';

export default class Mobile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      news: []
    };
  }

  componentWillMount() {
    request
      .get('http://content.guardianapis.com/search?q=mobile&api-key=test')
      .accept('application/json')
      .end((err, res) => {
        if (err || res.body.response.status !== 'ok') {
          return this.handleError(err);
        }
      
        const results = res.body.response.results;
      
        return this.setState({
          loading: false,
          news: results
        });
      });
  }

  handleError(error) {
    this.setState({
      loading: false
    });
    alert(error);
  }

  render() {
    return (
      <div>
        <h1>Mobile</h1>
        <Link href="/">
          <a>Back</a>
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
```
Nous affichons maintenant les titres des derniers articles du Guardian.
Le soucis est que nous ne disponsons pas du rendu serveur, si vous affichez le code source de la page, les titres des articles ne sont pas présents.

Grace à Next, la chose est simple. Nous disposons d'une fonction ```static async getInitialProps()``` qui nous permet de récupérer les données nécessaires au montage du composant, côté serveur. Le rendu n'interviendra qu'à la fin de l'éxécution de cette fonction.

Il nous suffit maintenant de déplacer et modifier un peu notre process de récupération des données pour éffectuer la récupération côté serveur. 

```javascript
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
          <a>Back</a>
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
```
Vous avez maintenant votre page d'article qui est rendu côté serveur.
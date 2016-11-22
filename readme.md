# Commencer avec Next

## Présentation de Next
Next a créé et publié en open source par [Zeit](https://zeit.co/) très récemment, est en fait un micro framework pour créer des applications webs ([Github](https://github.com/zeit/next.js/)). En un minimum de temps et de configuration, on peut disposer d'un site, multi-pages, réactif et disposant d'un rendu serveur (SSR). Pour cela, il se repose entre autre sur NodeJS, React, Babel et Webpack.

Ses principaux avantages sont:

- Aucune configuration (ou presque): pas de temps perdu à configurer Babel ou Webpack.
- Isomorphisme: les pages sont rendues de la même manière sur le serveur et sur le client.
- Live reload, effectivement inutile en production mais assez agrèable pendant les phases de dév.

Dans cette article de découverte, on évoquera:

- la configuration du projet de base
- la création d'une première page, simple au design à couper le souffle... un Hello world en somme.
- la découverte du routing selon Next
- la récupération des données et leur rendu côté serveur

## CONFIGURATION
On commence par créer un dossier de travail:

```console
mkdir next && cd next
```

On initialise npm:

```console
npm init
```

Et on ajoute Next à la liste des dépendances:

```console
npm install --save next
```
Enfin on ajoute la commande de lancement aux scripts du packages.json:

```
{
  "scripts": {
	…
    "dev": "next"
  }
}
```

## Ajouter une première page
On commence par créer un dossier "pages" à la racine du projet:

```console
mkdir ./pages
```

Next se comporte avec ses fichiers ".js" comme un serveur web "basique" se comporte avec ses fichiers ".html". C'est à dire qu'il se base sur l'arborescence des fichiers pour gérer ses routes.
Ainsi l'arborescence du dossier ```./pages``` définira l'arborescence de notre site.

Pour avoir une page d'accueil, il nous suffit donc de créer un fichier "index.js" dans le dossier ```./pages``` qui exporte un composant React.

#####./pages/index.js

```javascript
import React from 'react';

export default class Home extends React.Component {
  render() {
    return (
      <h1>Bonjour !</h1>
    );
  }
}
```

Vous pouvez maintenant lancer le serveur:

```console
npm run dev
```

et ainsi apprécier le fruit de votre dur labeur à l'adresse suivante:

[http://localhost:3000](http://localhost:3000)

## Utilisation du routing
On va maintenant ajouter une page qui recevra les actualités concernant le monde du mobile glanées sur un célèbre journal étranger. Cette page sera accessible à l'adresse [http://localhost:3000/mobile](http://localhost:3000/mobile).

Comme évoqué précédemment, le dossier ```./pages``` correspond à la base du site [http://localhost:3000/](http://localhost:3000/). De ce fait, Next propose 2 solutions pour permettre l'accès à la page [http://localhost:3000/mobile](http://localhost:3000/mobile).

- Soit on crée un dossier ```./pages/mobile``` contenant un fichier ```index.js```

```
- pages
-- index.js
-- mobile
--- index.js
```

- Soit on crée un fichier à la racine du dossier ```./pages``` nommé ```mobile.js```

```
- pages
-- index.js
-- mobile.js
```
Toutefois, je trouve personnellement qu'utiliser des dossiers permet de garder un projet évolutif et plus lisible.

#####./pages/mobile/index.js

```javascript
import React from 'react';

export default class Mobile extends React.Component {
  render() {
    return (
      <div>
        <h1>Mobile</h1>
      </div>
    );
  }
}
```

Maintenant que vous avez sélectionné la façon de faire qui vous correspond le plus, vous pouvez accéder à votre page:

[http://localhost:3000/mobile](http://localhost:3000/mobile)

Ajoutons alors simplement des liens pour naviguer entre nos 2 pages.

#####./pages/index.js

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
#####./pages/mobile/index.js
```javascript
import React from 'react';

export default class Mobile extends React.Component {
  render() {
    return (
      <div>
        <h1>Mobile</h1>
        <a href="/">
          Retour
        </a>
      </div>
    );
  }
}
```

Toutefois, vos liens se comportent comme des liens html traditionnels. Pour avoir un comportement plus proche de ce qu'on peut attendre d'une application React (navigation instantané, pas de rafraichissement), il suffit d'utiliser l'élément ```<Link/>``` de Next.

Dans vos imports, ajoutez:

```javascript
import Link from 'next/link';
```

Et simplement englobez vos liens dans cet élément en déplacement l'attribut ```href``` sur le ```<Link/>```.

```javascript
...
<Link href="/mobile">
  <a>Mobile</a>
</Link>
...
```

En résumé:
#####./pages/index.js
```javascript
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
```
#####./pages/mobile/index.js
```javascript
import React from 'react';
import Link from 'next/link';

export default class Mobile extends React.Component {
  render() {
    return (
      <div>
        <h1>Mobile</h1>
        <Link href="/">
          <a>Retour</a>
        </Link>
      </div>
    );
  }
}
```
A ce point, vous disposez de 2 pages, avec un rendu serveur et une navigation. Voyons maintenant comment récupérer les données en conservant ce rendu côté serveur.

## Récupération des données et rendu serveur

Comme tous les projets React, les données peuvent être récupérées dans la fonction ```componentWillMount()``` du composant.
On utilisera ici Superagent de manière à rester constant à travers les différentes phase du projet:

```console
npm install superagent --save
``` 
#####./pages/mobile/index.js

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
```
On récupère les articles depuis l'API dans ```componentWillMount()``` et on les affiche.
Le soucis est qu'on ne dispose pas du rendu serveur. Si vous affichez le code source de la page, les titres des articles ne sont pas présents.

Grace à Next, la chose est simple. On dispose d'une fonction ```static async getInitialProps()``` qui nous permet de récupérer les données nécessaires au montage du composant, de façon synchrone et côté serveur. Le rendu n'interviendra donc qu'à la fin de l'exécution de cette fonction.

Il nous suffit maintenant de déplacer et modifier un peu notre process de récupération des données pour effectuer la récupération côté serveur. 

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
```
Vous avez maintenant votre page d'article. Si vous regardez le code source vous pouvez constater que notre contenu est bien présent. Nous avons donc en 10 minutes configuré un projet React, créé 2 pages, géré le routing et rendu ces page côté serveur.
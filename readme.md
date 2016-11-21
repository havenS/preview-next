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
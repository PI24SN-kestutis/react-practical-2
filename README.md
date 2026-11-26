# React praktinis darbas II – Receptų programėlė

Vilniaus kolegijos (VIKO) antras praktinis darbas, skirtas React bibliotekos temoms įsisavinti: maršrutams, autentifikacijai, konteksto naudojimui ir darbui su išoriniu API.

Tai viena React programėlė, sudaryta iš dviejų susietų dalių. Receptų turinys pasiekiamas tik prisijungus.

## Technologijos

- **React** – vartotojo sąsajos komponentai
- **JavaScript (JSX)** – programos logika
- **Vite** – projekto kūrimo ir paleidimo aplinka
- **React Router** – maršrutai ir apsaugoti puslapiai
- **json-server** – mokomasis serveris naudotojams ir mėgstamiausiems receptams
- **DummyJSON** – receptų duomenų šaltinis (tik skaitymui)
- **CSS** – vartotojo sąsajos stilius
- **ESLint** – kodo kokybės tikrinimas

Naudojami funkciniai komponentai, `useState`, `useEffect`, `createContext` ir `useContext`. Užklausoms naudojamas `fetch`.

## Praktinio darbo dalys

| Dalis | Pavadinimas | Būsena |
|---|---|---|
| A | Autentifikacijos sistema su apsaugotais maršrutais | Įgyvendinta |
| B | Receptų programėlė su mėgstamiausių receptų išsaugojimu | Įgyvendinta |

### A dalis – Autentifikacijos sistema

- Registracija: vardas, el. paštas, slaptažodis ir slaptažodžio pakartojimas.
- Laukų tikrinimas: privalomi laukai, el. pašto formatas, bent 6 simbolių slaptažodis, slaptažodžių sutapimas.
- Registracija su jau naudojamu el. paštu neleidžiama. Sėkmingai užsiregistravus nukreipiama į `/login`.
- Prisijungimas su aiškia klaida netinkamų duomenų atveju. Sėkmės atveju nukreipiama į `/dashboard`.
- Naudotojo duomenys (be slaptažodžio) saugomi `sessionStorage` ir atkuriami perkrovus puslapį.
- Atsijungimas išvalo kontekstą ir saugyklos įrašą bei nukreipia į `/login`.
- Neprisijungusį naudotoją apsaugoti maršrutai nukreipia į `/login`.

**Komponentai:** `AuthProvider`, `Register`, `Login`, `ProtectedRoute`, `Navbar`.

### B dalis – Receptų programėlė

- Receptų sąrašas iš DummyJSON su puslapiavimu po 5 receptus. Puslapių skaičius apskaičiuojamas pagal API grąžintą `total`, o „Atgal" ir „Kitas" mygtukai išjungiami pirmame ir paskutiniame puslapyje.
- Recepto kortelė rodo pavadinimą, nuotrauką, virtuvės tipą, nuorodą į peržiūrą ir mėgstamiausio recepto mygtuką.
- Išsami recepto peržiūra (`/recipe/:id`): ingredientai, gaminimo žingsniai, paruošimo ir gaminimo trukmė, porcijų skaičius. Veikia ir tiesiogiai atvėrus adresą. Neegzistuojančiam receptui rodomas pranešimas „Receptas nerastas".
- Mėgstamiausių pridėjimas (POST) ir šalinimas (DELETE pagal įrašo `id`). Receptas to paties naudotojo sąraše nesikartoja, o žymė išlieka pereinant tarp puslapių ir perkrovus puslapį.
- Puslapyje `/favorites` rodomi tik prisijungusio naudotojo įrašai. Tuščiam sąrašui rodoma „Mėgstamiausių receptų dar nėra."
- Įkėlimo būsenos, klaidų pranešimai ir apsauga nuo pakartotinio to paties veiksmo siuntimo. Sustabdžius serverį, sąsaja neteigia, kad pakeitimas pavyko.
- Atsijungus išvaloma mėgstamiausių būsena naršyklėje, o serveryje įrašai lieka. Vėl prisijungus, sąrašas atkuriamas.

**Komponentai:** `RecipeList`, `RecipeCard`, `RecipeDetail`, `Favorites`, `FavoritesProvider`.

## Maršrutai

| Maršrutas | Turinys | Prieiga |
|---|---|---|
| `/` | Pagrindinis puslapis su prisijungimo ir registracijos nuorodomis | Vieša |
| `/login` | Prisijungimo forma | Vieša |
| `/register` | Registracijos forma | Vieša |
| `/dashboard` | Receptų sąrašas su puslapiavimu | Tik prisijungus |
| `/recipe/:id` | Išsami recepto peržiūra | Tik prisijungus |
| `/favorites` | Asmeniniai mėgstamiausi receptai | Tik prisijungus |

Nežinomi adresai rodo puslapį „Puslapis nerastas".

## Projekto struktūra

```text
react-practical-2/
├── public/
├── src/
│   ├── api/
│   │   ├── authApi.js
│   │   ├── recipesApi.js
│   │   └── favoritesApi.js
│   ├── auth/
│   │   ├── AuthContext.js
│   │   ├── AuthProvider.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── auth.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Home.jsx
│   │   └── NotFound.jsx
│   ├── recipes/
│   │   ├── FavoritesContext.js
│   │   ├── FavoritesProvider.jsx
│   │   ├── RecipeList.jsx
│   │   ├── RecipeCard.jsx
│   │   ├── RecipeDetail.jsx
│   │   ├── Favorites.jsx
│   │   └── recipes.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── db.json
├── README.md
├── serverside-README.md
├── package.json
└── vite.config.js
```

## Diegimas ir paleidimas

**Reikalavimai:** Node.js ir npm, suderinami su naudojama Vite versija.

### 1. Atsisiųskite projektą

```bash
git clone https://github.com/PI24SN-kestutis/react-practical-2.git
cd react-practical-2
```

### 2. Įdiekite priklausomybes

```bash
npm install
```

### 3. Paleiskite mokomąjį serverį (pirmame terminale)

```bash
npm run server
```

Serveris veikia adresu `http://localhost:3001/`. Išsamiau: [serverside-README.md](serverside-README.md).

### 4. Paleiskite programą (antrame terminale)

```bash
npm run dev
```

Atidarykite terminale nurodytą adresą, paprastai `http://localhost:5173/`.

Pradiniai mokomieji duomenys: `demo@demo.com` / `demo123`.

## Kodo kokybės tikrinimas

```bash
npm run lint
npm run build
```

## Architektūra

- Vienas komponentas – vienas failas.
- Bendra naudotojo būsena laikoma `AuthContext`, kurią komponentai pasiekia per `useContext`.
- Mėgstamiausi receptai laikomi `FavoritesContext`, kuris priklauso nuo prisijungusio naudotojo. Pridėjimas ir šalinimas keičia sąrašą tik gavus sėkmingą serverio atsakymą.
- `isAuthenticated` apskaičiuojamas pagal `user`, o ne saugomas atskirai.
- HTTP užklausos išskirtos į `src/api/`. Naudojant `fetch`, visada tikrinamas `response.ok`.
- Būsena atnaujinama nekeičiant esamų objektų ir masyvų tiesiogiai.
- Kodo ir failų pavadinimai bei komentarai rašomi anglų kalba, sąsajos tekstai – lietuvių.

## Apribojimai

Autentifikacija yra tik mokomoji imitacija. Išsamus paaiškinimas pateiktas [serverside-README.md](serverside-README.md). Tikram sprendimui reikia serverio autentifikacijos, saugaus slaptažodžių maišymo ir prieigos teisių tikrinimo kiekvienai užklausai.

## Naudingos nuorodos

- [DummyJSON receptų API dokumentacija](https://dummyjson.com/docs/recipes)
- [json-server dokumentacija](https://github.com/typicode/json-server/tree/v0.17.4)
- [React Router: Navigate](https://reactrouter.com/api/components/Navigate)

## Autorius

Kęstutis Skrebė

VIKO studento React praktinis darbas.

# Serverio dalis (json-server)

Šiame dokumente aprašoma, kaip veikia mokomasis serveris, kokius duomenis jis saugo ir kokie yra jo apribojimai.

## Paskirtis

Programa naudoja du duomenų šaltinius:

| Šaltinis | Paskirtis | Operacijos |
|---|---|---|
| `json-server` (`http://localhost:3001`) | Naudotojai ir mėgstamiausi receptai | Skaitymas ir rašymas |
| DummyJSON (`https://dummyjson.com`) | Receptų duomenys | Tik skaitymas |

DummyJSON duomenų keitimo užklausos yra tik imituojamos, todėl mėgstamiausi receptai nuolat saugomi `json-server`.

## Paleidimas

```bash
npm run server
```

Skriptas `package.json` faile paleidžia:

```bash
json-server --watch db.json --port 3001
```

Naudojama `json-server` versija **0.17.4**. Naujesnės versijos yra beta ir elgiasi kitaip.

Programa (`npm run dev`) ir serveris (`npm run server`) paleidžiami atskiruose terminaluose.

## Duomenų failas

Visi duomenys saugomi faile [db.json](db.json). Serveriui veikiant, POST ir DELETE užklausos tiesiogiai keičia šį failą.

```json
{
  "users": [
    { "id": 1, "name": "Vartotojas DEMO", "email": "demo@demo.com", "password": "demo123" }
  ],
  "favorites": []
}
```

### Kolekcija `users`

| Laukas | Aprašymas |
|---|---|
| `id` | Naudotojo identifikatorius (suteikia serveris) |
| `name` | Vardas |
| `email` | El. paštas (saugomas mažosiomis raidėmis) |
| `password` | Mokomasis slaptažodis |

Šioje kolekcijoje saugomi tik išgalvoti naudotojai. Tikrų asmeninių slaptažodžių naudoti negalima.

### Kolekcija `favorites`

| Laukas | Aprašymas |
|---|---|
| `id` | Mėgstamiausio įrašo identifikatorius (suteikia serveris) |
| `userId` | Prisijungusio naudotojo `id` iš autentifikacijos konteksto |
| `recipeId` | DummyJSON recepto `id` |
| `name`, `image` | Papildomai saugomi kortelei (nebūtini) |

`userId` imamas iš autentifikacijos konteksto, o ne iš DummyJSON recepto lauko `userId`, nes jis nurodo recepto autorių.

Ši kolekcija bus naudojama įgyvendinant B dalį.

## Naudojami adresai

| Veiksmas | Užklausa |
|---|---|
| Rasti naudotoją pagal el. paštą | `GET /users?email=...` |
| Sukurti naudotoją | `POST /users` |
| Gauti naudotojo mėgstamiausius | `GET /favorites?userId=...` |
| Pridėti mėgstamiausią | `POST /favorites` |
| Pašalinti mėgstamiausią | `DELETE /favorites/{id}` (pagal įrašo `id`, ne `recipeId`) |

Pirmi du adresai jau naudojami A dalyje. Kiti bus naudojami B dalyje.

## Kaip veikia registracija ir prisijungimas

1. **Registracija.** Programa ieško naudotojo pagal el. paštą. Jei toks yra, rodoma klaida. Jei nėra, siunčiamas `POST /users`.
2. **Prisijungimas.** Programa suranda naudotoją pagal el. paštą ir palygina slaptažodį naršyklėje. Slaptažodis nesiunčiamas URL adrese, nes adresai gali atsidurti žurnaluose ir naršyklės istorijoje.
3. **Prisijungus.** Kontekste ir `sessionStorage` saugomi tik `id`, `name` ir `email`. Slaptažodis neišsaugomas.

## Apribojimai

Tai mokomasis sprendimas, o ne saugi autentifikacija:

- `json-server` neturi saugios registracijos, sesijų ir naudotojų teisių tikrinimo.
- Slaptažodžiai `db.json` faile saugomi atviru tekstu.
- Slaptažodis lyginamas naršyklėje, todėl `GET /users` grąžina ir slaptažodžius.
- Bet kas, galintis siųsti užklausas į serverį, gali perskaityti ar ištrinti bet kurio naudotojo duomenis.
- `ProtectedRoute` riboja tik React puslapių rodymą, bet neapsaugo serverio duomenų.
- Mėgstamiausių atskyrimas tarp naudotojų vertinamas tik programėlės sąsajoje.

Tikram sprendimui reikia serverio autentifikacijos, saugaus slaptažodžių maišymo (pvz. `bcrypt`) ir prieigos teisių tikrinimo kiekvienai užklausai.

## Serverio klaidos

Sustabdžius `json-server`, programa turi rodyti klaidos pranešimą ir neteigti, kad neišsaugotas pakeitimas pavyko. Naudojant `fetch`, tikrinamas `response.ok`, nes HTTP klaida savaime nepatenka į `catch`.

## Testinių duomenų tvarkymas

Bandant programą, `db.json` papildomas testiniais naudotojais ir įrašais. Prieš `git commit` patikrinkite pakeitimus:

```bash
git diff db.json
```

Jei testinių įrašų palikti nenorite:

```bash
git checkout db.json
```

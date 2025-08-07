# Filmrecension API

Ett säkert och välstrukturerat REST API byggt med **Node.js**, **Express** och **MongoDB/Mongoose** för att hantera filmer, recensioner och användare med autentisering och rollbaserad åtkomstkontroll.

## Säkerhetsfokus

API:t är konstruerat med **middleware som första försvarslinje**.
Innan en förfrågan ens når dina controllers körs olika middleware som:

- **Autentisering (JWT)** – ser till att bara inloggade användare får utföra skyddade åtgärder.
- **Rollkontroll** – begränsar t.ex. skapande och radering av filmer till endast `admin`.
- **ID-validering** (`validateId`) – stoppar ogiltiga MongoDB ObjectId redan innan databasen kontaktas, vilket minimerar risken för fel (som `CastError`) och förbättrar prestandan.
- **Separat valideringslogik** gör koden renare och ger en konsekvent säkerhet på alla rutter.

Resultatet blir att felaktiga eller obehöriga förfrågningar blockeras **innan** de når själva databasen eller logiken.

## Funktioner

- **Användarhantering**: Registrera och logga in användare med JWT.
- **Roller**: `user` och `admin` – endast admin kan skapa, uppdatera och ta bort filmer.
- **Filmer**: Lägg till, hämta, uppdatera, ta bort filmer och visa recensioner för en specifik film.
- **Recensioner**: Lägg till, hämta, uppdatera och ta bort recensioner.
- **Betyg**: Hämta alla filmer med genomsnittligt betyg.
- **Automatiserad validering** av ID:n och åtkomstkontroller via middleware.

## Installation

```bash
# Klona repot
git clone <REPO_URL>
cd <mappnamn>

# Installera beroenden
npm install

# .env.example finns vilket gör att du kan koppla upp till min mongoDB
PORT=5000
MONGODB_URI=<din MongoDB URI>
JWT_SECRET=<valfri hemlig nyckel>

# Starta servern
npm run dev   # med nodemon
# eller
npm start     # vanlig start
```

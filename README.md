# Keyboarder

Connect to airtable to pick a random keyboard to type on.

## Running locally

Set the following variables in a `.env` file:

```
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

Then run:

```bash
npm run dev:ts
```

Open [http://localhost:3000](http://localhost:3000).

## Airtable schema

This app assumes that you have an Airtable base set up in the following way:

### Builds Table

Requires the following fields:

- Name
- Layout
- Status that includes "Built"
- Photo (file attachment)
- An association to Switches
- An association to Keycaps

### Switches Table

Requires the following fields:

- Name

### Keycaps Table

Requires the following fields:

- Name

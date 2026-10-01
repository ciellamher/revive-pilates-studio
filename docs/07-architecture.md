# How it's built

Two flowcharts of Revive Pilates Studio: how the parts connect, and how one
booking moves through them.

## Architecture

Every page talks to one Express API. Only the API touches the database and
sends email.

```mermaid
flowchart LR
    subgraph Users["Clients & admin"]
        B["Browser<br/>React 19 + Vite<br/>Tailwind CSS · React Router"]
    end

    subgraph Vercel["Vercel"]
        S["Static site<br/>security headers"]
        A["Express API<br/>Node.js serverless<br/>sign-in tokens · rate limits"]
    end

    subgraph Neon["Neon · Singapore"]
        D[("PostgreSQL<br/>classes · bookings · packages<br/>users · coaches")]
    end

    subgraph GitHub["GitHub"]
        R["Repository"]
        C["Actions cron<br/>every 30 min"]
    end

    G["Gmail<br/>Nodemailer"]
    I["Client inbox<br/>sign-in link · confirmations<br/>reminder 12 h before class"]

    B -- "loads pages" --> S
    B <-- "HTTPS + JSON" --> A
    A <-- "SQL" --> D
    A -- "sends" --> G
    G -- "email" --> I
    I -. "sign-in link opens the site" .-> B
    R -- "push = auto-deploy" --> Vercel
    C -- "POST /api/reminders/send" --> A

    classDef hub fill:#2A1D15,color:#F5F0E8,stroke:#2A1D15
    class A hub
```

## A booking, start to finish

```mermaid
flowchart TD
    A["Pick a class<br/>filter by branch, class or coach"] --> B{"Group class<br/>or private?"}
    B -- "Group" --> C["Choose a spot<br/>on the room layout"]
    B -- "Private" --> P["Choose Private, Duo, Trio or Clinical<br/>Duo/Trio: each attendee's name and email"]
    C --> S{"Signed in?"}
    P --> S
    S -- "No" --> L["Email sign-in link<br/>valid 15 minutes"] --> S
    S -- "Yes" --> Y{"How to pay?"}
    Y -- "Package credit" --> K["Credit used<br/>booking confirmed at once"]
    Y -- "GCash / BPI" --> U["Upload receipt<br/>booking pending"]
    U --> V{"Admin checks<br/>the receipt"}
    V -- "Confirm" --> E["Confirmation email"]
    V -- "Reject" --> X["Spot released<br/>'payment not verified' email"]
    K --> E
    E --> R["Reminder email<br/>12 hours before class"]
```

# How It's Built

Two flowcharts of Revive Pilates Studio: how the parts connect, and how one booking moves through them.

---

### 01 — ARCHITECTURE

> Every page talks to one Express API. Only the API touches the database and sends email.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FBF8F3", "primaryBorderColor": "#E4D9CA", "primaryTextColor": "#2A1D15", "lineColor": "#9C8B7C", "edgeLabelBackground": "#FFFFFF"}, "flowchart": {"curve": "basis", "nodeSpacing": 40, "rankSpacing": 70, "padding": 20}}}%%
flowchart LR
    B("<b>Browser</b><br/>React 19 · Vite<br/>Tailwind CSS")
    A("<b>Express API</b><br/>on Vercel")
    D[("<b>PostgreSQL</b><br/>Neon<br/>Singapore")]
    C("<b>GitHub Actions</b><br/>every 30 min")
    G("<b>Gmail</b><br/>Nodemailer")
    I("<b>Client inbox</b>")

    B <-->|HTTPS| A
    A <-->|SQL| D
    C -->|reminders| A
    A -->|emails| G
    G --> I

    classDef client fill:#FBF8F3,stroke:#C9B8A3,color:#2A1D15
    classDef hub fill:#2A1D15,stroke:#2A1D15,color:#F5F0E8
    classDef data fill:#E3ECF1,stroke:#3B657F,color:#1F3A4A
    classDef ext fill:#FFFFFF,stroke:#D8CCBF,color:#2A1D15
    class B,I client
    class A hub
    class D data
    class C,G ext
```

| Part | Role |
| --- | --- |
| **Browser** | The site clients and the admin use, on phone or laptop |
| **Express API** | Hosted on Vercel with the website. The only part that reads the database or sends email; checks sign-in tokens and rate limits |
| **PostgreSQL** | Classes, bookings, packages, users and coaches, hosted in Singapore for speed in the Philippines |
| **Gmail** | Sign-in links (valid 15 minutes), confirmations, and reminders 12 hours before class |
| **GitHub Actions** | Calls the API every 30 minutes to send due reminders. Every push to GitHub also redeploys the site |
| **Client inbox** | The sign-in link in the email opens the site, signed in |

---

### 02 — A BOOKING, START TO FINISH

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#FBF8F3", "primaryBorderColor": "#E4D9CA", "primaryTextColor": "#2A1D15", "lineColor": "#9C8B7C", "edgeLabelBackground": "#FFFFFF"}, "flowchart": {"curve": "basis", "nodeSpacing": 34, "rankSpacing": 40, "padding": 16}}}%%
flowchart TD
    A(["Pick a class"]) --> B{{"Group or private?"}}
    B -->|Group| C("Choose a spot")
    B -->|Private| P("Pick session type<br/>+ attendee emails")
    C --> S{{"Signed in?"}}
    P --> S
    S -->|No| L("Email sign-in link") --> S
    S -->|Yes| Y{{"Pay with?"}}
    Y -->|Package| K("Use 1 credit")
    Y -->|GCash / BPI| U("Upload receipt")
    U --> V{{"Admin checks"}}
    V -->|Reject| X(["Spot released"])
    V -->|Confirm| E("Confirmation email")
    K --> E
    E --> R(["Reminder 12 h before class"])

    classDef step fill:#FBF8F3,stroke:#C9B8A3,color:#2A1D15
    classDef choice fill:#E3ECF1,stroke:#3B657F,color:#1F3A4A
    classDef start fill:#2A1D15,stroke:#2A1D15,color:#F5F0E8
    classDef good fill:#E4EEE6,stroke:#6E9479,color:#24402C
    classDef bad fill:#F7E3DF,stroke:#B5655A,color:#5A2620
    class C,P,L,K,U step
    class B,S,Y,V choice
    class A start
    class E,R good
    class X bad
```

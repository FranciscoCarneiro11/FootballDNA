# FootballDNA

> Transforming raw football data into actionable insights.

A full-stack scouting application that combines data science and web development to analyse, compare, and recommend football players across Europe's top 5 leagues.

---

## What is FootballDNA?

FootballDNA is an powered scouting engine built on top of statistical data from the 2024/25 season. It allows you to:

- **Discover** the statistical profile of any player across 47 metrics
- **Find similar players** using a weighted cosine similarity engine
- **Compare** two players side by side with visual charts
- **Rank** players by a custom Market Index that combines age and performance

---

## Tech Stack

### Backend
- **FastAPI** — REST API with automatic Swagger docs
- **pandas** — data loading, filtering, and transformation
- **scikit-learn** — StandardScaler + cosine similarity engine
- **Pydantic** — request/response validation

### Frontend
- **React + Vite** — fast development and build
- **React Router** — client-side routing
- **Tailwind CSS** — utility-first styling
- **Recharts** — data visualisation
- **Axios** — HTTP client

---

## The Dataset

| Metric | Value |
|---|---|
| Players | 2,210 |
| Leagues | 5 (PL, La Liga, Bundesliga, Serie A, Ligue 1) |
| Metrics per player | 47 |
| Minimum minutes filter | 270 min |
| Season | 2024/25 |

Data sourced from [FBref](https://fbref.com) and processed via a custom pipeline in `notebooks/Analise.ipynb`.

---

## The Similarity Engine

Players are compared using **cosine similarity** on a normalised feature vector. The engine supports **weighted profiles** to prioritise different roles:

| Profile | Focus |
|---|---|
| `balanced` | All metrics equally weighted |
| `finisher` | Goals, xG, shots, SoT |
| `creator` | SCA90, GCA90, assists, key passes |
| `defender` | Tackles, interceptions, clearances, blocks |

---

## Market Index

A custom scoring formula that combines **age** and **performance** to surface undervalued players:

```
Market Index = (Age Score × 0.4) + (Performance Score × 0.6)
```

- **Age Score** — peaks at 100 for players ≤ 21, decays by 7 points per year after
- **Performance Score** — normalised average of Goals, Assists, SCA90, and Recoveries

---

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
py -3.12 -m uvicorn main:app --reload
# API docs: http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---


## Roadmap

- [x] Data pipeline and Market Index calculation
- [x] FastAPI backend with similarity engine
- [x] React frontend with homepage
- [ ] Player profile page with radar chart
- [ ] Recommendations page with filters
- [ ] Compare page with side-by-side stats
- [ ] Connect frontend to live API

---

## Author

**Francisco Carneiro** — [@FranciscoCarneiro11](https://github.com/FranciscoCarneiro11)

*Built as a portfolio project combining a passion for football and data science.*

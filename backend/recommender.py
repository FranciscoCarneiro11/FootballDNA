import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from models import PlayerResult

# Pre-defined weight profiles 
PROFILES = {
    "finisher": {
        "Gls": 3.0, "xG": 2.5, "Sh": 2.0, "SoT": 2.0,
        "npxG": 2.0, "G/Sh": 1.5,
        "Tkl": 0.1, "Int": 0.1, "Clr": 0.1  # irrelevant for a 9
    },
    "creator": {
        "SCA90": 3.0, "GCA90": 2.5, "Ast": 2.0, "KP": 2.0,
        "PPA": 2.0, "PrgP": 1.5, "TB": 1.5,
        "Tkl": 0.2, "Gls": 0.5
    },
    "defender": {
        "Tkl": 3.0, "Int": 2.5, "Clr": 2.0, "Blocks": 2.0,
        "Tkl%": 2.0, "Recov": 1.5,
        "Gls": 0.1, "SCA90": 0.2
    },
    "balanced": {}  # Without extra weights — uses all metrics equally
}

class RecommenderEngine:
    """
    Player recommendation engine.
    """

    def __init__(self, csv_path: str):
        self.df = self._load_data(csv_path)
        self._cat_cols = ["Player", "Nation", "Pos", "Squad", "Comp"]
        
        # Pre-compute matrices for each profile at startup.
        print("Pre-computing similarity matrices...")
        self._matrices = {
            profile: self._build_matrix(weights)
            for profile, weights in PROFILES.items()
        }
        print(f"Engine ready. {len(self.df)} players loaded.")

    def _load_data(self, path: str) -> pd.DataFrame:
        df = pd.read_csv(path)
        df = df[df["Player"] != "Player"]  
        return df.reset_index(drop=True)

    def _build_matrix(self, weights: dict) -> any:
        """Constructs the cosine similarity matrix with optional weights."""
        df_numeric = self.df.drop(columns=self._cat_cols, errors="ignore").fillna(0)
        
        scaler = StandardScaler()
        scaled = pd.DataFrame(
            scaler.fit_transform(df_numeric),
            columns=df_numeric.columns
        )

        for col, weight in weights.items():
            if col in scaled.columns:
                scaled[col] = scaled[col] * weight

        return cosine_similarity(scaled.values)

    def player_exists(self, player_name: str) -> bool:
        return player_name in self.df["Player"].values

    def search_players(self, query: str, limit: int = 10) -> list[dict]:
        """Autocomplete — searches for players by name """
        mask = self.df["Player"].str.contains(query, case=False, na=False)
        results = self.df[mask].head(limit)
        return results[["Player", "Squad", "Pos", "Age", "Comp", "Market_Index"]].to_dict(orient="records")

    def get_player_info(self, player_name: str) -> dict | None:
        """Returns basic information for a specific player."""
        row = self.df[self.df["Player"] == player_name]
        if row.empty:
            return None
        r = row.iloc[0]
        return {
            "player": r["Player"],
            "squad": r["Squad"],
            "pos": r["Pos"],
            "age": r["Age"],
            "comp": r["Comp"],
            "market_index": float(r["Market_Index"]) if "Market_Index" in r.index else None
        }

    def recommend(
        self,
        player_name: str,
        profile: str = "balanced",
        top_n: int = 5,
        target_pos: str | None = None,
        max_age: float | None = None,
        comp: str | None = None,
    ) -> list[PlayerResult]:
        """
        Recommend similar players based on a query player and optional filters.
        """
        if profile not in self._matrices:
            profile = "balanced"

        matrix = self._matrices[profile]
        idx = self.df[self.df["Player"] == player_name].index[0]

        # Similarity scores for all players
        sim_scores = list(enumerate(matrix[idx]))

        # Build a temporary DataFrame with scores.
        df_temp = self.df.copy()
        df_temp["Similarity"] = [s[1] for s in sim_scores]

        df_temp = df_temp[df_temp["Player"] != player_name]

        # Applay filters
        if target_pos:
            df_temp = df_temp[df_temp["Pos"].str.contains(target_pos, na=False)]
        if max_age:
            df_temp = df_temp[df_temp["Age"] <= max_age]
        if comp:
            df_temp = df_temp[df_temp["Comp"].str.contains(comp, case=False, na=False)]

        # Top N results
        top = df_temp.sort_values("Similarity", ascending=False).head(top_n)

        # Map to the Pydantic model 
        return [
            PlayerResult(
                player=row["Player"],
                squad=row["Squad"],
                pos=row["Pos"],
                age=float(row["Age"]),
                comp=row["Comp"],
                similarity=round(float(row["Similarity"]), 4),
                market_index=row.get("Market_Index", None)
            )
            for _, row in top.iterrows()
        ]
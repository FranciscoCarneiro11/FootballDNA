from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from models import (
    WeightedRecommendationRequest,
    RecommendationResponse,
    PlayerInfoResponse,
    ErrorResponse,
)
from recommender import RecommenderEngine

# Global Configuration
DATA_PATH = "../data/players_master.csv"

engine: RecommenderEngine = None


# Server Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads the ML engine when the server starts."""
    global engine
    engine = RecommenderEngine(csv_path=DATA_PATH)
    yield
    print("Server shutting down.")


# CREATE THE APP
app = FastAPI(
    title="Football Scout API",
    description=(
        "Football player recommendation engine based on statistical similarity. "
        "Uses cosine similarity with weight profiles for different playing styles."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allows frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# Routes
@app.get("/", tags=["Health"])
async def root():
    """Checks if the server is alive."""
    return {"status": "ok", "message": "Football Scout API is running."}


@app.get(
    "/players/search",
    response_model=list[PlayerInfoResponse],
    tags=["Players"],
    summary="Autocomplete player name",
)
async def search_players(
    q: str = Query(..., min_length=2, description="Partial player name"),
    limit: int = Query(default=10, ge=1, le=50),
):
    """
    Searches for players by name 
    """
    results = engine.search_players(q, limit=limit)
    return results


@app.get(
    "/players/{player_name}",
    response_model=PlayerInfoResponse,
    responses={404: {"model": ErrorResponse}},
    tags=["Players"],
    summary="Get information for a specific player",
)
async def get_player(player_name: str):
    """
    Returns basic information for a player by their exact name.
    Returns 404 if the player does not exist.
    """
    info = engine.get_player_info(player_name)
    if not info:
        raise HTTPException(
            status_code=404,
            detail=f"Player '{player_name}' not found in the database."
        )
    return info


@app.post(
    "/recommend",
    response_model=RecommendationResponse,
    responses={404: {"model": ErrorResponse}, 422: {"description": "Validation failed"}},
    tags=["Recommendations"],
    summary="Recommend similar players",
)
async def recommend_players(request: WeightedRecommendationRequest):
    """
    Find similar players based on a query player and optional filters.
    """
    # Validação de existência — devolve 404 formatado
    if not engine.player_exists(request.player_name):
        raise HTTPException(
            status_code=404,
            detail=f"Player '{request.player_name}' not found. Use /players/search to confirm the exact name    ."
        )

    results = engine.recommend(
        player_name=request.player_name,
        profile=request.profile,
        top_n=request.top_n,
        target_pos=request.target_pos,
        max_age=request.max_age,
        comp=request.comp,
    )

    return RecommendationResponse(
        query_player=request.player_name,
        profile_used=request.profile,
        results=results,
        total_found=len(results),
    )
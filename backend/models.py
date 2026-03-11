from pydantic import BaseModel, Field
from typing import Optional

# Input Models
class RecommendationRequest(BaseModel):
    player_name: str = Field(..., example = "Erling Haaland")
    top_n: int = Field(default = 5, ge = 1, le = 20, description="Número de resultados (1-20)")
    
    # Optional filters
    target_pos: Optional[str] = Field(default=None, example = "FW", description="Posição: FW, MF, DF, GK")
    max_age: Optional[float] = Field(default=None, ge=15, le=45, example=25)
    comp: Optional[str] = Field(default=None, example="Premier League")
    
class WeightedRecommendationRequest(RecommendationRequest):
    """Pedido com pesos personalizados por perfil de jogo."""
    profile: str = Field(
        default="balanced",
        description="Perfil: 'finisher', 'creator', 'defender', 'balanced'"
    )
    
# Output Models 
class PlayerResult(BaseModel):
    player: str
    squad: str
    pos: str
    age: float
    comp: str
    similarity: float = Field(..., ge=0.0, le=1.0)
    market_index: Optional[float] = None
    
class RecommendationResponse(BaseModel):
    """Answer model for player recommendations."""
    query_player: str
    profile_used: str
    results: list[PlayerResult]
    total_found: int
    
class PlayerInfoResponse(BaseModel):
    """Basic information about a player."""
    player: str
    squad: str
    pos: str
    age: float
    comp: str
    market_index: Optional[float] = None


class ErrorResponse(BaseModel):
    """Format for error messages."""
    detail: str
    status_code: int
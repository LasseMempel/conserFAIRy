import pytest
import pytest_asyncio
from httpx import AsyncClient

BASE_URL = "http://localhost:8000"


@pytest_asyncio.fixture
async def client():
    """Plain HTTP client pointing at the live server."""
    async with AsyncClient(base_url=BASE_URL) as ac:
        yield ac


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient):
    """Register a test user and return ready-to-use Bearer auth headers."""
    await client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
    })
    response = await client.post(
        "/auth/jwt/login",
        data={"username": "test@example.com", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
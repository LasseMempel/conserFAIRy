import uuid
import pytest
from httpx import AsyncClient


def unique_email() -> str:
    """Generate a unique email for each test to avoid conflicts in the shared DB."""
    return f"user-{uuid.uuid4()}@example.com"


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    email = unique_email()
    response = await client.post("/auth/register", json={
        "email": email,
        "password": "securepassword",
        "first_name": "New",
        "last_name": "User",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert data["first_name"] == "New"
    assert data["last_name"] == "User"
    assert "id" in data
    assert "password" not in data  # password must never be returned


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    # Intentionally reuse the same email — this is what we're testing
    email = unique_email()
    payload = {
        "email": email,
        "password": "password123",
        "first_name": "Dup",
        "last_name": "User",
    }
    await client.post("/auth/register", json=payload)
    response = await client.post("/auth/register", json=payload)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_register_missing_fields(client: AsyncClient):
    response = await client.post("/auth/register", json={
        "email": unique_email(),
        "password": "password123",
        # missing first_name and last_name
    })
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# Login / JWT
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    email = unique_email()
    await client.post("/auth/register", json={
        "email": email,
        "password": "mypassword",
        "first_name": "Login",
        "last_name": "User",
    })
    response = await client.post(
        "/auth/jwt/login",
        data={"username": email, "password": "mypassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    email = unique_email()
    await client.post("/auth/register", json={
        "email": email,
        "password": "correctpassword",
        "first_name": "Wrong",
        "last_name": "Pass",
    })
    response = await client.post(
        "/auth/jwt/login",
        data={"username": email, "password": "wrongpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    # unique_email() ensures this address was never registered
    response = await client.post(
        "/auth/jwt/login",
        data={"username": unique_email(), "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 400


# ---------------------------------------------------------------------------
# Authenticated route
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_authenticated_route_with_token(client: AsyncClient, auth_headers: dict):
    response = await client.get("/authenticated-route", headers=auth_headers)
    assert response.status_code == 200
    assert "Hello" in response.json()["message"]


@pytest.mark.asyncio
async def test_authenticated_route_without_token(client: AsyncClient):
    response = await client.get("/authenticated-route")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_authenticated_route_invalid_token(client: AsyncClient):
    response = await client.get(
        "/authenticated-route",
        headers={"Authorization": "Bearer this.is.not.valid"}
    )
    assert response.status_code == 401


# ---------------------------------------------------------------------------
# User profile (/users/me)
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, auth_headers: dict):
    response = await client.get("/users/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["first_name"] == "Test"
    assert data["last_name"] == "User"


@pytest.mark.asyncio
async def test_update_current_user(client: AsyncClient, auth_headers: dict):
    response = await client.patch(
        "/users/me",
        json={"first_name": "Updated", "last_name": "Name"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Updated"
    assert data["last_name"] == "Name"
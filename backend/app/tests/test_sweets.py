class TestCreateSweet:
    """Test cases for creating sweets."""
    
    def test_create_sweet_success(self, client, auth_headers, test_sweet_data):
        response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)

        assert response.status_code == 201
        data = response.json()

        assert data["name"] == test_sweet_data["name"]
        assert data["category"] == test_sweet_data["category"]
        assert data["price"] == test_sweet_data["price"]
        assert data["quantity"] == test_sweet_data["quantity"]
        assert "id" in data
    
    def test_create_sweet_without_auth(self, client, test_sweet_data):
        response = client.post("/api/v1/sweets", json=test_sweet_data)

        assert response.status_code == 401
    
    def test_create_sweet_invalid_price(self, client, auth_headers):
        response = client.post("/api/v1/sweets", json={
            "name": "Bad Sweet",
            "category": "Test",
            "price": -5.0,
            "quantity": 10
        }, headers=auth_headers)

        assert response.status_code == 422
    
    def test_create_sweet_invalid_quantity(self, client, auth_headers):
        response = client.post("/api/v1/sweets", json={
            "name": "Bad Sweet",
            "category": "Test",
            "price": 5.0,
            "quantity": -10
        }, headers=auth_headers)

        assert response.status_code == 422


class TestGetSweets:
    """Test cases for retrieving sweets."""
    
    def test_get_all_sweets_empty(self, client, auth_headers):
        response = client.get("/api/v1/sweets", headers=auth_headers)

        assert response.status_code == 200
        assert response.json() == []
    
    def test_get_all_sweets(self, client, auth_headers, test_sweet_data):
        client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
        
        response = client.get("/api/v1/sweets", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 1
        assert data[0]["name"] == test_sweet_data["name"]
    
    def test_get_all_sweets_multiple(self, client, auth_headers):
        sweets = [
            {"name": "Sweet 1", "category": "Cat1", "price": 1.99, "quantity": 10},
            {"name": "Sweet 2", "category": "Cat2", "price": 2.99, "quantity": 20},
            {"name": "Sweet 3", "category": "Cat1", "price": 3.99, "quantity": 30}
        ]
        for sweet in sweets:
            client.post("/api/v1/sweets", json=sweet, headers=auth_headers)
        
        response = client.get("/api/v1/sweets", headers=auth_headers)

        assert response.status_code == 200
        assert len(response.json()) == 3


class TestSearchSweets:
    """Test cases for searching sweets."""
    
    def test_search_by_name(self, client, auth_headers):
        client.post("/api/v1/sweets", json={"name": "Chocolate Bar", "category": "Chocolate", "price": 2.99, "quantity": 10}, headers=auth_headers)
        client.post("/api/v1/sweets", json={"name": "Gummy Bears", "category": "Gummy", "price": 1.99, "quantity": 20}, headers=auth_headers)
        
        response = client.get("/api/v1/sweets/search?name=chocolate", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()

        assert len(data) == 1
        assert "Chocolate" in data[0]["name"]
    
    def test_search_by_category(self, client, auth_headers):
        client.post("/api/v1/sweets", json={"name": "Chocolate Bar", "category": "Chocolate", "price": 2.99, "quantity": 10}, headers=auth_headers)
        client.post("/api/v1/sweets", json={"name": "Dark Chocolate", "category": "Chocolate", "price": 3.99, "quantity": 15}, headers=auth_headers)
        client.post("/api/v1/sweets", json={"name": "Gummy Bears", "category": "Gummy", "price": 1.99, "quantity": 20}, headers=auth_headers)
        
        response = client.get("/api/v1/sweets/search?category=Chocolate", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()

        assert len(data) == 2
    
    def test_search_by_price_range(self, client, auth_headers):
        client.post("/api/v1/sweets", json={"name": "Cheap Sweet", "category": "Test", "price": 1.00, "quantity": 10}, headers=auth_headers)
        client.post("/api/v1/sweets", json={"name": "Medium Sweet", "category": "Test", "price": 5.00, "quantity": 10}, headers=auth_headers)
        client.post("/api/v1/sweets", json={"name": "Expensive Sweet", "category": "Test", "price": 10.00, "quantity": 10}, headers=auth_headers)
        
        response = client.get("/api/v1/sweets/search?min_price=2.0&max_price=7.0", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()

        assert len(data) == 1
        assert data[0]["name"] == "Medium Sweet"
    
    def test_search_combined_filters(self, client, auth_headers):
        client.post("/api/v1/sweets", json={"name": "Milk Chocolate", "category": "Chocolate", "price": 2.99, "quantity": 10}, headers=auth_headers)
        client.post("/api/v1/sweets", json={"name": "Dark Chocolate", "category": "Chocolate", "price": 4.99, "quantity": 15}, headers=auth_headers)
        client.post("/api/v1/sweets", json={"name": "Chocolate Gummy", "category": "Gummy", "price": 3.99, "quantity": 20}, headers=auth_headers)
        
        response = client.get("/api/v1/sweets/search?category=Chocolate&min_price=2.0&max_price=4.0", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()

        assert len(data) == 1
        assert data[0]["name"] == "Milk Chocolate"


class TestUpdateSweet:
    """Test cases for updating v1/sweets."""
    
    def test_update_sweet_success(self, client, auth_headers, test_sweet_data):
        create_response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
        sweet_id = create_response.json()["id"]
        
        update_data = {"name": "Updated Sweet", "price": 5.99}
        response = client.put(f"/api/v1/sweets/{sweet_id}", json=update_data, headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()

        assert data["name"] == "Updated Sweet"
        assert data["price"] == 5.99
        assert data["category"] == test_sweet_data["category"]
    
    def test_update_nonexistent_sweet(self, client, auth_headers):
        response = client.put("/api/v1/sweets/99999", json={"name": "Updated"}, headers=auth_headers)

        assert response.status_code == 404
    
    def test_update_sweet_without_auth(self, client, test_sweet_data):
        response = client.put("/api/v1/sweets/1", json={"name": "Updated"})

        assert response.status_code == 401

class TestDeleteSweet:
    """Test cases for deleting sweets."""
    
    def test_delete_sweet_as_admin(self, client, admin_headers, test_sweet_data):
        create_response = client.post("/api/v1/sweets", json=test_sweet_data, headers=admin_headers)
        sweet_id = create_response.json()["id"]
        
        response = client.delete(f"/api/v1/sweets/{sweet_id}", headers=admin_headers)

        assert response.status_code == 200
        
        get_response = client.get("/api/v1/sweets", headers=admin_headers)

        assert len(get_response.json()) == 0
    
    def test_delete_sweet_as_regular_user(self, client, auth_headers, test_sweet_data):
        create_response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
        sweet_id = create_response.json()["id"]
        
        response = client.delete(f"/api/v1/sweets/{sweet_id}", headers=auth_headers)
        
        assert response.status_code == 403
    
    def test_delete_nonexistent_sweet(self, client, admin_headers):
        response = client.delete("/api/v1/sweets/99999", headers=admin_headers)

        assert response.status_code == 404


class TestPurchaseSweet:
    """Test cases for purchasing sweets."""
    
    def test_purchase_sweet_success(self, client, auth_headers, test_sweet_data):
        create_response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
        sweet_id = create_response.json()["id"]
        initial_quantity = test_sweet_data["quantity"]
        
        response = client.post(f"/api/v1/sweets/{sweet_id}/purchase", json={"quantity": 5}, headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()

        assert data["quantity"] == initial_quantity - 5
    
    def test_purchase_more_than_available(self, client, auth_headers, test_sweet_data):
        test_sweet_data["quantity"] = 10
        create_response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
        sweet_id = create_response.json()["id"]
        
        response = client.post(f"/api/v1/sweets/{sweet_id}/purchase", json={"quantity": 15}, headers=auth_headers)

        assert response.status_code == 400
        assert "insufficient" in response.json()["detail"].lower()
    
    def test_purchase_invalid_quantity(self, client, auth_headers, test_sweet_data):
        create_response = client.post("/api/v1/sweets", json=test_sweet_data, headers=auth_headers)
        sweet_id = create_response.json()["id"]
        
        response = client.post(f"/api/v1/sweets/{sweet_id}/purchase", json={"quantity": -5}, headers=auth_headers)

        assert response.status_code == 422
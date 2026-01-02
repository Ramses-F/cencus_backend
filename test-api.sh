#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000"

echo -e "${BLUE}=== Test des APIs Census Backend ===${NC}\n"

# Test 1: Route principale
echo -e "${GREEN}1. Test route principale${NC}"
curl -s ${API_URL}/ | jq .
echo -e "\n"

# Test 2: Inscription
echo -e "${GREEN}2. Inscription d'un admin${NC}"
curl -s -X POST ${API_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq .
echo -e "\n"

# Test 3: Connexion
echo -e "${GREEN}3. Connexion${NC}"
curl -s -X POST ${API_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq .
echo -e "\n"

# Test 4: Créer un enregistrement
echo -e "${GREEN}4. Créer un enregistrement de recensement${NC}"
curl -s -X POST ${API_URL}/api/census \
  -H "Content-Type: application/json" \
  -d '{
    "lotNumber": "A123",
    "familyName": "Dupont",
    "responsibleName": "Jean Dupont",
    "contact": "+225 0123456789",
    "inhabitants": 5,
    "children": 2,
    "notes": "Test"
  }' | jq .
echo -e "\n"

# Test 5: Créer un autre enregistrement
echo -e "${GREEN}5. Créer un deuxième enregistrement${NC}"
curl -s -X POST ${API_URL}/api/census \
  -H "Content-Type: application/json" \
  -d '{
    "lotNumber": "B456",
    "familyName": "Martin",
    "responsibleName": "Marie Martin",
    "contact": "+225 9876543210",
    "inhabitants": 4,
    "children": 1,
    "notes": "Deuxième test"
  }' | jq .
echo -e "\n"

# Test 6: Récupérer tous les enregistrements
echo -e "${GREEN}6. Récupérer tous les enregistrements${NC}"
curl -s ${API_URL}/api/census | jq .
echo -e "\n"

# Test 7: Statistiques
echo -e "${GREEN}7. Obtenir les statistiques${NC}"
curl -s ${API_URL}/api/census/stats | jq .
echo -e "\n"

# Test 8: Import en masse
echo -e "${GREEN}8. Test import en masse${NC}"
curl -s -X POST ${API_URL}/api/census/import \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {
        "lotNumber": "C789",
        "familyName": "Bernard",
        "responsibleName": "Paul Bernard",
        "contact": "+225 1111111111",
        "inhabitants": 3,
        "children": 0
      },
      {
        "lotNumber": "D012",
        "familyName": "Leroy",
        "responsibleName": "Sophie Leroy",
        "contact": "+225 2222222222",
        "inhabitants": 6,
        "children": 3
      }
    ]
  }' | jq .
echo -e "\n"

# Test 9: Statistiques après import
echo -e "${GREEN}9. Statistiques après import${NC}"
curl -s ${API_URL}/api/census/stats | jq .
echo -e "\n"

echo -e "${BLUE}=== Tests terminés ===${NC}"

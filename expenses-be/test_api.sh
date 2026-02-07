#!/bin/bash

BASE_URL="http://localhost:3000/api/expenses"

echo "--- 1. Testing Add Expense (POST) ---"
echo "Sending: 'Spent 850 on lunch at Taj Hotel'"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"input": "Spent 850 on lunch at Taj Hotel"}' \
  $BASE_URL
echo -e "\n"

echo "Sending: 'uber to airport 450'"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"input": "uber to airport 450"}' \
  $BASE_URL
echo -e "\n"

echo "--- 2. Testing Get Expenses (GET) ---"
curl -s $BASE_URL
echo -e "\n"

echo "--- 3. Testing Delete Expense (DELETE ID: 1) ---"
curl -s -X DELETE "$BASE_URL/1"
echo -e "\n"

echo "--- 4. Verify Deletion (GET) ---"
curl -s $BASE_URL
echo -e "\n"

# Week 9 (Simple MBanking API)

## Usage
- Show all users
- Show User information with current balance and total expense
- Add income/Outcome transaction
- Update income/Outcome transaction
- Delete income/Outcome transaction

## API Endpoints
### Get All Users Information
- `week9.fly.dev/users`
- GET
- Response 
```
{
    "success": true,
    "data": [
        {
        "id": id,
        "name": "value",
        "address": "value",
    },
    {
        "id": id,
        "name": "value",
        "address": "value",
    }, //dst
    ]
}
```

### Get User by ID
- `week9.fly.dev/users/:id`
- GET
- Response
```
{
    "success": true,
    "data": {
        "id": id,
        "name": "value",
        "address": "value",
        "balance": value,
        "expense": value
    }
}
```

### Post New Transaction
- `week9.fly.dev/transactions`
- POST
- Request
```
{
    "user_id": value
    "type": "income"/"outcome",
    "amount": value,
}
```
- Response
```
{
    "success": true/false,
    "data": {
        "id": id
    }
    "error": {//if "success": false}
}
```

### Put / Update Transactions
- `week9.fly.dev/transactions/:id`
- PUT
- Request
```
{
    "type": "income"/"outcome",
    "amount": value,
    "user_id": value
}
```
- Response
```
{
    "success": true/false,
    "data": {
        "id": id
    }
    "error": {//if "success": false}
}
```

### Delete Transactions
- `week9.fly.dev/transactions/:id`
- DELETE
- Request
```
{
    "success": true/false,
    "data": {
        "id": id
    }
    "error": {//if "success": false}
}
```

## Transaction Object

A transaction object has the following properties:

- `id`: Unique identifier for the transaction.
- `user_id`: Unique identifier for each user.
- `address`: User's address.
- `type`: Types of transaction, Income or Outcome.
- `amount`: The transaction amount.

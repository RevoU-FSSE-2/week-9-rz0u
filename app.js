/*

Requirements:
- Show user's info with current balance and total outcome
- Add Transactions
- Update Transactions
- Delete Transactions

Contracts:
- GET /users = Show all users info
---response---
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

- GET /users/:id = Show specified user info
---response---
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

- POST /transactions = Add transaction
---request---
{
    "user_id": value
    "type": "income"/"outcome",
    "amount": value,
}
---response---
{
    "success": true/false,
    "data": {
        "id": id
    }
    "error": {//if "success": false}
}

- PUT /transactions/:id = Update transaction detail
---request---
{
    "type": "income"/"outcome",
    "amount": value,
    "user_id": value
}
---response---
{
    "success": true/false,
    "data": {
        "id": id
    }
    "error": {//if "success": false}
}

- DELETE /transactions/:id = Delete transaction
---response---
{
    "success": true/false,
    "data": {
        "id": id
    }
    "error": {//if "success": false}
}

*/

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { request } = require("http");

const app = express();

app.use(bodyParser.json());

// database set-up
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "revou_9",
});

db.connect((err) => {
  if (err) throw err;

  console.log("database connection success");
});

const commonResponse = function (data, error) {
  if (error) {
    return {
      success: false,
      error: error,
    };
  }
  return {
    success: true,
    data: data,
  };
};

//get all
app.get("/users", (request, response) => {
  db.query("select * from users", (err, result, fields) => {
    if (err) {
      response.status(500).json(commonResponse(null, "server error"));
      response.end();
      return;
    }
    response.status(200).json(commonResponse(result, null));
    response.end();
  });
});

//get by id
app.get("/users/:id", (request, response) => {
  const userId = request.params.id;
  db.query(
    `select 
        u.ID,
        u.name,
        u.address,
        sum(case when t.type = 'income' then t.amount else -amount end) as balance,
        sum(case when t.type = 'outcome' then t.amount else 0 end) as expense
    from
        revou_9.users as u
        inner join revou_9.transactions as t 
    on
        u.ID = t.User_ID 
    where
        u.ID = ?
    group by
        u.ID 
    `,
    userId,
    (err, result, fields) => {
      if (err) {
        response.status(500).json(commonResponse(null, "server error"));
        response.end();
        return;
      }
      response.status(200).json(commonResponse(result[0], null));
      response.end();
    }
  );
});

//post
app.post("/transactions", (request, response) => {
  const body = request.body;
  db.query(
    `
    insert into
        revou_9.transactions (user_id, type, amount)
    values (?, ?, ?) 
    `,
    [body.user_id, body.type, body.amount],
    (err, result, fields) => {
      if (err) {
        response.status(500).json(commonResponse(null, "server error"));
        response.end();
        return;
      }
      response.status(200).json(
        commonResponse(
          {
            id: result.insertId,
          },
          null
        )
      );
      response.end();
    }
  );
});

//put
app.put("/transactions/:id", (request, response) => {
  const id = request.params.id;
  const { type, amount, user_id } = request.body;
  const sql =
    "update revou_9.transactions set type = ?, amount = ?, user_id = ? where id = ?";
  db.query(sql, [type, amount, user_id, id], (err, result) => {
    console.log("err", err);
    console.log("result", result);
    if (err) {
      response.status(500).json(commonResponse(null, "server error"));
      response.end();
      return;
    }
    response.status(200).json({ id });
    response.end();
  });
});

//delete
app.delete("/transactions/:id", (request, response) => {
  const id = request.params.id;
  db.query(
    "delete from revou_9.transactions where id = ?",
    id,
    (err, result, fields) => {
      if (err) {
        response.status(500).json(commonResponse(null, "server error"));
        response.end();
        return;
      }
      if (result.affectedRows == 0) {
        response.status(404).json(commonResponse(null, "data not found"));
      }
      response.status(200).json(
        commonResponse(
          {
            id: result.insertId,
          },
          null
        )
      );
      response.end();
    }
  );
});

// server
app.listen(3000, () => {
  console.log("running at port 3000");
});

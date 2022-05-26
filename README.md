# HomeOffice Shop
## Back-End for [HomeOffice Shop](https://github.com/welbhen/homeshop-frontend)

### Description
This a REST API that stores products, users and orders information in a MongoDB.
### Technologies
- Node.js
- Express
- Mongoose
- passport-local
- bcryptjs
- REST
### Admin-Routes
#### GET
- '[GET]/admin/stock/': returns a JSON with all products in stock.
- '[GET]/admin/orders/new/': check new orders.
- '[GET]/admin/orders/history/': check orders history.
#### POST
- '[POST]/admin/orders/ship/': move a new order to orders history.
- '[POST]/admin/stock/delete/': deletes a product stock, send the product information inside the req.body.
- '[POST]/admin/stock/quantity/add/': add 1 unity of the product to the stock, send the product information inside the req.body.
- '[POST]/admin/stock/quantity/sub/': subtract 1 unity of the product to the stock, send the product information inside the req.body.
- '[POST]/admin/stock/add/': add a whole new product to the stock.
### Main-Routes
#### GET
- '[GET]/products/chairs/': returns a JSON with all Chair products.
- '[GET]/products/desks/': returns a JSON with all Desks products.
- '[GET]/products/lighting/': returns a JSON with all Lighting products.
- '[GET]/products/': returns a JSON with all products in stock.
- '[GET]/products/{id}/': returns a JSON with a single article.
#### POST
- '[POST]/purchase/': sends a new order.
- '[POST]/register/': register a new user.
### User-Routes
#### GET
- '[GET]/user/orders/{id}/': check new orders by this user's ID.
- '[GET]/user/orders/history/{id}/': check orders history by this user's ID.
- '[GET]/user/logout/': log-out the user.
#### POST
- '[POST]/user/login/': log-in a user.

### Installation
- Clone the repo
  ```git clone https://github.com/welbhen/homeshop-backend```
- Add your .env with your MongoDB url:
  ```MONGO_URL= ... ```
### Scripts
- Run
  ```npm start```

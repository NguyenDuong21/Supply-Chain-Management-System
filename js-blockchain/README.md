JavaScript Blockchain
===

A simple implementation of blockchain using express and web sockets that allows you to add transaction and view the chain details.

## Start-Up

1. Run `npm install`

2. Run `npm start`

3. gửi post request đến endpoints `/nodes` với 

Request Body:

```json
{
  "host": "localhost",
  "port": 5001
}
```
(để kết nối với node ở port 5001, có thể thêm node nhưng mặc định chỉ để 2 node để test)
## Endpoints

## Thêm node vào mạng (hiện tại thực hiện xong bước 3 ở trên sẽ có 2 node ở port 5000,5001 kết nối trong mạng)
### POST /nodes 

Request Body:

```json
{
  "host": "localhost",
  "port": 5001
}
```
## Thêm transaction. Hiện tại khi đủ 2 transaction mới thực hiện mine
### POST /transaction

Request Body:

```json
{
  "sender": "Foo",
  "receiver": "Bar",
  "amount": 4
}
```
## kiểm tra tất cả các block
### GET /chain

Response: 

```json
[
  {
    "index": 0,
    "proof": 0,
    "timestamp": 1539970017557,
    "previousBlockHash": 1,
    "transactions": []
  },
  {
    "index": 1,
    "proof": 6109837942.514816,
    "timestamp": 1539970045394,
    "previousBlockHash": "4794a4da7764850e31a2974ea1983ee048e5d8db9d882c16e9d4b55c1ed4fd3e",
    "transactions": [
      {
        "sender": "A",
        "receiver": "B",
        "amount": 1,
        "timestamp": 1539970035916
      },
      {
        "sender": "C",
        "receiver": "D",
        "amount": 2,
        "timestamp": 1539970045393
      }
    ]
  },
```

LICENSE
===
[MIT](LICENSE.md)
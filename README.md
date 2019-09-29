# Microservices Payment Service Provider Example (micropsp)

[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

## Language
- NodeJs

## Dev dependencies
- redis
- mongodb

## Usage
- Access the root folder from project
- `npm i` to install project packages
- `npm run dev` to run in development mode
- Use a REST Client to make the requests. I like to use Postman (https://www.getpostman.com/)
- If you like docker you can use `docker-compose up` to run the project from docker
- To create a transaction you can send a POST with you REST Client. For example:
- http://0.0.0.0:3000/api/transactions/create
- Body:
    ```json
    {
        "transaction":{
            "amount": 101,
            "description": "Smartband XYZ 3.0",
            "payment_method": "credit_card",
            "card_number": "4111 1111 1111 1111",
            "holder_name": "Giovanni Abate Neto",
            "valid_date": "09/2021",
            "cvv": "123",
            "client_id": "2"
        }
    }
    ```

## Endpoints
- (POST) http://0.0.0.0:3000/api/transactions/create
- (GET) http://0.0.0.0:3000/api/transactions/list
- (GET) http://0.0.0.0:3000/api/payables/balance?client_id=2

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose

## TODO

- Authentication
- Customer Entity
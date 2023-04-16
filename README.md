# Proyect_E-TEC
#Autores Fernando y Toni
## Install the project packages

npm install

## Create or reset the Database (model)

node model.js --create

## Check the Database with a simple query

node model.js

## Run de server

npm start

## Check the API in the browser

http://localhost:9000/graphql
http://localhost:9000/web

## Test some queries

query{users{name}}

## Practice by adding methods

## Query
query{blogs{title,creator{name}}}
query{users{name}}
query{apiVersion{name, version}}
query{products{name, category, marca, capacidad, quantity}}
query{searchProductsByMarca(marca: "asus"){name, category, marca, capacidad, quantity}}
query{searchProductsByName(name: "a"){name, category, marca, capacidad, quantity}}

## Mutation
mutation{addProduct(name: "Lenovo", category: "Ordenador", marca: "Apple", capacidad: 32, quantity: 3){name category marca capacidad quantity}}
mutation{addUser(name: "Antonio", passwd: "123"){name passwd}}

## Passwords
Usuario: etec
Password: al386122.

## APIKey
etec_key
iKPGFys5rUiOxFxpW3JOx7dwqgCLOfvKSEIQXkb9T3lhUb6BC3dcmM9RaemX0Gmc

app_id: application_etec-wiime


etec_db


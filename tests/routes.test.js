const request = require('supertest')
const app = require('../configs/app')();
const config = require('../configs/config/local');
const db = require('../configs/db');
const constant = require('./config');

app.create(config, db);

let userId;
let userToken;
let parsedJson;
let prospectId;
let companyId;
let randomUserToken = constant.randomUserToken;
let adminToken = constant.adminToken;

describe('Post Endpoints', () => {
    it('should create a user', async () => {
        const res = await request(app.server)
            .post('/api/v1/users/')
            .send({
                firstname: "ceci",
                lastname: "test",
                email: "tessdt@test.eu",
                password: "12345678",
                address: "38 cours de l'intendance",
                city: "Bordeaux",
                phone: "0647670997",
                postal: "33000",
                country: "France",
            });
        parsedJson = JSON.parse(res.text)
        userId = parsedJson.newUser._id;
        userToken = parsedJson.token;
        expect(res.statusCode).toEqual(201);
    })
    it('Should create a prospect to the user created', async () => {
        const res = await request(app.server)
            .post(`/api/v1/users/${userId}/prospect/`)
            .set({ authorization: "Bearer " + userToken })
            .send({
                "firstname": "Bbuilo",
                "lastname": "Carpaccio",
                "email": "hufilo@gmail.com",
                "password": "c0mpl1c4@t3dpa$$w0rd",
                "phone": "0647670997",
                "address": "42 rue condorcet",
                "city": "bordeaux",
                "postal": "33000",
                "country": "France",
                "age": "23",
                "houseValue": 13000,
                "commission": 2000,
                "area": 300,
                "status": "oui"
            });
        expect(res.statusCode).toEqual(201);
        parsedJson = JSON.parse(res.text)
        prospectId = parsedJson.prospects[0];
    })
    it('Should create a new company with the userId with master', async () => {
        const res = await request(app.server)
            .post(`/api/v1/company/`)
            .set({ authorization: "Bearer " + userToken })
            .send({
                "name": "Keras",
                "legalType": "SAS",
                "email": "conteact@keras-group.com",
                "phone": "077777777",
                "address": "38 cours de l'intendance",
                "city": "Bordeaux",
                "country": "france",
                "postcode": "33000",
                "siret": "38330000",
                "tva": "20%",
                "tCard": "image",
                "commercialChamber": "Bordeaux",
                "date": 1511,
                "mendatoryParticulars": "blablabla",
                "about": "super entreprise",
                "mediator": "mediatorId",
                "collaborators": "collaboratorsId",
                "avatar": "avatar image",
            });
        expect(res.statusCode).toEqual(200)
        parsedJson = JSON.parse(res.text)
        companyId = parsedJson._id;
    })
    it('Should NOT recreate a new company with the userId with master', async () => {
        const res = await request(app.server)
            .post(`/api/v1/company/`)
            .set({ authorization: "Bearer " + userToken })
            .send({
                "name": "Keras",
                "legalType": "SAS",
                "email": "contact@keras-group.com",
                "phone": "077777777",
                "address": "38 cours de l'intendance",
                "city": "Bordeaux",
                "country": "france",
                "postcode": "33000",
                "siret": "38330000",
                "tva": "20%",
                "tCard": "image",
                "commercialChamber": "Bordeaux",
                "date": 1511,
                "mendatoryParticulars": "blablabla",
                "about": "super entreprise",
                "mediator": "mediatorId",
                "collaborators": "collaboratorsId",
                "avatar": "avatar image",
            });
        expect(res.statusCode).toEqual(406)
    })
})

describe('Get Endpoints', () => {
    it('should display all the users', async () => {
        const res = await request(app.server)
            .get('/api/v1/users/')
            .set({ authorization: "Bearer " + adminToken })
            .send();
        expect(res.statusCode).toEqual(200);
        // expect(res.body).toHaveProperty('get')
    });
    it('should NOT display all the users because non authorized', async () => {
        const res = await request(app.server)
            .get('/api/v1/users/')
            .set({ authorization: "Bearer " + userToken })
            .send();
        expect(res.statusCode).toEqual(401);
        // expect(res.body).toHaveProperty('get')
    });
    it('should display the user created', async () => {
        const res = await request(app.server)
            .get('/api/v1/users/' + userId)
            .set({ authorization: "Bearer " + userToken })
            .send();
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).company._id).toEqual(companyId);
        // expect(res.body).toHaveProperty('get')
    })
    it('should NOT display the user created', async () => {
        const res = await request(app.server)
            .get('/api/v1/users/' + userId)
            .set({ authorization: "Bearer " + randomUserToken })
            .send();
        expect(res.statusCode).toEqual(401);
        // expect(res.body).toHaveProperty('get')
    })
    it('should display the users data', async () => {
        const res = await request(app.server)
            .get('/api/v1/users/profile')
            .set({ authorization: "Bearer " + userToken })
            .send();
        expect(res.statusCode).toEqual(200);
        // expect(res.body).toHaveProperty('get')
    })
    it('should display the user prospect created', async () => {
        const res = await request(app.server)
            .get(`/api/v1/users/${userId}/prospect/${prospectId}`)
            .set({ authorization: "Bearer " + userToken })
            .send();
        expect(res.statusCode).toEqual(200);
    })
    it('should not display the user prospect created because non authorize', async () => {
        const res = await request(app.server)
            .get(`/api/v1/users/${userId}/prospect/${prospectId}`)
            .set({ authorization: "Bearer " + adminToken })
            .send();
        expect(res.statusCode).toEqual(401);
    })
    it('Should display the company created by the user', async () => {
        const res = await request(app.server)
            .get(`/api/v1/company/${companyId}`)
            .set({authorization: "Bearer " + userToken})
            .send();
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).master).toEqual(userId);
    })
})

describe('Put Endpoints', () => {
    it('should update a user', async () => {
        const res = await request(app.server)
            .put(`/api/v1/users/${userId}`)
            .set({ authorization: "Bearer: " + userToken })
            .send({
                firstname: "ceci",
                lastname: "newtest",
                email: "newtest@test.eu",
                password: "987654321",
                address: "38 cours de l'intendance",
                city: "Bordeaux",
                phone: "0647670997",
                postal: "33000",
                country: "France",
                about: "about"
            });
        expect(res.statusCode).toEqual(200);
    })
    it('should NOT update a user', async () => {
        const res = await request(app.server)
            .put(`/api/v1/users/${userId}`)
            .set({ authorization: "Bearer: " + randomUserToken })
            .send({
                firstname: "ceci",
                lastname: "newtest",
                email: "newtest@test.eu",
                password: "987654321",
                address: "38 cours de l'intendance",
                city: "Bordeaux",
                phone: "0647670997",
                postal: "33000",
                country: "France",
            });
        expect(res.statusCode).toEqual(401);
    })
    it('Should update a prospect to the user created', async () => {
        const res = await request(app.server)
            .put(`/api/v1/users/${userId}/prospect/${prospectId}`)
            .set({ authorization: "Bearer " + userToken })
            .send({
                "firstname": "newBuilo",
                "lastname": "newCarpaccio",
                "email": "newbc@gmail.com",
                "password": "c0mpl1c4@t3dpa$$w0rd",
                "phone": "0647670997",
                "address": "43 rue condorcet",
                "city": "bordeaux",
                "postal": "33000",
                "country": "France",
                "age": "23",
                "houseValue": 13000,
                "commission": 2000,
                "area": 300,
                "status": "peut-être"
            });
        expect(res.statusCode).toEqual(200);

    })
    it('Should NOT update a prospect to the user created', async () => {
        const res = await request(app.server)
            .put(`/api/v1/users/${userId}/prospect/${prospectId}`)
            .set({ authorization: "Bearer " + randomUserToken })
            .send({
                "firstname": "randomnewBuilo",
                "lastname": "randomnewCarpaccio",
                "email": "newbc@gmail.com",
                "password": "c0mpl1c4@t3dpa$$w0rd",
                "phone": "0647670997",
                "address": "43 rue condorcet",
                "city": "bordeaux",
                "postal": "33000",
                "country": "France",
                "age": "23",
                "houseValue": 13000,
                "commission": 2000,
                "area": 300
            });
        expect(res.statusCode).toEqual(401);

    })
    it('Should update a new company with the userId with master', async () => {
        const res = await request(app.server)
            .put(`/api/v1/company/${companyId}`)
            .set({ authorization: "Bearer " + userToken })
            .send({
                "name": "NewKeras",
                "legalType": "SAS",
                "email": "newcontact@keras-group.com",
                "phone": "077777777",
                "address": "38 cours de l'intendance",
                "city": "Bordeaux",
                "postcode": "33000",
                "country": "France",
                "siret": "38330000",
                "tva": "20%",
                "tCard": "image",
                "commercialChamber": "Bordeaux",
                "date": 1511,
                "mendatoryParticulars": "blablabla",
                "about": "super entreprise",
                "mediator": "mediatorId",
                "collaborators": "collaboratorsId",
                "avatar": "avatar image",
            });
        expect(res.statusCode).toEqual(200)
    })
    it('Should NOT update a new company with the userId with master', async () => {
        const res = await request(app.server)
            .put(`/api/v1/company/${companyId}`)
            .set({ authorization: "Bearer " + randomUserToken })
            .send({
                "name": "RandomNewKeras",
                "legalType": "SAS",
                "email": "randomnewcontact@keras-group.com",
                "phone": "077777777",
                "address": "38 cours de l'intendance",
                "city": "Bordeaux",
                "country": "france",
                "postcode": "33000",
                "siret": "38330000",
                "tva": "20%",
                "tCard": "image",
                "commercialChamber": "Bordeaux",
                "date": 1511,
                "mendatoryParticulars": "blablabla",
                "about": "super entreprise",
                "mediator": "mediatorId",
                "collaborators": "collaboratorsId",
                "avatar": "avatar image",
            });
        expect(res.statusCode).toEqual(401)
    })
    it('Should update the document of the user', async () => {
        const res = await request(app.server)
            .put('/api/v1/users/document')
            .set({ authorization: "Bearer " + userToken})
            .send({
                "docs": {
                "viager": {
                    name: "paul-louis",
                    age:18,
                    email: 'paullouis@gmail.com',
                    about:'j\'aime faire du viager'
                }
            }
            });
        expect(res.statusCode).toEqual(200)
    })
})

describe('Delete Endpoints', () => {
    it('should delete the prospect created before', async () => {
        const res = await request(app.server)
            .delete(`/api/v1/users/${userId}/prospect/${prospectId}`)
            .set({ authorization: "Bearer " + userToken })
            .send()
        expect(res.statusCode).toEqual(200);
    })
    it('Should delete a company', async () => {
        const res = await request(app.server)
            .delete(`/api/v1/company/${companyId}`)
            .set({ authorization: "Bearer " + userToken })
            .send();
        expect(res.statusCode).toEqual(200);
    })
    it('should delete the user created before', async () => {
        const res = await request(app.server)
            .delete('/api/v1/users/' + userId)
            .set({ authorization: "Bearer " + userToken })
            .send();
        expect(res.statusCode).toEqual(200);
    })
})

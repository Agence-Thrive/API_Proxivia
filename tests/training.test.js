const request = require('supertest');
const app = require('../configs/app')();
const config = require('../configs/config/local');
const db = require('../configs/db');
const constant = require('./config');

app.create(config, db);

let updatedData = {
    title: "Viager | part. 2",
    trainer: null,
    subject: "Viager",
    description: "Get advanced with viager",
    url: "url/url/url2.mp4",
    difficulty: "Expert",
    image: "une image",
    length: 2,
    grade: 5,
    xpPoint: 190,
    details: {
        chapter: [
            {
                title: 'Part 1',
                timecode: '00:00',
                notion: 'Viager'
            },
            {
                title: 'Part 2',
                timecode: '07:00',
                notion: 'Encore Viager'
            },
        ]
    }
}
let parsedJson;
let trainingId;
let trainer;
let nbViews;
let randomUserToken = constant.randomUserToken;
let adminToken = constant.adminToken;

describe('Post Endpoints', () => {
    it('Should create a Trainer', async () => {
        const res = await request(app.server)
            .post('/api/v1/trainer')
            .set({ authorization: 'Bearer ' + adminToken})
            .send({
                firstname: "Builo",
                lastname: "Di Carpaccio",
                email: "dicarpaccio@gmail.com",
                phone: "0647670997",
                photo: "la photo",
                about: "Formateur pro sur le viager l'équipe",
            })
        trainer = JSON.parse(res.text);
        updatedData.trainer = trainer._id;
        expect(res.statusCode).toEqual(200);
    })
    it('Should create a Training', async () => {
        const res = await request(app.server)
            .post('/api/v1/training')
            .set({ authorization: "Bearer " + adminToken })
            .send({
                title: "Viager | part. 1",
                trainer: trainer._id,
                subject: "Viager",
                description: "Get started with viager",
                url : "url/url/url.mp4",
                difficulty: "Débutant",
                image: "une image",
                length: 2,
                grade: 4,
                xpPoint: 190,
                details: {
                    chapter: [
                        {
                            title: 'Part 1',
                            timecode: '00:00',
                            notion: 'Bouquet'
                        },
                        {
                            title: 'Part 2',
                            timecode: '04:00',
                            notion: 'Bouquet encore'
                        },
                    ]
                },
            });
        parsedJson = JSON.parse(res.text);
        trainingId = parsedJson._id;
        nbViews = parsedJson.views;
        expect(res.statusCode).toEqual(201);
    })
})

describe('Get EndPoints', () => {
    it('get a trainer', async () => {
        const res = await request(app.server)
            .get(`/api/v1/trainer/${trainer._id}`)
            .set({ authorization: 'Bearer '+ adminToken})
            .send()
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).totalTraining).toEqual(1);
    })
    it('get all trainers', async () => {
        const res = await request(app.server)
            .get(`/api/v1/trainer/list`)
            .set({ authorization: 'Bearer ' + adminToken })
            .send()
        expect(res.statusCode).toEqual(200);
    })
    it('Get a training', async () => {
        const res = await request(app.server)
            .get(`/api/v1/training/${trainingId}`)
            .set({ authorization: "Bearer " + adminToken })
            .send()
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).views).toEqual(nbViews + 1)
    })
    it('Should get most popular trainings', async () => {
        const res = await request(app.server)
            .get('/api/v1/training/popular')
            .set({ authorization: 'Bearer ' + adminToken})
            .send({
                offset: 0,
                size: 4
            })
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text)[0].views).toBeGreaterThan(JSON.parse(res.text)[1].views)
        expect(JSON.parse(res.text)[1].views).toBeGreaterThan(JSON.parse(res.text)[2].views)
        expect(JSON.parse(res.text)[2].views).toBeGreaterThan(JSON.parse(res.text)[3].views)
    })
    it('Should get newest trainings', async () => {
        const res = await request(app.server)
            .get('/api/v1/training/newer')
            .set({ authorization: 'Bearer ' + adminToken })
            .send({
                offset: 1,
                size: 4
            })
        expect(res.statusCode).toEqual(200);
    })
})

describe('update trainings field in user model', () => {
    it('Update a seen', async () => {
        const res = await request(app.server)
            .post(`/api/v1/training/${trainingId}/seen`)
            .set({ authorization: `Bearer ${adminToken}`})
            .send()
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text).trainings[0].seen).toBeTruthy();
    })
    it('Should update a enroll training field in user document', async () => {
        const res = await request(app.server)
            .post(`/api/v1/training/${trainingId}/enroll`)
            .set({ authorization: `Bearer ${adminToken}`})
            .send({"enroll": true})
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text).trainings[0].enrolled).toBeTruthy();
    })
    it('Should update a grade in training field in user document', async () => {
        const res = await request(app.server)
            .post(`/api/v1/training/${trainingId}/grade`)
            .set({ authorization: `Bearer ${adminToken}` })
            .send({ "grade": 5 })
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).trainings[0].grade).toEqual(5);
    })
    it('Should fav a training field in user document', async () => {
        const res = await request(app.server)
            .post(`/api/v1/training/${trainingId}/favorite`)
            .set({ authorization: `Bearer ${adminToken}` })
            .send({ "favorite": true })
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).trainings[0].favorite).toBeTruthy();
    })
    it('Should complete a training field in user document', async () => {
        const res = await request(app.server)
            .post(`/api/v1/training/${trainingId}/complete`)
            .set({ authorization: `Bearer ${adminToken}` })
            .send()
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).trainings[0].complete).toBeTruthy();
    })
})

describe('Update Endpoint', () => {
    it('Update a training', async () => {
        const res = await request(app.server)
            .put(`/api/v1/training/${trainingId}`)
            .set({ authorization: "Bearer " + adminToken})
            .send(updatedData)
        expect(res.statusCode).toEqual(200);
        expect(JSON.parse(res.text).title).toEqual(updatedData.title);
    })
})

describe('Delete Endpoints', () => {
    it('Should delete a training', async () => {
        const res = await request(app.server)
            .delete(`/api/v1/training/${trainingId}`)
            .set({ authorization: "Bearer " + adminToken})
            .send()
        expect(res.statusCode).toEqual(200);
    })
    it('Should  NOT delete a training', async () => {
        const res = await request(app.server)
            .delete(`/api/v1/training/${trainingId}`)
            .set({ authorization: "Bearer " + randomUserToken })
            .send()
        expect(res.statusCode).toEqual(401);
    })
})


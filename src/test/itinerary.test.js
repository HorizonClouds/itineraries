// src/test/example.test.js

import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
const chai = use(chaiHttp);
import app from '../server.js';
import ItineraryModel from '../db/models/itineraryModel.js';

//db is cleared before and after each test. See src/test/setup.test.js

const debug = process.env.DEBUG === 'true';

describe('Itinerary API', () => {
  const responseFormat = {
    status: 'success',
    message: 'Success!',
    data: [],
    appCode: 'OK',
    timestamp: '2023-10-01T12:00:00.000Z',
  };

  it('should have default response format', (done) => {
    chai.request
      .execute(app)
      .get('/api/v1/itineraries')
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res.body).to.have.property('status', responseFormat.status);
        expect(res.body).to.have.property('message', responseFormat.message);
        expect(res.body).to.have.property('appCode', responseFormat.appCode);
        expect(res.body).to.have.property('timestamp');
        done();
      });
  });

  it('should GET all itineraries', (done) => {
    chai.request
      .execute(app)
      .get('/api/v1/itineraries')
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').that.is.an('array');
        done();
      });
  });

  it('should return 404 for invalid GET endpoint', (done) => {
    chai.request
      .execute(app)
      .get('/api/v1/invalid-endpoint')
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should POST a new itinerary', (done) => {
    chai.request
      .execute(app)
      .post('/api/v1/itineraries')
      .send({
        name: 'Test Itinerary',
        description: 'Test Description',
        startDate: '2023-10-01',
        endDate: '2023-10-10',
        destinationId: 1,
      })
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('data').that.is.an('object');
        expect(res.body.data).to.have.property('name', 'Test Itinerary');
        expect(res.body.data).to.have.property('description', 'Test Description');
        done();
      });
  });

  it('should return validation error for invalid POST data', (done) => {
    chai.request
      .execute(app)
      .post('/api/v1/itineraries')
      .send({ name: 'Te', value: -10 })
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('details');
        done();
      });
  });

  it('should have no itineraries initially', (done) => {
    chai.request
      .execute(app)
      .get('/api/v1/itineraries')
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data').that.is.an('array').that.is.empty;
        done();
      });
  });

  it('should GET an itinerary by id', async () => {
    let itinerary = await ItineraryModel.create({
      name: 'Itinerary',
      description: 'Description',
      startDate: '2023-10-01',
      endDate: '2023-10-10',
      destinationId: 1,
    });
    let itineraryId = itinerary._id;

    const res = await chai.request.execute(app).get(`/api/v1/itineraries/${itineraryId}`);
    if (debug) console.log(res.body);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('data').that.is.an('object');
    expect(res.body.data).to.have.property('_id');
    //done is not needed (we are retuning the promise implicitly)
  });

  it('should return 404 for non-existing example', (done) => {
    let exampleId = 'invalid-id';

    chai.request
      .execute(app)
      .get(`/api/v1/itineraries/${exampleId}`)
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should POST a new itinerary and then GET it', (done) => {
    chai.request
      .execute(app)
      .post('/api/v1/itineraries')
      .send({
        name: 'Test Itinerary',
        description: 'Test Description',
        startDate: '2023-10-01',
        endDate: '2023-10-10',
        destinationId: 1,
      })
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('data').that.is.an('object');
        expect(res.body.data).to.have.property('name', 'Test Itinerary');
        expect(res.body.data).to.have.property('description', 'Test Description');

        chai.request
          .execute(app)
          .get('/api/v1/itineraries')
          .end((err, res) => {
            if (debug) console.log(res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('data').that.is.an('array').that.has.lengthOf(1);
            expect(res.body.data[0]).to.have.property('name', 'Test Itinerary');
            expect(res.body.data[0]).to.have.property('description', 'Test Description');
            done();
          });
      });
  });

  //TODO implement PUT tests
  // it('should PUT update an itinerary by id', async () => {
  //   let itinerary = await ItineraryModel.create({ name: 'Itinerary', description: 'Description', startDate: '2023-10-01', endDate: '2023-10-10', destinationId: 1 });
  //   let itineraryId = itinerary._id;

  //   const res = await chai.request.execute(app)
  //     .put(`/api/v1/itineraries/${itineraryId}`)
  //     .send({ name: 'Updated Itinerary', description: 'Updated Description' });
  //   if (debug) console.log(res.body);
  //   expect(res).to.have.status(200);
  //   expect(res.body).to.have.property('data').that.is.an('object');
  //   expect(res.body.data).to.have.property('name', 'Updated Itinerary');
  //   expect(res.body.data).to.have.property('description', 'Updated Description');
  //   //done is not needed (we are retuning the promise implicitly)
  // });

  it('should return validation error for invalid PUT data', (done) => {
    let exampleId = 'invalid-id';

    chai.request
      .execute(app)
      .put(`/api/v1/itineraries/${exampleId}`)
      .send({ name: 'Up', value: -20 })
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('details');
        done();
      });
  });

  it('should DELETE an itinerary by id', async () => {
    let itinerary = await ItineraryModel.create({
      name: 'Itinerary',
      description: 'Description',
      startDate: '2023-10-01',
      endDate: '2023-10-10',
      destinationId: 1,
    });
    let itineraryId = itinerary._id;

    const res = await chai.request.execute(app).delete(`/api/v1/itineraries/${itineraryId}`);
    if (debug) console.log(res.body);
    expect(res).to.have.status(204);
    //done is not needed (we are retuning the promise implicitly)
  });

  it('should return 404 for non-existing example on DELETE', (done) => {
    chai.request
      .execute(app)
      .delete('/api/v1/itineraries/invalid-id')
      .end((err, res) => {
        if (debug) console.log(res.body);
        expect(res).to.have.status(404);
        done();
      });
  });
});

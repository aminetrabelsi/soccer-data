import request from 'supertest';
import { app } from '../app';

describe('Root route', () => {
  describe('get Home page', () => {
    it('should return Welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual('{\"message\":\"Hello To Soccer API!\"}')
    });
  });
});

import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import jwt from 'koa-jwt';

import * as util from 'util';

import nano from 'nano';

const app = new Koa();
const router = new Router();


const db = nano('http://localhost:5984');
const farmdb = db.use('farm');

router.get('/', async ctx => {
  ctx.body = { test: "What" };
});

router.post('/', async ctx => {
    const data_point = {
        data: ctx.request.body,
        user: ctx.state.user
    }

    await farmdb.insert(data_point as any);
    ctx.status = 200;
});

app
  .use(logger())
  .use(BodyParser())
  .use(jwt({
      secret: "hello",
      getToken: ctx => ctx.request.query.token
  }))
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(5050);
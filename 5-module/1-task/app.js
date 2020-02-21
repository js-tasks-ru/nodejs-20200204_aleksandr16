const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let subscribers = {};

const onSubscribe = async (ctx, next) => {
  const id = ctx.request.query.r || Math.random();

  ctx.set('Content-Type', 'text/plain;charset=utf-8');
  ctx.set('Cache-Control', 'no-cache, must-revalidate');

  const promise = new Promise((resolve) => {
    subscribers[id] = resolve;

    ctx.res.on('close', () => {
      delete subscribers[id];
    });
  });

  ctx.body = await promise;
};

const onPublish = async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message || message === '') {
    ctx.status = 200;
    return;
  }

  for (const i in subscribers) {
    if (!subscribers.hasOwnProperty(i)) {
      continue;
    }
    subscribers[i](message);
  }

  subscribers = {};
  ctx.status = 200;
};


router.get('/subscribe', onSubscribe);

router.post('/publish', onPublish);

app.use(router.routes());


module.exports = app;

const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('@koa/router');
const bodyparser = require('koa-bodyparser');
const qs = require('querystring')
const views = require('koa-views');
const path = require('path');

const render = views(path.resolve(__dirname + '/views'), {
  map: {
    html: 'swig'
  }
})

const app = new Koa();
const router = new Router();
app.use(logger())
app.use(bodyparser())

let id = 0
let list = [] // blogs list

router
  .get('/', handleList)
  .get('/detail', handleDetail)
  .get('/add', handleAdd)
  .post('/add', postAdd)

app.use(render)
app.use(router.routes())
app.use(router.allowedMethods());

async function handleList(ctx) {
  await ctx.render('list', { list })
}

async function handleDetail(ctx) {
  const { id } = qs.parse(ctx.querystring)
  const item = list.find(item => item.id == id)
  console.log(list, item)
  if(item) {
    await ctx.render('detail', item)
  } else {
    ctx.throw(404, 'invalid blog id');
  }
}

async function handleAdd(ctx) {
  await ctx.render('add')
}

async function postAdd(ctx) {
  const { title, content } = ctx.request.body
  list.push(
    {
      id: ++id,
      title,
      content
    }
  )
  ctx.redirect('/');
}

app.listen(3000);

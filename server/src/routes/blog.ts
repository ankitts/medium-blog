import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from '@ankitts/medium-common';

export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string,
      JWT_SECRET: string
    },
    Variables : {
		userId: string,
        prisma: any
	}
}>();

blogRouter.use(async (c, next) => {
    const jwt = c.req.header('Authorization');
    if(!jwt){
        c.status(401);
        return c.json({error: "unauthorized"});
    }

    const token = jwt.split(' ')[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    if(!payload){
        c.status(401);
        return c.json({error: "unauthorized"});
    }
    c.set('userId',  payload.id);  
    console.log("control at end of middleware")
    await next()
    console.log("next over")
})

blogRouter.post('/', async (c)=>{
    const userId = c.get('userId');  
    const prisma = c.get('prisma');
    const body = await c.req.json();

    const { success } = createPostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}


    const post = await prisma.post.create({
        data: {
			title: body.title,
			content: body.content,
			authorId: userId,
		}
    })
    return c.json({
        id: post.id
    })
})


blogRouter.get('/bulk', async(c) => {
    const prisma = c.get('prisma');
    const posts = await prisma.post.findMany({});
    return c.json(posts);
});

blogRouter.get('/:id', async(c)=>{
    const userId = c.get('userId');
    const prisma = c.get('prisma');
    const postId = c.req.param('id');

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    return c.json(post)
})

blogRouter.put('/', async(c) => {
    const userId = c.get('userId');
    const prisma = c.get('prisma');

    const body = await c.req.json();

    const { success } = updatePostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

    const post = await prisma.post.update({
        data:{
            title: body.title,
            content: body.content
        },
        where: {
            id: body.id
        }
    })
    return c.json({
        id: post.id
    })
})



  
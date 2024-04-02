import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function writeUser() {
	await prisma.user.create({
		data: {
			name: 'Rich',
			email: 'hello@prisma.com',
			posts: {
				create: {
					title: 'My first post',
					body: 'Lots of really interesting stuff',
					slug: 'my-first-post',
				},
			},
		},
	});
}

async function createComments() {
	await prisma.post.update({
		where: {
			slug: 'my-first-post',
		},
		data: {
			comments: {
				createMany: {
					data: [
						{ comment: 'Great post!' },
						{ comment: "Can't wait to read more!" },
					],
				},
			},
		},
	});
	const posts = await prisma.post.findMany({
		include: {
			comments: true,
		},
	});

	console.dir(posts, { depth: Infinity });
}

async function main() {
	// await writeUser();
	// await createComments();
	const allUsers = await prisma.user.findMany({
		include: {
			posts: true,
		},
	});

	console.dir(allUsers, { depth: null });
}

main()
	.catch(async (err) => {
		console.error(err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

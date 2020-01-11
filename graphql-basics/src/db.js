// Demo User Data
const demo_users = [{
    id: "1",
    name: "landon",
    email: "landon@example.com",
    age: 29
},
{
    id: "2",
    name: "sarah",
    email: "sarah@example.com"
},
{
    id: "3",
    name: "mike",
    email: "mike@example.com",
    age: 100
}];

const demo_posts = [
    {
        id: "1",
        title: "title1",
        body: "body1",
        published: false,
        author: "1"
    },
    {
        id: "2",
        title: "title3",
        body: "body3",
        published: false,
        author: "1"
    },
    {
        id: "3",
        title: "title3",
        body: "body3",
        published: false,
        author: "2"
    },
];

const demo_comments = [
    {
        id: "1",
        text: "comment 1",
        published: true,
        author: "1",
        post: "3"
    },
    {
        id: "2",
        text: "comment 2",
        published: false,
        author: "3",
        post: "1"
    },
    {
        id: "3",
        text: "comment 3",
        published: false,
        author: "3",
        post: "1"
    },
    {
        id: "4",
        text: "comment 4",
        published: true,
        author: "3",
        post: "3"
    },
]

const db = {
    demo_users,
    demo_posts,
    demo_comments
};

export default db;
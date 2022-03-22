let db = {
    users: [
        {
            userId: 'hdgyf82g387fhsdifh734',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2022-03-12T10:59:52.798Z',
            imageUrl: 'image/aksjdhieufhiuhsdkf/asdasdasf',
            bio: 'Hello, I am a user',
            website: 'http://user.com',
            location: 'London, UK'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2022-03-13T23:00:57.700Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: 'gdfug487rgeiudfkjdhf',
            body: 'Good work fella!',
            createdAt: '2022-03-13T23:00:57.700Z'
        }
    ]
};

// Redux Data
const userDetails = {
    credentials: {
        userId: 'N23UDU483JSIE98',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2022-03-12T10:59:52.798Z',
        imageUrl: 'image/aksjdhieufhiuhsdkf/asdasdasf',
        bio: 'Hello, I am a user',
        website: 'http://user.com',
        location: 'London, UK'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: 'fskdjfg9f88798rfj'
        },
        {
            userHandle: 'user',
            screamId: 'daskjfsd435345gkh'
        }
    ]
};

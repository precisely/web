/*
* Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

var dynamodb = require('serverless-dynamodb-client');
const docClient = dynamodb.doc; // return an instance of new AWS.DynamoDB.DocumentClient()

const promisify = (foo: any): Promise<{}> =>
    new Promise((resolve, reject) => {
        foo((error: Error, result: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });

export const twitterEndpoint: { getRawTweets(args: any): Promise<any>; } = {
    getRawTweets(args: any) {
        return promisify((callback: any) =>
            docClient.query(
                {
                    TableName: 'users',
                    KeyConditionExpression: 'screen_name = :v1',
                    ExpressionAttributeValues: {
                        ':v1': args.handle,
                    },
                },
                callback
            )
        ).then((result: any) => {
            const tweets = [];
            let listOfTweets: any;

            if (result.Items.length >= 1) {
                listOfTweets = {
                    name: result.Items[0].name,
                    screen_name: result.Items[0].screen_name,
                    location: result.Items[0].location,
                    description: result.Items[0].description,
                    followers_count: result.Items[0].followers_count,
                    friends_count: result.Items[0].friends_count,
                    favourites_count: result.Items[0].favourites_count,
                    posts: [],
                };
            }

            for (let i = 0; i < result.Items[0].posts.length; i += 1) {
                tweets.push({ tweet: result.Items[0].posts[i].tweet });
            }

            listOfTweets.posts = tweets;

            return listOfTweets;
        });
    },
};

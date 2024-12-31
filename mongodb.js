// const { MongoClient } = require('mongodb');

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// async function connectToMongoDB() {
//     console.log('Attempting to connect to MongoDB...');

//     try {
//         const client = await MongoClient.connect(connectionURL);
//         console.log('Connected correctly!');

//         const db = client.db(databaseName);

//         // Perform database operations here

//         db.collection('users').insertOne({
//             name : 'Sai2',
//             age : 25
//         },(error, result)=>{
//             if(error){
//                 return console.log('unable to insert user');
//             }

//             console.log(result.ops)
//         })



//         // await client.close(); // Close the connection when done
//         // console.log('Connection closed.');
//     } catch (error) {
//         console.error('Unable to connect to database!', error);
//     }

//     // console.log('Script execution completed.');
// }

// connectToMongoDB();

const { MongoClient, ServerApiVersion, deserialize } = require("mongodb");
const uri = 'mongodb://127.0.0.1:27017';

const databaseName = 'task-manager';
const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const db = client.db(databaseName);

        const taskColl = await db.collection('users').findOne({name: 'gani'});

        console.log(taskColl)



        // try{
        //     const result = taskColl.findOne();
        //     console.log(result)
            
        // }
        // catch(e){

        // }

        // try{
        // const usersColl = client.db(databaseName).collection('users');

        //     const myDoc = {
        //         name : 'gani',
        //         age : 25
        //     }
        //     let result = await usersColl.insertOne(myDoc);
        //     console.log('The id got inserted '+result.insertedId)
        // }
        // catch(e){
        //     console.log('unable to insert data due to '+e);
        // }

        // try{
        //     const myDoc = [{
        //             description : 'make lunch',
        //             completed : true
        //         },
        //         {
        //             description : 'make dinner',
        //             completed : true
        //         },
        //         {
        //             description : 'make breakfast',
        //             completed : false
        //         }
        //     ]

        //     const taskColl = client.db(databaseName).collection('tasks');
            
        //     let result = await taskColl.insertMany(myDoc);

        //     console.log(result)

        //     let ids = result.insertedIds;

        //     console.log('inserted documet'+ ids.length)

        //     for(let id of Object.values(ids)){
        //         console.log('added task with id '+id)
        //     }
        
        // }
        // catch(e){
        //     console.log('unable to add documents '+e);
        // }

    }
    catch(e){
        console.log('Unable to connect to db due to '+e)
    }
     finally {
        await client.close();
    }
}
run().catch(console.dir);

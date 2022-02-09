const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();

// exports.addUserRole = functions.auth.user().onCreate(async (authUser) => {
//     if (authUser.email){
//         const customClaims = {
//             admin: true,
//         };
//         console.log(authUser);
//         try{
//             var _ = await admin.auth().setCustomUserClaims(authUser.uid, customClaims);

//             return db.collection("usuarios").doc(authUser.uid).set({
//                 email: authUser.email,
//                 role: customClaims,
//                 creado: Date.now(),
//             })
//         } catch(err){
//             console.log(error);
//         }
//     }
// })

exports.createUser = functions.https.onCall(async (data) => {
    try {
     const user = await admin.auth().createUser({
            email: data.email,
            emailVerified: true,
            password: data.password,
            displayName: data.displayName,
            disabled: false,
          }).then(async (userRecord) => {
            var _ = await admin.auth().setCustomUserClaims(userRecord.uid, data.rol);
            db.collection('usuarios').doc(userRecord.uid).set({
                email: userRecord.email,
                displayName: userRecord.displayName,
                creado: userRecord.metadata.creationTime,
                disabled: userRecord.disabled,
                role: data.rol.name,
                distritos: data.distritos,
                tecnicos: data.tecnicos,
            })
            return userRecord;
          }).catch((e)=>{
            throw new functions.https.HttpsError('Ha ocurrido un problema al crear el usuario, por favor reintente.');
          });

        return user;
    } catch (error) {
        throw new functions.https.HttpsError('Ha ocurrido un problema, por favor contacte con soporte.');
    }
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

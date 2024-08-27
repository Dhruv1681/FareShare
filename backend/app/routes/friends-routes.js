import express from 'express'; // import express

import * as friendsController from '../controllers/friends-controller.js'; // import friendsController

const router = express.Router(); // create router

router.route('/')
    .post(friendsController.post) // create new friend
    .get(friendsController.get); // get all friends

export default router; // export router
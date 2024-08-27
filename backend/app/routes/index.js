import authRouter from './auth-route.js';
import accountRouter from './account-route.js';
import groupRouter from "./group-route.js";
import userRouter from './user-route.js';
import expenseRouter from './expense-routes.js';
import friendsRouter from './friends-routes.js';
import filesRouter from './files-route.js';
import analyticsRouter from './analytics-route.js';
import splitRouter from './split-route.js';
import activityRouter from './activity-route.js';
import adminRouter from './admin-route.js';

export default (app) => {
    app.use('/auth', authRouter);
    app.use('/account', accountRouter);
	app.use('/groups', groupRouter);
    app.use('/users', userRouter);
    app.use('/expenses', expenseRouter);
    app.use('/friends', friendsRouter);
    app.use('/files', filesRouter);
    app.use('/analytics', analyticsRouter);
    app.use('/split', splitRouter);
    app.use('/activity', activityRouter);
    app.use('/admin', adminRouter);
}

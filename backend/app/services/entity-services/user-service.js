import { AbstractEntityService } from './abstract-entity-service.js';
import User from '../../models/user-model.js';

class UserService extends AbstractEntityService {
	constructor() {
		super(User);
	}

    async getFullName(user) {
        return `${user.firstname} ${user.lastname}`;
    }

	async findOneByEmailAndNotDeleted(email) {
		const user = await this.findOneByQueryAndNotDeleted({ email });
		return user;
	}
	
    async findOneByUsernameAndNotDeleted(username) {
        const entity = await this.findOneByQueryAndNotDeleted({ username });
        return entity;
    }

    async search(params = {}) {
        const user = await User.find(params).exec();
        return user;
    }

    async save(newUser) {
        // Create a new User
        const user = new User(newUser);
        // Save the new user to the database
        return await user.save();
    }

    async remove(id) {
        const user = await User.findByIdAndDelete(id).exec();
        return user;
    }
}

const service = new UserService();
export default service;

import { REGEX } from '../constants';

const isValidEmail = (email: string) => {
	if (!email) return false;
	if (email.length > 254) return false;
	return REGEX.EMAIL.test(email);
};

export { isValidEmail };

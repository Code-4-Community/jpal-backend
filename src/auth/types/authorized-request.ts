import Request from 'express';
import { User } from '../../users/types/user.entity';

export type AuthorizedRequest = Request & {
  user?: User;
};

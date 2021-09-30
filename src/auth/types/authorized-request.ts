import Request from 'express';
import { User } from '../../user/types/user.entity';

export type PossiblyAuthorizedRequest = Request & {
  user?: User;
};

export type DefinitelyAuthorizedRequest = Request & {
  user: User;
};

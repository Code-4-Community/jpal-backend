export enum Role {
  RESEARCHER = 'researcher',
  ADMIN = 'admin',
  PLATFORM_ADMIN = 'platform_admin',
}

export const ROLE_HIERARCHY = {
  [Role.PLATFORM_ADMIN]: [Role.RESEARCHER, Role.ADMIN],
  [Role.ADMIN]: [Role.ADMIN],
  [Role.RESEARCHER]: [Role.RESEARCHER],
};

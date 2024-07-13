export const JWT_CONSTANTS = {
  secret: process.env['JWT_SECRET'],
};

export const REDIS_CLIENT_OPTIONS = {
  host: process.env['REDISHOST'],
  port: parseInt(process.env['REDISPORT']!),
  user: process.env['REDISUSER'],
  password: process.env['REDISPASSWORD'],
};

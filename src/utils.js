import { logger as RNLogger } from 'react-native-logs';

export const logger = RNLogger.createLogger({
  severity: 'debug',
  enabled: process.env.NODE_ENV === 'development',
});

const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

// Fibonacci function
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// Listen for messages on the 'insert' channel
sub.on('message', (channel, message) => {
  console.log(`Received message: ${message}`);
  const result = fib(parseInt(message));
  console.log(`Calculated Fibonacci for index ${message}: ${result}`);
  redisClient.hset('values', message, result);
});

// Subscribe to the 'insert' channel
sub.subscribe('insert');

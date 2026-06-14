module.exports = {
  apps: [
    {
      name: 'users-service',
      script: '/home/ubuntu/bazaario-ecommerce/services/users-service/src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_NAME: 'users_db',
        DB_USER: 'postgres',
        DB_PASSWORD: 'postgres123',
        JWT_SECRET: 'mySuperSecretKey123',
        JWT_EXPIRES_IN: '1d',
        JWT_REFRESH_SECRET: 'myRefreshSecretKey456',
        JWT_REFRESH_EXPIRES_IN: '7d'
      }
    },
    {
      name: 'products-service',
      script: '/home/ubuntu/bazaario-ecommerce/services/products-service/src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4002,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_NAME: 'products_db',
        DB_USER: 'postgres',
        DB_PASSWORD: 'postgres123',
        JWT_SECRET: 'mySuperSecretKey123'
      }
    },
    {
      name: 'cart-service',
      script: '/home/ubuntu/bazaario-ecommerce/services/cart-service/src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4003,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_NAME: 'cart_db',
        DB_USER: 'postgres',
        DB_PASSWORD: 'postgres123',
        JWT_SECRET: 'mySuperSecretKey123'
      }
    },
    {
      name: 'orders-service',
      script: '/home/ubuntu/bazaario-ecommerce/services/orders-service/src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4004,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_NAME: 'orders_db',
        DB_USER: 'postgres',
        DB_PASSWORD: 'postgres123',
        JWT_SECRET: 'mySuperSecretKey123'
      }
    }
  ]
}

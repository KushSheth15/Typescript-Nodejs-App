import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.sequelize.query(`
    CREATE VIEW user_products AS
    SELECT
      users.id AS user_id,
      users.name AS user_name,
      products.id AS product_id,
      products.name AS product_name,
      products.price AS product_price,
      categories.name AS category_name
    FROM
      users
    JOIN
      products
    ON
      users.id = products.userId
    JOIN
      categories
    ON
      products.categoryId = categories.id;
  `);

  await queryInterface.sequelize.query(`
    CREATE MATERIALIZED VIEW user_product_summary AS
    SELECT
      users.id AS user_id,
      users.name AS user_name,
      categories.name AS category_name,
      COUNT(products.id) AS product_count,
      SUM(products.price) AS total_price
    FROM
      users
    LEFT JOIN
      products
    ON
      users.id = products.userId
    LEFT JOIN
      categories
    ON
      products.categoryId = categories.id
    GROUP BY
      users.id, categories.name;
  `);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.sequelize.query(`DROP MATERIALIZED VIEW IF EXISTS user_product_summary;`);
  await queryInterface.sequelize.query(`DROP VIEW IF EXISTS user_products;`);
}

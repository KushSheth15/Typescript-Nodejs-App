import db from '../sequelize-client';

export async function refreshMaterializedView() {
    try {
        await db.sequelize.query('REFRESH MATERIALIZED VIEW user_product_category_summary;');
        console.log('Materialized view refreshed successfully.');
    } catch (error) {
        console.error('Error refreshing materialized view:', error);
        throw error;
    }
}

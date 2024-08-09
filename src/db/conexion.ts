import { Sequelize } from "sequelize";


// Option 3: Passing parameters separately (other dialects)
// Crear una instancia de Sequelize
const sequelize = new Sequelize('superMarket', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  });


 export default sequelize;
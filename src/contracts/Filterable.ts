import { CreationAttributes, Model } from "sequelize";

export default interface Filterable<T extends Model> {
  /**
   * @returns Instances wich doesn't exists in the Table <T>
   * @param instance 
   * e.g.
   * If you filter a body wich already exists using filter(body), the returned value will be null.
   * If it doens't exists, it will return the body.
   *  
   */
  filter(instances: CreationAttributes<T>[]): Promise<CreationAttributes<T>[]>;

  findByUnique(unique: unknown): Promise<T | null>;

  getIdByUnique(unique: unknown): Promise<number | undefined>;
}
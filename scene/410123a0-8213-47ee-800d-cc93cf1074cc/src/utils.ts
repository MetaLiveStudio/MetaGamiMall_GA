import { Logger, LoggerLevel } from "./logging";
const logger = new Logger("utils.", {});

export const getEntityByName = (
  name: string,
  altEntity?: Record<string, IEntity>
): IEntity => {
  const METHOD_NAME = "getEntityByName";
  if (logger.isTraceEnabled())
    logger.trace(METHOD_NAME, "ENTRY", [name, altEntity]);

  let val = Object.keys(engine.entities)
    .map((key) => engine.entities[key])
    .filter((entity) => (entity as Entity).name === name)[0];

  if (!val && altEntity) {
    val = altEntity[name];
  }
  if (logger.isTraceEnabled()) logger.trace(METHOD_NAME, "RETURN", val);
  return val;
};

export const getEntityByRegex = (
  name: RegExp,
  altEntity?: Record<string, IEntity>
): IEntity[] => {
  const METHOD_NAME = "getEntityByRegex";
  if (logger.isTraceEnabled())
    logger.trace(METHOD_NAME, "ENTRY", [name, altEntity]);

  name.lastIndex = 0; //reset regex if already used

  let val: IEntity[] = Object.keys(engine.entities)
    .map((key) => engine.entities[key])
    .filter((entity) => name.test((entity as Entity).name!));

  if (!val) val = [];

  if (altEntity && Object.keys(altEntity).length > 0) {
    let valAlt: IEntity[] = Object.keys(altEntity)
      .map((key) => altEntity[key])
      .filter((entity) => name.test((entity as Entity).name!));

    if (valAlt && valAlt.length > 0) {
      let dict: { [key: string]: IEntity } = {};

      for (const p in val) {
        if (!val[p] || val[p] === undefined) continue;

        let entityName = (val[p] as Entity).name!;
        if (entityName != undefined) {
          if (!dict[entityName]) {
            dict[entityName] = val[p];
          } else {
            log("duplicate item found skipping " + p);
            if (logger.isDebugEnabled())
              logger.debug(
                METHOD_NAME,
                "duplicate item found skipping " + entityName,
                [name, altEntity]
              );
          }
        }
      }
      for (const p in valAlt) {
        if (!valAlt[p] || valAlt[p] === undefined) continue;

        let entityName = (valAlt[p] as Entity).name;
        if (entityName != undefined) {
          if (!dict[entityName]) {
            dict[entityName] = valAlt[p];
          } else {
            if (logger.isDebugEnabled())
              logger.debug(
                METHOD_NAME,
                "duplicate item found in valAlt skipping " + entityName,
                [name, altEntity]
              );
          }
        }
      }

      //now to list it
      let valConcat: IEntity[] = new Array();
      for (const p in dict) {
        valConcat.push(dict[p]);
      }
      val = valConcat;
    }
  }

  if (logger.isTraceEnabled()) logger.trace(METHOD_NAME, "RETURN", val);
  return val;
};

export const getEntityBy = (
  name: any,
  altEntity?: Record<string, IEntity>
): IEntity[] => {
  const METHOD_NAME = "getEntityBy";
  if (logger.isTraceEnabled())
    logger.trace(METHOD_NAME, "ENTRY", [name, altEntity]);

  let val: IEntity[] | null = null;

  if (typeof name == "string") {
    val = [getEntityByName(name, altEntity)];
  } else if (name instanceof RegExp) {
    val = getEntityByRegex(name, altEntity);
  } else {
    log("unknown fetch type " + name);
  }
  if (!val) {
    val = [];
  }
  if (logger.isTraceEnabled()) logger.trace(METHOD_NAME, "RETURN", val);
  return val;
};

export class CacheEntry<T> {
  value: T;
  createTimestamp: number;
  lastFetchTimestamp: number;

  constructor(args: {
    value: T;
    createTimestamp: number;
    lastFetchTimestamp: number;
  }) {
    this.value = args.value;
    this.createTimestamp = args.createTimestamp;
    this.lastFetchTimestamp = args.lastFetchTimestamp;
  }
}
export class CacheStats {
  hits: number = 0;
  misses: number = 0;
  size: number = 0;
}

export interface ILazyMap<K, T> {
  get(name: K): T;
  put(name: K, obj: T): void;
  delete(name: string): T;
}

export interface ITransformer<K, T> {
  transform(name: K): T;
}

export class Cache<K, T> implements ILazyMap<string, T> {
  records: Record<string, CacheEntry<T>> = {};
  stats: CacheStats = new CacheStats();
  transformer: ITransformer<string, T>;

  constructor(args: { transformer: ITransformer<string, T> }) {
    this.transformer = args.transformer;
  }

  getRecord(name: string): CacheEntry<T> {
    return this.records[name];
  }
  get(name: string): T {
    //log("get  " + name )
    const obj = this.records[name];
    //log("get found " + obj )
    let val: T;
    if (obj) {
      this.stats.hits++;
      obj.lastFetchTimestamp = +Date.now();
      val = obj.value;
    } else {
      this.stats.misses++;
      val = this.transformer.transform(name);
      this.put(name, val);
    }
    return val;
  }
  put(name: string, obj: T) {
    const currentTime: number = +Date.now();
    this.records[name] = new CacheEntry({
      value: obj,
      createTimestamp: currentTime,
      lastFetchTimestamp: currentTime,
    });
    this.stats.size = Object.keys(this.records).length;
    return obj;
  }

  delete(name: string) {
    const obj = this.records[name];
    log("delete " + name + " found " + obj);
    let val: T;
    if (obj) {
      val = obj.value;
      delete this.records[name];
    }
    return val!;
  }
}

export class EntityNameTransformer implements ITransformer<string, IEntity> {
  transform(name: string): IEntity {
    const entity = getEntityByName(name);
    log("transform " + name + " found " + entity);

    return entity;
  }
}

export const ENTITY_CACHE_BY_NAME_MAP: Cache<string, IEntity> = new Cache<
  string,
  IEntity
>({ transformer: new EntityNameTransformer() });

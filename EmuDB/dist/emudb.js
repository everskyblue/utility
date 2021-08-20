(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EmuDB = {}));
}(this, (function (exports) { 'use strict';

  /**
   * @see {@link https://github.com/SupperSource/idgp}
   * @param {number} length
   * @returns {string}
   */
  function idGen(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const db = new Map();

  const avalaidcolumns = {
    increment: 'boolean',
    type: ['object', 'function'],
    unique: 'boolean',
    required: 'boolean',
    defaultValue: undefined
  };

  class Collections extends Array {
    constructor() { super(); }

    /**
     * @param {object} data
     * @returns {object}
     */
    push(data) {
      if (!('__id' in data)) {
        data.__id = idGen(24);
      }
      super.push(data);
      return data;
    }
  }

  class Store {
    /**
     * @param {array} schemas
     */
    constructor(schemas) {
      this.schemas = schemas;
      this.collection = new Collections();
    }
  }

  class DBReference {
    /**
     * @param {Store} $store
     */
    constructor($store) {
      let resolve;
      
      /**
       * @param {string} selectTable
       * @throws
       */
      this.ref = (selectTable) => {
        this.table = $store.schemas.find((table) => table.name === selectTable);
        if (!this.table) throw new Error("tabla no encontrada");
        return this;
      };

      /**
       * @returns {Promise<array[]>}
       */
      this.get = async () => {
        if (!!resolve) {
          const index = await resolve;
          resolve = null;
          return $store.collection[index];
        }
        return $store.collection;
      };
      
      /**
       * @param {object} data
       * @return {Promise<object[]>}
       * @throws
       */
      this.update = async data => {
        if (resolve) {
          const index = await resolve;
          const register = $store.collection[index].map(elm => {
            if (elm.columnName in data) {
              elm.value = data[elm.columnName];
            }
            return elm;
          });
          
          $store.collection[index] = register;

          resolve = null;

          return register;
        }

        throw new Error('llamar el metodo doc para actualizar datos');
      };
      
      /**
       * @return {Promise<array[]>}
       * @throws
       */
      this.delete = async () => {
        const index = await resolve;
        if (typeof index === 'object') throw index;
        const elmDelete = $store.collection.splice(index, 1);
        resolve = null;
        return elmDelete;
      };

      /**
       * @param {string} _id
       * @return {this}
       */
      this.doc = _id => {
        resolve = new Promise($resolve => {
          const docIndex = $store.collection.findIndex(data => data.__id === _id);
          if (docIndex < 0) $resolve(new ReferenceError(`id(${_id}) not find`));
          else $resolve(docIndex);
        });
        return this;
      };
      
      /**
       * @param {object} data 
       * @return {Promise<array[object]>}
       */
      this.add = data => {
        return new Promise(resolve => {
          const nval = this.table.columns.map((column) => {
            if (column.options.required && !(column.key in data)) {
              throw new ReferenceError(
                `la clave ${column.key} tiene un parametro requerido`
              );
            }

            const nw = {
              columnName: column.key,
              value: column.options.defaultValue
            };

            if (column.key in data) {
              if (!column.options.type.equalTypeData(data[column.key])) {
                throw "fallo! tipo de valor invalido";
              }

              if (column.options.unique && $store.collection.includes(nw.value)) {
                throw new Error("valor unico, fallido al insertar");
              }

              nw.value = data[column.key];
            }

            if (typeof nw.value === 'undefined') {
              throw new Error(`${nw.columnName} invalido valor a insert`);
            }

            return nw;
          });

          resolve($store.collection.push(nval));
        });
      };
    }
  }

  class Column {
    /**
     * @param {string} name
     * @param {object} types
     * @throws
     */
    constructor(name, types) {
      if (!("type" in types)) throw "falta definir tipo de dato";

      for (let key in types) {
        if (!avalaidcolumns.hasOwnProperty(key)) {
          throw ReferenceError(`eliminar la clave (${key}) es invalida`);
        }

        if (
          avalaidcolumns[key] &&
          ((!Array.isArray(avalaidcolumns[key]) &&
              avalaidcolumns[key] !== typeof types[key]) ||
            (Array.isArray(avalaidcolumns[key]) &&
              !avalaidcolumns[key].includes(typeof types[key])))
        ) {
          throw new Error(
            `tipo de valor invalido: ${JSON.stringify(
            avalaidcolumns
          )} opcional valor`
          );
        }
      }

      this.key = name;
      this.options = Object.freeze(types);
    }
  }

  class Table {
    /**
     * @param {string} nametb
     * @param {Column[]} columns
     */
    constructor(nametb, columns) {
      this.name = nametb;
      this.columns = Object.freeze(columns);
    }
  }

  /**
   * @param {string} dbname
   * @param {Table[]} schemas
   */
  function odbAggregate(dbname, schemas) {
    if (db.has(dbname)) {
      throw "db existente";
    }
    db.set(dbname, new Store(schemas));
  }

  /**
   * @param {string} dbname
   * @returns {DBReference}
   */
  function odb(dbname) {
    if (!db.has(dbname)) {
      throw "nombre clave no existe";
    }

    const dbref = new DBReference(db.get(dbname));

    return Object.setPrototypeOf(odb, dbref);
  }

  /**
   * @param {string} name
   * @param {object} type
   * @returns {Column}
   */
  const column = (name, type) => new Column(name, type);


  /**
   * @param {string} name
   * @param {Column[]} columns
   * @returns {Column}
   */
   const table = (name, columns) => new Table(name, columns);

  exports.Column = Column;
  exports.Table = Table;
  exports.column = column;
  exports.odb = odb;
  exports.odbAggregate = odbAggregate;
  exports.table = table;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

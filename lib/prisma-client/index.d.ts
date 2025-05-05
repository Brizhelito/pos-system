
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model category
 * 
 */
export type category = $Result.DefaultSelection<Prisma.$categoryPayload>
/**
 * Model customer
 * 
 */
export type customer = $Result.DefaultSelection<Prisma.$customerPayload>
/**
 * Model invoice
 * 
 */
export type invoice = $Result.DefaultSelection<Prisma.$invoicePayload>
/**
 * Model product
 * 
 */
export type product = $Result.DefaultSelection<Prisma.$productPayload>
/**
 * Model provider
 * 
 */
export type provider = $Result.DefaultSelection<Prisma.$providerPayload>
/**
 * Model sale
 * 
 */
export type sale = $Result.DefaultSelection<Prisma.$salePayload>
/**
 * Model saleitem
 * 
 */
export type saleitem = $Result.DefaultSelection<Prisma.$saleitemPayload>
/**
 * Model user
 * 
 */
export type user = $Result.DefaultSelection<Prisma.$userPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const user_role: {
  SELLER: 'SELLER',
  ADMIN: 'ADMIN'
};

export type user_role = (typeof user_role)[keyof typeof user_role]


export const sale_paymentMethod: {
  CASH: 'CASH',
  CARD: 'CARD',
  TRANSFER: 'TRANSFER',
  OTHER: 'OTHER'
};

export type sale_paymentMethod = (typeof sale_paymentMethod)[keyof typeof sale_paymentMethod]


export const invoice_invoiceStatus: {
  ISSUED: 'ISSUED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
};

export type invoice_invoiceStatus = (typeof invoice_invoiceStatus)[keyof typeof invoice_invoiceStatus]


export const sale_status: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export type sale_status = (typeof sale_status)[keyof typeof sale_status]

}

export type user_role = $Enums.user_role

export const user_role: typeof $Enums.user_role

export type sale_paymentMethod = $Enums.sale_paymentMethod

export const sale_paymentMethod: typeof $Enums.sale_paymentMethod

export type invoice_invoiceStatus = $Enums.invoice_invoiceStatus

export const invoice_invoiceStatus: typeof $Enums.invoice_invoiceStatus

export type sale_status = $Enums.sale_status

export const sale_status: typeof $Enums.sale_status

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Categories
 * const categories = await prisma.category.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Categories
   * const categories = await prisma.category.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.category`: Exposes CRUD operations for the **category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.categoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.customerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.invoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.productDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.provider`: Exposes CRUD operations for the **provider** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Providers
    * const providers = await prisma.provider.findMany()
    * ```
    */
  get provider(): Prisma.providerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sale`: Exposes CRUD operations for the **sale** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sales
    * const sales = await prisma.sale.findMany()
    * ```
    */
  get sale(): Prisma.saleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.saleitem`: Exposes CRUD operations for the **saleitem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Saleitems
    * const saleitems = await prisma.saleitem.findMany()
    * ```
    */
  get saleitem(): Prisma.saleitemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    category: 'category',
    customer: 'customer',
    invoice: 'invoice',
    product: 'product',
    provider: 'provider',
    sale: 'sale',
    saleitem: 'saleitem',
    user: 'user'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "category" | "customer" | "invoice" | "product" | "provider" | "sale" | "saleitem" | "user"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      category: {
        payload: Prisma.$categoryPayload<ExtArgs>
        fields: Prisma.categoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.categoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.categoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          findFirst: {
            args: Prisma.categoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.categoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          findMany: {
            args: Prisma.categoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>[]
          }
          create: {
            args: Prisma.categoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          createMany: {
            args: Prisma.categoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.categoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          update: {
            args: Prisma.categoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          deleteMany: {
            args: Prisma.categoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.categoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.categoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.categoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.categoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      customer: {
        payload: Prisma.$customerPayload<ExtArgs>
        fields: Prisma.customerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.customerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.customerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload>
          }
          findFirst: {
            args: Prisma.customerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.customerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload>
          }
          findMany: {
            args: Prisma.customerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload>[]
          }
          create: {
            args: Prisma.customerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload>
          }
          createMany: {
            args: Prisma.customerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.customerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload>
          }
          update: {
            args: Prisma.customerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload>
          }
          deleteMany: {
            args: Prisma.customerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.customerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.customerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.customerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.customerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      invoice: {
        payload: Prisma.$invoicePayload<ExtArgs>
        fields: Prisma.invoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.invoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.invoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload>
          }
          findFirst: {
            args: Prisma.invoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.invoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload>
          }
          findMany: {
            args: Prisma.invoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload>[]
          }
          create: {
            args: Prisma.invoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload>
          }
          createMany: {
            args: Prisma.invoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.invoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload>
          }
          update: {
            args: Prisma.invoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload>
          }
          deleteMany: {
            args: Prisma.invoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.invoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.invoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$invoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.invoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.invoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      product: {
        payload: Prisma.$productPayload<ExtArgs>
        fields: Prisma.productFieldRefs
        operations: {
          findUnique: {
            args: Prisma.productFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.productFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          findFirst: {
            args: Prisma.productFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.productFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          findMany: {
            args: Prisma.productFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>[]
          }
          create: {
            args: Prisma.productCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          createMany: {
            args: Prisma.productCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.productDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          update: {
            args: Prisma.productUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          deleteMany: {
            args: Prisma.productDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.productUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.productUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.productGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.productCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      provider: {
        payload: Prisma.$providerPayload<ExtArgs>
        fields: Prisma.providerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.providerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.providerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload>
          }
          findFirst: {
            args: Prisma.providerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.providerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload>
          }
          findMany: {
            args: Prisma.providerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload>[]
          }
          create: {
            args: Prisma.providerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload>
          }
          createMany: {
            args: Prisma.providerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.providerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload>
          }
          update: {
            args: Prisma.providerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload>
          }
          deleteMany: {
            args: Prisma.providerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.providerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.providerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$providerPayload>
          }
          aggregate: {
            args: Prisma.ProviderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProvider>
          }
          groupBy: {
            args: Prisma.providerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderGroupByOutputType>[]
          }
          count: {
            args: Prisma.providerCountArgs<ExtArgs>
            result: $Utils.Optional<ProviderCountAggregateOutputType> | number
          }
        }
      }
      sale: {
        payload: Prisma.$salePayload<ExtArgs>
        fields: Prisma.saleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.saleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.saleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload>
          }
          findFirst: {
            args: Prisma.saleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.saleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload>
          }
          findMany: {
            args: Prisma.saleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload>[]
          }
          create: {
            args: Prisma.saleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload>
          }
          createMany: {
            args: Prisma.saleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.saleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload>
          }
          update: {
            args: Prisma.saleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload>
          }
          deleteMany: {
            args: Prisma.saleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.saleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.saleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$salePayload>
          }
          aggregate: {
            args: Prisma.SaleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSale>
          }
          groupBy: {
            args: Prisma.saleGroupByArgs<ExtArgs>
            result: $Utils.Optional<SaleGroupByOutputType>[]
          }
          count: {
            args: Prisma.saleCountArgs<ExtArgs>
            result: $Utils.Optional<SaleCountAggregateOutputType> | number
          }
        }
      }
      saleitem: {
        payload: Prisma.$saleitemPayload<ExtArgs>
        fields: Prisma.saleitemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.saleitemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.saleitemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload>
          }
          findFirst: {
            args: Prisma.saleitemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.saleitemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload>
          }
          findMany: {
            args: Prisma.saleitemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload>[]
          }
          create: {
            args: Prisma.saleitemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload>
          }
          createMany: {
            args: Prisma.saleitemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.saleitemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload>
          }
          update: {
            args: Prisma.saleitemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload>
          }
          deleteMany: {
            args: Prisma.saleitemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.saleitemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.saleitemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$saleitemPayload>
          }
          aggregate: {
            args: Prisma.SaleitemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSaleitem>
          }
          groupBy: {
            args: Prisma.saleitemGroupByArgs<ExtArgs>
            result: $Utils.Optional<SaleitemGroupByOutputType>[]
          }
          count: {
            args: Prisma.saleitemCountArgs<ExtArgs>
            result: $Utils.Optional<SaleitemCountAggregateOutputType> | number
          }
        }
      }
      user: {
        payload: Prisma.$userPayload<ExtArgs>
        fields: Prisma.userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findFirst: {
            args: Prisma.userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findMany: {
            args: Prisma.userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          create: {
            args: Prisma.userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          createMany: {
            args: Prisma.userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          update: {
            args: Prisma.userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          deleteMany: {
            args: Prisma.userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.userGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.userCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    category?: categoryOmit
    customer?: customerOmit
    invoice?: invoiceOmit
    product?: productOmit
    provider?: providerOmit
    sale?: saleOmit
    saleitem?: saleitemOmit
    user?: userOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    product: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | CategoryCountOutputTypeCountProductArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: productWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    sale: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | CustomerCountOutputTypeCountSaleArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountSaleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saleWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    saleitem: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saleitem?: boolean | ProductCountOutputTypeCountSaleitemArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountSaleitemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saleitemWhereInput
  }


  /**
   * Count Type ProviderCountOutputType
   */

  export type ProviderCountOutputType = {
    product: number
  }

  export type ProviderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProviderCountOutputTypeCountProductArgs
  }

  // Custom InputTypes
  /**
   * ProviderCountOutputType without action
   */
  export type ProviderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCountOutputType
     */
    select?: ProviderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProviderCountOutputType without action
   */
  export type ProviderCountOutputTypeCountProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: productWhereInput
  }


  /**
   * Count Type SaleCountOutputType
   */

  export type SaleCountOutputType = {
    saleitem: number
  }

  export type SaleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saleitem?: boolean | SaleCountOutputTypeCountSaleitemArgs
  }

  // Custom InputTypes
  /**
   * SaleCountOutputType without action
   */
  export type SaleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleCountOutputType
     */
    select?: SaleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SaleCountOutputType without action
   */
  export type SaleCountOutputTypeCountSaleitemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saleitemWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sale: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | UserCountOutputTypeCountSaleArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSaleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which category to aggregate.
     */
    where?: categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoryOrderByWithRelationInput | categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type categoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: categoryWhereInput
    orderBy?: categoryOrderByWithAggregationInput | categoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: categoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends categoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type categorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | category$productArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>



  export type categorySelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type categoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["category"]>
  export type categoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | category$productArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $categoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "category"
    objects: {
      product: Prisma.$productPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type categoryGetPayload<S extends boolean | null | undefined | categoryDefaultArgs> = $Result.GetResult<Prisma.$categoryPayload, S>

  type categoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<categoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface categoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['category'], meta: { name: 'category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {categoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends categoryFindUniqueArgs>(args: SelectSubset<T, categoryFindUniqueArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {categoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends categoryFindUniqueOrThrowArgs>(args: SelectSubset<T, categoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends categoryFindFirstArgs>(args?: SelectSubset<T, categoryFindFirstArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends categoryFindFirstOrThrowArgs>(args?: SelectSubset<T, categoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends categoryFindManyArgs>(args?: SelectSubset<T, categoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {categoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends categoryCreateArgs>(args: SelectSubset<T, categoryCreateArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {categoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends categoryCreateManyArgs>(args?: SelectSubset<T, categoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Category.
     * @param {categoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends categoryDeleteArgs>(args: SelectSubset<T, categoryDeleteArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {categoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends categoryUpdateArgs>(args: SelectSubset<T, categoryUpdateArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {categoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends categoryDeleteManyArgs>(args?: SelectSubset<T, categoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends categoryUpdateManyArgs>(args: SelectSubset<T, categoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {categoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends categoryUpsertArgs>(args: SelectSubset<T, categoryUpsertArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends categoryCountArgs>(
      args?: Subset<T, categoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends categoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: categoryGroupByArgs['orderBy'] }
        : { orderBy?: categoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, categoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the category model
   */
  readonly fields: categoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__categoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends category$productArgs<ExtArgs> = {}>(args?: Subset<T, category$productArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the category model
   */
  interface categoryFieldRefs {
    readonly id: FieldRef<"category", 'Int'>
    readonly name: FieldRef<"category", 'String'>
    readonly createdAt: FieldRef<"category", 'DateTime'>
    readonly updatedAt: FieldRef<"category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * category findUnique
   */
  export type categoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * Filter, which category to fetch.
     */
    where: categoryWhereUniqueInput
  }

  /**
   * category findUniqueOrThrow
   */
  export type categoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * Filter, which category to fetch.
     */
    where: categoryWhereUniqueInput
  }

  /**
   * category findFirst
   */
  export type categoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * Filter, which category to fetch.
     */
    where?: categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoryOrderByWithRelationInput | categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categories.
     */
    cursor?: categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * category findFirstOrThrow
   */
  export type categoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * Filter, which category to fetch.
     */
    where?: categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoryOrderByWithRelationInput | categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categories.
     */
    cursor?: categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * category findMany
   */
  export type categoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * Filter, which categories to fetch.
     */
    where?: categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoryOrderByWithRelationInput | categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing categories.
     */
    cursor?: categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * category create
   */
  export type categoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * The data needed to create a category.
     */
    data: XOR<categoryCreateInput, categoryUncheckedCreateInput>
  }

  /**
   * category createMany
   */
  export type categoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many categories.
     */
    data: categoryCreateManyInput | categoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * category update
   */
  export type categoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * The data needed to update a category.
     */
    data: XOR<categoryUpdateInput, categoryUncheckedUpdateInput>
    /**
     * Choose, which category to update.
     */
    where: categoryWhereUniqueInput
  }

  /**
   * category updateMany
   */
  export type categoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update categories.
     */
    data: XOR<categoryUpdateManyMutationInput, categoryUncheckedUpdateManyInput>
    /**
     * Filter which categories to update
     */
    where?: categoryWhereInput
    /**
     * Limit how many categories to update.
     */
    limit?: number
  }

  /**
   * category upsert
   */
  export type categoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * The filter to search for the category to update in case it exists.
     */
    where: categoryWhereUniqueInput
    /**
     * In case the category found by the `where` argument doesn't exist, create a new category with this data.
     */
    create: XOR<categoryCreateInput, categoryUncheckedCreateInput>
    /**
     * In case the category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<categoryUpdateInput, categoryUncheckedUpdateInput>
  }

  /**
   * category delete
   */
  export type categoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
    /**
     * Filter which category to delete.
     */
    where: categoryWhereUniqueInput
  }

  /**
   * category deleteMany
   */
  export type categoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which categories to delete
     */
    where?: categoryWhereInput
    /**
     * Limit how many categories to delete.
     */
    limit?: number
  }

  /**
   * category.product
   */
  export type category$productArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    where?: productWhereInput
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    cursor?: productWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * category without action
   */
  export type categoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categoryInclude<ExtArgs> | null
  }


  /**
   * Model customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerAvgAggregateOutputType = {
    id: number | null
  }

  export type CustomerSumAggregateOutputType = {
    id: number | null
  }

  export type CustomerMinAggregateOutputType = {
    id: number | null
    name: string | null
    cedula: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: number | null
    name: string | null
    cedula: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    name: number
    cedula: number
    email: number
    phone: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerAvgAggregateInputType = {
    id?: true
  }

  export type CustomerSumAggregateInputType = {
    id?: true
  }

  export type CustomerMinAggregateInputType = {
    id?: true
    name?: true
    cedula?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    name?: true
    cedula?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    name?: true
    cedula?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which customer to aggregate.
     */
    where?: customerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of customers to fetch.
     */
    orderBy?: customerOrderByWithRelationInput | customerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: customerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type customerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: customerWhereInput
    orderBy?: customerOrderByWithAggregationInput | customerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: customerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _avg?: CustomerAvgAggregateInputType
    _sum?: CustomerSumAggregateInputType
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: number
    name: string
    cedula: string | null
    email: string | null
    phone: string | null
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends customerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type customerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    cedula?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sale?: boolean | customer$saleArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>



  export type customerSelectScalar = {
    id?: boolean
    name?: boolean
    cedula?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type customerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "cedula" | "email" | "phone" | "createdAt" | "updatedAt", ExtArgs["result"]["customer"]>
  export type customerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | customer$saleArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $customerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "customer"
    objects: {
      sale: Prisma.$salePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      cedula: string | null
      email: string | null
      phone: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type customerGetPayload<S extends boolean | null | undefined | customerDefaultArgs> = $Result.GetResult<Prisma.$customerPayload, S>

  type customerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<customerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface customerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['customer'], meta: { name: 'customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {customerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends customerFindUniqueArgs>(args: SelectSubset<T, customerFindUniqueArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {customerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends customerFindUniqueOrThrowArgs>(args: SelectSubset<T, customerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends customerFindFirstArgs>(args?: SelectSubset<T, customerFindFirstArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends customerFindFirstOrThrowArgs>(args?: SelectSubset<T, customerFindFirstOrThrowArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends customerFindManyArgs>(args?: SelectSubset<T, customerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customer.
     * @param {customerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends customerCreateArgs>(args: SelectSubset<T, customerCreateArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {customerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends customerCreateManyArgs>(args?: SelectSubset<T, customerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Customer.
     * @param {customerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends customerDeleteArgs>(args: SelectSubset<T, customerDeleteArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customer.
     * @param {customerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends customerUpdateArgs>(args: SelectSubset<T, customerUpdateArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {customerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends customerDeleteManyArgs>(args?: SelectSubset<T, customerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends customerUpdateManyArgs>(args: SelectSubset<T, customerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {customerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends customerUpsertArgs>(args: SelectSubset<T, customerUpsertArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends customerCountArgs>(
      args?: Subset<T, customerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends customerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: customerGroupByArgs['orderBy'] }
        : { orderBy?: customerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, customerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the customer model
   */
  readonly fields: customerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__customerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends customer$saleArgs<ExtArgs> = {}>(args?: Subset<T, customer$saleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the customer model
   */
  interface customerFieldRefs {
    readonly id: FieldRef<"customer", 'Int'>
    readonly name: FieldRef<"customer", 'String'>
    readonly cedula: FieldRef<"customer", 'String'>
    readonly email: FieldRef<"customer", 'String'>
    readonly phone: FieldRef<"customer", 'String'>
    readonly createdAt: FieldRef<"customer", 'DateTime'>
    readonly updatedAt: FieldRef<"customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * customer findUnique
   */
  export type customerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * Filter, which customer to fetch.
     */
    where: customerWhereUniqueInput
  }

  /**
   * customer findUniqueOrThrow
   */
  export type customerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * Filter, which customer to fetch.
     */
    where: customerWhereUniqueInput
  }

  /**
   * customer findFirst
   */
  export type customerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * Filter, which customer to fetch.
     */
    where?: customerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of customers to fetch.
     */
    orderBy?: customerOrderByWithRelationInput | customerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for customers.
     */
    cursor?: customerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * customer findFirstOrThrow
   */
  export type customerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * Filter, which customer to fetch.
     */
    where?: customerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of customers to fetch.
     */
    orderBy?: customerOrderByWithRelationInput | customerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for customers.
     */
    cursor?: customerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * customer findMany
   */
  export type customerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * Filter, which customers to fetch.
     */
    where?: customerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of customers to fetch.
     */
    orderBy?: customerOrderByWithRelationInput | customerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing customers.
     */
    cursor?: customerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * customer create
   */
  export type customerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * The data needed to create a customer.
     */
    data: XOR<customerCreateInput, customerUncheckedCreateInput>
  }

  /**
   * customer createMany
   */
  export type customerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many customers.
     */
    data: customerCreateManyInput | customerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * customer update
   */
  export type customerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * The data needed to update a customer.
     */
    data: XOR<customerUpdateInput, customerUncheckedUpdateInput>
    /**
     * Choose, which customer to update.
     */
    where: customerWhereUniqueInput
  }

  /**
   * customer updateMany
   */
  export type customerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update customers.
     */
    data: XOR<customerUpdateManyMutationInput, customerUncheckedUpdateManyInput>
    /**
     * Filter which customers to update
     */
    where?: customerWhereInput
    /**
     * Limit how many customers to update.
     */
    limit?: number
  }

  /**
   * customer upsert
   */
  export type customerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * The filter to search for the customer to update in case it exists.
     */
    where: customerWhereUniqueInput
    /**
     * In case the customer found by the `where` argument doesn't exist, create a new customer with this data.
     */
    create: XOR<customerCreateInput, customerUncheckedCreateInput>
    /**
     * In case the customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<customerUpdateInput, customerUncheckedUpdateInput>
  }

  /**
   * customer delete
   */
  export type customerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
    /**
     * Filter which customer to delete.
     */
    where: customerWhereUniqueInput
  }

  /**
   * customer deleteMany
   */
  export type customerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which customers to delete
     */
    where?: customerWhereInput
    /**
     * Limit how many customers to delete.
     */
    limit?: number
  }

  /**
   * customer.sale
   */
  export type customer$saleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    where?: saleWhereInput
    orderBy?: saleOrderByWithRelationInput | saleOrderByWithRelationInput[]
    cursor?: saleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * customer without action
   */
  export type customerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customer
     */
    select?: customerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customer
     */
    omit?: customerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customerInclude<ExtArgs> | null
  }


  /**
   * Model invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    id: number | null
    saleId: number | null
  }

  export type InvoiceSumAggregateOutputType = {
    id: number | null
    saleId: number | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: number | null
    saleId: number | null
    number: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    invoiceStatus: $Enums.invoice_invoiceStatus | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: number | null
    saleId: number | null
    number: string | null
    date: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    invoiceStatus: $Enums.invoice_invoiceStatus | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    saleId: number
    number: number
    date: number
    createdAt: number
    updatedAt: number
    invoiceStatus: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    id?: true
    saleId?: true
  }

  export type InvoiceSumAggregateInputType = {
    id?: true
    saleId?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    saleId?: true
    number?: true
    date?: true
    createdAt?: true
    updatedAt?: true
    invoiceStatus?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    saleId?: true
    number?: true
    date?: true
    createdAt?: true
    updatedAt?: true
    invoiceStatus?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    saleId?: true
    number?: true
    date?: true
    createdAt?: true
    updatedAt?: true
    invoiceStatus?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which invoice to aggregate.
     */
    where?: invoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of invoices to fetch.
     */
    orderBy?: invoiceOrderByWithRelationInput | invoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: invoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type invoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: invoiceWhereInput
    orderBy?: invoiceOrderByWithAggregationInput | invoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: invoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: number
    saleId: number
    number: string
    date: Date
    createdAt: Date
    updatedAt: Date
    invoiceStatus: $Enums.invoice_invoiceStatus | null
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends invoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type invoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    number?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoiceStatus?: boolean
    sale?: boolean | saleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>



  export type invoiceSelectScalar = {
    id?: boolean
    saleId?: boolean
    number?: boolean
    date?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoiceStatus?: boolean
  }

  export type invoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "saleId" | "number" | "date" | "createdAt" | "updatedAt" | "invoiceStatus", ExtArgs["result"]["invoice"]>
  export type invoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | saleDefaultArgs<ExtArgs>
  }

  export type $invoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "invoice"
    objects: {
      sale: Prisma.$salePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      saleId: number
      number: string
      date: Date
      createdAt: Date
      updatedAt: Date
      invoiceStatus: $Enums.invoice_invoiceStatus | null
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type invoiceGetPayload<S extends boolean | null | undefined | invoiceDefaultArgs> = $Result.GetResult<Prisma.$invoicePayload, S>

  type invoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<invoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface invoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['invoice'], meta: { name: 'invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {invoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends invoiceFindUniqueArgs>(args: SelectSubset<T, invoiceFindUniqueArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {invoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends invoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, invoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {invoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends invoiceFindFirstArgs>(args?: SelectSubset<T, invoiceFindFirstArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {invoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends invoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, invoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {invoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends invoiceFindManyArgs>(args?: SelectSubset<T, invoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invoice.
     * @param {invoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends invoiceCreateArgs>(args: SelectSubset<T, invoiceCreateArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invoices.
     * @param {invoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends invoiceCreateManyArgs>(args?: SelectSubset<T, invoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Invoice.
     * @param {invoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends invoiceDeleteArgs>(args: SelectSubset<T, invoiceDeleteArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invoice.
     * @param {invoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends invoiceUpdateArgs>(args: SelectSubset<T, invoiceUpdateArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invoices.
     * @param {invoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends invoiceDeleteManyArgs>(args?: SelectSubset<T, invoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {invoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends invoiceUpdateManyArgs>(args: SelectSubset<T, invoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invoice.
     * @param {invoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends invoiceUpsertArgs>(args: SelectSubset<T, invoiceUpsertArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {invoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends invoiceCountArgs>(
      args?: Subset<T, invoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {invoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends invoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: invoiceGroupByArgs['orderBy'] }
        : { orderBy?: invoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, invoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the invoice model
   */
  readonly fields: invoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__invoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends saleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, saleDefaultArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the invoice model
   */
  interface invoiceFieldRefs {
    readonly id: FieldRef<"invoice", 'Int'>
    readonly saleId: FieldRef<"invoice", 'Int'>
    readonly number: FieldRef<"invoice", 'String'>
    readonly date: FieldRef<"invoice", 'DateTime'>
    readonly createdAt: FieldRef<"invoice", 'DateTime'>
    readonly updatedAt: FieldRef<"invoice", 'DateTime'>
    readonly invoiceStatus: FieldRef<"invoice", 'invoice_invoiceStatus'>
  }
    

  // Custom InputTypes
  /**
   * invoice findUnique
   */
  export type invoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * Filter, which invoice to fetch.
     */
    where: invoiceWhereUniqueInput
  }

  /**
   * invoice findUniqueOrThrow
   */
  export type invoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * Filter, which invoice to fetch.
     */
    where: invoiceWhereUniqueInput
  }

  /**
   * invoice findFirst
   */
  export type invoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * Filter, which invoice to fetch.
     */
    where?: invoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of invoices to fetch.
     */
    orderBy?: invoiceOrderByWithRelationInput | invoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for invoices.
     */
    cursor?: invoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * invoice findFirstOrThrow
   */
  export type invoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * Filter, which invoice to fetch.
     */
    where?: invoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of invoices to fetch.
     */
    orderBy?: invoiceOrderByWithRelationInput | invoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for invoices.
     */
    cursor?: invoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * invoice findMany
   */
  export type invoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * Filter, which invoices to fetch.
     */
    where?: invoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of invoices to fetch.
     */
    orderBy?: invoiceOrderByWithRelationInput | invoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing invoices.
     */
    cursor?: invoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * invoice create
   */
  export type invoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a invoice.
     */
    data: XOR<invoiceCreateInput, invoiceUncheckedCreateInput>
  }

  /**
   * invoice createMany
   */
  export type invoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many invoices.
     */
    data: invoiceCreateManyInput | invoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * invoice update
   */
  export type invoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a invoice.
     */
    data: XOR<invoiceUpdateInput, invoiceUncheckedUpdateInput>
    /**
     * Choose, which invoice to update.
     */
    where: invoiceWhereUniqueInput
  }

  /**
   * invoice updateMany
   */
  export type invoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update invoices.
     */
    data: XOR<invoiceUpdateManyMutationInput, invoiceUncheckedUpdateManyInput>
    /**
     * Filter which invoices to update
     */
    where?: invoiceWhereInput
    /**
     * Limit how many invoices to update.
     */
    limit?: number
  }

  /**
   * invoice upsert
   */
  export type invoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the invoice to update in case it exists.
     */
    where: invoiceWhereUniqueInput
    /**
     * In case the invoice found by the `where` argument doesn't exist, create a new invoice with this data.
     */
    create: XOR<invoiceCreateInput, invoiceUncheckedCreateInput>
    /**
     * In case the invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<invoiceUpdateInput, invoiceUncheckedUpdateInput>
  }

  /**
   * invoice delete
   */
  export type invoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    /**
     * Filter which invoice to delete.
     */
    where: invoiceWhereUniqueInput
  }

  /**
   * invoice deleteMany
   */
  export type invoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which invoices to delete
     */
    where?: invoiceWhereInput
    /**
     * Limit how many invoices to delete.
     */
    limit?: number
  }

  /**
   * invoice without action
   */
  export type invoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
  }


  /**
   * Model product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    id: number | null
    purchasePrice: number | null
    sellingPrice: number | null
    stock: number | null
    minStock: number | null
    categoryId: number | null
    providerId: number | null
  }

  export type ProductSumAggregateOutputType = {
    id: number | null
    purchasePrice: number | null
    sellingPrice: number | null
    stock: number | null
    minStock: number | null
    categoryId: number | null
    providerId: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    purchasePrice: number | null
    sellingPrice: number | null
    stock: number | null
    minStock: number | null
    categoryId: number | null
    providerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    purchasePrice: number | null
    sellingPrice: number | null
    stock: number | null
    minStock: number | null
    categoryId: number | null
    providerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    description: number
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    categoryId: number
    providerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    id?: true
    purchasePrice?: true
    sellingPrice?: true
    stock?: true
    minStock?: true
    categoryId?: true
    providerId?: true
  }

  export type ProductSumAggregateInputType = {
    id?: true
    purchasePrice?: true
    sellingPrice?: true
    stock?: true
    minStock?: true
    categoryId?: true
    providerId?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    purchasePrice?: true
    sellingPrice?: true
    stock?: true
    minStock?: true
    categoryId?: true
    providerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    purchasePrice?: true
    sellingPrice?: true
    stock?: true
    minStock?: true
    categoryId?: true
    providerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    purchasePrice?: true
    sellingPrice?: true
    stock?: true
    minStock?: true
    categoryId?: true
    providerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product to aggregate.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type productGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: productWhereInput
    orderBy?: productOrderByWithAggregationInput | productOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: productScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: number
    name: string
    description: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    categoryId: number
    providerId: number
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends productGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type productSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    purchasePrice?: boolean
    sellingPrice?: boolean
    stock?: boolean
    minStock?: boolean
    categoryId?: boolean
    providerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | categoryDefaultArgs<ExtArgs>
    provider?: boolean | providerDefaultArgs<ExtArgs>
    saleitem?: boolean | product$saleitemArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>



  export type productSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    purchasePrice?: boolean
    sellingPrice?: boolean
    stock?: boolean
    minStock?: boolean
    categoryId?: boolean
    providerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type productOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "purchasePrice" | "sellingPrice" | "stock" | "minStock" | "categoryId" | "providerId" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type productInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | categoryDefaultArgs<ExtArgs>
    provider?: boolean | providerDefaultArgs<ExtArgs>
    saleitem?: boolean | product$saleitemArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $productPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "product"
    objects: {
      category: Prisma.$categoryPayload<ExtArgs>
      provider: Prisma.$providerPayload<ExtArgs>
      saleitem: Prisma.$saleitemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string | null
      purchasePrice: number
      sellingPrice: number
      stock: number
      minStock: number
      categoryId: number
      providerId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type productGetPayload<S extends boolean | null | undefined | productDefaultArgs> = $Result.GetResult<Prisma.$productPayload, S>

  type productCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<productFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface productDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['product'], meta: { name: 'product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {productFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends productFindUniqueArgs>(args: SelectSubset<T, productFindUniqueArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {productFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends productFindUniqueOrThrowArgs>(args: SelectSubset<T, productFindUniqueOrThrowArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends productFindFirstArgs>(args?: SelectSubset<T, productFindFirstArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends productFindFirstOrThrowArgs>(args?: SelectSubset<T, productFindFirstOrThrowArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends productFindManyArgs>(args?: SelectSubset<T, productFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {productCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends productCreateArgs>(args: SelectSubset<T, productCreateArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {productCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends productCreateManyArgs>(args?: SelectSubset<T, productCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Product.
     * @param {productDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends productDeleteArgs>(args: SelectSubset<T, productDeleteArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {productUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends productUpdateArgs>(args: SelectSubset<T, productUpdateArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {productDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends productDeleteManyArgs>(args?: SelectSubset<T, productDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends productUpdateManyArgs>(args: SelectSubset<T, productUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {productUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends productUpsertArgs>(args: SelectSubset<T, productUpsertArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends productCountArgs>(
      args?: Subset<T, productCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends productGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: productGroupByArgs['orderBy'] }
        : { orderBy?: productGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, productGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the product model
   */
  readonly fields: productFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__productClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends categoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, categoryDefaultArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    provider<T extends providerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, providerDefaultArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    saleitem<T extends product$saleitemArgs<ExtArgs> = {}>(args?: Subset<T, product$saleitemArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the product model
   */
  interface productFieldRefs {
    readonly id: FieldRef<"product", 'Int'>
    readonly name: FieldRef<"product", 'String'>
    readonly description: FieldRef<"product", 'String'>
    readonly purchasePrice: FieldRef<"product", 'Float'>
    readonly sellingPrice: FieldRef<"product", 'Float'>
    readonly stock: FieldRef<"product", 'Int'>
    readonly minStock: FieldRef<"product", 'Int'>
    readonly categoryId: FieldRef<"product", 'Int'>
    readonly providerId: FieldRef<"product", 'Int'>
    readonly createdAt: FieldRef<"product", 'DateTime'>
    readonly updatedAt: FieldRef<"product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * product findUnique
   */
  export type productFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where: productWhereUniqueInput
  }

  /**
   * product findUniqueOrThrow
   */
  export type productFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where: productWhereUniqueInput
  }

  /**
   * product findFirst
   */
  export type productFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product findFirstOrThrow
   */
  export type productFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product findMany
   */
  export type productFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which products to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product create
   */
  export type productCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The data needed to create a product.
     */
    data: XOR<productCreateInput, productUncheckedCreateInput>
  }

  /**
   * product createMany
   */
  export type productCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many products.
     */
    data: productCreateManyInput | productCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * product update
   */
  export type productUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The data needed to update a product.
     */
    data: XOR<productUpdateInput, productUncheckedUpdateInput>
    /**
     * Choose, which product to update.
     */
    where: productWhereUniqueInput
  }

  /**
   * product updateMany
   */
  export type productUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update products.
     */
    data: XOR<productUpdateManyMutationInput, productUncheckedUpdateManyInput>
    /**
     * Filter which products to update
     */
    where?: productWhereInput
    /**
     * Limit how many products to update.
     */
    limit?: number
  }

  /**
   * product upsert
   */
  export type productUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The filter to search for the product to update in case it exists.
     */
    where: productWhereUniqueInput
    /**
     * In case the product found by the `where` argument doesn't exist, create a new product with this data.
     */
    create: XOR<productCreateInput, productUncheckedCreateInput>
    /**
     * In case the product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<productUpdateInput, productUncheckedUpdateInput>
  }

  /**
   * product delete
   */
  export type productDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter which product to delete.
     */
    where: productWhereUniqueInput
  }

  /**
   * product deleteMany
   */
  export type productDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which products to delete
     */
    where?: productWhereInput
    /**
     * Limit how many products to delete.
     */
    limit?: number
  }

  /**
   * product.saleitem
   */
  export type product$saleitemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    where?: saleitemWhereInput
    orderBy?: saleitemOrderByWithRelationInput | saleitemOrderByWithRelationInput[]
    cursor?: saleitemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleitemScalarFieldEnum | SaleitemScalarFieldEnum[]
  }

  /**
   * product without action
   */
  export type productDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
  }


  /**
   * Model provider
   */

  export type AggregateProvider = {
    _count: ProviderCountAggregateOutputType | null
    _avg: ProviderAvgAggregateOutputType | null
    _sum: ProviderSumAggregateOutputType | null
    _min: ProviderMinAggregateOutputType | null
    _max: ProviderMaxAggregateOutputType | null
  }

  export type ProviderAvgAggregateOutputType = {
    id: number | null
  }

  export type ProviderSumAggregateOutputType = {
    id: number | null
  }

  export type ProviderMinAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderMaxAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProviderAvgAggregateInputType = {
    id?: true
  }

  export type ProviderSumAggregateInputType = {
    id?: true
  }

  export type ProviderMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProviderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which provider to aggregate.
     */
    where?: providerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of providers to fetch.
     */
    orderBy?: providerOrderByWithRelationInput | providerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: providerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned providers
    **/
    _count?: true | ProviderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProviderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProviderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProviderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProviderMaxAggregateInputType
  }

  export type GetProviderAggregateType<T extends ProviderAggregateArgs> = {
        [P in keyof T & keyof AggregateProvider]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProvider[P]>
      : GetScalarType<T[P], AggregateProvider[P]>
  }




  export type providerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: providerWhereInput
    orderBy?: providerOrderByWithAggregationInput | providerOrderByWithAggregationInput[]
    by: ProviderScalarFieldEnum[] | ProviderScalarFieldEnum
    having?: providerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderCountAggregateInputType | true
    _avg?: ProviderAvgAggregateInputType
    _sum?: ProviderSumAggregateInputType
    _min?: ProviderMinAggregateInputType
    _max?: ProviderMaxAggregateInputType
  }

  export type ProviderGroupByOutputType = {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    _count: ProviderCountAggregateOutputType | null
    _avg: ProviderAvgAggregateOutputType | null
    _sum: ProviderSumAggregateOutputType | null
    _min: ProviderMinAggregateOutputType | null
    _max: ProviderMaxAggregateOutputType | null
  }

  type GetProviderGroupByPayload<T extends providerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderGroupByOutputType[P]>
        }
      >
    >


  export type providerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | provider$productArgs<ExtArgs>
    _count?: boolean | ProviderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["provider"]>



  export type providerSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type providerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["provider"]>
  export type providerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | provider$productArgs<ExtArgs>
    _count?: boolean | ProviderCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $providerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "provider"
    objects: {
      product: Prisma.$productPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["provider"]>
    composites: {}
  }

  type providerGetPayload<S extends boolean | null | undefined | providerDefaultArgs> = $Result.GetResult<Prisma.$providerPayload, S>

  type providerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<providerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProviderCountAggregateInputType | true
    }

  export interface providerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['provider'], meta: { name: 'provider' } }
    /**
     * Find zero or one Provider that matches the filter.
     * @param {providerFindUniqueArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends providerFindUniqueArgs>(args: SelectSubset<T, providerFindUniqueArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Provider that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {providerFindUniqueOrThrowArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends providerFindUniqueOrThrowArgs>(args: SelectSubset<T, providerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Provider that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {providerFindFirstArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends providerFindFirstArgs>(args?: SelectSubset<T, providerFindFirstArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Provider that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {providerFindFirstOrThrowArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends providerFindFirstOrThrowArgs>(args?: SelectSubset<T, providerFindFirstOrThrowArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Providers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {providerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Providers
     * const providers = await prisma.provider.findMany()
     * 
     * // Get first 10 Providers
     * const providers = await prisma.provider.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const providerWithIdOnly = await prisma.provider.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends providerFindManyArgs>(args?: SelectSubset<T, providerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Provider.
     * @param {providerCreateArgs} args - Arguments to create a Provider.
     * @example
     * // Create one Provider
     * const Provider = await prisma.provider.create({
     *   data: {
     *     // ... data to create a Provider
     *   }
     * })
     * 
     */
    create<T extends providerCreateArgs>(args: SelectSubset<T, providerCreateArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Providers.
     * @param {providerCreateManyArgs} args - Arguments to create many Providers.
     * @example
     * // Create many Providers
     * const provider = await prisma.provider.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends providerCreateManyArgs>(args?: SelectSubset<T, providerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Provider.
     * @param {providerDeleteArgs} args - Arguments to delete one Provider.
     * @example
     * // Delete one Provider
     * const Provider = await prisma.provider.delete({
     *   where: {
     *     // ... filter to delete one Provider
     *   }
     * })
     * 
     */
    delete<T extends providerDeleteArgs>(args: SelectSubset<T, providerDeleteArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Provider.
     * @param {providerUpdateArgs} args - Arguments to update one Provider.
     * @example
     * // Update one Provider
     * const provider = await prisma.provider.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends providerUpdateArgs>(args: SelectSubset<T, providerUpdateArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Providers.
     * @param {providerDeleteManyArgs} args - Arguments to filter Providers to delete.
     * @example
     * // Delete a few Providers
     * const { count } = await prisma.provider.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends providerDeleteManyArgs>(args?: SelectSubset<T, providerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Providers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {providerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Providers
     * const provider = await prisma.provider.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends providerUpdateManyArgs>(args: SelectSubset<T, providerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Provider.
     * @param {providerUpsertArgs} args - Arguments to update or create a Provider.
     * @example
     * // Update or create a Provider
     * const provider = await prisma.provider.upsert({
     *   create: {
     *     // ... data to create a Provider
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Provider we want to update
     *   }
     * })
     */
    upsert<T extends providerUpsertArgs>(args: SelectSubset<T, providerUpsertArgs<ExtArgs>>): Prisma__providerClient<$Result.GetResult<Prisma.$providerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Providers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {providerCountArgs} args - Arguments to filter Providers to count.
     * @example
     * // Count the number of Providers
     * const count = await prisma.provider.count({
     *   where: {
     *     // ... the filter for the Providers we want to count
     *   }
     * })
    **/
    count<T extends providerCountArgs>(
      args?: Subset<T, providerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Provider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProviderAggregateArgs>(args: Subset<T, ProviderAggregateArgs>): Prisma.PrismaPromise<GetProviderAggregateType<T>>

    /**
     * Group by Provider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {providerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends providerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: providerGroupByArgs['orderBy'] }
        : { orderBy?: providerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, providerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the provider model
   */
  readonly fields: providerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for provider.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__providerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends provider$productArgs<ExtArgs> = {}>(args?: Subset<T, provider$productArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the provider model
   */
  interface providerFieldRefs {
    readonly id: FieldRef<"provider", 'Int'>
    readonly name: FieldRef<"provider", 'String'>
    readonly createdAt: FieldRef<"provider", 'DateTime'>
    readonly updatedAt: FieldRef<"provider", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * provider findUnique
   */
  export type providerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * Filter, which provider to fetch.
     */
    where: providerWhereUniqueInput
  }

  /**
   * provider findUniqueOrThrow
   */
  export type providerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * Filter, which provider to fetch.
     */
    where: providerWhereUniqueInput
  }

  /**
   * provider findFirst
   */
  export type providerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * Filter, which provider to fetch.
     */
    where?: providerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of providers to fetch.
     */
    orderBy?: providerOrderByWithRelationInput | providerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for providers.
     */
    cursor?: providerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of providers.
     */
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * provider findFirstOrThrow
   */
  export type providerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * Filter, which provider to fetch.
     */
    where?: providerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of providers to fetch.
     */
    orderBy?: providerOrderByWithRelationInput | providerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for providers.
     */
    cursor?: providerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of providers.
     */
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * provider findMany
   */
  export type providerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * Filter, which providers to fetch.
     */
    where?: providerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of providers to fetch.
     */
    orderBy?: providerOrderByWithRelationInput | providerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing providers.
     */
    cursor?: providerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` providers.
     */
    skip?: number
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * provider create
   */
  export type providerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * The data needed to create a provider.
     */
    data: XOR<providerCreateInput, providerUncheckedCreateInput>
  }

  /**
   * provider createMany
   */
  export type providerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many providers.
     */
    data: providerCreateManyInput | providerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * provider update
   */
  export type providerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * The data needed to update a provider.
     */
    data: XOR<providerUpdateInput, providerUncheckedUpdateInput>
    /**
     * Choose, which provider to update.
     */
    where: providerWhereUniqueInput
  }

  /**
   * provider updateMany
   */
  export type providerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update providers.
     */
    data: XOR<providerUpdateManyMutationInput, providerUncheckedUpdateManyInput>
    /**
     * Filter which providers to update
     */
    where?: providerWhereInput
    /**
     * Limit how many providers to update.
     */
    limit?: number
  }

  /**
   * provider upsert
   */
  export type providerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * The filter to search for the provider to update in case it exists.
     */
    where: providerWhereUniqueInput
    /**
     * In case the provider found by the `where` argument doesn't exist, create a new provider with this data.
     */
    create: XOR<providerCreateInput, providerUncheckedCreateInput>
    /**
     * In case the provider was found with the provided `where` argument, update it with this data.
     */
    update: XOR<providerUpdateInput, providerUncheckedUpdateInput>
  }

  /**
   * provider delete
   */
  export type providerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
    /**
     * Filter which provider to delete.
     */
    where: providerWhereUniqueInput
  }

  /**
   * provider deleteMany
   */
  export type providerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which providers to delete
     */
    where?: providerWhereInput
    /**
     * Limit how many providers to delete.
     */
    limit?: number
  }

  /**
   * provider.product
   */
  export type provider$productArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    where?: productWhereInput
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    cursor?: productWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * provider without action
   */
  export type providerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the provider
     */
    select?: providerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the provider
     */
    omit?: providerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: providerInclude<ExtArgs> | null
  }


  /**
   * Model sale
   */

  export type AggregateSale = {
    _count: SaleCountAggregateOutputType | null
    _avg: SaleAvgAggregateOutputType | null
    _sum: SaleSumAggregateOutputType | null
    _min: SaleMinAggregateOutputType | null
    _max: SaleMaxAggregateOutputType | null
  }

  export type SaleAvgAggregateOutputType = {
    id: number | null
    customerId: number | null
    userId: number | null
    totalAmount: number | null
  }

  export type SaleSumAggregateOutputType = {
    id: number | null
    customerId: number | null
    userId: number | null
    totalAmount: number | null
  }

  export type SaleMinAggregateOutputType = {
    id: number | null
    customerId: number | null
    userId: number | null
    saleDate: Date | null
    totalAmount: number | null
    paymentMethod: $Enums.sale_paymentMethod | null
    status: $Enums.sale_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SaleMaxAggregateOutputType = {
    id: number | null
    customerId: number | null
    userId: number | null
    saleDate: Date | null
    totalAmount: number | null
    paymentMethod: $Enums.sale_paymentMethod | null
    status: $Enums.sale_status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SaleCountAggregateOutputType = {
    id: number
    customerId: number
    userId: number
    saleDate: number
    totalAmount: number
    paymentMethod: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SaleAvgAggregateInputType = {
    id?: true
    customerId?: true
    userId?: true
    totalAmount?: true
  }

  export type SaleSumAggregateInputType = {
    id?: true
    customerId?: true
    userId?: true
    totalAmount?: true
  }

  export type SaleMinAggregateInputType = {
    id?: true
    customerId?: true
    userId?: true
    saleDate?: true
    totalAmount?: true
    paymentMethod?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SaleMaxAggregateInputType = {
    id?: true
    customerId?: true
    userId?: true
    saleDate?: true
    totalAmount?: true
    paymentMethod?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SaleCountAggregateInputType = {
    id?: true
    customerId?: true
    userId?: true
    saleDate?: true
    totalAmount?: true
    paymentMethod?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SaleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sale to aggregate.
     */
    where?: saleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sales to fetch.
     */
    orderBy?: saleOrderByWithRelationInput | saleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: saleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sales
    **/
    _count?: true | SaleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SaleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SaleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SaleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SaleMaxAggregateInputType
  }

  export type GetSaleAggregateType<T extends SaleAggregateArgs> = {
        [P in keyof T & keyof AggregateSale]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSale[P]>
      : GetScalarType<T[P], AggregateSale[P]>
  }




  export type saleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saleWhereInput
    orderBy?: saleOrderByWithAggregationInput | saleOrderByWithAggregationInput[]
    by: SaleScalarFieldEnum[] | SaleScalarFieldEnum
    having?: saleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SaleCountAggregateInputType | true
    _avg?: SaleAvgAggregateInputType
    _sum?: SaleSumAggregateInputType
    _min?: SaleMinAggregateInputType
    _max?: SaleMaxAggregateInputType
  }

  export type SaleGroupByOutputType = {
    id: number
    customerId: number
    userId: number
    saleDate: Date
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status: $Enums.sale_status
    createdAt: Date
    updatedAt: Date
    _count: SaleCountAggregateOutputType | null
    _avg: SaleAvgAggregateOutputType | null
    _sum: SaleSumAggregateOutputType | null
    _min: SaleMinAggregateOutputType | null
    _max: SaleMaxAggregateOutputType | null
  }

  type GetSaleGroupByPayload<T extends saleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SaleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SaleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SaleGroupByOutputType[P]>
            : GetScalarType<T[P], SaleGroupByOutputType[P]>
        }
      >
    >


  export type saleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    userId?: boolean
    saleDate?: boolean
    totalAmount?: boolean
    paymentMethod?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoice?: boolean | sale$invoiceArgs<ExtArgs>
    customer?: boolean | customerDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
    saleitem?: boolean | sale$saleitemArgs<ExtArgs>
    _count?: boolean | SaleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sale"]>



  export type saleSelectScalar = {
    id?: boolean
    customerId?: boolean
    userId?: boolean
    saleDate?: boolean
    totalAmount?: boolean
    paymentMethod?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type saleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "userId" | "saleDate" | "totalAmount" | "paymentMethod" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["sale"]>
  export type saleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | sale$invoiceArgs<ExtArgs>
    customer?: boolean | customerDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
    saleitem?: boolean | sale$saleitemArgs<ExtArgs>
    _count?: boolean | SaleCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $salePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sale"
    objects: {
      invoice: Prisma.$invoicePayload<ExtArgs> | null
      customer: Prisma.$customerPayload<ExtArgs>
      user: Prisma.$userPayload<ExtArgs>
      saleitem: Prisma.$saleitemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      customerId: number
      userId: number
      saleDate: Date
      totalAmount: number
      paymentMethod: $Enums.sale_paymentMethod
      status: $Enums.sale_status
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sale"]>
    composites: {}
  }

  type saleGetPayload<S extends boolean | null | undefined | saleDefaultArgs> = $Result.GetResult<Prisma.$salePayload, S>

  type saleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<saleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SaleCountAggregateInputType | true
    }

  export interface saleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sale'], meta: { name: 'sale' } }
    /**
     * Find zero or one Sale that matches the filter.
     * @param {saleFindUniqueArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends saleFindUniqueArgs>(args: SelectSubset<T, saleFindUniqueArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sale that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {saleFindUniqueOrThrowArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends saleFindUniqueOrThrowArgs>(args: SelectSubset<T, saleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sale that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleFindFirstArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends saleFindFirstArgs>(args?: SelectSubset<T, saleFindFirstArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sale that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleFindFirstOrThrowArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends saleFindFirstOrThrowArgs>(args?: SelectSubset<T, saleFindFirstOrThrowArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sales that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sales
     * const sales = await prisma.sale.findMany()
     * 
     * // Get first 10 Sales
     * const sales = await prisma.sale.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saleWithIdOnly = await prisma.sale.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends saleFindManyArgs>(args?: SelectSubset<T, saleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sale.
     * @param {saleCreateArgs} args - Arguments to create a Sale.
     * @example
     * // Create one Sale
     * const Sale = await prisma.sale.create({
     *   data: {
     *     // ... data to create a Sale
     *   }
     * })
     * 
     */
    create<T extends saleCreateArgs>(args: SelectSubset<T, saleCreateArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sales.
     * @param {saleCreateManyArgs} args - Arguments to create many Sales.
     * @example
     * // Create many Sales
     * const sale = await prisma.sale.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends saleCreateManyArgs>(args?: SelectSubset<T, saleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Sale.
     * @param {saleDeleteArgs} args - Arguments to delete one Sale.
     * @example
     * // Delete one Sale
     * const Sale = await prisma.sale.delete({
     *   where: {
     *     // ... filter to delete one Sale
     *   }
     * })
     * 
     */
    delete<T extends saleDeleteArgs>(args: SelectSubset<T, saleDeleteArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sale.
     * @param {saleUpdateArgs} args - Arguments to update one Sale.
     * @example
     * // Update one Sale
     * const sale = await prisma.sale.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends saleUpdateArgs>(args: SelectSubset<T, saleUpdateArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sales.
     * @param {saleDeleteManyArgs} args - Arguments to filter Sales to delete.
     * @example
     * // Delete a few Sales
     * const { count } = await prisma.sale.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends saleDeleteManyArgs>(args?: SelectSubset<T, saleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sales
     * const sale = await prisma.sale.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends saleUpdateManyArgs>(args: SelectSubset<T, saleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Sale.
     * @param {saleUpsertArgs} args - Arguments to update or create a Sale.
     * @example
     * // Update or create a Sale
     * const sale = await prisma.sale.upsert({
     *   create: {
     *     // ... data to create a Sale
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sale we want to update
     *   }
     * })
     */
    upsert<T extends saleUpsertArgs>(args: SelectSubset<T, saleUpsertArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleCountArgs} args - Arguments to filter Sales to count.
     * @example
     * // Count the number of Sales
     * const count = await prisma.sale.count({
     *   where: {
     *     // ... the filter for the Sales we want to count
     *   }
     * })
    **/
    count<T extends saleCountArgs>(
      args?: Subset<T, saleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SaleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SaleAggregateArgs>(args: Subset<T, SaleAggregateArgs>): Prisma.PrismaPromise<GetSaleAggregateType<T>>

    /**
     * Group by Sale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends saleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: saleGroupByArgs['orderBy'] }
        : { orderBy?: saleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, saleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sale model
   */
  readonly fields: saleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sale.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__saleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends sale$invoiceArgs<ExtArgs> = {}>(args?: Subset<T, sale$invoiceArgs<ExtArgs>>): Prisma__invoiceClient<$Result.GetResult<Prisma.$invoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    customer<T extends customerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, customerDefaultArgs<ExtArgs>>): Prisma__customerClient<$Result.GetResult<Prisma.$customerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    saleitem<T extends sale$saleitemArgs<ExtArgs> = {}>(args?: Subset<T, sale$saleitemArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the sale model
   */
  interface saleFieldRefs {
    readonly id: FieldRef<"sale", 'Int'>
    readonly customerId: FieldRef<"sale", 'Int'>
    readonly userId: FieldRef<"sale", 'Int'>
    readonly saleDate: FieldRef<"sale", 'DateTime'>
    readonly totalAmount: FieldRef<"sale", 'Float'>
    readonly paymentMethod: FieldRef<"sale", 'sale_paymentMethod'>
    readonly status: FieldRef<"sale", 'sale_status'>
    readonly createdAt: FieldRef<"sale", 'DateTime'>
    readonly updatedAt: FieldRef<"sale", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * sale findUnique
   */
  export type saleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * Filter, which sale to fetch.
     */
    where: saleWhereUniqueInput
  }

  /**
   * sale findUniqueOrThrow
   */
  export type saleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * Filter, which sale to fetch.
     */
    where: saleWhereUniqueInput
  }

  /**
   * sale findFirst
   */
  export type saleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * Filter, which sale to fetch.
     */
    where?: saleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sales to fetch.
     */
    orderBy?: saleOrderByWithRelationInput | saleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sales.
     */
    cursor?: saleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sales.
     */
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * sale findFirstOrThrow
   */
  export type saleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * Filter, which sale to fetch.
     */
    where?: saleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sales to fetch.
     */
    orderBy?: saleOrderByWithRelationInput | saleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sales.
     */
    cursor?: saleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sales.
     */
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * sale findMany
   */
  export type saleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * Filter, which sales to fetch.
     */
    where?: saleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sales to fetch.
     */
    orderBy?: saleOrderByWithRelationInput | saleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sales.
     */
    cursor?: saleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sales.
     */
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * sale create
   */
  export type saleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * The data needed to create a sale.
     */
    data: XOR<saleCreateInput, saleUncheckedCreateInput>
  }

  /**
   * sale createMany
   */
  export type saleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sales.
     */
    data: saleCreateManyInput | saleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sale update
   */
  export type saleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * The data needed to update a sale.
     */
    data: XOR<saleUpdateInput, saleUncheckedUpdateInput>
    /**
     * Choose, which sale to update.
     */
    where: saleWhereUniqueInput
  }

  /**
   * sale updateMany
   */
  export type saleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sales.
     */
    data: XOR<saleUpdateManyMutationInput, saleUncheckedUpdateManyInput>
    /**
     * Filter which sales to update
     */
    where?: saleWhereInput
    /**
     * Limit how many sales to update.
     */
    limit?: number
  }

  /**
   * sale upsert
   */
  export type saleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * The filter to search for the sale to update in case it exists.
     */
    where: saleWhereUniqueInput
    /**
     * In case the sale found by the `where` argument doesn't exist, create a new sale with this data.
     */
    create: XOR<saleCreateInput, saleUncheckedCreateInput>
    /**
     * In case the sale was found with the provided `where` argument, update it with this data.
     */
    update: XOR<saleUpdateInput, saleUncheckedUpdateInput>
  }

  /**
   * sale delete
   */
  export type saleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    /**
     * Filter which sale to delete.
     */
    where: saleWhereUniqueInput
  }

  /**
   * sale deleteMany
   */
  export type saleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sales to delete
     */
    where?: saleWhereInput
    /**
     * Limit how many sales to delete.
     */
    limit?: number
  }

  /**
   * sale.invoice
   */
  export type sale$invoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the invoice
     */
    select?: invoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the invoice
     */
    omit?: invoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: invoiceInclude<ExtArgs> | null
    where?: invoiceWhereInput
  }

  /**
   * sale.saleitem
   */
  export type sale$saleitemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    where?: saleitemWhereInput
    orderBy?: saleitemOrderByWithRelationInput | saleitemOrderByWithRelationInput[]
    cursor?: saleitemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleitemScalarFieldEnum | SaleitemScalarFieldEnum[]
  }

  /**
   * sale without action
   */
  export type saleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
  }


  /**
   * Model saleitem
   */

  export type AggregateSaleitem = {
    _count: SaleitemCountAggregateOutputType | null
    _avg: SaleitemAvgAggregateOutputType | null
    _sum: SaleitemSumAggregateOutputType | null
    _min: SaleitemMinAggregateOutputType | null
    _max: SaleitemMaxAggregateOutputType | null
  }

  export type SaleitemAvgAggregateOutputType = {
    id: number | null
    saleId: number | null
    productId: number | null
    quantity: number | null
    unitPrice: number | null
    subtotal: number | null
  }

  export type SaleitemSumAggregateOutputType = {
    id: number | null
    saleId: number | null
    productId: number | null
    quantity: number | null
    unitPrice: number | null
    subtotal: number | null
  }

  export type SaleitemMinAggregateOutputType = {
    id: number | null
    saleId: number | null
    productId: number | null
    quantity: number | null
    unitPrice: number | null
    subtotal: number | null
  }

  export type SaleitemMaxAggregateOutputType = {
    id: number | null
    saleId: number | null
    productId: number | null
    quantity: number | null
    unitPrice: number | null
    subtotal: number | null
  }

  export type SaleitemCountAggregateOutputType = {
    id: number
    saleId: number
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
    _all: number
  }


  export type SaleitemAvgAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    subtotal?: true
  }

  export type SaleitemSumAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    subtotal?: true
  }

  export type SaleitemMinAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    subtotal?: true
  }

  export type SaleitemMaxAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    subtotal?: true
  }

  export type SaleitemCountAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    subtotal?: true
    _all?: true
  }

  export type SaleitemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which saleitem to aggregate.
     */
    where?: saleitemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of saleitems to fetch.
     */
    orderBy?: saleitemOrderByWithRelationInput | saleitemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: saleitemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` saleitems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` saleitems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned saleitems
    **/
    _count?: true | SaleitemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SaleitemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SaleitemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SaleitemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SaleitemMaxAggregateInputType
  }

  export type GetSaleitemAggregateType<T extends SaleitemAggregateArgs> = {
        [P in keyof T & keyof AggregateSaleitem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSaleitem[P]>
      : GetScalarType<T[P], AggregateSaleitem[P]>
  }




  export type saleitemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: saleitemWhereInput
    orderBy?: saleitemOrderByWithAggregationInput | saleitemOrderByWithAggregationInput[]
    by: SaleitemScalarFieldEnum[] | SaleitemScalarFieldEnum
    having?: saleitemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SaleitemCountAggregateInputType | true
    _avg?: SaleitemAvgAggregateInputType
    _sum?: SaleitemSumAggregateInputType
    _min?: SaleitemMinAggregateInputType
    _max?: SaleitemMaxAggregateInputType
  }

  export type SaleitemGroupByOutputType = {
    id: number
    saleId: number
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
    _count: SaleitemCountAggregateOutputType | null
    _avg: SaleitemAvgAggregateOutputType | null
    _sum: SaleitemSumAggregateOutputType | null
    _min: SaleitemMinAggregateOutputType | null
    _max: SaleitemMaxAggregateOutputType | null
  }

  type GetSaleitemGroupByPayload<T extends saleitemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SaleitemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SaleitemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SaleitemGroupByOutputType[P]>
            : GetScalarType<T[P], SaleitemGroupByOutputType[P]>
        }
      >
    >


  export type saleitemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    subtotal?: boolean
    product?: boolean | productDefaultArgs<ExtArgs>
    sale?: boolean | saleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["saleitem"]>



  export type saleitemSelectScalar = {
    id?: boolean
    saleId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    subtotal?: boolean
  }

  export type saleitemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "saleId" | "productId" | "quantity" | "unitPrice" | "subtotal", ExtArgs["result"]["saleitem"]>
  export type saleitemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | productDefaultArgs<ExtArgs>
    sale?: boolean | saleDefaultArgs<ExtArgs>
  }

  export type $saleitemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "saleitem"
    objects: {
      product: Prisma.$productPayload<ExtArgs>
      sale: Prisma.$salePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      saleId: number
      productId: number
      quantity: number
      unitPrice: number
      subtotal: number
    }, ExtArgs["result"]["saleitem"]>
    composites: {}
  }

  type saleitemGetPayload<S extends boolean | null | undefined | saleitemDefaultArgs> = $Result.GetResult<Prisma.$saleitemPayload, S>

  type saleitemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<saleitemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SaleitemCountAggregateInputType | true
    }

  export interface saleitemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['saleitem'], meta: { name: 'saleitem' } }
    /**
     * Find zero or one Saleitem that matches the filter.
     * @param {saleitemFindUniqueArgs} args - Arguments to find a Saleitem
     * @example
     * // Get one Saleitem
     * const saleitem = await prisma.saleitem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends saleitemFindUniqueArgs>(args: SelectSubset<T, saleitemFindUniqueArgs<ExtArgs>>): Prisma__saleitemClient<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Saleitem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {saleitemFindUniqueOrThrowArgs} args - Arguments to find a Saleitem
     * @example
     * // Get one Saleitem
     * const saleitem = await prisma.saleitem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends saleitemFindUniqueOrThrowArgs>(args: SelectSubset<T, saleitemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__saleitemClient<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Saleitem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleitemFindFirstArgs} args - Arguments to find a Saleitem
     * @example
     * // Get one Saleitem
     * const saleitem = await prisma.saleitem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends saleitemFindFirstArgs>(args?: SelectSubset<T, saleitemFindFirstArgs<ExtArgs>>): Prisma__saleitemClient<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Saleitem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleitemFindFirstOrThrowArgs} args - Arguments to find a Saleitem
     * @example
     * // Get one Saleitem
     * const saleitem = await prisma.saleitem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends saleitemFindFirstOrThrowArgs>(args?: SelectSubset<T, saleitemFindFirstOrThrowArgs<ExtArgs>>): Prisma__saleitemClient<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Saleitems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleitemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Saleitems
     * const saleitems = await prisma.saleitem.findMany()
     * 
     * // Get first 10 Saleitems
     * const saleitems = await prisma.saleitem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saleitemWithIdOnly = await prisma.saleitem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends saleitemFindManyArgs>(args?: SelectSubset<T, saleitemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Saleitem.
     * @param {saleitemCreateArgs} args - Arguments to create a Saleitem.
     * @example
     * // Create one Saleitem
     * const Saleitem = await prisma.saleitem.create({
     *   data: {
     *     // ... data to create a Saleitem
     *   }
     * })
     * 
     */
    create<T extends saleitemCreateArgs>(args: SelectSubset<T, saleitemCreateArgs<ExtArgs>>): Prisma__saleitemClient<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Saleitems.
     * @param {saleitemCreateManyArgs} args - Arguments to create many Saleitems.
     * @example
     * // Create many Saleitems
     * const saleitem = await prisma.saleitem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends saleitemCreateManyArgs>(args?: SelectSubset<T, saleitemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Saleitem.
     * @param {saleitemDeleteArgs} args - Arguments to delete one Saleitem.
     * @example
     * // Delete one Saleitem
     * const Saleitem = await prisma.saleitem.delete({
     *   where: {
     *     // ... filter to delete one Saleitem
     *   }
     * })
     * 
     */
    delete<T extends saleitemDeleteArgs>(args: SelectSubset<T, saleitemDeleteArgs<ExtArgs>>): Prisma__saleitemClient<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Saleitem.
     * @param {saleitemUpdateArgs} args - Arguments to update one Saleitem.
     * @example
     * // Update one Saleitem
     * const saleitem = await prisma.saleitem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends saleitemUpdateArgs>(args: SelectSubset<T, saleitemUpdateArgs<ExtArgs>>): Prisma__saleitemClient<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Saleitems.
     * @param {saleitemDeleteManyArgs} args - Arguments to filter Saleitems to delete.
     * @example
     * // Delete a few Saleitems
     * const { count } = await prisma.saleitem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends saleitemDeleteManyArgs>(args?: SelectSubset<T, saleitemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Saleitems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleitemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Saleitems
     * const saleitem = await prisma.saleitem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends saleitemUpdateManyArgs>(args: SelectSubset<T, saleitemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Saleitem.
     * @param {saleitemUpsertArgs} args - Arguments to update or create a Saleitem.
     * @example
     * // Update or create a Saleitem
     * const saleitem = await prisma.saleitem.upsert({
     *   create: {
     *     // ... data to create a Saleitem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Saleitem we want to update
     *   }
     * })
     */
    upsert<T extends saleitemUpsertArgs>(args: SelectSubset<T, saleitemUpsertArgs<ExtArgs>>): Prisma__saleitemClient<$Result.GetResult<Prisma.$saleitemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Saleitems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleitemCountArgs} args - Arguments to filter Saleitems to count.
     * @example
     * // Count the number of Saleitems
     * const count = await prisma.saleitem.count({
     *   where: {
     *     // ... the filter for the Saleitems we want to count
     *   }
     * })
    **/
    count<T extends saleitemCountArgs>(
      args?: Subset<T, saleitemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SaleitemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Saleitem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleitemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SaleitemAggregateArgs>(args: Subset<T, SaleitemAggregateArgs>): Prisma.PrismaPromise<GetSaleitemAggregateType<T>>

    /**
     * Group by Saleitem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {saleitemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends saleitemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: saleitemGroupByArgs['orderBy'] }
        : { orderBy?: saleitemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, saleitemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleitemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the saleitem model
   */
  readonly fields: saleitemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for saleitem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__saleitemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends productDefaultArgs<ExtArgs> = {}>(args?: Subset<T, productDefaultArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sale<T extends saleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, saleDefaultArgs<ExtArgs>>): Prisma__saleClient<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the saleitem model
   */
  interface saleitemFieldRefs {
    readonly id: FieldRef<"saleitem", 'Int'>
    readonly saleId: FieldRef<"saleitem", 'Int'>
    readonly productId: FieldRef<"saleitem", 'Int'>
    readonly quantity: FieldRef<"saleitem", 'Int'>
    readonly unitPrice: FieldRef<"saleitem", 'Float'>
    readonly subtotal: FieldRef<"saleitem", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * saleitem findUnique
   */
  export type saleitemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * Filter, which saleitem to fetch.
     */
    where: saleitemWhereUniqueInput
  }

  /**
   * saleitem findUniqueOrThrow
   */
  export type saleitemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * Filter, which saleitem to fetch.
     */
    where: saleitemWhereUniqueInput
  }

  /**
   * saleitem findFirst
   */
  export type saleitemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * Filter, which saleitem to fetch.
     */
    where?: saleitemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of saleitems to fetch.
     */
    orderBy?: saleitemOrderByWithRelationInput | saleitemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for saleitems.
     */
    cursor?: saleitemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` saleitems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` saleitems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of saleitems.
     */
    distinct?: SaleitemScalarFieldEnum | SaleitemScalarFieldEnum[]
  }

  /**
   * saleitem findFirstOrThrow
   */
  export type saleitemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * Filter, which saleitem to fetch.
     */
    where?: saleitemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of saleitems to fetch.
     */
    orderBy?: saleitemOrderByWithRelationInput | saleitemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for saleitems.
     */
    cursor?: saleitemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` saleitems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` saleitems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of saleitems.
     */
    distinct?: SaleitemScalarFieldEnum | SaleitemScalarFieldEnum[]
  }

  /**
   * saleitem findMany
   */
  export type saleitemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * Filter, which saleitems to fetch.
     */
    where?: saleitemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of saleitems to fetch.
     */
    orderBy?: saleitemOrderByWithRelationInput | saleitemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing saleitems.
     */
    cursor?: saleitemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` saleitems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` saleitems.
     */
    skip?: number
    distinct?: SaleitemScalarFieldEnum | SaleitemScalarFieldEnum[]
  }

  /**
   * saleitem create
   */
  export type saleitemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * The data needed to create a saleitem.
     */
    data: XOR<saleitemCreateInput, saleitemUncheckedCreateInput>
  }

  /**
   * saleitem createMany
   */
  export type saleitemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many saleitems.
     */
    data: saleitemCreateManyInput | saleitemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * saleitem update
   */
  export type saleitemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * The data needed to update a saleitem.
     */
    data: XOR<saleitemUpdateInput, saleitemUncheckedUpdateInput>
    /**
     * Choose, which saleitem to update.
     */
    where: saleitemWhereUniqueInput
  }

  /**
   * saleitem updateMany
   */
  export type saleitemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update saleitems.
     */
    data: XOR<saleitemUpdateManyMutationInput, saleitemUncheckedUpdateManyInput>
    /**
     * Filter which saleitems to update
     */
    where?: saleitemWhereInput
    /**
     * Limit how many saleitems to update.
     */
    limit?: number
  }

  /**
   * saleitem upsert
   */
  export type saleitemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * The filter to search for the saleitem to update in case it exists.
     */
    where: saleitemWhereUniqueInput
    /**
     * In case the saleitem found by the `where` argument doesn't exist, create a new saleitem with this data.
     */
    create: XOR<saleitemCreateInput, saleitemUncheckedCreateInput>
    /**
     * In case the saleitem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<saleitemUpdateInput, saleitemUncheckedUpdateInput>
  }

  /**
   * saleitem delete
   */
  export type saleitemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
    /**
     * Filter which saleitem to delete.
     */
    where: saleitemWhereUniqueInput
  }

  /**
   * saleitem deleteMany
   */
  export type saleitemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which saleitems to delete
     */
    where?: saleitemWhereInput
    /**
     * Limit how many saleitems to delete.
     */
    limit?: number
  }

  /**
   * saleitem without action
   */
  export type saleitemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the saleitem
     */
    select?: saleitemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the saleitem
     */
    omit?: saleitemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleitemInclude<ExtArgs> | null
  }


  /**
   * Model user
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.user_role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.user_role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user to aggregate.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
    orderBy?: userOrderByWithAggregationInput | userOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    name: string
    email: string
    password: string
    role: $Enums.user_role
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sale?: boolean | user$saleArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type userSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type userInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | user$saleArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user"
    objects: {
      sale: Prisma.$salePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      password: string
      role: $Enums.user_role
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type userGetPayload<S extends boolean | null | undefined | userDefaultArgs> = $Result.GetResult<Prisma.$userPayload, S>

  type userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user'], meta: { name: 'user' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userFindUniqueArgs>(args: SelectSubset<T, userFindUniqueArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userFindUniqueOrThrowArgs>(args: SelectSubset<T, userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userFindFirstArgs>(args?: SelectSubset<T, userFindFirstArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userFindFirstOrThrowArgs>(args?: SelectSubset<T, userFindFirstOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends userFindManyArgs>(args?: SelectSubset<T, userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends userCreateArgs>(args: SelectSubset<T, userCreateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {userCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userCreateManyArgs>(args?: SelectSubset<T, userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends userDeleteArgs>(args: SelectSubset<T, userDeleteArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends userUpdateArgs>(args: SelectSubset<T, userUpdateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userDeleteManyArgs>(args?: SelectSubset<T, userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends userUpdateManyArgs>(args: SelectSubset<T, userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends userUpsertArgs>(args: SelectSubset<T, userUpsertArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userGroupByArgs['orderBy'] }
        : { orderBy?: userGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user model
   */
  readonly fields: userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends user$saleArgs<ExtArgs> = {}>(args?: Subset<T, user$saleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$salePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user model
   */
  interface userFieldRefs {
    readonly id: FieldRef<"user", 'Int'>
    readonly name: FieldRef<"user", 'String'>
    readonly email: FieldRef<"user", 'String'>
    readonly password: FieldRef<"user", 'String'>
    readonly role: FieldRef<"user", 'user_role'>
    readonly createdAt: FieldRef<"user", 'DateTime'>
    readonly updatedAt: FieldRef<"user", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user findUnique
   */
  export type userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findUniqueOrThrow
   */
  export type userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findFirst
   */
  export type userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findFirstOrThrow
   */
  export type userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findMany
   */
  export type userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user create
   */
  export type userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to create a user.
     */
    data: XOR<userCreateInput, userUncheckedCreateInput>
  }

  /**
   * user createMany
   */
  export type userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user update
   */
  export type userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to update a user.
     */
    data: XOR<userUpdateInput, userUncheckedUpdateInput>
    /**
     * Choose, which user to update.
     */
    where: userWhereUniqueInput
  }

  /**
   * user updateMany
   */
  export type userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user upsert
   */
  export type userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The filter to search for the user to update in case it exists.
     */
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
     */
    create: XOR<userCreateInput, userUncheckedCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userUpdateInput, userUncheckedUpdateInput>
  }

  /**
   * user delete
   */
  export type userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter which user to delete.
     */
    where: userWhereUniqueInput
  }

  /**
   * user deleteMany
   */
  export type userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: userWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * user.sale
   */
  export type user$saleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sale
     */
    select?: saleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sale
     */
    omit?: saleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: saleInclude<ExtArgs> | null
    where?: saleWhereInput
    orderBy?: saleOrderByWithRelationInput | saleOrderByWithRelationInput[]
    cursor?: saleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * user without action
   */
  export type userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    cedula: 'cedula',
    email: 'email',
    phone: 'phone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    number: 'number',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    invoiceStatus: 'invoiceStatus'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    purchasePrice: 'purchasePrice',
    sellingPrice: 'sellingPrice',
    stock: 'stock',
    minStock: 'minStock',
    categoryId: 'categoryId',
    providerId: 'providerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ProviderScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProviderScalarFieldEnum = (typeof ProviderScalarFieldEnum)[keyof typeof ProviderScalarFieldEnum]


  export const SaleScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    userId: 'userId',
    saleDate: 'saleDate',
    totalAmount: 'totalAmount',
    paymentMethod: 'paymentMethod',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SaleScalarFieldEnum = (typeof SaleScalarFieldEnum)[keyof typeof SaleScalarFieldEnum]


  export const SaleitemScalarFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    productId: 'productId',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    subtotal: 'subtotal'
  };

  export type SaleitemScalarFieldEnum = (typeof SaleitemScalarFieldEnum)[keyof typeof SaleitemScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const categoryOrderByRelevanceFieldEnum: {
    name: 'name'
  };

  export type categoryOrderByRelevanceFieldEnum = (typeof categoryOrderByRelevanceFieldEnum)[keyof typeof categoryOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const customerOrderByRelevanceFieldEnum: {
    name: 'name',
    cedula: 'cedula',
    email: 'email',
    phone: 'phone'
  };

  export type customerOrderByRelevanceFieldEnum = (typeof customerOrderByRelevanceFieldEnum)[keyof typeof customerOrderByRelevanceFieldEnum]


  export const invoiceOrderByRelevanceFieldEnum: {
    number: 'number'
  };

  export type invoiceOrderByRelevanceFieldEnum = (typeof invoiceOrderByRelevanceFieldEnum)[keyof typeof invoiceOrderByRelevanceFieldEnum]


  export const productOrderByRelevanceFieldEnum: {
    name: 'name',
    description: 'description'
  };

  export type productOrderByRelevanceFieldEnum = (typeof productOrderByRelevanceFieldEnum)[keyof typeof productOrderByRelevanceFieldEnum]


  export const providerOrderByRelevanceFieldEnum: {
    name: 'name'
  };

  export type providerOrderByRelevanceFieldEnum = (typeof providerOrderByRelevanceFieldEnum)[keyof typeof providerOrderByRelevanceFieldEnum]


  export const userOrderByRelevanceFieldEnum: {
    name: 'name',
    email: 'email',
    password: 'password'
  };

  export type userOrderByRelevanceFieldEnum = (typeof userOrderByRelevanceFieldEnum)[keyof typeof userOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'invoice_invoiceStatus'
   */
  export type Enuminvoice_invoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'invoice_invoiceStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'sale_paymentMethod'
   */
  export type Enumsale_paymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'sale_paymentMethod'>
    


  /**
   * Reference to a field of type 'sale_status'
   */
  export type Enumsale_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'sale_status'>
    


  /**
   * Reference to a field of type 'user_role'
   */
  export type Enumuser_roleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'user_role'>
    
  /**
   * Deep Input Types
   */


  export type categoryWhereInput = {
    AND?: categoryWhereInput | categoryWhereInput[]
    OR?: categoryWhereInput[]
    NOT?: categoryWhereInput | categoryWhereInput[]
    id?: IntFilter<"category"> | number
    name?: StringFilter<"category"> | string
    createdAt?: DateTimeFilter<"category"> | Date | string
    updatedAt?: DateTimeFilter<"category"> | Date | string
    product?: ProductListRelationFilter
  }

  export type categoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: productOrderByRelationAggregateInput
    _relevance?: categoryOrderByRelevanceInput
  }

  export type categoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: categoryWhereInput | categoryWhereInput[]
    OR?: categoryWhereInput[]
    NOT?: categoryWhereInput | categoryWhereInput[]
    name?: StringFilter<"category"> | string
    createdAt?: DateTimeFilter<"category"> | Date | string
    updatedAt?: DateTimeFilter<"category"> | Date | string
    product?: ProductListRelationFilter
  }, "id">

  export type categoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: categoryCountOrderByAggregateInput
    _avg?: categoryAvgOrderByAggregateInput
    _max?: categoryMaxOrderByAggregateInput
    _min?: categoryMinOrderByAggregateInput
    _sum?: categorySumOrderByAggregateInput
  }

  export type categoryScalarWhereWithAggregatesInput = {
    AND?: categoryScalarWhereWithAggregatesInput | categoryScalarWhereWithAggregatesInput[]
    OR?: categoryScalarWhereWithAggregatesInput[]
    NOT?: categoryScalarWhereWithAggregatesInput | categoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"category"> | number
    name?: StringWithAggregatesFilter<"category"> | string
    createdAt?: DateTimeWithAggregatesFilter<"category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"category"> | Date | string
  }

  export type customerWhereInput = {
    AND?: customerWhereInput | customerWhereInput[]
    OR?: customerWhereInput[]
    NOT?: customerWhereInput | customerWhereInput[]
    id?: IntFilter<"customer"> | number
    name?: StringFilter<"customer"> | string
    cedula?: StringNullableFilter<"customer"> | string | null
    email?: StringNullableFilter<"customer"> | string | null
    phone?: StringNullableFilter<"customer"> | string | null
    createdAt?: DateTimeFilter<"customer"> | Date | string
    updatedAt?: DateTimeFilter<"customer"> | Date | string
    sale?: SaleListRelationFilter
  }

  export type customerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    cedula?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sale?: saleOrderByRelationAggregateInput
    _relevance?: customerOrderByRelevanceInput
  }

  export type customerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cedula?: string
    AND?: customerWhereInput | customerWhereInput[]
    OR?: customerWhereInput[]
    NOT?: customerWhereInput | customerWhereInput[]
    name?: StringFilter<"customer"> | string
    email?: StringNullableFilter<"customer"> | string | null
    phone?: StringNullableFilter<"customer"> | string | null
    createdAt?: DateTimeFilter<"customer"> | Date | string
    updatedAt?: DateTimeFilter<"customer"> | Date | string
    sale?: SaleListRelationFilter
  }, "id" | "cedula">

  export type customerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    cedula?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: customerCountOrderByAggregateInput
    _avg?: customerAvgOrderByAggregateInput
    _max?: customerMaxOrderByAggregateInput
    _min?: customerMinOrderByAggregateInput
    _sum?: customerSumOrderByAggregateInput
  }

  export type customerScalarWhereWithAggregatesInput = {
    AND?: customerScalarWhereWithAggregatesInput | customerScalarWhereWithAggregatesInput[]
    OR?: customerScalarWhereWithAggregatesInput[]
    NOT?: customerScalarWhereWithAggregatesInput | customerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"customer"> | number
    name?: StringWithAggregatesFilter<"customer"> | string
    cedula?: StringNullableWithAggregatesFilter<"customer"> | string | null
    email?: StringNullableWithAggregatesFilter<"customer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"customer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"customer"> | Date | string
  }

  export type invoiceWhereInput = {
    AND?: invoiceWhereInput | invoiceWhereInput[]
    OR?: invoiceWhereInput[]
    NOT?: invoiceWhereInput | invoiceWhereInput[]
    id?: IntFilter<"invoice"> | number
    saleId?: IntFilter<"invoice"> | number
    number?: StringFilter<"invoice"> | string
    date?: DateTimeFilter<"invoice"> | Date | string
    createdAt?: DateTimeFilter<"invoice"> | Date | string
    updatedAt?: DateTimeFilter<"invoice"> | Date | string
    invoiceStatus?: Enuminvoice_invoiceStatusNullableFilter<"invoice"> | $Enums.invoice_invoiceStatus | null
    sale?: XOR<SaleScalarRelationFilter, saleWhereInput>
  }

  export type invoiceOrderByWithRelationInput = {
    id?: SortOrder
    saleId?: SortOrder
    number?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceStatus?: SortOrderInput | SortOrder
    sale?: saleOrderByWithRelationInput
    _relevance?: invoiceOrderByRelevanceInput
  }

  export type invoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    saleId?: number
    AND?: invoiceWhereInput | invoiceWhereInput[]
    OR?: invoiceWhereInput[]
    NOT?: invoiceWhereInput | invoiceWhereInput[]
    number?: StringFilter<"invoice"> | string
    date?: DateTimeFilter<"invoice"> | Date | string
    createdAt?: DateTimeFilter<"invoice"> | Date | string
    updatedAt?: DateTimeFilter<"invoice"> | Date | string
    invoiceStatus?: Enuminvoice_invoiceStatusNullableFilter<"invoice"> | $Enums.invoice_invoiceStatus | null
    sale?: XOR<SaleScalarRelationFilter, saleWhereInput>
  }, "id" | "saleId">

  export type invoiceOrderByWithAggregationInput = {
    id?: SortOrder
    saleId?: SortOrder
    number?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceStatus?: SortOrderInput | SortOrder
    _count?: invoiceCountOrderByAggregateInput
    _avg?: invoiceAvgOrderByAggregateInput
    _max?: invoiceMaxOrderByAggregateInput
    _min?: invoiceMinOrderByAggregateInput
    _sum?: invoiceSumOrderByAggregateInput
  }

  export type invoiceScalarWhereWithAggregatesInput = {
    AND?: invoiceScalarWhereWithAggregatesInput | invoiceScalarWhereWithAggregatesInput[]
    OR?: invoiceScalarWhereWithAggregatesInput[]
    NOT?: invoiceScalarWhereWithAggregatesInput | invoiceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"invoice"> | number
    saleId?: IntWithAggregatesFilter<"invoice"> | number
    number?: StringWithAggregatesFilter<"invoice"> | string
    date?: DateTimeWithAggregatesFilter<"invoice"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"invoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"invoice"> | Date | string
    invoiceStatus?: Enuminvoice_invoiceStatusNullableWithAggregatesFilter<"invoice"> | $Enums.invoice_invoiceStatus | null
  }

  export type productWhereInput = {
    AND?: productWhereInput | productWhereInput[]
    OR?: productWhereInput[]
    NOT?: productWhereInput | productWhereInput[]
    id?: IntFilter<"product"> | number
    name?: StringFilter<"product"> | string
    description?: StringNullableFilter<"product"> | string | null
    purchasePrice?: FloatFilter<"product"> | number
    sellingPrice?: FloatFilter<"product"> | number
    stock?: IntFilter<"product"> | number
    minStock?: IntFilter<"product"> | number
    categoryId?: IntFilter<"product"> | number
    providerId?: IntFilter<"product"> | number
    createdAt?: DateTimeFilter<"product"> | Date | string
    updatedAt?: DateTimeFilter<"product"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, categoryWhereInput>
    provider?: XOR<ProviderScalarRelationFilter, providerWhereInput>
    saleitem?: SaleitemListRelationFilter
  }

  export type productOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    stock?: SortOrder
    minStock?: SortOrder
    categoryId?: SortOrder
    providerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: categoryOrderByWithRelationInput
    provider?: providerOrderByWithRelationInput
    saleitem?: saleitemOrderByRelationAggregateInput
    _relevance?: productOrderByRelevanceInput
  }

  export type productWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: productWhereInput | productWhereInput[]
    OR?: productWhereInput[]
    NOT?: productWhereInput | productWhereInput[]
    name?: StringFilter<"product"> | string
    description?: StringNullableFilter<"product"> | string | null
    purchasePrice?: FloatFilter<"product"> | number
    sellingPrice?: FloatFilter<"product"> | number
    stock?: IntFilter<"product"> | number
    minStock?: IntFilter<"product"> | number
    categoryId?: IntFilter<"product"> | number
    providerId?: IntFilter<"product"> | number
    createdAt?: DateTimeFilter<"product"> | Date | string
    updatedAt?: DateTimeFilter<"product"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, categoryWhereInput>
    provider?: XOR<ProviderScalarRelationFilter, providerWhereInput>
    saleitem?: SaleitemListRelationFilter
  }, "id">

  export type productOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    stock?: SortOrder
    minStock?: SortOrder
    categoryId?: SortOrder
    providerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: productCountOrderByAggregateInput
    _avg?: productAvgOrderByAggregateInput
    _max?: productMaxOrderByAggregateInput
    _min?: productMinOrderByAggregateInput
    _sum?: productSumOrderByAggregateInput
  }

  export type productScalarWhereWithAggregatesInput = {
    AND?: productScalarWhereWithAggregatesInput | productScalarWhereWithAggregatesInput[]
    OR?: productScalarWhereWithAggregatesInput[]
    NOT?: productScalarWhereWithAggregatesInput | productScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"product"> | number
    name?: StringWithAggregatesFilter<"product"> | string
    description?: StringNullableWithAggregatesFilter<"product"> | string | null
    purchasePrice?: FloatWithAggregatesFilter<"product"> | number
    sellingPrice?: FloatWithAggregatesFilter<"product"> | number
    stock?: IntWithAggregatesFilter<"product"> | number
    minStock?: IntWithAggregatesFilter<"product"> | number
    categoryId?: IntWithAggregatesFilter<"product"> | number
    providerId?: IntWithAggregatesFilter<"product"> | number
    createdAt?: DateTimeWithAggregatesFilter<"product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"product"> | Date | string
  }

  export type providerWhereInput = {
    AND?: providerWhereInput | providerWhereInput[]
    OR?: providerWhereInput[]
    NOT?: providerWhereInput | providerWhereInput[]
    id?: IntFilter<"provider"> | number
    name?: StringFilter<"provider"> | string
    createdAt?: DateTimeFilter<"provider"> | Date | string
    updatedAt?: DateTimeFilter<"provider"> | Date | string
    product?: ProductListRelationFilter
  }

  export type providerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: productOrderByRelationAggregateInput
    _relevance?: providerOrderByRelevanceInput
  }

  export type providerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: providerWhereInput | providerWhereInput[]
    OR?: providerWhereInput[]
    NOT?: providerWhereInput | providerWhereInput[]
    name?: StringFilter<"provider"> | string
    createdAt?: DateTimeFilter<"provider"> | Date | string
    updatedAt?: DateTimeFilter<"provider"> | Date | string
    product?: ProductListRelationFilter
  }, "id">

  export type providerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: providerCountOrderByAggregateInput
    _avg?: providerAvgOrderByAggregateInput
    _max?: providerMaxOrderByAggregateInput
    _min?: providerMinOrderByAggregateInput
    _sum?: providerSumOrderByAggregateInput
  }

  export type providerScalarWhereWithAggregatesInput = {
    AND?: providerScalarWhereWithAggregatesInput | providerScalarWhereWithAggregatesInput[]
    OR?: providerScalarWhereWithAggregatesInput[]
    NOT?: providerScalarWhereWithAggregatesInput | providerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"provider"> | number
    name?: StringWithAggregatesFilter<"provider"> | string
    createdAt?: DateTimeWithAggregatesFilter<"provider"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"provider"> | Date | string
  }

  export type saleWhereInput = {
    AND?: saleWhereInput | saleWhereInput[]
    OR?: saleWhereInput[]
    NOT?: saleWhereInput | saleWhereInput[]
    id?: IntFilter<"sale"> | number
    customerId?: IntFilter<"sale"> | number
    userId?: IntFilter<"sale"> | number
    saleDate?: DateTimeFilter<"sale"> | Date | string
    totalAmount?: FloatFilter<"sale"> | number
    paymentMethod?: Enumsale_paymentMethodFilter<"sale"> | $Enums.sale_paymentMethod
    status?: Enumsale_statusFilter<"sale"> | $Enums.sale_status
    createdAt?: DateTimeFilter<"sale"> | Date | string
    updatedAt?: DateTimeFilter<"sale"> | Date | string
    invoice?: XOR<InvoiceNullableScalarRelationFilter, invoiceWhereInput> | null
    customer?: XOR<CustomerScalarRelationFilter, customerWhereInput>
    user?: XOR<UserScalarRelationFilter, userWhereInput>
    saleitem?: SaleitemListRelationFilter
  }

  export type saleOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    userId?: SortOrder
    saleDate?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoice?: invoiceOrderByWithRelationInput
    customer?: customerOrderByWithRelationInput
    user?: userOrderByWithRelationInput
    saleitem?: saleitemOrderByRelationAggregateInput
  }

  export type saleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: saleWhereInput | saleWhereInput[]
    OR?: saleWhereInput[]
    NOT?: saleWhereInput | saleWhereInput[]
    customerId?: IntFilter<"sale"> | number
    userId?: IntFilter<"sale"> | number
    saleDate?: DateTimeFilter<"sale"> | Date | string
    totalAmount?: FloatFilter<"sale"> | number
    paymentMethod?: Enumsale_paymentMethodFilter<"sale"> | $Enums.sale_paymentMethod
    status?: Enumsale_statusFilter<"sale"> | $Enums.sale_status
    createdAt?: DateTimeFilter<"sale"> | Date | string
    updatedAt?: DateTimeFilter<"sale"> | Date | string
    invoice?: XOR<InvoiceNullableScalarRelationFilter, invoiceWhereInput> | null
    customer?: XOR<CustomerScalarRelationFilter, customerWhereInput>
    user?: XOR<UserScalarRelationFilter, userWhereInput>
    saleitem?: SaleitemListRelationFilter
  }, "id">

  export type saleOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    userId?: SortOrder
    saleDate?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: saleCountOrderByAggregateInput
    _avg?: saleAvgOrderByAggregateInput
    _max?: saleMaxOrderByAggregateInput
    _min?: saleMinOrderByAggregateInput
    _sum?: saleSumOrderByAggregateInput
  }

  export type saleScalarWhereWithAggregatesInput = {
    AND?: saleScalarWhereWithAggregatesInput | saleScalarWhereWithAggregatesInput[]
    OR?: saleScalarWhereWithAggregatesInput[]
    NOT?: saleScalarWhereWithAggregatesInput | saleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"sale"> | number
    customerId?: IntWithAggregatesFilter<"sale"> | number
    userId?: IntWithAggregatesFilter<"sale"> | number
    saleDate?: DateTimeWithAggregatesFilter<"sale"> | Date | string
    totalAmount?: FloatWithAggregatesFilter<"sale"> | number
    paymentMethod?: Enumsale_paymentMethodWithAggregatesFilter<"sale"> | $Enums.sale_paymentMethod
    status?: Enumsale_statusWithAggregatesFilter<"sale"> | $Enums.sale_status
    createdAt?: DateTimeWithAggregatesFilter<"sale"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"sale"> | Date | string
  }

  export type saleitemWhereInput = {
    AND?: saleitemWhereInput | saleitemWhereInput[]
    OR?: saleitemWhereInput[]
    NOT?: saleitemWhereInput | saleitemWhereInput[]
    id?: IntFilter<"saleitem"> | number
    saleId?: IntFilter<"saleitem"> | number
    productId?: IntFilter<"saleitem"> | number
    quantity?: IntFilter<"saleitem"> | number
    unitPrice?: FloatFilter<"saleitem"> | number
    subtotal?: FloatFilter<"saleitem"> | number
    product?: XOR<ProductScalarRelationFilter, productWhereInput>
    sale?: XOR<SaleScalarRelationFilter, saleWhereInput>
  }

  export type saleitemOrderByWithRelationInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
    product?: productOrderByWithRelationInput
    sale?: saleOrderByWithRelationInput
  }

  export type saleitemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: saleitemWhereInput | saleitemWhereInput[]
    OR?: saleitemWhereInput[]
    NOT?: saleitemWhereInput | saleitemWhereInput[]
    saleId?: IntFilter<"saleitem"> | number
    productId?: IntFilter<"saleitem"> | number
    quantity?: IntFilter<"saleitem"> | number
    unitPrice?: FloatFilter<"saleitem"> | number
    subtotal?: FloatFilter<"saleitem"> | number
    product?: XOR<ProductScalarRelationFilter, productWhereInput>
    sale?: XOR<SaleScalarRelationFilter, saleWhereInput>
  }, "id">

  export type saleitemOrderByWithAggregationInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
    _count?: saleitemCountOrderByAggregateInput
    _avg?: saleitemAvgOrderByAggregateInput
    _max?: saleitemMaxOrderByAggregateInput
    _min?: saleitemMinOrderByAggregateInput
    _sum?: saleitemSumOrderByAggregateInput
  }

  export type saleitemScalarWhereWithAggregatesInput = {
    AND?: saleitemScalarWhereWithAggregatesInput | saleitemScalarWhereWithAggregatesInput[]
    OR?: saleitemScalarWhereWithAggregatesInput[]
    NOT?: saleitemScalarWhereWithAggregatesInput | saleitemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"saleitem"> | number
    saleId?: IntWithAggregatesFilter<"saleitem"> | number
    productId?: IntWithAggregatesFilter<"saleitem"> | number
    quantity?: IntWithAggregatesFilter<"saleitem"> | number
    unitPrice?: FloatWithAggregatesFilter<"saleitem"> | number
    subtotal?: FloatWithAggregatesFilter<"saleitem"> | number
  }

  export type userWhereInput = {
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    id?: IntFilter<"user"> | number
    name?: StringFilter<"user"> | string
    email?: StringFilter<"user"> | string
    password?: StringFilter<"user"> | string
    role?: Enumuser_roleFilter<"user"> | $Enums.user_role
    createdAt?: DateTimeFilter<"user"> | Date | string
    updatedAt?: DateTimeFilter<"user"> | Date | string
    sale?: SaleListRelationFilter
  }

  export type userOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sale?: saleOrderByRelationAggregateInput
    _relevance?: userOrderByRelevanceInput
  }

  export type userWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    name?: StringFilter<"user"> | string
    password?: StringFilter<"user"> | string
    role?: Enumuser_roleFilter<"user"> | $Enums.user_role
    createdAt?: DateTimeFilter<"user"> | Date | string
    updatedAt?: DateTimeFilter<"user"> | Date | string
    sale?: SaleListRelationFilter
  }, "id" | "email">

  export type userOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: userCountOrderByAggregateInput
    _avg?: userAvgOrderByAggregateInput
    _max?: userMaxOrderByAggregateInput
    _min?: userMinOrderByAggregateInput
    _sum?: userSumOrderByAggregateInput
  }

  export type userScalarWhereWithAggregatesInput = {
    AND?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    OR?: userScalarWhereWithAggregatesInput[]
    NOT?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"user"> | number
    name?: StringWithAggregatesFilter<"user"> | string
    email?: StringWithAggregatesFilter<"user"> | string
    password?: StringWithAggregatesFilter<"user"> | string
    role?: Enumuser_roleWithAggregatesFilter<"user"> | $Enums.user_role
    createdAt?: DateTimeWithAggregatesFilter<"user"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"user"> | Date | string
  }

  export type categoryCreateInput = {
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
    product?: productCreateNestedManyWithoutCategoryInput
  }

  export type categoryUncheckedCreateInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
    product?: productUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type categoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: productUpdateManyWithoutCategoryNestedInput
  }

  export type categoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: productUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type categoryCreateManyInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type categoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type categoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type customerCreateInput = {
    name: string
    cedula?: string | null
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    sale?: saleCreateNestedManyWithoutCustomerInput
  }

  export type customerUncheckedCreateInput = {
    id?: number
    name: string
    cedula?: string | null
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    sale?: saleUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type customerUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    cedula?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sale?: saleUpdateManyWithoutCustomerNestedInput
  }

  export type customerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    cedula?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sale?: saleUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type customerCreateManyInput = {
    id?: number
    name: string
    cedula?: string | null
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type customerUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    cedula?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type customerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    cedula?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type invoiceCreateInput = {
    number: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt: Date | string
    invoiceStatus?: $Enums.invoice_invoiceStatus | null
    sale: saleCreateNestedOneWithoutInvoiceInput
  }

  export type invoiceUncheckedCreateInput = {
    id?: number
    saleId: number
    number: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt: Date | string
    invoiceStatus?: $Enums.invoice_invoiceStatus | null
  }

  export type invoiceUpdateInput = {
    number?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceStatus?: NullableEnuminvoice_invoiceStatusFieldUpdateOperationsInput | $Enums.invoice_invoiceStatus | null
    sale?: saleUpdateOneRequiredWithoutInvoiceNestedInput
  }

  export type invoiceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    number?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceStatus?: NullableEnuminvoice_invoiceStatusFieldUpdateOperationsInput | $Enums.invoice_invoiceStatus | null
  }

  export type invoiceCreateManyInput = {
    id?: number
    saleId: number
    number: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt: Date | string
    invoiceStatus?: $Enums.invoice_invoiceStatus | null
  }

  export type invoiceUpdateManyMutationInput = {
    number?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceStatus?: NullableEnuminvoice_invoiceStatusFieldUpdateOperationsInput | $Enums.invoice_invoiceStatus | null
  }

  export type invoiceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    number?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceStatus?: NullableEnuminvoice_invoiceStatusFieldUpdateOperationsInput | $Enums.invoice_invoiceStatus | null
  }

  export type productCreateInput = {
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    createdAt?: Date | string
    updatedAt: Date | string
    category: categoryCreateNestedOneWithoutProductInput
    provider: providerCreateNestedOneWithoutProductInput
    saleitem?: saleitemCreateNestedManyWithoutProductInput
  }

  export type productUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    categoryId: number
    providerId: number
    createdAt?: Date | string
    updatedAt: Date | string
    saleitem?: saleitemUncheckedCreateNestedManyWithoutProductInput
  }

  export type productUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: categoryUpdateOneRequiredWithoutProductNestedInput
    provider?: providerUpdateOneRequiredWithoutProductNestedInput
    saleitem?: saleitemUpdateManyWithoutProductNestedInput
  }

  export type productUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    providerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleitem?: saleitemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type productCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    categoryId: number
    providerId: number
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type productUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type productUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    providerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type providerCreateInput = {
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
    product?: productCreateNestedManyWithoutProviderInput
  }

  export type providerUncheckedCreateInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
    product?: productUncheckedCreateNestedManyWithoutProviderInput
  }

  export type providerUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: productUpdateManyWithoutProviderNestedInput
  }

  export type providerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: productUncheckedUpdateManyWithoutProviderNestedInput
  }

  export type providerCreateManyInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type providerUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type providerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleCreateInput = {
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    invoice?: invoiceCreateNestedOneWithoutSaleInput
    customer: customerCreateNestedOneWithoutSaleInput
    user: userCreateNestedOneWithoutSaleInput
    saleitem?: saleitemCreateNestedManyWithoutSaleInput
  }

  export type saleUncheckedCreateInput = {
    id?: number
    customerId: number
    userId: number
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    invoice?: invoiceUncheckedCreateNestedOneWithoutSaleInput
    saleitem?: saleitemUncheckedCreateNestedManyWithoutSaleInput
  }

  export type saleUpdateInput = {
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: invoiceUpdateOneWithoutSaleNestedInput
    customer?: customerUpdateOneRequiredWithoutSaleNestedInput
    user?: userUpdateOneRequiredWithoutSaleNestedInput
    saleitem?: saleitemUpdateManyWithoutSaleNestedInput
  }

  export type saleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: invoiceUncheckedUpdateOneWithoutSaleNestedInput
    saleitem?: saleitemUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type saleCreateManyInput = {
    id?: number
    customerId: number
    userId: number
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type saleUpdateManyMutationInput = {
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleitemCreateInput = {
    quantity: number
    unitPrice: number
    subtotal: number
    product: productCreateNestedOneWithoutSaleitemInput
    sale: saleCreateNestedOneWithoutSaleitemInput
  }

  export type saleitemUncheckedCreateInput = {
    id?: number
    saleId: number
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
  }

  export type saleitemUpdateInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    product?: productUpdateOneRequiredWithoutSaleitemNestedInput
    sale?: saleUpdateOneRequiredWithoutSaleitemNestedInput
  }

  export type saleitemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type saleitemCreateManyInput = {
    id?: number
    saleId: number
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
  }

  export type saleitemUpdateManyMutationInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type saleitemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type userCreateInput = {
    name: string
    email: string
    password: string
    role?: $Enums.user_role
    createdAt?: Date | string
    updatedAt: Date | string
    sale?: saleCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.user_role
    createdAt?: Date | string
    updatedAt: Date | string
    sale?: saleUncheckedCreateNestedManyWithoutUserInput
  }

  export type userUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sale?: saleUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sale?: saleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type userCreateManyInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.user_role
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type userUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProductListRelationFilter = {
    every?: productWhereInput
    some?: productWhereInput
    none?: productWhereInput
  }

  export type productOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type categoryOrderByRelevanceInput = {
    fields: categoryOrderByRelevanceFieldEnum | categoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type categoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type categoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type categoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type categoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type categorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SaleListRelationFilter = {
    every?: saleWhereInput
    some?: saleWhereInput
    none?: saleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type saleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type customerOrderByRelevanceInput = {
    fields: customerOrderByRelevanceFieldEnum | customerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type customerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cedula?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type customerAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type customerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cedula?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type customerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cedula?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type customerSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type Enuminvoice_invoiceStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.invoice_invoiceStatus | Enuminvoice_invoiceStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.invoice_invoiceStatus[] | null
    notIn?: $Enums.invoice_invoiceStatus[] | null
    not?: NestedEnuminvoice_invoiceStatusNullableFilter<$PrismaModel> | $Enums.invoice_invoiceStatus | null
  }

  export type SaleScalarRelationFilter = {
    is?: saleWhereInput
    isNot?: saleWhereInput
  }

  export type invoiceOrderByRelevanceInput = {
    fields: invoiceOrderByRelevanceFieldEnum | invoiceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type invoiceCountOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    number?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceStatus?: SortOrder
  }

  export type invoiceAvgOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
  }

  export type invoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    number?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceStatus?: SortOrder
  }

  export type invoiceMinOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    number?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceStatus?: SortOrder
  }

  export type invoiceSumOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
  }

  export type Enuminvoice_invoiceStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.invoice_invoiceStatus | Enuminvoice_invoiceStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.invoice_invoiceStatus[] | null
    notIn?: $Enums.invoice_invoiceStatus[] | null
    not?: NestedEnuminvoice_invoiceStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.invoice_invoiceStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnuminvoice_invoiceStatusNullableFilter<$PrismaModel>
    _max?: NestedEnuminvoice_invoiceStatusNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CategoryScalarRelationFilter = {
    is?: categoryWhereInput
    isNot?: categoryWhereInput
  }

  export type ProviderScalarRelationFilter = {
    is?: providerWhereInput
    isNot?: providerWhereInput
  }

  export type SaleitemListRelationFilter = {
    every?: saleitemWhereInput
    some?: saleitemWhereInput
    none?: saleitemWhereInput
  }

  export type saleitemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type productOrderByRelevanceInput = {
    fields: productOrderByRelevanceFieldEnum | productOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type productCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    stock?: SortOrder
    minStock?: SortOrder
    categoryId?: SortOrder
    providerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type productAvgOrderByAggregateInput = {
    id?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    stock?: SortOrder
    minStock?: SortOrder
    categoryId?: SortOrder
    providerId?: SortOrder
  }

  export type productMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    stock?: SortOrder
    minStock?: SortOrder
    categoryId?: SortOrder
    providerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type productMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    stock?: SortOrder
    minStock?: SortOrder
    categoryId?: SortOrder
    providerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type productSumOrderByAggregateInput = {
    id?: SortOrder
    purchasePrice?: SortOrder
    sellingPrice?: SortOrder
    stock?: SortOrder
    minStock?: SortOrder
    categoryId?: SortOrder
    providerId?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type providerOrderByRelevanceInput = {
    fields: providerOrderByRelevanceFieldEnum | providerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type providerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type providerAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type providerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type providerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type providerSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Enumsale_paymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.sale_paymentMethod | Enumsale_paymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.sale_paymentMethod[]
    notIn?: $Enums.sale_paymentMethod[]
    not?: NestedEnumsale_paymentMethodFilter<$PrismaModel> | $Enums.sale_paymentMethod
  }

  export type Enumsale_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.sale_status | Enumsale_statusFieldRefInput<$PrismaModel>
    in?: $Enums.sale_status[]
    notIn?: $Enums.sale_status[]
    not?: NestedEnumsale_statusFilter<$PrismaModel> | $Enums.sale_status
  }

  export type InvoiceNullableScalarRelationFilter = {
    is?: invoiceWhereInput | null
    isNot?: invoiceWhereInput | null
  }

  export type CustomerScalarRelationFilter = {
    is?: customerWhereInput
    isNot?: customerWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: userWhereInput
    isNot?: userWhereInput
  }

  export type saleCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    userId?: SortOrder
    saleDate?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type saleAvgOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    userId?: SortOrder
    totalAmount?: SortOrder
  }

  export type saleMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    userId?: SortOrder
    saleDate?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type saleMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    userId?: SortOrder
    saleDate?: SortOrder
    totalAmount?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type saleSumOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    userId?: SortOrder
    totalAmount?: SortOrder
  }

  export type Enumsale_paymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sale_paymentMethod | Enumsale_paymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.sale_paymentMethod[]
    notIn?: $Enums.sale_paymentMethod[]
    not?: NestedEnumsale_paymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.sale_paymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsale_paymentMethodFilter<$PrismaModel>
    _max?: NestedEnumsale_paymentMethodFilter<$PrismaModel>
  }

  export type Enumsale_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sale_status | Enumsale_statusFieldRefInput<$PrismaModel>
    in?: $Enums.sale_status[]
    notIn?: $Enums.sale_status[]
    not?: NestedEnumsale_statusWithAggregatesFilter<$PrismaModel> | $Enums.sale_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsale_statusFilter<$PrismaModel>
    _max?: NestedEnumsale_statusFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: productWhereInput
    isNot?: productWhereInput
  }

  export type saleitemCountOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type saleitemAvgOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type saleitemMaxOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type saleitemMinOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type saleitemSumOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type Enumuser_roleFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[]
    notIn?: $Enums.user_role[]
    not?: NestedEnumuser_roleFilter<$PrismaModel> | $Enums.user_role
  }

  export type userOrderByRelevanceInput = {
    fields: userOrderByRelevanceFieldEnum | userOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type userCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type userAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type userMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type userMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type userSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Enumuser_roleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[]
    notIn?: $Enums.user_role[]
    not?: NestedEnumuser_roleWithAggregatesFilter<$PrismaModel> | $Enums.user_role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_roleFilter<$PrismaModel>
    _max?: NestedEnumuser_roleFilter<$PrismaModel>
  }

  export type productCreateNestedManyWithoutCategoryInput = {
    create?: XOR<productCreateWithoutCategoryInput, productUncheckedCreateWithoutCategoryInput> | productCreateWithoutCategoryInput[] | productUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: productCreateOrConnectWithoutCategoryInput | productCreateOrConnectWithoutCategoryInput[]
    createMany?: productCreateManyCategoryInputEnvelope
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
  }

  export type productUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<productCreateWithoutCategoryInput, productUncheckedCreateWithoutCategoryInput> | productCreateWithoutCategoryInput[] | productUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: productCreateOrConnectWithoutCategoryInput | productCreateOrConnectWithoutCategoryInput[]
    createMany?: productCreateManyCategoryInputEnvelope
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type productUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<productCreateWithoutCategoryInput, productUncheckedCreateWithoutCategoryInput> | productCreateWithoutCategoryInput[] | productUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: productCreateOrConnectWithoutCategoryInput | productCreateOrConnectWithoutCategoryInput[]
    upsert?: productUpsertWithWhereUniqueWithoutCategoryInput | productUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: productCreateManyCategoryInputEnvelope
    set?: productWhereUniqueInput | productWhereUniqueInput[]
    disconnect?: productWhereUniqueInput | productWhereUniqueInput[]
    delete?: productWhereUniqueInput | productWhereUniqueInput[]
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
    update?: productUpdateWithWhereUniqueWithoutCategoryInput | productUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: productUpdateManyWithWhereWithoutCategoryInput | productUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: productScalarWhereInput | productScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type productUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<productCreateWithoutCategoryInput, productUncheckedCreateWithoutCategoryInput> | productCreateWithoutCategoryInput[] | productUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: productCreateOrConnectWithoutCategoryInput | productCreateOrConnectWithoutCategoryInput[]
    upsert?: productUpsertWithWhereUniqueWithoutCategoryInput | productUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: productCreateManyCategoryInputEnvelope
    set?: productWhereUniqueInput | productWhereUniqueInput[]
    disconnect?: productWhereUniqueInput | productWhereUniqueInput[]
    delete?: productWhereUniqueInput | productWhereUniqueInput[]
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
    update?: productUpdateWithWhereUniqueWithoutCategoryInput | productUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: productUpdateManyWithWhereWithoutCategoryInput | productUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: productScalarWhereInput | productScalarWhereInput[]
  }

  export type saleCreateNestedManyWithoutCustomerInput = {
    create?: XOR<saleCreateWithoutCustomerInput, saleUncheckedCreateWithoutCustomerInput> | saleCreateWithoutCustomerInput[] | saleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: saleCreateOrConnectWithoutCustomerInput | saleCreateOrConnectWithoutCustomerInput[]
    createMany?: saleCreateManyCustomerInputEnvelope
    connect?: saleWhereUniqueInput | saleWhereUniqueInput[]
  }

  export type saleUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<saleCreateWithoutCustomerInput, saleUncheckedCreateWithoutCustomerInput> | saleCreateWithoutCustomerInput[] | saleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: saleCreateOrConnectWithoutCustomerInput | saleCreateOrConnectWithoutCustomerInput[]
    createMany?: saleCreateManyCustomerInputEnvelope
    connect?: saleWhereUniqueInput | saleWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type saleUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<saleCreateWithoutCustomerInput, saleUncheckedCreateWithoutCustomerInput> | saleCreateWithoutCustomerInput[] | saleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: saleCreateOrConnectWithoutCustomerInput | saleCreateOrConnectWithoutCustomerInput[]
    upsert?: saleUpsertWithWhereUniqueWithoutCustomerInput | saleUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: saleCreateManyCustomerInputEnvelope
    set?: saleWhereUniqueInput | saleWhereUniqueInput[]
    disconnect?: saleWhereUniqueInput | saleWhereUniqueInput[]
    delete?: saleWhereUniqueInput | saleWhereUniqueInput[]
    connect?: saleWhereUniqueInput | saleWhereUniqueInput[]
    update?: saleUpdateWithWhereUniqueWithoutCustomerInput | saleUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: saleUpdateManyWithWhereWithoutCustomerInput | saleUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: saleScalarWhereInput | saleScalarWhereInput[]
  }

  export type saleUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<saleCreateWithoutCustomerInput, saleUncheckedCreateWithoutCustomerInput> | saleCreateWithoutCustomerInput[] | saleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: saleCreateOrConnectWithoutCustomerInput | saleCreateOrConnectWithoutCustomerInput[]
    upsert?: saleUpsertWithWhereUniqueWithoutCustomerInput | saleUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: saleCreateManyCustomerInputEnvelope
    set?: saleWhereUniqueInput | saleWhereUniqueInput[]
    disconnect?: saleWhereUniqueInput | saleWhereUniqueInput[]
    delete?: saleWhereUniqueInput | saleWhereUniqueInput[]
    connect?: saleWhereUniqueInput | saleWhereUniqueInput[]
    update?: saleUpdateWithWhereUniqueWithoutCustomerInput | saleUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: saleUpdateManyWithWhereWithoutCustomerInput | saleUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: saleScalarWhereInput | saleScalarWhereInput[]
  }

  export type saleCreateNestedOneWithoutInvoiceInput = {
    create?: XOR<saleCreateWithoutInvoiceInput, saleUncheckedCreateWithoutInvoiceInput>
    connectOrCreate?: saleCreateOrConnectWithoutInvoiceInput
    connect?: saleWhereUniqueInput
  }

  export type NullableEnuminvoice_invoiceStatusFieldUpdateOperationsInput = {
    set?: $Enums.invoice_invoiceStatus | null
  }

  export type saleUpdateOneRequiredWithoutInvoiceNestedInput = {
    create?: XOR<saleCreateWithoutInvoiceInput, saleUncheckedCreateWithoutInvoiceInput>
    connectOrCreate?: saleCreateOrConnectWithoutInvoiceInput
    upsert?: saleUpsertWithoutInvoiceInput
    connect?: saleWhereUniqueInput
    update?: XOR<XOR<saleUpdateToOneWithWhereWithoutInvoiceInput, saleUpdateWithoutInvoiceInput>, saleUncheckedUpdateWithoutInvoiceInput>
  }

  export type categoryCreateNestedOneWithoutProductInput = {
    create?: XOR<categoryCreateWithoutProductInput, categoryUncheckedCreateWithoutProductInput>
    connectOrCreate?: categoryCreateOrConnectWithoutProductInput
    connect?: categoryWhereUniqueInput
  }

  export type providerCreateNestedOneWithoutProductInput = {
    create?: XOR<providerCreateWithoutProductInput, providerUncheckedCreateWithoutProductInput>
    connectOrCreate?: providerCreateOrConnectWithoutProductInput
    connect?: providerWhereUniqueInput
  }

  export type saleitemCreateNestedManyWithoutProductInput = {
    create?: XOR<saleitemCreateWithoutProductInput, saleitemUncheckedCreateWithoutProductInput> | saleitemCreateWithoutProductInput[] | saleitemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: saleitemCreateOrConnectWithoutProductInput | saleitemCreateOrConnectWithoutProductInput[]
    createMany?: saleitemCreateManyProductInputEnvelope
    connect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
  }

  export type saleitemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<saleitemCreateWithoutProductInput, saleitemUncheckedCreateWithoutProductInput> | saleitemCreateWithoutProductInput[] | saleitemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: saleitemCreateOrConnectWithoutProductInput | saleitemCreateOrConnectWithoutProductInput[]
    createMany?: saleitemCreateManyProductInputEnvelope
    connect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type categoryUpdateOneRequiredWithoutProductNestedInput = {
    create?: XOR<categoryCreateWithoutProductInput, categoryUncheckedCreateWithoutProductInput>
    connectOrCreate?: categoryCreateOrConnectWithoutProductInput
    upsert?: categoryUpsertWithoutProductInput
    connect?: categoryWhereUniqueInput
    update?: XOR<XOR<categoryUpdateToOneWithWhereWithoutProductInput, categoryUpdateWithoutProductInput>, categoryUncheckedUpdateWithoutProductInput>
  }

  export type providerUpdateOneRequiredWithoutProductNestedInput = {
    create?: XOR<providerCreateWithoutProductInput, providerUncheckedCreateWithoutProductInput>
    connectOrCreate?: providerCreateOrConnectWithoutProductInput
    upsert?: providerUpsertWithoutProductInput
    connect?: providerWhereUniqueInput
    update?: XOR<XOR<providerUpdateToOneWithWhereWithoutProductInput, providerUpdateWithoutProductInput>, providerUncheckedUpdateWithoutProductInput>
  }

  export type saleitemUpdateManyWithoutProductNestedInput = {
    create?: XOR<saleitemCreateWithoutProductInput, saleitemUncheckedCreateWithoutProductInput> | saleitemCreateWithoutProductInput[] | saleitemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: saleitemCreateOrConnectWithoutProductInput | saleitemCreateOrConnectWithoutProductInput[]
    upsert?: saleitemUpsertWithWhereUniqueWithoutProductInput | saleitemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: saleitemCreateManyProductInputEnvelope
    set?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    disconnect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    delete?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    connect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    update?: saleitemUpdateWithWhereUniqueWithoutProductInput | saleitemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: saleitemUpdateManyWithWhereWithoutProductInput | saleitemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: saleitemScalarWhereInput | saleitemScalarWhereInput[]
  }

  export type saleitemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<saleitemCreateWithoutProductInput, saleitemUncheckedCreateWithoutProductInput> | saleitemCreateWithoutProductInput[] | saleitemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: saleitemCreateOrConnectWithoutProductInput | saleitemCreateOrConnectWithoutProductInput[]
    upsert?: saleitemUpsertWithWhereUniqueWithoutProductInput | saleitemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: saleitemCreateManyProductInputEnvelope
    set?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    disconnect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    delete?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    connect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    update?: saleitemUpdateWithWhereUniqueWithoutProductInput | saleitemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: saleitemUpdateManyWithWhereWithoutProductInput | saleitemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: saleitemScalarWhereInput | saleitemScalarWhereInput[]
  }

  export type productCreateNestedManyWithoutProviderInput = {
    create?: XOR<productCreateWithoutProviderInput, productUncheckedCreateWithoutProviderInput> | productCreateWithoutProviderInput[] | productUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: productCreateOrConnectWithoutProviderInput | productCreateOrConnectWithoutProviderInput[]
    createMany?: productCreateManyProviderInputEnvelope
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
  }

  export type productUncheckedCreateNestedManyWithoutProviderInput = {
    create?: XOR<productCreateWithoutProviderInput, productUncheckedCreateWithoutProviderInput> | productCreateWithoutProviderInput[] | productUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: productCreateOrConnectWithoutProviderInput | productCreateOrConnectWithoutProviderInput[]
    createMany?: productCreateManyProviderInputEnvelope
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
  }

  export type productUpdateManyWithoutProviderNestedInput = {
    create?: XOR<productCreateWithoutProviderInput, productUncheckedCreateWithoutProviderInput> | productCreateWithoutProviderInput[] | productUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: productCreateOrConnectWithoutProviderInput | productCreateOrConnectWithoutProviderInput[]
    upsert?: productUpsertWithWhereUniqueWithoutProviderInput | productUpsertWithWhereUniqueWithoutProviderInput[]
    createMany?: productCreateManyProviderInputEnvelope
    set?: productWhereUniqueInput | productWhereUniqueInput[]
    disconnect?: productWhereUniqueInput | productWhereUniqueInput[]
    delete?: productWhereUniqueInput | productWhereUniqueInput[]
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
    update?: productUpdateWithWhereUniqueWithoutProviderInput | productUpdateWithWhereUniqueWithoutProviderInput[]
    updateMany?: productUpdateManyWithWhereWithoutProviderInput | productUpdateManyWithWhereWithoutProviderInput[]
    deleteMany?: productScalarWhereInput | productScalarWhereInput[]
  }

  export type productUncheckedUpdateManyWithoutProviderNestedInput = {
    create?: XOR<productCreateWithoutProviderInput, productUncheckedCreateWithoutProviderInput> | productCreateWithoutProviderInput[] | productUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: productCreateOrConnectWithoutProviderInput | productCreateOrConnectWithoutProviderInput[]
    upsert?: productUpsertWithWhereUniqueWithoutProviderInput | productUpsertWithWhereUniqueWithoutProviderInput[]
    createMany?: productCreateManyProviderInputEnvelope
    set?: productWhereUniqueInput | productWhereUniqueInput[]
    disconnect?: productWhereUniqueInput | productWhereUniqueInput[]
    delete?: productWhereUniqueInput | productWhereUniqueInput[]
    connect?: productWhereUniqueInput | productWhereUniqueInput[]
    update?: productUpdateWithWhereUniqueWithoutProviderInput | productUpdateWithWhereUniqueWithoutProviderInput[]
    updateMany?: productUpdateManyWithWhereWithoutProviderInput | productUpdateManyWithWhereWithoutProviderInput[]
    deleteMany?: productScalarWhereInput | productScalarWhereInput[]
  }

  export type invoiceCreateNestedOneWithoutSaleInput = {
    create?: XOR<invoiceCreateWithoutSaleInput, invoiceUncheckedCreateWithoutSaleInput>
    connectOrCreate?: invoiceCreateOrConnectWithoutSaleInput
    connect?: invoiceWhereUniqueInput
  }

  export type customerCreateNestedOneWithoutSaleInput = {
    create?: XOR<customerCreateWithoutSaleInput, customerUncheckedCreateWithoutSaleInput>
    connectOrCreate?: customerCreateOrConnectWithoutSaleInput
    connect?: customerWhereUniqueInput
  }

  export type userCreateNestedOneWithoutSaleInput = {
    create?: XOR<userCreateWithoutSaleInput, userUncheckedCreateWithoutSaleInput>
    connectOrCreate?: userCreateOrConnectWithoutSaleInput
    connect?: userWhereUniqueInput
  }

  export type saleitemCreateNestedManyWithoutSaleInput = {
    create?: XOR<saleitemCreateWithoutSaleInput, saleitemUncheckedCreateWithoutSaleInput> | saleitemCreateWithoutSaleInput[] | saleitemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: saleitemCreateOrConnectWithoutSaleInput | saleitemCreateOrConnectWithoutSaleInput[]
    createMany?: saleitemCreateManySaleInputEnvelope
    connect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
  }

  export type invoiceUncheckedCreateNestedOneWithoutSaleInput = {
    create?: XOR<invoiceCreateWithoutSaleInput, invoiceUncheckedCreateWithoutSaleInput>
    connectOrCreate?: invoiceCreateOrConnectWithoutSaleInput
    connect?: invoiceWhereUniqueInput
  }

  export type saleitemUncheckedCreateNestedManyWithoutSaleInput = {
    create?: XOR<saleitemCreateWithoutSaleInput, saleitemUncheckedCreateWithoutSaleInput> | saleitemCreateWithoutSaleInput[] | saleitemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: saleitemCreateOrConnectWithoutSaleInput | saleitemCreateOrConnectWithoutSaleInput[]
    createMany?: saleitemCreateManySaleInputEnvelope
    connect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
  }

  export type Enumsale_paymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.sale_paymentMethod
  }

  export type Enumsale_statusFieldUpdateOperationsInput = {
    set?: $Enums.sale_status
  }

  export type invoiceUpdateOneWithoutSaleNestedInput = {
    create?: XOR<invoiceCreateWithoutSaleInput, invoiceUncheckedCreateWithoutSaleInput>
    connectOrCreate?: invoiceCreateOrConnectWithoutSaleInput
    upsert?: invoiceUpsertWithoutSaleInput
    disconnect?: invoiceWhereInput | boolean
    delete?: invoiceWhereInput | boolean
    connect?: invoiceWhereUniqueInput
    update?: XOR<XOR<invoiceUpdateToOneWithWhereWithoutSaleInput, invoiceUpdateWithoutSaleInput>, invoiceUncheckedUpdateWithoutSaleInput>
  }

  export type customerUpdateOneRequiredWithoutSaleNestedInput = {
    create?: XOR<customerCreateWithoutSaleInput, customerUncheckedCreateWithoutSaleInput>
    connectOrCreate?: customerCreateOrConnectWithoutSaleInput
    upsert?: customerUpsertWithoutSaleInput
    connect?: customerWhereUniqueInput
    update?: XOR<XOR<customerUpdateToOneWithWhereWithoutSaleInput, customerUpdateWithoutSaleInput>, customerUncheckedUpdateWithoutSaleInput>
  }

  export type userUpdateOneRequiredWithoutSaleNestedInput = {
    create?: XOR<userCreateWithoutSaleInput, userUncheckedCreateWithoutSaleInput>
    connectOrCreate?: userCreateOrConnectWithoutSaleInput
    upsert?: userUpsertWithoutSaleInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutSaleInput, userUpdateWithoutSaleInput>, userUncheckedUpdateWithoutSaleInput>
  }

  export type saleitemUpdateManyWithoutSaleNestedInput = {
    create?: XOR<saleitemCreateWithoutSaleInput, saleitemUncheckedCreateWithoutSaleInput> | saleitemCreateWithoutSaleInput[] | saleitemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: saleitemCreateOrConnectWithoutSaleInput | saleitemCreateOrConnectWithoutSaleInput[]
    upsert?: saleitemUpsertWithWhereUniqueWithoutSaleInput | saleitemUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: saleitemCreateManySaleInputEnvelope
    set?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    disconnect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    delete?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    connect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    update?: saleitemUpdateWithWhereUniqueWithoutSaleInput | saleitemUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: saleitemUpdateManyWithWhereWithoutSaleInput | saleitemUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: saleitemScalarWhereInput | saleitemScalarWhereInput[]
  }

  export type invoiceUncheckedUpdateOneWithoutSaleNestedInput = {
    create?: XOR<invoiceCreateWithoutSaleInput, invoiceUncheckedCreateWithoutSaleInput>
    connectOrCreate?: invoiceCreateOrConnectWithoutSaleInput
    upsert?: invoiceUpsertWithoutSaleInput
    disconnect?: invoiceWhereInput | boolean
    delete?: invoiceWhereInput | boolean
    connect?: invoiceWhereUniqueInput
    update?: XOR<XOR<invoiceUpdateToOneWithWhereWithoutSaleInput, invoiceUpdateWithoutSaleInput>, invoiceUncheckedUpdateWithoutSaleInput>
  }

  export type saleitemUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: XOR<saleitemCreateWithoutSaleInput, saleitemUncheckedCreateWithoutSaleInput> | saleitemCreateWithoutSaleInput[] | saleitemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: saleitemCreateOrConnectWithoutSaleInput | saleitemCreateOrConnectWithoutSaleInput[]
    upsert?: saleitemUpsertWithWhereUniqueWithoutSaleInput | saleitemUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: saleitemCreateManySaleInputEnvelope
    set?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    disconnect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    delete?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    connect?: saleitemWhereUniqueInput | saleitemWhereUniqueInput[]
    update?: saleitemUpdateWithWhereUniqueWithoutSaleInput | saleitemUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: saleitemUpdateManyWithWhereWithoutSaleInput | saleitemUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: saleitemScalarWhereInput | saleitemScalarWhereInput[]
  }

  export type productCreateNestedOneWithoutSaleitemInput = {
    create?: XOR<productCreateWithoutSaleitemInput, productUncheckedCreateWithoutSaleitemInput>
    connectOrCreate?: productCreateOrConnectWithoutSaleitemInput
    connect?: productWhereUniqueInput
  }

  export type saleCreateNestedOneWithoutSaleitemInput = {
    create?: XOR<saleCreateWithoutSaleitemInput, saleUncheckedCreateWithoutSaleitemInput>
    connectOrCreate?: saleCreateOrConnectWithoutSaleitemInput
    connect?: saleWhereUniqueInput
  }

  export type productUpdateOneRequiredWithoutSaleitemNestedInput = {
    create?: XOR<productCreateWithoutSaleitemInput, productUncheckedCreateWithoutSaleitemInput>
    connectOrCreate?: productCreateOrConnectWithoutSaleitemInput
    upsert?: productUpsertWithoutSaleitemInput
    connect?: productWhereUniqueInput
    update?: XOR<XOR<productUpdateToOneWithWhereWithoutSaleitemInput, productUpdateWithoutSaleitemInput>, productUncheckedUpdateWithoutSaleitemInput>
  }

  export type saleUpdateOneRequiredWithoutSaleitemNestedInput = {
    create?: XOR<saleCreateWithoutSaleitemInput, saleUncheckedCreateWithoutSaleitemInput>
    connectOrCreate?: saleCreateOrConnectWithoutSaleitemInput
    upsert?: saleUpsertWithoutSaleitemInput
    connect?: saleWhereUniqueInput
    update?: XOR<XOR<saleUpdateToOneWithWhereWithoutSaleitemInput, saleUpdateWithoutSaleitemInput>, saleUncheckedUpdateWithoutSaleitemInput>
  }

  export type saleCreateNestedManyWithoutUserInput = {
    create?: XOR<saleCreateWithoutUserInput, saleUncheckedCreateWithoutUserInput> | saleCreateWithoutUserInput[] | saleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: saleCreateOrConnectWithoutUserInput | saleCreateOrConnectWithoutUserInput[]
    createMany?: saleCreateManyUserInputEnvelope
    connect?: saleWhereUniqueInput | saleWhereUniqueInput[]
  }

  export type saleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<saleCreateWithoutUserInput, saleUncheckedCreateWithoutUserInput> | saleCreateWithoutUserInput[] | saleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: saleCreateOrConnectWithoutUserInput | saleCreateOrConnectWithoutUserInput[]
    createMany?: saleCreateManyUserInputEnvelope
    connect?: saleWhereUniqueInput | saleWhereUniqueInput[]
  }

  export type Enumuser_roleFieldUpdateOperationsInput = {
    set?: $Enums.user_role
  }

  export type saleUpdateManyWithoutUserNestedInput = {
    create?: XOR<saleCreateWithoutUserInput, saleUncheckedCreateWithoutUserInput> | saleCreateWithoutUserInput[] | saleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: saleCreateOrConnectWithoutUserInput | saleCreateOrConnectWithoutUserInput[]
    upsert?: saleUpsertWithWhereUniqueWithoutUserInput | saleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: saleCreateManyUserInputEnvelope
    set?: saleWhereUniqueInput | saleWhereUniqueInput[]
    disconnect?: saleWhereUniqueInput | saleWhereUniqueInput[]
    delete?: saleWhereUniqueInput | saleWhereUniqueInput[]
    connect?: saleWhereUniqueInput | saleWhereUniqueInput[]
    update?: saleUpdateWithWhereUniqueWithoutUserInput | saleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: saleUpdateManyWithWhereWithoutUserInput | saleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: saleScalarWhereInput | saleScalarWhereInput[]
  }

  export type saleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<saleCreateWithoutUserInput, saleUncheckedCreateWithoutUserInput> | saleCreateWithoutUserInput[] | saleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: saleCreateOrConnectWithoutUserInput | saleCreateOrConnectWithoutUserInput[]
    upsert?: saleUpsertWithWhereUniqueWithoutUserInput | saleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: saleCreateManyUserInputEnvelope
    set?: saleWhereUniqueInput | saleWhereUniqueInput[]
    disconnect?: saleWhereUniqueInput | saleWhereUniqueInput[]
    delete?: saleWhereUniqueInput | saleWhereUniqueInput[]
    connect?: saleWhereUniqueInput | saleWhereUniqueInput[]
    update?: saleUpdateWithWhereUniqueWithoutUserInput | saleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: saleUpdateManyWithWhereWithoutUserInput | saleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: saleScalarWhereInput | saleScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnuminvoice_invoiceStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.invoice_invoiceStatus | Enuminvoice_invoiceStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.invoice_invoiceStatus[] | null
    notIn?: $Enums.invoice_invoiceStatus[] | null
    not?: NestedEnuminvoice_invoiceStatusNullableFilter<$PrismaModel> | $Enums.invoice_invoiceStatus | null
  }

  export type NestedEnuminvoice_invoiceStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.invoice_invoiceStatus | Enuminvoice_invoiceStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.invoice_invoiceStatus[] | null
    notIn?: $Enums.invoice_invoiceStatus[] | null
    not?: NestedEnuminvoice_invoiceStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.invoice_invoiceStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnuminvoice_invoiceStatusNullableFilter<$PrismaModel>
    _max?: NestedEnuminvoice_invoiceStatusNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumsale_paymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.sale_paymentMethod | Enumsale_paymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.sale_paymentMethod[]
    notIn?: $Enums.sale_paymentMethod[]
    not?: NestedEnumsale_paymentMethodFilter<$PrismaModel> | $Enums.sale_paymentMethod
  }

  export type NestedEnumsale_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.sale_status | Enumsale_statusFieldRefInput<$PrismaModel>
    in?: $Enums.sale_status[]
    notIn?: $Enums.sale_status[]
    not?: NestedEnumsale_statusFilter<$PrismaModel> | $Enums.sale_status
  }

  export type NestedEnumsale_paymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sale_paymentMethod | Enumsale_paymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.sale_paymentMethod[]
    notIn?: $Enums.sale_paymentMethod[]
    not?: NestedEnumsale_paymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.sale_paymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsale_paymentMethodFilter<$PrismaModel>
    _max?: NestedEnumsale_paymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumsale_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.sale_status | Enumsale_statusFieldRefInput<$PrismaModel>
    in?: $Enums.sale_status[]
    notIn?: $Enums.sale_status[]
    not?: NestedEnumsale_statusWithAggregatesFilter<$PrismaModel> | $Enums.sale_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumsale_statusFilter<$PrismaModel>
    _max?: NestedEnumsale_statusFilter<$PrismaModel>
  }

  export type NestedEnumuser_roleFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[]
    notIn?: $Enums.user_role[]
    not?: NestedEnumuser_roleFilter<$PrismaModel> | $Enums.user_role
  }

  export type NestedEnumuser_roleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.user_role | Enumuser_roleFieldRefInput<$PrismaModel>
    in?: $Enums.user_role[]
    notIn?: $Enums.user_role[]
    not?: NestedEnumuser_roleWithAggregatesFilter<$PrismaModel> | $Enums.user_role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumuser_roleFilter<$PrismaModel>
    _max?: NestedEnumuser_roleFilter<$PrismaModel>
  }

  export type productCreateWithoutCategoryInput = {
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    createdAt?: Date | string
    updatedAt: Date | string
    provider: providerCreateNestedOneWithoutProductInput
    saleitem?: saleitemCreateNestedManyWithoutProductInput
  }

  export type productUncheckedCreateWithoutCategoryInput = {
    id?: number
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    providerId: number
    createdAt?: Date | string
    updatedAt: Date | string
    saleitem?: saleitemUncheckedCreateNestedManyWithoutProductInput
  }

  export type productCreateOrConnectWithoutCategoryInput = {
    where: productWhereUniqueInput
    create: XOR<productCreateWithoutCategoryInput, productUncheckedCreateWithoutCategoryInput>
  }

  export type productCreateManyCategoryInputEnvelope = {
    data: productCreateManyCategoryInput | productCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type productUpsertWithWhereUniqueWithoutCategoryInput = {
    where: productWhereUniqueInput
    update: XOR<productUpdateWithoutCategoryInput, productUncheckedUpdateWithoutCategoryInput>
    create: XOR<productCreateWithoutCategoryInput, productUncheckedCreateWithoutCategoryInput>
  }

  export type productUpdateWithWhereUniqueWithoutCategoryInput = {
    where: productWhereUniqueInput
    data: XOR<productUpdateWithoutCategoryInput, productUncheckedUpdateWithoutCategoryInput>
  }

  export type productUpdateManyWithWhereWithoutCategoryInput = {
    where: productScalarWhereInput
    data: XOR<productUpdateManyMutationInput, productUncheckedUpdateManyWithoutCategoryInput>
  }

  export type productScalarWhereInput = {
    AND?: productScalarWhereInput | productScalarWhereInput[]
    OR?: productScalarWhereInput[]
    NOT?: productScalarWhereInput | productScalarWhereInput[]
    id?: IntFilter<"product"> | number
    name?: StringFilter<"product"> | string
    description?: StringNullableFilter<"product"> | string | null
    purchasePrice?: FloatFilter<"product"> | number
    sellingPrice?: FloatFilter<"product"> | number
    stock?: IntFilter<"product"> | number
    minStock?: IntFilter<"product"> | number
    categoryId?: IntFilter<"product"> | number
    providerId?: IntFilter<"product"> | number
    createdAt?: DateTimeFilter<"product"> | Date | string
    updatedAt?: DateTimeFilter<"product"> | Date | string
  }

  export type saleCreateWithoutCustomerInput = {
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    invoice?: invoiceCreateNestedOneWithoutSaleInput
    user: userCreateNestedOneWithoutSaleInput
    saleitem?: saleitemCreateNestedManyWithoutSaleInput
  }

  export type saleUncheckedCreateWithoutCustomerInput = {
    id?: number
    userId: number
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    invoice?: invoiceUncheckedCreateNestedOneWithoutSaleInput
    saleitem?: saleitemUncheckedCreateNestedManyWithoutSaleInput
  }

  export type saleCreateOrConnectWithoutCustomerInput = {
    where: saleWhereUniqueInput
    create: XOR<saleCreateWithoutCustomerInput, saleUncheckedCreateWithoutCustomerInput>
  }

  export type saleCreateManyCustomerInputEnvelope = {
    data: saleCreateManyCustomerInput | saleCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type saleUpsertWithWhereUniqueWithoutCustomerInput = {
    where: saleWhereUniqueInput
    update: XOR<saleUpdateWithoutCustomerInput, saleUncheckedUpdateWithoutCustomerInput>
    create: XOR<saleCreateWithoutCustomerInput, saleUncheckedCreateWithoutCustomerInput>
  }

  export type saleUpdateWithWhereUniqueWithoutCustomerInput = {
    where: saleWhereUniqueInput
    data: XOR<saleUpdateWithoutCustomerInput, saleUncheckedUpdateWithoutCustomerInput>
  }

  export type saleUpdateManyWithWhereWithoutCustomerInput = {
    where: saleScalarWhereInput
    data: XOR<saleUpdateManyMutationInput, saleUncheckedUpdateManyWithoutCustomerInput>
  }

  export type saleScalarWhereInput = {
    AND?: saleScalarWhereInput | saleScalarWhereInput[]
    OR?: saleScalarWhereInput[]
    NOT?: saleScalarWhereInput | saleScalarWhereInput[]
    id?: IntFilter<"sale"> | number
    customerId?: IntFilter<"sale"> | number
    userId?: IntFilter<"sale"> | number
    saleDate?: DateTimeFilter<"sale"> | Date | string
    totalAmount?: FloatFilter<"sale"> | number
    paymentMethod?: Enumsale_paymentMethodFilter<"sale"> | $Enums.sale_paymentMethod
    status?: Enumsale_statusFilter<"sale"> | $Enums.sale_status
    createdAt?: DateTimeFilter<"sale"> | Date | string
    updatedAt?: DateTimeFilter<"sale"> | Date | string
  }

  export type saleCreateWithoutInvoiceInput = {
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    customer: customerCreateNestedOneWithoutSaleInput
    user: userCreateNestedOneWithoutSaleInput
    saleitem?: saleitemCreateNestedManyWithoutSaleInput
  }

  export type saleUncheckedCreateWithoutInvoiceInput = {
    id?: number
    customerId: number
    userId: number
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    saleitem?: saleitemUncheckedCreateNestedManyWithoutSaleInput
  }

  export type saleCreateOrConnectWithoutInvoiceInput = {
    where: saleWhereUniqueInput
    create: XOR<saleCreateWithoutInvoiceInput, saleUncheckedCreateWithoutInvoiceInput>
  }

  export type saleUpsertWithoutInvoiceInput = {
    update: XOR<saleUpdateWithoutInvoiceInput, saleUncheckedUpdateWithoutInvoiceInput>
    create: XOR<saleCreateWithoutInvoiceInput, saleUncheckedCreateWithoutInvoiceInput>
    where?: saleWhereInput
  }

  export type saleUpdateToOneWithWhereWithoutInvoiceInput = {
    where?: saleWhereInput
    data: XOR<saleUpdateWithoutInvoiceInput, saleUncheckedUpdateWithoutInvoiceInput>
  }

  export type saleUpdateWithoutInvoiceInput = {
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: customerUpdateOneRequiredWithoutSaleNestedInput
    user?: userUpdateOneRequiredWithoutSaleNestedInput
    saleitem?: saleitemUpdateManyWithoutSaleNestedInput
  }

  export type saleUncheckedUpdateWithoutInvoiceInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleitem?: saleitemUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type categoryCreateWithoutProductInput = {
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type categoryUncheckedCreateWithoutProductInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type categoryCreateOrConnectWithoutProductInput = {
    where: categoryWhereUniqueInput
    create: XOR<categoryCreateWithoutProductInput, categoryUncheckedCreateWithoutProductInput>
  }

  export type providerCreateWithoutProductInput = {
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type providerUncheckedCreateWithoutProductInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type providerCreateOrConnectWithoutProductInput = {
    where: providerWhereUniqueInput
    create: XOR<providerCreateWithoutProductInput, providerUncheckedCreateWithoutProductInput>
  }

  export type saleitemCreateWithoutProductInput = {
    quantity: number
    unitPrice: number
    subtotal: number
    sale: saleCreateNestedOneWithoutSaleitemInput
  }

  export type saleitemUncheckedCreateWithoutProductInput = {
    id?: number
    saleId: number
    quantity: number
    unitPrice: number
    subtotal: number
  }

  export type saleitemCreateOrConnectWithoutProductInput = {
    where: saleitemWhereUniqueInput
    create: XOR<saleitemCreateWithoutProductInput, saleitemUncheckedCreateWithoutProductInput>
  }

  export type saleitemCreateManyProductInputEnvelope = {
    data: saleitemCreateManyProductInput | saleitemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type categoryUpsertWithoutProductInput = {
    update: XOR<categoryUpdateWithoutProductInput, categoryUncheckedUpdateWithoutProductInput>
    create: XOR<categoryCreateWithoutProductInput, categoryUncheckedCreateWithoutProductInput>
    where?: categoryWhereInput
  }

  export type categoryUpdateToOneWithWhereWithoutProductInput = {
    where?: categoryWhereInput
    data: XOR<categoryUpdateWithoutProductInput, categoryUncheckedUpdateWithoutProductInput>
  }

  export type categoryUpdateWithoutProductInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type categoryUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type providerUpsertWithoutProductInput = {
    update: XOR<providerUpdateWithoutProductInput, providerUncheckedUpdateWithoutProductInput>
    create: XOR<providerCreateWithoutProductInput, providerUncheckedCreateWithoutProductInput>
    where?: providerWhereInput
  }

  export type providerUpdateToOneWithWhereWithoutProductInput = {
    where?: providerWhereInput
    data: XOR<providerUpdateWithoutProductInput, providerUncheckedUpdateWithoutProductInput>
  }

  export type providerUpdateWithoutProductInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type providerUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleitemUpsertWithWhereUniqueWithoutProductInput = {
    where: saleitemWhereUniqueInput
    update: XOR<saleitemUpdateWithoutProductInput, saleitemUncheckedUpdateWithoutProductInput>
    create: XOR<saleitemCreateWithoutProductInput, saleitemUncheckedCreateWithoutProductInput>
  }

  export type saleitemUpdateWithWhereUniqueWithoutProductInput = {
    where: saleitemWhereUniqueInput
    data: XOR<saleitemUpdateWithoutProductInput, saleitemUncheckedUpdateWithoutProductInput>
  }

  export type saleitemUpdateManyWithWhereWithoutProductInput = {
    where: saleitemScalarWhereInput
    data: XOR<saleitemUpdateManyMutationInput, saleitemUncheckedUpdateManyWithoutProductInput>
  }

  export type saleitemScalarWhereInput = {
    AND?: saleitemScalarWhereInput | saleitemScalarWhereInput[]
    OR?: saleitemScalarWhereInput[]
    NOT?: saleitemScalarWhereInput | saleitemScalarWhereInput[]
    id?: IntFilter<"saleitem"> | number
    saleId?: IntFilter<"saleitem"> | number
    productId?: IntFilter<"saleitem"> | number
    quantity?: IntFilter<"saleitem"> | number
    unitPrice?: FloatFilter<"saleitem"> | number
    subtotal?: FloatFilter<"saleitem"> | number
  }

  export type productCreateWithoutProviderInput = {
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    createdAt?: Date | string
    updatedAt: Date | string
    category: categoryCreateNestedOneWithoutProductInput
    saleitem?: saleitemCreateNestedManyWithoutProductInput
  }

  export type productUncheckedCreateWithoutProviderInput = {
    id?: number
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    categoryId: number
    createdAt?: Date | string
    updatedAt: Date | string
    saleitem?: saleitemUncheckedCreateNestedManyWithoutProductInput
  }

  export type productCreateOrConnectWithoutProviderInput = {
    where: productWhereUniqueInput
    create: XOR<productCreateWithoutProviderInput, productUncheckedCreateWithoutProviderInput>
  }

  export type productCreateManyProviderInputEnvelope = {
    data: productCreateManyProviderInput | productCreateManyProviderInput[]
    skipDuplicates?: boolean
  }

  export type productUpsertWithWhereUniqueWithoutProviderInput = {
    where: productWhereUniqueInput
    update: XOR<productUpdateWithoutProviderInput, productUncheckedUpdateWithoutProviderInput>
    create: XOR<productCreateWithoutProviderInput, productUncheckedCreateWithoutProviderInput>
  }

  export type productUpdateWithWhereUniqueWithoutProviderInput = {
    where: productWhereUniqueInput
    data: XOR<productUpdateWithoutProviderInput, productUncheckedUpdateWithoutProviderInput>
  }

  export type productUpdateManyWithWhereWithoutProviderInput = {
    where: productScalarWhereInput
    data: XOR<productUpdateManyMutationInput, productUncheckedUpdateManyWithoutProviderInput>
  }

  export type invoiceCreateWithoutSaleInput = {
    number: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt: Date | string
    invoiceStatus?: $Enums.invoice_invoiceStatus | null
  }

  export type invoiceUncheckedCreateWithoutSaleInput = {
    id?: number
    number: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt: Date | string
    invoiceStatus?: $Enums.invoice_invoiceStatus | null
  }

  export type invoiceCreateOrConnectWithoutSaleInput = {
    where: invoiceWhereUniqueInput
    create: XOR<invoiceCreateWithoutSaleInput, invoiceUncheckedCreateWithoutSaleInput>
  }

  export type customerCreateWithoutSaleInput = {
    name: string
    cedula?: string | null
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type customerUncheckedCreateWithoutSaleInput = {
    id?: number
    name: string
    cedula?: string | null
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type customerCreateOrConnectWithoutSaleInput = {
    where: customerWhereUniqueInput
    create: XOR<customerCreateWithoutSaleInput, customerUncheckedCreateWithoutSaleInput>
  }

  export type userCreateWithoutSaleInput = {
    name: string
    email: string
    password: string
    role?: $Enums.user_role
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type userUncheckedCreateWithoutSaleInput = {
    id?: number
    name: string
    email: string
    password: string
    role?: $Enums.user_role
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type userCreateOrConnectWithoutSaleInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutSaleInput, userUncheckedCreateWithoutSaleInput>
  }

  export type saleitemCreateWithoutSaleInput = {
    quantity: number
    unitPrice: number
    subtotal: number
    product: productCreateNestedOneWithoutSaleitemInput
  }

  export type saleitemUncheckedCreateWithoutSaleInput = {
    id?: number
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
  }

  export type saleitemCreateOrConnectWithoutSaleInput = {
    where: saleitemWhereUniqueInput
    create: XOR<saleitemCreateWithoutSaleInput, saleitemUncheckedCreateWithoutSaleInput>
  }

  export type saleitemCreateManySaleInputEnvelope = {
    data: saleitemCreateManySaleInput | saleitemCreateManySaleInput[]
    skipDuplicates?: boolean
  }

  export type invoiceUpsertWithoutSaleInput = {
    update: XOR<invoiceUpdateWithoutSaleInput, invoiceUncheckedUpdateWithoutSaleInput>
    create: XOR<invoiceCreateWithoutSaleInput, invoiceUncheckedCreateWithoutSaleInput>
    where?: invoiceWhereInput
  }

  export type invoiceUpdateToOneWithWhereWithoutSaleInput = {
    where?: invoiceWhereInput
    data: XOR<invoiceUpdateWithoutSaleInput, invoiceUncheckedUpdateWithoutSaleInput>
  }

  export type invoiceUpdateWithoutSaleInput = {
    number?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceStatus?: NullableEnuminvoice_invoiceStatusFieldUpdateOperationsInput | $Enums.invoice_invoiceStatus | null
  }

  export type invoiceUncheckedUpdateWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    number?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceStatus?: NullableEnuminvoice_invoiceStatusFieldUpdateOperationsInput | $Enums.invoice_invoiceStatus | null
  }

  export type customerUpsertWithoutSaleInput = {
    update: XOR<customerUpdateWithoutSaleInput, customerUncheckedUpdateWithoutSaleInput>
    create: XOR<customerCreateWithoutSaleInput, customerUncheckedCreateWithoutSaleInput>
    where?: customerWhereInput
  }

  export type customerUpdateToOneWithWhereWithoutSaleInput = {
    where?: customerWhereInput
    data: XOR<customerUpdateWithoutSaleInput, customerUncheckedUpdateWithoutSaleInput>
  }

  export type customerUpdateWithoutSaleInput = {
    name?: StringFieldUpdateOperationsInput | string
    cedula?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type customerUncheckedUpdateWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    cedula?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUpsertWithoutSaleInput = {
    update: XOR<userUpdateWithoutSaleInput, userUncheckedUpdateWithoutSaleInput>
    create: XOR<userCreateWithoutSaleInput, userUncheckedCreateWithoutSaleInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutSaleInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutSaleInput, userUncheckedUpdateWithoutSaleInput>
  }

  export type userUpdateWithoutSaleInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUncheckedUpdateWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: Enumuser_roleFieldUpdateOperationsInput | $Enums.user_role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleitemUpsertWithWhereUniqueWithoutSaleInput = {
    where: saleitemWhereUniqueInput
    update: XOR<saleitemUpdateWithoutSaleInput, saleitemUncheckedUpdateWithoutSaleInput>
    create: XOR<saleitemCreateWithoutSaleInput, saleitemUncheckedCreateWithoutSaleInput>
  }

  export type saleitemUpdateWithWhereUniqueWithoutSaleInput = {
    where: saleitemWhereUniqueInput
    data: XOR<saleitemUpdateWithoutSaleInput, saleitemUncheckedUpdateWithoutSaleInput>
  }

  export type saleitemUpdateManyWithWhereWithoutSaleInput = {
    where: saleitemScalarWhereInput
    data: XOR<saleitemUpdateManyMutationInput, saleitemUncheckedUpdateManyWithoutSaleInput>
  }

  export type productCreateWithoutSaleitemInput = {
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    createdAt?: Date | string
    updatedAt: Date | string
    category: categoryCreateNestedOneWithoutProductInput
    provider: providerCreateNestedOneWithoutProductInput
  }

  export type productUncheckedCreateWithoutSaleitemInput = {
    id?: number
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    categoryId: number
    providerId: number
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type productCreateOrConnectWithoutSaleitemInput = {
    where: productWhereUniqueInput
    create: XOR<productCreateWithoutSaleitemInput, productUncheckedCreateWithoutSaleitemInput>
  }

  export type saleCreateWithoutSaleitemInput = {
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    invoice?: invoiceCreateNestedOneWithoutSaleInput
    customer: customerCreateNestedOneWithoutSaleInput
    user: userCreateNestedOneWithoutSaleInput
  }

  export type saleUncheckedCreateWithoutSaleitemInput = {
    id?: number
    customerId: number
    userId: number
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    invoice?: invoiceUncheckedCreateNestedOneWithoutSaleInput
  }

  export type saleCreateOrConnectWithoutSaleitemInput = {
    where: saleWhereUniqueInput
    create: XOR<saleCreateWithoutSaleitemInput, saleUncheckedCreateWithoutSaleitemInput>
  }

  export type productUpsertWithoutSaleitemInput = {
    update: XOR<productUpdateWithoutSaleitemInput, productUncheckedUpdateWithoutSaleitemInput>
    create: XOR<productCreateWithoutSaleitemInput, productUncheckedCreateWithoutSaleitemInput>
    where?: productWhereInput
  }

  export type productUpdateToOneWithWhereWithoutSaleitemInput = {
    where?: productWhereInput
    data: XOR<productUpdateWithoutSaleitemInput, productUncheckedUpdateWithoutSaleitemInput>
  }

  export type productUpdateWithoutSaleitemInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: categoryUpdateOneRequiredWithoutProductNestedInput
    provider?: providerUpdateOneRequiredWithoutProductNestedInput
  }

  export type productUncheckedUpdateWithoutSaleitemInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    providerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleUpsertWithoutSaleitemInput = {
    update: XOR<saleUpdateWithoutSaleitemInput, saleUncheckedUpdateWithoutSaleitemInput>
    create: XOR<saleCreateWithoutSaleitemInput, saleUncheckedCreateWithoutSaleitemInput>
    where?: saleWhereInput
  }

  export type saleUpdateToOneWithWhereWithoutSaleitemInput = {
    where?: saleWhereInput
    data: XOR<saleUpdateWithoutSaleitemInput, saleUncheckedUpdateWithoutSaleitemInput>
  }

  export type saleUpdateWithoutSaleitemInput = {
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: invoiceUpdateOneWithoutSaleNestedInput
    customer?: customerUpdateOneRequiredWithoutSaleNestedInput
    user?: userUpdateOneRequiredWithoutSaleNestedInput
  }

  export type saleUncheckedUpdateWithoutSaleitemInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: invoiceUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type saleCreateWithoutUserInput = {
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    invoice?: invoiceCreateNestedOneWithoutSaleInput
    customer: customerCreateNestedOneWithoutSaleInput
    saleitem?: saleitemCreateNestedManyWithoutSaleInput
  }

  export type saleUncheckedCreateWithoutUserInput = {
    id?: number
    customerId: number
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
    invoice?: invoiceUncheckedCreateNestedOneWithoutSaleInput
    saleitem?: saleitemUncheckedCreateNestedManyWithoutSaleInput
  }

  export type saleCreateOrConnectWithoutUserInput = {
    where: saleWhereUniqueInput
    create: XOR<saleCreateWithoutUserInput, saleUncheckedCreateWithoutUserInput>
  }

  export type saleCreateManyUserInputEnvelope = {
    data: saleCreateManyUserInput | saleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type saleUpsertWithWhereUniqueWithoutUserInput = {
    where: saleWhereUniqueInput
    update: XOR<saleUpdateWithoutUserInput, saleUncheckedUpdateWithoutUserInput>
    create: XOR<saleCreateWithoutUserInput, saleUncheckedCreateWithoutUserInput>
  }

  export type saleUpdateWithWhereUniqueWithoutUserInput = {
    where: saleWhereUniqueInput
    data: XOR<saleUpdateWithoutUserInput, saleUncheckedUpdateWithoutUserInput>
  }

  export type saleUpdateManyWithWhereWithoutUserInput = {
    where: saleScalarWhereInput
    data: XOR<saleUpdateManyMutationInput, saleUncheckedUpdateManyWithoutUserInput>
  }

  export type productCreateManyCategoryInput = {
    id?: number
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    providerId: number
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type productUpdateWithoutCategoryInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    provider?: providerUpdateOneRequiredWithoutProductNestedInput
    saleitem?: saleitemUpdateManyWithoutProductNestedInput
  }

  export type productUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    providerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleitem?: saleitemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type productUncheckedUpdateManyWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    providerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleCreateManyCustomerInput = {
    id?: number
    userId: number
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type saleUpdateWithoutCustomerInput = {
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: invoiceUpdateOneWithoutSaleNestedInput
    user?: userUpdateOneRequiredWithoutSaleNestedInput
    saleitem?: saleitemUpdateManyWithoutSaleNestedInput
  }

  export type saleUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: invoiceUncheckedUpdateOneWithoutSaleNestedInput
    saleitem?: saleitemUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type saleUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleitemCreateManyProductInput = {
    id?: number
    saleId: number
    quantity: number
    unitPrice: number
    subtotal: number
  }

  export type saleitemUpdateWithoutProductInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    sale?: saleUpdateOneRequiredWithoutSaleitemNestedInput
  }

  export type saleitemUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type saleitemUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    saleId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type productCreateManyProviderInput = {
    id?: number
    name: string
    description?: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minStock: number
    categoryId: number
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type productUpdateWithoutProviderInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: categoryUpdateOneRequiredWithoutProductNestedInput
    saleitem?: saleitemUpdateManyWithoutProductNestedInput
  }

  export type productUncheckedUpdateWithoutProviderInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    saleitem?: saleitemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type productUncheckedUpdateManyWithoutProviderInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    purchasePrice?: FloatFieldUpdateOperationsInput | number
    sellingPrice?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    minStock?: IntFieldUpdateOperationsInput | number
    categoryId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type saleitemCreateManySaleInput = {
    id?: number
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
  }

  export type saleitemUpdateWithoutSaleInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
    product?: productUpdateOneRequiredWithoutSaleitemNestedInput
  }

  export type saleitemUncheckedUpdateWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type saleitemUncheckedUpdateManyWithoutSaleInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    subtotal?: FloatFieldUpdateOperationsInput | number
  }

  export type saleCreateManyUserInput = {
    id?: number
    customerId: number
    saleDate?: Date | string
    totalAmount: number
    paymentMethod: $Enums.sale_paymentMethod
    status?: $Enums.sale_status
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type saleUpdateWithoutUserInput = {
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: invoiceUpdateOneWithoutSaleNestedInput
    customer?: customerUpdateOneRequiredWithoutSaleNestedInput
    saleitem?: saleitemUpdateManyWithoutSaleNestedInput
  }

  export type saleUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: invoiceUncheckedUpdateOneWithoutSaleNestedInput
    saleitem?: saleitemUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type saleUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAmount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: Enumsale_paymentMethodFieldUpdateOperationsInput | $Enums.sale_paymentMethod
    status?: Enumsale_statusFieldUpdateOperationsInput | $Enums.sale_status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
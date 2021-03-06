# C4C Backend Scaffold

Scaffold for a backend server built with NestJS and Postgres.

## TL;DR

**Read this entire readme**, especially if you are going to be working on this repository or any repository that inherits it.

But for a true TL;DR:

- Copy `example.env` to `.env`
- Set up a local Postgres database and add its credentials to `.env`
- Run migrations to update your database schema
  - First, build the server (`npm run build`)
  - Then, run migrations: `npm run typeorm migration:run`
- Run the server with `npm run start:dev`
- View docs auto-generated by Swagger at `localhost:3000/api`
- Strict testing requirements (upwards of 80% coverage)
  - Run tests: `npm run test`
- See test coverage: `npm run test:cov`
- Run e2e tests: `npm run test:e2e`
- Uses bearer auth, token is a simple JWT
- Uses TypeORM and Postgres
- You should understand dependency injection, especially in the context of NestJS  


## .env and Setup

`.env` is a file commonly used to specify environment variables in Node.js. It usually contains API keys, database credentials, and other potentially sensitive information. This scaffold provides an `example.env` file that shows an example of what your `.env` file looks like.

In the app, we can use `dotenv.config()` to load `.env` variables into `process.env`.

## Intro to NestJS

NestJS is the framework used to build this server. It's a strongly opinionated, TypeScript-first framework for building web applications. Its core architecture is inspired by Angular, so design patterns like modular design and dependency injection are essential to understanding NestJS.

In this docs, you'll learn the important fundamentals of the NestJS architecture and understand all the moving parts of this scaffold.

### Modules

A NestJS application is composed of modules. Technically it only needs one -- a root module -- but we generally create at least one module for each resource (users, reports, etc.). A module is the core structural unit of a NestJS application, but by itself has very little function or use other than for dependency injection (which we'll get to soon).

#### Controllers

Most modules have a **controller**. A controller is what directly handles requests to the server, like GET or POST requests. It can also define metadata, guards, and other constraints for each route for security and documentation purposes. For example, we might see a route definition like this:

```
@Post() @ApiOperation({
description: 'Creates a new User.', })
async createUser(@Body() body: CreateUserDto): Promise<User> {
return this.usersService.create(body.email, body.role, body.password); }
```

There's lots going on here, but the first thing you'll notice is all the `@` symbols. These indicate **decorators**. Decorators are extra data applied to methods or classes that give Nest additional info about the route. For example, the `@Post()` decorator tells Nest that this is a post route. The `@ApiOperation` decorator is for documentation purposes (using Swagger/OpenAPI).

The method that follows all the decorators is a handler for the route. It will be executed when the route is called, and **the result of the function will be returned as JSON**. In this case, the function returns a `Promise<User>`, so this route will respond with a `User` object as JSON.

Inside the method body, you'll see a reference to something called `usersService`. This brings us to the other essential component of a NestJS module: services.

#### Services

Services are used to define logic. For example, they might interact with a database or expose utility methods for hashing passwords. Most modules contain one or more services.

Like controllers, services are just normal TypeScript classes. For example, we might define a `UsersService` that exposes a `create` method that adds a user to the database. As seen above, we can then call this service method from the controller. This improves separation of concerns: **controllers define routes, services define logic.**

This begs the question of how controllers and services are connected to each other. How does the `UsersController` call methods in the `UsersService`? You might think that the controller can just import the service like this:

```
import UsersService from './users.service.ts';
```

Not in NestJS. Instead, we use a pattern called **dependency injection**.

### Dependency injection

Dependency injection (DI) is by far the most complex and unintuitive topic covered in these docs. But if you want to attain a deep understanding and mastery of NestJS, you'll need to understand it.

But first, it's always important to understand the motivation.

#### Motivation for dependency injection

Testing is tedious and often challenging. One thing that makes testing so difficult is that testing a class with dependencies can have unwanted side effects.

For example, let's return to the `UsersController`. When testing the `createUser` handler, all we really need to test -- for the purposes of unit testing the controller -- is that it calls the right service method (`UsersService.create`). But we can't actually call this method since it would modify the database. What we need to do is provide a **mock implementation** that behaves in a similar way (in terms of input parameters and response), but has no side effects.

This is difficult to do with the `import` syntax. Once we import `UsersController`, the controller is already dependent on an existing `UsersService` that the Node.js runtime has created.

Instead, we need to be able to create a mock dependency with similar behavior as the `UsersService`, and then **inject** this mock dependency into `UsersController`: thus, **dependency injection**.

#### How dependency injection works

Remember that `UsersController` is just a normal class. When we called the `UsersService.create()` method, you may have noticed something interesting:

```
return this.usersService.create(body.email, body.role, body.password);
```

This gives away the key to dependency injection: rather than using `import`, we use the class constructor to inject dependencies. Thus, the constructor for `UsersController` might look something like this:

```
constructor(private usersService: UsersService) {}
```

By leaving the constructor's body empty, TypeScript automatically sets the class's state to the values provided in the constructor's parameters. Thus, in the body of the class, we can now reference `this.usersService`, as we do in the handler method.

When running the app, the Nest runtime will automatically inject dependencies as needed. For example, if it comes across this constructor, it will create a new `UsersService` (or use an existing one) and pass it into the constructor, thus allowing the controller to access the service.

When testing, we can just instantiate a new `UsersController` with our own mock implementation of `UsersService`. This makes testing a breeze -- more on that later.

#### Putting it all together

A common gotcha of dependency injection lies in the modular organization of a Nest application. Recall that services and controllers belong to modules; thus, intuitively, the _module_ should be in control of what dependencies can and can't be injected. This is indeed the case, and is the main function of modules.

### The @Module decorator

Modules in NestJS must be decorated with `@Module`. This decorator takes an object as a parameter that specifies four things: imports, providers, controllers, and exports.

**imports** are other modules that this module will need access to. For example, we may want to inject another module's service into this module's service.

**providers** are anything (usually classes, i.e., services) that this module can provide for injection. For example, providers will always contain our module's service(s), if it has any, so that the controller (or other modules) can depend on the service.

**controllers** are controllers for the module. At runtime, Nest gathers all the controllers in the app and maps their routes so that any requests to the server can be properly handled.

**exports** are providers that will be exported. When other modules import this module, they will be able to access any providers in this list of exports.

### Building a module

Now that you understand the fundamentals, we'll walk through building a module with a controller and service to put it all together.

#### Creating a module

Most modules will be a child of the root module (called `AppModule`). To create a new module called `Books`, run `nest g module books`. This will create a new folder in the src/ directory with a `books.module.ts` file inside that looks like this:

```
@Module({
  imports: [],
  providers: [],
  controllers: [],
}) export class BooksModule {}
```

**This is always the first step when we want to create a new controller or service**.

#### Creating a service

Now that we have a module, we can create one (or more) services that the module's controller can use. To create a service called `BooksService`, run `nest g service books`. Because you're not specifying the name of the service -- technically `books` in this command is referring to the `/books` directory/module, not to the name of the service -- Nest will assume that you want to name the service the same as the module, so it will create the file `/books/books.service.ts` (and a `.spec` file for tests). This file will look like this:

```
@Injectable() export class BooksService {}
```

But this command did more than just create this file. Because it created a service inside of the `books` folder, it also automatically added this service to the `BooksModule` for us. So, if you return to the `books.module.ts` file, you'll see this:

```
@Module({
  imports: [],
  providers: [BooksService],
  controllers: [],
}) export class BooksModule {}
```

Now, any controllers we add to this module will be able to use `BooksService`.

#### Creating a controller

We're ready to create the `BooksController`. As you might have expected, the command for this is `nest g controller books`. Like with creating the service, the Nest CLI will not only create `books/books.controller.ts` (and testing file) for us but also add the controller to the module. Thus, our module will now look like this:

```
@Module({
  imports: [],
  providers: [BooksService],
  controllers: [BooksController],
}) export class BooksModule {}
```

Let's now open our new controller, which should look like this:

```
@Controller('books') export class BooksController {}
```

As you see, the `@Controller` decorator takes a string as an argument. This string is the route prefix for the controller -- so, all routes defined in this controller will be prefixed with `books/`.

We can now inject the `BooksService` by adding a constructor with it as a parameter:

```
@Controller('books') export class BooksController {
 constructor(private booksService: BooksService) {}}
```

When you run the app with `npm run start` (or `npm run start:dev` for reload-on-save), Nest will inject the `BooksService` into the controller. Thus, we can use any methods defined in the `BooksService` in the controller.

#### Exports

Let's say we wanted to use the `BooksService` in another module's service. For example, our `UsersService` will need to call a method in `BooksService`. Here's how we accomplish this.

First, we need to export the `BooksService` from `BooksModule`:

```
@Module({
  imports: [],
  providers: [BooksService],
  controllers: [BooksController],
 exports: [BooksService],}) export class BooksModule {}
```

Next -- **the step that people always forget** -- we need to import the `BooksModule` into `UsersModule` so that we can use its providers:

```
@Module({
  imports: [BooksModule],
  providers: [UsersService],
  controllers: [UsersController]
}) export class UsersModule {}
```

Finally, we can inject the `BooksService` into the `UsersService`:

```
@Injectable() export class BooksService {
 constructor(private booksService: BooksService) {}}
```

This is it for the fundamentals of Nest. There's plenty else to know, and the [NestJS docs](https://docs.nestjs.com/) are a fantastic resource for learning more about the framework.

## Auth

Authentication and authorization are essential parts of this scaffold. Understanding them is crucial to understanding any C4C backend and will deepen your understanding of TypeScript and NestJS.

### High-level overview

1. User is created.
2. User signs in with email and password credentials. If password and hashed password match, we sign an encrypted JSON web token that stores the user ID in its payload, and return this token as part of the login response.
3. User (really the front-end client) stores this token locally, and sends it in the authorization header with every request in this format: `Bearer ${token}`.
4. When the server receives a request, authentication middleware checks if the request presents authentication credentials (the aforementioned bearer token). If it does, it decrypts it, and fetches the user associated with the request.
5. Depending on the route, there may or may not be a guard present that restricts the route to users with certain roles. If this guard is present, it allows the route to be activated only if the `req.user` object has the required roles.
6. The route handler's parameters can use the `@ReqUser()` decorator to access the user making the request, if necessary.

### Utils

The Utils module contains all the utility services for the app; thus, this module has no controllers and does not correspond to any resource. When we need to add some utility functionality to the app, we can create a new service in `UtilsModule` and export it. Then, from other modules, we can import the service and use it as a provider.

For example, the `JwtService` provides a layer of abstraction over the npm `jsonwebtoken` package. We can then import the `UtilModule` into `AuthModule` and inject `JwtService` into `AuthService`. This allows the auth service to sign and verify JWTs.

### Middleware

Middleware is just a function that runs at some point in the request-response cycle; that is, it runs between when the request is received and the response is returned to the client. Specifically, it runs before the route handler, which is crucial for the purposes of authorization. Read more [here](https://expressjs.com/en/guide/using-middleware.html) (NestJS uses Express under the hood).

Here's our `auth/middleware/authentication-middleware.service.ts`:

```
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next();
    const token = authHeader.split(' ')[1]; // get part of string after space
    if (!token) return next();
    try {
      const user = await this.authService.verifyJwt(token);
      req.user = user;
    } catch (e) {
      return next();
    }
    next();
} }
```

Middleware in NestJS is usually a class that implements the `NestMiddleware` interface. It thus must expose a method called `use` that actually runs the middleware. This method has access to the request and response objects, as well as `next`, which is a function that calls the next middleware function. It's essentially a "continue" button for when the middleware is done.

The authentication middleware has only one job: identify the user if the request presents credentials. So, we first check for an authorization header, and then we check that its format is correct. If so, we use a method in the `AuthService` to get the user associated with the JWT. (We can inject `AuthService` here because the the middleware is used in `AppModule`, and `AuthService` is exported from `AuthModule` which is imported in `AppModule`.)

Finally, we set `req.user` equal to the user. The `req` object is accessible throughout the request, including in route guards, which will come in handy in a bit.

If at any point the verification of credentials fails -- whether because they weren't provided or they were malformed or invalid -- we simply call `next()`, which means that `req.user` will remain undefined.

Even if authentication succeeds, we must still call `next()` to proceed to the route handler; otherwise, the request will hang.

### Guards

The next step in this process is the route handler. Let's imagine that this is all part of a request to `/auth/me`, which is a protected route that just returns the user making the request. Here's the route as defined in `auth/auth.controller.ts` (ignore the `@Api...` decorators for now):

```
@Get('me') @Auth(Roles.ADMIN, Roles.RESEARCHER) @ApiOperation(...) @ApiAcceptedResponse(...)
me(@ReqUser() user: User): User {
return user; }
```

`@Get('me')` indicates that this route handler will be called when a `GET` request to `auth/me` is made.

The next decorator, `@Auth`, is where all the authorization magic happens. This is a custom decorator that, among other things, applies the `RolesGuard` to the route, ensuring that only users with the given roles (in this case ADMIN and RESEARCHER) can actually access the route. If the user is unauthenticated or does not have the right role, the guard should fail, and NestJS will return a `403 Forbidden` for us.

Here's what the roles guard (`auth/guards/roles.guard.ts`) looks like:

```
export const RolesGuard = (roles: Roles[]): any => {
  class RoleGuardMixin implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const req = context
        .switchToHttp()
        .getRequest<PossiblyAuthorizedRequest>();
      if (!req.user) return false;
      return roles.includes(req.user.role);
    }
  }

  const guard = mixin(RoleGuardMixin);
return guard; };
```

This is a bad first example for a guard; most guards are much simpler because they don't take arguments. However, this guard needs to know what user roles to accept and which to reject, so we must return a function that accepts `roles` and returns a guard.

The `RoleGuardMixin` class is the heart of the guard. It implements `CanActivate` and thus must expose `canActivate`, which is just a method that returns a boolean: `true` if the request is accepted, and `false` if it is rejected (which will automatically respond with `403 Forbidden`).

Inside the guard, all we need to do is get the `req.user` object. To do this, we first get the request object (`context.switchToHttp().getRequest()`). We type it as `PossiblyAuthorizedRequest`, which is just an intersection type between the normal `Request` type and a `user` property, which may or may not be defined.

If the user is not defined we return false. Otherwise, we return true if the user's role is one of the acceptable roles.

### Getting the user in the route handler

In many cases, we'll want to know in the route handler who is making the request. To do this, the scaffold defines a custom `@ReqUser` decorator to pull the `req.user` object like this:

```
me(@ReqUser() user: User): User {
return user; }
```

## TypeORM

TypeORM is the ORM (object-relational mapping) library that we use to interact with the Postgres database. At a high level, there are three essential components at play:

1. **Entities** represent types of data, i.e., tables. In the scaffold, there's a `user.entity.ts`, which contains the type definition for a `User` as well as metadata relevant to Postgres.
2. **Repositories** are providers that are injected into services that allow us to actually interact with the database.
3. **Migrations** are pieces of code that execute SQL queries to make sure that our database structure is up to date.

### Entities

An entity represents a type of data that we store in our database. For example, in the scaffold, we have the file `users/types.user.entity.ts` that contains the definition for the User entity. This file serves not only as a TypeScript definition but also a table definition (thanks to decorators). Here's what the User entity looks like:

```
@Entity() export class User {
  @PrimaryGeneratedColumn()
 id: number;
  @Column({
    unique: true,
  })
 email: string;
  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.ADMIN,
  })
 role: Roles;
  @Column()
 password: string; }
```

All the decorators that are not directly related to TypeORM have been stripped away for the purposes of demonstration.

The `@Entity` decorator marks the class as an entity. We must use a class rather than an interface to benefit from decorators.

If you strip away the decorators, you get a normal TypeScript definition for a User. The decorators designate columns (mainly for the purpose of automatically generating migrations, which we'll see soon). The decorators are mostly self explanatory; refer to [TypeORM's docs](https://typeorm.io/#/entities) for more information.

### Repositories

An Entity is just a type definition. To actually interact with the database, we'll need a provider that we can inject into our services. The @nestjs/typeorm package provides just that. To understand how this all works, we'll walk through how the `UsersService` can create and read users from the database.

The first step is to import `TypeOrmModule` into the `UsersModule` so that we can use its providers. To do this, we just add `TypeOrmModule.forFeature([User])` to our list of imports:

```
@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilModule],
  providers: [UsersService],
controllers: [UsersController], }) export class UsersModule {}
```

Now we can inject the repository provider into any of `UsersModule`'s providers. So, we can go to `UsersService` and add this injection:

```
constructor(
  @InjectRepository(User) private userRepository: Repository<User>,
  ...
) {}
```

We can now access the user repository with `this.userRepository`. We can use this repository to, for example, add entries to or read entries from the database. For example, to find a user by id:

```
const user = await this.userRepository.findOne({ id: 1 });
```

See [here](https://typeorm.io/#/repository-api) for more info.

### Migrations

Migrations are pieces of SQL code that we write to keep databases in sync. TypeORM can automatically generate migrations for us based on changes that we've made to our entity definitions.

Note that all entities **must be listed in `ormconfig.ts` to have their migrations automatically generated**. They must be imported and listed under the `entities` property. Other than this, do not touch `ormconfig.ts`.

After you make changes to entities, run `npm run typeorm migration:generate -- -n [name]`. Names are technically optional and a good naming convention is not obvious because a migration may contain changes to multiple entities. However, you should name any migrations you create; come up with short but descriptive names for the changes that you made to any entities.

Migrations are just files in the `/migrations` folder. To actually effect changes to the database schema, you'll need to run these migrations. However, **they first must be built** as the source migration files are TypeScript files. Thus, after generating migrations (or cloning a fresh repo), you should run `npm run build` before running any migrations.

You can run migrations with this command: `npm run typeorm migration:run`.

If you need to revert a migration that you ran: `npm run typeorm migration:revert`.

## Testing

Dependency injection makes testing a lot easier in NestJS than many other Node.js projects. The principle of it is this: when we test a service or controller, we really only need to test that its public methods correctly call its dependencies and return the correct results. We do not want to test its dependencies because a) they should already be tested elsewhere and b) they could have unwanted side effects, like modifying a database or sending an email.

To test a controller or service, we create a mock implementation of all its dependencies with simplified behavior, and test that the class interacts with its mock dependencies how we would expect.

We'll look at a simple example in a bit. First, a quick note about good testing practices.

### Test coverage

Because NestJS makes testing relatively easy, and because tests greatly improve product quality, all projects that inherit this scaffold should have **complete** test coverage. Projects which inherit this scaffold may enforce any level of test coverage as defined in `package.json` and measured by `npm run test:cov`, but we recommend meeting 100% coverage.

We recommend that any project that inherits this scaffold meets the following testing requirements:

1. **All services and controllers in the project should be unit tested**. This means that all their dependencies are mocked and every _public_ method is fully tested (i.e. every branch and statement in that method is tested). Note that not all providers are services; for example, files ending in `.wrapper.ts` or `.factory.ts` are providers but not services.
2. **All controllers should be e2e tested**. This means that every route should be tested for every possible response as defined by the API spec. For example, if a route can return a 403 error, this case should be tested.

### Unit testing

All services and controllers should be unit tested. Again, we only need to test the behavior of the controller or service itself, not its dependencies. Thus, at a high level, we need to first mock all of its dependencies and then test each of its public methods. We'll use the `UsersService` as an example for demonstration.

When we create a service with `nest g service`, Nest also creates a `.spec.ts` file for testing. When first created it looks something like this:

```
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

  service = module.get<UsersService>(UsersService);
}); });
```

All it's doing is compiling a simple testing module before each test. However, if we run these tests, it will fail to compile because the dependencies of `UsersService` are not satisfied. Remember that any providers that `UsersService` requests must be listed as providers in the module. Thus, we must provide (mock) two things: a `Repository<User>` and a `BcryptService`.

The goal of creating mock services is to create the simplest possible implementation that allows us to test the behavior of the `UsersService`. We'll begin with the `BcryptService`. The `UsersService` only calls `bcryptService.hash()`, so we only need to mock that function. We'll define an object that satisfies the type `Partial<BcryptService>`:

```
const mockBcrypt: Partial<BcryptService> = {
  hash(raw: string): string {
    return `HASHED${raw}`;
}, };
```

This implementation obviously does not hash the given string, but it's sufficient because we just need to know that the password provided to `create()` is hashed.

Now that we've defined this mock implementation, we need to inject it as a provider. Though `providers` seems like an array of classes, this is just a shorthand for an array of objects:

```
providers: [
 { provide: UsersService, useClass: UsersService, }]
```

For testing purposes, we can provide a concrete value rather than a class with `useValue`. Thus, we can provide our mock implementation of `BcryptService` like this:

```
const module: TestingModule = await Test.createTestingModule({
  providers: [
    UsersService,
    {
      provide: BcryptService,
      useValue: mockBcrypt,
    },
 ], }).compile();
```

Mocking the repository is slightly difference. Just like `BcryptService`, we can define an object that partially satisfies `Repository<User>`:

```
const mockUserRepository: Partial<Repository<User>> = {
  create(user?: DeepPartial<User> | DeepPartial<User>[]): any {
    return {
      id: 1,
      ...user,
    };
 }};
```

But injecting this mock implementation is not as straightforward. This is because repositories are not injected by class name; they're injected by a token. (This is why we need to use the `@InjectRepository()` decorator to inject the repository in our service.) Thus, to provide a repository, we do this:

```
{
 provide: getRepositoryToken(User), useValue: mockUserRepository,}
```

Now that all of the dependencies of `UsersService` are mocked and provided, the testing module should compile. Testing now is a matter of using Jest and covering every branch and statement of every public method.

### Testing utils

Util services will often depend on external libraries like bcrypt or aws-sdk. When testing these services, we don't want to make any external requests or cause any other side effects (this is true outside of utils too, but every library should be wrapped with a util service anyway -- you should never have _Javascript_ dependencies on external libraries within services).

Remember that services contain business logic. Practically by definition, this means that services are 100% testable. Their code should not directly depend on any external libraries; those should be wrapped by `.wrapper.ts` files. Wrapper files are completely _untestable_ as they should represent a 1:1, direct interface with some package dependency or API. When we test the services that depend on this wrapper, we'll mock the wrapper.

`.wrapper.ts` files are ignored for the purposes of calculating test coverage since they are untestable.

### E2E Testing

Unit tests are helpful for ensuring the accuracy of individual services and controllers, but once we combine lots of moving parts we can make oversights that may not be caught by unit tests. End-to-end (e2e) tests test entire request-response cycles to ensure that the application works when everything is put together.

To show how it works, we'll walk through e2e testing for the `AuthController`.

With e2e testing, we're not trying to isolate the `AuthController` and thus do not necessarily need to mock its dependencies. However, we _do_ want to prevent any actual changes to the database; thus, we must at least mock the user repository.

Ideally, this mocked repository would behave exactly like a real database but without any side effects. We can simulate this behavior by creating a class that maintains a list of entries in its state. That's exactly what `test/db/MockRepository.ts` is. `MockRepository<T>` is a (partial) mock of `Repository<T>`. It already includes basic functionality like `create()`, `save()`, and `findOne()`, but other methods should be added as necessary.

Thus, in our e2e tests, we can initialize a mock user repository like this:

```
const UserRepository = new MockRepository<User>();
```

To actually initialize and compile a testing module, we could follow the same steps as in our unit tests. However, since we only have to override one provider, it's easier to create a module that simply imports the `AuthModule` and override the user repository provider like this:

```
const moduleFixture: TestingModule = await Test.createTestingModule({
imports: [AuthModule], })
  .overrideProvider(getRepositoryToken(User))
  .useValue(UserRepository)
  .compile();
```

Now we can test using the Supertest library.

#### Mocking Middleware in E2E Tests

One more note. When testing protected routes, like `GET /auth/me`, you'll find it impossible to authenticate (you'll always receive `403 Forbidden`). This is because the authentication middleware is applied in the root `AppModule`, not in `AuthModule`. The simplest solution is to manually apply it to the compiled module.

The testing server is compiled like this:

```
app = moduleFixture.createNestApplication();
```

`app` is just a normal Express app (recall that NestJS is built on Express). Thus, we can apply middleware with `app.use()`. However, `app.use` takes a function and `AuthenticationMiddleware` is a class. No problem -- we can just instantiate `AuthenticationMiddleware` and pass `new AuthenticationMiddleware().use` into `app.use`. This is the right idea, but there's two problems.

First, `AuthenticationMiddleware`'s constructor takes an argument for `AuthService`. In other words, we must inject `AuthService` into `AuthenticationMiddleware`. You might think that we have to mock it, but fortunately, we don't. Instead, we can just get the `AuthService` from the compiled module:

```
const compiledAuthService = moduleFixture.get(AuthService);
```

Now, we can instantiate `AuthenticationMiddleware` with this `compiledAuthService`.

But there's one more problem. `AuthenticationMiddleware.use()` refers to `this` inside its method body because it's in an instantiated class. However, since we only use its `.use` method, thereby unbinding it from its class, we must re-bind it like this:

```
app.use(
  new AuthenticationMiddleware(compiledAuthService).use.bind({
    authService: compiledAuthService,
  }),
);
```

Now, we can test protected routes by first sending a POST request to `/auth` and storing the token, and then setting it in a request like this:

````
request(app.getHttpServer())
  .get('/auth/me') .set('Authorization', `Bearer ${token}`) ...```

## OpenAPI/Swagger
NestJS provides a package for generating documentation using Swagger. This uses decorators already in our controllers to generate an API spec, which greatly reduces the chance that our API spec is wrong and makes it much easier to maintain accurate API docs.

### Swagger
Swagger is a library that creates and runs a UI according to an OpenAPI spec. When you run `npm run start`, you can access this UI at `localhost:3000/api`. No other setup or commands are necessary.

### Decorators
The @nestjs/swagger package already uses some of our controller decorators like `@Get()`, `@Body()`, and `@Param()`. However, the NestJS decorators can't define everything. For example, they can't specify route descriptions, DTO properties, or response types. Thus, we'll have to do these on our own.

You should document all DTOs, and **you must do this manually**. To do this, use the `@ApiProperty` decorator for each property in a DTO.

Check [here](https://docs.nestjs.com/openapi/decorators) for a full reference of decorators you can use with Swagger.
````

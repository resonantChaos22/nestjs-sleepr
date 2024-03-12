# March 9 Notes

## Logger

- We are using `nestjs-pino` for logging and `pino-pretty` to make it look nice.
- Had to be added as `app.useLogger` and also imported in the module with `forRoot` to work

## Validation

- We can convert an incoming request into a type (if compatible) using the following syntax in Dto

```TS
  @IsDate()
  @Type(() => Date)
  endDate: Date;
```

## Passport

- For passport setup, we installed, `@nestjs/passport`, `@nestjs/jwt`, `passport`, `passport-local`, `passport-jwt`

## Env file changes

- It's not correct to have environment variables of all apps in one place, so we added `.env` files in each app and then refactored the `docker-compose.yaml` file to use those `.env` files to create environment variables.

```docker
    env_file:
      - ./apps/reservations/.env
```

- We also need to forego the use of abstract config module so that it's defined in each app.
- I am not deleting the directory for reference purposes.
- We dont specify the Config Module in the abstract database module from where the service has been imported. It will throw an error if nothing is done.
- But if we import the ConfigModule from nestjs in the module from which we are calling the database module then the dependency criteria will be met and everything will work.
- The `isGlobal` parameter makes it so that the config module will be imported by all the modules present inside the app (not all the apps)
- To use a service inside main.ts, we can get the service by `app.get(ConfigService)`. This is used here to get the port information

## Passport Local Strategy

## Docs
<https://docs.nestjs.com/recipes/passport>

### Flow

- Login request comes to controller.
- Intercepted by `LocalAuthGuard` in `auth.controller.ts`. LocalAuthGuard is basically `AuthGuard('local')`. Here, 'local' is the default name of the passport-local strategy.
- Then we call the inbuilt `validate` method of `LocalStrategy`. It extends `PassportStrategy(Strategy)`. Note that we can also pass in a string in `PassportStrategy`  which will be the strategy name. In this case, we will have to replace 'local' in the AuthGuard if we add a name here.
- The arguments in validate are the arguments that we expect from the body of the request. We dont specify this anywhere else. It's weird that there's no validation for this but to be fair, this is in the guard.
- In the `validate` method, we call `verifyUser` from UsersService. This returns the user object if verification logic is verified.
- After this the `LocalAuthGuard` attaches the `user` object to the req if verification is successful or throws an exception otherwise.
- We get the `user` object using `CurrentUser` decorator in the `login` function.
- We also pass in `@Res({passthrough: true}) response: Response`  to the login function so that we can set the cookie. `passthrough: true` is used to enable all the functions of response object.
- We create a jwt using the `jwtService` and the payload is the user id for now. Then we create an expiry timestamp based on the `JWT_EXPIRATION` environment variable and we add these in the Authentication cookie.
- Back in the controller we send back the user object

### Notes

- Use `bcryptjs` instead of `bcrypt` as it was breaking docker deployment. No explicit error was thrown. On researching, it seems that the `bcrypt` library was using linux libraries which are not available in the node docker image.
- Browser deletes the cookies automatically once the expiration date has been crossed. Till that time, it keeps on attaching the cookie with every request.
- We can convert any exception to any other exception using `try-catch` blocks. Do keep in mind that you use `await` or otherwise try catch block would not work as expected.
- For docker-compose it's working as expected as we are setting the environment variables irrespective of the .env file but if we are directly trying to run any app, you have to use a global .env file.

# March 12 Notes

## Jwt Strategy

- Pretty similar to Local Strategy
- The only difference is the super command

```TS
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
```

- `jwtFromRequest` parameter get the jwt from request, we can use headers here as well if we are passing in an authentication header.
- `secretOrKey` is used to parse the cookie to get the payload. `validate` is called after we get the respective payload.
- `cookie-parser` library is needed to parse cookies such that they are present in the request object.

## Talking between microservices

- Install @nestjs/microservices
- Other protocol could be used as well but we are using TCP as the transport layer

### How does it work?

- We added a listener to the TCP layer in Auth app.

```TS  
app.connectMicroservice({
  transport: Transport.TCP,
  options: {
    host: '0.0.0.0',
    port: configService.get<number>('TCP_PORT'),
  },
});

```

- Here we are listening from every host at the port TCP_PORT
- So if any app wants to communicate with Auth app, they will need to interact with TCP at port TCP_PORT.
- In the `auth.controller`, we added the following code to specify how other apps will interact and how.

```TS
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
```

- `@MessagePattern('authenticate')` is used to give a way for other apps to call the function by the name `authenticate`
- Changes were made to `jwt.strategy` so that it is able to handle TCP requests as well. Check the file out.
- `@Payload()` is used to signify `@MessagePattern()` payload/parameter. We attach user to this using the `JwtAuthGuard`

### How to interact with this from reservations from a common guard?

- Global JwtAuthGuard ->

```TS
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const jwt = (context.switchToHttp().getRequest() as Request).cookies
      ?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
      );
  }
}
```

- In the constructor, we inject the client proxy based on a keyword AUTH_SERVICE. This keyword is defined in the app using this guard. We will see later how it is defined later but basically it injects a clientproxy that can send requests to the Auth app with the message pattern 'authenticate' as is being sent here.
- We send the payload `{Authentication: jwt}` to the `authenticate` route on the Auth app. Here `res` is the `data.user` that was returned by the function.

### How to enable client proxy and allow the global jwtauthguard to function?

```TS
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
```

- We import this module here to make the client proxy with the tag `AUTH_SERVICE` available to the JWTAuthGuard.
- Basically it gives the tag AUTH_SERVICE to the client proxy which is interacting with the `host:port`. Here host is `auth` as that is the name of the service in the docker-compose.yaml file. This could be different depending on whether we are using docker-compose or not.

### CurrentUser

- We also made a common CurrentUser decorator which deals with UserDto instead of UserDocument and replaced the implementation everywhere.
- I think the guard automatically converts `ObjectId` to string if we specify the return type as such. Previously, we had to do `user._id.toHexString()` while creating the token payload but now that is not required.

### Issues faced

- There was a confusion between the local JwtAuthGuard in Auth app and the common JwtAuthGuard and I had imported the latter one due to which dependency issues occurred.
- I had added AuthModule in the list of Reservations app imports. It threw an error for config service as inside the reseervations app, the environment variables for AuthModule to work were not defined.

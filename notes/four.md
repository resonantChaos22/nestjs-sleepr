# March 14 Notes

## Payments

- payments code is pretty self-explanatory. Just read the stripe documentation.
- nested validation

```TS
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
```

- This validates all the Dtos inside the CardDto as well. `@Type(() => CardDto)` is required to parse the request object as a class for the sake of validation.

## Notifications

```TS
  @EventPattern('notify_email')
```

- This basically says that the function does not expect a return type. It just runs without expecting a response

## Deployment

### Changes in Dockerfile

- Change dockerfile so that it is more efficient and only copies the app directory and libs directory
- Due to this users model had to be defined in `libs/common`

### Package.json refactor

- Remove the app dependencies from root package.json and add them in a newly created app package.json to make it more efficient
- Add a command to install the package.json in the app in the Dockerfile

### Pushing images to artifact registry

- do `docker build -t reservations -f ./Dockerfile ../../` to build the Dockerfile with the name `reservations`
- tag it with the artifact registry url with production by `docker tag reservation <URL>/production`
- push it to artifact registry using `docker push <URL>/production`
